import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PolaroidPhoto } from '../types';

// Strictly use 1-8 and 10 (NEVER 9.jpg)
const galleryPhotos: PolaroidPhoto[] = [
  {
    id: '1',
    src: '/media/1.jpg',
    titleEn: 'THE PROMISE',
    titleAr: 'الوعد الأبدي',
    captionEn: 'Vol. 01 — Dubai',
    captionAr: 'المجلد ١ — دبي',
    rotation: -2.2,
    offsetY: 4,
  },
  {
    id: '2',
    src: '/media/2.jpg',
    titleEn: 'EMBRACE',
    titleAr: 'لحظة هدوء',
    captionEn: 'Vol. 02 — A Quiet Moment',
    captionAr: 'المجلد ٢ — دفء اللقاء',
    rotation: 1.8,
    offsetY: -6,
  },
  {
    id: '3',
    src: '/media/3.jpg',
    titleEn: 'DEVOTION',
    titleAr: 'وفاء',
    captionEn: 'Vol. 03 — Hand in Hand',
    captionAr: 'المجلد ٣ — يداً بيد',
    rotation: -1.2,
    offsetY: 8,
  },
  {
    id: '4',
    src: '/media/4.jpg',
    titleEn: 'ELEGANCE',
    titleAr: 'أناقة وسحر',
    captionEn: 'Vol. 04 — Couture Nocturne',
    captionAr: 'المجلد ٤ — سحر الليل',
    rotation: 2.5,
    offsetY: -4,
  },
  {
    id: '5',
    src: '/media/5.jpg',
    titleEn: 'WHISPER',
    titleAr: 'همس الضياء',
    captionEn: 'Vol. 05 — Shadow & Light',
    captionAr: 'المجلد ٥ — ظلال وأضواء',
    rotation: -1.8,
    offsetY: 6,
  },
  {
    id: '6',
    src: '/media/6.jpg',
    titleEn: 'SERENITY',
    titleAr: 'سكينة',
    captionEn: 'Vol. 06 — Walking Forward',
    captionAr: 'المجلد ٦ — نحو المستقبل',
    rotation: 1.4,
    offsetY: -8,
  },
  {
    id: '7',
    src: '/media/7.jpg',
    titleEn: 'PORTRAIT',
    titleAr: 'بورتريه كلاسيكي',
    captionEn: 'Vol. 07 — The Union',
    captionAr: 'المجلد ٧ — لقاء القلوب',
    rotation: -2.6,
    offsetY: 5,
  },
  {
    id: '8',
    src: '/media/8.jpg',
    titleEn: 'JOURNEY',
    titleAr: 'رحلة العمر',
    captionEn: 'Vol. 08 — Forever Begins',
    captionAr: 'المجلد ٨ — بداية الأبدية',
    rotation: 2.0,
    offsetY: -5,
  },
  {
    id: '10',
    src: '/media/10.jpg',
    titleEn: 'CELEBRATION',
    titleAr: 'ليلة العمر',
    captionEn: 'Vol. 10 — Our Wedding Night',
    captionAr: 'المجلد ١٠ — ليلة الزفاف',
    rotation: -1.5,
    offsetY: 4,
  },
];

export const PolaroidMemoriesSection: React.FC = () => {
  const { t, language, isRtl } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activePhoto, setActivePhoto] = useState<PolaroidPhoto | null>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: isRtl ? 380 : -380, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: isRtl ? -380 : 380, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="memories"
      className="relative w-full py-28 md:py-40 bg-[#080808] text-[#F4F2ED] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <span className="text-[11px] md:text-xs tracking-[0.45em] uppercase text-white/50 font-sans-luxury block mb-3">
              {language === 'ar' ? 'الذكريات' : 'MEMORIES'}
            </span>
            <h2 className="font-display-luxury text-3xl sm:text-4xl md:text-5xl font-light text-[#F4F2ED] uppercase tracking-[0.18em]">
              {language === 'ar' ? 'ذكرياتنا' : 'OUR MEMORIES'}
            </h2>
          </div>

          {/* Desktop scroll navigation controls */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-sans-luxury tracking-[0.2em] text-white/40 uppercase hidden sm:inline">
              {t.memories.scrollInstruction}
            </span>
            <div className="flex items-center gap-2">
              <button
                id="zh-polaroid-scroll-left"
                onClick={scrollLeft}
                className="w-10 h-10 rounded-full border border-white/20 hover:border-white text-white/70 hover:text-white flex items-center justify-center transition-colors focus:outline-none"
                aria-label="Scroll gallery left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                id="zh-polaroid-scroll-right"
                onClick={scrollRight}
                className="w-10 h-10 rounded-full border border-white/20 hover:border-white text-white/70 hover:text-white flex items-center justify-center transition-colors focus:outline-none"
                aria-label="Scroll gallery right"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HORIZONTAL SCROLL RUNWAY - MANDATORY HORIZONTAL ON ALL DEVICES */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto no-scrollbar py-8 px-6 md:px-12 cursor-grab active:cursor-grabbing scroll-smooth"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex items-center gap-8 md:gap-12 min-w-max pb-6">
          {galleryPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.08 }}
              whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.3 } }}
              onClick={() => setActivePhoto(photo)}
              style={{
                transform: `rotate(${photo.rotation}deg) translateY(${photo.offsetY}px)`,
              }}
              className="group relative bg-[#F6F5F2] text-[#111111] p-3.5 pb-6 sm:p-4 sm:pb-8 rounded-[3px] shadow-[0_20px_40px_rgba(0,0,0,0.85)] hover:shadow-[0_25px_50px_rgba(255,255,255,0.08)] cursor-pointer transition-shadow duration-300 w-[260px] sm:w-[300px] md:w-[330px] shrink-0 select-none"
            >
              {/* Photo Area without text */}
              <div className="relative aspect-[4/5] bg-[#141414] overflow-hidden rounded-[2px]">
                <img
                  src={photo.src}
                  alt={`Memory ${photo.id}`}
                  className="w-full h-full object-cover grayscale contrast-115 group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                <div className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 size={12} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full-screen Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-6 right-6 p-3 text-white/70 hover:text-white rounded-full bg-white/10 transition-colors"
              aria-label="Close photo preview"
            >
              <X size={24} />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-3xl max-h-[85vh] flex flex-col items-center bg-[#F6F5F2] text-[#111] p-3 sm:p-5 pb-6 sm:pb-8 rounded-[4px] shadow-2xl overflow-hidden"
            >
              <div className="relative w-full max-h-[75vh] overflow-hidden rounded-[2px] bg-black">
                <img
                  src={activePhoto.src}
                  alt={`Memory ${activePhoto.id}`}
                  className="w-full h-full max-h-[75vh] object-contain grayscale contrast-110"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
