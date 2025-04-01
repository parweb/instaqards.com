import type {
  Queue,
  User,
  Event,
  Subscription,
  WorkflowState,
  Rule,
  Action,
  Condition,
  RuleCondition,
  Prisma
} from '@prisma/client';
import { type NextRequest, NextResponse } from 'next/server';
import { db } from 'helpers/db'; // Assurez-vous que ce chemin est correct
import {
  ExecutionStatus,
  WorkflowStateStatus,
  ActionType
} from '@prisma/client'; // Importez vos enums

// --- Interfaces pour la clarté du Payload ---
interface ExecuteWorkflowActionPayload {
  ruleId: string;
  triggeringEventId: string;
  userId: string;
  correlationId?: string;
}

// --- Moteur de Conditions (Placeholder) ---
// Dans une vraie app, ceci serait un service/classe complexe
const conditionEngine = {
  evaluate: async (
    ruleConditions: (RuleCondition & { condition: Condition })[],
    user: User,
    triggeringEvent: Event,
    subscription: Subscription | null // Peut être null si l'utilisateur n'a pas d'abonnement
    // Potentiellement d'autres contextes si nécessaire
  ): Promise<boolean> => {
    console.log(`[Condition Engine] Evaluating conditions for rule...`); // Simuler l'évaluation
    if (!ruleConditions || ruleConditions.length === 0) {
      console.log(
        '[Condition Engine] No conditions to evaluate, returning true.'
      );
      return true; // Pas de conditions = toujours vrai
    }

    // --- LOGIQUE D'ÉVALUATION RÉELLE ICI ---
    // 1. Grouper les conditions par `group`
    // 2. Évaluer chaque condition basée sur `condition.checkType` et `condition.parameters`
    //    en utilisant les données `user`, `triggeringEvent`, `subscription` et potentiellement
    //    des requêtes sur l'historique `Event`.
    // 3. Combiner les résultats par groupe en utilisant `logic` (AND/OR).
    // 4. Combiner les résultats des groupes (souvent implicitement AND entre groupes).
    // --- Fin de la logique d'évaluation ---

    // Pour l'exemple, on retourne toujours true
    const conditionsMet = true;
    console.log(
      `[Condition Engine] Conditions evaluated. Result: ${conditionsMet}`
    );
    return conditionsMet;
  }
};

