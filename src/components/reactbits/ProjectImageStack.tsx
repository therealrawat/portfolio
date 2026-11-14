import { useState, useRef, type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface ProjectImageStackProps {
  images: [string, string, string]; // [backLeft, frontCenter, backRight]
  title: string;
}

export default function ProjectImageStack({ images, title }: ProjectImageStackProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Subtle 3D tilt tracking cursor
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 240,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 240,
    damping: 24,
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const springConfig = {
    type: 'spring' as const,
    stiffness: 260,
    damping: 22,
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-52 sm:h-60 rounded-xl bg-[#09090e] border border-white/[0.08] flex items-center justify-center overflow-hidden p-3 select-none perspective-[1000px]"
      style={{
        background: 'radial-gradient(ellipse at 50% 25%, rgba(255,255,255,0.03) 0%, rgba(5,5,8,0.95) 100%)',
      }}
    >
      {/* Subtle Electric Violet Ambient Glow */}
      <div
        className={`pointer-events-none absolute inset-0 bg-violet-600/[0.07] blur-2xl transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full"
      >
        {/* 1. Back-Left Card (Side-by-side upper left) */}
        <motion.div
          animate={{
            x: isHovered ? -8 : 0,
            y: isHovered ? -5 : 0,
            scale: isHovered ? 1.01 : 0.98,
            opacity: isHovered ? 0.95 : 0.75,
          }}
          transition={springConfig}
          className="absolute top-2 left-2 sm:left-3 w-[50%] h-[72%] rounded-lg overflow-hidden border border-white/10 bg-[#121218] shadow-xl shadow-black/70 z-10"
        >
          <img
            src={images[0]}
            alt={`${title} preview left`}
            className="w-full h-full object-cover filter brightness-85 transition-all duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        </motion.div>

        {/* 2. Back-Right Card (Side-by-side upper right) */}
        <motion.div
          animate={{
            x: isHovered ? 8 : 0,
            y: isHovered ? -5 : 0,
            scale: isHovered ? 1.01 : 0.98,
            opacity: isHovered ? 0.95 : 0.75,
          }}
          transition={springConfig}
          className="absolute top-2 right-2 sm:right-3 w-[50%] h-[72%] rounded-lg overflow-hidden border border-white/10 bg-[#121218] shadow-xl shadow-black/70 z-10"
        >
          <img
            src={images[2]}
            alt={`${title} preview right`}
            className="w-full h-full object-cover filter brightness-85 transition-all duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        </motion.div>

        {/* 3. Center-Foreground Card (Lower-middle overlapping both background cards) */}
        <motion.div
          animate={{
            y: isHovered ? -10 : 0,
            scale: isHovered ? 1.03 : 1,
          }}
          transition={springConfig}
          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[66%] sm:w-[62%] h-[78%] rounded-xl overflow-hidden border border-white/20 group-hover:border-violet-400/50 bg-[#161620] shadow-2xl shadow-black/95 z-20 transition-colors duration-300"
        >
          <img
            src={images[1]}
            alt={`${title} primary preview`}
            className="w-full h-full object-cover filter brightness-100 transition-all duration-300"
            loading="lazy"
          />
          {/* Subtle glossy glass reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        </motion.div>
      </motion.div>
    </div>
  );
}
