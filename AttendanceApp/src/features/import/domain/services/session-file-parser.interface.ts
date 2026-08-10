import { CreateSessionDto } from "../../../sessions/application/dtos/create-session.dto";

export interface ISessionFileParser {
  parseFile(file: Express.Multer.File): Promise<CreateSessionDto[]>;
}
