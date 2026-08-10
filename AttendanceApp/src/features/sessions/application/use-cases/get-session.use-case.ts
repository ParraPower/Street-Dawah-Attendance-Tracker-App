import { ISessionRepository } from "../../domain/repositories/isession-repository";
import { SessionDto } from "../dtos/session.dto";
import { mapper } from "../../../../infrastructure/mapping/mapper";
import { SessionEntity } from "../../domain/entities/session-entity";

export class GetSessionUseCase {
  constructor(private readonly repo: ISessionRepository) {}
  async execute(id: number): Promise<SessionDto | null> { const session = await this.repo.findById(id); return session ? mapper.map(session, SessionEntity, SessionDto) : null; }
}
