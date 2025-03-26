import { useCallback, useEffect, useRef } from 'react';

interface UseSearchFieldProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export const useSearchField = ({
  query,
  onQueryChange,
}: UseSearchFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onQueryChange(e.target.value);
    },
    [onQueryChange]
  );

  const focusInput = useCallback(() => {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, []);

  // Focus l'input après un clear
  useEffect(() => {
    if (query === '') {
      focusInput();
    }
  }, [query, focusInput]);

  return {
    inputRef,
    handleInputChange,
    focusInput,
  };
}; 