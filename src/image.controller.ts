import { Controller, Delete, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudinaryService } from "./cloudinary.service";

@Controller("images")
export class ImageController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("image"))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new Error("File not provided");
      }

      // Pass buffer and original filename to Cloudinary
      const result = await this.cloudinaryService.uploadImage(file.buffer, file.originalname);
      return result;
    } catch (error) {
      console.error("Error uploading image: ", error);
      throw new Error("Failed to upload image");
    }
  }

  @Delete(":folder/:filename")
  async deleteImage(@Param("folder") folder: string, @Param("filename") filename: string) {
    try {
      const publicId = `${folder}/${filename}`;
      console.log("Deleting image with publicId:", publicId);
      const result = await this.cloudinaryService.deleteImage(publicId);
      return result;
    } catch (error) {
      console.error("Error deleting image: ", error);
      throw new Error("Failed to delete image");
    }
  }
}
