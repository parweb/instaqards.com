import type { Queue } from '@prisma/client';
import { type NextRequest, NextResponse } from 'next/server';

import { db } from 'helpers/db';

async function processJob(job: Queue) {
  console.log('Processing job :', job);

  // throw new Error('test');
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401
    });
  }

  const job = await db.$transaction(async () => {
    const [job] = await db.$queryRaw<Queue[]>`
      UPDATE "Queue"
      SET status = 'processing', attempts = attempts + 1
      WHERE id = (
        SELECT id FROM "Queue"
        WHERE "Queue"."status" = 'pending' AND "Queue"."runAt" <= NOW()
        ORDER BY "Queue"."runAt" ASC
        FOR UPDATE SKIP LOCKED
        LIMIT 1
      )
      RETURNING *
    `;

    return job;
  });

  if (!job) {
    return NextResponse.json(
      { message: 'No job to process.' },
      { status: 200 }
    );
  }

  try {
    await processJob(job);

    await db.queue.update({
      where: { id: job.id },
      data: { status: 'done' }
    });

    return NextResponse.json({ status: 'success', job }, { status: 200 });
  } catch (error: unknown) {
    await db.queue.update({
      where: { id: job.id },
      data: {
        status: 'failed',
        lastError: error instanceof Error ? error.message : String(error)
      }
    });

    return NextResponse.json(
      { status: 'failed', error: String(error), job },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { payload, runAt } = await request.json();

    if (!payload) {
      return NextResponse.json(
        { error: 'Payload is required' },
        { status: 400 }
      );
    }

    const job = await db.queue.create({
      data: {
        payload,
        runAt: runAt ? new Date(runAt) : new Date()
      }
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error('Error creating queue job:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
