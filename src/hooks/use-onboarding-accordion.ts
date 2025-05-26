'use client';

import { useState, useEffect } from 'react';

const COOKIE_NAME = 'onboarding-accordion-visited';

export function useOnboardingAccordion() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà visité la page
    const hasVisited = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${COOKIE_NAME}=`));

    if (!hasVisited) {
      // Première visite - accordéon ouvert
      setIsOpen(true);
      // Marquer comme visité
      document.cookie = `${COOKIE_NAME}=true; path=/; max-age=${60 * 60 * 24 * 365}`; // 1 an
    } else {
      // Déjà visité - accordéon fermé
      setIsOpen(false);
    }

    setIsLoaded(true);
  }, []);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const resetCookie = () => {
    // Supprimer le cookie en définissant une date d'expiration passée
    document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    // Réinitialiser l'état
    setIsOpen(true);
  };

  return {
    isOpen,
    isLoaded,
    toggleAccordion,
    resetCookie
  };
}
