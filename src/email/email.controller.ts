import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) { }

  @Post('send')
  async sendMail(
    @Body('to') to: string,
    @Body('subject') subject: string,
    @Body('text') text: string,
  ) {
    // return this.emailService.sendMail(to, subject, text);
  }

  @Get()
  sendMailer(@Res() response: any) {
    const mail = this.emailService.sendMail();

    return response.status(200).json({
      message: 'success',
      mail,
    });
  }
}