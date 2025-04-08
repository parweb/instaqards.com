import { NextResponse } from 'next/server';

import { get } from 'helpers/storage';

export async function GET(req: Request) {
  const Range = req?.headers?.get('range') ?? 'bytes=0-';
  const id = String(new URL(req?.url).searchParams.get('id'));

  try {
    const data = await get(id, { Range });

    if (data.ContentType?.startsWith('image/')) {
      // @ts-ignore
      return new Response(data.Body, {
        status: 200,
        headers: {
          'Content-Type': data.ContentType,
          'Content-Length': data.ContentLength
        }
      });
    }

    // @ts-ignore
    const response = new Response(data.Body, {
      status: 206,
      headers: {
        'Content-Type': data.ContentType,
        'Content-Length': data.ContentLength,
        'Content-Range': data.ContentRange,
        'Accept-Ranges': 'bytes'
      }
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error });
  }
}
