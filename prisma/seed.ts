// import { nanoid } from 'nanoid';

import {
  ConditionType,
  Operator,
  PrismaClient,
  UserRole
} from '@prisma/client';
import { min } from 'date-fns';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

const populateAllLeadWithDefaultSite = async () => {
  await prisma.site.deleteMany({
    where: {
      display_name: 'auto-generated'
    }
  });

  const leads = await prisma.user.findMany({
    // take: 100,
    where: {
      bounced: { lte: 0 },
      role: UserRole.LEAD,
      sites: {
        none: {}
      }
    }
  });

  console.log({ leads: leads.map(({ id }) => id) });

  for (const lead of leads) {
    const name = lead.name || lead.email.split('@')[0].replaceAll('.', ' ');
    const subdomain = (
      name.trim().replace(/[\W_]+/g, '-') +
      '-' +
      nanoid(3)
    ).toLowerCase();

    // format with a . every 2 characters
    const phone = String(lead?.phone ?? '')
      .padStart(10, '0')
      .replace(/(.{2})/g, '$1.')
      .slice(0, 14);

    await prisma.site.create({
      data: {
        userId: lead.id,
        name,
        display_name: 'auto-generated',
        subdomain,
        background: '/api/file?id=dr0uR6kMbKHxyG0ha7U1D.png',
        blocks: {
          create: [
            {
              type: 'main',
              position: 0,
              style: {},
              widget: {
                id: 'logo-circle',
                data: {
                  size: 163,
                  corner: 100,
                  medias: [
                    {
                      id: 'Fb9NpCK41pkLF80OUkmp4',
                      url: '/api/file?id=Fb9NpCK41pkLF80OUkmp4.png',
                      kind: 'remote'
                    }
                  ]
                },
                type: 'picture'
              }
            },
            {
              type: 'main',
              position: 1,
              style: {},
              widget: {
                id: 'simple',
                data: {
                  corner: 100,
                  radius: 150,
                  socials: [
                    {
                      id: '1K9k4u-LVm06fxz4e6KxW',
                      href: 'https://facebook.com/',
                      logo: 'facebook'
                    },
                    {
                      id: 'YOjTT0BrampOd3nC5Qm8u',
                      href: 'https://www.instagram.com/',
                      logo: 'instagram'
                    },
                    {
                      id: 'Iq2nzvPs7y7wsQonKtAf4',
                      href: 'https://www.tiktok.com/fr/',
                      logo: 'tiktok'
                    }
                  ],
                  distribution: 80
                },
                type: 'social'
              }
            },
            {
              type: 'main',
              position: 2,
              style: {},
              widget: {
                id: 'normal',
                data: {
                  font: {
                    color: '#ffff',
                    fontSize: '16px',
                    textAlign: 'center',
                    fontFamily: 'Boldonse'
                  },
                  text: name.toUpperCase(),
                  container: {
                    margin: '0px',
                    padding: '0px',
                    borderColor: '#ffffff00',
                    borderWidth: '1px',
                    borderRadius: '0px',
                    backgroundColor: '#ffffff00'
                  }
                },
                type: 'text'
              }
            },
            {
              type: 'main',
              position: 3,
              style: {},
              widget: {
                id: 'icon',
                data: {
                  href: `tel:${phone.replaceAll('.', '')}`,
                  color: '#000000',
                  label: phone,
                  images: [
                    {
                      id: 'Sk0YtBk8xBUs3AIgRzNrs',
                      url: '/api/file?id=Sk0YtBk8xBUs3AIgRzNrs.png',
                      kind: 'remote'
                    }
                  ],
                  background: '#ffffff'
                },
                type: 'button'
              }
            },
            {
              type: 'main',
              position: 4,
              style: {},
              widget: { id: 'reservation', data: {}, type: 'other' }
            },
            {
              type: 'main',
              position: 5,
              style: {},
              widget: {
                id: 'maps',
                data: {
                  label: name.toUpperCase(),
                  position: {
                    // types: ['premise', 'street_address'],
                    geometry: {
                      // bounds: {
                      //   northeast: { lat: 48.8445605, lng: 2.7876196 },
                      //   southwest: { lat: 48.8444277, lng: 2.7874327 }
                      // },
                      location: {
                        // @ts-ignore
                        lng: lead.location?.geometry?.coordinates?.[0],
                        // @ts-ignore
                        lat: lead.location?.geometry?.coordinates?.[1]
                      }
                      // viewport: {
                      //   northeast: {
                      //     lat: 48.84584383029149,
                      //     lng: 2.788876330291502
                      //   },
                      //   southwest: {
                      //     lat: 48.84314586970849,
                      //     lng: 2.786178369708498
                      //   }
                      // },
                      // location_type: 'ROOFTOP'
                    },
                    place_id: nanoid(),
                    components: {
                      street_number:
                        // @ts-ignore
                        lead.location?.properties?.housenumber ?? false,
                      // @ts-ignore
                      route: lead.location?.properties?.street ?? false,
                      // @ts-ignore
                      postal_code: lead.location?.properties?.postcode ?? false,
                      // @ts-ignore
                      locality: lead.location?.properties?.city ?? false
                    },
                    // @ts-ignore
                    formatted_address: lead.location?.properties?.label
                    // navigation_points: [
                    //   {
                    //     location: { latitude: 48.8445274, longitude: 2.787542 }
                    //   }
                    // ],
                    // address_components: [
                    //   {
                    //     types: ['street_number'],
                    //     long_name: '11',
                    //     short_name: '11'
                    //   },
                    //   {
                    //     types: ['route'],
                    //     long_name: 'Rue Emile Cloud',
                    //     short_name: 'Rue Emile Cloud'
                    //   },
                    //   {
                    //     types: ['locality', 'political'],
                    //     long_name: 'Serris',
                    //     short_name: 'Serris'
                    //   },
                    //   {
                    //     types: ['administrative_area_level_2', 'political'],
                    //     long_name: 'Seine-et-Marne',
                    //     short_name: 'Seine-et-Marne'
                    //   },
                    //   {
                    //     types: ['administrative_area_level_1', 'political'],
                    //     long_name: 'Île-de-France',
                    //     short_name: 'IDF'
                    //   },
                    //   {
                    //     types: ['country', 'political'],
                    //     long_name: 'France',
                    //     short_name: 'FR'
                    //   },
                    //   {
                    //     types: ['postal_code'],
                    //     long_name: '77700',
                    //     short_name: '77700'
                    //   }
                    // ]
                  }
                },
                type: 'other'
              }
            }
          ]
        }
      }
    });
  }

  console.log({ count: leads.length });
};

