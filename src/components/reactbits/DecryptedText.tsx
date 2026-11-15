import { useEffect, useState, useRef } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  characters?: string;
  animateOn?: 'view' | 'hover';
  revealDirection?: 'start' | 'end' | 'center';
  className?: string;
  encryptedClassName?: string;
}

export default function DecryptedText({
  text,
  speed = 40,
  maxIterations = 8,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+',
  animateOn = 'view',
  revealDirection = 'start',
  className = '',
  encryptedClassName = 'text-white/60',
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let currentIteration = 0;

    const startDecryption = () => {
      currentIteration = 0;
      const textLen = text.length;

      interval = setInterval(() => {
        setDisplayText(() => {
          return text
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' ';

              let shouldReveal = false;
              if (revealDirection === 'start') {
                shouldReveal = index < (currentIteration / maxIterations) * textLen;
              } else if (revealDirection === 'end') {
                shouldReveal = index >= textLen - (currentIteration / maxIterations) * textLen;
              } else {
                const mid = textLen / 2;
                const progress = (currentIteration / maxIterations) * mid;
                shouldReveal = Math.abs(index - mid) <= progress;
              }

              if (shouldReveal) {
                return char;
              }
              return characters[Math.floor(Math.random() * characters.length)];
            })
            .join('');
        });

        currentIteration++;
        if (currentIteration > maxIterations) {
          clearInterval(interval);
          setDisplayText(text);
          setHasAnimated(true);
        }
      }, speed);
    };

    if (animateOn === 'view') {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !hasAnimated) {
            startDecryption();
          }
        },
        { threshold: 0.1 }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => {
        clearInterval(interval);
        observer.disconnect();
      };
    } else if (animateOn === 'hover' && isHovered) {
      startDecryption();
      return () => clearInterval(interval);
    }
  }, [text, speed, maxIterations, characters, animateOn, revealDirection, isHovered, hasAnimated]);

  return (
    <span
      ref={containerRef}
      onMouseEnter={() => animateOn === 'hover' && setIsHovered(true)}
      onMouseLeave={() => animateOn === 'hover' && setIsHovered(false)}
      className={`inline-block font-mono ${className}`}
    >
      {displayText.split('').map((char, i) => {
        const isOriginal = char === text[i];
        return (
          <span
            key={i}
            className={!isOriginal ? encryptedClassName : undefined}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}

