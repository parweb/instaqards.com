import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';

import { db } from 'helpers/db';
import { revalidate } from 'helpers/revalidate';
import { storage } from 'helpers/storage';
import { contentType } from 'mime-types';

const extension = (name: string) => name.split('.').at(-1)?.toLowerCase();

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json();

  console.info({ body });

  try {
    const filename = `${nanoid()}.${extension(body.filename)}`;

    const type = contentType(filename);

    const url = await getSignedUrl(
      // @ts-ignore
      storage,
      new PutObjectCommand({
        Bucket: 'instaqards.com',
        Key: filename,
        ContentType: type || undefined
      }),
      {
        expiresIn: 3600
      }
    );

    const site = await db.site.update({
      where: { id: body.siteId },
      data: {
        [body.attr]: `/api/file?id=${filename}`
      }
    });

    revalidate(site);

    return NextResponse.json({ url, filename });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}
