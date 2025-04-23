import { NextResponse } from 'next/server';
import { db } from 'helpers/db';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const prospect = await db.user.findUnique({
      where: { id }
    });

    if (!prospect) {
      return NextResponse.json(
        { error: 'Prospect not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(prospect);
  } catch (error) {
    console.error('api/prospect/[id] error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
