import { Container } from '@react-email/components';

import { Lang } from './settings';

export const Content = ({
  children,
  lang
}: {
  children: React.ReactNode;
  lang: Lang;
}) => {
  return <Container className="p-8">{children}</Container>;
};
