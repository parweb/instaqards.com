'use client';

import type { RefObject } from 'react';
import { Suspense, useRef, useState, useActionState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

import { setLang } from 'actions/lang-chooser';
import { getAlphaTwoCode } from 'lib/utils';
import { LuLoader } from 'react-icons/lu';

interface FlagProps {
  code: string;
  height?: number;
  width?: number;
  className?: string;
}

const Flag = ({ code, ...rest }: FlagProps) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={getAlphaTwoCode(code)}
      src={`/assets/flags/${getAlphaTwoCode(code)}.svg`}
      height={rest.height}
      width={rest.width}
      className={rest.className}
    />
  );
};

const FlagComponent = (props: FlagProps) => {
  return (
    <Suspense fallback={null}>
      <Flag
        code={props.code}
        height={props.height}
        width={props.width}
        className={props.className}
      />
    </Suspense>
  );
};

const lang2flag = (lang: string) => {
  const mapping: Record<string, string> = {
    fr: 'FR',
    en: 'US',
    it: 'IT',
    de: 'DE',
    es: 'ES',
    gb: 'GB'
  };

  return mapping?.[lang] ?? lang;
};

export const FlagPicker = ({
  options = ['fr', 'en', 'it', 'es', 'gb'],
  value
}: {
  options?: string[];
  value: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  useOnClickOutside(ref as RefObject<HTMLElement>, () => {
    setIsOpen(false);
  });

  const [selectedFlag, action, pending] = useActionState(setLang, value);

  const otherFlags = options.filter(code => code !== selectedFlag);

  return (
    <div
      ref={ref}
      className="relative"
      onClick={() => setIsOpen(state => !state)}
      onKeyDown={() => {}}
    >
      {pending ? (
        <div className="rounded-md bg-gray-100 py-2 px-4 border border-gray-200 cursor-pointer">
          <LuLoader className="animate-spin" />
        </div>
      ) : (
        <FlagComponent
          code={lang2flag(selectedFlag)}
          height={45}
          width={45}
          className="transition-all duration-300 rounded-md bg-gray-100 p-1 border border-gray-200 cursor-pointer hover:bg-gray-200 hover:border-gray-400"
        />
      )}

      {isOpen && (
        <form action={action} className="absolute flex flex-col gap-2 py-2">
          {otherFlags.map(code => (
            <button
              onClick={e => e.stopPropagation()}
              type="submit"
              name="lang"
              value={code}
              key={code}
            >
              <FlagComponent
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
