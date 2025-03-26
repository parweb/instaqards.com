import { useCallback, useEffect, useRef } from 'react';

interface UseSearchFieldProps {
  query: string;
}

export const useSearchField = ({ query }: UseSearchFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

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

    focusInput
  };
};
