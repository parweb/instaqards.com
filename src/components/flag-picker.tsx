'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';

import Flag from 'react-world-flags';

import { setLang } from 'actions/lang-chooser';
import { LuLoader } from 'react-icons/lu';

const lang2flag = (lang: string) => {
  const mapping: Record<string, string> = { fr: 'FR', en: 'US' };

  return mapping?.[lang] ?? lang;
};

export const FlagPicker = ({
  options = ['fr', 'en'],
  value = 'fr'
}: {
  options?: string[];
  value: string;
}) => {
  const [selectedFlag, action, pending] = useFormState(setLang, value);
  // const [selectedFlag, action] = useFormState(setLang, value);

  const [isOpen, setIsOpen] = useState(false);

  const otherFlags = options.filter(code => code !== selectedFlag);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {pending ? (
        <div className="rounded-md bg-gray-100 py-2 px-4 border border-gray-200 cursor-pointer">
          <LuLoader className="animate-spin" />
        </div>
      ) : (
        <Flag
          code={lang2flag(selectedFlag)}
          height={45}
          width={45}
          className="transition-all duration-300 rounded-md bg-gray-100 p-1 border border-gray-200 cursor-pointer hover:bg-gray-200 hover:border-gray-400"
        />
      )}

      {isOpen && (
        <form action={action} className="absolute flex flex-col gap-2 py-2">
          {otherFlags.map(code => (
            <button type="submit" name="lang" value={code} key={code}>
              <Flag
                code={lang2flag(code)}
                height={100}
                width={100}
                className="transition-all duration-300 rounded-md bg-gray-100 p-1 border border-gray-200 cursor-pointer hover:bg-gray-200 hover:border-gray-400"
              />
            </button>
          ))}
        </form>
      )}
    </div>
  );
};