// --- Exécuteur d'Actions (Placeholder) ---
// Dans une vraie app, ceci serait un service/classe complexe
const actionExecutor = {
  execute: async (
    actionType: ActionType,
    config: Prisma.JsonValue,
    user: User,
    triggeringEvent: Event
    // Potentiellement d'autres contextes
  ): Promise<{
    success: boolean;
    resultPayload?: any;
    errorMessage?: string;
  }> => {
    console.log(`[Action Executor] Executing action type: ${actionType}`);

    try {
      switch (actionType) {
        case ActionType.SEND_EMAIL:
          // 1. Extraire sujet/corps depuis `config`
          // 2. Remplacer les variables (ex: {{user.name}})
          // 3. Appeler le service d'emailing (ex: SendGrid)
          console.log(
            `[Action Executor] Simulating SEND_EMAIL to ${user.email}`
          );
          // const emailConfig = config as { subject: string; bodyHtml: string; ... };
          // await emailService.send(user.email, emailConfig.subject, emailConfig.bodyHtml);
          return {
            success: true,
            resultPayload: { messageId: 'simulated-email-id' }
          };

        case ActionType.ADD_USER_TAG:
          // 1. Extraire tagName depuis `config`
          // 2. Mettre à jour l'utilisateur dans la BDD
          console.log(`[Action Executor] Simulating ADD_USER_TAG.`);
          // const tagConfig = config as { tagName: string };
          // await db.user.update({ where: { id: user.id }, data: { tags: { push: tagConfig.tagName } } });
          return { success: true };

        case ActionType.CALL_WEBHOOK:
          // 1. Extraire url, method, headers, bodyTemplate depuis `config`
          // 2. Remplacer les variables dans le bodyTemplate
          // 3. Faire l'appel HTTP (fetch/axios)
          console.log(`[Action Executor] Simulating CALL_WEBHOOK.`);
          // const webhookConfig = config as { url: string; method: string; ... };
          // const response = await fetch(webhookConfig.url, { method: webhookConfig.method, ... });
          // const responseData = await response.json();
          // if (!response.ok) throw new Error(`Webhook failed: ${response.status}`);
          return {
            success: true,
            resultPayload: { status: 200, body: 'simulated_webhook_response' }
          };

        // ... autres cas pour les autres ActionType ...

        default:
          console.warn(
            `[Action Executor] Unhandled action type: ${actionType}`
          );
          return {
            success: false,
            errorMessage: `Unhandled action type: ${actionType}`
          };
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(
        `[Action Executor] Error executing action ${actionType}:`,
        message
      );
      return { success: false, errorMessage: message };
    }
  }
};

// --- Fonction Principale de Traitement du Job ---
async function processJob(job: Queue): Promise<void> {
  console.info(`Processing job ${job.id} (Type: ${job.job})`);

  if (job.job !== 'EXECUTE_WORKFLOW_ACTION') {
    throw new Error(`Unsupported job type: ${job.job}`);
  }

  // 1. Extraire et valider le payload
  const payload = job?.payload as unknown as ExecuteWorkflowActionPayload;

  if (
    !payload ||
    !payload.ruleId ||
    !payload.triggeringEventId ||
    !payload.userId
  ) {
    throw new Error(
      `Invalid payload for job ${job.id}: ${JSON.stringify(job.payload)}`
    );
  }

  const { ruleId, triggeringEventId, userId, correlationId } = payload;
  let executionStatus: ExecutionStatus = ExecutionStatus.PENDING; // Statut final du log Execution
  let executionResultPayload: Prisma.JsonValue | null = null;
  let executionErrorMessage: string | null = null;
  let actionToExecute: Action | null = null; // Pour logguer l'actionId même si conditions non remplies

  try {
    // 2. Charger les données nécessaires (dans une transaction pour la cohérence ?)
    // Pour la simplicité, pas de transaction explicite ici, mais pourrait être pertinent.
    const rule = await db.rule.findUnique({
      where: { id: ruleId },
      include: {
        action: true, // Inclure l'ActionTemplate
        trigger: true,
        workflow: true,
        ruleConditions: {
          // Inclure les conditions liées et la définition de la condition
          include: {
            condition: true
          }
        }
      }
    });

    if (
      !rule ||
      !rule.isActive ||
      !rule.action ||
      !rule.workflow ||
      !rule.workflow.isActive
    ) {
      console.log(
        `Rule ${ruleId} not found, inactive, or workflow inactive. Skipping job ${job.id}.`
      );
      // Marquer comme complété car il n'y a rien à faire
      await db.queue.update({
        where: { id: job.id },
        data: { status: 'completed' }
      });
      // Optionnel : logguer un 'SKIPPED' execution log
      return;
    }
    actionToExecute = rule.action; // Sauvegarde pour le log final

    const user = await db.user.findUnique({ where: { id: userId } });
    const triggeringEvent = await db.event.findUnique({
      where: { id: triggeringEventId }
    });

    if (!user || !triggeringEvent) {
      throw new Error(
        `User ${userId} or Triggering Event ${triggeringEventId} not found for job ${job.id}.`
      );
    }

    // Charger l'état de l'abonnement pertinent (exemple simple : le dernier créé)
    const subscription = await db.subscription.findFirst({
      where: { userId: userId },
      orderBy: { created: 'desc' }
    });

    // 3. Vérifier WorkflowState
    const workflowState = await db.workflowState.findUnique({
      where: {
        userId_workflowId: { userId: userId, workflowId: rule.workflowId }
      }
    });

    if (!workflowState || workflowState.status !== WorkflowStateStatus.ACTIVE) {
      console.log(
        `User ${userId} is not ACTIVE in workflow ${rule.workflowId}. Skipping job ${job.id}.`
      );
      await db.queue.update({
        where: { id: job.id },
        data: { status: 'completed' }
      });
      // Optionnel : logguer un 'SKIPPED' execution log
      return;
    }

    console.log(
      `Data loaded for job ${job.id}. User: ${user.email}, Rule: ${rule.id}, Trigger: ${triggeringEvent.eventType}`
    );

    // 4. Évaluer les Conditions
    const conditionsMet = await conditionEngine.evaluate(
      rule.ruleConditions,
      user,
      triggeringEvent,
      subscription
    );

    // 5. Exécuter l'Action (si conditions remplies)
    if (conditionsMet) {
      console.log(
        `Conditions MET for rule ${rule.id}. Executing action ${rule.action.internalName}...`
      );
      executionStatus = ExecutionStatus.PROCESSING; // Avant l'exécution

      const executionResult = await actionExecutor.execute(
        rule.action.actionType,
        rule.action.config,
        user,
        triggeringEvent
      );

      executionStatus = executionResult.success
        ? ExecutionStatus.SUCCESS
        : ExecutionStatus.FAILED;
      executionResultPayload = executionResult.resultPayload ?? null;
      executionErrorMessage = executionResult.errorMessage ?? null;

      console.log(
        `Action execution finished for rule ${rule.id}. Status: ${executionStatus}`
      );
    } else {
      console.log(`Conditions NOT MET for rule ${rule.id}. Skipping action.`);
      // On considère que le job est terminé, l'action est juste skipée
      executionStatus = ExecutionStatus.SUCCESS; // Ou un nouveau statut SKIPPED? Pour l'instant SUCCESS=rien n'a échoué.
    }

    // Si l'action était de type CREATE_QUEUE_TASK, elle aurait créé une nouvelle entrée Queue ici.
  } catch (error: unknown) {
    // Gérer les erreurs durant le chargement ou l'évaluation/exécution
    console.error(`Error processing job ${job.id}:`, error);
    executionStatus = ExecutionStatus.FAILED;
    executionErrorMessage =
      error instanceof Error ? error.message : String(error);
    // Rethrow pour que le handler externe mette la Queue à 'failed'
    throw error;
  } finally {
    // 6. Logguer l'exécution (même si skipé ou échoué)
    if (actionToExecute) {
      // S'assurer qu'on a pu charger la règle et l'action
      await db.execution.create({
        data: {
          userId: userId,
          actionId: actionToExecute.id,
          ruleId: ruleId,
          executedAt: new Date(),
          status: executionStatus,
          errorMessage: executionErrorMessage,
          resultPayload: JSON.parse(JSON.stringify(executionResultPayload)),
          correlationId: correlationId
        }
      });
      console.log(
        `Execution logged for job ${job.id} with status ${executionStatus}.`
      );
    } else {
      console.warn(
        `Could not log execution for job ${job.id} as action/rule data was missing.`
      );
    }
  }
}

// --- Handler GET (Worker Endpoint) ---
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const job = await db.$transaction(async () => {
    const [job] = await db.$queryRaw<Queue[]>`
        UPDATE "Queue"
        SET status = 'processing', attempts = attempts + 1, processingStartedAt = NOW()
        WHERE id = (
          SELECT id FROM "Queue"
          WHERE "Queue"."status" = 'pending' AND "Queue"."runAt" <= NOW()
          ORDER BY "Queue"."runAt" ASC, "Queue"."priority" DESC
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
      data: { status: 'completed', processingStartedAt: null }
    });

    console.log(`Job ${job.id} completed successfully.`);
    return NextResponse.json({ status: 'success', job }, { status: 200 });
  } catch (error: unknown) {
    console.error(`Failed to process job ${job?.id ?? 'unknown'}:`, error);

    // --- Logique de Retry (Simplifiée) ---
    // Ici, on pourrait vérifier si l'erreur est récupérable et si attempts < max
    // Si oui, remettre status='pending', augmenter runAt (backoff), et ne pas retourner 500.
    // Pour l'instant, on marque juste comme failed.
    // ------------------------------------
    await db.queue.update({
      where: { id: job.id },
      data: {
        status: 'failed',
        lastError: error instanceof Error ? error.message : String(error),
        processingStartedAt: null
      }
    });

    return NextResponse.json(
      { status: 'failed', error: String(error), job },
      { status: 500 }
    );
  }
}

// --- Handler POST (Création de Job - Simplifié) ---
// Note: La création de job devrait idéalement se faire via le processeur d'événements,
// mais cet endpoint peut être utile pour des tests ou des insertions manuelles.
export async function POST(request: Request) {
  try {
    // ATTENTION: Sécuriser cet endpoint dans une vraie application !
    const { job, payload, runAt, priority, userId, correlationId } =
      await request.json();

    if (!job || !payload) {
      return NextResponse.json(
        {
          error: 'Missing parameters',
          request: { job, payload, runAt, priority, userId, correlationId }
        },
        { status: 400 }
      );
    }

    const queue = await db.queue.create({
      data: {
        job,
        payload,
        runAt: runAt ? new Date(runAt) : new Date(),
        priority: priority ?? 0,
        userId,
        correlationId
      }
    });

    return NextResponse.json({ job: queue }, { status: 201 });
  } catch (error) {
    console.error('Error creating queue job:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
