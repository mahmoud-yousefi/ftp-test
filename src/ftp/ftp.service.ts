import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'basic-ftp';

@Injectable()
export class FtpService {
  private readonly logger = new Logger(FtpService.name);
  private client: Client;

  constructor() {
    this.client = new Client();
    this.client.ftp.verbose = true; // Enable verbose logging for debugging purposes
  }

  /**
   * Ensure the FTP client is connected. Reconnect if necessary.
   */
  async ensureConnected(): Promise<void> {
    if (this.client.closed) {
      this.logger.log('Reconnecting to FTP server...');
      await this.connectToFtpServer();
    }
  }

  /**
   * Connect to the FTP server.
   */
  async connectToFtpServer(): Promise<void> {
    try {
      await this.client.access({
        host: '127.0.0.1', // آدرس سرور FTP لوکال
        user: 'testuser', // نام کاربری که در FileZilla Server ساختی
        password: 'testpass', // رمز عبور
        secure: true, // Enable explicit FTPS (FTP over TLS)
        secureOptions: { rejectUnauthorized: false }, // Disable certificate validation (for self-signed certificates)
      });
      this.logger.log('Connected to FTP server successfully.');
    } catch (error) {
      this.logger.error('Failed to connect to FTP server:', error.message);
      throw error;
    }
  }

  /**
   * Disconnect from the FTP server.
   */
  disconnectFromFtpServer(): void {
    this.client.close();
    this.logger.log('Disconnected from FTP server.');
  }

  /**
   * Upload a file to the FTP server.
   * @param localFilePath - Path to the local file to upload.
   * @param remoteFilePath - Path where the file should be stored on the FTP server.
   */
  async uploadFile(localFilePath: string, remoteFilePath: string): Promise<void> {
    try {
      await this.ensureConnected(); // Ensure the client is connected
      await this.client.uploadFrom(localFilePath, remoteFilePath);
      this.logger.log(`Uploaded file ${localFilePath} to ${remoteFilePath}`);
    } catch (error) {
      this.logger.error(`Failed to upload file ${localFilePath}:`, error.message);
      throw error;
    }
  }
}