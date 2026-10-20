import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Search, 
  Filter, 
  Code, 
  Maximize2, 
  ExternalLink,
  ShieldAlert,
  GitBranch,
  Boxes,
  HelpCircle,
  Cpu
} from 'lucide-react';
import { UML_CLASSES, MERMAID_UML_CODE, PLANTUML_CODE } from '../data/umlData';
import { UmlClassDefinition } from '../types/elevator';
import { ClassDetailModal } from './ClassDetailModal';

export const UmlDiagramViewer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<string>('ALL');
  const [selectedOopFilter, setSelectedOopFilter] = useState<string>('ALL');
  const [selectedClass, setSelectedClass] = useState<UmlClassDefinition | null>(null);
  const [diagramExportFormat, setDiagramExportFormat] = useState<'CARDS' | 'MERMAID' | 'PLANTUML'>('CARDS');
  const [copied, setCopied] = useState(false);

  // Filter classes
  const filteredClasses = UML_CLASSES.filter(cls => {
    const matchesSearch = 
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.attributes.some(a => a.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      cls.methods.some(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPackage = 
      selectedPackage === 'ALL' ||
      (selectedPackage === 'CORE' && (cls.id === 'building' || cls.id === 'elevator' || cls.id === 'floor' || cls.id === 'passenger')) ||
      (selectedPackage === 'HARDWARE' && cls.packageName.includes('hardware')) ||
      (selectedPackage === 'CONTROL' && (cls.packageName.includes('control') || cls.packageName.includes('sim')));

    const matchesOop = 
      selectedOopFilter === 'ALL' ||
      cls.oopPrinciples.some(p => p.pillar.toLowerCase() === selectedOopFilter.toLowerCase());

    return matchesSearch && matchesPackage && matchesOop;
  });

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Summary Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950/60 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Boxes className="w-4 h-4" />
              <span>Nesne Yönelimli Mimari & UML 2.5 Standartları</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Kodluyoruz Sigorta 12 Katlı Ofis Binası UML Sınıf Diyagramı
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Problem metninde belirtilen 12 kat, 5 asansör, kat kapıları, varış zilleri, çift kapı senkronizasyonu, 
              kabin ve kat gösterge ışıkları ile enerji tasarruflu programlayıcıyı tam nesne yönelimli olarak modelleyen UML hiyerarşisi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setDiagramExportFormat('CARDS')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                diagramExportFormat === 'CARDS'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              İnteraktif Kartlar ({filteredClasses.length})
            </button>
            <button
              onClick={() => setDiagramExportFormat('MERMAID')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                diagramExportFormat === 'MERMAID'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Mermaid Kodu
            </button>
            <button
              onClick={() => setDiagramExportFormat('PLANTUML')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                diagramExportFormat === 'PLANTUML'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              PlantUML Kodu
            </button>
          </div>
        </div>

        {/* OOP Pillars Quick Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-800/80">
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="font-semibold text-white">Kapsülleme:</span>
            <span className="text-slate-400">Private alanlar, 6 yolcu sınırı</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="font-semibold text-white">Kalıtım:</span>
            <span className="text-slate-400">Button, Door, Indicator</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            <span className="font-semibold text-white">Polimorfizm:</span>
            <span className="text-slate-400">IScheduler, press(), open()</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="font-semibold text-white">Soyutlama:</span>
            <span className="text-slate-400">Soyut sınıflar & arayüzler</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Subsystem Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Sınıf adı, metot veya öznitelik ara (Örn: Elevator, press, door, capacity)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Subsystem filter */}
          <div className="flex items-center space-x-1 text-xs">
            <span className="text-slate-500 hidden sm:inline">Paket:</span>
            <select
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Tüm Alt Sistemler (17 Sınıf)</option>
              <option value="CORE">Çekirdek Model (Bina, Kat, Asansör, Yolcu)</option>
              <option value="HARDWARE">Donanım & Aygıtlar (Kapılar, Butonlar, Işıklar)</option>
              <option value="CONTROL">Kontrol & Simülatör (Scheduler, Saat, Rastgele)</option>
            </select>
          </div>

          {/* OOP Pillar filter */}
          <div className="flex items-center space-x-1 text-xs">
            <span className="text-slate-500 hidden sm:inline">OOP:</span>
            <select
              value={selectedOopFilter}
              onChange={(e) => setSelectedOopFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Tüm İlkeler</option>
              <option value="Kapsülleme">Kapsülleme (Encapsulation)</option>
              <option value="Kalıtım">Kalıtım (Inheritance)</option>
              <option value="Polimorfizm">Polimorfizm (Polymorphism)</option>
              <option value="Soyutlama">Soyutlama (Abstraction)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mermaid Raw Code View */}
      {diagramExportFormat === 'MERMAID' && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Code className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Mermaid.js Sınıf Diyagramı Kodu</h3>
            </div>
            <button
              onClick={() => handleCopyCode(MERMAID_UML_CODE)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg shadow transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Kopyalandı!' : 'Kodu Kopyala'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Bu kodu Notion, GitHub Markdown, Obsidian veya Mermaid Live Editör içine doğrudan yapıştırarak interaktif vektör diyagram olarak görüntüleyebilirsiniz.
          </p>
          <pre className="p-4 bg-slate-900 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto max-h-[500px]">
            {MERMAID_UML_CODE}
          </pre>
        </div>
      )}

      {/* PlantUML Raw Code View */}
      {diagramExportFormat === 'PLANTUML' && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Code className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">PlantUML Sınıf Diyagramı Kodu (Resmi Standart)</h3>
            </div>
            <button
              onClick={() => handleCopyCode(PLANTUML_CODE)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Kopyalandı!' : 'PlantUML Kopyala'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            PlantUML, yazılım mühendisliği raporlarında ve akademik tezlerde en yaygın kullanılan standart UML motorudur.
          </p>
          <pre className="p-4 bg-slate-900 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto max-h-[500px]">
            {PLANTUML_CODE}
          </pre>
        </div>
      )}

      {/* Interactive UML Class Cards View */}
      {diagramExportFormat === 'CARDS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredClasses.map((cls) => {
            const isAbstract = cls.stereotype === '<<abstract>>';
            const isInterface = cls.stereotype === '<<interface>>';

            return (
              <div
                key={cls.id}
                onClick={() => setSelectedClass(cls)}
                className={`bg-slate-900/90 rounded-xl border transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer flex flex-col overflow-hidden ${
                  isInterface
                    ? 'border-indigo-700/60 hover:border-indigo-500'
                    : isAbstract
                    ? 'border-amber-700/60 hover:border-amber-500'
                    : 'border-slate-800 hover:border-cyan-500/70'
                }`}
              >
                {/* UML Class Header */}
                <div className={`px-4 py-3 border-b flex items-start justify-between ${
                  isInterface
                    ? 'bg-indigo-950/40 border-indigo-900/50'
                    : isAbstract
                    ? 'bg-amber-950/30 border-amber-900/50'
                    : 'bg-slate-950/80 border-slate-800'
                }`}>
                  <div>
                    {cls.stereotype && (
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider block text-cyan-400">
                        {cls.stereotype}
                      </span>
                    )}
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {cls.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {cls.packageName}
                    </span>
                  </div>

                  <div className="flex flex-col items-end space-y-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                      {cls.oopPrinciples[0]?.pillar || 'OOP'}
                    </span>
                    <span className="text-[10px] text-cyan-400 flex items-center space-x-0.5 hover:underline">
                      <span>Detay</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>

                {/* Attributes Compartment */}
                <div className="p-3 border-b border-slate-800/80 bg-slate-950/30 font-mono text-xs space-y-1">
                  <div className="text-[10px] uppercase font-sans font-semibold text-slate-500 mb-1">
                    Öznitelikler:
                  </div>
                  {cls.attributes.length === 0 ? (
                    <span className="text-slate-600 italic text-[11px] font-sans">Yok (Saf Arayüz)</span>
                  ) : (
                    cls.attributes.slice(0, 4).map((attr, idx) => (
                      <div key={idx} className="flex items-baseline space-x-1 truncate text-slate-300">
                        <span className={`font-bold ${
                          attr.visibility === '+' ? 'text-emerald-400' :
                          attr.visibility === '-' ? 'text-rose-400' : 'text-amber-400'
                        }`}>
                          {attr.visibility}
                        </span>
                        <span className="font-semibold text-slate-200">{attr.name}</span>
                        <span className="text-slate-500">:</span>
                        <span className="text-cyan-400 truncate">{attr.type}</span>
                      </div>
                    ))
                  )}
                  {cls.attributes.length > 4 && (
                    <div className="text-[10px] text-slate-500 italic font-sans pt-0.5">
                      + {cls.attributes.length - 4} diğer öznitelik...
                    </div>
                  )}
                </div>

                {/* Methods Compartment */}
                <div className="p-3 border-b border-slate-800/80 bg-slate-950/20 font-mono text-xs space-y-1 flex-1">
                  <div className="text-[10px] uppercase font-sans font-semibold text-slate-500 mb-1">
                    Metotlar:
                  </div>
                  {cls.methods.length === 0 ? (
                    <span className="text-slate-600 italic text-[11px] font-sans">Yok</span>
                  ) : (
                    cls.methods.slice(0, 4).map((m, idx) => (
                      <div key={idx} className="flex items-baseline space-x-1 truncate text-slate-300">
                        <span className={`font-bold ${
                          m.visibility === '+' ? 'text-emerald-400' :
                          m.visibility === '-' ? 'text-rose-400' : 'text-amber-400'
                        }`}>
                          {m.visibility}
                        </span>
                        <span className="text-emerald-300 font-medium">{m.name}</span>
                        <span className="text-slate-400 text-[11px]">({m.parameters ? '...' : ''})</span>
                        <span className="text-slate-500">:</span>
                        <span className="text-sky-300">{m.returnType}</span>
                      </div>
                    ))
                  )}
                  {cls.methods.length > 4 && (
                    <div className="text-[10px] text-slate-500 italic font-sans pt-0.5">
                      + {cls.methods.length - 4} diğer metot...
                    </div>
                  )}
                </div>

                {/* Footer with Relationship Badges */}
                <div className="px-3 py-2 bg-slate-950/60 flex items-center justify-between text-[11px]">
                  <div className="flex items-center space-x-1 text-slate-400 truncate">
                    <GitBranch className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                    <span className="truncate">
                      {cls.relationships.length > 0
                        ? `${cls.relationships.length} ilişki (${cls.relationships[0].type})`
                        : 'Bağımsız Sınıf'}
                    </span>
                  </div>

                  <span className="text-cyan-400 font-semibold group-hover:underline">
                    İncele →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Class Modal */}
      {selectedClass && (
        <ClassDetailModal
          umlClass={selectedClass}
          onClose={() => setSelectedClass(null)}
          onSelectRelatedClass={(targetId) => {
            const found = UML_CLASSES.find(c => c.id === targetId);
            if (found) setSelectedClass(found);
          }}
        />
      )}
    </div>
  );
};
