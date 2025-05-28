import { Column, Img, Row, Section, Text } from '@react-email/components';

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

const TwoFactorToken = ({ token, lang = 'en', id }: TwoFactorTokenProps) => (
  <Main title={translations[lang].title} lang={lang} id={id}>
    <Section className="my-[16px]">
      <Section>
        <Row>
          <Text className="m-0 text-[24px] leading-[32px] font-semibold text-gray-900">
            {translations[lang].title}
          </Text>

          <Section className="my-4 rounded-md bg-stone-100 py-3">
            <Row>
              <Column className="w-4 px-3">
                <Img
                  src={`${base}/assets/email/shield.png`}
                  className="h-4 w-4"
                  alt="link"
                />
              </Column>

              <Column className="text-left">
                <Text
                  style={{ fontSize: '16px' }}
                  className="m-0 p-0 text-stone-700"
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
