import { motion } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { NeonBackground } from './components/NeonBackground';
import { Cpu, Wifi, Activity } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen font-sans flex flex-col relative">
      <NeonBackground />
      
      {/* Header Rails */}
      <header className="px-8 py-6 flex justify-between items-center border-b border-white/10 glass-morphism z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-neon-blue flex items-center justify-center text-black font-black text-xl shadow-[0_0_15px_#00ffff]">
            N
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-[0.3em] uppercase mb-0.5">Neon Rhythm</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">System Active: Prot-01</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-mono">Core Load</span>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`h-1 w-4 rounded-full ${i < 4 ? 'bg-neon-blue' : 'bg-white/10'}`} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
             <Cpu className="w-4 h-4 text-neon-pink" />
             <Wifi className="w-4 h-4 text-neon-blue" />
             <Activity className="w-4 h-4 text-neon-purple" />
          </div>
        </div>
      </header>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 z-0">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-4xl flex flex-col lg:flex-row items-center justify-center gap-12"
        >
          {/* Game Window */}
          <section className="flex-1 flex flex-col items-center">
            <div className="mb-4 flex items-center gap-3">
               <div className="h-px w-8 bg-neon-blue/50" />
               <span className="text-[10px] text-neon-blue font-bold tracking-[0.4em] uppercase">Tactical Grid</span>
               <div className="h-px w-8 bg-neon-blue/50" />
            </div>
            <SnakeGame />
          </section>

          {/* Controls & Info Side */}
          <aside className="w-full lg:w-96 flex flex-col items-center lg:items-start">
             <div className="mb-4 flex items-center gap-3">
               <div className="h-px w-8 bg-neon-purple/50" />
               <span className="text-[10px] text-neon-purple font-bold tracking-[0.4em] uppercase">Vibe Module</span>
               <div className="h-px w-8 bg-neon-purple/50" />
            </div>
            
            <MusicPlayer />

            <div className="mt-8 p-6 glass-morphism rounded-3xl border border-white/10 shadow-xl w-full">
              <h4 className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase mb-4">Transmission Log</h4>
              <div className="space-y-3 font-mono text-[10px]">
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Sync Status</span>
                  <span className="text-neon-blue">ENCRYPTED</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Logic Frame</span>
                  <span>V.4.2.0-STABLE</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Buffer Rate</span>
                  <motion.span 
                    animate={{ opacity: [1, 0.5, 1] }} 
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    124.8 GB/S
                  </motion.span>
                </div>
              </div>
            </div>
          </aside>
        </motion.div>
      </main>

      {/* Footer Rail */}
      <footer className="px-8 py-3 flex justify-between items-center border-t border-white/10 glass-morphism text-[10px] font-mono text-zinc-600 z-10">
        <div className="flex gap-6 uppercase tracking-widest">
           <span>AIS-NODE: 406783200429</span>
           <span>LAT: 35.6895 N</span>
           <span>LNG: 139.6917 E</span>
        </div>
        <div className="uppercase tracking-[0.5em] animate-pulse">
           Initialising... Core Ready
        </div>
      </footer>
    </div>
  );
}
