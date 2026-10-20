import React from 'react';
import { X, Layers, Link2, BookOpen, Quote, ShieldCheck } from 'lucide-react';
import { UmlClassDefinition } from '../types/elevator';

interface ClassDetailModalProps {
  umlClass: UmlClassDefinition | null;
  onClose: () => void;
  onSelectRelatedClass?: (classId: string) => void;
}

export const ClassDetailModal: React.FC<ClassDetailModalProps> = ({
  umlClass,
  onClose,
  onSelectRelatedClass,
}) => {
  if (!umlClass) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/60">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-cyan-400 font-semibold">
                  {umlClass.stereotype || '<<class>>'}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {umlClass.packageName}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {umlClass.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Class Description */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Açıklama & Tanım
            </h3>
            <p className="text-slate-200 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-800">
              {umlClass.description}
            </p>
          </div>

          {/* Problem Statement Quote (Şartname Karşılığı) */}
          <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-3.5">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold mb-1">
              <Quote className="w-4 h-4" />
              <span>Problem Metnindeki Dayanağı</span>
            </div>
            <p className="text-xs text-amber-200/90 italic font-serif leading-relaxed">
              &quot;{umlClass.specQuote}&quot;
            </p>
          </div>

          {/* Attributes & Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Attributes (Öznitelikler) */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Öznitelikler (Attributes)</span>
                <span className="text-[10px] text-slate-500 font-mono font-normal">
                  {umlClass.attributes.length} adet
                </span>
              </h4>
              {umlClass.attributes.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Öznitelik bulunmuyor (Arayüz).</p>
              ) : (
                <div className="space-y-1.5 font-mono text-xs">
                  {umlClass.attributes.map((attr, idx) => (
                    <div 
                      key={idx} 
                      className="p-1.5 rounded bg-slate-900/80 hover:bg-slate-850 border border-slate-800/50 flex flex-col"
                    >
                      <div className="flex items-baseline space-x-1">
                        <span className={`font-bold ${
                          attr.visibility === '+' ? 'text-emerald-400' :
                          attr.visibility === '-' ? 'text-rose-400' : 'text-amber-400'
                        }`}>
                          {attr.visibility}
                        </span>
                        <span className="text-slate-200 font-semibold">{attr.name}</span>
                        <span className="text-slate-500">:</span>
                        <span className="text-cyan-300">{attr.type}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-sans mt-0.5 pl-3">
                        {attr.description}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Methods (Metotlar) */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Metotlar & Fonksiyonlar</span>
                <span className="text-[10px] text-slate-500 font-mono font-normal">
                  {umlClass.methods.length} adet
                </span>
              </h4>
              {umlClass.methods.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Metot bulunmuyor.</p>
              ) : (
                <div className="space-y-1.5 font-mono text-xs">
                  {umlClass.methods.map((method, idx) => (
                    <div 
                      key={idx} 
                      className="p-1.5 rounded bg-slate-900/80 hover:bg-slate-850 border border-slate-800/50 flex flex-col"
                    >
                      <div className="flex items-baseline space-x-1">
                        <span className={`font-bold ${
                          method.visibility === '+' ? 'text-emerald-400' :
                          method.visibility === '-' ? 'text-rose-400' : 'text-amber-400'
                        }`}>
                          {method.visibility}
                        </span>
                        <span className="text-emerald-300 font-semibold">{method.name}</span>
                        <span className="text-slate-400">({method.parameters})</span>
                        <span className="text-slate-500">:</span>
                        <span className="text-sky-300">{method.returnType}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-sans mt-0.5 pl-3">
                        {method.description}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* OOP Principles in This Class */}
          <div className="bg-indigo-950/20 border border-indigo-800/40 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Bu Sınıfta Uygulanan OOP İlkeleri</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {umlClass.oopPrinciples.map((oop, idx) => (
                <div key={idx} className="bg-slate-900/80 p-2.5 rounded-lg border border-indigo-900/50">
                  <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-900/80 text-indigo-300 mb-1">
                    {oop.pillar}
                  </span>
                  <p className="text-xs text-slate-300 leading-snug">
                    {oop.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Relationships */}
          {umlClass.relationships.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Link2 className="w-4 h-4 text-cyan-400" />
                <span>Diğer Sınıflarla İlişkileri</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {umlClass.relationships.map((rel, idx) => (
                  <div 
                    key={idx}
                    onClick={() => onSelectRelatedClass && onSelectRelatedClass(rel.targetClassId)}
                    className="p-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition-colors flex items-start space-x-2.5"
                  >
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded mt-0.5 ${
                      rel.type === 'composition' ? 'bg-purple-900/80 text-purple-300' :
                      rel.type === 'aggregation' ? 'bg-blue-900/80 text-blue-300' :
                      rel.type === 'inheritance' ? 'bg-emerald-900/80 text-emerald-300' :
                      rel.type === 'realization' ? 'bg-cyan-900/80 text-cyan-300' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {rel.type}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white text-xs">
                          {rel.targetClassName}
                        </span>
                        {rel.multiplicity && (
                          <span className="text-[10px] font-mono text-cyan-400">
                            [{rel.multiplicity}]
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {rel.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-500">
          <span>Tasarım: Enes Öztürk • Kodluyoruz Sigorta Şirketi</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
