import { NextResponse } from 'next/server';
import { db } from 'helpers/db';
import { getSession } from 'lib/auth';

/**
 * POST /api/prospect/update
 * body: { id: string, status: string, position: number }
 */
export async function POST(request: Request) {
  try {
    const { id, status, position } = await request.json();

    // Get current user
    const session = await getSession();
    const userId = session?.user?.id;

    // Get current prospect to compare status
    const currentProspect = await db.prospect.findUnique({
      where: { id },
      select: { status: true }
    });

    if (!currentProspect) {
      return NextResponse.json(
        { error: 'Prospect not found' },
        { status: 404 }
      );
    }

    // If status has changed, create history entry
    if (currentProspect.status !== status) {
      await db.prospectStatusHistory.create({
        data: {
          prospectId: id,
          previousStatus: currentProspect.status,
          newStatus: status,
          position,
          updatedBy: userId
        }
      });
    }

    // Update prospect
    const updatedProspect = await db.prospect.update({
      where: { id },
      data: { status, position }
    });

    return NextResponse.json(updatedProspect);
  } catch (error) {
    console.error('api/prospect/update error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
