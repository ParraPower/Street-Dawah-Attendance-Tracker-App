import { ISessionRepository } from "../../domain/repositories/isession-repository";
import { SessionDto } from "../dtos/session.dto";
import { mapper } from "../../../../infrastructure/mapping/mapper";
import { SessionEntity } from "../../domain/entities/session-entity";

export class GetSessionsUseCase {
  constructor(private readonly repo: ISessionRepository) {}
  async execute(): Promise<SessionDto[]> { return (await this.repo.findAll()).map((session) => mapper.map(session, SessionEntity, SessionDto)); }
}
