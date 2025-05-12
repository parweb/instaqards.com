import {
  LuCircleCheck,
  LuCircleX,
  LuRocket,
  LuWand,
  LuStar,
  LuLayoutDashboard,
  LuPalette,
  LuCalendar,
  LuHeartHandshake,
  LuUsers,
  LuLink,
  LuMail,
  LuShield,
  LuZap,
  LuSparkles,
  LuGlobe,
  LuKeyRound,
  LuShare,
  LuLoader
} from 'react-icons/lu';

interface OnboardingChecklistProps {
  state: {
    hasSite: boolean;
    hasDescription: boolean;
    hasLogo: boolean;
    hasCustomDomain: boolean;
    hasBlock: boolean;
    hasReservation: boolean;
    hasSubscriber: boolean;
    hasLink: boolean;
    hasClick: boolean;
    // hasLike: boolean;
    // hasFeedback: boolean;
    // hasMessage: boolean;
    // hasProduct: boolean;
    hasSubscription: boolean;
    // hasCompany: boolean;
    // hasBilling: boolean;
    // has2FA: boolean;
    hasAffiliate: boolean;
    // hasCampaign: boolean;
    // hasFeed: boolean;
    // hasComment: boolean;
    // hasWorkflow: boolean;
    hasShare: boolean;
  };
}

const checklist = [
  {
    key: 'hasSite',
    label: 'Créer un site',
    icon: <LuRocket className="w-5 h-5 mr-2" />
  },
  {
    key: 'hasCustomDomain',
    label: 'Configurer un domaine personnalisé (optionnel)',
    icon: <LuGlobe className="w-5 h-5 mr-2" />
  },
  {
    key: 'hasBlock',
    label: 'Ajouter un widget',
    icon: <LuWand className="w-5 h-5 mr-2" />
  },
  {
    key: 'hasDescription',
    label: "Configurer l'identité du site",
    icon: <LuLayoutDashboard className="w-5 h-5 mr-2" />
  },
  {
    key: 'hasReservation',
    label: 'Obtenir une 1ère réservation',
    icon: <LuCalendar className="w-5 h-5 mr-2" />
  },
  {
    key: 'hasSubscriber',
    label: 'Obtenir un 1er abonné',
    icon: <LuUsers className="w-5 h-5 mr-2" />
  },
  {
    key: 'hasLink',
    label: 'Racourcir un lien',
    icon: <LuLink className="w-5 h-5 mr-2" />
  },
  {
    key: 'hasClick',
    label: 'Obtenir un 1er clic',
    icon: <LuSparkles className="w-5 h-5 mr-2" />
  },
  //   { key: 'hasLike', label: 'Recevoir le premier like', icon: <LuStar className="w-5 h-5 mr-2" /> },
  //   { key: 'hasFeedback', label: 'Recevoir le premier feedback', icon: <LuHeartHandshake className="w-5 h-5 mr-2" /> },
  //   { key: 'hasMessage', label: 'Recevoir le premier message', icon: <LuMail className="w-5 h-5 mr-2" /> },
  //   { key: 'hasProduct', label: 'Créer un produit', icon: <LuPalette className="w-5 h-5 mr-2" /> },
  {
    key: 'hasSubscription',
    label: "Souscrire à l'offre premium",
    icon: <LuZap className="w-5 h-5 mr-2" />
  },
  //   { key: 'hasCompany', label: 'Configurer les infos société', icon: <LuLayoutDashboard className="w-5 h-5 mr-2" /> },
  //   { key: 'hasBilling', label: 'Configurer la facturation', icon: <LuHeartHandshake className="w-5 h-5 mr-2" /> },
  //   { key: 'has2FA', label: 'Activer la double authentification', icon: <LuKeyRound className="w-5 h-5 mr-2" /> },
  {
    key: 'hasAffiliate',
    label: 'Parrainer un ami',
    icon: <LuUsers className="w-5 h-5 mr-2" />
  },
  //   { key: 'hasCampaign', label: 'Créer une campagne marketing', icon: <LuMail className="w-5 h-5 mr-2" /> },
  //   { key: 'hasFeed', label: "Ajouter un flux d'actualité", icon: <LuSparkles className="w-5 h-5 mr-2" /> },
  //   { key: 'hasComment', label: 'Recevoir un commentaire', icon: <LuStar className="w-5 h-5 mr-2" /> },
  //   { key: 'hasWorkflow', label: 'Activer un workflow automatisé', icon: <LuZap className="w-5 h-5 mr-2" /> },
  {
    key: 'hasShare',
    label: 'Partager ton Qards',
    icon: <LuShare className="w-5 h-5 mr-2" />
  }
];

export function OnboardingChecklist({ state }: OnboardingChecklistProps) {
  return (
    <ul className="space-y-3">
      {checklist.map(item => (
        <li key={item.key} className="flex items-center gap-2">
          {state[item.key as keyof typeof state] ? (
            <LuCircleCheck className="text-green-500 w-5 h-5" />
          ) : (
            <LuLoader className="text-zinc-400 w-5 h-5" />
          )}
          {item.icon}
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