const testGuestUser = async () => {
  await prisma.user.create({
    data: {
      email: 'ploop'
    }
  });
};

const seedWorkflow = async () => {
  console.info('Starting workflow seeding...');
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
  console.info(`Workflow upserted: ${onboardingWorkflow.id}`);
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
  console.info('Triggers upserted.');
  // 3. Actions (ActionTemplates) - Plusieurs types !
  const welcomeEmailAction = await prisma.action.upsert({
    where: { code: 'onboarding_welcome_email' },
    update: {},
    create: {
      code: 'onboarding_welcome_email',
      type: 'SEND_EMAIL',
      version: 1,
      description: 'Envoie un email de bienvenue aux nouveaux utilisateurs',
      config: {
        function: 'sendWelcomeEmail',
        email: '{{user.email}}'
      }
    }
  });
  const addCreatorTagAction = await prisma.action.upsert({
    where: { code: 'tag_user_creator' },
    update: {},
    create: {
      code: 'tag_user_creator',
      type: 'ADD_USER_TAG',
      version: 1,
      description: 'Ajoute le tag "creator" à un utilisateur',
      config: { tagName: 'creator' } // Le code exécutant cette action saura quoi faire avec "tagName"
    }
  });
  const notifyCsWebhookAction = await prisma.action.upsert({
    where: { code: 'webhook_cs_new_creator' },
    update: {},
    create: {
      code: 'webhook_cs_new_creator',
      type: 'CALL_WEBHOOK',
      version: 1,
      description: "Notifie le service client de la création d'un nouveau site",
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
    where: { code: 'reengagement_inactive_trial' },
    update: {},
    create: {
      code: 'reengagement_inactive_trial',
      type: 'SEND_EMAIL',
      version: 1,
      description:
        "Envoie un email de réengagement aux utilisateurs inactifs en période d'essai",
      config: {
        subject: 'On ne vous voit plus, {{user.name}} ?',
        bodyHtml: "<p>Besoin d'aide pour continuer ? ...</p>",
        bodyText: '...'
      }
    }
  });
  const trialReminderEmailAction = await prisma.action.upsert({
    where: { code: 'email_trial_reminder_3d' },
    update: {},
    create: {
      code: 'email_trial_reminder_3d',
      type: 'SEND_EMAIL',
      version: 1,
      description:
        "Rappelle aux utilisateurs que leur période d'essai se termine dans 3 jours",
      config: {
        subject: "🚨 Plus que 3 jours d'essai !",
        bodyHtml: '<p>Finalisez votre choix pour ne rien perdre...</p>',
        bodyText: '...'
      }
    }
  });
  const notifySalesWebhookAction = await prisma.action.upsert({
    where: { code: 'webhook_sales_trial_ending' },
    update: {},
    create: {
      code: 'webhook_sales_trial_ending',
      type: 'CALL_WEBHOOK',
      version: 1,
      description: "Notifie l'équipe commerciale des fins de période d'essai",
      config: {
        url: 'https://hooks.zapier.com/hooks/catch/YOUR/ZAPIER/WEBHOOK_OR_INTERNAL', // Autre URL exemple
        method: 'POST',
        bodyTemplate:
          '{ "event": "trial_ending_soon", "userId": "{{user.id}}", "userEmail": "{{user.email}}", "trialEndDate": "{{user.subscriptions[0].trial_end}}", "daysLeft": "{{event.payload.daysLeft}}" }' // Envoyer des données structurées
      }
    }
  });
  console.info('ActionTemplates upserted.');
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
  console.info('Conditions upserted.');
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
  console.info('Workflow Rules and Conditions created/linked.');
  await prisma.user.create({
    data: {
      id: 'cm8zwbi0y0001spa09s9s7eat',
      email: 'parweb@gmail.com',
      emailVerified: new Date(),
      role: UserRole.ADMIN,
      sites: {
        create: {
          name: 'yolo',
          subdomain: 'yolo',
          blocks: {
            create: {
              type: 'main',
              position: 0,
              widget: {
                id: 'profile',
                data: {
                  name: 'kjzegh',
                  images: [
                    {
                      id: '1',
                      url: 'https://qards.link/rsz_noir-fon-transparent.png',
                      kind: 'remote'
                    }
                  ],
                  description: ''
                },
                type: 'other'
              }
            }
          }
        }
      },
      events: {
        create: [
          {
            eventType: 'USER_SIGNUP',
            correlationId: nanoid(),
            payload: {
              user: {
                id: 'cm8zwbi0y0001spa09s9s7eat',
                name: null,
                role: UserRole.USER,
                email: 'parweb@gmail.com',
                image: null,
                password: null,
                createdAt: '2025-04-02T12:21:09.250Z',
                refererId: null,
                updatedAt: '2025-04-02T12:21:09.250Z',
                emailVerified: '2025-04-02T12:21:09.248Z',
                payment_method: {},
                billing_address: {},
                isTwoFactorEnabled: false
              }
            }
          },
          {
            eventType: 'SITE_CREATED',
            correlationId: nanoid(),
            payload: {
              id: 'cm8zwbl6r0004spa0p7f3baps',
              font: 'font-cal',
              logo: 'https://qards.link/rsz_noir-fon-transparent.png',
              name: 'kjzegh',
              image: 'https://qards.link/site-default.png',
              userId: 'cm8zwbi0y0001spa09s9s7eat',
              createdAt: '2025-04-02T12:21:13.348Z',
              subdomain: 'kjzegh',
              updatedAt: '2025-04-02T12:21:13.348Z',
              background: null,
              message404: "Blimey! You've found a page that doesn't exist.",
              description: '',
              customDomain: null,
              display_name: null,
              imageBlurhash:
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAhCAYAAACbffiEAAAACXBIWXMAABYlAAAWJQFJUiTwAAABfUlEQVR4nN3XyZLDIAwE0Pz/v3q3r55JDlSBplsIEI49h76k4opexCK/juP4eXjOT149f2Tf9ySPgcjCc7kdpBTgDPKByKK2bTPFEdMO0RDrusJ0wLRBGCIuelmWJAjkgPGDSIQEMBDCfA2CEPM80+Qwl0JkNxBimiaYGOTUlXYI60YoehzHJDEm7kxjV3whOQTD3AaCuhGKHoYhyb+CBMwjIAFz647kTqyapdV4enGINuDJMSScPmijSwjCaHeLcT77C7EC0C1ugaCTi2HYfAZANgj6Z9A8xY5eiYghDMNQBJNCWhASot0jGsSCUiHWZcSGQjaWWCDaGMOWnsCcn2QhVkRuxqqNxMSdUSElCDbp1hbNOsa6Ugxh7xXauF4DyM1m5BLtCylBXgaxvPXVwEoOBjeIFVODtW74oj1yBQah3E8tyz3SkpolKS9Geo9YMD1QJR1Go4oJkgO1pgbNZq0AOUPChyjvh7vlXaQa+X1UXwKxgHokB2XPxbX+AnijwIU4ahazAAAAAElFTkSuQmCC'
            }
          }
        ]
      }
    }
  });
};

(async () => {
  // await seedWorkflow()
  // await populateAllLeadWithDefaultSite();
  // await testGuestUser();
})()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
