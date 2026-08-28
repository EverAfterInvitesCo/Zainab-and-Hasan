import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export const DateCountdownSection: React.FC = () => {
  const { t, language } = useLanguage();

  // Target Date: January 8, 2027 at 18:00:00 (Dubai Time UTC+4)
  const targetDate = new Date('2027-01-08T18:00:00+04:00').getTime();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <section
      id="date"
      className="relative w-full py-28 md:py-40 bg-[#080808] text-[#F4F2ED] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Section Subtitle */}
          <span className="text-[11px] md:text-xs tracking-[0.45em] uppercase text-white/50 font-sans-luxury mb-12">
            {t.countdown.subheading}
          </span>

          {/* Bold Editorial Date Numbers */}
          <div className="flex items-baseline justify-center gap-4 sm:gap-8 md:gap-14 mb-8">
            <div className="flex flex-col items-center">
              <span className="font-display-luxury text-6xl sm:text-8xl md:text-9xl font-extralight tracking-tight text-[#F4F2ED]">
                {t.countdown.day}
              </span>
              <span className="text-[10px] sm:text-xs tracking-[0.3em] text-white/40 uppercase font-sans-luxury mt-2">
                DAY
              </span>
            </div>

            <span className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-extralight text-white/20 pb-4">
              /
            </span>

            <div className="flex flex-col items-center">
              <span className="font-display-luxury text-6xl sm:text-8xl md:text-9xl font-extralight tracking-tight text-[#F4F2ED]">
                {t.countdown.month}
              </span>
              <span className="text-[10px] sm:text-xs tracking-[0.3em] text-white/40 uppercase font-sans-luxury mt-2">
                MONTH
              </span>
            </div>

            <span className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-extralight text-white/20 pb-4">
              /
            </span>

            <div className="flex flex-col items-center">
              <span className="font-display-luxury text-6xl sm:text-8xl md:text-9xl font-extralight tracking-tight text-[#F4F2ED]">
                {t.countdown.year}
              </span>
              <span className="text-[10px] sm:text-xs tracking-[0.3em] text-white/40 uppercase font-sans-luxury mt-2">
                YEAR
              </span>
            </div>
          </div>

          {/* Month & Time */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-8 text-white/80 font-serif-luxury text-xl sm:text-2xl tracking-[0.25em] uppercase font-light mb-16">
            <span>{t.countdown.monthName}</span>
            <span className="hidden sm:inline text-white/30">·</span>
            <span>{t.countdown.time}</span>
          </div>

          {/* Real-time Countdown Timer Grid */}
          <div className="w-full max-w-2xl bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              <div className="flex flex-col items-center">
                <span className="font-display-luxury text-3xl sm:text-5xl font-light text-white tracking-tight">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[9px] sm:text-[11px] tracking-[0.25em] text-white/45 uppercase font-sans-luxury mt-2">
                  {t.countdown.days}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="font-display-luxury text-3xl sm:text-5xl font-light text-white tracking-tight">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] sm:text-[11px] tracking-[0.25em] text-white/45 uppercase font-sans-luxury mt-2">
                  {t.countdown.hours}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="font-display-luxury text-3xl sm:text-5xl font-light text-white tracking-tight">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] sm:text-[11px] tracking-[0.25em] text-white/45 uppercase font-sans-luxury mt-2">
                  {t.countdown.minutes}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="font-display-luxury text-3xl sm:text-5xl font-light text-white tracking-tight">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] sm:text-[11px] tracking-[0.25em] text-white/45 uppercase font-sans-luxury mt-2">
                  {t.countdown.seconds}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
