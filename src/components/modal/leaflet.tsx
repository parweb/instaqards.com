import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { useEffect, useMemo, useRef } from 'react';

import {
  AnimatePresence,
  motion,
  useAnimation,
  useDragControls,
  type PanInfo
} from 'motion/react';

export const Leaflet = ({
  setShow,
  children
}: {
  setShow: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}) => {
  const leafletRef = useRef<HTMLDivElement>(null);

  const controls = useAnimation();
  const dragControls = useDragControls();

  const transitionProps = useMemo(
    () => ({ type: 'spring', stiffness: 500, damping: 30 }),
    []
  );

  useEffect(() => {
    controls.start({
      y: 20,
      transition: transitionProps
    });
  }, [controls, transitionProps]);

  async function handleDragEnd(_: unknown, info: PanInfo) {
    const offset = info.offset.y;
    const velocity = info.velocity.y;
    const height = leafletRef.current?.getBoundingClientRect().height || 0;

    if (offset > height / 2 || velocity > 800) {
      await controls.start({ y: '100%', transition: transitionProps });
      setShow(false);
    } else {
      controls.start({ y: 0, transition: transitionProps });
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key="leaflet-backdrop"
        className="fixed inset-0 bg-gray-100/10 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShow(false)}
      />

      <motion.div
        ref={leafletRef}
        key="leaflet"
        className="fixed inset-x-0 bottom-0 w-screen bg-white pb-5"
        initial={{ y: '100%' }}
        animate={controls}
        exit={{ y: '100%' }}
        transition={transitionProps}
        drag="y"
        dragListener={false}
        dragControls={dragControls}
        dragDirectionLock
        onDragEnd={handleDragEnd}
        dragElastic={{ top: 0, bottom: 1 }}
        dragConstraints={{ top: 0, bottom: 0 }}
      >
        <div
          className="rounded-t-4xl -mb-1 flex h-7 w-full cursor-grab items-center justify-center border-t border-gray-200 active:cursor-grabbing"
          onPointerDown={e => {
            e.preventDefault();
            dragControls.start(e);
          }}
        >
          <div className="-mr-1 h-1 w-6 rounded-full bg-gray-300 transition-all group-active:rotate-12" />
          <div className="h-1 w-6 rounded-full bg-gray-300 transition-all group-active:-rotate-12" />
        </div>

        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default Leaflet;
