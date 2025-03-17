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
  name,
  options,
  placeholder,
  searchPlaceholder,
  defaultValue,
  onChange = () => {}
}: {
  name: string;
  options: { id: string; name: string }[];
  placeholder?: string;
  searchPlaceholder?: string;
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: string) => void;
  defaultValue?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue ?? '');

  React.useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          // biome-ignore lint/a11y/useSemanticElements: shut up
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          <input type="hidden" name={name} value={value} />
          {value
            ? options.find(option => option.id === value)?.name
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0" side="bottom" align="start">
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
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {option.name}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === option.id ? 'opacity-100' : 'opacity-0'
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
