/*

Email : Check-in / Demande de Feedback (Mid-Trial)

  Timing : Autour du Jour 15.
  Objectif : Montrer que vous vous souciez, identifier les points de friction, recueillir des insights.
  Critère Conditionnel :
    Si peu actif : Demander s'il rencontre des difficultés, proposer de l'aide personnalisée.
    Si actif : Demander ce qu'il apprécie le plus et s'il a des suggestions.
  Contenu Clé :
    "Comment se passe votre essai de [Nom de l'application] ?"
    Question ouverte simple (ex: "Quelle est la chose que vous aimeriez pouvoir faire ?" ou "Quel est votre retour jusqu'à présent ?").
    Rappel qu'il reste environ 15 jours d'essai.
    Lien vers le support / Prise de RDV pour démo personnalisée (optionnel).
  Sujet : [Prénom], votre avis sur [Nom de l'application] nous intéresse ! (Mi-parcours de l'essai)

*/

import {
  Button,
  Column,
  Heading,
  Row,
  Section,
  Text
} from '@react-email/components';

import { Main } from '../layout/main';
import { base } from '../layout/settings';

const subject = {
  en: 'Welcome to Qards',
  fr: 'Bienvenue chez Qards',
  es: 'Bienvenido a Qards',
  it: 'Benvenuto in Qards'
};

const translations = {
  en: {
    title: 'Welcome to Our Community!',
    subtitle: "We're thrilled to have you here",
    description:
      "Thank you for joining us! We're excited to have you as part of our growing community. Here's what you can expect:",
    features: [
      'Access to exclusive content',
      'Regular updates and newsletters',
      'Priority customer support'
    ],
    cta: 'Get Started',
    footer: 'Follow us on social media'
  },
  fr: {
    title: 'Bienvenue dans Notre Communauté !',
    subtitle: 'Nous sommes ravis de vous accueillir',
    description:
      'Merci de nous avoir rejoints ! Nous sommes ravis de vous compter parmi les membres de notre communauté grandissante. Voici ce qui vous attend :',
    features: [
      'Accès à du contenu exclusif',
      'Mises à jour et newsletters régulières',
      'Support client prioritaire'
    ],
    cta: 'Commencer',
    footer: 'Suivez-nous sur les réseaux sociaux'
  },
  it: {
    title: 'Benvenuto nella nostra comunità!',
    subtitle: 'Siamo felici di averti qui',
    description:
      'Grazie per averci unito! Siamo entusiasti di avere te come parte della nostra comunità in crescita. Ecco cosa puoi aspettarti:',
    features: [
      'Accesso a contenuti esclusivi',
      'Misure a tempo reale e newsletter',
      'Supporto client prioritario'
    ],
    cta: 'Inizia',
    footer: 'Segui-ci sui social media'
  },
  es: {
    title: 'Bienvenido a nuestra comunidad!',
    subtitle: 'Estamos felices de tenerte aquí',
    description:
      'Gracias por unirte a nosotros! Estamos entusiasmados de tenerte como parte de nuestra comunidad en crecimiento. Aquí lo que puedes esperar:',
    features: [
      'Acceso a contenido exclusivo',
      'Actualizaciones y newsletters',
      'Soporte al cliente prioritario'
    ],
    cta: 'Comienza',
    footer: 'Síguenos en las redes sociales'
  }
};

interface WelcomeEmailProps {
  lang?: keyof typeof translations;
  id: string;
}

const Welcome = ({ lang = 'en', id }: WelcomeEmailProps) => {
  const t = translations[lang];

  return (
    <Main title={t.title} lang={lang} id={id}>
      <Heading className="mb-4 text-center text-3xl font-bold text-gray-800">
        {t.title}
      </Heading>

      <Text className="mb-8 text-center text-xl text-gray-600">
        Hey, {t.subtitle}!
      </Text>

      <Text className="mb-6 text-center text-gray-700">{t.description}</Text>

      <Section className="mb-8">
        {t.features.map((feature, index) => (
          <Row key={index} className="mb-4">
            <Column className="rounded-lg bg-blue-50 px-4 py-2">
              <Text className="m-0 text-gray-700">✨ {feature}</Text>
            </Column>
          </Row>
        ))}
      </Section>

      <Section className="mb-8 text-center">
        <Button
          className="rounded-full bg-blue-600 px-8 py-3 font-bold text-white transition-colors hover:bg-blue-700"
          href={base}
        >
          {t.cta}
        </Button>
      </Section>
    </Main>
  );
};

Welcome.subject = subject;

Welcome.PreviewProps = {
  lang: 'fr'
} as WelcomeEmailProps;

export default Welcome;
