import { randomUUID } from "crypto";

import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";

import { FilesService } from "./files.service";
import { RequireUser } from "../../shared/decorators/require-user.decorator";

const allowed = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
]);

@Controller()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post("image")
  @RequireUser()
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!allowed.has(file.mimetype)) {
          return cb(
            new BadRequestException(`Unsupported image type: ${file.mimetype}`),
            false
          );
        }
        cb(null, true);
      },
    })
  )
  async upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException("No file provided");

    const keyPrefix = `images/${new Date().toISOString().slice(0, 10)}`;

    const url = await this.filesService.uploadImage({
      buffer: file.buffer,
      originalName: file.originalname,
      mime: file.mimetype,
      keyPrefix,
    });

    return { url };
  }
}
