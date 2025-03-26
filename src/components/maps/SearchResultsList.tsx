import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from 'components/ui/command';
import { memo } from 'react';
import type { SearchResultsListProps } from './types';
import { LocationIcon } from './icons/LocationIcon';

export const SearchResultsList = memo(
  ({ results, onSelect }: SearchResultsListProps) => {
    return (
      <Command className="max-h-[300px]" shouldFilter={false} loop>
        <CommandList>
          <CommandEmpty className="p-6 text-center">
            <div className="text-muted-foreground">
              <LocationIcon className="mx-auto h-6 w-6 mb-2 opacity-50" />
              <p className="text-sm font-medium">No locations found</p>
              <p className="text-xs mt-1">
                Try searching for a different place
              </p>
            </div>
          </CommandEmpty>

          <CommandGroup>
            {results.map(result => (
              <CommandItem
                key={result.id}
                value={result.display_name}
                onSelect={() => onSelect(result)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <LocationIcon className="flex-shrink-0 h-4 w-4" />
                <span>{result.display_name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    );
  }
);
