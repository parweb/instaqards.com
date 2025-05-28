'use client';

import type { RefObject } from 'react';
import { Suspense, useActionState, useRef, useState } from 'react';
import { LuLoader } from 'react-icons/lu';
import { useOnClickOutside } from 'usehooks-ts';

import { setLang } from 'actions/lang-chooser';
import { cn, getAlphaTwoCode } from 'lib/utils';

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
      className={cn(
        'relative flex flex-col items-center rounded-md bg-white/80 p-1 backdrop-blur-sm',
        isOpen && 'rounded-b-none'
      )}
      onClick={() => setIsOpen(state => !state)}
      onKeyDown={() => {}}
    >
      {pending ? (
        <div className="cursor-pointer rounded-md border border-gray-200 bg-gray-100 px-4 py-2">
          <LuLoader className="animate-spin" />
        </div>
      ) : (
        <FlagComponent
          code={lang2flag(selectedFlag)}
          height={45}
          width={45}
          className="cursor-pointer rounded-md border border-gray-200 bg-gray-100 p-1 transition-all duration-300 hover:border-gray-400 hover:bg-gray-200"
        />
      )}

      {isOpen && (
        <form
          action={action}
          className="absolute top-full flex flex-col gap-2 rounded-b-md bg-white/80 p-1 backdrop-blur-sm"
        >
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
                className="cursor-pointer rounded-md border border-gray-200 bg-gray-100 p-1 transition-all duration-300 hover:border-gray-400 hover:bg-gray-200"
              />
            </button>
          ))}
        </form>
      )}
    </div>
  );
};
