import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { LuArrowBigDown, LuCheck } from 'react-icons/lu';

import { FlagPicker } from 'components/flag-picker';
import { PriceTable } from 'components/price-table';
import { Button } from 'components/ui/button';
import { db } from 'helpers/db';
import { getLang, translate } from 'helpers/translate';
import { cn } from 'lib/utils';
import { DEFAULT_LANG, type Lang } from '../../../translations';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from 'components/ui/carousel';

const Iphone = ({ url, scale = 100 }: { url: string; scale: number }) => {
  const ratio = 2283 / 1109;

  const width = 1109;
  const height = width * ratio;

  const factor = scale / 100;
  const translate = {
    10: -450,
    12.5: -350,
    20: -200,
    25: -150,
    30: -350 / 3,
    40: -75,
    50: -50,
    200: 25,
    300: 100 / 3
  }[scale];

  return (
    <div
      className="pointer-events-none"
      style={{ width: `${width * factor}px`, height: `${height * factor}px` }}
    >
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          background: 'url(/iPhone-15-Pro2.png)',
          paddingTop: '44px',
          paddingRight: '46px',
          paddingBottom: '43px',
          paddingLeft: '50px',

          scale: factor,
          // margin: '-' + 100 - 100 * scale + '% 0',
          transform: `translate(${translate}%, ${translate}%)`
        }}
      >
        <iframe
          title={url}
          style={{
            transformOrigin: '0 0',
            transform: 'scale(2)',
            width: '50%',
            height: '50%',
            borderRadius: '70px'
          }}
          src={url}
        />
      </div>
    </div>
  );
};

const Header = () => {
  const ratio = 0.2;

  return (
    <div className="sticky top-0 bg-white/80 z-10">
      <div className="flex items-center justify-between pr-2 max-w-[1200px] m-auto">
        <Image
          src="/rsz_black-transparent_nolink.png"
          alt="Logo qards.link"
          width={800 * ratio}
          height={400 * ratio}
        />

        <div className="flex items-center gap-2">
          <Link href={`${process.env.NEXTAUTH_URL as string}/register`}>
            <Button>{translate('page.home.register')}</Button>
          </Link>

          <FlagPicker value={cookies().get('lang')?.value || DEFAULT_LANG} />
        </div>
      </div>
    </div>
  );
};

