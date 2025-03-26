import { Button } from 'components/ui/button';
import { MapPin, X } from 'lucide-react';
import { memo, useCallback } from 'react';
import type { SearchInputFieldProps } from './types';
import { Input } from 'components/ui/input';

const SearchInputField = ({
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

  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onQueryChange(e.target.value);
      onOpenChange(true);
    },
    [onQueryChange, onOpenChange]
  );

  const handleClearSearch = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onClearSearch(e);
    },
    [onClearSearch]
  );

  return (
    <div className="relative flex items-center gap-2 w-full">
      <div className="absolute inset-2 flex items-center justify-start pointer-events-none">
        {isSearching ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        ) : (
          <MapPin className="h-4 w-4 opacity-50" />
        )}
      </div>

      {query && (
        <div className="absolute top-0 right-0 bottom-0 w-7 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 hover:bg-transparent p-0 transition-colors duration-200 ring-0"
            onClick={handleClearSearch}
            tabIndex={-1}
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-red-700 transition-colors duration-200" />
            <span className="sr-only">Clear search</span>
          </Button>
        </div>
      )}

      <div className="w-full">
        <Input
          ref={inputRef}
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          placeholder="Search for a place..."
          spellCheck={false}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={true}
          aria-controls="search-results"
          role="combobox"
          className="px-7"
        />
      </div>
    </div>
  );
};

SearchInputField.displayName = 'SearchInputField';

export default memo(SearchInputField);
