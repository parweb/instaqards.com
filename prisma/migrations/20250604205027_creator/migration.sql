-- CreateEnum
CREATE TYPE "MetricType" AS ENUM ('CLICKS', 'CONVERSIONS', 'POINTS_EARNED', 'SITES_CREATED', 'QUESTS_COMPLETED', 'SOCIAL_SHARES', 'REFERRALS');

-- CreateEnum
CREATE TYPE "TimePeriod" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('QUEST_NEW', 'QUEST_COMPLETED', 'QUEST_EXPIRED', 'REWARD_AVAILABLE', 'REWARD_CLAIMED', 'LEVEL_UP', 'BADGE_EARNED', 'POINTS_EARNED', 'SYSTEM_ANNOUNCEMENT');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('UNREAD', 'READ', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "QuestType" AS ENUM ('SITE_CREATION', 'SITE_COMPLETION', 'SOCIAL_SHARING', 'TRAFFIC_GENERATION', 'CONVERSION', 'SEASONAL', 'MILESTONE');

-- CreateEnum
CREATE TYPE "QuestStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'EXPIRED', 'DRAFT');

-- CreateEnum
CREATE TYPE "QuestDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD', 'EXPERT');

-- CreateEnum
CREATE TYPE "QuestStepStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "RewardType" AS ENUM ('POINTS', 'BADGE', 'POINTS_MULTIPLIER', 'LEVEL_UNLOCK', 'SPECIAL_ACCESS', 'PHYSICAL_REWARD');

-- CreateEnum
CREATE TYPE "RewardRarity" AS ENUM ('COMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- CreateEnum
CREATE TYPE "RewardStatus" AS ENUM ('AVAILABLE', 'CLAIMED', 'EXPIRED', 'PENDING_APPROVAL');

-- CreateEnum
CREATE TYPE "BadgeCategory" AS ENUM ('ACHIEVEMENT', 'MILESTONE', 'SEASONAL', 'SPECIAL', 'LEVEL');

-- CreateTable
CREATE TABLE "ConversionTracking" (
    "id" TEXT NOT NULL,
    "conversionType" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "landingPage" TEXT,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "clickId" TEXT,
    "campaignData" JSONB,
    "convertedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT NOT NULL,
    "siteId" TEXT,

    CONSTRAINT "ConversionTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialShareTracking" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "shareUrl" TEXT NOT NULL,
    "shareText" TEXT,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "postId" TEXT,
    "metadata" JSONB,
    "sharedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT NOT NULL,
    "siteId" TEXT,

    CONSTRAINT "SocialShareTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralTracking" (
    "id" TEXT NOT NULL,
    "referredEmail" TEXT NOT NULL,
    "referredName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "signedUpAt" TIMESTAMP(3),
    "convertedAt" TIMESTAMP(3),
    "referralCode" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "referrerId" TEXT NOT NULL,
    "referredId" TEXT,

    CONSTRAINT "ReferralTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Withdrawal" (
    "id" TEXT NOT NULL,
    "pointsAmount" INTEGER NOT NULL,
    "euroAmount" DOUBLE PRECISION NOT NULL,
    "exchangeRate" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentMethod" TEXT,
    "paymentData" JSONB,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "processedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Withdrawal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "priority" "NotificationPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "NotificationStatus" NOT NULL DEFAULT 'UNREAD',
    "imageUrl" TEXT,
    "actionUrl" TEXT,
    "metadata" JSONB,
    "scheduledFor" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" "NotificationPriority" NOT NULL DEFAULT 'MEDIUM',
    "conditions" JSONB,
    "imageUrl" TEXT,
    "actionUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" TEXT NOT NULL,
    "questNotifications" BOOLEAN NOT NULL DEFAULT true,
    "rewardNotifications" BOOLEAN NOT NULL DEFAULT true,
    "levelNotifications" BOOLEAN NOT NULL DEFAULT true,
    "pointsNotifications" BOOLEAN NOT NULL DEFAULT true,
    "systemNotifications" BOOLEAN NOT NULL DEFAULT true,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT true,
    "inAppEnabled" BOOLEAN NOT NULL DEFAULT true,
    "digestFrequency" TEXT NOT NULL DEFAULT 'daily',
    "quietHoursStart" INTEGER,
    "quietHoursEnd" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "QuestType" NOT NULL,
    "difficulty" "QuestDifficulty" NOT NULL DEFAULT 'EASY',
    "status" "QuestStatus" NOT NULL DEFAULT 'ACTIVE',
    "pointsReward" INTEGER NOT NULL DEFAULT 0,
    "targetValue" INTEGER,
    "timeLimit" INTEGER,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT,
    "theme" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestStep" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "status" "QuestStepStatus" NOT NULL DEFAULT 'PENDING',
    "targetType" TEXT,
    "targetValue" INTEGER,
    "validationUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "questId" TEXT NOT NULL,

    CONSTRAINT "QuestStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserQuest" (
    "id" TEXT NOT NULL,
    "status" "QuestStatus" NOT NULL DEFAULT 'ACTIVE',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "claimedAt" TIMESTAMP(3),
    "needsApproval" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "rejectedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "questId" TEXT NOT NULL,

    CONSTRAINT "UserQuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserQuestStep" (
    "id" TEXT NOT NULL,
    "status" "QuestStepStatus" NOT NULL DEFAULT 'PENDING',
    "completedAt" TIMESTAMP(3),
    "validationData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userQuestId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,

    CONSTRAINT "UserQuestStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reward" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "RewardType" NOT NULL,
    "rarity" "RewardRarity" NOT NULL DEFAULT 'COMMON',
    "pointsValue" INTEGER,
    "pointsMultiplier" DOUBLE PRECISION,
    "duration" INTEGER,
    "requiredPoints" INTEGER,
    "requiredLevel" INTEGER,
    "isLimited" BOOLEAN NOT NULL DEFAULT false,
    "maxClaims" INTEGER,
    "currentClaims" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "iconUrl" TEXT,
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "availableFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "availableUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserReward" (
    "id" TEXT NOT NULL,
    "status" "RewardStatus" NOT NULL DEFAULT 'AVAILABLE',
    "claimedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "claimData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "rewardId" TEXT NOT NULL,

    CONSTRAINT "UserReward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestReward" (
    "id" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "rewardId" TEXT NOT NULL,

    CONSTRAINT "QuestReward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "BadgeCategory" NOT NULL,
    "rarity" "RewardRarity" NOT NULL DEFAULT 'COMMON',
    "condition" TEXT NOT NULL,
    "targetValue" INTEGER,
    "iconUrl" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBadge" (
    "id" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,

    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorLevel" (
    "id" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requiredPoints" INTEGER NOT NULL,
    "requiredSites" INTEGER,
    "requiredClicks" INTEGER,
    "pointsMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "bonusMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "specialPerks" JSONB,
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "iconUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreatorLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PointsTransaction" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PointsTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ConversionTracking_creatorId_idx" ON "ConversionTracking"("creatorId");

-- CreateIndex
CREATE INDEX "ConversionTracking_convertedAt_idx" ON "ConversionTracking"("convertedAt");

-- CreateIndex
CREATE INDEX "ConversionTracking_conversionType_idx" ON "ConversionTracking"("conversionType");

-- CreateIndex
CREATE INDEX "ConversionTracking_siteId_idx" ON "ConversionTracking"("siteId");

-- CreateIndex
CREATE INDEX "ConversionTracking_clickId_idx" ON "ConversionTracking"("clickId");

-- CreateIndex
CREATE INDEX "ConversionTracking_creatorId_convertedAt_idx" ON "ConversionTracking"("creatorId", "convertedAt");

-- CreateIndex
CREATE INDEX "SocialShareTracking_creatorId_idx" ON "SocialShareTracking"("creatorId");

-- CreateIndex
CREATE INDEX "SocialShareTracking_platform_idx" ON "SocialShareTracking"("platform");

-- CreateIndex
CREATE INDEX "SocialShareTracking_sharedAt_idx" ON "SocialShareTracking"("sharedAt");

-- CreateIndex
CREATE INDEX "SocialShareTracking_siteId_idx" ON "SocialShareTracking"("siteId");

-- CreateIndex
CREATE INDEX "SocialShareTracking_creatorId_platform_idx" ON "SocialShareTracking"("creatorId", "platform");

-- CreateIndex
CREATE INDEX "ReferralTracking_referrerId_idx" ON "ReferralTracking"("referrerId");

-- CreateIndex
CREATE INDEX "ReferralTracking_referredId_idx" ON "ReferralTracking"("referredId");

-- CreateIndex
CREATE INDEX "ReferralTracking_status_idx" ON "ReferralTracking"("status");

-- CreateIndex
CREATE INDEX "ReferralTracking_createdAt_idx" ON "ReferralTracking"("createdAt");

-- CreateIndex
CREATE INDEX "ReferralTracking_referralCode_idx" ON "ReferralTracking"("referralCode");

-- CreateIndex
CREATE INDEX "Withdrawal_userId_idx" ON "Withdrawal"("userId");

-- CreateIndex
CREATE INDEX "Withdrawal_status_idx" ON "Withdrawal"("status");

-- CreateIndex
CREATE INDEX "Withdrawal_requestedAt_idx" ON "Withdrawal"("requestedAt");

-- CreateIndex
CREATE INDEX "Withdrawal_processedAt_idx" ON "Withdrawal"("processedAt");

-- CreateIndex
CREATE INDEX "Withdrawal_userId_requestedAt_idx" ON "Withdrawal"("userId", "requestedAt");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

-- CreateIndex
CREATE INDEX "Notification_status_idx" ON "Notification"("status");

-- CreateIndex
CREATE INDEX "Notification_priority_idx" ON "Notification"("priority");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "Notification_scheduledFor_idx" ON "Notification"("scheduledFor");

-- CreateIndex
CREATE INDEX "Notification_expiresAt_idx" ON "Notification"("expiresAt");

-- CreateIndex
CREATE INDEX "Notification_userId_status_idx" ON "Notification"("userId", "status");

-- CreateIndex
CREATE INDEX "NotificationTemplate_type_idx" ON "NotificationTemplate"("type");

-- CreateIndex
CREATE INDEX "NotificationTemplate_isActive_idx" ON "NotificationTemplate"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_userId_key" ON "NotificationPreference"("userId");

-- CreateIndex
CREATE INDEX "NotificationPreference_userId_idx" ON "NotificationPreference"("userId");

-- CreateIndex
CREATE INDEX "Quest_type_idx" ON "Quest"("type");

-- CreateIndex
CREATE INDEX "Quest_status_idx" ON "Quest"("status");

-- CreateIndex
CREATE INDEX "Quest_difficulty_idx" ON "Quest"("difficulty");

-- CreateIndex
CREATE INDEX "Quest_startDate_endDate_idx" ON "Quest"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "Quest_theme_idx" ON "Quest"("theme");

-- CreateIndex
CREATE INDEX "Quest_priority_idx" ON "Quest"("priority");

-- CreateIndex
CREATE INDEX "QuestStep_questId_order_idx" ON "QuestStep"("questId", "order");

-- CreateIndex
CREATE INDEX "QuestStep_targetType_idx" ON "QuestStep"("targetType");

-- CreateIndex
CREATE INDEX "UserQuest_userId_idx" ON "UserQuest"("userId");

-- CreateIndex
CREATE INDEX "UserQuest_questId_idx" ON "UserQuest"("questId");

-- CreateIndex
CREATE INDEX "UserQuest_status_idx" ON "UserQuest"("status");

-- CreateIndex
CREATE INDEX "UserQuest_completedAt_idx" ON "UserQuest"("completedAt");

-- CreateIndex
CREATE INDEX "UserQuest_needsApproval_idx" ON "UserQuest"("needsApproval");

-- CreateIndex
CREATE UNIQUE INDEX "UserQuest_userId_questId_key" ON "UserQuest"("userId", "questId");

-- CreateIndex
CREATE INDEX "UserQuestStep_userQuestId_idx" ON "UserQuestStep"("userQuestId");

-- CreateIndex
CREATE INDEX "UserQuestStep_stepId_idx" ON "UserQuestStep"("stepId");

-- CreateIndex
CREATE INDEX "UserQuestStep_status_idx" ON "UserQuestStep"("status");

-- CreateIndex
CREATE UNIQUE INDEX "UserQuestStep_userQuestId_stepId_key" ON "UserQuestStep"("userQuestId", "stepId");

-- CreateIndex
CREATE INDEX "Reward_type_idx" ON "Reward"("type");

-- CreateIndex
CREATE INDEX "Reward_rarity_idx" ON "Reward"("rarity");

-- CreateIndex
CREATE INDEX "Reward_requiredPoints_idx" ON "Reward"("requiredPoints");

-- CreateIndex
CREATE INDEX "Reward_requiredLevel_idx" ON "Reward"("requiredLevel");

-- CreateIndex
CREATE INDEX "Reward_availableFrom_availableUntil_idx" ON "Reward"("availableFrom", "availableUntil");

-- CreateIndex
CREATE INDEX "Reward_isLimited_idx" ON "Reward"("isLimited");

-- CreateIndex
CREATE INDEX "UserReward_userId_idx" ON "UserReward"("userId");

-- CreateIndex
CREATE INDEX "UserReward_rewardId_idx" ON "UserReward"("rewardId");

-- CreateIndex
CREATE INDEX "UserReward_status_idx" ON "UserReward"("status");

-- CreateIndex
CREATE INDEX "UserReward_claimedAt_idx" ON "UserReward"("claimedAt");

-- CreateIndex
CREATE INDEX "UserReward_expiresAt_idx" ON "UserReward"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserReward_userId_rewardId_key" ON "UserReward"("userId", "rewardId");

-- CreateIndex
CREATE INDEX "QuestReward_questId_idx" ON "QuestReward"("questId");

-- CreateIndex
CREATE INDEX "QuestReward_rewardId_idx" ON "QuestReward"("rewardId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestReward_questId_rewardId_key" ON "QuestReward"("questId", "rewardId");

-- CreateIndex
CREATE INDEX "Badge_category_idx" ON "Badge"("category");

-- CreateIndex
CREATE INDEX "Badge_rarity_idx" ON "Badge"("rarity");

-- CreateIndex
CREATE INDEX "Badge_isActive_idx" ON "Badge"("isActive");

-- CreateIndex
CREATE INDEX "UserBadge_userId_idx" ON "UserBadge"("userId");

-- CreateIndex
CREATE INDEX "UserBadge_badgeId_idx" ON "UserBadge"("badgeId");

-- CreateIndex
CREATE INDEX "UserBadge_earnedAt_idx" ON "UserBadge"("earnedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserBadge_userId_badgeId_key" ON "UserBadge"("userId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorLevel_level_key" ON "CreatorLevel"("level");

-- CreateIndex
CREATE INDEX "CreatorLevel_level_idx" ON "CreatorLevel"("level");

-- CreateIndex
CREATE INDEX "CreatorLevel_requiredPoints_idx" ON "CreatorLevel"("requiredPoints");

-- CreateIndex
CREATE INDEX "PointsTransaction_userId_idx" ON "PointsTransaction"("userId");

-- CreateIndex
CREATE INDEX "PointsTransaction_type_idx" ON "PointsTransaction"("type");

-- CreateIndex
CREATE INDEX "PointsTransaction_source_idx" ON "PointsTransaction"("source");

-- CreateIndex
CREATE INDEX "PointsTransaction_createdAt_idx" ON "PointsTransaction"("createdAt");

-- CreateIndex
CREATE INDEX "PointsTransaction_userId_createdAt_idx" ON "PointsTransaction"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "ConversionTracking" ADD CONSTRAINT "ConversionTracking_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversionTracking" ADD CONSTRAINT "ConversionTracking_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversionTracking" ADD CONSTRAINT "ConversionTracking_clickId_fkey" FOREIGN KEY ("clickId") REFERENCES "Click"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialShareTracking" ADD CONSTRAINT "SocialShareTracking_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialShareTracking" ADD CONSTRAINT "SocialShareTracking_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralTracking" ADD CONSTRAINT "ReferralTracking_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralTracking" ADD CONSTRAINT "ReferralTracking_referredId_fkey" FOREIGN KEY ("referredId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestStep" ADD CONSTRAINT "QuestStep_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuest" ADD CONSTRAINT "UserQuest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuest" ADD CONSTRAINT "UserQuest_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuestStep" ADD CONSTRAINT "UserQuestStep_userQuestId_fkey" FOREIGN KEY ("userQuestId") REFERENCES "UserQuest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuestStep" ADD CONSTRAINT "UserQuestStep_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "QuestStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReward" ADD CONSTRAINT "UserReward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReward" ADD CONSTRAINT "UserReward_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "Reward"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestReward" ADD CONSTRAINT "QuestReward_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestReward" ADD CONSTRAINT "QuestReward_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "Reward"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointsTransaction" ADD CONSTRAINT "PointsTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
