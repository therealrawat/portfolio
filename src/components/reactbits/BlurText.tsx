import { motion, type Variants } from 'framer-motion';

interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  className?: string;
}

export default function BlurText({
  text,
  delay = 100,
  animateBy = 'words',
  direction = 'top',
  className = '',
}: BlurTextProps) {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay / 1000,
      },
    },
  };

  const yOffset = direction === 'top' ? -20 : 20;

  const child: Variants = {
    hidden: {
      opacity: 0,
      filter: 'blur(10px)',
      y: yOffset,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.25, 0, 1],
      },
    },
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={`inline-flex flex-wrap gap-x-[0.28em] ${className}`}
    >
      {elements.map((element, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block will-change-[transform,filter,opacity]"
        >
          {element === ' ' ? '\u00A0' : element}
        </motion.span>
      ))}
    </motion.span>
  );
}

