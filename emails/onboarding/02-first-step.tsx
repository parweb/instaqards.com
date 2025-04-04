/*

Email : Guide de Démarrage / Focus sur la Valeur Initiale

  Timing : Jour 2 ou 3.
  Critère Conditionnel :
    Si l'utilisateur ne s'est pas connecté ou n'a pas effectué l'action clé : Envoyer un rappel doux avec de l'aide.
    Si l'utilisateur s'est connecté : Envoyer des conseils pour aller plus loin.
  Objectif : Aider l'utilisateur à franchir la première étape de valeur ("Aha! moment").
  Contenu Clé (Exemple si pas actif) :
    "Besoin d'aide pour démarrer avec [Nom de l'application] ?"
    Rappel de la première action clé avec un lien direct ou un mini-tutoriel (GIF/vidéo courte).
    Mise en avant d'un bénéfice clé rapide à obtenir.
    Lien vers le support ou une FAQ.
  Contenu Clé (Exemple si actif) :
    "Super départ, [Prénom] ! Prêt(e) pour la prochaine étape ?"
    Mise en avant d'une deuxième fonctionnalité clé ou d'une astuce pour mieux utiliser ce qu'il a déjà fait.
    Lien vers un article de blog pertinent ou une section d'aide avancée.
  Sujet (Inactif) : Un coup de pouce pour bien démarrer sur [Nom de l'application] ?
  Sujet (Actif) : Boostez votre utilisation de [Nom de l'application] : Astuce #1

*/

import {
  Button,
  Column,
  Container,
  Heading,
  Img,
  Link,
  Row,
  Section,
  Text
} from '@react-email/components';

import { base } from '../layout/settings';
import { Main } from '../layout/main';

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
      <Heading className="text-3xl font-bold text-center text-gray-800 mb-4">
        {t.title}
      </Heading>

      <Text className="text-xl text-center text-gray-600 mb-8">
        Hey, {t.subtitle}!
      </Text>

      <Text className="text-gray-700 mb-6 text-center">{t.description}</Text>

      <Section className="mb-8">
        {t.features.map((feature, index) => (
          <Row key={index} className="mb-4">
            <Column className="px-4 py-2 bg-blue-50 rounded-lg">
              <Text className="text-gray-700 m-0">✨ {feature}</Text>
            </Column>
          </Row>
        ))}
      </Section>

      <Section className="text-center mb-8">
        <Button
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors"
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
