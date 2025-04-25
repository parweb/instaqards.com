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
  onChange = () => {},
  maxItems = 10
}: {
  name: string;
  options: { id: string; name: string }[];
  placeholder?: string;
  searchPlaceholder?: string;
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: string) => void;
  defaultValue?: string;
  maxItems?: number;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue ?? '');
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(0);

  // Filtrer les options selon la recherche
  const filteredOptions = React.useMemo(
    () =>
      options.filter(option =>
        option.name.toLowerCase().includes(search.toLowerCase())
      ),
    [options, search]
  );

  // Pagination des options filtrées
  const paginatedOptions = React.useMemo(
    () => filteredOptions.slice(page * maxItems, page * maxItems + maxItems),
    [filteredOptions, page]
  );

  // Remettre la page à 0 si la recherche change
  React.useEffect(() => {
    setPage(0);
  }, [search]);

  React.useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
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
          <CommandInput
            placeholder={searchPlaceholder ?? 'Search ...'}
            value={search}
            onValueChange={setSearch}
          />

          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup>
              {paginatedOptions.map(option => (
                <CommandItem
                  keywords={[option.name]}
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
            {/* Pagination Controls */}
            {filteredOptions.length > maxItems && (
              <div className="flex justify-between items-center px-2 py-1 border-t text-xs">
                <button
                  type="button"
                  disabled={page === 0}
                  className="px-2 py-1 disabled:opacity-50"
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                >
                  Précédent
                </button>
                <span>
                  Page {page + 1} /{' '}
                  {Math.ceil(filteredOptions.length / maxItems)}
                </span>
                <button
                  type="button"
                  disabled={(page + 1) * maxItems >= filteredOptions.length}
                  className="px-2 py-1 disabled:opacity-50"
                  onClick={() => setPage(p => p + 1)}
                >
                  Suivant
                </button>
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
