import { useState, useEffect, useRef, type RefObject } from 'react';

export default function useOnScreen<T extends HTMLElement>(
  options?: IntersectionObserverInit & { preloadMargin?: number }
): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const preloadMargin = options?.preloadMargin ?? 700;
    const rootElement = (options?.root as HTMLElement) || null;

    const checkVisibility = () => {
      if (!el) return;

      const rootRect = rootElement
        ? rootElement.getBoundingClientRect()
        : {
            top: 0,
            right: window.innerWidth,
            bottom: window.innerHeight,
            left: 0
          };

      const elementRect = el.getBoundingClientRect();

      const isNearOrInViewport =
        !(
          elementRect.bottom < rootRect.top || elementRect.top > rootRect.bottom
        ) ||
        (elementRect.bottom < rootRect.top &&
          elementRect.bottom > rootRect.top - preloadMargin) ||
        (elementRect.top > rootRect.bottom &&
          elementRect.top < rootRect.bottom + preloadMargin);

      setIsVisible(isNearOrInViewport);
    };

    checkVisibility();

    const scrollContainer = rootElement || window;
    scrollContainer.addEventListener('scroll', checkVisibility, {
      passive: true
    });

    const resizeObserver = new ResizeObserver(checkVisibility);
    resizeObserver.observe(el);

    const intervalCheck = setInterval(checkVisibility, 1000);

    return () => {
      scrollContainer.removeEventListener('scroll', checkVisibility);
      resizeObserver.disconnect();
      clearInterval(intervalCheck);
    };
  }, [options?.root, options?.preloadMargin]);

  return [ref, isVisible];
}
