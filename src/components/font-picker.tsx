'use client';

import type { Dispatch, RefObject, SetStateAction } from 'react';
import { memo, useEffect, useRef, useState, useCallback } from 'react';
import { LuChevronDown, LuChevronUp, LuSearch } from 'react-icons/lu';
import { useOnClickOutside } from 'usehooks-ts';

import { Input } from 'components/ui/input';
import useGoogleFontLoader from 'hooks/use-google-font-loader';
import useOnScreen from 'hooks/use-on-screen';
import { clamp, cn } from 'lib/utils';

const FontItem = ({
  font,
  selectedFont,
  focusedFont,
  handleSelectFont,
  root
}: {
  font: string;
  selectedFont: string | null;
  focusedFont: string | null;
  // eslint-disable-next-line no-unused-vars
  handleSelectFont: (font: string) => void;
  root: RefObject<HTMLDivElement | null>;
}) => {
  const [ref, isVisible] = useOnScreen<HTMLDivElement>({
    root: root.current ?? null,
    preloadMargin: 500,
    threshold: 0
  });

  const [isHovered, setIsHovered] = useState(false);

  useGoogleFontLoader(isVisible ? font : null);

  return (
    <div
      ref={ref}
      data-font={font}
      key={font}
      onClick={() => handleSelectFont(font)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={() => {}}
      className={cn(
        'p-2 rounded-md cursor-pointer border border-transparent text-left w-full',
        (focusedFont === font || isHovered) && 'bg-gray-100 border-gray-300',
        selectedFont === font && 'bg-gray-200 border-gray-400'
      )}
      style={{
        fontFamily: isVisible ? font : 'inherit'
      }}
    >
      {font}
    </div>
  );
};

const FontPickerList = ({
  open,
  fonts,
  setOpen,
  onChange,
  value,
  id
}: {
  open: boolean;
  fonts: string[];
  setOpen: Dispatch<SetStateAction<boolean>>;
  // eslint-disable-next-line no-unused-vars
  onChange: (font: string | null) => void;
  value: string | null;
  id?: string;
}) => {
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');

  const filteredFonts = fonts.filter(font =>
    font.toLowerCase().includes(search.toLowerCase())
  );

  const [focusedIndex, setFocusedIndex] = useState<number>(
    filteredFonts.findIndex(font => font === value) ?? 0
  );

  const focusedFont = filteredFonts?.[focusedIndex] ?? null;

  useGoogleFontLoader(value);

  useEffect(() => {
    if (!open) return;

    setFocusedIndex(filteredFonts.findIndex(font => font === value) ?? 0);
    input.current?.focus();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return;

    const targetFont = focusedFont || value;

    if (targetFont) {
      const element = document.querySelector(`[data-font="${targetFont}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [focusedFont, open, value]);

  // Keyboard navigation
  useEffect(() => {
    if (!open || filteredFonts.length === 0) return;

    const controller = new AbortController();

    document.addEventListener(
      'keydown',
      event => {
        // Only prevent default for navigation keys we're handling
        if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(event.key)) {
          // For these keys, prevent default only when our component is open
          event.preventDefault();

          if (event.key === 'ArrowDown') {
            const nextIndex = focusedIndex + 1;
            setFocusedIndex(clamp(nextIndex, 0, filteredFonts.length - 1));
          } else if (event.key === 'ArrowUp') {
            const prevIndex = focusedIndex - 1;
            setFocusedIndex(clamp(prevIndex, 0, filteredFonts.length - 1));
          } else if (event.key === 'Enter' && focusedFont) {
            onChange(focusedFont);
            setOpen(false);
          } else if (event.key === 'Escape') {
            setOpen(false);
          }
        }
      },
      { signal: controller.signal }
    );
    return () => controller.abort();
  }, [open, filteredFonts, focusedFont, focusedIndex, setOpen, onChange]);

  const handleSelectFont = useCallback(
    (font: string) => {
      const newValue = value === font ? null : font;
      onChange(newValue);
      setOpen(false);
    },
    [onChange, setOpen, value]
  );

  return (
    <div
      className={cn(
        'z-1 absolute top-full left-0 right-0 bg-white rounded-b-md border border-gray-300',
        'flex flex-col gap-4 p-4',
        !open && 'invisible'
      )}
      tabIndex={-1}
    >
      <div className="relative">
        <Input
          ref={input}
          placeholder="Search fonts"
          className="w-full pl-7"
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search fonts"
        />

        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-stone-500">
          <LuSearch aria-hidden="true" />
        </div>
      </div>

      <div
        ref={root}
        className="flex flex-col gap-1 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2"
        id={id ? `${id}-listbox` : undefined}
        aria-label="Font options"
      >
        {filteredFonts.length === 0 && (
          <div className="p-2 text-stone-500 text-center">No fonts found</div>
        )}
        {filteredFonts.length > 0 && (
          <ul className="list-none p-0 m-0">
            {filteredFonts.map(font => (
              <li key={font}>
                <FontItem
                  font={font}
                  selectedFont={value}
                  focusedFont={focusedFont}
                  handleSelectFont={handleSelectFont}
                  root={root}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export const FontPicker = memo(
  ({
    id,
    name,
    fonts,
    onChange,
    value
  }: {
    id?: string;
    name: string;
    fonts: string[];
    // eslint-disable-next-line no-unused-vars
    onChange: (font: string | null) => void;
    value: string | null;
  }) => {
    const ref = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);

    useOnClickOutside(ref as RefObject<HTMLElement>, () => setOpen(false));

    return (
      <div
        id={id}
        ref={ref}
        className={cn(
          'relative w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-hidden focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white',
          'rounded-md',
          open && 'rounded-b-none'
        )}
      >
        <input name={name} type="hidden" value={value ?? ''} />

        <button
          id={`${id}-button`}
          onClick={() => setOpen(state => !state)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === 'Space') {
              setOpen(state => !state);
            }
          }}
          type="button"
          style={{ fontFamily: value ?? 'inherit' }}
          className="flex items-center justify-between cursor-pointer w-full"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={`${id}-listbox`}
        >
          <span>{value || 'Choose a font'}</span>
          <div>
            {open ? (
              <LuChevronUp aria-hidden="true" />
            ) : (
              <LuChevronDown aria-hidden="true" />
            )}
          </div>
        </button>

        <FontPickerList
          open={open}
          fonts={fonts}
          setOpen={setOpen}
          onChange={onChange}
          value={value}
          id={id}
        />
      </div>
    );
  }
);

FontPicker.displayName = 'FontPicker';
