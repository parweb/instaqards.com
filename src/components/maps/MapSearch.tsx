'use client';

import { useCallback, useEffect, useMemo } from 'react';

import { useMapSearch } from 'components/maps/hooks/useMapSearch';
import type { Location } from 'components/maps/types';
import { cn } from 'lib/utils';
import MapContainer from './MapContainer';
import SearchInput from './SearchInput';

interface MapSearchProps {
  // eslint-disable-next-line no-unused-vars
  onLocationSelect?: (location: Location) => void;
  className?: string;
}

const MapSearch = ({ onLocationSelect, className }: MapSearchProps) => {
  const {
    query,
    setQuery,
    searchResults,
    isSearching,
    selected,
    isOpen,
    setIsOpen,
    mapPosition,
    isHandlingSelection,
    handleSearch,
    handleSelectResult,
    clearSearch,
    debouncedQuery
  } = useMapSearch({ onLocationSelect });

  // Efficiently run search only when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length > 0) {
      handleSearch(debouncedQuery);
    }
  }, [debouncedQuery, handleSearch]);

  const handleClearSearch = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      clearSearch();
    },
    [clearSearch]
  );

  const containerClassName = useMemo(
    () => cn('space-y-4', className),
    [className]
  );

  return (
    <div className={containerClassName}>
      <SearchInput
        query={query}
        isOpen={isOpen}
        isSearching={isSearching}
        searchResults={searchResults}
        onQueryChange={setQuery}
        onOpenChange={setIsOpen}
        onResultSelect={handleSelectResult}
        onClearSearch={handleClearSearch}
        isHandlingSelection={isHandlingSelection}
      />

      <MapContainer
        inputValue={{
          name: 'Le chateaux',
          address: '2 Rue des Cévennes, 75015 Paris'
        }}
        selected={
          selected
            ? {
                id: selected.place_id,
                display_name: selected.formatted_address,
                lat: selected.geometry.location.lat,
                lng: selected.geometry.location.lng
              }
            : null
        }
        mapPosition={mapPosition}
      />
    </div>
  );
};

export default MapSearch;
