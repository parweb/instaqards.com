import { Button } from 'components/ui/button';
import { MapPin, X } from 'lucide-react';
import { memo, useCallback } from 'react';
import type { SearchInputFieldProps } from './types';

export const SearchInputField = memo(
  ({
    query,
    isSearching,
    onQueryChange,
    onClearSearch,
    onOpenChange,
    inputRef
  }: SearchInputFieldProps) => {
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onOpenChange(false);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          onOpenChange(true);
        }
      },
      [onOpenChange]
    );

    return (
      <div className="flex items-center gap-2 w-full">
        <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
          {isSearching ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          ) : (
            <MapPin className="h-4 w-4 opacity-50" />
          )}
        </div>

        <input
          ref={inputRef}
          value={query}
          onChange={e => {
            onQueryChange(e.target.value);
            onOpenChange(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search for a place..."
          className="flex-1 bg-transparent border-none outline-none placeholder:text-muted-foreground text-sm"
          spellCheck={false}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={true}
          aria-controls="search-results"
          role="combobox"
        />

        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 hover:bg-transparent p-0 transition-colors duration-200"
            onClick={e => {
              e.preventDefault();
              onClearSearch(e);
            }}
            tabIndex={-1}
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-red-700 transition-colors duration-200" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
    );
  }
);
