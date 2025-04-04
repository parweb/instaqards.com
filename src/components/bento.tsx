import React, { ReactElement, JSXElementConstructor } from 'react';
import { motion } from 'framer-motion';
import { cn } from 'lib/utils';

const getRandomDelay = () => Math.random() * 0.4 + 0.1;
const getRandomDuration = () => Math.random() * 0.25 + 0.75;
const getRandomYOffset = () => Math.random() * 20 + 80;

type BentoProps = {
  children: React.ReactNode;
};

const Bento = ({ children }: BentoProps) => {
  const elements = React.Children.toArray(children)
    .filter(React.isValidElement)
    .map((child, index) => {
      const element = child as ReactElement<
        { className?: string },
        string | JSXElementConstructor<unknown>
      >;

      return React.cloneElement(element, {
        key: index,
        className: cn(element.props.className || '', 'absolute inset-0')
      });
    });

  const baseVariants = {
    hidden: { opacity: 0 },
    visible: { x: 0, y: 0, opacity: 1 }
  };

  return (
    <div className="grid grid-cols-2 grid-rows-3 gap-4 w-full mx-auto rounded-lg aspect-[2/3]">
      <motion.div
        className="relative flex justify-center items-center row-span-2"
        variants={baseVariants}
        initial={{
          ...baseVariants.hidden,
          x: '-100vw',
          y: `-${getRandomYOffset()}vh`
        }}
        animate="visible"
        transition={{
          type: 'tween',
          ease: 'easeOut',
          duration: getRandomDuration(),
          delay: getRandomDelay()
        }}
      >
        {elements[0]}
      </motion.div>

      <motion.div
        className="relative flex justify-center items-center"
        variants={baseVariants}
        initial={{
          ...baseVariants.hidden,
          x: '100vw',
          y: `-${getRandomYOffset()}vh`
        }}
        animate="visible"
        transition={{
          type: 'tween',
          ease: 'easeOut',
          duration: getRandomDuration(),
          delay: getRandomDelay()
        }}
      >
        {elements[1]}
      </motion.div>

      <motion.div
        className="relative flex justify-center items-center"
        variants={baseVariants}
        initial={{
          ...baseVariants.hidden,
          x: '100vw',
          y: `-${getRandomYOffset()}vh`
        }}
        animate="visible"
        transition={{
          type: 'tween',
          ease: 'easeOut',
          duration: getRandomDuration(),
          delay: getRandomDelay()
        }}
      >
        {elements[2]}
      </motion.div>

      <motion.div
        className="relative flex justify-center items-center col-span-2"
        variants={baseVariants}
        initial={{
          ...baseVariants.hidden,
          x: '-100vw',
          y: `-${getRandomYOffset()}vh`
        }}
        animate="visible"
        transition={{
          type: 'tween',
          ease: 'easeOut',
          duration: getRandomDuration(),
          delay: getRandomDelay()
        }}
      >
        {elements[3]}
      </motion.div>
    </div>
  );
};

export default Bento;
