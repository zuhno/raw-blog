import { randomUUID } from "crypto";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Inject, Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { fileTypeFromBuffer } from "file-type";

import { R2_CLIENT } from "../../config/infra/r2/r2.client";

@Injectable()
export class FilesService {
  constructor(
    @Inject(R2_CLIENT) private readonly s3: S3Client,
    private configService: ConfigService
  ) {}

  private allowed = new Set([
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/gif",
    "image/avif",
    "image/svg+xml",
  ]);

  async uploadImage(params: {
    buffer: Buffer;
    originalName: string;
    mime: string;
    keyPrefix?: string;
  }) {
    const { buffer, mime, keyPrefix } = params;
    const bucket = this.configService.get("CLOUDFLARE_R2_BUCKET");

    const sniff = await fileTypeFromBuffer(buffer);
    const detected = sniff?.mime ?? mime;
    if (!this.allowed.has(detected)) {
      throw new BadRequestException(
        `Unsupported image type: ${detected || "unknown"}`
      );
    }

    const ext =
      sniff?.ext ??
      (detected === "image/svg+xml"
        ? "svg"
        : (this.mimeToExt(detected) ?? "bin"));

    const key = `${keyPrefix}/${randomUUID()}.${ext}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: detected,
        CacheControl: "public, max-age=86400, immutable",
      })
    );

    const base = (process.env.CLOUDFLARE_R2_PUBLIC_URL || "").replace(
      /\/+$/,
      ""
    );
    const url = base ? `${base}/${key}` : key;

    return url;
  }

  private timestamped(name: string, ext: string) {
    const base = name
      .replace(/\.[a-z0-9]+$/i, "")
      .slice(0, 80)
      .replace(/\s+/g, "_");
    return `${base}_${Date.now()}.${ext}`;
  }

  private mimeToExt(mime: string) {
    const map: Record<string, string> = {
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/webp": "webp",
      "image/gif": "gif",
      "image/avif": "avif",
      "image/svg+xml": "svg",
    };
    return map[mime];
  }
}
