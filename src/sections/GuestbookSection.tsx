import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Send, CheckCircle2, MessageSquare, Upload, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { GuestbookRecord } from '../types';

export const GuestbookSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [entries, setEntries] = useState<GuestbookRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Form State
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedNotice, setSubmittedNotice] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchApprovedEntries = async () => {
    try {
      const res = await fetch('/api/guestbook');
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (err) {
      console.error('Error fetching guestbook:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedEntries();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage(language === 'ar' ? 'حجم الصورة كبير جداً (الحد الأقصى ٨ ميغابايت)' : 'Image is too large (max 8MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result as string);
      setErrorMessage('');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage(language === 'ar' ? 'حجم الصورة كبير جداً' : 'Image is too large');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result as string);
      setErrorMessage('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setErrorMessage(language === 'ar' ? 'يرجى كتابة الاسم والرسالة' : 'Please provide both your name and message.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      let finalPhotoUrl = '';
      if (photoPreview) {
        // Upload photo to server endpoint
        const uploadRes = await fetch('/api/guestbook/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: photoPreview }),
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          finalPhotoUrl = uploadData.url;
        } else {
          finalPhotoUrl = photoPreview; // Fallback
        }
      }

      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          message: message.trim(),
          photoUrl: finalPhotoUrl,
        }),
      });

      if (res.ok) {
        setSubmittedNotice(true);
        setName('');
        setMessage('');
        setPhotoPreview('');
        fetchApprovedEntries();
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.error || 'Failed to submit message.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage('Network error, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="guestbook"
      className="relative w-full py-28 md:py-40 bg-[#0E0E0E] text-[#F4F2ED] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <span className="text-[11px] md:text-xs tracking-[0.45em] uppercase text-white/50 font-sans-luxury block mb-3">
            {t.guestbook.heading}
          </span>
          <h2 className="font-display-luxury text-3xl sm:text-4xl md:text-5xl font-light text-[#F4F2ED] uppercase tracking-[0.18em]">
            {language === 'ar' ? 'كلمات وذكريات' : 'WISHES & MEMORIES'}
          </h2>
          <p className="font-serif-luxury italic text-lg sm:text-xl text-white/60 mt-3 max-w-xl mx-auto font-light">
            {t.guestbook.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT: Submission Form */}
          <div className="lg:col-span-5 bg-black/60 border border-white/15 p-6 sm:p-8 md:p-10 rounded-xl backdrop-blur-md">
            <h3 className="font-serif-luxury text-xl sm:text-2xl tracking-[0.2em] text-[#F4F2ED] uppercase font-light mb-6 pb-3 border-b border-white/10">
              {t.guestbook.formTitle}
            </h3>

            {submittedNotice ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <CheckCircle2 size={42} className="text-white/80 mx-auto mb-4" />
                <h4 className="font-serif-luxury text-xl uppercase tracking-widest text-white mb-2">
                  {language === 'ar' ? 'تم الاستلام بنجاح' : 'NOTE SUBMITTED'}
                </h4>
                <p className="font-sans-luxury text-xs text-white/70 leading-relaxed max-w-xs mx-auto mb-6">
                  {t.guestbook.successNotice}
                </p>
                <button
                  onClick={() => setSubmittedNotice(false)}
                  className="px-6 py-2.5 border border-white/30 hover:border-white text-xs font-sans-luxury tracking-widest uppercase transition-colors"
                >
                  {language === 'ar' ? 'كتابة رسالة أخرى' : 'WRITE ANOTHER NOTE'}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {errorMessage && (
                  <div className="p-3 bg-red-950/50 border border-red-500/30 text-red-200 text-xs font-sans-luxury rounded">
                    {errorMessage}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-[11px] font-sans-luxury tracking-[0.2em] text-white/60 uppercase mb-2">
                    {t.guestbook.nameLabel} <span className="text-white">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.guestbook.namePlaceholder}
                    className="w-full bg-white/[0.04] border border-white/20 focus:border-white text-[#F4F2ED] px-4 py-3 text-sm font-sans-luxury focus:outline-none transition-colors rounded-none placeholder:text-white/25"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[11px] font-sans-luxury tracking-[0.2em] text-white/60 uppercase mb-2">
                    {t.guestbook.messageLabel} <span className="text-white">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.guestbook.messagePlaceholder}
                    className="w-full bg-white/[0.04] border border-white/20 focus:border-white text-[#F4F2ED] px-4 py-3 text-sm font-sans-luxury focus:outline-none transition-colors rounded-none placeholder:text-white/25 resize-none"
                  />
                </div>

                {/* Optional Photo Attachment */}
                <div>
                  <label className="block text-[11px] font-sans-luxury tracking-[0.2em] text-white/60 uppercase mb-2">
                    {t.guestbook.photoLabel}
                  </label>

                  {photoPreview ? (
                    <div className="relative aspect-video rounded overflow-hidden border border-white/20 group">
                      <img
                        src={photoPreview}
                        alt="Upload preview"
                        className="w-full h-full object-cover grayscale"
                      />
                      <button
                        type="button"
                        onClick={() => setPhotoPreview('')}
                        className="absolute top-2 right-2 p-1.5 bg-black/80 rounded-full text-white hover:bg-black transition-colors"
                        aria-label="Remove image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="border border-dashed border-white/20 hover:border-white/50 p-6 text-center cursor-pointer transition-colors bg-white/[0.02]"
                    >
                      <Upload size={18} className="mx-auto text-white/50 mb-2" />
                      <p className="text-xs font-sans-luxury text-white/60 tracking-wider">
                        {t.guestbook.photoDropText}
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#F4F2ED] text-[#080808] hover:bg-white text-xs font-sans-luxury tracking-[0.3em] uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  <Send size={14} />
                  <span>{isSubmitting ? t.guestbook.submittingButton : t.guestbook.submitButton}</span>
                </button>
              </form>
            )}
          </div>

          {/* RIGHT: Published Photobook Feed */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-sans-luxury tracking-[0.25em] text-white/60 uppercase flex items-center gap-2">
                <MessageSquare size={14} />
                {t.guestbook.approvedTag}
              </span>
              <span className="text-xs font-sans-luxury tracking-widest text-white/40">
                {entries.length} {language === 'ar' ? 'مشاركات' : 'Notes'}
              </span>
            </div>

            {loading ? (
              <div className="py-16 text-center text-white/40 font-sans-luxury text-xs tracking-widest">
                LOADING ARCHIVE...
              </div>
            ) : entries.length === 0 ? (
              <div className="py-16 text-center text-white/40 font-sans-luxury text-xs tracking-widest border border-white/5 p-8">
                {t.guestbook.emptyMessage}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[680px] overflow-y-auto pr-1 no-scrollbar">
                {entries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#141414] border border-white/10 p-6 rounded-lg flex flex-col justify-between hover:border-white/30 transition-all duration-300"
                  >
                    <div>
                      {entry.photoUrl && (
                        <div className="aspect-[4/3] rounded overflow-hidden mb-4 bg-black">
                          <img
                            src={entry.photoUrl}
                            alt={entry.name}
                            className="w-full h-full object-cover grayscale contrast-110"
                          />
                        </div>
                      )}
                      <p className="font-serif-luxury text-sm sm:text-base text-white/90 leading-relaxed italic mb-4 font-light">
                        "{entry.message}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="font-sans-luxury text-xs tracking-[0.15em] text-white font-medium uppercase">
                        {entry.name}
                      </span>
                      <span className="font-sans-luxury text-[10px] tracking-wider text-white/40">
                        {new Date(entry.createdAt).toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
