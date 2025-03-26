import { Button } from 'components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { useSearchField } from 'components/maps/hooks/useSearchField';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import type { SearchInputProps, SearchResult } from './types';
import { SearchInputField } from './SearchInputField';
import { SearchResultsList } from './SearchResultsList';

const SearchInput = memo(
  ({
    query,
    isOpen,
    isSearching,
    searchResults,
    onQueryChange,
    onOpenChange,
    onResultSelect,
    onClearSearch,
    isHandlingSelection
  }: SearchInputProps) => {
    const { inputRef, handleInputChange, focusInput } = useSearchField({
      query,
      onQueryChange
    });

    const shouldShowResults = useMemo(
      () => isOpen && searchResults.length > 0 && !isHandlingSelection.current,
      [isOpen, searchResults.length, isHandlingSelection]
    );

    const handleResultSelection = useCallback(
      (result: SearchResult) => {
        onResultSelect(result);
        focusInput();
      },
      [onResultSelect, focusInput]
    );

    return (
      <Popover
        open={shouldShowResults}
        onOpenChange={open => {
          onOpenChange(open);
          if (!open) {
            focusInput();
          }
        }}
      >
        <PopoverTrigger asChild>
          <div className="w-full rounded-md border border-input bg-background px-3 py-2">
            <SearchInputField
              query={query}
              isSearching={isSearching}
              onQueryChange={onQueryChange}
              onClearSearch={onClearSearch}
              onOpenChange={onOpenChange}
              inputRef={inputRef}
            />
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="w-full p-0 z-50"
          align="start"
          side="bottom"
          sideOffset={4}
          alignOffset={0}
          avoidCollisions
          onOpenAutoFocus={e => e.preventDefault()}
          onCloseAutoFocus={e => e.preventDefault()}
        >
          <SearchResultsList
            results={searchResults}
            onSelect={handleResultSelection}
          />
        </PopoverContent>
      </Popover>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
