import React from 'react';
import { 
  Building2, 
  Network, 
  PlayCircle, 
  Code2, 
  BookOpen, 
  Award, 
  Volume2, 
  VolumeX, 
  UserPlus
} from 'lucide-react';
import { soundSynth } from '../utils/audio';

interface NavbarProps {
  activeTab: 'diagram' | 'simulator' | 'oop' | 'code' | 'signature';
  setActiveTab: (tab: 'diagram' | 'simulator' | 'oop' | 'code' | 'signature') => void;
  onQuickSpawnPassenger: () => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  currentTimeStr: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onQuickSpawnPassenger,
  isMuted,
  setIsMuted,
  currentTimeStr
}) => {
  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundSynth.setMuted(nextMuted);
    if (!nextMuted) {
      soundSynth.playArrivalBell();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Project Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight bg-gradient-to-r from-cyan-400 via-sky-200 to-emerald-400 bg-clip-text text-transparent">
                  Kodluyoruz Sigorta Şirketi
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                  12 Kat & 5 Asansör
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center space-x-1">
                <span>Asansör Simülatörü & UML Sınıf Mimarisi</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-medium flex items-center space-x-1">
                  <Award className="w-3 h-3 inline text-emerald-400" />
                  <span>Enes Öztürk İmzalı</span>
                </span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('diagram')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'diagram'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>UML Diyagramı</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'simulator'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>12 Kat Simülatörü</span>
            </button>

            <button
              onClick={() => setActiveTab('oop')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'oop'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>OOP İlkeleri</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'code'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Sınıf Kodları</span>
            </button>

            <button
              onClick={() => setActiveTab('signature')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'signature'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-emerald-400/80 hover:text-emerald-300 hover:bg-emerald-950/40'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Enes Öztürk Raporu</span>
            </button>
          </nav>

          {/* Quick Actions & Controls */}
          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{currentTimeStr}</span>
            </div>

            <button
              onClick={onQuickSpawnPassenger}
              title="Rastgele Yolcu Oluştur ve Çağrı Yap"
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-emerald-700/20 transition-all active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Yolcu Çağır</span>
            </button>

            <button
              onClick={toggleSound}
              title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden overflow-x-auto pb-2 space-x-1">
          <button
            onClick={() => setActiveTab('diagram')}
            className={`px-3 py-1 text-xs whitespace-nowrap rounded-md ${
              activeTab === 'diagram' ? 'bg-cyan-600 text-white' : 'text-slate-400'
            }`}
          >
            UML
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1 text-xs whitespace-nowrap rounded-md ${
              activeTab === 'simulator' ? 'bg-cyan-600 text-white' : 'text-slate-400'
            }`}
          >
            Simülatör
          </button>
          <button
            onClick={() => setActiveTab('oop')}
            className={`px-3 py-1 text-xs whitespace-nowrap rounded-md ${
              activeTab === 'oop' ? 'bg-cyan-600 text-white' : 'text-slate-400'
            }`}
          >
            OOP
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1 text-xs whitespace-nowrap rounded-md ${
              activeTab === 'code' ? 'bg-cyan-600 text-white' : 'text-slate-400'
            }`}
          >
            Kodlar
          </button>
          <button
            onClick={() => setActiveTab('signature')}
            className={`px-3 py-1 text-xs whitespace-nowrap rounded-md ${
              activeTab === 'signature' ? 'bg-emerald-600 text-white' : 'text-emerald-400'
            }`}
          >
            İmza
          </button>
        </div>
      </div>
    </header>
  );
};
