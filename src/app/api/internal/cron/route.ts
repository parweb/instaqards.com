import { NextResponse } from 'next/server';
import { runScheduler } from '@/lib/cron/scheduler';

export async function POST() {
  await runScheduler();
  return NextResponse.json({ ok: true });
}
