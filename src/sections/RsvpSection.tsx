import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { RSVPRecord } from '../types';

export const RsvpSection: React.FC = () => {
  const { t, language } = useLanguage();

  const [name, setName] = useState<string>('');
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [contact, setContact] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [savedRecord, setSavedRecord] = useState<RSVPRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Check if guest has previously responded on this device
  useEffect(() => {
    const saved = localStorage.getItem('zh_saved_rsvp');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedRecord(parsed);
        setName(parsed.name || '');
        setAttending(parsed.attending || 'yes');
        setGuestCount(parsed.guestCount || 1);
        setContact(parsed.contact || '');
        setNotes(parsed.notes || '');
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage(language === 'ar' ? 'يرجى كتابة الاسم' : 'Please enter your name.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          attending,
          guestCount: attending === 'yes' ? guestCount : 0,
          contact: contact.trim(),
          notes: notes.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsSuccess(true);
        setSavedRecord(data.rsvp);
        localStorage.setItem('zh_saved_rsvp', JSON.stringify(data.rsvp));
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.error || 'Failed to submit RSVP.');
      }
    } catch (err) {
      console.error('RSVP submission error:', err);
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="rsvp"
      className="relative w-full py-28 md:py-40 bg-[#080808] text-[#F4F2ED] overflow-hidden"
    >
      {/* Background Subtle Gradient & Border Frame */}
      <div className="max-w-3xl mx-auto px-6 md:px-12 relative z-10">
        <div className="border border-white/20 p-8 sm:p-12 md:p-16 bg-black/70 backdrop-blur-xl relative rounded-xl shadow-2xl">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="text-[11px] md:text-xs tracking-[0.45em] uppercase text-white/50 font-sans-luxury block mb-3">
              {t.rsvp.heading}
            </span>
            <h2 className="font-display-luxury text-3xl sm:text-4xl md:text-5xl font-light text-[#F4F2ED] uppercase tracking-[0.18em]">
              {language === 'ar' ? 'تأكيد الحضور' : 'RESPONSE REQUESTED'}
            </h2>
            <p className="font-serif-luxury italic text-lg sm:text-xl text-white/60 mt-3 font-light">
              {t.rsvp.subtitle}
            </p>
          </div>

          {/* CRITICAL: ADULTS-ONLY CELEBRATION NOTICE (HIGHLIGHTED IN RED) */}
          <div className="mb-10 p-4 sm:p-5 bg-red-950/40 border border-red-500/60 rounded-lg flex items-start gap-3.5 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
            <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-sans-luxury tracking-[0.2em] uppercase text-red-400 font-bold mb-1 flex items-center gap-2">
                <span>{t.rsvp.adultsOnlyNoticeTitle}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-red-500/20 text-red-300 border border-red-500/30 rounded tracking-widest font-normal">
                  {language === 'ar' ? 'ممنوع اصطحاب الأطفال' : 'NO KIDS'}
                </span>
              </h4>
              <p className="text-xs font-sans-luxury text-red-200/90 leading-relaxed font-light">
                {t.rsvp.adultsOnlyNoticeText}
              </p>
            </div>
          </div>

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center mx-auto mb-6 bg-white/5">
                <CheckCircle2 size={32} className="text-white" />
              </div>
              <h3 className="font-display-luxury text-2xl sm:text-3xl tracking-[0.2em] text-white uppercase font-light mb-3">
                {t.rsvp.thankYouTitle}
              </h3>
              <p className="font-serif-luxury italic text-lg text-white/70 max-w-md mx-auto mb-8 font-light">
                {t.rsvp.thankYouSubtitle}
              </p>

              <div className="bg-white/[0.03] border border-white/10 p-4 rounded max-w-sm mx-auto text-xs font-sans-luxury text-white/70 mb-8 space-y-1.5">
                <p>
                  <strong className="text-white uppercase tracking-wider">{savedRecord?.name}</strong>
                </p>
                <p>
                  {language === 'ar' ? 'الحالة:' : 'Status:'}{' '}
                  <span className="text-white font-medium">
                    {savedRecord?.attending === 'yes' ? t.rsvp.yesOption : t.rsvp.noOption}
                  </span>
                </p>
                {savedRecord?.attending === 'yes' && (
                  <p>
                    {language === 'ar' ? 'عدد المقاعد:' : 'Reserved Guests:'}{' '}
                    <span className="text-white font-medium">{savedRecord.guestCount}</span>
                  </p>
                )}
              </div>

              <button
                onClick={() => setIsSuccess(false)}
                className="text-xs font-sans-luxury tracking-[0.25em] text-white/40 hover:text-white uppercase underline underline-offset-4 transition-colors"
              >
                {t.rsvp.changeResponse}
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {errorMessage && (
                <div className="p-3 bg-red-950/50 border border-red-500/30 text-red-200 text-xs font-sans-luxury rounded">
                  {errorMessage}
                </div>
              )}

              {/* Guest Name */}
              <div>
                <label className="block text-[11px] font-sans-luxury tracking-[0.2em] text-white/60 uppercase mb-2">
                  {t.rsvp.nameLabel} <span className="text-white">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.rsvp.namePlaceholder}
                  className="w-full bg-white/[0.04] border border-white/20 focus:border-white text-[#F4F2ED] px-4 py-3.5 text-sm font-sans-luxury focus:outline-none transition-colors rounded-none placeholder:text-white/25"
                />
              </div>

              {/* Attendance Selection */}
              <div>
                <label className="block text-[11px] font-sans-luxury tracking-[0.2em] text-white/60 uppercase mb-3">
                  {t.rsvp.question} <span className="text-white">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* YES Option */}
                  <button
                    type="button"
                    onClick={() => setAttending('yes')}
                    className={`py-4 px-5 text-left border flex items-center justify-between transition-all duration-300 ${
                      attending === 'yes'
                        ? 'border-white bg-[#F4F2ED] text-[#080808]'
                        : 'border-white/20 bg-white/[0.02] text-white/70 hover:border-white/40'
                    }`}
                  >
                    <span className="font-sans-luxury text-xs tracking-[0.2em] uppercase font-semibold">
                      {t.rsvp.yesOption}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        attending === 'yes' ? 'border-black bg-black text-white' : 'border-white/40'
                      }`}
                    >
                      {attending === 'yes' && <Check size={10} />}
                    </div>
                  </button>

                  {/* NO Option */}
                  <button
                    type="button"
                    onClick={() => setAttending('no')}
                    className={`py-4 px-5 text-left border flex items-center justify-between transition-all duration-300 ${
                      attending === 'no'
                        ? 'border-white bg-[#F4F2ED] text-[#080808]'
                        : 'border-white/20 bg-white/[0.02] text-white/70 hover:border-white/40'
                    }`}
                  >
                    <span className="font-sans-luxury text-xs tracking-[0.2em] uppercase font-semibold">
                      {t.rsvp.noOption}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        attending === 'no' ? 'border-black bg-black text-white' : 'border-white/40'
                      }`}
                    >
                      {attending === 'no' && <Check size={10} />}
                    </div>
                  </button>
                </div>
              </div>

              {/* Guest Count (only if attending is yes) */}
              {attending === 'yes' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="overflow-hidden"
                >
                  <label className="block text-[11px] font-sans-luxury tracking-[0.2em] text-white/60 uppercase mb-2">
                    {t.rsvp.guestCountLabel}
                  </label>
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuestCount(num)}
                        className={`w-12 h-12 flex items-center justify-center font-sans-luxury text-sm border transition-all ${
                          guestCount === num
                            ? 'border-white bg-white text-black font-bold'
                            : 'border-white/20 bg-white/[0.02] text-white/70 hover:border-white/40'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Contact Information */}
              <div>
                <label className="block text-[11px] font-sans-luxury tracking-[0.2em] text-white/60 uppercase mb-2">
                  {t.rsvp.contactLabel}
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder={t.rsvp.contactPlaceholder}
                  className="w-full bg-white/[0.04] border border-white/20 focus:border-white text-[#F4F2ED] px-4 py-3.5 text-sm font-sans-luxury focus:outline-none transition-colors rounded-none placeholder:text-white/25"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-sans-luxury tracking-[0.2em] text-white/60 uppercase mb-2">
                  {t.rsvp.notesLabel}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.rsvp.notesPlaceholder}
                  className="w-full bg-white/[0.04] border border-white/20 focus:border-white text-[#F4F2ED] px-4 py-3 text-sm font-sans-luxury focus:outline-none transition-colors rounded-none placeholder:text-white/25 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#F4F2ED] text-[#080808] hover:bg-white text-xs font-sans-luxury tracking-[0.35em] uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? t.rsvp.submittingButton : t.rsvp.submitButton}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
