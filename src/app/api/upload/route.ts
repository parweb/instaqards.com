import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';

import { db } from 'helpers';
import { storage } from 'helpers/storage';

const extension = (name: string) => name.split('.').at(-1)?.toLowerCase();

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json();

  console.log({ body });

  try {
    const filename = `${nanoid()}.${extension(body.filename)}`;

    console.log({ filename });

    const url = await getSignedUrl(
      storage,
      new PutObjectCommand({
        Bucket: 'instaqards.com',
        Key: filename
      }),
      {
        expiresIn: 3600
      }
    );

    await db.site.update({
      where: { id: body.siteId },
      data: {
        background: `/api/file?id=${filename}`
      }
    });

    return NextResponse.json({ url, filename });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}
