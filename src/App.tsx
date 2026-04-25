import React, { useState } from 'react';
import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Cpu, Zap, Activity } from 'lucide-react';

export default function App() {
  const [globalScore, setGlobalScore] = useState(0);

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1e1b4b,transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/20 rounded-full blur-[120px]"
        />
      </div>

      {/* Navigation Header */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-slate-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500 rounded-lg shadow-[0_0_15px_#06b6d4]">
            <Cpu className="w-6 h-6 text-slate-950" />
          </div>
          <span className="text-2xl font-black italic tracking-tighter uppercase">Neon Rhythm</span>
        </div>

        <div className="hidden md:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          <div className="flex items-center gap-2 text-cyan-400">
            <Zap className="w-3 h-3" />
            <span>Core Active</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3" />
            <span>Sync Ready</span>
          </div>
        </div>

        <div className="bg-slate-900 px-6 py-2 rounded-full border border-cyan-500/30 shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]">
           <span className="text-[10px] text-slate-500 block uppercase tracking-widest text-center leading-none mb-0.5">High Score</span>
           <span className="text-xl font-mono text-cyan-400 font-bold">{globalScore.toString().padStart(6, '0')}</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side - Info/Stats */}
        <div className="lg:col-span-3 space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-black leading-[0.9] uppercase italic opacity-20">SYSTEM<br/>STATUS</h1>
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                <span>Kernel</span>
                <span className="text-cyan-400 font-mono">v4.2.0-LITE</span>
              </div>
              <div className="flex justify-between text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                <span>Latency</span>
                <span className="text-emerald-400 font-mono">1.2ms</span>
              </div>
              <div className="flex justify-between text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                <span>Memory</span>
                <span className="text-cyan-400 font-mono">82%</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-4">Neural Archive</h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                 <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">01</div>
                 <div>
                   <p className="text-xs font-bold">Rhythm Mode</p>
                   <p className="text-[10px] text-slate-500">Sync snake speed to BPM</p>
                 </div>
              </div>
              <div className="flex gap-3 opacity-40">
                 <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">02</div>
                 <div>
                   <p className="text-xs font-bold font-mono uppercase">LOCKED</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Snake Game */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative group">
            {/* Decorative corners */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-cyan-500 rounded-tl-xl z-20" />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-cyan-500 rounded-tr-xl z-20" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-cyan-500 rounded-bl-xl z-20" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-cyan-500 rounded-br-xl z-20" />
            
            <SnakeGame onScoreChange={(s) => setGlobalScore(prev => Math.max(prev, s))} />
          </div>
        </div>

        {/* Right Side - Music Player */}
        <div className="lg:col-span-3 flex flex-col items-center lg:items-end">
           <MusicPlayer />
           
           <div className="mt-12 text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600 mb-2">Developed by AI Studio</p>
              <div className="h-1 w-24 bg-gradient-to-r from-transparent to-cyan-500 ml-auto" />
           </div>
        </div>
      </main>

      {/* Footer Floating Decoration */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-900 via-rose-900 to-cyan-900 opacity-20" />
    </div>
  );
}
