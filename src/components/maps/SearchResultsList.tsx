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
            const display_name = result.formatted_address;

            return (
              <div
                key={result.place_id}
                className="location-result-wrapper hover:bg-accent hover:text-accent-foreground relative block w-full cursor-pointer rounded-sm p-2"
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
                  <LocationIcon className="h-4 w-4 shrink-0" />
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
