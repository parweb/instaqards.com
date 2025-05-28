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
          className="overflow-hidden rounded-sm border"
          style={{
            backgroundImage:
              'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
          }}
        >
          <div
            style={{ backgroundColor: value }}
            className={cn('aspect-square h-9 cursor-pointer', className)}
          />
        </div>
      </PopoverTrigger>

      <input name={name} type="hidden" value={value} />

      <PopoverContent className="relative z-300 w-auto p-0">
        <HexAlphaColorPicker color={value} onChange={onChange} />
      </PopoverContent>
    </Popover>
  );
};
