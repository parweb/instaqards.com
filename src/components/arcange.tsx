import React, { useEffect, useMemo, useState } from 'react';

import {
  animate,
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform
} from 'framer-motion';

// --- Powder Trail Segment Component ---
interface TrailSegmentProps {
  followX: MotionValue<number>;
  followY: MotionValue<number>;
  index: number;
  totalSegments: number;
  mainOpacity: MotionValue<number>;
  color?: string;
  direction?: { x: number; y: number };
}

const TrailSegment: React.FC<TrailSegmentProps> = ({
  followX,
  followY,
  index,
  totalSegments,
  mainOpacity,
  color = 'bg-yellow-300',
  direction = { x: 0, y: -1 }
}) => {
  // Generate unique properties for each powder particle
  const particleProps = useMemo(() => {
    // Progress factor (0 = first/newest particle, 1 = last/oldest)
    const progressFactor = index / totalSegments;

    // Base offset in the direction of movement
    const trailLength = 25; // Length of the powder trail
    const directionOffset = {
      x: -direction.x * progressFactor * trailLength,
      y: -direction.y * progressFactor * trailLength
    };

    // Add scatter effect perpendicular to movement direction
    const scatterFactor = 3 + progressFactor * 6; // Scatter increases along the trail
    const perpendicularOffset = {
      x: -direction.y * (Math.random() * 2 - 1) * scatterFactor,
      y: direction.x * (Math.random() * 2 - 1) * scatterFactor
    };

    // Random micro-movements for "powder in air" effect
    const microMovement = {
      x: (Math.random() * 2 - 1) * 2,
      y: (Math.random() * 2 - 1) * 2
    };

    // Physics properties that make particles feel like powder
    const springConfig = {
      // More delay for particles further back in trail
      stiffness: 350 - progressFactor * 300,
      damping: 40 - progressFactor * 25,
      mass: 0.3 + progressFactor * 0.7 // Older particles feel heavier
    };

    // Size and visual properties
    const sizeFactor = 0.7 - progressFactor * 0.5; // Particles get smaller along the trail
    const blurFactor = 0.5 + progressFactor * 2; // More blur for older particles

    // Flicker settings to simulate burning powder
    const flickerSpeed = 0.2 + Math.random() * 0.3;
    const flickerDelay = Math.random() * 0.4;

    // Persistence factor - how long particles remain visible
    // Particles further in the trail persist longer
    const persistenceFactor = 0.5 + progressFactor * 0.5;

    return {
      offset: {
        x: directionOffset.x + perpendicularOffset.x + microMovement.x,
        y: directionOffset.y + perpendicularOffset.y + microMovement.y
      },
      spring: springConfig,
      size: Math.max(2, 5 * sizeFactor), // 2-5px particles
      blur: blurFactor,
      flicker: {
        speed: flickerSpeed,
        delay: flickerDelay
      },
      persistence: persistenceFactor
    };
  }, [index, totalSegments, direction]);

  // Apply spring physics with appropriate delay for powder trail effect
  const x = useSpring(followX, particleProps.spring);
  const y = useSpring(followY, particleProps.spring);

  // Apply calculated offsets for trail positioning
  const finalX = useTransform(x, val => val + particleProps.offset.x);
  const finalY = useTransform(y, val => val + particleProps.offset.y);

  // Base opacity that fades based on position in trail but doesn't disappear completely
  // Now mainOpacity=1 doesn't make particles disappear
  const baseOpacity = useTransform(
    mainOpacity,
    [0, 0.1, 0.3, 0.8, 1],
    [
      0,
      Math.max(0, 0.2 - (index / totalSegments) * 0.8), // Initial fade-in is slower
      Math.max(0.1, 0.9 - (index / totalSegments) * 0.8), // Gradual appearance
      Math.max(0.1, 1 - (index / totalSegments) * 0.7), // Stay visible
      0 // Fade out at end (as per user's edit)
    ]
  );

  // Flicker effect for burning powder illusion with more gradual start
  const flickerOpacity = useMotionValue(1);
  useEffect(() => {
    // Add more delay for particles further back in the trail for staggered appearance
    const staggerDelay =
      particleProps.flicker.delay + (index / totalSegments) * 0.3;

    const controls = animate(flickerOpacity, [0.6, 1.2, 0.6], {
      duration: particleProps.flicker.speed,
      repeat: Infinity,
      repeatType: 'mirror',
      ease: 'easeInOut',
      delay: staggerDelay
    });
    return () => controls.stop();
  }, [flickerOpacity, particleProps.flicker, index, totalSegments]);

  // Combine opacity values
  const opacity = useTransform(
    [baseOpacity, flickerOpacity],
    ([base, flicker]: number[]): number => Math.max(0, base * flicker)
  );

  // Scale animation with more gradual appearance
  const scale = useTransform(
    mainOpacity,
    [0, 0.2, 0.4, 0.8, 1],
    [
      0,
      Math.max(0, 0.3 - (index / totalSegments) * 0.3), // Initial appearance is minimal
      Math.max(0.1, Math.random() * 0.4 + 0.4), // Grow gradually
      Math.max(0.1, Math.random() * 0.4 + 0.8), // Peak size
      0 // Disappear at end (consistent with opacity)
    ]
  );

  return (
    <motion.div
      className={`absolute ${color} rounded-full pointer-events-none`}
      style={{
        x: finalX,
        y: finalY,
        opacity,
        scale,
        width: `${particleProps.size}px`,
        height: `${particleProps.size}px`,
        filter: `blur(${particleProps.blur}px)`,
        mixBlendMode: 'screen'
      }}
    />
  );
};

