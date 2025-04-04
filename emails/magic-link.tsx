import * as React from 'react';

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text
} from '@react-email/components';

const subject = {
  en: 'Activate your account',
  fr: 'Activer votre compte',
  es: 'Activar tu cuenta',
  it: 'Attiva il tuo account'
};

const translations = {
  en: {
    title: 'Activate your account',
    magic_link_text: 'Click here to activate your account',
    message_not_my_action:
      "If you didn't try to create an account, you can safely ignore this email."
  },
  fr: {
    title: 'Activez votre compte',
    magic_link_text: 'Clickez ici pour activer votre compte',
    message_not_my_action:
      "Si vous n'avez pas tenté de créer un compte, vous pouvez ignorer cet email en toute sécurité."
  },
  it: {
    title: 'Attiva il tuo account',
    magic_link_text: 'Clicca qui per attivare il tuo account',
    message_not_my_action:
      'Se non hai provato a fare il login, puoi ignorare questo e-mail in modo sicuro.'
  },
  es: {
    title: 'Activa tu cuenta',
    magic_link_text: 'Haz clic aquí para activar tu cuenta',
    message_not_my_action:
      'Si no has intentado hacer el inicio de sesión, puedes ignorar este correo electrónico en modo seguro.'
  }
};

interface MagicLinkProps {
  magicLink?: string;
  lang: keyof typeof translations;
}

const baseUrl = (
  process.env?.NEXTAUTH_URL ?? 'http://app.localhost:11000'
).replace('app.', '');

const MagicLink = ({ magicLink, lang = 'en' }: MagicLinkProps) => {
  return (
    <Html>
      <Head />

      <Preview>{translations[lang].title}</Preview>

      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{translations[lang].title}</Heading>

          <Link
            href={magicLink}
            target="_blank"
            style={{
              ...link,
              display: 'block',
              marginBottom: '16px'
            }}
          >
            {translations[lang].magic_link_text}
          </Link>

          <Text
            style={{
              ...text,
              color: '#ababab',
              marginTop: '14px',
              marginBottom: '16px'
            }}
          >
            {translations[lang].message_not_my_action}
          </Text>

          <Img
            src={`${baseUrl}/logo.png`}
            width="32"
            height="32"
            alt="Instaqards's Logo"
          />

          <Text style={footer}>
            <Link
              href={baseUrl}
              target="_blank"
              style={{ ...link, color: '#898989' }}
            >
              {baseUrl.replace('https://', '').replace('http://', '')}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

MagicLink.subject = subject;

MagicLink.PreviewProps = {
  magicLink: 'sparo-ndigo-amurt-secan'
} as MagicLinkProps;

export default MagicLink;

const main = {
  backgroundColor: '#ffffff'
};

const container = {
  paddingLeft: '12px',
  paddingRight: '12px',
  margin: '0 auto'
};

const h1 = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0'
};

const link = {
  color: '#2754C5',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  textDecoration: 'underline'
};

const text = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  margin: '24px 0'
};

const footer = {
  color: '#898989',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '12px',
  lineHeight: '22px',
  marginTop: '12px',
  marginBottom: '24px'
};
