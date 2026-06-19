import { ImportRowRequestDto, ImportUsersRequestDto, NormalizedImportUserRequestDto } from "../dtos/import-user-request.dto";
import { ImportUserResponseDto, ImportUsersBulkResponseDto } from "../dtos/import-user-response.dto";
import { IImportUserService } from "../../domain/services/import-user.service";
import { importUserSchema } from "../validators/import-user.schema";
import { CreateBulkUsersUseCase } from "@attendance/features/users/application/use-cases/create-bulk-users.usecase";
import { mapper } from "@attendance/infrastructure/mapping/mapper";
import { CreateUserDto } from "@attendance/features/users/application/dtos/create-user.dto";
import { UserService } from "@attendance/features/users/domain/services/user-service";

export class ImportUsersUseCase {
  constructor(private importUserService: IImportUserService, private readonly createBulkUsersUseCase: CreateBulkUsersUseCase, private readonly userService: UserService) {}

  async execute(requestDto: ImportUsersRequestDto): Promise<ImportUsersBulkResponseDto> {
    const validUsers: NormalizedImportUserRequestDto[] = [];
    const invalidUsers: ImportUserResponseDto[] = [];
    const validationErrors: string[] = [];

    console.log(`🔍 Validating ${requestDto.users.length} users`);

    // Validate each user
    for (let index = 0; index < requestDto.users.length; index++) {
      const user = requestDto.users[index];
      console.log(`📋 Validating user at row ${index + 1}:`, user);
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

    // Call the service to import valid users
    const result = await this.importUserService.importUsers(validUsers);

    // Map ImportRowRequestDto to CreateUserDto for bulk user creation
    const createUserDtos: CreateUserDto[] = validUsers.map((importRow) =>
      mapper.map(importRow, ImportRowRequestDto, CreateUserDto)
    );

    if (false) {
    // Insert successfully created users into users entity table and map omitted users with error messages
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
  }

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
