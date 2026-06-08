import { ImportUserRequestDto, ImportUsersRequestDto } from "../dtos/import-user-request.dto";
import { ImportUserResponseDto, ImportUsersBulkResponseDto } from "../dtos/import-user-response.dto";
import { ImportUserService } from "../services/import-user.service";
import { importUserSchema } from "../validators/import-user.schema";

export class ImportUsersUseCase {
  constructor(private importUserService: ImportUserService) {}

  async execute(requestDto: ImportUsersRequestDto): Promise<ImportUsersBulkResponseDto> {
    const validUsers: ImportUserRequestDto[] = [];
    const invalidUsers: ImportUserResponseDto[] = [];
    const validationErrors: string[] = [];

    console.log(`🔍 Validating ${requestDto.users.length} users`);

    // Validate each user
    for (let index = 0; index < requestDto.users.length; index++) {
      const user = requestDto.users[index];
      console.log(`📋 Validating user at row ${index + 1}:`, user);
      const { error, value } = importUserSchema.validate(user, { convert: true });

      if (error) {
        const errorDetails = error.details.map((d) => d.message).join(", ");
        const errorMessage = `Row ${index + 1}: ${errorDetails}`;
        validationErrors.push(errorMessage);

        invalidUsers.push({
          success: false,
          username: user.number || "unknown",
          name: user.name || "unknown",
          number: user.number || "unknown",
          whatsappLink: user.whatsappLink || "unknown",
          joinedDate: user.joinedDate || undefined,
          reference: user.reference || undefined,
          lastAttendance: user.lastAttendance || undefined,
          lastAttendedBefore60Days: user.lastAttendedBefore60Days || undefined,
          location: user.location || undefined,
          regularLocation: user.regularLocation || undefined,
          status: user.status || undefined,
          outreachDate: user.outreachDate || undefined,
          whoReachedOut: user.whoReachedOut || undefined,
          socials: user.socials || undefined,
          university: user.university || undefined,
          outcome: user.outcome || undefined,
          error: errorDetails,
        });

        console.log(`❌ Validation failed for row ${index + 1}: ${errorDetails}`);
      } else {
        validUsers.push(value);
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
