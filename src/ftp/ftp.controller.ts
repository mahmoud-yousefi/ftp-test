import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FtpService } from './ftp.service';
import * as path from 'path';
import { diskStorage } from 'multer';

@Controller('ftp')
export class FtpController {
  constructor(private readonly ftpService: FtpService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Save files in the 'uploads' directory
        filename: (req, file, callback) => {
          // Generate a unique filename using a timestamp and a random string
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = path.extname(file.originalname); // Get the file extension
          const fileName = `${uniqueSuffix}${ext}`; // Create the filename
          callback(null, fileName);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { success: false, message: 'هیچ فایلی ارسال نشده است.' };
    }

    const localFilePath = file.path;
    const remoteFilePath = `/uploads/${file.originalname}`;

    return await this.ftpService.uploadFile(localFilePath, remoteFilePath);
  }
}
