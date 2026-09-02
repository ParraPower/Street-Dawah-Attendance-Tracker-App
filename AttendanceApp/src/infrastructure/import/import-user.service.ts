import { ImportUserResponseDto, ImportUsersBulkResponseDto } from "@attendance/features/import/application/dtos";
import { IImportUserService } from "@attendance/features/import/domain/services/import-user.service";
import { IApiClientProvider } from "../api";
import { isNotNullOrEmpty } from "app-framework";
import { NormalizedImportUserRequestDto } from "@attendance/features/import/application/dtos/import-user-request.dto";

type createBulkUserResponseUserDto = {
  id: number;
  email: string;
  username: string;
  scopes: string[];
  createdAt: Date;
}

export class ImportUserService implements IImportUserService {
  constructor(private readonly apiClientProvider: IApiClientProvider) {
  }

  async importUsers(users: NormalizedImportUserRequestDto[], authToken?: string): Promise<ImportUsersBulkResponseDto> {
    const createdUsers: ImportUserResponseDto[] = [];
    const omittedUsers: ImportUserResponseDto[] = [];
    const errors: string[] = [];

    console.log(`🔄 Starting user import for ${users.length} users using bulk endpoint`);

    try {
      // Filter users to include only those with required fields (username)
      const usersForBulkImport = users
        .filter(user => isNotNullOrEmpty(user.username))
        .map(user => ({
          username: user.username,
          scopes: [], // Default empty scopes, can be customized as needed
        }));

      if (usersForBulkImport.length === 0) {
        console.warn(`⚠️  No valid users to import (missing username)`);
        return {
          createdUsers: [],
          omittedUsers: users.map(u => ({
            success: false,
            username: u.username || u.normalizedNumber,
            number: u.number,
            normalizedNumber: u.normalizedNumber,
            error: "Missing required fields: username is required",
          })),
          errors: ["No valid users provided for import"],
          summary: {
            total: users.length,
            created: 0,
            omitted: users.length,
            failed: 0,
          },
        };
      }

      console.log(`📤 Sending ${usersForBulkImport.length} users to bulk endpoint`);

      const headers: Record<string, string> = {};
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      const httpClient = this.apiClientProvider.getAuthClient();
      const response = await httpClient.post("/user/bulk", usersForBulkImport);

      // Map created users from the bulk response
      if (response.data.createdUsers && Array.isArray(response.data.createdUsers as createBulkUserResponseUserDto[])) {
        for (const createdUser of response.data.createdUsers) {
          const importedUser: ImportUserResponseDto = {
            success: true,
            authUserId: createdUser.id,
            username: createdUser.username,
            number: createdUser.username, // Assuming number is not available, using username as fallback
            normalizedNumber: createdUser.normalizedNumber,
            email: createdUser.email,
            scopes: createdUser.scopes,
            createdAt: createdUser.createdAt,
          };
          createdUsers.push(importedUser);
          console.log(`✅ User created: ${createdUser.email} (ID: ${createdUser.id})`);
        }
      }

      // Map omitted users from the bulk response
      if (response.data.omittedUsers && Array.isArray(response.data.omittedUsers)) {
        for (const omittedUser of response.data.omittedUsers as createBulkUserResponseUserDto[]) {
          const importedUser: ImportUserResponseDto = {
            success: false,
            email: omittedUser.email,
            username: omittedUser.username,
            number: omittedUser.username, // Assuming number is not available, using username as fallback
            authUserId: omittedUser.id,
            error: `User already exists or validation failed`,
          };
          omittedUsers.push(importedUser);
          console.log(`⏭️  User skipped: ${omittedUser.email}`);
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      const statusCode = error.response?.status;

      console.error(`❌ Bulk import failed: ${errorMessage} (Status: ${statusCode})`);

      // If bulk import fails, treat all users as errors
      errors.push(`Bulk import failed: ${errorMessage}`);
      for (const user of users) {
        omittedUsers.push({
          success: false,
          username: user.username || user.number || "unknown",
          number: user.number,
          error: `Bulk import failed: ${errorMessage}`,
        });
      }
    }

    const result: ImportUsersBulkResponseDto = {
      createdUsers,
      omittedUsers,
      errors: errors.length > 0 ? errors : undefined,
      summary: {
        total: users.length,
        created: createdUsers.length,
        omitted: omittedUsers.length,
        failed: errors.length,
      },
    };

    console.log(
      `📊 Import summary: Created=${result.summary?.created}, Omitted=${result.summary?.omitted}, Failed=${result.summary?.failed}`
    );

    return result;
  }
}
