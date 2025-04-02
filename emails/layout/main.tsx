import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Tailwind
} from '@react-email/components';

import { Content } from './content';
import { Footer } from './footer';
import { Header } from './header';
import { Lang } from './settings';

export const Main = ({
  children,
  title,
  lang
}: {
  children: React.ReactNode;
  title: string;
  lang: Lang;
}) => {
  return (
    <Tailwind>
      <Html>
        <Head />

        <Preview>{title}</Preview>

        <Body className="bg-gray-50 my-auto mx-auto font-sans">
          <Container className="border border-solid border-gray-200 rounded-lg max-w-[600px] mx-auto my-[40px] bg-white">
            <Header lang={lang} />
            <Content lang={lang}>{children}</Content>
            <Footer lang={lang} />
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};
