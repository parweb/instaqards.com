'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { LuX, LuZoomIn, LuZoomOut } from 'react-icons/lu';

export default function ImageFullscreen({
  src,
  onClose,
  initialPosition = { x: 0, y: 0, width: 0, height: 0 }
}: {
  src: string;
  onClose: () => void;
  initialPosition?: { x: number; y: number; width: number; height: number };
}) {
  // État pour gérer l'animation de fermeture
  const [isClosing, setIsClosing] = useState(false);

  // Fonction pour fermer avec animation
  const handleClose = () => {
    setIsClosing(true);
    // Délai pour permettre à l'animation de se terminer avant de fermer réellement
    setTimeout(() => {
      onClose();
    }, 500); // Durée de l'animation
  };
  const [scale, setScale] = useState(1);

  // Fonction pour zoomer
  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };

  // Fonction pour dézoomer
  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  // Fermer avec la touche Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Utiliser un portail React pour rendre le composant directement au niveau du body
  // Cela garantit qu'il n'est pas limité par les conteneurs parents
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Calcul des dimensions finales pour l'animation
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Calcul de la position centrale pour l'animation finale
  const centerX = windowSize.width / 2 - (windowSize.width * 0.8) / 2;
  const centerY = windowSize.height / 2 - (windowSize.height * 0.8) / 2;
  const finalWidth = Math.min(windowSize.width * 0.8, 1200);
  const finalHeight = Math.min(windowSize.height * 0.8, 800);

  const modalContent = (
    <div className="fixed inset-0 z-[9999] bg-black/0 pointer-events-auto">
      {/* Fond qui s'assombrit progressivement */}
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        onClick={handleClose}
      />

      {/* Bouton de fermeture */}
      <motion.button
        type="button"
        onClick={handleClose}
        className="absolute top-4 right-4 z-[10000] p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        aria-label="Fermer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.3 }}
      >
        <LuX size={24} />
      </motion.button>

      {/* Contrôles de zoom */}
      <motion.div
        className="absolute bottom-4 right-4 z-[10000] flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          type="button"
          onClick={zoomOut}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Réduire"
        >
          <LuZoomOut size={24} />
        </button>
        <button
          type="button"
          onClick={zoomIn}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Agrandir"
        >
          <LuZoomIn size={24} />
        </button>
      </motion.div>

      {/* Conteneur de l'image avec animation */}
      <motion.div
        className="absolute overflow-hidden"
        initial={{
          x: initialPosition.x,
          y: initialPosition.y,
          width: initialPosition.width,
          height: initialPosition.height,
          borderRadius: '50%'
        }}
        animate={{
          x: isClosing ? initialPosition.x : centerX,
          y: isClosing ? initialPosition.y : centerY,
          width: isClosing ? initialPosition.width : finalWidth,
          height: isClosing ? initialPosition.height : finalHeight,
          borderRadius: isClosing ? '50%' : '8px'
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        style={{ scale }}
        onClick={e => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.div
          className="w-full h-full overflow-hidden"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <button
            type="button"
            onClick={handleClose}
            className="border-0 p-0 bg-transparent w-full h-full"
            aria-label="Fermer l'image"
          >
            <img src={src} alt="" className="w-full h-full object-contain" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );

  // Ne rendre le portail que côté client après le montage du composant
  return mounted && typeof document !== 'undefined'
    ? createPortal(
        <AnimatePresence mode="wait">{modalContent}</AnimatePresence>,
        document.body
      )
    : null;
}
