'use client';

import useTranslation from 'hooks/use-translation';
import { cn } from 'lib/utils';
import {
  LuCalendar,
  LuCircleCheck,
  LuGlobe,
  LuLayoutDashboard,
  LuLink,
  LuLoader,
  LuRocket,
  LuShare,
  LuSparkles,
  LuUsers,
  LuWand,
  LuZap
} from 'react-icons/lu';

interface OnboardingChecklistProps {
  state: {
    hasSite: boolean;
    hasDescription: boolean;
    hasCustomDomain: boolean;
    hasBlock: boolean;
    hasReservation: boolean;
    hasSubscriber: boolean;
    hasClick: boolean;
    hasSubscription: boolean;
    hasAffiliate: boolean;
    hasShare: boolean;
  };
}

const checklist = [
  {
    key: 'hasSite',
    label: {
      fr: 'Créer un site',
      en: 'Create a site',
      it: 'Crea un sito',
      es: 'Crear un sitio'
    },
    icon: <LuRocket className="w-5 h-5 mr-2" />
  },
  {
    key: 'hasCustomDomain',
    label: {
      fr: 'Configurer un domaine personnalisé',
      en: 'Configure a custom domain',
      it: 'Configura un dominio personalizzato',
      es: 'Configurar un dominio personalizado'
    },
    icon: <LuGlobe className="w-5 h-5 mr-2" />
  },
  {
    key: 'hasBlock',
    label: {
      fr: 'Ajouter un widget',
      en: 'Add a widget',
      it: 'Aggiungi un widget',
      es: 'Agregar un widget'
    },
    icon: <LuWand className="w-5 h-5 mr-2" />
  },
  {
    key: 'hasDescription',
    label: {
      fr: "Configurer l'identité du site",
      en: 'Configure the site identity',
      it: "Configura l'identità del sito",
      es: 'Configurar la identidad del sitio'
    },
    icon: <LuLayoutDashboard className="w-5 h-5 mr-2" />
  },
  {
    key: 'hasClick',
    label: {
      fr: 'Obtenir un 1er clic',
      en: 'Get your first click',
      it: 'Ottieni il tuo primo clic',
      es: 'Obtener tu primera clic'
    },
    icon: <LuSparkles className="w-5 h-5 mr-2" />
  },
  {
    key: 'hasReservation',
    label: {
      fr: 'Obtenir une 1ère réservation',
      en: 'Get your first reservation',
      it: 'Ottieni la tua prima prenotazione',
      es: 'Obtener tu primera reserva'
    },
    icon: <LuCalendar className="w-5 h-5 mr-2" />
  },
  {
    key: 'hasSubscriber',
    label: {
      fr: 'Obtenir un 1er abonné',
      en: 'Get your first subscriber',
      it: 'Ottieni il tuo primo abbonato',
      es: 'Obtener tu primera suscripción'
    },
    icon: <LuUsers className="w-5 h-5 mr-2" />
  },
  //   {
  //     key: 'hasLink',
  //     label: {
  //       fr: 'Racourcir un lien',
  //       en: 'Shorten a link',
  //       it: 'Raccourci un link',
  //       es: 'Acortar un enlace'
  //     },
  //     icon: <LuLink className="w-5 h-5 mr-2" />
  //   },
  //   { key: 'hasLike', label: 'Recevoir le premier like', icon: <LuStar className="w-5 h-5 mr-2" /> },
  //   { key: 'hasFeedback', label: 'Recevoir le premier feedback', icon: <LuHeartHandshake className="w-5 h-5 mr-2" /> },
  //   { key: 'hasMessage', label: 'Recevoir le premier message', icon: <LuMail className="w-5 h-5 mr-2" /> },
  //   { key: 'hasProduct', label: 'Créer un produit', icon: <LuPalette className="w-5 h-5 mr-2" /> },
  {
    key: 'hasSubscription',
    label: {
      fr: "Souscrire à l'offre premium",
      en: 'Subscribe to the premium offer',
      it: "Sottoscrivi l'offerta premium",
      es: 'Suscríbete a la oferta premium'
    },
    icon: <LuZap className="w-5 h-5 mr-2" />
  },
  //   { key: 'hasCompany', label: 'Configurer les infos société', icon: <LuLayoutDashboard className="w-5 h-5 mr-2" /> },
  //   { key: 'hasBilling', label: 'Configurer la facturation', icon: <LuHeartHandshake className="w-5 h-5 mr-2" /> },
  //   { key: 'has2FA', label: 'Activer la double authentification', icon: <LuKeyRound className="w-5 h-5 mr-2" /> },
  {
    key: 'hasAffiliate',
    label: {
      fr: 'Parrainer un ami',
      en: 'Sponsor a friend',
      it: 'Parrainare un amico',
      es: 'Patrocinar a un amigo'
    },
    icon: <LuUsers className="w-5 h-5 mr-2" />
  },
  //   { key: 'hasCampaign', label: 'Créer une campagne marketing', icon: <LuMail className="w-5 h-5 mr-2" /> },
  //   { key: 'hasFeed', label: "Ajouter un flux d'actualité", icon: <LuSparkles className="w-5 h-5 mr-2" /> },
  //   { key: 'hasComment', label: 'Recevoir un commentaire', icon: <LuStar className="w-5 h-5 mr-2" /> },
  //   { key: 'hasWorkflow', label: 'Activer un workflow automatisé', icon: <LuZap className="w-5 h-5 mr-2" /> },
  {
    key: 'hasShare',
    label: {
      fr: 'Partager ton Qards',
      en: 'Share your Qards',
      it: 'Condividi il tuo Qards',
      es: 'Compartir tu Qards'
    },
    icon: <LuShare className="w-5 h-5 mr-2" />
  }
];

export function OnboardingChecklist({ state }: OnboardingChecklistProps) {
  const translate = useTranslation();

  const all = checklist.map(item => ({
    key: item.key,
    value: state[item.key as keyof typeof state]
  }));

  const incompletes = all.filter(({ value }) => !value);
  const completed = all.filter(({ value }) => value);

  return (
    <ul className="flex flex-col gap-2">
      {checklist.map(item => {
        const isNext =
          incompletes.findIndex(incomplete => incomplete.key === item.key) ===
          0;

        const isCompleted = completed.find(
          completed => completed.key === item.key
        );

        return (
          <li
            key={item.key}
            className={cn('flex items-center gap-2 py-2 px-4', {
              'bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full text-white':
                isNext,
              'bg-green-100 rounded-full text-green-600': !isNext && isCompleted
            })}
          >
            {state[item.key as keyof typeof state] ? (
              <LuCircleCheck className="text-green-500" />
            ) : (
              <LuLoader
                className={cn(
                  'text-zinc-400',
                  isNext && 'animate-spin text-white'
                )}
              />
            )}
            {item.icon}
            <span>{item.label[translate.lang]}</span>
          </li>
        );
      })}
    </ul>
  );
}
