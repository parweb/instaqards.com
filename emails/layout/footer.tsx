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
    <Section className="bg-gray-200 p-4 pt-0 text-center">
      <Text className="m-0 mb-4 p-4 text-2xl text-gray-700">{title[lang]}</Text>

      <Row className="justify-center">
        <Column className="px-0 text-left">
          {job.all.slice(0, 3).map(job => (
            <Section key={job.id}>
              <Link href={`${base}/pro/${job.id}`}>
                <Text
                  style={{ fontSize: '16px' }}
                  className="m-0 p-0.5 text-stone-700"
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
                  className="m-0 p-0.5 text-stone-700"
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
                  className="m-0 p-0.5 text-stone-700"
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
