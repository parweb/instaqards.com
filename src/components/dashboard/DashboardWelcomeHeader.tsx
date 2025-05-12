'use client';
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

// Blobs SVG organiques morphing
const Blob = ({ d, color, animateTo, duration, delay = 0, opacity = 0.18 }) => (
  <motion.path
    d={d}
    fill={color}
    initial={{ d }}
    animate={{ d: animateTo }}
    transition={{
      duration,
      repeat: Infinity,
      repeatType: 'reverse',
      delay,
      ease: 'easeInOut'
    }}
    style={{ opacity }}
  />
);

// Blobs très flous et lumineux pour l'arrière-plan
const BlobsBlurBg = () => (
  <svg
    className="absolute inset-0 w-full h-full z-0 pointer-events-none"
    viewBox="0 0 1440 600"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: 'blur(90px) brightness(1.3)' }}
  >
    <Blob
      d="M 200 200 Q 400 100 600 200 T 1000 200 Q 1200 300 1000 400 T 400 400 Q 200 300 200 200 Z"
      animateTo="M 220 220 Q 420 120 620 220 T 1020 220 Q 1220 320 1020 420 T 420 420 Q 220 320 220 220 Z"
      color="#60a5fa"
      duration={12}
      opacity={0.45}
    />
    <Blob
      d="M 800 100 Q 1000 50 1200 100 T 1300 300 Q 1200 500 1000 400 T 800 100 Z"
      animateTo="M 820 120 Q 1020 70 1220 120 T 1320 320 Q 1220 520 1020 420 T 820 120 Z"
      color="#a78bfa"
      duration={16}
      delay={2}
      opacity={0.38}
    />
    <Blob
      d="M 400 400 Q 600 500 800 400 T 1200 500 Q 1000 600 800 500 T 400 400 Z"
      animateTo="M 420 420 Q 620 520 820 420 T 1220 520 Q 1020 620 820 520 T 420 420 Z"
      color="#34d399"
      duration={18}
      delay={1}
      opacity={0.32}
    />
  </svg>
);

const BlobsBg = () => (
  <svg
    className="absolute inset-0 w-full h-full z-10 pointer-events-none"
    viewBox="0 0 1440 600"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Blob
      d="M 200 200 Q 400 100 600 200 T 1000 200 Q 1200 300 1000 400 T 400 400 Q 200 300 200 200 Z"
      animateTo="M 220 220 Q 420 120 620 220 T 1020 220 Q 1220 320 1020 420 T 420 420 Q 220 320 220 220 Z"
      color="#60a5fa"
      duration={12}
      opacity={0.18}
    />
    <Blob
      d="M 800 100 Q 1000 50 1200 100 T 1300 300 Q 1200 500 1000 400 T 800 100 Z"
      animateTo="M 820 120 Q 1020 70 1220 120 T 1320 320 Q 1220 520 1020 420 T 820 120 Z"
      color="#a78bfa"
      duration={16}
      delay={2}
      opacity={0.15}
    />
    <Blob
      d="M 400 400 Q 600 500 800 400 T 1200 500 Q 1000 600 800 500 T 400 400 Z"
      animateTo="M 420 420 Q 620 520 820 420 T 1220 520 Q 1020 620 820 520 T 420 420 Z"
      color="#34d399"
      duration={18}
      delay={1}
      opacity={0.13}
    />
  </svg>
);

// Halo lumineux radial derrière le panneau
const Halo = () => (
  <div
    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
    style={{ width: 700, height: 340 }}
  >
    <div
      className="w-full h-full rounded-full"
      style={{
        background:
          'radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.12) 60%, transparent 100%)',
        filter: 'blur(32px)'
      }}
    />
  </div>
);

// Vignettage doux sur les bords
const Vignette = () => (
  <div
    className="absolute inset-0 z-30 pointer-events-none"
    style={{
      background:
        'radial-gradient(ellipse at center, transparent 60%, rgba(30,41,59,0.10) 100%)',
      mixBlendMode: 'multiply'
    }}
  />
);

// Texture grain subtile
const Grain = () => (
  <div
    className="absolute inset-0 z-40 pointer-events-none"
    style={{
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E\")",
      backgroundSize: 'cover',
      opacity: 0.5
    }}
  />
);

// Mascotte flottante sur le panneau
const Mascotte = () => (
  <motion.div
    className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 z-40"
    initial={{ y: 0 }}
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    style={{ pointerEvents: 'none' }}
  >
    <svg
      width="60"
      height="60"
      viewBox="0 0 90 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="45" cy="60" rx="18" ry="10" fill="#e0e7ff" />
      <rect x="28" y="30" width="34" height="24" rx="10" fill="#6366f1" />
      <ellipse cx="38" cy="44" rx="3.5" ry="4.5" fill="#fff" />
      <ellipse cx="52" cy="44" rx="3.5" ry="4.5" fill="#fff" />
      <ellipse cx="38" cy="44" rx="1.2" ry="1.8" fill="#6366f1" />
      <ellipse cx="52" cy="44" rx="1.2" ry="1.8" fill="#6366f1" />
      <rect x="41" y="50" width="8" height="2.5" rx="1.2" fill="#fff" />
      <rect x="44" y="22" width="4" height="7" rx="2" fill="#6366f1" />
    </svg>
    <motion.div
      className="absolute left-1/2 top-[90%] -translate-x-1/2 rounded-full"
      style={{
        width: 40,
        height: 10,
        background:
          'radial-gradient(circle, #a5b4fc33 0%, #6366f111 80%, transparent 100%)'
      }}
      animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
    />
  </motion.div>
);

