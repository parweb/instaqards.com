import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';

import { put } from 'helpers/storage';

export async function POST(req: Request) {
  const file = req.body || '';
  const contentType = req.headers.get('content-type') || 'text/plain';
  const filename = `${nanoid()}.${contentType.split('/')[1]}`;
  const blob = await put(filename, file, {
    contentType
  });

  return NextResponse.json(blob);
}
