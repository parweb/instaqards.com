import * as AWS from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { StreamingBlobPayloadInputTypes } from '@smithy/types';
import { contentType } from 'mime-types';

export const storage = new AWS.S3({
  region: process.env.S3_REGION!,
  endpoint: process.env.S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.S3_ACCESSKEYID!,
    secretAccessKey: process.env.S3_SECRETACCESSKEY!
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

  console.log({ params });

  try {
    if (value instanceof File) {
      const parallelUploads3 = new Upload({
        client: storage,
        params
      });

      parallelUploads3.on('httpUploadProgress', progress => {
        console.log({ progress });
      });

      await parallelUploads3.done();
    } else {
      await storage.putObject(params);
    }

    return {
      url:
        (process.env.NEXTAUTH_URL?.includes('localhost')
          ? `http://localhost${process.env.NEXTAUTH_URL.split('localhost').at(-1)}`
          : `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) +
        `/api/file?id=${key}`
    };
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

  console.log({ params });

  return storage.getObject(params);
};
