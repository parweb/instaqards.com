/*
  Warnings:

  - You are about to drop the column `event` on the `Queue` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('SEND_EMAIL', 'UPDATE_USER_FIELD', 'CALL_WEBHOOK', 'ADD_USER_TAG', 'REMOVE_USER_TAG', 'SEND_PUSH_NOTIFICATION', 'CREATE_QUEUE_TASK');

-- CreateEnum
CREATE TYPE "ConditionType" AS ENUM ('USER_PROPERTY', 'SUBSCRIPTION_STATUS', 'EVENT_HISTORY_COUNT', 'EVENT_HISTORY_EXISTS', 'TRIGGER_PAYLOAD');

-- CreateEnum
CREATE TYPE "Operator" AS ENUM ('AND', 'OR');

-- CreateEnum
CREATE TYPE "WorkflowStateStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ExecutionStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED');

-- DropIndex
DROP INDEX "Queue_id_idx";

-- DropIndex
DROP INDEX "Queue_runAt_idx";

-- DropIndex
DROP INDEX "Queue_status_idx";

-- AlterTable
ALTER TABLE "Queue" DROP COLUMN "event",
ADD COLUMN     "correlationId" TEXT,
ADD COLUMN     "job" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "processingStartedAt" TIMESTAMPTZ,
ADD COLUMN     "userId" TEXT,
ADD COLUMN     "workerId" TEXT;

-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "ended_at" DROP DEFAULT,
ALTER COLUMN "cancel_at" DROP DEFAULT,
ALTER COLUMN "canceled_at" DROP DEFAULT,
ALTER COLUMN "trial_start" DROP DEFAULT,
ALTER COLUMN "trial_end" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "internalName" TEXT NOT NULL,
    "description" TEXT,
    "actionType" "ActionType" NOT NULL,
    "config" JSONB NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workflow" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trigger" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Trigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rule" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "triggerId" TEXT NOT NULL,
    "delayMinutes" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Condition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "ConditionType" NOT NULL,
    "parameters" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Condition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RuleCondition" (
    "ruleId" TEXT NOT NULL,
    "conditionId" TEXT NOT NULL,
    "group" INTEGER NOT NULL DEFAULT 1,
    "logic" "Operator" NOT NULL DEFAULT 'AND',

    CONSTRAINT "RuleCondition_pkey" PRIMARY KEY ("ruleId","conditionId")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB,
    "correlationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowState" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "status" "WorkflowStateStatus" NOT NULL DEFAULT 'ACTIVE',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Execution" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "ruleId" TEXT,
    "executedAt" TIMESTAMP(3),
    "status" "ExecutionStatus" NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "resultPayload" JSONB,
    "correlationId" TEXT,

    CONSTRAINT "Execution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Action_internalName_key" ON "Action"("internalName");

-- CreateIndex
CREATE UNIQUE INDEX "Workflow_name_key" ON "Workflow"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Trigger_code_key" ON "Trigger"("code");

-- CreateIndex
CREATE INDEX "Rule_workflowId_isActive_idx" ON "Rule"("workflowId", "isActive");

-- CreateIndex
CREATE INDEX "Rule_triggerId_isActive_idx" ON "Rule"("triggerId", "isActive");

-- CreateIndex
CREATE INDEX "Rule_actionId_idx" ON "Rule"("actionId");

-- CreateIndex
CREATE UNIQUE INDEX "Condition_name_key" ON "Condition"("name");

-- CreateIndex
CREATE INDEX "RuleCondition_conditionId_idx" ON "RuleCondition"("conditionId");

-- CreateIndex
CREATE INDEX "Event_userId_createdAt_idx" ON "Event"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Event_eventType_createdAt_idx" ON "Event"("eventType", "createdAt");

-- CreateIndex
CREATE INDEX "Event_correlationId_idx" ON "Event"("correlationId");

-- CreateIndex
CREATE INDEX "WorkflowState_status_idx" ON "WorkflowState"("status");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowState_userId_workflowId_key" ON "WorkflowState"("userId", "workflowId");

-- CreateIndex
CREATE INDEX "Execution_userId_executedAt_idx" ON "Execution"("userId", "executedAt");

-- CreateIndex
CREATE INDEX "Execution_actionId_idx" ON "Execution"("actionId");

-- CreateIndex
CREATE INDEX "Execution_status_idx" ON "Execution"("status");

-- CreateIndex
CREATE INDEX "Execution_executedAt_idx" ON "Execution"("executedAt");

-- CreateIndex
CREATE INDEX "Execution_correlationId_idx" ON "Execution"("correlationId");

-- CreateIndex
CREATE INDEX "Execution_ruleId_idx" ON "Execution"("ruleId");

-- CreateIndex
CREATE INDEX "Queue_priority_status_runAt_idx" ON "Queue"("priority" DESC, "status", "runAt");

-- CreateIndex
CREATE INDEX "Queue_correlationId_idx" ON "Queue"("correlationId");

-- CreateIndex
CREATE INDEX "Queue_userId_idx" ON "Queue"("userId");

-- CreateIndex
CREATE INDEX "Queue_job_idx" ON "Queue"("job");

-- CreateIndex
CREATE INDEX "Subscription_trial_end_idx" ON "Subscription"("trial_end");

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "Trigger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RuleCondition" ADD CONSTRAINT "RuleCondition_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "Rule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RuleCondition" ADD CONSTRAINT "RuleCondition_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "Condition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowState" ADD CONSTRAINT "WorkflowState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowState" ADD CONSTRAINT "WorkflowState_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Execution" ADD CONSTRAINT "Execution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Execution" ADD CONSTRAINT "Execution_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Execution" ADD CONSTRAINT "Execution_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "Rule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastError" TEXT,
ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'pending';

/*
  Warnings:

  - You are about to drop the column `workerId` on the `Queue` table. All the data in the column will be lost.
  - Changed the type of `actionType` on the `Action` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Action" DROP COLUMN "actionType",
ADD COLUMN     "actionType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Queue" DROP COLUMN "workerId";

-- DropEnum
DROP TYPE "ActionType";

/*
  Warnings:

  - You are about to drop the column `actionType` on the `Action` table. All the data in the column will be lost.
  - Added the required column `type` to the `Action` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Action" DROP COLUMN "actionType",
ADD COLUMN     "type" TEXT NOT NULL;


/*
  Warnings:

  - You are about to drop the column `internalName` on the `Action` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Action` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Action` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Action_internalName_key";

-- AlterTable
ALTER TABLE "public"."Action" RENAME COLUMN "internalName" TO "code";

-- CreateIndex
CREATE UNIQUE INDEX "Action_code_key" ON "Action"("code");
