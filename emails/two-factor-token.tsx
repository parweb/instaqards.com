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
    preview_text: '2FA Code',
    title: 'Login',
    activation_text: 'Here is your account activation code:',
    message_not_my_action:
      "If you didn't try to login, you can safely ignore this email."
  },
  fr: {
    preview_text: '2FA Code',
    title: 'Login',
    activation_text: "Voici votre code d'activation:",
    message_not_my_action:
      "Si vous n'avez pas tenté de vous connecter, vous pouvez ignorer cet e-mail en toute sécurité."
  },
  it: {
    preview_text: '2FA Code',
    title: 'Login',
    activation_text: 'Ecco il tuo codice di attivazione:',
    message_not_my_action:
      'Se non hai provato a fare il login, puoi ignorare questo e-mail in modo sicuro.'
  },
  es: {
    preview_text: '2FA Code',
    title: 'Login',
    activation_text: 'Aquí está tu código de activación:',
    message_not_my_action:
      'Si no has intentado hacer el inicio de sesión, puedes ignorar este correo electrónico en modo seguro.'
  }
};

interface TwoFactorTokenProps {
  token?: string;
  lang: keyof typeof translations;
}

const baseUrl = (
  process.env?.NEXTAUTH_URL ?? 'http://app.localhost:11000'
).replace('app.', '');

export const TwoFactorToken = ({ token, lang = 'en' }: TwoFactorTokenProps) => (
  <Html>
    <Head />

    <Preview>{translations[lang].preview_text}</Preview>

    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>{translations[lang].title}</Heading>

        <Text style={{ ...text, marginBottom: '14px' }}>
          {translations[lang].activation_text}
        </Text>

        <code style={code}>{token}</code>

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

TwoFactorToken.PreviewProps = {
  token: '319083'
} as TwoFactorTokenProps;

export default TwoFactorToken;

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

const code = {
  display: 'inline-block',
  padding: '16px 4.5%',
  width: '90.5%',
  backgroundColor: '#f4f4f4',
  borderRadius: '5px',
  border: '1px solid #eee',
  color: '#333'
};
