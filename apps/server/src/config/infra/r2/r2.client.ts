import { S3Client } from "@aws-sdk/client-s3";
export const R2_CLIENT = Symbol("R2_CLIENT");

export const r2ClientFactory = () =>
  new S3Client({
    endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    region: "auto",
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_ID!,
      secretAccessKey: process.env.CLOUDFLARE_R2_ACCESS_SECRET!,
    },
  });
