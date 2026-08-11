import { CreateSessionOccurrenceDto } from "./create-session-occurrence.dto";

export class CreateBulkSessionOccurrencesDto {
  occurrences!: CreateSessionOccurrenceDto[];
}
