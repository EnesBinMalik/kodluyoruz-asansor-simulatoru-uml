import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  UserPlus, 
  FastForward, 
  Bell, 
  ChevronUp, 
  ChevronDown, 
  SlidersHorizontal, 
  Sparkles, 
  Users, 
  Zap, 
  AlertTriangle, 
  Maximize2,
  ListFilter,
  CheckCircle2,
  Compass,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { 
  Direction, 
  ElevatorStatus, 
  FloorStatus, 
  SimulationLogEntry 
} from '../types/elevator';
import { simulatorEngine, SimulatorSnapshot } from '../core/simulator';
import { CabinInspectorModal } from './CabinInspectorModal';
import { soundSynth } from '../utils/audio';

export const BuildingSimulator: React.FC = () => {
  const [snapshot, setSnapshot] = useState<SimulatorSnapshot>(() => simulatorEngine.getSnapshot());
  const [logs, setLogs] = useState<SimulationLogEntry[]>(() => simulatorEngine.logs);
  const [inspectedElevatorId, setInspectedElevatorId] = useState<number | null>(null);
  const [selectedLogFilter, setSelectedLogFilter] = useState<string>('ALL');

  // Manuel yolcu modal state
  const [showManualSpawnModal, setShowManualSpawnModal] = useState(false);
  const [manualSourceFloor, setManualSourceFloor] = useState<number>(1);
  const [manualDestFloor, setManualDestFloor] = useState<number>(12);
  const [manualPassengerName, setManualPassengerName] = useState<string>('Mehmet Şahin');

  useEffect(() => {
    const listener = {
      onUpdate: (newSnap: SimulatorSnapshot) => setSnapshot(newSnap),
      onLog: (newLog: SimulationLogEntry) => {
        setLogs(prev => [newLog, ...prev.slice(0, 150)]);
      }
    };

    simulatorEngine.addListener(listener);
    return () => simulatorEngine.removeListener(listener);
  }, []);

  const handlePlayPause = () => {
    if (snapshot.isRunning) {
      simulatorEngine.clock.pause();
    } else {
      simulatorEngine.clock.start();
    }
    setSnapshot(simulatorEngine.getSnapshot());
  };

  const handleStepOnce = () => {
    simulatorEngine.clock.tick();
    setSnapshot(simulatorEngine.getSnapshot());
  };

  const handleSpeedChange = (mult: number) => {
    simulatorEngine.clock.setSpeedMultiplier(mult);
    setSnapshot(simulatorEngine.getSnapshot());
  };

  const handleReset = () => {
    simulatorEngine.clearAll();
    setSnapshot(simulatorEngine.getSnapshot());
    setLogs([]);
  };

  const handleFloorCall = (floorNumber: number, direction: Direction) => {
    soundSynth.playButtonClick();
    simulatorEngine.handleFloorCall(floorNumber, direction);
  };

  const handleCreateManualPassenger = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualSourceFloor === manualDestFloor) {
      alert('Kalkış ve varış katı aynı olamaz!');
      return;
    }
    simulatorEngine.spawnRandomPassenger(manualSourceFloor, manualDestFloor);
    setShowManualSpawnModal(false);
  };

  const inspectedElevator = snapshot.elevators.find(e => e.id === inspectedElevatorId) || null;

  const filteredLogs = logs.filter(log => {
    if (selectedLogFilter === 'ALL') return true;
    return log.category === selectedLogFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls & Simulation Status Bar */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Simulation Clock & Execution Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${snapshot.isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-500">Simülasyon Saati</div>
              <div className="text-xl font-black font-mono text-cyan-400">
                {snapshot.simulatedTimeStr}
              </div>
            </div>
          </div>

          <button
            onClick={handlePlayPause}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-md active:scale-95 ${
              snapshot.isRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
            }`}
          >
            {snapshot.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{snapshot.isRunning ? 'Duraklat' : 'Simülasyonu Başlat'}</span>
          </button>

          <button
            onClick={handleStepOnce}
            title="1 Adım İlerle (1 sn)"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1"
          >
            <FastForward className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">+1 Adım</span>
          </button>

          {/* Speed selector */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                onClick={() => handleSpeedChange(spd)}
                className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg transition-all ${
                  snapshot.speedMultiplier === spd
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <button
            onClick={handleReset}
            title="Simülasyonu Sıfırla"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Passenger Spawners & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => simulatorEngine.spawnRandomPassenger()}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-cyan-600/20 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Rastgele Yolcu Üret</span>
          </button>

          <button
            onClick={() => setShowManualSpawnModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition-colors"
          >
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span>Manuel Yolcu Ekle</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Taşınan Yolcu</div>
            <div className="text-xl font-bold font-mono text-white">
              {snapshot.totalPassengersServed} kişi
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-amber-950/80 text-amber-400 border border-amber-800">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Bekleyen Yolcular</div>
            <div className="text-xl font-bold font-mono text-amber-300">
              {snapshot.totalWaitingPassengers} kişi
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-800">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Enerji Tüketimi</div>
            <div className="text-xl font-bold font-mono text-cyan-300">
              {snapshot.totalEnergyKwh} kWh
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center space-x-3">
          <div className={`p-2.5 rounded-lg border ${
            snapshot.activeEmergencyCount > 0 
              ? 'bg-rose-950 text-rose-400 border-rose-800 animate-pulse'
              : 'bg-slate-950 text-slate-400 border-slate-800'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Acil Durum</div>
            <div className="text-xl font-bold font-mono text-white">
              {snapshot.activeEmergencyCount > 0 ? `${snapshot.activeEmergencyCount} Alarm!` : 'Normal'}
            </div>
          </div>
        </div>
      </div>

      {/* Main 12-Floor Building Cross Section Grid */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Shaft Headers */}
        <div className="grid grid-cols-12 bg-slate-900/90 border-b border-slate-800 text-xs font-semibold py-2.5 px-3">
          <div className="col-span-3 sm:col-span-2 text-slate-400 uppercase font-mono">
            Bina Katı / Çağrı
          </div>
          <div className="col-span-9 sm:col-span-10 grid grid-cols-5 gap-1.5 text-center">
            {snapshot.elevators.map((el) => (
              <div 
                key={el.id}
                onClick={() => setInspectedElevatorId(el.id)}
                className="bg-slate-950 hover:bg-slate-850 p-1.5 rounded-lg border border-slate-800 cursor-pointer transition-colors flex items-center justify-between"
              >
                <div className="text-left">
                  <div className="text-cyan-400 font-bold text-[11px] truncate">
                    {el.name}
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono">
                    {el.passengers.length}/{el.maxCapacity} Yolcu
                  </div>
                </div>
                <Maximize2 className="w-3 h-3 text-slate-400 hover:text-white" />
              </div>
            ))}
          </div>
        </div>

        {/* 12 Floors Rows: Top to Bottom (Kat 12 down to Kat 1) */}
        <div className="divide-y divide-slate-800/60 max-h-[640px] overflow-y-auto">
          {snapshot.floors.slice().reverse().map((floor) => {
            return (
              <div 
                key={floor.floorNumber}
                className="grid grid-cols-12 py-2 px-3 hover:bg-slate-900/40 transition-colors items-center text-xs"
              >
                {/* Floor Label & 3-set Call Station Buttons */}
                <div className="col-span-3 sm:col-span-2 flex flex-col justify-center pr-2 border-r border-slate-800/80">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono font-bold text-white text-sm">
                      Kat {floor.floorNumber}
                    </span>
                    {floor.waitingPassengers.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono">
                        {floor.waitingPassengers.length} bekleyen
                      </span>
                    )}
                  </div>

                  {/* 3 Call Stations Indicator */}
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      {floor.floorNumber < 12 && (
                        <button
                          onClick={() => handleFloorCall(floor.floorNumber, 'UP')}
                          title="Yukarı Çağrı Düğmesi"
                          className="p-1 rounded bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white transition-colors active:scale-90"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                      )}
                      {floor.floorNumber > 1 && (
                        <button
                          onClick={() => handleFloorCall(floor.floorNumber, 'DOWN')}
                          title="Aşağı Çağrı Düğmesi"
                          className="p-1 rounded bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white transition-colors active:scale-90"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-500 font-sans hidden sm:inline">
                      (3 İstasyon)
                    </span>
                  </div>

                  {/* Waiting passengers preview pills */}
                  {floor.waitingPassengers.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {floor.waitingPassengers.slice(0, 2).map((p) => (
                        <span 
                          key={p.id}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 truncate max-w-[80px]"
                          title={`${p.name} (Hedef Kat: ${p.destinationFloor})`}
                        >
                          {p.name.split(' ')[0]} → {p.destinationFloor}
                        </span>
                      ))}
                      {floor.waitingPassengers.length > 2 && (
                        <span className="text-[9px] text-slate-500">
                          +{floor.waitingPassengers.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* 5 Elevator Shaft Cells on this Floor */}
                <div className="col-span-9 sm:col-span-10 grid grid-cols-5 gap-1.5 pl-2">
                  {snapshot.elevators.map((elevator) => {
                    const isCarHere = elevator.currentFloor === floor.floorNumber;
                    const shaftDoor = floor.shaftDoors.find(d => d.elevatorId === elevator.id);
                    const isBellRinging = shaftDoor?.bellRinging;
                    const signalDir = shaftDoor?.signalLightDirection;

                    return (
                      <div
                        key={elevator.id}
                        className={`min-h-[48px] rounded-lg border p-1.5 relative transition-all duration-300 flex flex-col justify-between ${
                          isCarHere
                            ? elevator.isEmergencyActive
                              ? 'bg-rose-950/80 border-rose-600 shadow-lg shadow-rose-950'
                              : 'bg-cyan-950/70 border-cyan-500/80 shadow-md shadow-cyan-950/50'
                            : 'bg-slate-900/30 border-slate-800/50 hover:bg-slate-900/50'
                        }`}
                      >
                        {/* Top Indicator: Direction Light & Arrival Bell */}
                        <div className="flex items-center justify-between text-[10px]">
                          {/* Direction Signal Light */}
                          <div className="flex items-center space-x-1">
                            {signalDir === 'UP' && (
                              <span className="text-emerald-400 font-bold flex items-center animate-bounce">
                                <ArrowUp className="w-3 h-3 inline" />
                              </span>
                            )}
                            {signalDir === 'DOWN' && (
                              <span className="text-amber-400 font-bold flex items-center animate-bounce">
                                <ArrowDown className="w-3 h-3 inline" />
                              </span>
                            )}
                            {!signalDir && (
                              <span className="text-slate-700 font-mono text-[9px]">•</span>
                            )}
                          </div>

                          {/* Arrival Bell icon with animation */}
                          {isBellRinging && (
                            <span className="text-amber-300 animate-bounce flex items-center space-x-0.5">
                              <Bell className="w-3 h-3 fill-amber-300" />
                              <span className="text-[9px] font-bold">Ding!</span>
                            </span>
                          )}
                        </div>

                        {/* Middle/Bottom: If Car is at this floor, show Elevator Cabin details */}
                        {isCarHere ? (
                          <div 
                            onClick={() => setInspectedElevatorId(elevator.id)}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-white font-mono flex items-center space-x-1">
                                <span>{elevator.name}</span>
                                {elevator.direction === 'UP' && <span className="text-emerald-400 text-[10px]">▲</span>}
                                {elevator.direction === 'DOWN' && <span className="text-amber-400 text-[10px]">▼</span>}
                              </span>
                              <span className={`text-[9px] font-semibold px-1 py-0.2 rounded uppercase ${
                                elevator.doorState === 'OPEN' 
                                  ? 'bg-emerald-500 text-slate-950 font-bold' 
                                  : 'bg-slate-800 text-slate-300'
                              }`}>
                                {elevator.doorState}
                              </span>
                            </div>

                            <div className="flex items-center justify-between mt-1 text-[9px] text-slate-400">
                              <span>👥 {elevator.passengers.length}/{elevator.maxCapacity}</span>
                              <span className="text-cyan-300 font-mono">{elevator.energyScoreKwh} kWh</span>
                            </div>
                          </div>
                        ) : (
                          // Shaft without car
                          <div className="flex items-center justify-center h-full text-[10px] text-slate-700 font-mono">
                            {elevator.targetFloors.includes(floor.floorNumber) ? (
                              <span className="text-amber-400/80 font-semibold text-[9px] bg-amber-950/40 px-1 py-0.5 rounded border border-amber-900/40">
                                Hedef
                              </span>
                            ) : (
                              '| |'
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Event Log Stream (Problem: Simülatör meydana gelen olayları zaman damgası ve günlüğe kaydeder) */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <ListFilter className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Simülasyon Zaman Damgalı Olay Günlüğü (Event Logger)
            </h3>
            <span className="text-xs text-slate-500 font-mono">({filteredLogs.length} Kayıt)</span>
          </div>

          {/* Log Category Filter */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
            {['ALL', 'DISPATCH', 'ARRIVAL', 'DOOR', 'PASSENGER', 'EMERGENCY'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedLogFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  selectedLogFilter === cat
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'ALL' ? 'Tümü' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Log Entries Container */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono text-xs max-h-56 overflow-y-auto space-y-1.5">
          {filteredLogs.length === 0 ? (
            <div className="text-slate-600 italic py-4 text-center">
              Henüz bir olay kaydedilmedi. Simülasyonu başlatın veya yolcu çağrısı yapın.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const badgeColor = 
                log.category === 'ARRIVAL' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                log.category === 'DISPATCH' ? 'bg-cyan-950 text-cyan-300 border-cyan-800' :
                log.category === 'DOOR' ? 'bg-purple-950 text-purple-300 border-purple-800' :
                log.category === 'PASSENGER' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                log.category === 'EMERGENCY' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                'bg-slate-800 text-slate-300 border-slate-700';

              return (
                <div 
                  key={log.id} 
                  className="p-1.5 rounded bg-slate-900/60 hover:bg-slate-900 border border-slate-800/40 flex items-start space-x-2"
                >
                  <span className="text-slate-500 text-[10px] whitespace-nowrap">
                    [{log.timestamp}]
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase whitespace-nowrap ${badgeColor}`}>
                    {log.category}
                  </span>
                  <span className="text-slate-300 leading-tight">
                    {log.message}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Manuel Yolcu Oluşturma Modal */}
      {showManualSpawnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div 
            className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-cyan-400" />
                <span>Manuel Yolcu Ekle & Çağır</span>
              </h3>
              <button 
                onClick={() => setShowManualSpawnModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualPassenger} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Yolcu Adı Soyadı
                </label>
                <input
                  type="text"
                  value={manualPassengerName}
                  onChange={(e) => setManualPassengerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Kalkış Katı (1-12)
                  </label>
                  <select
                    value={manualSourceFloor}
                    onChange={(e) => setManualSourceFloor(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((f) => (
                      <option key={f} value={f}>Kat {f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Hedef Kat (1-12)
                  </label>
                  <select
                    value={manualDestFloor}
                    onChange={(e) => setManualDestFloor(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((f) => (
                      <option key={f} value={f} disabled={f === manualSourceFloor}>
                        Kat {f} {f === manualSourceFloor ? '(Aynı Kat)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowManualSpawnModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md"
                >
                  Yolcuyu Kat İstasyonuna Çağır
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Elevator Cabin Inspector Modal */}
      {inspectedElevator && (
        <CabinInspectorModal
          elevator={inspectedElevator}
          onClose={() => setInspectedElevatorId(null)}
        />
      )}
    </div>
  );
};
