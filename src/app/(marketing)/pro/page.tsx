import { getLang } from 'helpers/translate';
import Image from 'next/image';
import { Begin } from '../home/section/begin';
import { Personas } from './personas';
import { Suspense } from 'react';
import { WebSite } from 'components/editor/WebSite';
import { db } from 'helpers/db';

const jobs = [
  {
    id: '01',
    profession: {
      fr: 'Pizzaiolo',
      en: 'Pizza maker',
      it: 'Pizzaiolo',
      es: 'Pizzaiolo'
    }
  },
  {
    id: '02',
    profession: {
      fr: 'Barbier',
      en: 'Barber',
      it: 'Barbiere',
      es: 'Barbiere'
    }
  },
  {
    id: '03',
    profession: {
      fr: 'Vidéaste',
      en: 'Videast',
      it: 'Videast',
      es: 'Videast'
    }
  },
  {
    id: '04',
    profession: {
      fr: 'Chanteur',
      en: 'Singer',
      it: 'Cantante',
      es: 'Cantante'
    }
  },
  {
    id: '05',
    profession: {
      fr: 'Coiffeur',
      en: 'Hairdresser',
      it: 'Parrucchiere',
      es: 'Peluquero'
    }
  },
  {
    id: '06',
    profession: {
      fr: 'Restaurateur',
      en: 'Restaurateur',
      it: 'Ristoratore',
      es: 'Restaurador'
    }
  },
  {
    id: '07',
    profession: {
      fr: 'Influenceur',
      en: 'Influencer',
      it: 'Influencer',
      es: 'Influencer'
    }
  },
  {
    id: '08',
    profession: {
      fr: 'Groupe',
      en: 'Group',
      it: 'Gruppo',
      es: 'Grupo'
    }
  },
  {
    id: '09',
    profession: {
      fr: 'Boucher',
      en: 'Butcher',
      it: 'Macellaio',
      es: 'Carnicero'
    }
  },
  {
    id: '10',
    profession: {
      fr: 'Tatoueur',
      en: 'Tattooist',
      it: 'Tatuatore',
      es: 'Tatuador'
    }
  },
  {
    id: '11',
    profession: {
      fr: 'Styliste',
      en: 'Stylist',
      it: 'Stylista',
      es: 'Stylista'
    }
  }
];

export default async function ProPage() {
  const lang = await getLang();
  const site = await db.site.findUnique({
    include: {
      blocks: { orderBy: [{ position: 'asc' }, { createdAt: 'asc' }] }
    },
    where: {
      id: 'cm8dqblta000vspcs6c7giksg'
    }
  });

  return (
    <div className="flex-1 self-stretch flex flex-col items-center justify-center p-4 gap-12">
      <div className="flex-1 flex flex-col items-center justify-center -mb-8 mt-0">
        <div>
          <Image
            src={`/plateform-number-one-commercants-artisants-${lang}.png`}
            alt="Plateform number one commercants artisants"
            width={500}
            height={100}
          />
        </div>
      </div>

      <div className="w-full">
        <Personas
          jobs={jobs.map(job => ({
            ...job,
            profession: job.profession[lang]
          }))}
        />
      </div>

      <div className="w-full">
        <div className="relative w-full aspect-[9/16] max-w-xl mx-auto flex">
          <Suspense fallback={null}>{site && <WebSite site={site} />}</Suspense>
        </div>
      </div>

      <div>
        <Begin />
      </div>
    </div>
  );
}
