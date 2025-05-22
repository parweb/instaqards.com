import { NextResponse } from 'next/server';

import { runScheduler } from 'lib/cron/scheduler';
import * as cronJob from 'services/cron-job';

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const result = await runScheduler();
  return NextResponse.json(result);
}

export async function GET() {
  const result = await cronJob.get().catch((error: unknown) => {
    console.error(error);
    return null;
  });

  return NextResponse.json(result);
}
