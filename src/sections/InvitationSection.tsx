import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export const InvitationSection: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section
      id="invitation"
      className="relative w-full py-36 md:py-48 bg-[#F5F3EF] text-[#0A0A0A] overflow-hidden selection:bg-[#0A0A0A] selection:text-[#F5F3EF]"
    >
      {/* Subtle tactile paper texture grain */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="max-w-4xl mx-auto px-6 sm:px-10 md:px-16 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Poetic Quote Banner */}
          <div className="relative mb-14 md:mb-18">
            <span className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#0A0A0A]/20 select-none block leading-none font-normal mb-2">
              “
            </span>
            <p
              className={`text-[#0A0A0A]/90 font-light tracking-wide sm:tracking-wider leading-relaxed px-4 max-w-2xl ${
                language === 'ar'
                  ? 'font-arabic-calligraphy text-3xl sm:text-4xl md:text-5xl'
                  : 'font-serif-luxury italic text-2xl sm:text-3xl md:text-4xl'
              }`}
            >
              {t.invitation.subtitle}
            </p>
            <div className="w-12 h-[1px] bg-[#0A0A0A]/20 mx-auto mt-6" />
          </div>

          {/* Invitation Statement */}
          <p
            className={`font-light text-[#0A0A0A]/80 leading-relaxed md:leading-[1.7] max-w-2xl mb-12 tracking-wide ${
              language === 'ar'
                ? 'font-arabic-calligraphy text-2xl sm:text-3xl md:text-4xl leading-loose'
                : 'font-serif-luxury text-lg sm:text-xl md:text-2xl'
            }`}
          >
            {t.invitation.body}
          </p>

          {/* Editorial Double Line Divider */}
          <div className="flex items-center justify-center gap-3 w-full max-w-xs mb-12 opacity-30">
            <div className="h-[1px] flex-1 bg-[#0A0A0A]" />
            <div className="w-1.5 h-1.5 rotate-45 border border-[#0A0A0A]" />
            <div className="h-[1px] flex-1 bg-[#0A0A0A]" />
          </div>

          {/* Couple Full Names */}
          <div className="flex flex-col items-center">
            <p
              className={`text-[#0A0A0A] font-light leading-relaxed ${
                language === 'ar'
                  ? 'font-arabic-calligraphy text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide'
                  : 'font-display-luxury text-2xl sm:text-3xl md:text-4xl lg:text-[42px] tracking-[0.16em] sm:tracking-[0.2em] md:tracking-[0.24em] uppercase'
              }`}
            >
              {t.invitation.names}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

