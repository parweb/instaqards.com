import { UserRole, PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

export const populateAllLeadWithDefaultSite = async (prisma: PrismaClient) => {
  await prisma.site.deleteMany({
    where: {
      display_name: 'auto-generated'
    }
  });

  const leads = await prisma.user.findMany({
    // take: 100,
    where: {
      bounced: { lte: 0 },
      role: UserRole.LEAD,
      sites: {
        none: {}
      }
    }
  });

  console.info({ leads: leads.map(({ id }) => id) });

  for (const lead of leads) {
    const name = lead.name || lead.email.split('@')[0].replaceAll('.', ' ');
    const subdomain = (
      name.trim().replace(/[\W_]+/g, '-') +
      '-' +
      nanoid(3)
    ).toLowerCase();

    // format with a . every 2 characters
    const phone = String(lead?.phone ?? '')
      .padStart(10, '0')
      .replace(/(.{2})/g, '$1.')
      .slice(0, 14);

    await prisma.site.create({
      data: {
        userId: lead.id,
        name,
        display_name: 'auto-generated',
        subdomain,
        background: '/api/file?id=dr0uR6kMbKHxyG0ha7U1D.png',
        blocks: {
          create: [
            {
              type: 'main',
              position: 0,
              style: {},
              widget: {
                id: 'logo-circle',
                data: {
                  size: 163,
                  corner: 100,
                  medias: [
                    {
                      id: 'Fb9NpCK41pkLF80OUkmp4',
                      url: '/api/file?id=Fb9NpCK41pkLF80OUkmp4.png',
                      kind: 'remote'
                    }
                  ]
                },
                type: 'picture'
              }
            },
            {
              type: 'main',
              position: 1,
              style: {},
              widget: {
                id: 'simple',
                data: {
                  corner: 100,
                  radius: 150,
                  socials: [
                    {
                      id: '1K9k4u-LVm06fxz4e6KxW',
                      href: 'https://facebook.com/',
                      logo: 'facebook'
                    },
                    {
                      id: 'YOjTT0BrampOd3nC5Qm8u',
                      href: 'https://www.instagram.com/',
                      logo: 'instagram'
                    },
                    {
                      id: 'Iq2nzvPs7y7wsQonKtAf4',
                      href: 'https://www.tiktok.com/fr/',
                      logo: 'tiktok'
                    }
                  ],
                  distribution: 80
                },
                type: 'social'
              }
            },
            {
              type: 'main',
              position: 2,
              style: {},
              widget: {
                id: 'normal',
                data: {
                  font: {
                    color: '#ffff',
                    fontSize: '16px',
                    textAlign: 'center',
                    fontFamily: 'Boldonse'
                  },
                  text: name.toUpperCase(),
                  container: {
                    margin: '0px',
                    padding: '0px',
                    borderColor: '#ffffff00',
                    borderWidth: '1px',
                    borderRadius: '0px',
                    backgroundColor: '#ffffff00'
                  }
                },
                type: 'text'
              }
            },
            {
              type: 'main',
              position: 3,
              style: {},
              widget: {
                id: 'icon',
                data: {
                  href: `tel:${phone.replaceAll('.', '')}`,
                  color: '#000000',
                  label: phone,
                  images: [
                    {
                      id: 'Sk0YtBk8xBUs3AIgRzNrs',
                      url: '/api/file?id=Sk0YtBk8xBUs3AIgRzNrs.png',
                      kind: 'remote'
                    }
                  ],
                  background: '#ffffff'
                },
                type: 'button'
              }
            },
            {
              type: 'main',
              position: 4,
              style: {},
              widget: { id: 'reservation', data: {}, type: 'other' }
            },
            {
              type: 'main',
              position: 5,
              style: {},
              widget: {
                id: 'maps',
                data: {
                  label: name.toUpperCase(),
                  position: {
                    // types: ['premise', 'street_address'],
                    geometry: {
                      // bounds: {
                      //   northeast: { lat: 48.8445605, lng: 2.7876196 },
                      //   southwest: { lat: 48.8444277, lng: 2.7874327 }
                      // },
                      location: {
                        // @ts-ignore
                        lng: lead.location?.geometry?.coordinates?.[0],
                        // @ts-ignore
                        lat: lead.location?.geometry?.coordinates?.[1]
                      }
                      // viewport: {
                      //   northeast: {
                      //     lat: 48.84584383029149,
                      //     lng: 2.788876330291502
                      //   },
                      //   southwest: {
                      //     lat: 48.84314586970849,
                      //     lng: 2.786178369708498
                      //   }
                      // },
                      // location_type: 'ROOFTOP'
                    },
                    place_id: nanoid(),
                    components: {
                      street_number:
                        // @ts-ignore
                        lead.location?.properties?.housenumber ?? false,
                      // @ts-ignore
                      route: lead.location?.properties?.street ?? false,
                      // @ts-ignore
                      postal_code: lead.location?.properties?.postcode ?? false,
                      // @ts-ignore
                      locality: lead.location?.properties?.city ?? false
                    },
                    // @ts-ignore
                    formatted_address: lead.location?.properties?.label
                    // navigation_points: [
                    //   {
                    //     location: { latitude: 48.8445274, longitude: 2.787542 }
                    //   }
                    // ],
                    // address_components: [
                    //   {
                    //     types: ['street_number'],
                    //     long_name: '11',
                    //     short_name: '11'
                    //   },
                    //   {
                    //     types: ['route'],
                    //     long_name: 'Rue Emile Cloud',
                    //     short_name: 'Rue Emile Cloud'
                    //   },
                    //   {
                    //     types: ['locality', 'political'],
                    //     long_name: 'Serris',
                    //     short_name: 'Serris'
                    //   },
                    //   {
                    //     types: ['administrative_area_level_2', 'political'],
                    //     long_name: 'Seine-et-Marne',
                    //     short_name: 'Seine-et-Marne'
                    //   },
                    //   {
                    //     types: ['administrative_area_level_1', 'political'],
                    //     long_name: 'Île-de-France',
                    //     short_name: 'IDF'
                    //   },
                    //   {
                    //     types: ['country', 'political'],
                    //     long_name: 'France',
                    //     short_name: 'FR'
                    //   },
                    //   {
                    //     types: ['postal_code'],
                    //     long_name: '77700',
                    //     short_name: '77700'
                    //   }
                    // ]
                  }
                },
                type: 'other'
              }
            }
          ]
        }
      }
    });
  }

  console.info({ count: leads.length });
};
