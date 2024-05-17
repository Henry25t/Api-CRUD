import { MailerService } from '@nestjs-modules/mailer';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  async sendMail({ subject, text, to}: CreateEmailDto) {

    await this.mailService.sendMail({
      from: process.env.GMAIL_USER,
      to: to,
      subject: subject,
      text: text,
    });

    return{
      message: 'success',
      status: HttpStatus.OK
    }
  }
}
