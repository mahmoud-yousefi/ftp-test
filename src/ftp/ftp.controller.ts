import { Controller, Post, UploadedFile, UseInterceptors, Body, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FtpService } from './ftp.service';
import { diskStorage } from 'multer';
import * as path from 'path';
import { Response } from 'express';

@Controller('ftp')
export class FtpController {
  constructor(private readonly ftpService: FtpService) {}

  /**
   * Endpoint to upload a file received from the client to the FTP server.
   */
  @Post('upload-file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Temporary directory to store uploaded files locally
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          const filename = `${file.originalname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadFileToFTP(
    @UploadedFile() file: Express.Multer.File,
    @Body('remoteFilePath') remoteFilePath: string,
  ): Promise<any> {
    const localFilePath = file.path; // Path where the file is temporarily stored on the server
    try {
      await this.ftpService.ensureConnected(); // Ensure the FTP client is connected
      await this.ftpService.uploadFile(localFilePath, remoteFilePath); // Upload to FTP server
      return { message: `File uploaded successfully to ${remoteFilePath}` };
    } catch (error) {
      return { error: `Failed to upload file: ${error.message}` };
    }
  }
}