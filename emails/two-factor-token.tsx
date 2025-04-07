import { Column, Img, Link, Row, Section, Text } from '@react-email/components';

import { Main } from './layout/main';
import { base } from './layout/settings';

const subject = {
  en: '2FA Code',
  fr: 'Code 2FA',
  es: 'Código 2FA',
  it: 'Codice 2FA'
};

const translations = {
  en: {
    title: 'Security code',
    description:
      'Here is your account activation code. Use it to complete your sign-in and secure your access.',
    message_not_my_action:
      "If you didn't try to login, you can safely ignore this email."
  },
  fr: {
    title: 'Code de sécurité',
    description:
      'Voici votre code de sécurité. Utilisez-le pour finaliser votre connexion et protéger l’accès à votre compte.',
    message_not_my_action:
      "Si vous n'avez pas tenté de vous connecter, vous pouvez ignorer cet e-mail en toute sécurité."
  },
  it: {
    title: 'Codice di sicurezza',
    description:
      'Ecco il tuo codice di sicurezza. Utilizzalo per completare l’accesso e proteggere il tuo account.',
    message_not_my_action:
      'Se non hai provato a fare il login, puoi ignorare questo e-mail in modo sicuro.'
  },
  es: {
    title: 'Código de seguridad',
    description:
      'Aquí tienes tu código de activación. Úsalo para completar tu acceso y mantener tu cuenta segura.',
    message_not_my_action:
      'Si no has intentado hacer el inicio de sesión, puedes ignorar este correo electrónico en modo seguro.'
  }
};

interface TwoFactorTokenProps {
  token?: string;
  lang: keyof typeof translations;
  id: string;
}

const baseUrl = (
  process.env?.NEXTAUTH_URL ?? 'http://app.localhost:11000'
).replace('app.', '');

const TwoFactorToken = ({ token, lang = 'en', id }: TwoFactorTokenProps) => (
  <Main title={translations[lang].title} lang={lang} id={id}>
    <Section className="my-[16px]">
      <Section>
        <Row>
          <Text className="m-0 text-[24px] font-semibold leading-[32px] text-gray-900">
            {translations[lang].title}
          </Text>

          <Section className="py-3 bg-stone-100 rounded-md my-4">
            <Row>
              <Column className="px-3 w-4">
                <Img
                  src={`${base}/assets/email/shield.png`}
                  className="w-4 h-4"
                  alt="link"
                />
              </Column>

              <Column className="text-left">
                <Text
                  style={{ fontSize: '16px' }}
                  className="p-0 m-0 text-stone-700"
                >
                  {token}
                </Text>
              </Column>
            </Row>
          </Section>

          <Text className="mt-[8px] text-[16px] leading-[24px] text-gray-500">
            {translations[lang].description}
          </Text>

          <Text className="mt-[14px] mb-[16px] text-[14px] text-gray-400 italic">
            {translations[lang].message_not_my_action}
          </Text>
        </Row>
      </Section>
    </Section>
  </Main>
);

TwoFactorToken.subject = subject;

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
