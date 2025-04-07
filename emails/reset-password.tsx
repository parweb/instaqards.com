import { Column, Img, Link, Row, Section, Text } from '@react-email/components';

import { Main } from './layout/main';
import { base } from './layout/settings';

const subject = {
  en: 'Reset your password',
  fr: 'Réinitialiser votre mot de passe',
  es: 'Restablecer tu contraseña',
  it: 'Reimposta la tua password'
};

const translations = {
  fr: {
    title: 'Modification de votre mot de passe',
    description:
      'Afin de modifier votre mot de passe, nous vous invitons à cliquer sur le lien ci-dessous. Cela vous permettra de choisir un nouveau mot de passe en toute sécurité et de continuer à accéder à votre compte sans interruption.',
    reset_text: 'Clickez ici pour modifier votre mot de passe',
    message_not_my_action:
      "Si vous n'avez pas tenté de réinitialiser votre mot de passe, vous pouvez ignorer cet e-mail en toute sécurité."
  },
  en: {
    title: 'Password Reset',
    description:
      'To reset your password, please click on the link below. This will allow you to securely choose a new password and continue accessing your account without interruption.',
    reset_text: 'Click here to reset your password',
    message_not_my_action:
      'If you did not request a password reset, you can safely ignore this email.'
  },
  it: {
    title: 'Modifica della tua password',
    description:
      'Per modificare la tua password, ti invitiamo a cliccare sul link qui sotto. Potrai così scegliere una nuova password in modo sicuro e continuare ad accedere al tuo account senza interruzioni.',
    reset_text: 'Clicca qui per modificare la tua password',
    message_not_my_action:
      'Se non hai richiesto la reimpostazione della password, puoi ignorare tranquillamente questa email.'
  },
  es: {
    title: 'Cambio de contraseña',
    description:
      'Para cambiar tu contraseña, haz clic en el enlace a continuación. Esto te permitirá elegir una nueva contraseña de forma segura y seguir accediendo a tu cuenta sin interrupciones.',
    reset_text: 'Haz clic aquí para cambiar tu contraseña',
    message_not_my_action:
      'Si no has solicitado restablecer tu contraseña, puedes ignorar este correo electrónico de forma segura.'
  }
};

interface ResetPasswordProps {
  resetLink?: string;
  lang: keyof typeof translations;
  id: string;
}

const ResetPassword = ({ resetLink, lang = 'en', id }: ResetPasswordProps) => (
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
                <Link href={resetLink} target="_blank">
                  <Text
                    style={{ fontSize: '16px' }}
                    className="p-0 m-0 text-stone-700 underline"
                  >
                    {translations[lang].reset_text}
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

ResetPassword.subject = subject;

ResetPassword.PreviewProps = {
  resetLink: '/reset-password'
} as ResetPasswordProps;

export default ResetPassword;
