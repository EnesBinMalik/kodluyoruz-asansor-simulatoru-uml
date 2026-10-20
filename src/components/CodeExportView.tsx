import React, { useState } from 'react';
import { Code2, Copy, Check, FileCode, Terminal } from 'lucide-react';
import { CODE_SNIPPETS } from '../data/codeSnippets';

export const CodeExportView: React.FC = () => {
  const [activeLang, setActiveLang] = useState<'typescript' | 'java' | 'csharp'>('typescript');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[activeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <FileCode className="w-4 h-4" />
            <span>Nesne Yönelimli Kaynak Kodları</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Üretim ve Ödev Teslimine Hazır Kaynak Kodlar
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Tasarım diyagramının TypeScript, Java ve C# (.NET) dillerindeki temiz, dokümante edilmiş ve 
            standartlara uygun nesne yönelimli sınıfları.
          </p>
        </div>

        {/* Language Tabs & Copy Button */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveLang('typescript')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeLang === 'typescript'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              TypeScript
            </button>
            <button
              onClick={() => setActiveLang('java')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeLang === 'java'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Java 17+
            </button>
            <button
              onClick={() => setActiveLang('csharp')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeLang === 'csharp'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              C# (.NET)
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-700/20 active:scale-95 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Kopyalandı!' : 'Kodu Kopyala'}</span>
          </button>
        </div>
      </div>

      {/* Code Editor Container */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Editor Top Bar */}
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2 text-slate-400">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-white font-semibold">
              {activeLang === 'typescript' ? 'ElevatorSystem.ts' : activeLang === 'java' ? 'ElevatorSystem.java' : 'ElevatorSystem.cs'}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400">Enes Öztürk İmzalı Mimari</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
        </div>

        {/* Code Content */}
        <pre className="p-6 text-xs font-mono leading-relaxed text-slate-200 overflow-x-auto max-h-[600px] selection:bg-cyan-900 selection:text-white">
          {CODE_SNIPPETS[activeLang]}
        </pre>
      </div>
    </div>
  );
};
