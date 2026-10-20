import React from 'react';
import { 
  X, 
  AlertTriangle, 
  ChevronsUp, 
  ChevronsDown, 
  DoorOpen, 
  DoorClosed, 
  User, 
  Zap, 
  Clock, 
  Hash,
  ShieldCheck,
  Power
} from 'lucide-react';
import { ElevatorStatus } from '../types/elevator';
import { simulatorEngine } from '../core/simulator';

interface CabinInspectorModalProps {
  elevator: ElevatorStatus | null;
  onClose: () => void;
}

export const CabinInspectorModal: React.FC<CabinInspectorModalProps> = ({
  elevator,
  onClose,
}) => {
  if (!elevator) return null;

  const handleSelectFloor = (targetFloor: number) => {
    simulatorEngine.pressCabinButton(elevator.id, targetFloor);
  };

  const handleDoorAction = (action: 'OPEN' | 'CLOSE') => {
    simulatorEngine.manualDoorAction(elevator.id, action);
  };

  const handleEmergencyToggle = () => {
    simulatorEngine.triggerElevatorEmergency(elevator.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabin Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl border flex items-center justify-center ${
              elevator.isEmergencyActive 
                ? 'bg-rose-950/80 border-rose-700 text-rose-400 animate-pulse'
                : 'bg-cyan-950/80 border-cyan-800 text-cyan-400'
            }`}>
              {elevator.isEmergencyActive ? (
                <AlertTriangle className="w-6 h-6" />
              ) : (
                <Hash className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-semibold">
                  Kabin İçi Teftiş & Kontrol
                </span>
                {elevator.isEmergencyActive && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white uppercase animate-bounce">
                    Acil Durum Aktif
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black text-white">
                {elevator.name} (Şaft #{elevator.id})
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Cabin Interior Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Cabin Ceiling Display & Indicator Light */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden">
            <div className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-1">
              FloorIndicatorLight (Kabin İçi Kat Gösterge Işığı)
            </div>
            <div className="flex items-center space-x-4">
              <span className={`text-4xl font-extrabold font-mono transition-transform ${
                elevator.direction === 'UP' ? 'text-emerald-400 animate-bounce' :
                elevator.direction === 'DOWN' ? 'text-amber-400 animate-bounce' : 'text-slate-600'
              }`}>
                {elevator.direction === 'UP' ? '▲' : elevator.direction === 'DOWN' ? '▼' : '•'}
              </span>
              <div className="text-5xl font-black font-mono text-cyan-400 tracking-tight">
                {elevator.currentFloor}
              </div>
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                . KAT
              </span>
            </div>

            <div className="mt-2 flex items-center space-x-2 text-xs">
              <span className="text-slate-400">Durum:</span>
              <span className={`font-semibold uppercase px-2 py-0.5 rounded text-[10px] ${
                elevator.state === 'IDLE' ? 'bg-slate-800 text-slate-300' :
                elevator.state === 'DOORS_OPEN' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                elevator.state === 'EMERGENCY_STOP' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                'bg-cyan-950 text-cyan-300 border border-cyan-800'
              }`}>
                {elevator.state}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">Kapı:</span>
              <span className="font-semibold text-white uppercase text-[10px]">
                {elevator.doorState}
              </span>
            </div>
          </div>

          {/* Elevator Control Panel (Bileşim - Composition) */}
          <div className="bg-gradient-to-b from-slate-950 to-slate-900 p-5 rounded-2xl border border-slate-700/80 shadow-xl">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                ElevatorControlPanel (Kabin Kontrol Paneli)
              </h3>
              <span className="text-[10px] text-cyan-400 font-mono">
                12 Hedef Düğmesi + Fonksiyon Butonları
              </span>
            </div>

            {/* 12 Destination Floor Buttons (Grid 3x4 or 4x3) */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 mb-4">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((floor) => {
                const isSelected = elevator.targetFloors.includes(floor);
                const isCurrent = elevator.currentFloor === floor;

                return (
                  <button
                    key={floor}
                    onClick={() => handleSelectFloor(floor)}
                    disabled={elevator.isEmergencyActive}
                    className={`h-12 rounded-xl font-mono text-sm font-bold flex flex-col items-center justify-center transition-all duration-150 border active:scale-95 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/30 font-black'
                        : isCurrent
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                    } ${elevator.isEmergencyActive ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <span>{floor}</span>
                    <span className="text-[9px] font-sans font-normal opacity-70">
                      {isCurrent ? 'Burada' : isSelected ? 'Kayıtlı' : 'Kat'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Special Function Buttons: Door Open, Door Close, Emergency */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-800">
              <button
                onClick={() => handleDoorAction('OPEN')}
                disabled={elevator.isEmergencyActive || elevator.state.startsWith('MOVING')}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 disabled:opacity-40 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1.5 border border-slate-700 transition-all"
              >
                <DoorOpen className="w-4 h-4 text-emerald-400" />
                <span>&lt;|&gt; Kapı Aç</span>
              </button>

              <button
                onClick={() => handleDoorAction('CLOSE')}
                disabled={elevator.isEmergencyActive || elevator.state.startsWith('MOVING')}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 disabled:opacity-40 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1.5 border border-slate-700 transition-all"
              >
                <DoorClosed className="w-4 h-4 text-amber-400" />
                <span>&gt;|&lt; Kapı Kapa</span>
              </button>

              <button
                onClick={handleEmergencyToggle}
                className={`py-2.5 px-3 rounded-xl active:scale-95 text-xs font-bold flex items-center justify-center space-x-1.5 border transition-all shadow-md ${
                  elevator.isEmergencyActive
                    ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-400 shadow-rose-600/40 animate-pulse'
                    : 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border-rose-800'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>{elevator.isEmergencyActive ? 'Acil Durumu Sıfırla' : 'Acil Durum (ALARM)'}</span>
              </button>
            </div>
          </div>

          {/* Passenger Capacity & Current Occupants */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Kabindeki Yolcular ({elevator.passengers.length} / {elevator.maxCapacity})
                </h4>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                elevator.passengers.length >= elevator.maxCapacity
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {elevator.passengers.length >= elevator.maxCapacity ? 'Kapasite Dolu (Maks. 6)' : 'Kapasite Uygun'}
              </span>
            </div>

            {/* Capacity Bar */}
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full transition-all duration-300 ${
                  elevator.passengers.length >= elevator.maxCapacity
                    ? 'bg-rose-500'
                    : elevator.passengers.length >= 4
                    ? 'bg-amber-500'
                    : 'bg-cyan-500'
                }`}
                style={{ width: `${(elevator.passengers.length / elevator.maxCapacity) * 100}%` }}
              />
            </div>

            {/* Passenger List */}
            {elevator.passengers.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-2 italic">
                Kabin şu anda boş. Yolcular çağrı yapıldığında binecektir.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {elevator.passengers.map((p) => (
                  <div 
                    key={p.id}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white">{p.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {p.sourceFloor}. Kattan bindi • {p.weightKg} kg
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[11px] font-mono font-bold">
                        → Kat {p.destinationFloor}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Energy Efficiency & System Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex flex-col items-center text-center">
              <Zap className="w-4 h-4 text-amber-400 mb-1" />
              <span className="text-[10px] text-slate-400 uppercase">Tüketilen Enerji</span>
              <span className="text-sm font-bold font-mono text-white mt-0.5">
                {elevator.energyScoreKwh} kWh
              </span>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex flex-col items-center text-center">
              <Clock className="w-4 h-4 text-emerald-400 mb-1" />
              <span className="text-[10px] text-slate-400 uppercase">Bekleme (Idle)</span>
              <span className="text-sm font-bold font-mono text-white mt-0.5">
                {elevator.idleDurationSec} sn
              </span>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex flex-col items-center text-center">
              <ChevronsUp className="w-4 h-4 text-cyan-400 mb-1" />
              <span className="text-[10px] text-slate-400 uppercase">Toplam Sefer</span>
              <span className="text-sm font-bold font-mono text-white mt-0.5">
                {elevator.totalTrips} Sefer
              </span>
            </div>
          </div>
        </div>

        {/* Cabin Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-500">
          <span>Kodluyoruz Sigorta Şirketi • 12 Katlı Ofis Binası Simülatörü</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};
