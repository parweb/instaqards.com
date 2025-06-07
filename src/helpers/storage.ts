// import 'server-only';

import { Upload } from '@aws-sdk/lib-storage';
import type { StreamingBlobPayloadInputTypes } from '@smithy/types';
import { contentType } from 'mime-types';

import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';

export const storage = new S3Client({
  region: String(process.env.S3_REGION),
  endpoint: String(process.env.S3_ENDPOINT),
  credentials: {
    accessKeyId: String(process.env.S3_ACCESSKEYID),
    secretAccessKey: String(process.env.S3_SECRETACCESSKEY)
  }
});

export const put = async (
  key: string,
  value: StreamingBlobPayloadInputTypes,
  options = {}
) => {
  const params = {
    Bucket: 'instaqards.com',
    Key: key,
    Body: value,
    ContentType: contentType(key) as string,
    ...options
  };

  try {
    if (value instanceof File) {
      const parallelUploads3 = new Upload({
        client: storage,
        params
      });

      await parallelUploads3.done();
    } else {
      await storage.send(new PutObjectCommand(params));
    }

    return { url: `/api/file?id=${key}` };
  } catch (error) {
    console.error({ error });
    throw error;
  }
};

export const get = (key: string, { ...options } = {}) => {
  const params = {
    Bucket: 'instaqards.com',
    Key: key,
    ...options
  };

  return storage.send(new GetObjectCommand(params));
};
