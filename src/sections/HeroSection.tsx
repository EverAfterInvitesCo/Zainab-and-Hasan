import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export const HeroSection: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#080808]"
    >
      {/* Background Image: 9.jpg with high-contrast grayscale, slow zoom & dark overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          id="zh-hero-background-image"
          src="media/9.jpg"
          alt="Zainab and Hasan Editorial Portrait"
          className="w-full h-full object-cover grayscale contrast-110 brightness-85 animate-cinematic-zoom transform-gpu will-change-transform"
          loading="eager"
        />
        {/* Cinematic Vignette and Dark Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/75 via-[#080808]/30 to-[#080808]/95" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#080808]/20 to-[#080808]/80 pointer-events-none" />
        <div className="absolute inset-0 film-grain pointer-events-none" />
      </div>

      {/* Floating Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-28 text-center flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Couple Names in Grand Typography */}
          <h1
            id="zh-hero-couple-names"
            className={`font-light text-[#F4F2ED] leading-tight ${
              language === 'ar'
                ? 'font-arabic-calligraphy text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-normal my-2'
                : 'font-display-luxury text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.2em] md:tracking-[0.25em] uppercase font-extralight'
            }`}
          >
            <span className="block">{t.hero.bride}</span>
            <span
              className={`block my-2 md:my-3 ${
                language === 'ar'
                  ? 'font-arabic-calligraphy text-4xl sm:text-6xl md:text-7xl text-white/50'
                  : 'font-serif-luxury italic text-3xl sm:text-5xl md:text-6xl text-white/40'
              }`}
            >
              {t.hero.and}
            </span>
            <span className="block">{t.hero.groom}</span>
          </h1>
        </motion.div>
      </div>
    </section>
  );
};