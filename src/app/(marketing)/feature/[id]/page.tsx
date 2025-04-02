import { Personas } from 'app/(marketing)/pro/personas';
import { Separator } from 'components/ui/separator';
import * as featureService from 'data/features';
import * as job from 'data/job';
import { getLang } from 'helpers/translate';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProPage({ params }: Props) {
  const query = await params;

  const lang = await getLang();

  const feature = featureService.get(
    query.id.replace('.qards.link', '') as featureService.Feature['id']
  );

  const item = {
    ...feature,
    title: feature.title[lang],
    description: feature.description[lang]
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 overflow-hidden rounded-lg bg-white p-12 relative">
          <div
            className="absolute inset-0 -z-10"
            style={{
              background: `url("https://avatar.vercel.sh/${item.title}") no-repeat center center / cover`,
              filter: 'blur(200px)'
            }}
          />

          <div className="flex flex-col items-center lg:items-start">
            <div
              className="flex items-center justify-center rounded-lg text-primary p-8 border-2 border-stone-300 shadow-lg"
              style={{
                background: `url("https://avatar.vercel.sh/${item.title}") no-repeat center center / cover`
              }}
            >
              <feature.icon className="w-32 h-32" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
              </h1>

              <p className="text-gray-600 text-lg">{item.description}</p>
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        <div className="w-full">
          <Personas
            linkable
            jobs={job.all
              .filter(job =>
                job.features
                  .map(f => f.id)
                  .includes(item.id as featureService.Feature['id'])
              )
              .map(job => ({
                id: job.id,
                profession: job.profession[lang]
              }))}
          />
        </div>

        <Separator className="my-12" />

        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Services pour {item.title}
            </h2>
            <p className="mt-4 text-gray-600">
              Tout ce dont vous avez besoin pour gérer votre activité
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
