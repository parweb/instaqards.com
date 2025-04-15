import { NextRequest, NextResponse } from 'next/server';

import { db } from 'helpers/db';

export async function POST(
  request: NextRequest,
  props: {
    params: Promise<{ model: string; operation: string }>;
  }
) {
  const { model, operation } = await props.params;
  const query = Object.fromEntries(new URL(request.url).searchParams);
  const paginated = query.paginated === 'true' || query.paginated === '';
  const body = JSON.parse(await request.text());

  const table = db[model as keyof typeof db];

  const [result, total] = await db.$transaction(
    [
      // @ts-ignore
      table[operation](body),
      // @ts-ignore
      paginated ? table.count({ where: body.where }) : null
    ].filter(Boolean)
  );

  if (paginated) {
    return NextResponse.json({
      data: result,
      total,
      take: body?.take ?? null,
      skip: body?.skip ?? null
    });
  }

  return NextResponse.json(result);
}
