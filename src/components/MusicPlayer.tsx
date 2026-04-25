import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
  accent: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Horizon",
    artist: "SynthAI_01",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop",
    accent: "#06b6d4"
  },
  {
    id: 2,
    title: "Digital Dusk",
    artist: "RhythmAura",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
    accent: "#f43f5e"
  },
  {
    id: 3,
    title: "Cortex Override",
    artist: "NeuralBeats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1000&auto=format&fit=crop",
    accent: "#a855f7"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div className="w-full max-w-sm bg-slate-900/40 backdrop-blur-md rounded-3xl p-6 border border-slate-800 shadow-2xl">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />

      <div className="flex flex-col items-center gap-6">
        {/* Album Art */}
        <div className="relative group">
          <motion.div 
            className="w-48 h-48 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] border-2"
            style={{ borderColor: currentTrack.accent }}
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-2xl">
            <Music className="w-12 h-12 text-white/50" />
          </div>
        </div>

        {/* Track Info */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-white tracking-tight">{currentTrack.title}</h3>
          <p className="text-sm text-slate-400 font-medium">{currentTrack.artist}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-2">
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full" 
              style={{ backgroundColor: currentTrack.accent }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            <span>0:00</span>
            <span>-:--</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8">
          <button onClick={prevTrack} className="p-2 text-slate-400 hover:text-white transition-colors">
            <SkipBack className="w-6 h-6" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all transform hover:scale-110 active:scale-95"
            style={{ backgroundColor: currentTrack.accent }}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white fill-current" />
            ) : (
              <Play className="w-8 h-8 text-white fill-current translate-x-0.5" />
            )}
          </button>

          <button onClick={nextTrack} className="p-2 text-slate-400 hover:text-white transition-colors">
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* Visualizer Dots */}
        <div className="flex gap-1 h-3 items-end">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full"
              style={{ backgroundColor: currentTrack.accent }}
              animate={{ 
                height: isPlaying ? [4, 12, 6, 10, 4] : 4 
              }}
              transition={{ 
                duration: 0.5, 
                repeat: Infinity, 
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
