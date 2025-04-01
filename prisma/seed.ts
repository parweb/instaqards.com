import { PrismaClient, ActionType, ConditionType, Operator } from '@prisma/client';

const prisma = new PrismaClient();

(async () => {
  console.log('Starting workflow seeding...');

  // 1. Workflow Principal
  const onboardingWorkflow = await prisma.workflow.upsert({
    where: { name: 'Onboarding Amélioré + Réengagement' },
    update: {},
    create: {
      name: 'Onboarding Amélioré + Réengagement',
      description:
        "Accueille, récompense la première action clé, réengage si inactif, et relance avant fin d'essai.",
      isDefault: true, // Appliqué aux nouveaux utilisateurs
      isActive: true
    }
  });

  console.log(`Workflow upserted: ${onboardingWorkflow.id}`);

  // 2. Triggers (Types d'événements)
  const signupTrigger = await prisma.trigger.upsert({
    where: { code: 'USER_SIGNUP' },
    update: {},
    create: { code: 'USER_SIGNUP', description: 'Utilisateur inscrit' }
  });
  const siteCreatedTrigger = await prisma.trigger.upsert({
    where: { code: 'SITE_CREATED' },
    update: {},
    create: { code: 'SITE_CREATED', description: 'Un site a été créé' }
  });
  const inactiveTrigger = await prisma.trigger.upsert({
    where: { code: 'USER_INACTIVE_5D' },
    update: {},
    create: {
      code: 'USER_INACTIVE_5D',
      description: 'Utilisateur inactif depuis 5 jours (via Cron)'
    }
  });
  const trialEndingTrigger = await prisma.trigger.upsert({
    where: { code: 'TRIAL_ENDING_ALERT' },
    update: {},
    create: {
      code: 'TRIAL_ENDING_ALERT',
      description: "Alerte de fin d'essai (via Cron)"
    }
  });
  console.log('Triggers upserted.');

  // 3. Actions (ActionTemplates) - Plusieurs types !
  const welcomeEmailAction = await prisma.action.upsert({
    where: { internalName: 'onboarding_welcome_email' },
    update: {},
    create: {
      internalName: 'onboarding_welcome_email',
      actionType: ActionType.SEND_EMAIL,
      version: 1,
      description: 'Envoie un email de bienvenue aux nouveaux utilisateurs',
      config: {
        subject: 'Bienvenue chez [App Name], {{user.name}} !',
        bodyHtml: '<p>Ravi de vous compter parmi nous...</p>',
        bodyText: '...'
      }
    }
  });

  const addCreatorTagAction = await prisma.action.upsert({
    where: { internalName: 'tag_user_creator' },
    update: {},
    create: {
      internalName: 'tag_user_creator',
      actionType: ActionType.ADD_USER_TAG,
      version: 1,
      description: 'Ajoute le tag "creator" à un utilisateur',
      config: { tagName: 'creator' } // Le code exécutant cette action saura quoi faire avec "tagName"
    }
  });

  const notifyCsWebhookAction = await prisma.action.upsert({
    where: { internalName: 'webhook_cs_new_creator' },
    update: {},
    create: {
      internalName: 'webhook_cs_new_creator',
      actionType: ActionType.CALL_WEBHOOK,
      version: 1,
      description: 'Notifie le service client de la création d\'un nouveau site',
      config: {
        url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK_OR_ZAPIER', // URL exemple
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        bodyTemplate:
          '{ "text": "🎉 Nouveau créateur ! Utilisateur {{user.name}} ({{user.email}}) vient de créer son premier site : {{event.payload.siteName}} (ID: {{event.payload.siteId}})" }'
      }
    }
  });

  const reengagementEmailAction = await prisma.action.upsert({
    where: { internalName: 'reengagement_inactive_trial' },
    update: {},
    create: {
      internalName: 'reengagement_inactive_trial',
      actionType: ActionType.SEND_EMAIL,
      version: 1,
      description: 'Envoie un email de réengagement aux utilisateurs inactifs en période d\'essai',
      config: {
        subject: 'On ne vous voit plus, {{user.name}} ?',
        bodyHtml: "<p>Besoin d'aide pour continuer ? ...</p>",
        bodyText: '...'
      }
    }
  });

  const trialReminderEmailAction = await prisma.action.upsert({
    where: { internalName: 'email_trial_reminder_3d' },
    update: {},
    create: {
      internalName: 'email_trial_reminder_3d',
      actionType: ActionType.SEND_EMAIL,
      version: 1,
      description: 'Rappelle aux utilisateurs que leur période d\'essai se termine dans 3 jours',
      config: {
        subject: "🚨 Plus que 3 jours d'essai !",
        bodyHtml: '<p>Finalisez votre choix pour ne rien perdre...</p>',
        bodyText: '...'
      }
    }
  });

  const notifySalesWebhookAction = await prisma.action.upsert({
    where: { internalName: 'webhook_sales_trial_ending' },
    update: {},
    create: {
      internalName: 'webhook_sales_trial_ending',
      actionType: ActionType.CALL_WEBHOOK,
      version: 1,
      description: 'Notifie l\'équipe commerciale des fins de période d\'essai',
      config: {
        url: 'https://hooks.zapier.com/hooks/catch/YOUR/ZAPIER/WEBHOOK_OR_INTERNAL', // Autre URL exemple
        method: 'POST',
        bodyTemplate:
          '{ "event": "trial_ending_soon", "userId": "{{user.id}}", "userEmail": "{{user.email}}", "trialEndDate": "{{user.subscriptions[0].trial_end}}", "daysLeft": "{{event.payload.daysLeft}}" }' // Envoyer des données structurées
      }
    }
  });

  console.log('ActionTemplates upserted.');

  // 4. Conditions (Réutilisables)
  const isFirstSiteCond = await prisma.condition.upsert({
    where: { name: 'Is First Site Created' },
    update: {},
    create: {
      name: 'Is First Site Created',
      type: ConditionType.EVENT_HISTORY_COUNT,
      parameters: { eventType: 'SITE_CREATED', operator: '==', value: 1 }
    }
  });

  const isTrialingCond = await prisma.condition.upsert({
    where: { name: 'User Is Trialing' },
    update: {},
    create: {
      name: 'User Is Trialing',
      type: ConditionType.SUBSCRIPTION_STATUS,
      parameters: { status: ['trialing'], trialEnd: 'isFuture' } // Vérifie statut et date de fin
    }
  });

  const isNotActiveSubCond = await prisma.condition.upsert({
    where: { name: 'User Is Not Active Subscriber' },
    update: {},
    create: {
      name: 'User Is Not Active Subscriber',
      type: ConditionType.SUBSCRIPTION_STATUS,
      parameters: { notStatus: ['active'] } // Vérifie qu'il n'y a PAS d'abo actif
    }
  });

  const is3DaysLeftCond = await prisma.condition.upsert({
    where: { name: 'Trial Ends in 3 Days' },
    update: {},
    create: {
      name: 'Trial Ends in 3 Days',
      type: ConditionType.TRIGGER_PAYLOAD,
      parameters: { daysLeft: { equals: 3 } } // Vérifie le payload de l'event TRIAL_ENDING_ALERT
    }
  });

  console.log('Conditions upserted.');

  // 5. Règles du Workflow (WorkflowRules)
  // Règle 1: Bienvenue Email
  await prisma.rule.upsert({
    where: { id: 'welcome_email_rule' },
    update: {},
    create: {
      id: 'welcome_email_rule',
      workflowId: onboardingWorkflow.id,
      actionId: welcomeEmailAction.id,
      triggerId: signupTrigger.id,
      delayMinutes: 0,
      order: 1,
      isActive: true,
      version: 1
      // Aucune condition spécifique ici
    }
  });

  // Règle 2: Tag Creator après 1er site
  const rule2 = await prisma.rule.create({
    // create pour l'exemple
    data: {
      workflowId: onboardingWorkflow.id,
      actionId: addCreatorTagAction.id,
      triggerId: siteCreatedTrigger.id,
      delayMinutes: 0,
      order: 2,
      isActive: true,
      version: 1
      // ruleConditions: sera ajouté ci-dessous
    }
  });

  await prisma.ruleCondition.create({
    data: {
      ruleId: rule2.id,
      conditionId: isFirstSiteCond.id,
      logic: Operator.AND
    }
  });

  // Règle 3: Webhook CS après 1er site (avec léger délai)
  const rule3 = await prisma.rule.create({
    // create pour l'exemple
    data: {
      workflowId: onboardingWorkflow.id,
      actionId: notifyCsWebhookAction.id,
      triggerId: siteCreatedTrigger.id,
      delayMinutes: 2,
      order: 3,
      isActive: true,
      version: 1 // Délai de 2 minutes
    }
  });

  await prisma.ruleCondition.create({
    data: { ruleId: rule3.id, conditionId: isFirstSiteCond.id }
  });

  // Règle 4: Email Réengagement si Inactif 5j ET en essai
  const rule4 = await prisma.rule.create({
    // create pour l'exemple
    data: {
      workflowId: onboardingWorkflow.id,
      actionId: reengagementEmailAction.id,
      triggerId: inactiveTrigger.id,
      delayMinutes: 0,
      order: 4,
      isActive: true,
      version: 1
    }
  });

  // Appliquer la condition : doit être en essai
  await prisma.ruleCondition.create({
    data: {
      ruleId: rule4.id,
      conditionId: isTrialingCond.id,
      logic: Operator.AND
    }
  });

  // Règle 5: Email Rappel J-3 si pas abonné
  const rule5 = await prisma.rule.create({
    // create pour l'exemple
    data: {
      workflowId: onboardingWorkflow.id,
      actionId: trialReminderEmailAction.id,
      triggerId: trialEndingTrigger.id,
      delayMinutes: 0,
      order: 5,
      isActive: true,
      version: 1
    }
  });

  // Conditions: J-3 ET Pas Abonné Actif (logique AND par défaut)
  await prisma.ruleCondition.create({
    data: {
      ruleId: rule5.id,
      conditionId: is3DaysLeftCond.id,
      logic: Operator.AND
    }
  });
  await prisma.ruleCondition.create({
    data: {
      ruleId: rule5.id,
      conditionId: isNotActiveSubCond.id,
      logic: Operator.AND
    }
  });

  // Règle 6: Webhook Sales J-3 si pas abonné
  const rule6 = await prisma.rule.create({
    // create pour l'exemple
    data: {
      workflowId: onboardingWorkflow.id,
      actionId: notifySalesWebhookAction.id,
      triggerId: trialEndingTrigger.id,
      delayMinutes: 0,
      order: 6,
      isActive: true,
      version: 1
    }
  });

  // Mêmes conditions que Règle 5
  await prisma.ruleCondition.create({
    data: {
      ruleId: rule6.id,
      conditionId: is3DaysLeftCond.id,
      logic: Operator.AND
    }
  });
  await prisma.ruleCondition.create({
    data: {
      ruleId: rule6.id,
      conditionId: isNotActiveSubCond.id,
      logic: Operator.AND
    }
  });

  console.log('Workflow Rules and Conditions created/linked.');
  console.log('Seeding finished.');
})()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
