import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UploadApiErrorResponse, UploadApiResponse, v2 } from "cloudinary";
import { Readable } from "stream";

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    v2.config({
      cloud_name: this.configService.getOrThrow("CLOUDINARY_CLOUD_NAME"),
      api_key: this.configService.getOrThrow("CLOUDINARY_API_KEY"),
      api_secret: this.configService.getOrThrow("CLOUDINARY_API_SECRET"),
    });
  }

  async uploadImage(fileBuffer: Buffer, fileName: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const stream = v2.uploader.upload_stream({ folder: "local_community", public_id: fileName }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      // Convert buffer to readable stream
      const readableStream = new Readable();
      readableStream.push(fileBuffer);
      readableStream.push(null);
      readableStream.pipe(stream);
    });
  }

  // Delete image
  async deleteImage(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}
