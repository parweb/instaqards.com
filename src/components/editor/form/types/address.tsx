'use client';

import { useCallback, useEffect } from 'react';
import {
  Controller,
  ControllerRenderProps,
  type Control,
  type FieldValues
} from 'react-hook-form';

import { useMapSearch } from 'components/maps/hooks/useMapSearch';
import SearchInput from 'components/maps/SearchInput';
import { SearchResult } from 'components/maps/types';
import type { Block as BlockType } from 'lib/utils';

// Composant optimisé pour l'adresse
const AddressInput = (props: ControllerRenderProps<FieldValues, string>) => {
  // Utilisation du hook useMapSearch avec un callback optimisé
  const {
    query,
    setQuery,
    searchResults,
    isSearching,
    selectedLocation,
    isOpen,
    setIsOpen,
    mapPosition,
    isHandlingSelection,
    handleSearch,
    handleSelectResult,
    clearSearch,
    debouncedQuery
  } = useMapSearch({
    onLocationSelect: useCallback(
      (location: { display_name: string; lat: number; lon: number }) => {
        // Mise à jour directe du champ avec les coordonnées, sans log
        props.onChange([location.lat, location.lon]);
      },
      [props]
    )
  });

  // Déclenchement de la recherche quand la requête change
  useEffect(() => {
    if (debouncedQuery.trim().length > 0) {
      handleSearch(debouncedQuery);
    }
  }, [debouncedQuery, handleSearch]);

  // Handler optimisé pour effacer la recherche
  const handleClearSearch = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      clearSearch();
    },
    [clearSearch]
  );

  return (
    <>
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
    </>
  );
};

// Composant Address principal avec memoïzation optimisée
export const Address = ({
  control,
  name,
  shape,
  data
}: {
  control: Control<FieldValues>;
  name: string;
  shape: Extract<BlockType, { kind: 'address' }>;
  data: Record<string, unknown>;
}) => {
  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          return (
            <>
              <AddressInput {...field} />
            </>
          );
        }}
      />
    </>
  );
};
