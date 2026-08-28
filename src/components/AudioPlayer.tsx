import React from 'react';
import { Volume2, VolumeX, Play, Pause, Lock } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { useLanguage } from '../context/LanguageContext';

interface AudioPlayerProps {
  onAdminClick?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ onAdminClick }) => {
  const { isPlaying, isMuted, hasStarted, togglePlay, toggleMute } = useMusic();
  const { isRtl } = useLanguage();

  if (!hasStarted) return null;

  return (
    <div
      id="zh-audio-controller"
      className={`fixed bottom-6 ${
        isRtl ? 'left-6' : 'right-6'
      } z-50 flex items-center gap-2 bg-[#080808]/90 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-full shadow-2xl transition-all duration-300 hover:border-white/50`}
    >
      {/* Audio Wave Visualizer */}
      <div className="flex items-end gap-[3px] h-4 px-1">
        <div
          className={`w-[2px] bg-[#F4F2ED] rounded-full transition-all duration-300 ${
            isPlaying && !isMuted ? 'animate-audio-bar-1 h-3' : 'h-1.5 opacity-40'
          }`}
        />
        <div
          className={`w-[2px] bg-[#F4F2ED] rounded-full transition-all duration-300 ${
            isPlaying && !isMuted ? 'animate-audio-bar-2 h-4' : 'h-2 opacity-40'
          }`}
        />
        <div
          className={`w-[2px] bg-[#F4F2ED] rounded-full transition-all duration-300 ${
            isPlaying && !isMuted ? 'animate-audio-bar-3 h-2.5' : 'h-1 opacity-40'
          }`}
        />
      </div>

      <span className="text-[10px] tracking-[0.2em] uppercase text-white/70 font-sans-luxury pl-1 pr-1 hidden sm:inline-block">
        ADELE
      </span>

      {/* Play / Pause Button */}
      <button
        id="zh-audio-play-pause-btn"
        onClick={togglePlay}
        title={isPlaying ? 'Pause music' : 'Play music'}
        className="w-7 h-7 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
        aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
      >
        {isPlaying ? <Pause size={13} /> : <Play size={13} className="translate-x-[1px]" />}
      </button>

      {/* Mute / Unmute Button */}
      <button
        id="zh-audio-mute-btn"
        onClick={toggleMute}
        title={isMuted ? 'Unmute music' : 'Mute music'}
        className="w-7 h-7 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
        aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
      >
        {isMuted ? <VolumeX size={13} className="text-red-300/80" /> : <Volume2 size={13} />}
      </button>

      {/* Divider */}
      <div className="w-[1px] h-3.5 bg-white/20 mx-0.5" />

      {/* Organizer Portal Lock Button */}
      <button
        id="zh-organizer-lock-btn"
        onClick={onAdminClick}
        title="Organizer Portal"
        className="w-7 h-7 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/15 transition-all focus:outline-none cursor-pointer group"
        aria-label="Organizer Portal"
      >
        <Lock size={13} className="group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
};

