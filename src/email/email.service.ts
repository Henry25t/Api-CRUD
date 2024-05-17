import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  sendMail() {
    const message = `Hola este es um email enviado desde un sistema de nestjs que tengas un buen dia!`;

    this.mailService.sendMail({
      from: 'Henry <kingsleyokgeorge@gmail.com>',
      to: 'rc23004victor@gmail.com',
      subject: `How to Send Emails with Nodemailer`,
      text: message,
    });

    // joanna@gmail.com
  }
}
