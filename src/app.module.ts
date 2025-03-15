import { Module } from '@nestjs/common';
import { FtpModule } from './ftp/ftp.module';

@Module({
  imports: [FtpModule],
})
export class AppModule {}
