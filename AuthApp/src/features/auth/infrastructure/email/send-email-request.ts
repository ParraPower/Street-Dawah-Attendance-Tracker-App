// shared/application/email/iemail-service.ts
export type SendEmailRequest = {
    to: string;
    subject: string;
    html: string;
}