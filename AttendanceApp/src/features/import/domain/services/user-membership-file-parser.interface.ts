import { CreateUserMembershipDto } from "../../../user-memberships/application/dtos/create-user-membership.dto";

export interface IUserMembershipFileParser {
  parseFile(file: Express.Multer.File): Promise<CreateUserMembershipDto[]>;
}
