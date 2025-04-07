import {
  Column,
  Container,
  Link,
  Row,
  Section,
  Text
} from '@react-email/components';

import * as job from 'data/job';
import { base, Lang } from './settings';

const title = {
  fr: "Nos cas d'utilisation",
  en: 'Our usage cases',
  it: "I nostri casi d'uso",
  es: 'Nuestros casos de uso'
};

export const Footer = ({ lang }: { lang: Lang }) => {
  return (
    <Section className="text-center bg-gray-200 p-4 pt-0">
      <Text className="text-gray-700 text-2xl m-0 mb-4 p-4">{title[lang]}</Text>

      <Row className="justify-center">
        <Column className="px-0 text-left">
          {job.all.slice(0, 3).map(job => (
            <Section key={job.id}>
              <Link href={`${base}/pro/${job.id}`}>
                <Text
                  style={{ fontSize: '16px' }}
                  className="p-0.5 m-0 text-stone-700"
                >
                  {job.profession[lang]}
                </Text>
              </Link>
            </Section>
          ))}
        </Column>

        <Column className="px-0 text-left">
          {job.all.slice(3, 6).map(job => (
            <Section key={job.id}>
              <Link href={`${base}/pro/${job.id}`}>
                <Text
                  style={{ fontSize: '16px' }}
                  className="p-0.5 m-0 text-stone-700"
                >
                  {job.profession[lang]}
                </Text>
              </Link>
            </Section>
          ))}
        </Column>

        <Column className="px-0 text-left">
          {job.all.slice(6, 9).map(job => (
            <Section key={job.id}>
              <Link href={`${base}/pro/${job.id}`}>
                <Text
                  style={{ fontSize: '16px' }}
                  className="p-0.5 m-0 text-stone-700"
                >
                  {job.profession[lang]}
                </Text>
              </Link>
            </Section>
          ))}
        </Column>
      </Row>
    </Section>
  );
};
