import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export const FinalSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section
      id="final"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#080808]"
    >
      {/* Background: 9.jpg cinematic finish */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="media/9.jpg"
          alt="Zainab and Hasan Grand Finale"
          className="w-full h-full object-cover grayscale contrast-120 brightness-70 animate-cinematic-zoom"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-[#080808]/80" />
        <div className="absolute inset-0 film-grain pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-28 text-center flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Couple Title */}
          <h2 className="font-display-luxury text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight text-[#F4F2ED] uppercase tracking-[0.25em] leading-tight mb-6">
            {t.final.brideAndGroom}
          </h2>

          {/* Date */}
          <p className="font-serif-luxury text-base sm:text-xl tracking-[0.35em] text-white/60 uppercase font-light mb-10">
            {t.final.dateFormatted}
          </p>

          <div className="w-16 h-[1px] bg-white/30 mb-10" />

          {/* SEE YOU THERE */}
          <p className="font-serif-luxury italic text-2xl sm:text-4xl text-[#F4F2ED] tracking-[0.2em] uppercase font-light">
            {t.final.seeYouThere}
          </p>

          <span className="text-[10px] tracking-[0.4em] uppercase text-white/30 font-sans-luxury mt-16">
            DUBAI · JANUARY 2027
          </span>
        </motion.div>
      </div>
    </section>
  );
};