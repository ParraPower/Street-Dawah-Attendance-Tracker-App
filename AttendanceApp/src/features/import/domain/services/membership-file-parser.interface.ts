import { CreateMembershipDto } from "../../../memberships/application/dtos/create-membership.dto";

export interface IMembershipFileParser {
  parseFile(file: Express.Multer.File): Promise<CreateMembershipDto[]>;
}
