import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Tailwind
} from '@react-email/components';

import { Content } from './content';
import { Footer } from './footer';
import { Header } from './header';
import { base, Lang } from './settings';

export const Main = ({
  children,
  title,
  lang,
  id
}: {
  children: React.ReactNode;
  title: string;
  lang: Lang;
  id: string;
}) => {
  const pixelUrl = `${base}/api/email/track/open?id=${encodeURIComponent(id)}`;

  return (
    <Tailwind>
      <Html>
        <Head />

        <Preview>{title}</Preview>

        <Body className="my-auto mx-auto font-sans p-1">
          <Container className="border border-solid border-gray-200 rounded-lg bg-white overflow-hidden">
            <Header lang={lang} />
            <Content lang={lang}>{children}</Content>
            <Footer lang={lang} />
          </Container>

          <Img
            src={pixelUrl}
            alt=""
            width={1}
            height={1}
            style={{ display: 'none' }}
          />
        </Body>
      </Html>
    </Tailwind>
  );
};
