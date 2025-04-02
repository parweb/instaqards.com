import * as feature from './features';

const x = feature.get('reservation');

export const all = [
  {
    id: 'pizzamaker',
    profession: {
      fr: 'Pizzaiolo',
      en: 'Pizza maker',
      it: 'Pizzaiolo',
      es: 'Pizzaiolo'
    },
    features: [feature.get('menu'), feature.get('reservation')]
  },
  {
    id: 'barber',
    profession: {
      fr: 'Barbier',
      en: 'Barber',
      it: 'Barbiere',
      es: 'Barbiere'
    },
    features: [
      feature.get('reservation'),
      feature.get('reminder'),
      feature.get('gallery'),
      feature.get('opening-hours'),
      feature.get('pricing')
    ]
  },
  {
    id: 'videast',
    profession: {
      fr: 'Vidéaste',
      en: 'Videast',
      it: 'Videast',
      es: 'Videast'
    },
    features: [feature.get('gallery')]
  },
  {
    id: 'singer',
    profession: {
      fr: 'Chanteur',
      en: 'Singer',
      it: 'Cantante',
      es: 'Cantante'
    },
    features: [feature.get('music'), feature.get('event'), feature.get('gallery')]
  },
  {
    id: 'hairdresser',
    profession: {
      fr: 'Coiffeur',
      en: 'Hairdresser',
      it: 'Parrucchiere',
      es: 'Peluquero'
    },
    features: [feature.get('reservation')]
  },
  {
    id: 'restaurant',
    profession: {
      fr: 'Restaurateur',
      en: 'Restaurant',
      it: 'Ristoratore',
      es: 'Restaurador'
    },
    features: [feature.get('menu'), feature.get('reservation')]
  },
  {
    id: 'influencer',
    profession: {
      fr: 'Influenceur',
      en: 'Influencer',
      it: 'Influencer',
      es: 'Influencer'
    },
    features: [feature.get('contact')]
  },
  {
    id: 'band',
    profession: {
      fr: 'Groupe',
      en: 'Band',
      it: 'Gruppo',
      es: 'Grupo'
    },
    features: [feature.get('music'), feature.get('event'), feature.get('gallery')]
  },
  {
    id: 'butcher',
    profession: {
      fr: 'Boucher',
      en: 'Butcher',
      it: 'Macellaio',
      es: 'Carnicero'
    },
    features: [feature.get('gallery'),]
  },
  {
    id: 'tattooist',
    profession: {
      fr: 'Tatoueur',
      en: 'Tattooist',
      it: 'Tatuatore',
      es: 'Tatuador'
    },
    features: [feature.get('reservation'), feature.get('gallery')]
  },
  {
    id: 'stylist',
    profession: {
      fr: 'Styliste',
      en: 'Stylist',
      it: 'Stylista',
      es: 'Stylista'
    },
    features: [feature.get('gallery')]
  }
] as const;

export type Job = (typeof all)[number];

// Improved get function with better type safety
export const get = <T extends Job['id']>(id: T): Extract<Job, { id: T }> => {
  const job = all.find((j): j is Extract<Job, { id: T }> => j.id === id);

  if (!job) {
    throw new Error(`Job with id "${id}" not found`);
  }

  return job;
};
