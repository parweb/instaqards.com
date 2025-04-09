import { Command, CommandGroup, CommandList } from 'components/ui/command';
import { memo, useCallback } from 'react';
import { LocationIcon } from './icons/LocationIcon';
import type { SearchResultsListProps } from './types';

const SearchResultsListComponent = ({
  results,
  onSelect
}: SearchResultsListProps) => {
  // Handler unifié et memoïzé
  const handleResultSelection = useCallback(
    (result: any) => {
      // Appel direct sans log pour réduire la latence
      onSelect(result);
    },
    [onSelect]
  );

  return (
    <Command className="max-h-[300px]" shouldFilter={false} loop>
      <CommandList>
        <CommandGroup>
          {results.map(result => {
            const display_name = [
              result.address?.house_number,
              result.address?.road,
              result.address?.postcode,
              result.address?.municipality
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <div
                key={result.id}
                className="location-result-wrapper relative block w-full p-2 hover:bg-accent hover:text-accent-foreground rounded-sm cursor-pointer"
                onClick={() => handleResultSelection(result)}
                onMouseDown={e => {
                  e.preventDefault(); // Évite les problèmes de focus
                  handleResultSelection(result);
                }}
                tabIndex={0}
                role="button"
                aria-label={`Select location: ${display_name}`}
              >
                <div className="flex items-center gap-2">
                  <LocationIcon className="shrink-0 h-4 w-4" />
                  <span>{display_name}</span>
                </div>
              </div>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

SearchResultsListComponent.displayName = 'SearchResultsList';

export const SearchResultsList = memo(SearchResultsListComponent);
