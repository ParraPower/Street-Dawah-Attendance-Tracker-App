import { CreateSessionDto } from "../dtos/create-session.dto";
import { CreateBulkSessionsResponseDto } from "../dtos/create-bulk-sessions-response.dto";
import { SessionDto } from "../dtos/session.dto";
import { CreateSessionUseCase } from "./create-session.use-case";

export class CreateBulkSessionsUseCase {
  constructor(private readonly createSession: CreateSessionUseCase) {}

  async execute(inputs: CreateSessionDto[]): Promise<CreateBulkSessionsResponseDto> {
    const createdSessions: SessionDto[] = [];
    const omittedSessions: SessionDto[] = [];
    for (const input of inputs) {
      try {
        createdSessions.push(await this.createSession.execute(input));
      } catch {
        // Imports are best-effort: invalid, duplicate, and overlapping rows are omitted.
      }
    }
    return { createdSessions, omittedSessions };
  }
}
