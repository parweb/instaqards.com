'use client';

import { useEffect, useState } from 'react';
import { SocialIcon, getKeys } from 'react-social-icons';

import { Input } from 'components/ui/input';
import { cn } from 'lib/utils';
import { Button } from 'components/ui/button';
import { LuPlus } from 'react-icons/lu';

export function SocialPicker() {
  const [filter, setFilter] = useState<string>('');
  const [logo, setLogo] = useState<string>('');
  const [all, setAll] = useState<boolean>(false);

  useEffect(() => {
    if (all === false) return;

    const auth0 = document.getElementById('SocialIcon-auth0');

    if (auth0) {
      auth0.scrollIntoView({ behavior: 'smooth' });
    }
  }, [all]);

  const features = [
    'instagram',
    'youtube',
    'tiktok',
    'whatsapp',
    'snapchat',
    'facebook',
    'linkedin',
    'telegram',
    'x',
    'pinterest',
    'discord',
    'twitch',
    'onlyfans',
    'soundcloud'
  ];

  const searchables = [
    ...(filter === '' ? [] : features),
    ...getKeys().filter(key => !features.includes(key))
  ];

  const socials =
    filter === ''
      ? searchables
      : searchables.filter(key =>
          key.toLowerCase().includes(filter.toLowerCase() ?? '')
        );

  return (
    <div className="flex flex-col space-y-2">
      <label
        htmlFor="logo"
        className="text-sm font-medium text-stone-500 dark:text-stone-400"
      >
        Logo
      </label>

      <Input
        id="filter"
        name="filter"
        type="text"
        placeholder="facebook, twitter, ..."
        value={filter ?? ''}
        onChange={e => setFilter(e.target.value)}
      />

      <div className="grid grid-cols-5 gap-2 max-h-[180px] overflow-y-auto p-1">
        {filter === '' &&
          features.map(key => (
            <div
              key={`SocialIcon-${key}`}
              className="flex flex-col items-center justify-center gap-1"
            >
              <SocialIcon
                title={key}
                network={key}
                style={{
                  width: 50,
                  height: 50,
                  boxShadow: `0 0 0 2px ${logo === key ? 'black' : 'white'}`
                }}
                className={cn(
                  'rounded-full transition-all duration-300 border-2 border-white'
                )}
                onClick={() => setLogo(logo === key ? '' : key)}
              />

              <span className="text-xs text-stone-500 dark:text-stone-400">
                {key}
              </span>
            </div>
          ))}

        {all === false && filter === '' && (
          <div
            id="see-more"
            className="flex flex-col items-center justify-center gap-1"
          >
            <Button
              variant="ghost"
              onClick={() => setAll(true)}
              className="flex flex-col items-center justify-center w-[46px] h-[46px] rounded-full bg-stone-200"
            >
              <LuPlus />
            </Button>

            <span className="text-xs text-stone-500 dark:text-stone-400">
              see more
            </span>
          </div>
        )}

        {(all || filter !== '') &&
          socials.map(key => (
            <div
              id={`SocialIcon-${key}`}
              key={`SocialIcon-${key}`}
              className="flex flex-col items-center justify-center gap-1"
            >
              <SocialIcon
                title={key}
                network={key}
                style={{
                  width: 50,
                  height: 50,
                  boxShadow: `0 0 0 2px ${logo === key ? 'black' : 'white'}`
                }}
                className={cn(
                  'rounded-full transition-all duration-300 border-2 border-white'
                )}
                onClick={() => setLogo(logo === key ? '' : key)}
              />
              <span className="text-xs text-stone-500 dark:text-stone-400">
                {key}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
