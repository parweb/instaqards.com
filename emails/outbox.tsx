import { Row, Section, Text } from '@react-email/components';

import { Lang } from './layout/settings';
import { Main } from './layout/main';

const subject = {
  en: 'Message from Qards.link',
  fr: 'Message de Qards.link',
  es: 'Mensaje de Qards.link',
  it: 'Messaggio da Qards.link'
};

interface OutboxProps {
  lang: Lang;
  id: string;
  subject?: string;
  body?: string;
}

const Outbox = ({ subject = '', body = '', lang = 'en', id }: OutboxProps) => {
  return (
    <Main title={subject} lang={lang} id={id}>
      <Section className="my-[16px]">
        <Section>
          <Row>
            {body
              .trim()
              .split('\r\n')
              .map((line, index) => (
                <Text
                  key={index}
                  className="my-0 text-[20px] text-gray-900"
                  dangerouslySetInnerHTML={{
                    __html:
                      line.length === 0
                        ? '&nbsp;'
                        : line.replaceAll(' ', '&nbsp;')
                  }}
                />
              ))}
          </Row>
        </Section>
      </Section>
    </Main>
  );
};

Outbox.subject = subject;

Outbox.PreviewProps = {
  subject: 'Suject du mail',
  body: `
Bonjour,

Je suis un message de test.
  - Qards.link
  - plop

zkeghkez gkezh gkze gkz egkz ehgkze gkhze ghkzej ghkez gkezj gkez ghezk ghez gkehzgjezhgj hzegk hezkg zejk gkezg kzeg kjzeg kjze gkezh kez kgezh kg zhekg ezhg kezjhkjez kezjh gkjez ghze gkez hgkze g zehjk ze khg kjze zeh z

Cordialement,
`
} as OutboxProps;

export default Outbox;
