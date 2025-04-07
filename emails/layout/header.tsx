import { Column, Img, Link, Row, Section, Text } from '@react-email/components';

import { app, base, Lang } from './settings';

const translations = {
  en: {
    cta: 'my account'
  },
  fr: {
    cta: 'mon compte'
  },
  it: {
    cta: 'il mio account'
  },
  es: {
    cta: 'mi cuenta'
  }
};

export const Header = ({ lang }: { lang: Lang }) => {
  return (
    <Section className="p-4" align="center">
      <Row>
        <Column>
          <div
            className="rounded-md"
            style={{
              width: '232px',
              height: '80px',
              background: `url(${base}/assets/bg-logo.png) center center / auto no-repeat`
            }}
          >
            <Link href={app} target="_blank">
              <Img
                src={`${base}/rsz_transparent_nolink.png`}
                alt="Logo"
                width="160"
                height="80"
                className="mx-auto mb-6 border border-solid border-gray-100 rounded-lg"
              />
            </Link>
          </div>
        </Column>

        <Column>
          <Row>
            <Column>
              <Link href={`https://www.instagram.com/qards_eu`} target="_blank">
                <Img
                  src={`${base}/assets/logo-instagram.png`}
                  alt="Instagram"
                  width="32"
                  height="32"
                />
              </Link>
            </Column>

            {/* <Column>
              <Link href={`${base}`} target="_blank">
                <Text className="text-center text-white bg-stone-900 px-2 py-1 rounded-lg">
                  {translations[lang].cta}
                </Text>
              </Link>
            </Column> */}
          </Row>
        </Column>
      </Row>
    </Section>
  );
};
