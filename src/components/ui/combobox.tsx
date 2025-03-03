'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from 'lib/utils';
import { Button } from 'components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from 'components/ui/command';

export function Combobox({
  options,
  placeholder,
  searchPlaceholder,
  value,
  onChange = () => {}
}: {
  options: { id: string; name: string }[];
  placeholder?: string;
  searchPlaceholder?: string;
  onChange?: (value: string) => void;
  value: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState(value);

  React.useEffect(() => {
    onChange(data);
  }, [data, onChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          // biome-ignore lint/a11y/useSemanticElements: shut up
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? options.find(option => option.id === value)?.name
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder ?? 'Search ...'} />

          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  key={option.id}
                  value={option.id}
                  onSelect={currentValue => {
                    setData(currentValue === data ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {option.name}
                  <Check
                    className={cn(
                      'ml-auto',
                      data === option.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
