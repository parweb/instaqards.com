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
import * as React from 'react';

const translations = {
  en: {
    title: 'Reset your password',
    reset_text: 'Click here to reset your password',
    message_not_my_action:
      "If you didn't try to reset your password, you can safely ignore this email."
  },
  fr: {
    title: 'Changez votre mot de passe',
    reset_text: 'Clickez ici pour changez votre email',
    message_not_my_action:
      "Si vous n'avez pas tenté de réinitialiser votre mot de passe, vous pouvez ignorer cet e-mail en toute sécurité."
  },
  it: {
    title: 'Cambia la tua password',
    reset_text: 'Clicca qui per cambiare la tua password',
    message_not_my_action:
      'Se non hai provato a fare il login, puoi ignorare questo e-mail in modo sicuro.'
  },
  es: {
    title: 'Cambia tu contraseña',
    reset_text: 'Haz clic aquí para cambiar tu contraseña',
    message_not_my_action:
      'Si no has intentado hacer el inicio de sesión, puedes ignorar este correo electrónico en modo seguro.'
  }
};

interface ResetPasswordProps {
  resetLink?: string;
  lang: keyof typeof translations;
}

const baseUrl = (
  process.env?.NEXTAUTH_URL ?? 'http://app.localhost:11000'
).replace('app.', '');

const ResetPassword = ({ resetLink, lang = 'en' }: ResetPasswordProps) => (
  <Html>
    <Head />

    <Preview>{translations[lang].title}</Preview>

    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>{translations[lang].title}</Heading>

        <Link
          href={resetLink}
          target="_blank"
          style={{
            ...link,
            display: 'block',
            marginBottom: '16px'
          }}
        >
          {translations[lang].reset_text}
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

ResetPassword.PreviewProps = {
  resetLink: 'sparo-ndigo-amurt-secan'
} as ResetPasswordProps;

export default ResetPassword;

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
