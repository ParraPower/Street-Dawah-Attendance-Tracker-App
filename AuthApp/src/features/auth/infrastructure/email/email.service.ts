import { SendEmailRequest } from "./send-email-request";

export interface IEmailService {
    send(
        request: SendEmailRequest
    ): Promise<void>;
}