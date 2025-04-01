import { Prisma, WorkflowStateStatus, type Event } from '@prisma/client';
import { type NextRequest, NextResponse } from 'next/server';

import { db } from 'helpers/db';

async function processEvent(event: Event): Promise<void> {
  console.log(
    ` -> Processing Event ID: ${event.id}, Type: ${event.eventType}, User: ${event.userId}`
  );

  // 1. Trouver le Trigger correspondant
  const trigger = await db.trigger.findUnique({
    where: { code: event.eventType }
  });

  if (!trigger) {
    console.log(
      `    No trigger found for event type "${event.eventType}". Skipping.`
    );
    return; // Pas de trigger défini pour cet événement
  }
  console.log(`    Found Trigger: ${trigger.id}`);

  // 2. Trouver les Règles Actives liées à ce Trigger
  const rules = await db.rule.findMany({
    where: {
      triggerId: trigger.id,
      isActive: true
      // Optionnel : on pourrait aussi filtrer par workflow actif ici
      // workflow: { isActive: true }
    },
    include: {
      workflow: true // Inclure le workflow pour obtenir workflowId et vérifier son état
    }
  });

  if (rules.length === 0) {
    console.log(`    No active rules found for trigger ${trigger.code}.`);
    return; // Aucune règle à exécuter
  }
  console.log(`    Found ${rules.length} active rule(s).`);

  // 3. Pour chaque Règle...
  for (const rule of rules) {
    // S'assurer que le workflow parent est actif
    if (!rule.workflow.isActive) {
      console.log(
        `    Skipping Rule ${rule.id} because Workflow ${rule.workflow.name} is inactive.`
      );
      continue;
    }

    console.log(
      `    Evaluating Rule ID: ${rule.id} (Workflow: ${rule.workflow.name}, Action: ${rule.actionId}, Delay: ${rule.delayMinutes}min)`
    );

    // 4. Vérifier/Créer l'état du Workflow pour l'utilisateur
    // upsert: trouve ou crée l'état.
    const workflowState = await db.workflowState.upsert({
      where: {
        userId_workflowId: {
          // Utilise l'index unique composite
          userId: event.userId,
          workflowId: rule.workflowId
        }
      },
      create: {
        userId: event.userId,
        workflowId: rule.workflowId,
        status: WorkflowStateStatus.ACTIVE // Statut initial
      },
      update: {
        // Ne rien mettre à jour si l'état existe déjà (juste le récupérer)
        updatedAt: new Date() // Met à jour la date pour voir l'activité récente
      }
    });

    // Si l'utilisateur n'est pas ACTIF dans ce workflow, on ignore la règle
    if (workflowState.status !== WorkflowStateStatus.ACTIVE) {
      console.log(
        `    User ${event.userId} is not ACTIVE in workflow ${rule.workflow.name} (Status: ${workflowState.status}). Skipping rule ${rule.id}.`
      );
      continue;
    }

    // 5. Calculer `runAt` pour la tâche Queue
    const runAt = new Date(
      event.createdAt.getTime() + rule.delayMinutes * 60 * 1000
    );

    // 6. Créer l'enregistrement dans la Queue
    const payload = {
      ruleId: rule.id,
      triggeringEventId: event.id,
      userId: event.userId,
      correlationId: event.correlationId // Propager le correlationId
    };

    const newQueueJob = await db.queue.create({
      data: {
        job: 'EXECUTE_WORKFLOW_ACTION', // Type de tâche pour le worker
        payload: payload as unknown as Prisma.JsonObject, // Forcer le type si nécessaire
        runAt: runAt,
        status: 'pending',
        priority: rule.order, // Utiliser l'ordre de la règle comme priorité simple, ou définir autrement
        correlationId: event.correlationId,
        userId: event.userId // Optionnel mais peut être utile
      }
    });

    console.log(
      `    Created Queue Job ID: ${newQueueJob.id} for Rule ${rule.id} to run at ${runAt.toISOString()}`
    );
  } // Fin de la boucle sur les règles
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401
    });
  }

  const event = await db.$transaction(async () => {
    const [event] = await db.$queryRaw<Event[]>`
      UPDATE "Event"
      SET status = 'processing', attempts = attempts + 1
      WHERE id = (
        SELECT id FROM "Event"
        WHERE "Event"."status" = 'pending'
        ORDER BY "Event"."createdAt" ASC
        FOR UPDATE SKIP LOCKED
        LIMIT 1
      )
      RETURNING *
    `;

    return event;
  });

  if (!event) {
    return NextResponse.json(
      { message: 'No event to process.' },
      { status: 200 }
    );
  }

  try {
    await processEvent(event);

    await db.event.update({
      where: { id: event.id },
      data: { status: 'done' }
    });

    return NextResponse.json({ status: 'success', event }, { status: 200 });
  } catch (error: unknown) {
    await db.event.update({
      where: { id: event.id },
      data: {
        status: 'failed',
        lastError: error instanceof Error ? error.message : String(error)
      }
    });

    return NextResponse.json(
      { status: 'failed', error: String(error), event },
      { status: 500 }
    );
  }
}
