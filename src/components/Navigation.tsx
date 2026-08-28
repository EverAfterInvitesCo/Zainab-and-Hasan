import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Music } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useMusic } from '../context/MusicContext';

interface NavigationProps {
  onAdminClick?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onAdminClick }) => {
  const { language, setLanguage, toggleLanguage, t, isRtl } = useLanguage();
  const { isPlaying, togglePlay } = useMusic();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#invitation', label: t.nav.invitation },
    { href: '#date', label: t.nav.date },
    { href: '#venue', label: t.nav.venue },
    { href: '#memories', label: t.nav.memories },
    { href: '#rsvp', label: t.nav.rsvp },
    { href: '#guestbook', label: t.nav.guestbook },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="zh-main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#080808]/90 backdrop-blur-md border-b border-white/10 py-3.5'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Monogram */}
        <a
          id="zh-nav-brand"
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group flex flex-col items-start cursor-pointer focus:outline-none"
        >
          <span className="font-serif-luxury text-lg md:text-xl tracking-[0.25em] text-[#F4F2ED] uppercase font-light">
            ZAINAB &amp; HASAN
          </span>
          <span className="text-[9px] tracking-[0.35em] text-white/50 font-sans-luxury uppercase">
            08 · 01 · 27
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav id="zh-desktop-nav" className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.href);
              }}
              className="text-xs font-sans-luxury tracking-[0.22em] text-white/70 hover:text-white uppercase transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Controls: Language Switcher + Mobile Menu Button */}
        <div className="flex items-center gap-4">
          {/* Language Switcher Button */}
          <button
            id="zh-lang-toggle-btn"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 text-xs font-sans-luxury tracking-[0.15em] text-[#F4F2ED] hover:bg-white/10 hover:border-white/40 transition-all focus:outline-none"
            aria-label="Switch language"
          >
            <span className={language === 'ar' ? 'font-bold text-white' : 'text-white/50'}>
              عربي
            </span>
            <span className="text-white/30 text-[10px]">|</span>
            <span className={language === 'en' ? 'font-bold text-white' : 'text-white/50'}>
              EN
            </span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            id="zh-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white/80 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="zh-mobile-menu-drawer"
          className="lg:hidden fixed inset-0 top-[60px] bg-[#080808]/98 backdrop-blur-2xl z-40 flex flex-col justify-between p-8 border-t border-white/10 animate-fadeIn"
        >
          <nav className="flex flex-col gap-6 pt-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="text-xl font-serif-luxury tracking-[0.18em] text-[#F4F2ED]/90 hover:text-white uppercase py-2 border-b border-white/5"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs text-white/50 font-sans-luxury tracking-widest">
              <span>DUBAI, UAE</span>
              <span>08 · 01 · 2027</span>
            </div>

            {onAdminClick && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onAdminClick();
                }}
                className="text-[10px] tracking-[0.25em] text-white/30 hover:text-white/70 uppercase text-center py-2"
              >
                Organizer Access
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
