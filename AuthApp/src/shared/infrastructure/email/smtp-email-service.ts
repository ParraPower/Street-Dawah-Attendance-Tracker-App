import nodemailer, { Transporter } from 'nodemailer';
import {
  SendEmailRequest,
} from '../../../features/auth/infrastructure/email/send-email-request'
import {
    IEmailService
} from '../../../features/auth/infrastructure/email/email.service'
import { env } from '../config/env';
import dns from 'node:dns';
 
//src\shared\infrastructure\email\smtp-email-service.ts
export class SmtpEmailService implements IEmailService {
  private readonly transporter: Transporter;

  constructor() {
    dns.setDefaultResultOrder('ipv4first');

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: env.emailUser,
        pass: env.emailPassword,
      },
    });
  }

  async send(
    request: SendEmailRequest,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: env.emailFrom,
      to: request.to,
      subject: request.subject,
      html: request.html,
    });
  }
}