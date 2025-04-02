import { Column, Section, Img, Row } from '@react-email/components';

import { base, Lang } from './settings';

export const Header = ({ lang }: { lang: Lang }) => {
  return (
    <Section className="p-8" align="center">
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
            <Img
              src={`${base}/rsz_transparent_nolink.png`}
              alt="Logo"
              width="160"
              height="80"
              className="mx-auto mb-6 border border-solid border-gray-100 rounded-lg"
            />
          </div>
        </Column>

        <Column>socials</Column>
      </Row>
    </Section>
  );
};
