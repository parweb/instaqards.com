import { NextResponse } from 'next/server';

import { runScheduler } from 'lib/cron/scheduler';

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const result = await runScheduler();
  return NextResponse.json(result);
}