// --- Arc Item Animator Component ---
const TRAIL_LENGTH = 30; // Increased number of particles for a denser powder effect

interface ArcItemAnimatorProps {
  children: React.ReactNode;
  finalX: number;
  finalY: number;
  randomDelay: number;
  initialX: number;
  initialY: number;
  radius: number;
  childSize: number;
}

const ArcItemAnimator: React.FC<ArcItemAnimatorProps> = ({
  children,
  finalX,
  finalY,
  randomDelay,
  initialX,
  initialY,
  radius,
  childSize
}) => {
  // Calculate a start position that's outside the "vieux port" (main arc area)
  // but not too far away
  const startPosition = useMemo(() => {
    // Calculate vector from center to final position
    const centerX = initialX + childSize / 2;
    const centerY = initialY + childSize / 2;

    // Vector from center to final position
    const vectorToFinal = {
      x: finalX + childSize / 2 - centerX,
      y: finalY + childSize / 2 - centerY
    };

    // Calculate distance from center to final position
    const distanceToFinal = Math.sqrt(
      vectorToFinal.x * vectorToFinal.x + vectorToFinal.y * vectorToFinal.y
    );

    // Normalize the vector
    const normalizedVector = {
      x: vectorToFinal.x / distanceToFinal,
      y: vectorToFinal.y / distanceToFinal
    };

    // Reverse direction (to start from outside)
    const reversedVector = {
      x: -normalizedVector.x,
      y: -normalizedVector.y
    };

    // Distance to start from (outside the "port" but not too far)
    // Between 1.2 and 1.5 times the radius
    const startDistance = radius * (1.2 + Math.random() * 0.3);

    // Add some randomness to the direction (± 20 degrees)
    const randomAngle = (Math.random() * 40 - 20) * (Math.PI / 180);
    const rotatedVector = {
      x:
        reversedVector.x * Math.cos(randomAngle) -
        reversedVector.y * Math.sin(randomAngle),
      y:
        reversedVector.x * Math.sin(randomAngle) +
        reversedVector.y * Math.cos(randomAngle)
    };

    // Calculate the starting position (from center)
    const startFromCenter = {
      x: rotatedVector.x * startDistance,
      y: rotatedVector.y * startDistance
    };

    // Convert to absolute position
    return {
      x: centerX + startFromCenter.x - childSize / 2, // Adjust back for childSize
      y: centerY + startFromCenter.y - childSize / 2
    };
  }, [finalX, finalY, initialX, initialY, radius, childSize]);

  const x = useMotionValue(startPosition.x);
  const y = useMotionValue(startPosition.y);
  const opacity = useMotionValue(0);
  const scale = useMotionValue(0.3);

  useEffect(() => {
    // Control sequence for the main item
    const opacityControls = animate(opacity, 1, {
      delay: randomDelay,
      duration: 0.2
    });

    const scaleControls = animate(scale, [0.3, 1.1, 1], {
      times: [0, 0.8, 1],
      delay: randomDelay,
      duration: 0.4
    });

    // Position spring animation
    const xControls = animate(x, finalX, {
      type: 'spring',
      damping: 15,
      stiffness: 120,
      delay: randomDelay
    });

    const yControls = animate(y, finalY, {
      type: 'spring',
      damping: 15,
      stiffness: 120,
      delay: randomDelay,
      // Do not set opacity to 0 at end to keep particles visible
      onComplete: () => {
        // Opacity stays at 1, never transitions back to 0
      }
    });

    return () => {
      opacityControls.stop();
      scaleControls.stop();
      xControls.stop();
      yControls.stop();
    };
  }, [finalX, finalY, randomDelay, x, y, opacity, scale]);

  // Calculate movement direction for the conical effect
  const direction = useMemo(() => {
    const dx = finalX - initialX;
    const dy = finalY - initialY;
    const magnitude = Math.sqrt(dx * dx + dy * dy);

    // Normalize the direction vector
    return {
      x: magnitude ? dx / magnitude : 0,
      y: magnitude ? dy / magnitude : -1 // Default upward if no movement
    };
  }, [finalX, finalY, initialX, initialY]);

  // Generate particles with different colors to simulate realistic powder trail
  return (
    <>
      {/* Main trail - yellow powder particles */}
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
        <TrailSegment
          key={`yellow-${i}`}
          followX={x}
          followY={y}
          index={i}
          totalSegments={TRAIL_LENGTH}
          mainOpacity={opacity}
          color="bg-yellow-300"
          direction={direction}
        />
      ))}

      {/* Orange particles for warmer trail center */}
      {Array.from({ length: Math.floor(TRAIL_LENGTH * 0.6) }).map((_, i) => (
        <TrailSegment
          key={`orange-${i}`}
          followX={x}
          followY={y}
          index={Math.floor(i * 1.5)}
          totalSegments={TRAIL_LENGTH}
          mainOpacity={opacity}
          color="bg-orange-400"
          direction={direction}
        />
      ))}

      {/* Red particles for hot spots */}
      {Array.from({ length: Math.floor(TRAIL_LENGTH * 0.3) }).map((_, i) => (
        <TrailSegment
          key={`red-${i}`}
          followX={x}
          followY={y}
          index={Math.floor(i * 2)}
          totalSegments={TRAIL_LENGTH}
          mainOpacity={opacity}
          color="bg-red-500"
          direction={direction}
        />
      ))}

      {/* White sparks scattered throughout */}
      {Array.from({ length: Math.floor(TRAIL_LENGTH * 0.2) }).map((_, i) => (
        <TrailSegment
          key={`spark-${i}`}
          followX={x}
          followY={y}
          index={Math.floor(i * 1.2)}
          totalSegments={TRAIL_LENGTH}
          mainOpacity={opacity}
          color="bg-white"
          direction={direction}
        />
      ))}

      {/* Actual child item */}
      <motion.div
        style={{
          position: 'absolute',
          x,
          y,
          opacity,
          scale,
          originX: 0.5,
          originY: 0.5,
          zIndex: 1
        }}
      >
        {children}
      </motion.div>
    </>
  );
};

