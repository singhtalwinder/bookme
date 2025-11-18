'use client';

import * as React from 'react';
import {
  motion,
  type SpringOptions,
  useMotionValue,
  useSpring,
} from 'motion/react';

import { cn } from '@/lib/utils';

type BubbleBackgroundProps = Omit<React.ComponentProps<'div'>, 'ref'> & {
  interactive?: boolean;
  transition?: SpringOptions;
  colors?: {
    first: string;
    second: string;
    third: string;
    fourth: string;
    fifth: string;
    sixth: string;
  };
};

const BubbleBackground = React.forwardRef<HTMLDivElement, BubbleBackgroundProps>(
  (
    {
      className,
      children,
      interactive = false,
      transition = { stiffness: 100, damping: 20 },
      colors = {
        first: '252,183,175',   // Primary marshmallow pink (from oklch(0.80 0.14 348.82))
        second: '217,163,214',  // Secondary marshmallow purple (from oklch(0.77 0.15 306.21))
        third: '188,208,233',   // Accent marshmallow blue (from oklch(0.83 0.09 247.96))
        fourth: '255,218,224',  // Pale pink variation
        fifth: '235,235,250',   // Lavender muted grey
        sixth: '240,240,245',   // Very light grey
      },
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    
    React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, transition);
    const springY = useSpring(mouseY, transition);

    React.useEffect(() => {
      if (!interactive) return;

      const currentContainer = containerRef.current;
      if (!currentContainer) return;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = currentContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
      };

      currentContainer?.addEventListener('mousemove', handleMouseMove);
      return () =>
        currentContainer?.removeEventListener('mousemove', handleMouseMove);
    }, [interactive, mouseX, mouseY]);

    return (
    <div
      ref={containerRef}
      data-slot="bubble-background"
      className={cn(
        'relative w-full h-full overflow-hidden bg-gray-50 dark:bg-gray-950',
        className,
      )}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 left-0 w-0 h-0"
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div
        className="absolute inset-0"
        style={{ filter: 'url(#goo) blur(40px)' }}
      >
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '80%',
            height: '80%',
            top: '10%',
            left: '10%',
            mixBlendMode: 'hard-light',
            background: `radial-gradient(circle at center, rgba(${colors.first}, 0.8) 0%, rgba(${colors.first}, 0) 50%)`,
          }}
          animate={{ y: [-50, 50, -50] }}
          transition={{ duration: 30, ease: 'easeInOut', repeat: Infinity }}
        />

        <motion.div
          className="absolute inset-0 flex justify-center items-center"
          style={{
            transformOrigin: 'calc(50% - 400px)',
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop',
          }}
        >
          <div 
            className="rounded-full"
            style={{
              width: '80%',
              height: '80%',
              top: '10%',
              left: '10%',
              mixBlendMode: 'hard-light',
              background: `radial-gradient(circle at center, rgba(${colors.second}, 0.8) 0%, rgba(${colors.second}, 0) 50%)`,
            }}
          />
        </motion.div>

        <motion.div
          className="absolute inset-0 flex justify-center items-center"
          style={{
            transformOrigin: 'calc(50% + 400px)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
        >
          <div 
            className="absolute rounded-full"
            style={{
              width: '80%',
              height: '80%',
              top: 'calc(50% + 200px)',
              left: 'calc(50% - 500px)',
              mixBlendMode: 'hard-light',
              background: `radial-gradient(circle at center, rgba(${colors.third}, 0.8) 0%, rgba(${colors.third}, 0) 50%)`,
            }}
          />
        </motion.div>

        <motion.div
          className="absolute rounded-full opacity-70"
          style={{
            width: '80%',
            height: '80%',
            top: '10%',
            left: '10%',
            mixBlendMode: 'hard-light',
            background: `radial-gradient(circle at center, rgba(${colors.fourth}, 0.8) 0%, rgba(${colors.fourth}, 0) 50%)`,
          }}
          animate={{ x: [-50, 50, -50] }}
          transition={{ duration: 40, ease: 'easeInOut', repeat: Infinity }}
        />

        <motion.div
          className="absolute inset-0 flex justify-center items-center"
          style={{
            transformOrigin: 'calc(50% - 800px) calc(50% + 200px)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
        >
          <div 
            className="absolute rounded-full"
            style={{
              width: '160%',
              height: '160%',
              top: 'calc(50% - 80%)',
              left: 'calc(50% - 80%)',
              mixBlendMode: 'hard-light',
              background: `radial-gradient(circle at center, rgba(${colors.fifth}, 0.8) 0%, rgba(${colors.fifth}, 0) 50%)`,
            }}
          />
        </motion.div>

        {interactive && (
          <motion.div
            className="absolute rounded-full opacity-70"
            style={{
              width: '100%',
              height: '100%',
              mixBlendMode: 'hard-light',
              background: `radial-gradient(circle at center, rgba(${colors.sixth}, 0.8) 0%, rgba(${colors.sixth}, 0) 50%)`,
              x: springX,
              y: springY,
            }}
          />
        )}
      </div>

      {children}
    </div>
  );
});

BubbleBackground.displayName = 'BubbleBackground';

export { BubbleBackground, type BubbleBackgroundProps };