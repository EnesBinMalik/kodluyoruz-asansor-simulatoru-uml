import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  Building2, 
  FileCheck, 
  ShieldCheck, 
  Cpu, 
  Sparkles,
  Download,
  Calendar,
  UserCheck
} from 'lucide-react';

export const SignatureReportView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Official Certificate & Signature Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 p-8 rounded-3xl border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        {/* Background glow & watermark */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-8 bottom-6 opacity-5 pointer-events-none select-none text-right font-black text-8xl text-white">
          ENES
        </div>

        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  Yazılım Mimarisi & Şartname Uygunluk Belgesi
                </span>
                <h1 className="text-2xl font-black text-white tracking-tight">
                  Kodluyoruz Sigorta Şirketi 12 Katlı Ofis Binası
                </h1>
              </div>
            </div>

            <div className="text-right flex flex-col sm:items-end">
              <span className="text-xs text-slate-400 flex items-center space-x-1 font-mono">
                <Calendar className="w-3.5 h-3.5 inline text-slate-500" />
                <span>Ekim 2026 • Proje Raporu</span>
              </span>
              <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60 shadow-sm">
                ✓ %100 Şartname Doğrulandı
              </span>
            </div>
          </div>

          {/* Signature Box */}
          <div className="bg-slate-950/70 p-6 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-1">
              <div className="text-xs text-slate-400 uppercase font-mono">
                Sistem Tasarımcısı & Yazılım Mimarı
              </div>
              <div className="text-2xl font-black text-white flex items-center space-x-2">
                <span>Enes Öztürk</span>
                <UserCheck className="w-5 h-5 text-emerald-400 inline" />
              </div>
              <p className="text-xs text-slate-400 max-w-md">
                Nesne Yönelimli Programlama (OOP) ilkelerine, UML 2.5 standartlarına ve 
                Kodluyoruz Sigorta Şirketi teknik simülasyon şartnamesine tam uyumlu mimari modelleme.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-emerald-900/40 text-center flex-shrink-0">
              <div className="text-[10px] text-slate-400 uppercase font-mono mb-1">
                Doğrulama & İmza
              </div>
              <div className="font-serif italic text-lg text-emerald-400 font-bold px-4 py-1 border-b border-emerald-800/50">
                Enes Öztürk
              </div>
              <div className="text-[9px] text-slate-500 font-mono mt-1">
                SHA-256 Verified Architecture
              </div>
            </div>
          </div>

          {/* Requirements Compliance Checklist */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              <span>Teknik Şartname Maddeleri & Mimari Karşılıkları</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">12 Kat ve 5 Asansör:</strong>
                  <p className="text-slate-400 mt-0.5">
                    Building sınıfı 12 adet Floor nesnesi ve 5 adet Elevator nesnesi içerir. Her asansör 12 katın tamamına erişebilir.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">6 Yetişkin Yolcu Kapasitesi:</strong>
                  <p className="text-slate-400 mt-0.5">
                    Elevator.MAX_PASSENGER_CAPACITY = 6; Kapsülleme ile addPassenger metodu doluluk kontrolü yapar ve aşımı engeller.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Enerji Tasarruflu Çalışma:</strong>
                  <p className="text-slate-400 mt-0.5">
                    Asansörler yalnızca çağrı olduğunda hareket eder. EnergySavingScheduler boşta bekleme ve en az enerji tüketecek kabini görevlendirir.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Kabin Donanımı (Kapı, Işık, Panel):</strong>
                  <p className="text-slate-400 mt-0.5">
                    Elevator bileşimi (Composition): ElevatorDoor, FloorIndicatorLight ve ElevatorControlPanel (12 hedef butonu, aç/kapa, acil durum sinyali).
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Kat Şaft Kapıları, Ziller ve Yön Işıkları:</strong>
                  <p className="text-slate-400 mt-0.5">
                    Her katta 5 asansör boşluğunun her biri için bir FloorDoor, bir ArrivalBell (&quot;Ding!&quot;) ve DirectionSignalLight bulunur.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Her Katta 3 Set Çağrı Düğmesi:</strong>
                  <p className="text-slate-400 mt-0.5">
                    Floor sınıfı 3 adet HallCallStation nesnesini içerir; her istasyonda uygun yukarı/aşağı kat çağrı düğmeleri yer alır.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Çift Kapı Otomatik Senkronizasyonu:</strong>
                  <p className="text-slate-400 mt-0.5">
                    Asansör durduğunda hem kabin kapısı hem de kat kapısı önceden belirlenmiş süre boyunca eş zamanlı açılır ve kapanır.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Simülatör Saati ve Rastgele Yolcu Üreteci:</strong>
                  <p className="text-slate-400 mt-0.5">
                    SimulationClock zaman akışını ve olay damgalarını yönetir. RandomPassengerGenerator biniş ve iniş katlarını rastgele belirler.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
