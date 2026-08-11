import { IDawahDayRepository } from "../../domain/repositories/idawah-day-repository";
import { AvailableDawahDayDto } from "../dtos/available-dawah-day.dto";

export class GetAvailableDawahDaysUseCase {
  constructor(private readonly repo: IDawahDayRepository) {}

  async execute(today = new Date()): Promise<AvailableDawahDayDto[]> {
    const currentDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const endDate = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 2, currentDate.getUTCDate()));
    const activeDays = await this.repo.findActive();
    const activeDaysByWeekday = new Map(activeDays.map((day) => [day.dayOfWeek, day]));
    const available: AvailableDawahDayDto[] = [];

    for (const date = new Date(currentDate); date <= endDate; date.setUTCDate(date.getUTCDate() + 1)) {
      const day = activeDaysByWeekday.get(date.getUTCDay());
      if (day) {
        available.push({
          date: date.toISOString().slice(0, 10),
          dayOfWeek: day.dayOfWeek,
          name: day.name,
        });
      }
    }

    return available;
  }
}
