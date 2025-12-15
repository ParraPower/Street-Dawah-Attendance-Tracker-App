import { IAudit } from "../../../core/interfaces/iaudit.js";
import { IBaseEntity } from "../../../core/interfaces/ibase-entity.js";

export class Import implements IBaseEntity, IAudit{
    id!: number;
    uploadTimeStamp!: Date;
    isDeleted?: boolean | undefined;
    createdAt!: Date;
    createdBy!: number;
    updatedAt?: Date | undefined;
    updatedBy?: number | undefined;

}

export class ImportRow implements IBaseEntity, IAudit {
  id: number;

  importId!: number;

    // Column A
  Name: string;

  // Column B
  Number?: string | null;

  // Column C
  WhatsappLink?: string | null;

  // Column D
  JoinedDate?: Date | null;

  // Column E
  Reference?: string | null;

  // Column F
  LastAttendance?: Date | null;

  // Column G
  LastAttendedBefore60Days?: string | null;

  // Column H
  Location?: string | null;

  // Column I
  RegularLocation?: string | null;

  // Column J
  Status?: string | null;

  // Column K
  OutreachDate?: string | null;

  // Column L
  WhoReachedOut?: string | null;

  // Column M
  Socials?: boolean | null;

  // Column N
  University?: boolean | null;

  // Column O
  Outcome?: string | null;

  createdAt!: Date;
  createdBy!: number;

  updatedAt?: Date | undefined;
  updatedBy?: number | undefined;

  constructor(data: Partial<ImportRow>) {
    this.id = data.id && data.id > 0 ? data.id : Date.now(),
    this.Name = data.Name ?? "";
    this.Number = data.Number ?? null;
    this.WhatsappLink = data.WhatsappLink ?? null;
    this.JoinedDate = data.JoinedDate ? new Date(data.JoinedDate) : null;
    this.Reference = data.Reference ?? null;
    this.LastAttendance = data.LastAttendance ? new Date(data.LastAttendance) : null;
    this.LastAttendedBefore60Days = data.LastAttendedBefore60Days ?? null;
    this.Location = data.Location ?? null;
    this.RegularLocation = data.RegularLocation ?? null;
    this.Status = data.Status ?? null;
    this.OutreachDate = data.OutreachDate ?? null;
    this.WhoReachedOut = data.WhoReachedOut ?? null;
    this.Socials = data.Socials ?? null;
    this.University = data.University ?? null;
    this.Outcome = data.Outcome ?? null;
    this.isDeleted = data.isDeleted;
    this.createdAt = data.createdAt ?? new Date();
    this.createdBy = data.createdBy ?? 1;
  }
    
  isDeleted?: boolean;

  /**
   * Utility to parse "Yes"/"No" into boolean for Socials and University
   */
  static parseBoolean(value?: string | null | undefined): boolean | null {
    if (value == null || typeof value !== 'string') return null;
    return value.toLowerCase() === "yes";
  }
}
