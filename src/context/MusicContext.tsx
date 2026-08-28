import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface MusicContextType {
  isPlaying: boolean;
  isMuted: boolean;
  hasStarted: boolean;
  startMusic: () => Promise<void>;
  togglePlay: () => void;
  toggleMute: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('/media/adele.mp3');
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;

    const handleEnded = () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const startMusic = async () => {
    if (!audioRef.current) return;
    try {
      audioRef.current.muted = false;
      await audioRef.current.play();
      setIsPlaying(true);
      setIsMuted(false);
      setHasStarted(true);
    } catch (err) {
      console.warn('Audio playback was blocked or failed to start:', err);
      // Even if browser blocked un-muted autoplay, mark entered and enable audio controls
      setHasStarted(true);
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setHasStarted(true);
      }).catch((e) => console.warn('Play failed:', e));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    audioRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        isMuted,
        hasStarted,
        startMusic,
        togglePlay,
        toggleMute,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
