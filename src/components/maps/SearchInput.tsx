import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { useSearchField } from 'components/maps/hooks/useSearchField';
import { memo, useCallback, useMemo } from 'react';
import type { SearchInputProps, SearchResult } from './types';
import SearchInputField from './SearchInputField';
import { SearchResultsList } from './SearchResultsList';

const SearchInput = ({
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
  const { inputRef, focusInput } = useSearchField({ query });

  const shouldShowResults = useMemo(
    () => isOpen && searchResults.length > 0 && !isHandlingSelection.current,
    [isOpen, searchResults.length, isHandlingSelection]
  );

  const handleResultSelection = useCallback(
    (result: SearchResult) => {
      onOpenChange(false);
      onResultSelect(result);
      setTimeout(focusInput, 10);
    },
    [onResultSelect, onOpenChange, focusInput]
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      onOpenChange(open);
      if (!open) {
        focusInput();
      }
    },
    [onOpenChange, focusInput]
  );

  const handleAutoFocus = useCallback((e: Event) => e.preventDefault(), []);

  return (
    <Popover modal open={shouldShowResults} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div className="w-full">
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
        className="w-full p-0 z-[300]"
        align="start"
        side="bottom"
        sideOffset={4}
        alignOffset={0}
        avoidCollisions
        onOpenAutoFocus={handleAutoFocus}
        onCloseAutoFocus={handleAutoFocus}
      >
        <SearchResultsList
          results={searchResults}
          onSelect={handleResultSelection}
        />
      </PopoverContent>
    </Popover>
  );
};

SearchInput.displayName = 'SearchInput';

export default memo(SearchInput);