const Hero = ({ bg = '06' }) => {
  return (
    <div
      id="Hero"
      className="relative flex flex-col bg-[#ddd] p-10 sm:p-20 items-center justify-center overflow-hidden"
    >
      <video
        className="absolute top-0 right-0 left-0 object-cover w-full h-full"
        preload="auto"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src={`/api/file?id=landing-background-video-${bg}.mp4`}
          type="video/mp4"
        />
      </video>

      <div className="z-10">
        <div className="flex gap-10 max-w-[900px] items-center flex-col md:flex-row">
          <div className="flex items-center justify-center">
            <div className="flex flex-col gap-5 text-white p-4 rounded-md">
              <div className={cn('text-4xl sm:text-7xl font-[900] b')}>
                {translate('page.home.hero.title')}
              </div>

              <div className="text-2xl">
                {translate('page.home.hero.description')}
              </div>

              <ul className="">
                <li className="flex gap-2">
                  <LuCheck />

                  <span>{translate('page.home.hero.bullet.one')}</span>
                </li>

                <li className="flex gap-2">
                  <LuCheck />

                  <span>{translate('page.home.hero.bullet.two')}</span>
                </li>

                <li className="flex gap-2">
                  <LuCheck />

                  <span>{translate('page.home.hero.bullet.three')}</span>
                </li>
              </ul>

              <div>
                <Link href={`${process.env.NEXTAUTH_URL as string}/register`}>
                  <Button>{translate('page.home.hero.call-to-action')}</Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <Iphone url="https://gellyx.qards.link/" scale={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Gallery = () => {
  const qards = [
    { url: 'https://nora-peintures.qards.link/' },
    { url: 'https://chloe-jnr.qards.link/' },
    { url: 'https://by-ayya.qards.link/' }
  ];

  return (
    <div id="Gallery" className="flex flex-col p-10 gap-10">
      <hgroup className="text-center flex flex-col gap-4">
        <h2 className="text-4xl sm:text-5xl font-[900]">
          {translate('page.home.gallery.title')}
        </h2>
        <p className="text-gray-600 text-2xl">
          {translate('page.home.gallery.description')}
        </p>
      </hgroup>

      <div className="p-5">
        <Carousel opts={{ align: 'start', loop: true }} className="">
          <CarouselContent>
            {qards.map(qard => (
              <CarouselItem
                key={qard.url}
                className="md:basis-1/2 lg:basis-1/3 justify-center flex"
              >
                <Iphone url={qard.url} scale={25} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

// const Features = () => {
//   return (
//     <div id="Features" className="flex flex-col p-10 gap-10">
//       <hgroup className="text-center flex flex-col gap-4">
//         <h2 className="text-4xl sm:text-5xl font-[900]">
//           {translate('page.home.features.title')}
//         </h2>
//         <p className="text-gray-600 text-2xl">
//           {translate('page.home.features.description')}
//         </p>
//       </hgroup>

//       <div className="">
//         <p>{translate('page.home.features.bullet.one')}</p>
//         <p>{translate('page.home.features.bullet.two')}</p>
//         <p>{translate('page.home.features.bullet.three')}</p>
//         <p>{translate('page.home.features.bullet.four')}</p>
//         <p>{translate('page.home.features.bullet.five')}</p>
//       </div>
//     </div>
//   );
// };

const Prices = async () => {
  const products = await db.product.findMany({
    where: { active: { equals: true } },
    include: {
      prices: {
        where: { active: { equals: true }, interval_count: { equals: 1 } }
      }
    }
  });

  return (
    <div
      id="Prices"
      className="flex flex-col p-10 gap-20 overflow-hidden max-w-[1200px] justify-center items-center justify-self-center"
    >
      <hgroup className="text-center flex flex-col gap-4">
        <h2 className="text-4xl sm:text-5xl font-[900]">
          {translate('page.home.price.title')}
        </h2>
        <p className="text-gray-600 text-2xl">
          {translate('page.home.price.description')}
        </p>
      </hgroup>

      <section className="text-center p-4 border-2 border-green-500 bg-green-50 rounded-lg max-w-[1200px] text-green-900">
        <div className="flex flex-col gap-2">
          <div className="font-bold text-2xl">
            {translate('page.home.price.trial.primary')}
          </div>

          <div className="text-xl flex items-center gap-6">
            <div className="flex items-center">
              <LuArrowBigDown />
              <LuArrowBigDown />
              <LuArrowBigDown />
            </div>

            {translate('page.home.price.trial.secondary')}

            <div className="flex items-center">
              <LuArrowBigDown />
              <LuArrowBigDown />
              <LuArrowBigDown />
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-center">
        <PriceTable products={products} className="flex-col sm:flex-row" />
      </div>
    </div>
  );
};

const Testimonial = () => {
  const lang = getLang();

  const comments: {
    id: string;
    name: string;
    text: { [key in Lang]: string };
  }[] = [
    {
      id: '01',
      name: 'Spencer C.',
      text: {
        fr: "J'utilise qards depuis quelques mois déjà, et la différence est incroyable. Je le recommande vivement à tous ceux qui souhaitent améliorer leur visibilité !",
        en: "I've been using qards for a few months now, and the difference it has made is incredible. Highly recommended for anyone looking to improve visibility!",
        it: 'Uso qards da qualche mese ormai e la differenza che ha portato è incredibile. Altamente raccomandato per chiunque cerchi di migliorare la propria visibilità!',
        es: 'He estado usando qards durante unos meses y la diferencia que ha marcado es increíble. Muy recomendable para quienes buscan mejorar su visibilidad.'
      }
    },
    {
      id: '02',
      name: 'Ashley R.',
      text: {
        fr: "L'équipe de qards est allée au-delà de mes attentes pour garantir ma satisfaction. Leur sens du détail et leur service client sont inégalés.",
        en: 'The team at qards went above and beyond to ensure my satisfaction. Their attention to detail and customer service is unmatched.',
        it: 'Il team di qards ha superato ogni mia aspettativa per garantire la mia soddisfazione. La loro attenzione ai dettagli e il servizio clienti sono impareggiabili.',
        es: 'El equipo de qards fue más allá para asegurar mi satisfacción. Su atención al detalle y servicio al cliente son inigualables.'
      }
    },
    {
      id: '03',
      name: 'Emma S.',
      text: {
        fr: 'Du début à la fin, mon expérience avec qards a été fluide. Il est évident que la qualité est leur priorité absolue.',
        en: "From start to finish, my experience with qards was seamless. It's clear that quality is their top priority.",
        it: 'Dall’inizio alla fine, la mia esperienza con qards è stata senza intoppi. È chiaro che la qualità è la loro massima priorità.',
        es: 'De principio a fin, mi experiencia con qards fue fluida. Está claro que la calidad es su máxima prioridad.'
      }
    },
    {
      id: '04',
      name: 'Jamie F.',
      text: {
        fr: "J'étais hésitant(e) au début, mais je suis tellement heureux(se) d'avoir choisi qards. Ils ont dépassé toutes mes attentes.",
        en: "I was hesitant at first, but I'm so glad I decided to go with qards. They've exceeded all my expectations.",
        it: 'Ero esitante all’inizio, ma sono così felice di aver scelto qards. Hanno superato tutte le mie aspettative.',
        es: 'Al principio estaba dudosa/o, pero me alegra mucho haber elegido qards. Han superado todas mis expectativas.'
      }
    },
    {
      id: '05',
      name: 'Sonia G.',
      text: {
        fr: 'qards a vraiment changé la donne pour moi. Il est rare de trouver un service qui tienne toutes ses promesses, mais celui-ci le fait.',
        en: "qards has been a game-changer for me. It's rare to find something that delivers on every promise, but this does.",
        it: 'qards ha veramente cambiato le carte in tavola per me. È raro trovare qualcosa che mantenga tutte le sue promesse, ma questo lo fa.',
        es: 'qards ha cambiado las reglas del juego para mí. Es raro encontrar algo que cumpla todo lo que promete, pero esto lo hace.'
      }
    },
    {
      id: '06',
      name: 'Brianna A.',
      text: {
        fr: 'Le support client de qards est fantastique. Ils ont été réactifs, serviables et ont veillé à répondre à toutes mes questions.',
        en: 'The customer support at qards is fantastic. They were responsive, helpful, and made sure all my questions were answered.',
        it: 'Il supporto clienti di qards è fantastico. Sono stati reattivi, disponibili e si sono assicurati di rispondere a tutte le mie domande.',
        es: 'La atención al cliente de qards es fantástica. Fueron rápidos, serviciales y se aseguraron de responder todas mis preguntas.'
      }
    },
    {
      id: '07',
      name: 'David R.',
      text: {
        fr: "Je ne peux pas assez recommander qards. Ce ne sont pas seulement les résultats, mais aussi l'expérience globale qui les distingue.",
        en: "I can't recommend qards enough. It's not just the results, but also the experience that makes them stand out.",
        it: 'Non posso raccomandare abbastanza qards. Non si tratta solo dei risultati, ma anche dell’esperienza complessiva che li distingue.',
        es: 'No puedo recomendar qards lo suficiente. No se trata solo de los resultados, sino de toda la experiencia que los hace destacar.'
      }
    },
    {
      id: '08',
      name: 'Craig J.',
      text: {
        fr: "Investir dans qards a été l'une des meilleures décisions que j'aie prises. Ça vaut chaque centime.",
        en: "Investing in qards was one of the best decisions I've made. It's worth every penny.",
        it: 'Investire in qards è stata una delle migliori decisioni che abbia mai preso. Vale ogni centesimo.',
        es: 'Invertir en qards fue una de las mejores decisiones que he tomado. Vale cada centavo.'
      }
    },
    {
      id: '09',
      name: 'Amy V.',
      text: {
        fr: "Le niveau de professionnalisme et d'expertise chez qards est impressionnant. Ils savent vraiment ce qu'ils font.",
        en: "The level of professionalism and expertise at qards is impressive. They truly know what they're doing.",
        it: 'Il livello di professionalità ed esperienza in qards è impressionante. Sanno davvero quello che fanno.',
        es: 'El nivel de profesionalismo y experiencia en qards es impresionante. Realmente saben lo que hacen.'
      }
    },
    {
      id: '10',
      name: 'Terri S.',
      text: {
        fr: "J'ai essayé de nombreux services similaires par le passé, mais rien ne se compare à qards. Je resterai client(e) à vie.",
        en: "I've tried many qards in the past, but nothing compares to this. I'm a customer for life.",
        it: 'Ho provato molti servizi simili in passato, ma nulla si confronta con qards. Rimarrò cliente a vita.',
        es: 'He probado muchos servicios similares en el pasado, pero nada se compara con qards. Seré cliente de por vida.'
      }
    },
    {
      id: '11',
      name: 'Patrick M.',
      text: {
        fr: "Les résultats parlent d'eux-mêmes. qards a considérablement amélioré ma visibilité, et je ne pourrais pas être plus satisfait(e).",
        en: "The results speak for themselves. qards has significantly improved visibility, and I couldn't be happier.",
        it: 'I risultati parlano da soli. qards ha migliorato notevolmente la mia visibilità e non potrei esserne più soddisfatto/a.',
        es: 'Los resultados hablan por sí solos. qards ha mejorado considerablemente mi visibilidad y no podría estar más contento/a.'
      }
    },
    {
      id: '12',
      name: 'Samantha D.',
      text: {
        fr: "L'engagement de qards envers l'excellence est évident dans tout ce qu'ils font. Je suis tellement ravi(e) de les avoir choisis.",
        en: "qards's commitment to excellence is evident in everything they do. I'm so glad I chose them.",
        it: 'L’impegno di qards verso l’eccellenza è evidente in tutto ciò che fanno. Sono così felice di averli scelti.',
        es: 'El compromiso de qards con la excelencia se nota en todo lo que hacen. Estoy muy contenta/o de haberlos elegido.'
      }
    },
    {
      id: '13',
      name: 'James H.',
      text: {
        fr: "La facilité d'utilisation et l'efficacité de qards sont inégalées. C'est un incontournable pour toute personne travaillant dans la production musicale.",
        en: "The ease of use and effectiveness of qards is unmatched. It's an essential for anyone in music production.",
        it: 'La facilità d’uso e l’efficacia di qards sono ineguagliabili. È essenziale per chiunque lavori nella produzione musicale.',
        es: 'La facilidad de uso y la efectividad de qards no tienen igual. Es esencial para cualquiera que trabaje en la producción musical.'
      }
    },
    {
      id: '14',
      name: 'Joshua J.',
      text: {
        fr: "J'ai été bluffé(e) par les résultats immédiats que j'ai obtenus avec qards. Ça a été incroyablement bénéfique.",
        en: "I was blown away by the immediate results I saw with qards. It's been incredibly beneficial.",
        it: 'Sono rimasto/a sbalordito/a dai risultati immediati che ho ottenuto con qards. È stato incredibilmente vantaggioso.',
        es: 'Me sorprendieron los resultados inmediatos que vi con qards. Ha sido increíblemente beneficioso.'
      }
    },
    {
      id: '15',
      name: 'Thomas R.',
      text: {
        fr: "L'équipe de qards est passionnée par ce qu'elle fait, et cela se voit. Leur dévouement à la satisfaction client est remarquable.",
        en: 'The team at qards is passionate about what they do, and it shows. Their dedication to customer satisfaction is commendable.',
        it: 'Il team di qards è appassionato di ciò che fa, e si vede. La loro dedizione alla soddisfazione del cliente è encomiabile.',
        es: 'El equipo de qards es apasionado de lo que hace, y se nota. Su dedicación a la satisfacción del cliente es digna de elogio.'
      }
    },
    {
      id: '16',
      name: 'Austin M.',
      text: {
        fr: "Choisir qards a été un véritable tournant pour moi. Cela a apporté de la joie dans ma vie, et je suis reconnaissant(e) de l'impact que cela a eu.",
        en: "Choosing qards was a turning point for me. It has brought joy into my life, and I'm grateful for the impact it's had.",
        it: 'Scegliere qards è stato un vero punto di svolta per me. Ha portato gioia nella mia vita e sono grato/a per l’impatto che ha avuto.',
        es: 'Elegir qards fue un punto de inflexión para mí. Ha traído alegría a mi vida y estoy agradecido/a por el impacto que ha tenido.'
      }
    }
  ];

  return (
    <div id="Testimonial" className="flex flex-col p-5 sm:p-10 gap-20">
      <hgroup className="text-center flex flex-col gap-4">
        <h2 className="text-4xl sm:text-5xl font-[900]">
          {translate('page.home.testimonial.title')}
        </h2>
        <p className="text-gray-600 text-2xl">
          {translate('page.home.testimonial.description')}
        </p>
      </hgroup>

      <div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {comments.map(comment => (
            <div
              key={`TestimonialItem-${comment.id}`}
              className="flex flex-col gap-2 p-4 border-2 border-gray-200 rounded-md"
            >
              <div className="flex gap-4 items-center justify-center">
                <Image
                  className="rounded-full"
                  src={`/face-${comment.id}.jpg`}
                  width={50}
                  height={50}
                  alt={comment.name}
                />
                <div className="">{comment.name}</div>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <div className="italic">{comment.text[lang]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default async function HomePage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="">
      <Header />

      <Hero bg={searchParams?.bg as string} />

      <Gallery />

      {/*<Features />*/}

      <Suspense fallback={null}>
        <Prices />
      </Suspense>

      <Testimonial />
    </div>
  );
}
