'use client';

import { AnimatePresence, motion } from 'motion/react';
import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import useWindowSize from 'hooks/use-window-size';
import Leaflet from './leaflet';
import { useIsMobile } from 'hooks/use-mobile';

export default function Modal({
  children,
  showModal,
  setShowModal
}: {
  children: React.ReactNode;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const desktopModalRef = useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowModal(false);
      }
    },
    [setShowModal]
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  return (
    <AnimatePresence>
      {showModal && (
        <div className="pointer-events-auto z-20">
          {isMobile === true && (
            <Leaflet setShow={setShowModal}>{children}</Leaflet>
          )}
          {isMobile === false && (
            <>
              <motion.div
                key="desktop-backdrop"
                className="fixed inset-0 bg-gray-100/10 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
              />

              <motion.div
                ref={desktopModalRef}
                key="desktop-modal"
                className="fixed inset-0 hidden min-h-screen items-center justify-center md:flex"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onMouseDown={e => {
                  if (desktopModalRef.current === e.target) {
                    setShowModal(false);
                  }
                }}
              >
                {children}
              </motion.div>
            </>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
