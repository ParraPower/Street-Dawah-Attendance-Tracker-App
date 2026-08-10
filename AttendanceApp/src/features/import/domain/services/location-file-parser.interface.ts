import { CreateLocationDto } from "../../../locations/application/dtos/create-location.dto";

export interface ILocationFileParser {
  parseFile(file: Express.Multer.File): Promise<CreateLocationDto[]>;
}