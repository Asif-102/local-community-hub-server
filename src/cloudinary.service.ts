import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UploadApiErrorResponse, UploadApiResponse, v2 } from "cloudinary";

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    v2.config({
      cloud_name: this.configService.getOrThrow("CLOUDINARY_CLOUD_NAME"),
      api_key: this.configService.getOrThrow("CLOUDINARY_API_KEY"),
      api_secret: this.configService.getOrThrow("CLOUDINARY_API_SECRET"),
    });
  }

  async uploadImage(filePath: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      v2.uploader.upload(filePath, { folder: "local_community" }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}
