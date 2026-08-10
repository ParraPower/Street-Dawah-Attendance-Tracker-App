import { SessionDto } from "./session.dto";

export class CreateBulkSessionsResponseDto {
  createdSessions!: SessionDto[];
  omittedSessions!: SessionDto[];
}
