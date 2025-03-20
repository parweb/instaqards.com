'use client';

import { HexAlphaColorPicker } from 'react-colorful';

import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { cn } from 'lib/utils';

export const ColorPicker = ({
  name,
  value,
  onChange,
  className
}: {
  name: string;
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (color: string) => void;
  className?: string;
}) => {
  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <div
          style={{ backgroundColor: value }}
          className={cn(
            'aspect-square h-9 border rounded-sm cursor-pointer',
            className
          )}
        />
      </PopoverTrigger>

      <input name={name} type="hidden" value={value} />

      <PopoverContent className="w-auto p-0 z-[300] relative">
        <HexAlphaColorPicker color={value} onChange={onChange} />
      </PopoverContent>
    </Popover>
  );
};