// Mascotte animée (robot friendly)
const MascotteAnimated = ({
  parallaxX,
  parallaxY
}: {
  parallaxX: number;
  parallaxY: number;
}) => (
  <motion.div
    className="absolute right-6 bottom-0 hidden md:block z-20"
    style={{
      x: parallaxX,
      y: parallaxY
    }}
    initial={{ scale: 1 }}
    animate={{ scale: [1, 1.04, 1], rotate: [0, 2, -2, 0] }}
    transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
  >
    <svg
      width="110"
      height="110"
      viewBox="0 0 90 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="45" cy="60" rx="28" ry="18" fill="#e0e7ff" />
      <rect x="20" y="25" width="50" height="35" rx="16" fill="#6366f1" />
      {/* Yeux */}
      <motion.ellipse cx="35" cy="45" rx="5" ry="7" fill="#fff" />
      <motion.ellipse cx="55" cy="45" rx="5" ry="7" fill="#fff" />
      <motion.ellipse
        cx="35"
        cy="45"
        rx="2.5"
        ry="3.5"
        fill="#6366f1"
        animate={{ cy: [45, 47, 45] }}
        transition={{
          repeat: Infinity,
          duration: 3,
          repeatType: 'mirror',
          delay: 0.5
        }}
      />
      <motion.ellipse
        cx="55"
        cy="45"
        rx="2.5"
        ry="3.5"
        fill="#6366f1"
        animate={{ cy: [45, 47, 45] }}
        transition={{
          repeat: Infinity,
          duration: 3,
          repeatType: 'mirror',
          delay: 0.7
        }}
      />
      {/* Bras qui salue */}
      <motion.rect
        x="15"
        y="38"
        width="12"
        height="4"
        rx="2"
        fill="#6366f1"
        animate={{ rotate: [0, -30, 0], x: [0, -8, 0], y: [0, -8, 0] }}
        style={{ originX: 1, originY: 0.5 }}
        transition={{
          repeat: Infinity,
          duration: 4,
          repeatType: 'mirror',
          delay: 1
        }}
      />
      {/* Sourire */}
      <path
        d="M38 54 Q45 60 52 54"
        stroke="#fff"
        strokeWidth="2.5"
        fill="none"
      />
      {/* Antenne */}
      <rect x="41" y="18" width="8" height="10" rx="4" fill="#6366f1" />
      <rect x="43" y="12" width="4" height="8" rx="2" fill="#6366f1" />
    </svg>
    {/* Halo lumineux */}
    <motion.div
      className="absolute -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        width: 120,
        height: 120,
        background:
          'radial-gradient(circle, #a5b4fc55 0%, #6366f122 80%, transparent 100%)'
      }}
      animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
    />
  </motion.div>
);

// Typewriter effect for the welcome message
const useTypewriter = (text: string, speed = 28) => {
  const [displayed, setDisplayed] = React.useState('');
  React.useEffect(() => {
    let i = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      setDisplayed(t => text.slice(0, t.length + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return displayed;
};

export const DashboardWelcomeHeader: React.FC<{ userName?: string }> = ({
  userName
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: 400, y: 120 });
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setSpot({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  const handleMouseLeave = () => setSpot({ x: 400, y: 120 });

  // Typewriter message
  const welcome = useTypewriter(
    userName
      ? `Prêt à créer de la magie aujourd'hui, ${userName} ?`
      : "Prêt à explorer et créer de la magie aujourd'hui ?"
  );

  // Animation d'apparition
  const [show, setShow] = useState(false);
  React.useEffect(() => {
    setShow(true);
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex flex-col items-center justify-center min-h-[340px] md:min-h-[420px] w-full mb-16 select-none overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <BlobsBlurBg />
      <BlobsBg />
      <Halo />
      <div className="absolute inset-0 z-20 backdrop-blur-3xl bg-white/10 dark:bg-stone-900/20 pointer-events-none" />
      <Vignette />
      <Grain />
      <div
        className="relative z-30 w-full max-w-2xl mx-auto px-6 py-12 md:py-16 flex flex-col items-center rounded-2xl border border-white/40 dark:border-stone-800 bg-white/30 dark:bg-stone-900/40 backdrop-blur-2xl shadow-2xl"
        style={{ boxShadow: '0 8px 64px 0 rgba(80,80,120,0.10)' }}
      >
        <Mascotte />
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold tracking-tight text-center leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-fuchsia-400 to-emerald-400 relative"
          initial={{ opacity: 0, y: 40 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, type: 'spring' }}
          style={{ backgroundSize: '200% 200%' }}
        >
          {userName
            ? `Bienvenue, ${userName} !`
            : 'Bienvenue sur votre dashboard'}
        </motion.h1>
        <motion.p
          className="mt-4 text-lg md:text-2xl text-stone-700 dark:text-stone-200 text-center max-w-xl font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {welcome}
        </motion.p>
        <motion.a
          href="#features"
          className="mt-8 px-7 py-3 rounded-full bg-white/40 dark:bg-stone-900/50 border border-white/30 dark:border-stone-800 shadow-lg text-blue-900 dark:text-white font-bold text-lg flex items-center gap-2 backdrop-blur-md hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform relative overflow-hidden"
          whileHover={{ scale: 1.08, boxShadow: '0 0 32px 0 #a5b4fc88' }}
          whileTap={{ scale: 0.97 }}
          animate={show ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.2, type: 'spring' }}
        >
          <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
          Découvrir
        </motion.a>
      </div>
    </section>
  );
};
