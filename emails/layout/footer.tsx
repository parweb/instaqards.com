import { Column, Link, Row, Section, Text } from '@react-email/components';

import { base, Lang } from './settings';
import * as job from 'data/job';

const title = {
  fr: "Nos cas d'utilisation",
  en: 'Our usage cases',
  it: "I nostri casi d'uso",
  es: 'Nuestros casos de uso'
};

export const Footer = ({ lang }: { lang: Lang }) => {
  return (
    <Section className="text-center bg-gray-200 p-8">
      <Text className="text-gray-700 text-sm mb-4">{title[lang]}</Text>

      <Row className="justify-center">
        <Column className="px-2">
          {job.all.slice(0, 3).map(job => (
            <Section key={job.id}>
              <Link
                href={`${base}/pro/${job.id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {job.profession[lang]}
              </Link>
            </Section>
          ))}
        </Column>

        <Column className="px-2">
          {job.all.slice(3, 6).map(job => (
            <Section key={job.id}>
              <Link
                href={`${base}/pro/${job.id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {job.profession[lang]}
              </Link>
            </Section>
          ))}
        </Column>

        <Column className="px-2">
          {job.all.slice(6, 9).map(job => (
            <Section key={job.id}>
              <Link
                href={`${base}/pro/${job.id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {job.profession[lang]}
              </Link>
            </Section>
          ))}
        </Column>
      </Row>
    </Section>
  );
};
