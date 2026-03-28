import { Module } from "@nestjs/common";
import { CloudinaryService } from "./cloudinary.service";

@Module({
  providers: [CloudinaryService],
  exports: [CloudinaryService], // 🔥 très important
})
export class CloudinaryModule {}