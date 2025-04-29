import { Column, Img, Link, Row, Section, Text } from '@react-email/components';

import { Main } from './layout/main';
import { base } from './layout/settings';

const subject = {
  en: 'Activate your account',
  fr: 'Activer votre compte',
  es: 'Activar tu cuenta',
  it: 'Attiva il tuo account'
};

const translations = {
  en: {
    title: 'Activate your account',
    description:
      'To activate your account, please click on the link below. This will allow you to securely choose a new password and continue accessing your account without interruption.',
    magic_link_text: 'Click here to activate your account',
    message_not_my_action:
      "If you didn't try to create an account, you can safely ignore this email."
  },
  fr: {
    title: 'Activez votre compte',
    description:
      'Pour activer votre compte, veuillez cliquer sur le lien ci-dessous. Cela vous permettra de choisir un nouveau mot de passe en toute sécurité et de continuer à accéder à votre compte sans interruption.',
    magic_link_text: 'Clickez ici pour activer votre compte',
    message_not_my_action:
      "Si vous n'avez pas tenté de créer un compte, vous pouvez ignorer cet email en toute sécurité."
  },
  it: {
    title: 'Attiva il tuo account',
    description:
      'Per attivare il tuo account, clicca sul link qui sotto. Questo ti permetterà di scegliere una nuova password in modo sicuro e di continuare ad accedere al tuo account senza interruzioni.',
    magic_link_text: 'Clicca qui per attivare il tuo account',
    message_not_my_action:
      'Se non hai provato a fare il login, puoi ignorare questo e-mail in modo sicuro.'
  },
  es: {
    title: 'Activa tu cuenta',
    description:
      'Para activar tu cuenta, haz clic en el enlace de abajo. Esto te permitirá elegir una nueva contraseña de forma segura y continuar accediendo a tu cuenta sin interrupciones.',
    magic_link_text: 'Haz clic aquí para activar tu cuenta',
    message_not_my_action:
      'Si no has intentado hacer el inicio de sesión, puedes ignorar este correo electrónico en modo seguro.'
  }
};

interface MagicLinkProps {
  magicLink?: string;
  lang: keyof typeof translations;
  id: string;
}

const MagicLink = ({ magicLink, lang = 'en', id }: MagicLinkProps) => {
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
                  <Link href={magicLink} target="_blank">
                    <Text
                      style={{ fontSize: '16px' }}
                      className="p-0 m-0 text-stone-700 underline"
                    >
                      {translations[lang].magic_link_text}
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

MagicLink.subject = subject;

MagicLink.PreviewProps = {
  magicLink: 'sparo-ndigo-amurt-secan'
} as MagicLinkProps;

export default MagicLink;
