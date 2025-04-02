import { Calendar, Camera, CreditCard, Mail, Users, Clock, Menu, Music } from 'lucide-react';

export const all = [
  {
    id: 'reservation',
    icon: Calendar,
    title: {
      fr: 'Réservation',
      en: 'Reservation',
      it: 'Prenotazione',
      es: 'Reservación'
    },
    description: {
      fr: 'Réservez en ligne 24/7',
      en: 'Reserve online 24/7',
      it: 'Prenota online 24/7',
      es: 'Reserva en línea 24/7'
    }
  },
  {
    id: 'reminder',
    icon: Users,
    title: {
      fr: 'Relance',
      en: 'Reminder',
      it: 'Rimando',
      es: 'Recordatorio'
    },
    description: {
      fr: 'Fidélisation et communication automatisée',
      en: 'Fidelity and automated communication',
      it: 'Fidanzazione e comunicazione automatizzata',
      es: 'Fidelización y comunicación automatizada'
    }
  },
  {
    id: 'gallery',
    icon: Camera,
    title: {
      fr: 'Galerie',
      en: 'Gallery',
      it: 'Galleria',
      es: 'Galería'
    },
    description: {
      fr: 'Showcase de vos réalisations',
      en: 'Showcase of your works',
      it: 'Mostra dei tuoi lavori',
      es: 'Showcase de tus realizaciones'
    }
  },
  {
    id: 'opening-hours',
    icon: Clock,
    title: {
      fr: 'Horaires',
      en: 'Opening hours',
      it: 'Orari',
      es: 'Horarios'
    },
    description: {
      fr: 'Gestion flexible de vos disponibilités',
      en: 'Flexible management of your availability',
      it: 'Gestione flessibile delle tue disponibilità',
      es: 'Gestión flexible de tus disponibilidades'
    }
  },
  {
    id: 'pricing',
    icon: CreditCard,
    title: {
      fr: 'Tarifs',
      en: 'Pricing',
      it: 'Tariffe',
      es: 'Tarifas'
    },
    description: {
      fr: 'Affichage transparent des prix',
      en: 'Transparent pricing display',
      it: 'Visualizzazione dei prezzi trasparenti',
      es: 'Visualización transparente de precios'
    }
  },
  {
    id: 'contact',
    icon: Mail,
    title: {
      fr: 'Contact',
      en: 'Contact',
      it: 'Contatto',
      es: 'Contacto'
    },
    description: {
      fr: 'Contactez-nous pour toute demande',
      en: 'Contact us for any request',
      it: 'Contattaci per qualsiasi richiesta',
      es: 'Contacta con nosotros para cualquier solicitud'
    }
  },
  {
    id: 'menu',
    icon: Menu,
    title: {
      fr: 'Menu',
      en: 'Menu',
      it: 'Menu',
      es: 'Menú'
    },
    description: {
      fr: 'Menu',
      en: 'Menu',
      it: 'Menu',
      es: 'Menú'
    }
  },
  {
    id: 'music',
    icon: Music,
    title: {
      fr: 'Musique',
      en: 'Music',
      it: 'Musica',
      es: 'Música'
    },
    description: {
      fr: 'Musique',
      en: 'Music',
      it: 'Musica',
      es: 'Música'
    }
  },
  {
    id: 'event',
    icon: Calendar,
    title: {
      fr: 'Événement',
      en: 'Event',
      it: 'Evento',
      es: 'Evento'
    },
    description: {
      fr: 'Événement',
      en: 'Event',
      it: 'Evento',
      es: 'Evento'
    }
  }
] as const;

export type Feature = (typeof all)[number];

export const get = <T extends Feature['id']>(
  id: T
): Extract<Feature, { id: T }> => {
  const feature = all.find(
    (feature): feature is Extract<Feature, { id: T }> => feature.id === id
  );

  if (!feature) {
    throw new Error(`Feature with id "${id}" not found`);
  }

  return feature;
};
