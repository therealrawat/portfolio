import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TrueFocusProps {
  sentence: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  className?: string;
}

export default function TrueFocus({
  sentence = 'Engineering Intentional Products',
  manualMode = false,
  blurAmount = 4,
  borderColor = '#8B5CF6',
  glowColor = 'rgba(139, 92, 246, 0.5)',
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  className = '',
}: TrueFocusProps) {
  const words = sentence.split(' ');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (!manualMode) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
      }, (animationDuration + pauseBetweenAnimations) * 1000);

      return () => clearInterval(interval);
    }
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    if (currentIndex === null || currentIndex === -1) return;
    if (!wordRefs.current[currentIndex] || !containerRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = wordRefs.current[currentIndex]!.getBoundingClientRect();

    setFocusRect({
      x: activeRect.left - parentRect.left - 6,
      y: activeRect.top - parentRect.top - 4,
      width: activeRect.width + 12,
      height: activeRect.height + 8,
    });
  }, [currentIndex, words.length]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex flex-wrap items-center gap-x-3 gap-y-2 select-none ${className}`}
    >
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span
            key={index}
            ref={(el) => { wordRefs.current[index] = el; }}
            onMouseEnter={() => {
              if (manualMode) {
                setLastActiveIndex(currentIndex);
                setCurrentIndex(index);
              }
            }}
            onMouseLeave={() => {
              if (manualMode && lastActiveIndex !== null) {
                setCurrentIndex(lastActiveIndex);
              }
            }}
            className={`relative cursor-pointer transition-all duration-300 font-bold ${
              isActive
                ? 'text-white'
                : 'text-neutral-500'
            }`}
            style={{
              filter: isActive ? 'none' : `blur(${blurAmount}px)`,
            }}
          >
            {word}
          </span>
        );
      })}

      {/* Glowing Animated Focus Frame with Corner Accents */}
      <motion.div
        className="pointer-events-none absolute rounded-md"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: focusRect.width > 0 ? 1 : 0,
        }}
        transition={{
          duration: animationDuration,
          ease: [0.25, 1, 0.5, 1],
        }}
        style={{
          boxShadow: `0 0 16px ${glowColor}`,
        }}
      >
        {/* Top Left Corner */}
        <span
          className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2"
          style={{ borderColor }}
        />
        {/* Top Right Corner */}
        <span
          className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2"
          style={{ borderColor }}
        />
        {/* Bottom Left Corner */}
        <span
          className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2"
          style={{ borderColor }}
        />
        {/* Bottom Right Corner */}
        <span
          className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2"
          style={{ borderColor }}
        />
      </motion.div>
    </div>
  );
}

