import React from 'react';
import { motion } from 'motion/react';
import { MapPin, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const VenueSection: React.FC = () => {
  const { t, language } = useLanguage();

  const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=Movenpick+Hotel+%26+Apartments+Bur+Dubai+19th+Street+Oud+Metha';

  return (
    <section
      id="venue"
      className="relative w-full py-28 md:py-40 bg-[#F5F3EF] text-[#0A0A0A] overflow-hidden selection:bg-[#0A0A0A] selection:text-[#F5F3EF]"
    >
      {/* Subtle paper texture grain */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="max-w-6xl mx-auto px-6 sm:px-10 md:px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 lg:gap-16 items-center"
        >
          {/* Venue Sketch / Photograph - Naturally placed without box */}
          <div className="lg:col-span-6 w-full flex justify-center items-center">
            <div className="relative w-full max-w-lg lg:max-w-none flex justify-center">
              <img
                src="/media/venue.png"
                alt="Mövenpick Hotel Dubai Venue"
                className="w-full max-h-[440px] object-contain mix-blend-multiply hover:scale-[1.02] transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>
          </div>

          {/* Venue Information - High-Contrast Luxury Typography */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Section Tag */}
            <span className="text-[11px] md:text-xs tracking-[0.45em] uppercase text-[#0A0A0A]/50 font-sans-luxury mb-4 block">
              {t.venue.heading}
            </span>

            {/* Hotel Name */}
            <h2
              className={`font-light text-[#0A0A0A] leading-tight mb-4 ${
                language === 'ar'
                  ? 'font-arabic-calligraphy text-4xl sm:text-5xl md:text-6xl tracking-normal'
                  : 'font-display-luxury text-3xl sm:text-4xl md:text-5xl uppercase tracking-[0.15em]'
              }`}
            >
              {t.venue.name}
            </h2>

            {/* Ballroom / Hall */}
            <p
              className={`font-light mb-6 ${
                language === 'ar'
                  ? 'font-arabic-calligraphy text-2xl sm:text-3xl text-[#0A0A0A]/80'
                  : 'font-serif-luxury italic text-xl sm:text-2xl text-[#0A0A0A]/70'
              }`}
            >
              {t.venue.hall}
            </p>

            {/* Subtle Divider */}
            <div className="w-16 h-[1px] bg-[#0A0A0A]/20 mb-6" />

            {/* Address */}
            <div className="flex flex-col items-center lg:items-start gap-1 text-[#0A0A0A]/80 font-sans-luxury text-sm tracking-[0.2em] uppercase font-light mb-10 leading-relaxed">
              <span>{t.venue.addressLine1}</span>
              <span>{t.venue.addressLine2}</span>
              <span className="text-[#0A0A0A]/50 text-xs mt-0.5">{t.venue.city}</span>
            </div>

            {/* "VIEW LOCATION" Button */}
            <a
              id="zh-venue-maps-link"
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-3.5 border border-[#0A0A0A]/30 hover:border-[#0A0A0A] text-xs font-sans-luxury tracking-[0.3em] text-[#0A0A0A] uppercase transition-all duration-300 hover:bg-[#0A0A0A] hover:text-[#F5F3EF]"
            >
              <MapPin size={14} />
              <span>{t.venue.viewLocation}</span>
              <ExternalLink size={12} className="opacity-70" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};


