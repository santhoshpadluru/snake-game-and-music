import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Music2, Volume2 } from 'lucide-react';
import { TRACKS, Track } from '../types';

export const MusicPlayer = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipTrack = (direction: 'next' | 'prev') => {
    let nextIndex = direction === 'next' ? currentTrackIndex + 1 : currentTrackIndex - 1;
    if (nextIndex >= TRACKS.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = TRACKS.length - 1;
    
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = TRACKS[nextIndex].url;
      audioRef.current.play();
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      skipTrack('next');
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex]);

  return (
    <div className="w-full max-w-[400px] mt-8 relative">
      <audio ref={audioRef} src={currentTrack.url} />
      
      <div className="glass-morphism rounded-3xl p-6 relative overflow-hidden">
        {/* Progress bar background glow */}
        <div 
          className="absolute bottom-0 left-0 h-1 bg-neon-purple shadow-[0_0_10px_#bc13fe] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />

        <div className="flex items-center gap-6">
          <motion.div 
            key={currentTrack.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 rounded-2xl overflow-hidden relative group shrink-0 shadow-xl"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="flex gap-1 items-end h-6">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ['20%', '100%', '30%', '80%', '20%'] }}
                      transition={{ duration: 0.5 + i * 0.1, repeat: Infinity, ease: "easeInOut" }}
                      className="w-1 bg-neon-blue rounded-full"
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg tracking-tight truncate leading-tight mb-1">{currentTrack.title}</h3>
            <p className="text-zinc-500 text-xs uppercase tracking-widest font-mono truncate">{currentTrack.artist}</p>
            
            <div className="flex items-center gap-3 mt-4">
              <button 
                onClick={() => skipTrack('prev')}
                className="text-zinc-400 hover:text-white transition p-1"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>
              
              <button 
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 transition active:scale-95 shadow-lg"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <button 
                onClick={() => skipTrack('next')}
                className="text-zinc-400 hover:text-white transition p-1"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>

              <div className="ml-auto flex items-center gap-2">
                <Music2 className="w-4 h-4 text-zinc-600" />
                <span className="text-[10px] text-zinc-600 font-mono">0{currentTrackIndex + 1} / 03</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Atmospheric detail */}
      <div className="absolute -top-4 -right-4 pointer-events-none opacity-20">
         <Volume2 className="w-12 h-12 text-neon-purple animate-pulse" />
      </div>
    </div>
  );
};
