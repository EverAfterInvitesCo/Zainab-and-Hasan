import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { MusicProvider } from './context/MusicContext';
import { AudioPlayer } from './components/AudioPlayer';
import { Navigation } from './components/Navigation';
import { EntryScreen } from './sections/EntryScreen';
import { HeroSection } from './sections/HeroSection';
import { InvitationSection } from './sections/InvitationSection';
import { DateCountdownSection } from './sections/DateCountdownSection';
import { VenueSection } from './sections/VenueSection';
import { PolaroidMemoriesSection } from './sections/PolaroidMemoriesSection';
import { GuestbookSection } from './sections/GuestbookSection';
import { RsvpSection } from './sections/RsvpSection';
import { FinalSection } from './sections/FinalSection';
import { AdminPortal } from './pages/AdminPortal';
import { Lock, Heart, Instagram, Facebook } from 'lucide-react';

const MainWeddingApp: React.FC = () => {
  const [isEntered, setIsEntered] = useState<boolean>(false);
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const { language } = useLanguage();

  // Listen for hash navigation e.g. #admin or /admin
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdminView(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleAdminToggle = () => {
    setIsAdminView(true);
    window.location.hash = 'admin';
  };

  const handleReturnToSite = () => {
    setIsAdminView(false);
    window.location.hash = '';
  };

  if (isAdminView) {
    return <AdminPortal onBack={handleReturnToSite} />;
  }

  return (
    <div className="relative min-h-screen bg-[#080808] text-[#F4F2ED] selection:bg-[#F4F2ED] selection:text-[#080808]">
      {/* Entry Screen Curtain */}
      <EntryScreen onEnter={() => setIsEntered(true)} isEntered={isEntered} />

      {/* Floating Header Navigation */}
      <Navigation onAdminClick={handleAdminToggle} />

      {/* Discreet Corner Audio Player with Organizer Lock */}
      <AudioPlayer onAdminClick={handleAdminToggle} />

      {/* Main Content Sections */}
      <main id="zh-main-content">
        <HeroSection />
        <InvitationSection />
        <DateCountdownSection />
        <VenueSection />
        <PolaroidMemoriesSection />
        <RsvpSection />
        <GuestbookSection />
        <FinalSection />
      </main>

      {/* Small Elegant Footer */}
      <footer className="w-full bg-[#050505] border-t border-white/10 py-10 px-6 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
          {/* Made with love notice */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-serif-luxury tracking-[0.2em] text-white/70">
            <span>Made with love by</span>
            <span className="font-semibold text-white tracking-[0.22em] uppercase">Everafterinvites</span>
            <Heart size={12} className="text-red-400 fill-red-400 inline-block ml-0.5" />
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-6 pt-1">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/_everafterinvites_/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors group"
              aria-label="Instagram"
            >
              <Instagram size={14} className="group-hover:scale-110 transition-transform" />
              <span className="font-sans-luxury text-[11px] tracking-wider uppercase">Instagram</span>
            </a>

            <span className="text-white/20">·</span>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@_everafterinvites_"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors group"
              aria-label="TikTok"
            >
              <span className="font-bold text-[11px] leading-none px-1 py-0.5 rounded border border-white/30 group-hover:border-white transition-colors">TT</span>
              <span className="font-sans-luxury text-[11px] tracking-wider uppercase">TikTok</span>
            </a>

            <span className="text-white/20">·</span>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/profile.php?id=61591562833010"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors group"
              aria-label="Facebook"
            >
              <Facebook size={14} className="group-hover:scale-110 transition-transform" />
              <span className="font-sans-luxury text-[11px] tracking-wider uppercase">Facebook</span>
            </a>
          </div>

          {/* Organizer Portal & Hashtag */}
          <div className="flex items-center gap-4 pt-3 text-[10px] font-sans-luxury tracking-[0.25em] text-white/30 uppercase">
            <span>#ZAINABANDHASAN</span>
            <span>·</span>
            <button
              onClick={handleAdminToggle}
              className="hover:text-white/70 transition-colors flex items-center gap-1 cursor-pointer focus:outline-none"
            >
              <Lock size={10} />
              <span>Organizer Portal</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <MusicProvider>
        <MainWeddingApp />
      </MusicProvider>
    </LanguageProvider>
  );
}

export default App;
