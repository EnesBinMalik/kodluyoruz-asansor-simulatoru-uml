import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { UmlDiagramViewer } from './components/UmlDiagramViewer';
import { BuildingSimulator } from './components/BuildingSimulator';
import { OopPrinciplesGuide } from './components/OopPrinciplesGuide';
import { CodeExportView } from './components/CodeExportView';
import { SignatureReportView } from './components/SignatureModal';
import { simulatorEngine } from './core/simulator';
import { soundSynth } from './utils/audio';
import { Award, Building2, CheckCircle2, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'diagram' | 'simulator' | 'oop' | 'code' | 'signature'>('diagram');
  const [isMuted, setIsMuted] = useState<boolean>(() => soundSynth.getIsMuted());
  const [timeStr, setTimeStr] = useState<string>(() => simulatorEngine.clock.getFormattedTimestamp());

  useEffect(() => {
    // Clock tick listener for header
    const unsubscribe = () => {};
    simulatorEngine.clock.subscribe((_, formatted) => {
      setTimeStr(formatted);
    });

    // Otomatik olarak simülatör saatini başlat
    simulatorEngine.clock.start();

    return () => {
      simulatorEngine.clock.pause();
    };
  }, []);

  const handleQuickSpawn = () => {
    simulatorEngine.spawnRandomPassenger();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-900 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickSpawnPassenger={handleQuickSpawn}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        currentTimeStr={timeStr}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'diagram' && <UmlDiagramViewer />}
        {activeTab === 'simulator' && <BuildingSimulator />}
        {activeTab === 'oop' && <OopPrinciplesGuide />}
        {activeTab === 'code' && <CodeExportView />}
        {activeTab === 'signature' && <SignatureReportView />}
      </main>

      {/* Footer with Signature & Attribution */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-cyan-500" />
            <span className="font-semibold text-slate-400">
              Kodluyoruz Sigorta Şirketi 12 Katlı Ofis Binası Asansör Simülatörü & UML Modeli
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span>Tasarım, Mimari & Gerçekleme:</span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 font-bold flex items-center space-x-1">
              <Award className="w-3.5 h-3.5 inline text-emerald-400" />
              <span>Enes Öztürk</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
