import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useMusic } from '../context/MusicContext';

interface EntryScreenProps {
  onEnter: () => void;
  isEntered: boolean;
}

export const EntryScreen: React.FC<EntryScreenProps> = ({ onEnter, isEntered }) => {
  const { t, language } = useLanguage();
  const { startMusic } = useMusic();
  const [isEntering, setIsEntering] = useState(false);

  const handleEnterClick = async () => {
    setIsEntering(true);
    await startMusic();
    setTimeout(() => {
      onEnter();
    }, 600);
  };

  return (
    <AnimatePresence>
      {!isEntered && (
        <motion.div
          id="zh-entry-curtain"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-50 bg-[#080808] flex flex-col items-center justify-center p-6 select-none cursor-default"
        >
          {/* Cinematic Photograph Background */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="media/5.jpg"
              alt="Zainab and Hasan"
              className="w-full h-full object-cover object-center grayscale contrast-110 brightness-[0.45] scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/90 via-[#080808]/60 to-[#080808]/75" />
          </div>

          {/* Subtle noise grain */}
          <div className="absolute inset-0 film-grain pointer-events-none z-10" />

          {/* Minimalist Editorial Monogram Layout */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="flex flex-col items-center text-center max-w-md w-full relative z-10"
          >
            {/* Editorial Bride & Groom Typography */}
            <div className="flex flex-col items-center mb-10">
              <h1
                className={`font-light text-[#F4F2ED] ${
                  language === 'ar'
                    ? 'font-arabic-calligraphy text-5xl sm:text-6xl md:text-7xl tracking-normal'
                    : 'font-display-luxury text-4xl sm:text-5xl md:text-6xl tracking-[0.28em] uppercase'
                }`}
              >
                {t.entry.bride}
              </h1>
              
              <span
                className={`my-2 font-light ${
                  language === 'ar'
                    ? 'font-arabic-calligraphy text-3xl sm:text-4xl text-white/60'
                    : 'font-serif-luxury italic text-2xl sm:text-3xl text-white/50'
                }`}
              >
                {t.entry.and}
              </span>
              
              <h1
                className={`font-light text-[#F4F2ED] ${
                  language === 'ar'
                    ? 'font-arabic-calligraphy text-5xl sm:text-6xl md:text-7xl tracking-normal'
                    : 'font-display-luxury text-4xl sm:text-5xl md:text-6xl tracking-[0.28em] uppercase'
                }`}
              >
                {t.entry.groom}
              </h1>
            </div>

            {/* Date Display */}
            <div className="mb-14">
              <p className="font-serif-luxury text-sm sm:text-base tracking-[0.35em] text-white/60 font-light">
                {t.entry.dateFormatted}
              </p>
            </div>

            {/* ENTER Button */}
            <motion.button
              id="zh-enter-invitation-btn"
              onClick={handleEnterClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              disabled={isEntering}
              className="group relative px-10 py-3.5 border border-white/25 hover:border-white text-xs font-sans-luxury tracking-[0.35em] text-[#F4F2ED] uppercase transition-all duration-500 overflow-hidden"
              aria-label="Enter wedding invitation"
            >
              <span className="relative z-10 transition-colors duration-500 group-hover:text-[#080808]">
                {isEntering ? '...' : t.entry.enterButton}
              </span>
              <div className="absolute inset-0 bg-[#F4F2ED] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};