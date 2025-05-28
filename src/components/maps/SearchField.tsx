import { X } from 'lucide-react';
import { forwardRef, memo } from 'react';

import LoadingIcon from 'components/maps/icons/LoadingIcon';
import SearchIcon from 'components/maps/icons/SearchIcon';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { cn } from 'lib/utils';

interface SearchFieldProps {
  query: string;
  isSearching: boolean;
  // eslint-disable-next-line no-unused-vars
  onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // eslint-disable-next-line no-unused-vars
  onClearSearch: (e: React.MouseEvent) => void;
  className?: string;
  placeholder?: string;
  'aria-expanded'?: boolean;
}

const SearchField = memo(
  forwardRef<HTMLInputElement, SearchFieldProps>(
    (
      {
        query,
        onQueryChange,
        onClearSearch,
        className,
        placeholder = 'Search for a place...',
        'aria-expanded': ariaExpanded,
        isSearching
      },
      ref
    ) => {
      return (
        <div className={cn('relative', className)}>
          {isSearching ? <LoadingIcon /> : <SearchIcon />}

          <Input
            ref={ref}
            value={query}
            onChange={onQueryChange}
            placeholder={placeholder}
            className={cn(
              'h-12 pr-12 pl-10 shadow-xs transition-all hover:shadow-sm',
              'focus:border-primary focus:ring-primary/10 focus:ring-2'
            )}
            type="text"
            role="combobox"
            aria-expanded={ariaExpanded}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
          />

          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={onClearSearch}
            >
              <X className="text-muted-foreground h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
      );
    }
  )
);

SearchField.displayName = 'SearchField';

export default SearchField;
