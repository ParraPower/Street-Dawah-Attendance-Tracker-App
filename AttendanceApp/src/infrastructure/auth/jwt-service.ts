'app-framework';
import { JwtService, KeyCacheService } from "app-framework";
import { IAttendanceAppJwtService } from "@attendance/features/auth/domain/services/jwt-service";
export class AttendanceAppJwtService extends JwtService implements IAttendanceAppJwtService {
    constructor(keyCacheService: KeyCacheService) {
        super(keyCacheService);
    }
}