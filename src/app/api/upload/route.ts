// import { nanoid } from 'nanoid';
// import { NextResponse } from 'next/server';

// import { put } from 'helpers/storage';

// export async function POST(req: Request) {
//   const file = req.body || '';
//   const contentType = req.headers.get('content-type') || 'text/plain';
//   const filename = `${nanoid()}.${contentType.split('/')[1]}`;
//   const blob = await put(filename, file, {
//     contentType
//   });

//   return NextResponse.json(blob);
// }

import * as AWS from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { storage } from 'helpers/storage';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';

const createPresignedUrlWithClient = Key =>
  getSignedUrl(
    storage,
    new AWS.GetObjectCommand({ Bucket: 'instaqards.com', Key }),
    { expiresIn: 3600 }
  );

const extension = (name: string) => name.split('.').at(-1)?.toLowerCase();

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json();

  console.log({ body });

  try {
    const filename = `${nanoid()}.${extension(body.filename)}`;

    console.log({ filename });

    const url = await createPresignedUrlWithClient(filename);

    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}
