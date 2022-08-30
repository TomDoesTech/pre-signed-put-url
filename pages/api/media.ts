// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import S3 from "aws-sdk/clients/s3";
import { randomUUID } from "crypto";

const s3 = new S3({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION,
  signatureVersion: "v4",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const ex = (req.query.fileType as string).split("/")[1];

  const Key = `${randomUUID()}.${ex}`;

  const s3Params = {
    Bucket: process.env.BUCKET_NAME,
    Key,
    Expires: 60,
    ContentType: `image/${ex}`,
  };

  const uploadUrl = await s3.getSignedUrl("putObject", s3Params);

  console.log("uploadUrl", uploadUrl);

  res.status(200).json({
    uploadUrl,
    key: Key,
  });
}
