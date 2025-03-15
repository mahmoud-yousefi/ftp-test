import { Injectable } from '@nestjs/common';
import * as ftp from 'basic-ftp';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FtpService {
  constructor() {}

  async uploadFile(localFilePath: string, remoteFilePath: string) {
    // const client = new ftp.Client();
    // client.ftp.verbose = true;

    try {
      // await client.access({
      //   host: '127.0.0.1', // آدرس سرور FTP لوکال
      //   user: 'testuser', // نام کاربری که در FileZilla Server ساختی
      //   password: 'testpass', // رمز عبور
      //   secure: "implicit", // غیر فعال بودن TLS
      //   secureOptions: { rejectUnauthorized: false },
      // });

      console.log(`✅ Connected to FTP server`);

      if (!fs.existsSync(localFilePath)) {
        throw new Error('❌ File not found: ' + localFilePath);
      }

      console.log(`🚀 Uploading ${localFilePath} to ${remoteFilePath}...`);
      // await client.uploadFrom(localFilePath, remoteFilePath);

      console.log(`✅ File uploaded successfully: ${remoteFilePath}`);
      // Optionally delete the local file after upload
      fs.unlinkSync(localFilePath);
      return { success: true, message: 'File uploaded!', path: remoteFilePath };
    } catch (error) {
      console.error('❌ Error uploading file to FTP:', error);
      return { success: false, error: error.message };
    } finally {
      // client.close();
    }
  }
}