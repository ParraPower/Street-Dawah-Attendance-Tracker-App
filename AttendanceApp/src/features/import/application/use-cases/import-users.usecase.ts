//<project-root>/AttendanceApp/src/features/import/application/use-cases/import-users.usecase.ts

import { ImportUsersRequestDto, NormalizedImportUserRequestDto } from "../dtos/import-user-request.dto";
import { ImportUserResponseDto, ImportUsersBulkResponseDto } from "../dtos/import-user-response.dto";
import { IImportUserService } from "../../domain/services/import-user.service";
import { importUserSchema } from "../validators/import-user.schema";
import { ValidationError } from "app-framework";
import { CreateBulkUsersUseCase } from "@attendance/features/users/application/use-cases/create-bulk-users.usecase";
import { mapper } from "@attendance/infrastructure/mapping/mapper";
import { CreateUserDto } from "@attendance/features/users/application/dtos/create-user.dto";
import { UserService } from "@attendance/features/users/domain/services/user-service";

export class ImportUsersUseCase {
  constructor(private importUserService: IImportUserService, private readonly createBulkUsersUseCase: CreateBulkUsersUseCase, private readonly userService: UserService) {}

  async execute(requestDto: ImportUsersRequestDto): Promise<ImportUsersBulkResponseDto> {
    let validUsers: NormalizedImportUserRequestDto[] = [];
    const invalidUsers: ImportUserResponseDto[] = [];
    const validationErrors: string[] = [];

    console.log(`🔍 Validating ${requestDto.users.length} users`);

    // Validate each user
    for (let index = 0; index < requestDto.users.length; index++) {
      const user = requestDto.users[index];
      //console.log(`📋 Validating user at row ${index + 1}:`, user);
      const { error, value } = importUserSchema.validate(user, { convert: true });

      const normalizedNumber = user.number ? this.userService.normalizePhone(user.number) : undefined;
      const username = value.username || normalizedNumber || "unknown"; 

      if (error) {
        const errorDetails = error.details.map((d) => d.message).join(", ");
        const errorMessage = `Row ${index + 1}: ${errorDetails}`;
        validationErrors.push(errorMessage);

        invalidUsers.push({
          success: false,
          username: username,
          number: user.number,
          normalizedNumber: normalizedNumber,
          error: `Validation failed: ${errorDetails}`,
        });

        console.log(`❌ Validation failed for row ${index + 1}: ${errorDetails}`);
      } else {
        // Ensure username is set for downstream processing
        validUsers.push({...value, normalizedNumber: value.normalizedNumber, username: username});
      }
    }

    console.log(
     `✅ Validation complete: ${validUsers.length} valid, ${invalidUsers.length} invalid`
    );

    // If all users are invalid, return early with validation errors
    if (validUsers.length === 0) {
      return {
        createdUsers: [],
        omittedUsers: invalidUsers,
        errors: validationErrors.length > 0 ? validationErrors : undefined,
        summary: {
          total: requestDto.users.length,
          created: 0,
          omitted: invalidUsers.length,
          failed: validationErrors.length,
        },
      };
    }

    // Ensure no duplicate numbers within the incoming valid users
    const keys = validUsers.map((v) => String(v.normalizedNumber ?? v.number ?? "")).filter(k => k !== "");
    const keyCounts = keys.reduce((acc, k) => {
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const duplicateKeys = Object.keys(keyCounts).filter((k) => keyCounts[k] > 1);
    if (duplicateKeys.length > 0) {
      const duplicateUsers = validUsers.filter((v) => duplicateKeys.includes(String(v.normalizedNumber ?? v.number ?? "")));
      throw new ValidationError("Duplicate numbers in import payload", {
        duplicateNumbers: duplicateKeys,
        duplicateUsers,
      });
    }

    // Call the service to import valid users
    const result = await this.importUserService.importUsers(validUsers);

    // Assign authUserId from import results back to the validUsers so it can
    // be persisted when creating local user entities.
    if (result) {
      // Match by normalizedNumber, username or raw number for robustness
      const assignAuthId = (source: typeof result.createdUsers | typeof result.omittedUsers) => {
        for (const r of source || []) {
          const match = validUsers.find(
            (v) =>
              (v.normalizedNumber && r.normalizedNumber && v.normalizedNumber === r.normalizedNumber) ||
              (v.username && r.username && v.username === r.username) ||
              (v.number && r.number && v.number === r.number)
          );
          if (match && (r.authUserId)) {
            console.log(`🔗 Assigning authUserId ${r.authUserId} to user with number ${match.number} and username ${match.username}`);
            // assign as any to avoid strict DTO typing issues
            (match).authUserId = r.authUserId;
          }
        }
      };

      assignAuthId(result.createdUsers);
      assignAuthId(result.omittedUsers);
    }

    // Map ImportRowRequestDto to CreateUserDto for bulk user creation
    const createUserDtos: CreateUserDto[] = validUsers.map((importRow) =>
      mapper.map(importRow, NormalizedImportUserRequestDto, CreateUserDto)
    );

    // Insert successfully created users into users entity table before correlating results.
    const bulkCreateResult = await this.createBulkUsersUseCase.execute(createUserDtos);

    bulkCreateResult.createdUsers.forEach((createdUser) => {
      const importedUser = result.createdUsers.find((u) => u.number === createdUser.mobile);
      if (importedUser) {
        importedUser.id = createdUser.id;
      }
      const omiittedUser = result.omittedUsers.find((u) => u.number === createdUser.mobile);
      if (omiittedUser) {
        omiittedUser.error = `User with mobile ${createdUser.mobile} was created but also marked as omitted. This may indicate a duplicate entry.`;
        omiittedUser.id = createdUser.id;
      }
    });

    bulkCreateResult.omittedUsers.forEach((omittedUser) => {
      const importedUser = result.createdUsers.find((u) => u.number === omittedUser.mobile); 
      if (importedUser) {
        importedUser.error = `User with mobile ${omittedUser.mobile} was created but also marked as omitted. This may indicate a duplicate entry.`;
      } else {
        const omiittedUser = result.omittedUsers.find((u) => u.number === omittedUser.mobile); 

        if (omiittedUser) {
          omiittedUser.error = `User with mobile ${omittedUser.mobile} was marked as omitted. This may indicate a duplicate entry.`;
        }
      }
    });

    // Combine results: validation failures go to omittedUsers
    return {
      createdUsers: result.createdUsers,
      omittedUsers: [...invalidUsers, ...result.omittedUsers],
      errors: [
        ...(validationErrors || []),
        ...(result.errors || []),
      ],
      summary: {
        total: requestDto.users.length,
        created: result.summary?.created || 0,
        omitted: invalidUsers.length + (result.summary?.omitted || 0),
        failed: validationErrors.length + (result.summary?.failed || 0),
      },
    };
  }
}
