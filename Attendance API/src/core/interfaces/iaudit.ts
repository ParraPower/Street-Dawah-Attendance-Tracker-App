export interface IAudit 
{
    createdAt: Date;
    createdBy: number;
    updatedAt?: Date;
    updatedBy?: number;
}