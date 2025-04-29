import { ArrowRight, MapPin } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

import { Persona } from 'components/marketing/Persona';
import { Button } from 'components/ui/button';
import { Card, CardContent } from 'components/ui/card';
import { Separator } from 'components/ui/separator';
import * as job from 'data/job';
import { getLang } from 'helpers/translate';
import { cn } from 'lib/utils';
import { boldonse } from 'styles/fonts';
import { uri } from 'settings';

interface Props {
  params: Promise<{ profession: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata | null> {
  const params = await props.params;

  const [id, city, postal] = params.profession
    .replace('.qards.link', '')
    .split('-');

  const lang = 'fr';

  const professionLabel = job.get(id as job.Job['id']).profession[lang];
  const hasLocation = city && postal;

  const title = hasLocation
    ? `${professionLabel}s à ${city} (${postal}) – Solutions professionnelles sur mesure`
    : `Solutions professionnelles sur mesure pour les ${professionLabel}s`;

  const description = hasLocation
    ? `Découvrez des solutions professionnelles conçues pour les ${professionLabel}s à ${city} (${postal}). Optimisez votre activité avec des services adaptés à vos besoins locaux.`
    : `Des services professionnels pensés pour accompagner les ${professionLabel}s dans le développement de leur activité.`;

  const image = `/assets/personas/${id}.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@qards_link'
    },
    icons: [image],
    metadataBase: new URL(uri.base()),
    alternates: {
      canonical: `/pro/${params.profession.replace('.qards.link', '')}`
    }
  };
}

export default async function ProPage({ params }: Props) {
  const query = await params;

  const [id, city, postal] = query.profession
    .replace('.qards.link', '')
    .split('-');

  const lang = await getLang();

  const profession = job.get(id as job.Job['id']);

  const work = {
    ...profession,
    profession: profession.profession[lang],
    features: profession.features.map(feature => ({
      ...feature,
      title: feature.title[lang],
      description: feature.description[lang]
    }))
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col items-center lg:items-start">
            <Persona profession={work.id} selected={true} />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {work.profession.charAt(0).toUpperCase() +
                  work.profession.slice(1)}
              </h1>

              {(city || postal) && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <p className="text-lg">
                    {city}, {postal}
                  </p>
                </div>
              )}
            </div>

            <p className="text-gray-600 text-lg">
              Solutions professionnelles adaptées pour les {work.profession}s
            </p>
          </div>
        </div>

        <Separator className="my-12" />

        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Services pour {work.profession}s
            </h2>
            <p className="mt-4 text-gray-600">
              Tout ce dont vous avez besoin pour gérer votre activité
            </p>
          </div>

          <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
            {work.features.map((feature, index) => (
              <Card
                key={index}
                className="group flex flex-col overflow-hidden rounded-lg border bg-white text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md hover:scale-110 relative"
              >
                <div
                  className="absolute inset-0 -z-10"
                  style={{
                    background: `url("https://avatar.vercel.sh/${feature.title}") no-repeat center center / cover`,
                    filter: 'blur(100px)'
                  }}
                />

                <CardContent className="p-6 flex-grow relative">
                  <div className="flex items-start gap-4">
                    <div
                      className="flex items-center justify-center rounded-lg text-primary p-3 border-2 border-stone-300 shadow-lg"
                      style={{
                        background: `url("https://avatar.vercel.sh/${feature.title}") no-repeat center center / cover`
                      }}
                    >
                      <feature.icon className="w-6 h-6" />
                    </div>

                    <div className="flex-1">
                      <h3
                        className={cn(
                          'text-lg font-semibold leading-tight',
                          boldonse.className
                        )}
                      >
                        {feature.title}
                      </h3>

                      <p className="mt-2 text-sm text-balance">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>

                <div className="px-6 pb-6 pt-0">
                  <Button
                    variant="link"
                    className="p-0 text-sm h-auto text-primary hover:text-primary/80"
                    asChild
                  >
                    <Link prefetch href={`/feature/${feature.id}`}>
                      En savoir plus
                      <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
