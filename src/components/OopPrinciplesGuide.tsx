import React, { useState } from 'react';
import { 
  ShieldCheck, 
  GitFork, 
  Cpu, 
  Layers, 
  GitBranch, 
  Check, 
  Code2, 
  Award,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const OopPrinciplesGuide: React.FC = () => {
  const [activePrinciple, setActivePrinciple] = useState<'kapsulleme' | 'kalitim' | 'polimorfizm' | 'soyutlama' | 'iliskiler'>('kapsulleme');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Yazılım Mimarisi & Nesne Yönelimli Tasarım Kılavuzu</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          OOP İlkeleri ve Sınıflar Arası İlişki Durumları
        </h1>
        <p className="text-sm text-slate-300 mt-1 max-w-3xl">
          Kodluyoruz Sigorta Şirketi 12 Katlı Ofis Binası için hazırlanan bu mimari tasarım, 
          Nesne Yönelimli Programlamanın (OOP) dört temel sütunu (Kapsülleme, Kalıtım, Polimorfizm, Soyutlama) 
          ve UML ilişki türleri (Bileşim, Agregasyon, Bağımlılık) üzerine inşa edilmiştir.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActivePrinciple('kapsulleme')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activePrinciple === 'kapsulleme'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>1. Kapsülleme (Encapsulation)</span>
        </button>

        <button
          onClick={() => setActivePrinciple('kalitim')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activePrinciple === 'kalitim'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <GitFork className="w-4 h-4" />
          <span>2. Kalıtım (Inheritance)</span>
        </button>

        <button
          onClick={() => setActivePrinciple('polimorfizm')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activePrinciple === 'polimorfizm'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>3. Polimorfizm (Polymorphism)</span>
        </button>

        <button
          onClick={() => setActivePrinciple('soyutlama')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activePrinciple === 'soyutlama'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>4. Soyutlama (Abstraction)</span>
        </button>

        <button
          onClick={() => setActivePrinciple('iliskiler')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activePrinciple === 'iliskiler'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>5. Sınıf İlişkileri (UML)</span>
        </button>
      </div>

      {/* Principle 1: Kapsülleme */}
      {activePrinciple === 'kapsulleme' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-cyan-400 font-bold">İlk Temel Direk</span>
              <h2 className="text-xl font-bold text-white mt-0.5">Kapsülleme (Encapsulation & Bilgi Gizleme)</h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
              private / protected / getters / setters
            </span>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            Kapsülleme, bir nesnenin iç durumunun (state) dış müdahalelere karşı korunması, geçerli sınırların (boundary) 
            denetlenmesi ve yalnızca iyi tanımlanmış metotlar üzerinden erişilebilmesidir.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h3 className="text-sm font-bold text-cyan-300 mb-2">1. Kapasite Koruma Sınırı (~6 Yetişkin)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Problem metni: <em className="text-slate-300">&quot;Her asansörün yaklaşık altı yetişkin yolcu kapasitesi vardır.&quot;</em>
                <br /><br />
                <code className="text-cyan-400 font-mono">Elevator.passengers</code> listesi doğrudan dışarıya açılmaz (<code className="text-rose-400 font-mono">private</code>).
                Yeni bir yolcu binerken <code className="text-emerald-400 font-mono">addPassenger(p)</code> metodu çağrılır ve <code className="text-amber-300 font-mono">passengers.length &gt;= MAX_CAPACITY (6)</code> kontrolü yapılarak kapasite aşımı kesin bir dille engellenir.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h3 className="text-sm font-bold text-cyan-300 mb-2">2. Güvenlik ve Kat Sınırları (1-12 Kat)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Asansörün mevcut katı (<code className="text-cyan-400 font-mono">currentFloor</code>) ve hedef katları dışarıdan keyfi olarak değiştirilemez. 
                <code className="text-emerald-400 font-mono">addTargetFloor(floor)</code> metodu, hedefin 1 ile 12 arasında olup olmadığını doğrular. 
                Ayrıca kapılar açıkken motorun çalışması iç durum kontrolleriyle kilitlenir.
              </p>
            </div>
          </div>

          {/* Code snippet showing encapsulation */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs font-mono text-slate-400 mb-2">Örnek Kapsülleme Uygulaması (Elevator.ts):</div>
            <pre className="text-xs font-mono text-cyan-300 overflow-x-auto p-3 bg-slate-900 rounded-lg">
{`public class Elevator {
  public static readonly MAX_PASSENGER_CAPACITY: number = 6;
  private _passengers: PassengerData[] = [];
  private _currentFloor: number = 1;

  public addPassenger(passenger: PassengerData): boolean {
    // KAPSÜLLEME: İç sınır kontrolü, 6 yetişkin kuralı
    if (this._passengers.length >= Elevator.MAX_PASSENGER_CAPACITY) {
      return false; // Kapasite aşılamaz!
    }
    this._passengers.push(passenger);
    return true;
  }
}`}
            </pre>
          </div>
        </div>
      )}

      {/* Principle 2: Kalıtım */}
      {activePrinciple === 'kalitim' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-emerald-400 font-bold">İkinci Temel Direk</span>
              <h2 className="text-xl font-bold text-white mt-0.5">Kalıtım (Inheritance & Generalization)</h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
              extends / abstract class
            </span>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            Kalıtım, ortak davranış ve özniteliklere sahip sınıfların soyut bir üst sınıftan türetilerek kod tekrarının önlenmesini sağlar (DRY - Don&apos;t Repeat Yourself).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h3 className="text-sm font-bold text-emerald-300 mb-2">Buton Hiyerarşisi</h3>
              <div className="text-xs font-mono text-slate-300 space-y-1">
                <div className="font-bold text-amber-400">Button (Abstract)</div>
                <div className="pl-3 border-l-2 border-emerald-500">
                  <div>├── ElevatorButton (Hedef)</div>
                  <div>├── FloorCallButton (Çağrı)</div>
                  <div>├── DoorControlButton (Aç/Kapa)</div>
                  <div>└── EmergencyButton (Alarm)</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Tüm butonlar durum (<code className="text-cyan-400">state</code>), etiket ve <code className="text-emerald-400">press()</code> metodunu miras alır.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h3 className="text-sm font-bold text-emerald-300 mb-2">Kapı Hiyerarşisi</h3>
              <div className="text-xs font-mono text-slate-300 space-y-1">
                <div className="font-bold text-amber-400">Door (Abstract)</div>
                <div className="pl-3 border-l-2 border-emerald-500">
                  <div>├── ElevatorDoor (Kabin Kapısı)</div>
                  <div>└── FloorDoor (Kat Şaft Kapısı)</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Önceden belirlenmiş otomatik açılma süresi ve açık/kapalı durum makinesi üst sınıftan miras alınır.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h3 className="text-sm font-bold text-emerald-300 mb-2">Işık & Gösterge Hiyerarşisi</h3>
              <div className="text-xs font-mono text-slate-300 space-y-1">
                <div className="font-bold text-amber-400">Indicator (Abstract)</div>
                <div className="pl-3 border-l-2 border-emerald-500">
                  <div>├── FloorIndicatorLight</div>
                  <div>└── DirectionSignalLight</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Işığın yanma (<code className="text-cyan-400">turnOn</code>) ve sönme mantığı Indicator taban sınıfından gelir.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Principle 3: Polimorfizm */}
      {activePrinciple === 'polimorfizm' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-purple-400 font-bold">Üçüncü Temel Direk</span>
              <h2 className="text-xl font-bold text-white mt-0.5">Polimorfizm (Çok Biçimlilik & Dynamic Dispatch)</h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
              implements / override / Strategy Pattern
            </span>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            Aynı arayüz veya temel sınıfa ait metotların farklı alt sınıflarda kendilerine özgü farklı davranışlar sergileyebilmesidir.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h3 className="text-sm font-bold text-purple-300 mb-2">1. IScheduler ve Enerji Tasarruflu Dağıtım</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Problem metni: <em className="text-slate-300">&quot;Asansörler enerji tasarruflu olacak şekilde tasarlanmıştır, bu nedenle yalnızca gerektiğinde hareket ederler. Bir programlayıcı, aramanın başladığı kata gitmek için beş asansörden birini görevlendirir.&quot;</em>
                <br /><br />
                <code className="text-purple-400 font-mono">IScheduler</code> arayüzü polimorfik olarak tasarlanmıştır. Sistemde 
                <code className="text-emerald-400 font-mono">EnergySavingScheduler</code>, <code className="text-cyan-400 font-mono">NearestCarScheduler</code> veya 
                <code className="text-amber-400 font-mono">ScanScheduler</code> gibi algoritmalar çalışma anında (runtime) birbirlerinin yerine geçebilir (Strateji Tasarım Deseni).
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h3 className="text-sm font-bold text-purple-300 mb-2">2. Button.press() Polimorfizmi</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bir yolcu veya sistem herhangi bir butona bastığında tek bir arayüz çağrılır: <code className="text-purple-400 font-mono">button.press()</code>.
                Ancak basılan nesne:
                <br />• <strong className="text-white">FloorCallButton</strong> ise: Scheduler&apos;a kat çağrısı gönderir.
                <br />• <strong className="text-white">ElevatorButton</strong> ise: Kabin hedef kuyruğuna kat ekler.
                <br />• <strong className="text-white">EmergencyButton</strong> ise: Frenleri kilitler ve alarm çalar.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Principle 4: Soyutlama */}
      {activePrinciple === 'soyutlama' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-amber-400 font-bold">Dördüncü Temel Direk</span>
              <h2 className="text-xl font-bold text-white mt-0.5">Soyutlama (Abstraction)</h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
              interface / abstract class / facade
            </span>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            Sistemin kullanıcıları ve diğer katmanları için gereksiz elektromekanik ayrıntıların, kablolamanın ve düşük seviyeli 
            zamanlayıcıların gizlenerek yalnızca amaca yönelik yalın arayüzlerin sunulmasıdır.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h3 className="text-sm font-bold text-amber-300 mb-2">Building & SimulatorEngine Soyutlaması</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kullanıcı veya simülatör yalnızca <code className="text-amber-400 font-mono">requestElevator(floor, dir)</code> çağırır. 
                Motorun voltajı, halat gerilimi, mikrodenetleyici sinyalleri gibi karmaşıklıklar nesne modellerinin arkasında gizlenmiştir.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h3 className="text-sm font-bold text-amber-300 mb-2">SimulationClock Soyutlaması</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gerçek dünya zaman akışı <code className="text-amber-400 font-mono">SimulationClock</code> nesnesi ile soyutlanmış; 
                1x, 2x, 5x hızlandırma ve olay zaman damgaları (timestamping) Observer/Listener mekanizmasıyla yönetilmiştir.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Principle 5: Sınıflar Arası İlişkiler (UML Relationships) */}
      {activePrinciple === 'iliskiler' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-sky-400 font-bold">UML 2.5 İlişki Durumları</span>
              <h2 className="text-xl font-bold text-white mt-0.5">Sınıflar Arası İlişki Tipleri ve Projedeki Karşılıkları</h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-950 text-sky-300 border border-sky-800">
              Composition / Aggregation / Association
            </span>
          </div>

          <div className="space-y-4">
            {/* Composition */}
            <div className="bg-slate-950 p-4 rounded-xl border border-purple-900/60 flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-purple-950 flex items-center justify-center text-purple-400 font-mono font-bold text-base flex-shrink-0">
                ◆
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-white">Bileşim (Composition - Güçlü Sahiplik)</h3>
                  <span className="text-[10px] text-purple-400 font-mono font-semibold">Siyah Baklava (◆--)</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Parçanın yaşam döngüsü bütüne bağlıdır. Bütün yok edilirse parça da yok olur.
                </p>
                <div className="mt-2 text-xs font-mono text-purple-300 bg-slate-900 p-2 rounded border border-purple-900/40">
                  • <strong>Elevator (1) ◆-- (1) ElevatorDoor</strong> (Asansör kabini kendi kapısına sahiptir)<br />
                  • <strong>Elevator (1) ◆-- (1) ElevatorControlPanel</strong> (Kontrol paneli kabine aittir)<br />
                  • <strong>Elevator (1) ◆-- (1) FloorIndicatorLight</strong> (Kabin içi kat göstergesi)<br />
                  • <strong>Floor (1) ◆-- (5) FloorDoor</strong> (Katta her 5 asansör boşluğu için birer kapı)<br />
                  • <strong>Floor (1) ◆-- (5) ArrivalBell</strong> (Her kapı için varış zili)<br />
                  • <strong>Floor (1) ◆-- (5) DirectionSignalLight</strong> (Her kapı üzerinde sinyal lambası)<br />
                  • <strong>Floor (1) ◆-- (3) HallCallStation</strong> (Her katta 3 set çağrı düğmesi)
                </div>
              </div>
            </div>

            {/* Aggregation */}
            <div className="bg-slate-950 p-4 rounded-xl border border-blue-900/60 flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-950 flex items-center justify-center text-blue-400 font-mono font-bold text-base flex-shrink-0">
                ◇
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-white">İçerme / Agregasyon (Aggregation - Zayıf Sahiplik)</h3>
                  <span className="text-[10px] text-blue-400 font-mono font-semibold">Beyaz Baklava (◇--)</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Parçalar bütünden bağımsız olarak varlıklarını sürdürebilir.
                </p>
                <div className="mt-2 text-xs font-mono text-blue-300 bg-slate-900 p-2 rounded border border-blue-900/40">
                  • <strong>Building (1) ◇-- (12) Floor</strong> (Bina 12 kattan meydana gelir)<br />
                  • <strong>Building (1) ◇-- (5) Elevator</strong> (Bina 5 asansörü barındırır)
                </div>
              </div>
            </div>

            {/* Generalization */}
            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/60 flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 flex items-center justify-center text-emerald-400 font-mono font-bold text-base flex-shrink-0">
                ▷
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-white">Kalıtım / Genelleme (Generalization - Is-A)</h3>
                  <span className="text-[10px] text-emerald-400 font-mono font-semibold">Üçgen Ok (▷--)</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  &quot;...bir türüdür&quot; (is-a) ilişkisi.
                </p>
                <div className="mt-2 text-xs font-mono text-emerald-300 bg-slate-900 p-2 rounded border border-emerald-900/40">
                  • ElevatorButton, FloorCallButton, DoorControlButton, EmergencyButton <strong>▷-- Button</strong><br />
                  • ElevatorDoor, FloorDoor <strong>▷-- Door</strong><br />
                  • FloorIndicatorLight, DirectionSignalLight <strong>▷-- Indicator</strong>
                </div>
              </div>
            </div>

            {/* Realization & Association */}
            <div className="bg-slate-950 p-4 rounded-xl border border-cyan-900/60 flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 flex items-center justify-center text-cyan-400 font-mono font-bold text-base flex-shrink-0">
                ┄▷
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-white">Gerçekleme & Birliktelik (Realization & Association)</h3>
                  <span className="text-[10px] text-cyan-400 font-mono font-semibold">Kesikli Üçgen Ok / Düz Ok</span>
                </div>
                <div className="mt-2 text-xs font-mono text-cyan-300 bg-slate-900 p-2 rounded border border-cyan-900/40">
                  • <strong>EnergySavingScheduler ┄▷ IScheduler</strong> (Arayüz gerçekleme)<br />
                  • <strong>Elevator ──&gt; Passenger (0..6)</strong> (Asansör ve taşınan yolcular birlikteliği)<br />
                  • <strong>RandomPassengerGenerator ┄&gt; Passenger</strong> (Bağımlılık - Dependency)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
