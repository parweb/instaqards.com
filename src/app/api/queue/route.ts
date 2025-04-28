import { ExecutionStatus, WorkflowStateStatus } from '@prisma/client';
import { type NextRequest, NextResponse } from 'next/server';

import type {
  Action,
  Condition,
  Event,
  Prisma,
  Queue,
  RuleCondition,
  Subscription,
  User
} from '@prisma/client';

import { db } from 'helpers/db';
import * as template from 'helpers/mail';
import { sendCampaignEmail } from 'helpers/sendCampaignEmail';

export const runtime = 'nodejs';

interface ExecuteWorkflowActionPayload {
  ruleId: string;
  triggeringEventId: string;
  userId: string;
  correlationId?: string;
}

const conditionEngine = {
  evaluate: async (
    ruleConditions: (RuleCondition & { condition: Condition })[],
    _user: User,
    _triggeringEvent: Event,
    _subscription: Subscription | null
  ): Promise<boolean> => {
    console.info(`[Condition Engine] Evaluating conditions for rule...`);
    if (!ruleConditions || ruleConditions.length === 0) {
      console.info(
        '[Condition Engine] No conditions to evaluate, returning true.'
      );
      return true;
    }

    const conditionsMet = true;
    console.info(
      `[Condition Engine] Conditions evaluated. Result: ${conditionsMet}`
    );
    return conditionsMet;
  }
};

const actionExecutor = {
  execute: async (
    type: Action['type'],
    config: Prisma.JsonValue,
    user: User,
    _triggeringEvent: Event,
    job: Queue
  ): Promise<{
    success: boolean;
    resultPayload?: any;
    errorMessage?: string;
  }> => {
    console.info(`[Action Executor] Executing action type: ${type}`);

    try {
      switch (type) {
        case 'SEND_EMAIL':
          const params = config as { email: string; function: string };

          console.info('actionExecutor::SEND_EMAIL', {
            config,
            job,
            template,
            params
          });

          const mailFunction =
            template[params.function as keyof typeof template];

          if (!mailFunction) {
            throw new Error(`Invalid email function: ${params.function}`);
          }

          // @ts-ignore
          await mailFunction(
            params.email.replace('{{user.email}}', user.email)
          );

          return { success: true };

        default:
          console.warn(`[Action Executor] Unhandled action type: ${type}`);

          throw new Error(`[Action Executor] Unhandled action type: ${type}`);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(
        `[Action Executor] Error executing action ${type}:`,
        message
      );
      return { success: false, errorMessage: message };
    }
  }
};

async function processJob(job: Queue): Promise<void> {
  console.info(`Processing job ${job.id} (Type: ${job.job})`);

  if (job.job === 'EXECUTE_WORKFLOW_ACTION') {
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
    let executionStatus: ExecutionStatus = ExecutionStatus.PENDING;
    let executionResultPayload: Prisma.JsonValue | null = null;
    let executionErrorMessage: string | null = null;
    let actionToExecute: Action | null = null;

    try {
      const rule = await db.rule.findUnique({
        where: { id: ruleId },
        include: {
          action: true,
          trigger: true,
          workflow: true,
          ruleConditions: {
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
        console.info(
          `Rule ${ruleId} not found, inactive, or workflow inactive. Skipping job ${job.id}.`
        );

        await db.queue.update({
          where: { id: job.id },
          data: { status: 'completed' }
        });

        return;
      }
      actionToExecute = rule.action;

      const user = await db.user.findUnique({ where: { id: userId } });
      const triggeringEvent = await db.event.findUnique({
        where: { id: triggeringEventId }
      });

      if (!user || !triggeringEvent) {
        throw new Error(
          `User ${userId} or Triggering Event ${triggeringEventId} not found for job ${job.id}.`
        );
      }

      const subscription = await db.subscription.findFirst({
        where: { userId: userId },
        orderBy: { created: 'desc' }
      });

      const workflowState = await db.workflowState.findUnique({
        where: {
          userId_workflowId: { userId: userId, workflowId: rule.workflowId }
        }
      });

      if (
        !workflowState ||
        workflowState.status !== WorkflowStateStatus.ACTIVE
      ) {
        console.info(
          `User ${userId} is not ACTIVE in workflow ${rule.workflowId}. Skipping job ${job.id}.`
        );
        await db.queue.update({
          where: { id: job.id },
          data: { status: 'completed' }
        });

        return;
      }

      console.info(
        `Data loaded for job ${job.id}. User: ${user.email}, Rule: ${rule.id}, Trigger: ${triggeringEvent.eventType}`
      );

      const conditionsMet = await conditionEngine.evaluate(
        rule.ruleConditions,
        user,
        triggeringEvent,
        subscription
      );

      if (conditionsMet) {
        console.info(
          `Conditions MET for rule ${rule.id}. Executing action ${rule.action.code}...`
        );
        executionStatus = ExecutionStatus.PROCESSING;

        const executionResult = await actionExecutor.execute(
          rule.action.type,
          rule.action.config,
          user,
          triggeringEvent,
          job
        );

        executionStatus = executionResult.success
          ? ExecutionStatus.SUCCESS
          : ExecutionStatus.FAILED;
        executionResultPayload = executionResult.resultPayload ?? null;
        executionErrorMessage = executionResult.errorMessage ?? null;

        console.info(
          `Action execution finished for rule ${rule.id}. Status: ${executionStatus}`
        );
      } else {
        console.info(
          `Conditions NOT MET for rule ${rule.id}. Skipping action.`
        );

        executionStatus = ExecutionStatus.SUCCESS;
      }
    } catch (error: unknown) {
      console.error(`Error processing job ${job.id}:`, error);
      executionStatus = ExecutionStatus.FAILED;
      executionErrorMessage =
        error instanceof Error ? error.message : String(error);

      throw error;
    } finally {
      if (actionToExecute) {
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
        console.info(
          `Execution logged for job ${job.id} with status ${executionStatus}.`
        );
      } else {
        console.warn(
          `Could not log execution for job ${job.id} as action/rule data was missing.`
        );
      }
    }
  } else if (job.job === 'SEND_EMAIL_CAMPAIGN') {
    const payload = job?.payload as unknown as {
      contact: User;
      campaign: Prisma.CampaignGetPayload<{ include: { email: true } }>;
    };

    await sendCampaignEmail(payload.contact, payload.campaign);
  } else throw new Error(`Unsupported job type: ${job.job}`);
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const job = await db.$transaction(async () => {
    const [job] = await db.$queryRaw<Queue[]>`
        UPDATE "Queue"
        SET status = 'processing', attempts = attempts + 1, "processingStartedAt" = NOW()
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

    console.info(`Job ${job.id} completed successfully.`);
    return NextResponse.json({ status: 'success', job }, { status: 200 });
  } catch (error: unknown) {
    console.error(`Failed to process job ${job?.id ?? 'unknown'}:`, error);

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

export async function POST(request: Request) {
  try {
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
