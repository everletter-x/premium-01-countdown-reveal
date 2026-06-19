import React from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
  fullScreen?: boolean;
  decorative?: boolean;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Section({
  title,
  subtitle,
  children,
  className = '',
  id,
  fullScreen = false,
  decorative = true,
}: SectionProps) {
  return (
    <motion.section
      id={id}
      className={`relative ${fullScreen ? 'min-h-screen' : 'py-24'} px-6 ${className}`}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
    >
      {/* Decorative ambient glow */}
      {decorative && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full opacity-20 blur-[120px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(var(--glow-color), 0.25), transparent)' }}
        />
      )}

      <div className="relative z-10 max-w-3xl mx-auto">
        {title && (
          <motion.h2
            className="text-2xl md:text-4xl font-serif text-white text-center mb-4 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {title}
          </motion.h2>
        )}
        {subtitle && (
          <motion.p
            className="text-sm md:text-base text-white/50 text-center mb-12 tracking-widest uppercase font-sans"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
        )}
        {children}
      </div>
    </motion.section>
  );
}

export default Section;
