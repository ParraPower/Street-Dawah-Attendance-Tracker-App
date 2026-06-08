import { ImportUserRequestDto } from "../dtos/import-user-request.dto";
import { ImportUserResponseDto, ImportUsersBulkResponseDto } from "../dtos/import-user-response.dto";
import { isNotNullOrEmpty } from "app-framework";
import { IApiClientProvider } from "@attendance/infrastructure/api/provider";

export class ImportUserService {
  constructor(private readonly apiClientProvider: IApiClientProvider) {
  }

  async importUsers(users: ImportUserRequestDto[], authToken?: string): Promise<ImportUsersBulkResponseDto> {
    const createdUsers: ImportUserResponseDto[] = [];
    const omittedUsers: ImportUserResponseDto[] = [];
    const errors: string[] = [];

    console.log(`🔄 Starting user import for ${users.length} users using bulk endpoint`);

    try {
      // Filter users to include only those with required fields (email, username, password)
      const usersForBulkImport = users
        .filter(user => isNotNullOrEmpty(user.username))
        .map(user => ({
          //email: user.email,
          username: user.username!,
          //password: user.password,
          scopes: [], // Default empty scopes, can be customized as needed
        }));

      if (usersForBulkImport.length === 0) {
        console.warn(`⚠️  No valid users to import (missing email, username, or password)`);
        return {
          createdUsers: [],
          omittedUsers: users.map(u => ({
            success: false,
            //email: u.email,
            username: u.username,
            error: "Missing required fields: email, username, and password are required",
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
      if (response.data.createdUsers && Array.isArray(response.data.createdUsers)) {
        for (const createdUser of response.data.createdUsers) {
          const importedUser: ImportUserResponseDto = {
            success: true,
            //;userId: createdUser.id,
            //;email: createdUser.email,
            username: createdUser.username,
            name: createdUser.name,
            number: createdUser.number,
            whatsappLink: createdUser.whatsappLink,
            joinedDate: createdUser.joinedDate,
            reference: createdUser.reference,
            lastAttendance: createdUser.lastAttendance,
            lastAttendedBefore60Days: createdUser.lastAttendedBefore60Days,
            location: createdUser.location,
            regularLocation: createdUser.regularLocation,
            status: createdUser.status,
            outreachDate: createdUser.outreachDate,
            whoReachedOut: createdUser.whoReachedOut,
            socials: createdUser.socials,
            university: createdUser.university,
            outcome: createdUser.outcome,
          };
          createdUsers.push(importedUser);
          console.log(`✅ User created: ${createdUser.email} (ID: ${createdUser.id})`);
        }
      }

      // Map omitted users from the bulk response
      if (response.data.omittedUsers && Array.isArray(response.data.omittedUsers)) {
        for (const omittedUser of response.data.omittedUsers) {
          const importedUser: ImportUserResponseDto = {
            success: false,
            //email: omittedUser.email ?? "unknown",
            username: omittedUser.number ?? "unknown",
            name: omittedUser.name ?? "unknown",
            number: omittedUser.number ?? "unknown",

            whatsappLink: omittedUser.whatsappLink ?? "unknown",
            joinedDate: omittedUser.joinedDate ?? undefined,

            reference: omittedUser.reference ?? undefined,
            lastAttendance: omittedUser.lastAttendance ?? undefined,

            lastAttendedBefore60Days: omittedUser.lastAttendedBefore60Days ?? undefined,
            location: omittedUser.location ?? undefined,
            regularLocation: omittedUser.regularLocation ?? undefined,

            status: omittedUser.status ?? undefined,
            outreachDate: omittedUser.outreachDate ?? undefined,
            whoReachedOut: omittedUser.whoReachedOut ?? undefined,
            socials: omittedUser.socials ?? undefined,
            university: omittedUser.university ?? undefined,
            outcome: omittedUser.outcome ?? undefined,


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
          //email: user.email,
          //password: user.password,
          username: user.username,
          name: user.name,
          number: user.number,
          whatsappLink: user.whatsappLink,
          joinedDate: user.joinedDate,
          reference: user.reference,
          lastAttendance: user.lastAttendance,
          lastAttendedBefore60Days: user.lastAttendedBefore60Days,  
          location: user.location,
          regularLocation: user.regularLocation,
          status: user.status,
          outreachDate: user.outreachDate,  
          whoReachedOut: user.whoReachedOut,
          socials: user.socials,
          university: user.university,
          outcome: user.outcome,
          
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