// --- Arc Component (Main) ---
interface ArcProps {
  children: React.ReactNode;
  radius?: number;
  startAngle?: number;
  arcAngle?: number;
  staggerDelay?: number;
  childSize?: number;
}

const Arcange: React.FC<ArcProps> = ({
  children,
  radius = 150,
  startAngle = 180, // 180° starts at bottom (6h), rotation is counterclockwise
  arcAngle = 180, // 180° creates a semicircle above
  staggerDelay = 0.1,
  childSize = 50
}) => {
  const [positions, setPositions] = useState<
    Array<{ x: number; y: number; randomDelay: number }>
  >([]);
  const [bounds, setBounds] = useState<{
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  }>({ minX: 0, maxX: 0, minY: 0, maxY: 0 });

  const validChildren = React.Children.toArray(children).filter(
    React.isValidElement
  );
  const numberOfChildren = validChildren.length;

  useEffect(() => {
    // Skip if no children
    if (numberOfChildren === 0) return;

    const data = [];
    const step = numberOfChildren > 1 ? arcAngle / (numberOfChildren - 1) : 0;
    const maxDelay = numberOfChildren * staggerDelay;

    // Reference center for calculations (not the final container center)
    // Just a reference point for calculating positions
    const refCenterX = 0;
    const refCenterY = 0;

    for (let i = 0; i < numberOfChildren; i++) {
      // Calculate angle for this element - starting from bottom and moving counterclockwise
      const currentAngleDeg =
        numberOfChildren === 1
          ? startAngle + arcAngle / 2 // Center the lone element
          : startAngle + i * step;

      // Convert angle to radians for math functions
      const angleRad = (currentAngleDeg * Math.PI) / 180;

      // Calculate position with the correct orientation
      // In this system, 180° starts at bottom (6h), moving counterclockwise
      const x = refCenterX + Math.cos(angleRad) * radius;
      const y = refCenterY + Math.sin(angleRad) * radius; // Use positive sin for correct orientation

      const randomDelay = Math.random() * maxDelay;

      data.push({ x, y, randomDelay });
    }

    setPositions(data);

    // Calculate bounding box to size container properly
    if (data.length > 0) {
      const halfChildSize = childSize / 2;
      let minX = Infinity,
        maxX = -Infinity,
        minY = Infinity,
        maxY = -Infinity;

      data.forEach(pos => {
        minX = Math.min(minX, pos.x - halfChildSize);
        maxX = Math.max(maxX, pos.x + halfChildSize);
        minY = Math.min(minY, pos.y - halfChildSize);
        maxY = Math.max(maxY, pos.y + halfChildSize);
      });

      setBounds({ minX, maxX, minY, maxY });
    }
  }, [numberOfChildren, radius, startAngle, arcAngle, staggerDelay, childSize]);

  // Calculate container dimensions based on element positions
  // Add exactly the size of children for precise adjustment
  const containerWidth = bounds.maxX - bounds.minX + childSize;
  const containerHeight = bounds.maxY - bounds.minY + childSize;

  // Adjust offsets for precise positioning
  const offsetX = -bounds.minX + childSize / 2;
  const offsetY = -bounds.minY + childSize / 2;

  // Calculated center point for animations to start from
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  return (
    <div
      className="relative mx-auto"
      style={{
        width: `${containerWidth}px`,
        height: `${containerHeight}px`
      }}
    >
      {positions.length > 0 &&
        React.Children.map(validChildren, (child, index) => {
          const pos = positions[index];
          if (!pos) return null;

          // Adjust positions to be relative to container (these are center points)
          const centerTargetX = pos.x + offsetX;
          const centerTargetY = pos.y + offsetY;

          // Calculate top-left corner for absolute positioning to achieve center alignment
          const topLeftTargetX = centerTargetX - childSize / 2;
          const topLeftTargetY = centerTargetY - childSize / 2;

          return (
            <ArcItemAnimator
              key={index}
              finalX={topLeftTargetX} // Pass the calculated top-left X
              finalY={topLeftTargetY} // Pass the calculated top-left Y
              randomDelay={pos.randomDelay}
              initialX={centerX - childSize / 2} // Adjust initial position as well
              initialY={centerY - childSize / 2} // Adjust initial position as well
              radius={radius}
              childSize={childSize}
            >
              {child}
            </ArcItemAnimator>
          );
        })}
    </div>
  );
};

export default Arcange;
