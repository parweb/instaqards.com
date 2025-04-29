import { Column, Img, Link, Row, Section, Text } from '@react-email/components';

import { Main } from './layout/main';
import { base } from './layout/settings';

const subject = {
  en: 'Confirm your email',
  fr: 'Confirmer votre email',
  es: 'Confirmar tu email',
  it: 'Conferma il tuo email'
};

const translations = {
  en: {
    title: 'Confirm your email',
    description:
      'To confirm your email, please click on the link below. This will allow you to securely choose a new password and continue accessing your account without interruption.',
    confirm_text: 'Click here to confirm your email',
    message_not_my_action:
      "If you didn't try to create an account, you can safely ignore this email."
  },
  fr: {
    title: 'Confirmez votre email',
    description:
      'Pour confirmer votre email, veuillez cliquer sur le lien ci-dessous. Cela vous permettra de choisir un nouveau mot de passe en toute sécurité et de continuer à accéder à votre compte sans interruption.',
    confirm_text: 'Clickez ici pour confirmer votre email',
    message_not_my_action:
      "Si vous n'avez pas tenté de créer un compte, vous pouvez ignorer cet email en toute sécurité."
  },
  it: {
    title: 'Conferma il tuo indirizzo email',
    description:
      'Per confermare il tuo indirizzo email, clicca sul link qui sotto. Questo ti permetterà di scegliere una nuova password in modo sicuro e di continuare ad accedere al tuo account senza interruzioni.',
    confirm_text: 'Clicca qui per confermare il tuo indirizzo email',
    message_not_my_action:
      'Se non hai provato a fare il login, puoi ignorare questo e-mail in modo sicuro.'
  },
  es: {
    title: 'Confirma tu correo electrónico',
    description:
      'Para confirmar tu correo electrónico, haz clic en el enlace de abajo. Esto te permitirá elegir una nueva contraseña de forma segura y continuar accediendo a tu cuenta sin interrupciones.',
    confirm_text: 'Haz clic aquí para confirmar tu correo electrónico',
    message_not_my_action:
      'Si no has intentado hacer el inicio de sesión, puedes ignorar este correo electrónico en modo seguro.'
  }
};

interface ConfirmAccountProps {
  confirmLink?: string;
  lang: keyof typeof translations;
  id: string;
}

const ConfirmAccount = ({
  confirmLink,
  lang = 'en',
  id
}: ConfirmAccountProps) => {
  return (
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
                    src={`${base}/assets/email/link.png`}
                    className="w-4 h-4"
                    alt="link"
                  />
                </Column>

                <Column className="text-left">
                  <Link href={confirmLink} target="_blank">
                    <Text
                      style={{ fontSize: '16px' }}
                      className="p-0 m-0 text-stone-700 underline"
                    >
                      {translations[lang].confirm_text}
                    </Text>
                  </Link>
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
};

ConfirmAccount.subject = subject;

ConfirmAccount.PreviewProps = {
  confirmLink: 'sparo-ndigo-amurt-secan'
} as ConfirmAccountProps;

export default ConfirmAccount;
