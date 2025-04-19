import { NextResponse } from 'next/server';
import { db } from 'helpers/db';

type Props = {
  params: {
    id: string;
  };
};

export async function GET(request: Request, { params }: Props) {
  try {
    const prospect = await db.prospect.findUnique({
      where: { id: params.id }
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
