import { Direction, ElevatorStatus, FloorStatus, PassengerData, SimulationLogEntry } from '../types/elevator';
import { soundSynth } from '../utils/audio';
import { Elevator, EnergySavingScheduler, Floor, IScheduler } from './models';

export interface ISimulatorListener {
  onUpdate: (state: SimulatorSnapshot) => void;
  onLog: (entry: SimulationLogEntry) => void;
}

export interface SimulatorSnapshot {
  elevators: ElevatorStatus[];
  floors: FloorStatus[];
  totalPassengersServed: number;
  totalWaitingPassengers: number;
  totalEnergyKwh: number;
  simulatedTimeStr: string;
  isRunning: boolean;
  speedMultiplier: number;
  activeEmergencyCount: number;
}

/**
 * Simülasyon Saati (Simulation Clock)
 * "Simülatör, gerçek zaman geçişini simüle etmek ve simülasyonda meydana gelen
 * olayları zaman damgası ve günlüğe kaydetmek için bir 'saat' kullanır."
 */
export class SimulationClock {
  private _secondsElapsed: number = 0;
  private _isRunning: boolean = false;
  private _timerId: number | null = null;
  private _speedMultiplier: number = 1;
  private _onTickCallbacks: Array<(sec: number, timestamp: string) => void> = [];

  constructor(initialHour: number = 8, initialMinute: number = 0) {
    this._secondsElapsed = initialHour * 3600 + initialMinute * 60;
  }

  public subscribe(cb: (sec: number, timestamp: string) => void) {
    this._onTickCallbacks.push(cb);
  }

  public get isRunning(): boolean {
    return this._isRunning;
  }

  public get speedMultiplier(): number {
    return this._speedMultiplier;
  }

  public setSpeedMultiplier(multiplier: number) {
    this._speedMultiplier = multiplier;
    if (this._isRunning) {
      this.pause();
      this.start();
    }
  }

  public start() {
    if (this._isRunning) return;
    this._isRunning = true;
    const intervalMs = Math.max(200, Math.floor(1000 / this._speedMultiplier));
    this._timerId = window.setInterval(() => {
      this.tick();
    }, intervalMs);
  }

  public pause() {
    this._isRunning = false;
    if (this._timerId !== null) {
      clearInterval(this._timerId);
      this._timerId = null;
    }
  }

  public tick() {
    this._secondsElapsed += 1;
    const ts = this.getFormattedTimestamp();
    for (const cb of this._onTickCallbacks) {
      cb(this._secondsElapsed, ts);
    }
  }

  public getFormattedTimestamp(): string {
    const totalSec = this._secondsElapsed % 86400;
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  public get secondsElapsed(): number {
    return this._secondsElapsed;
  }
}

/**
 * Rastgele Yolcu Üreticisi (Random Passenger Generator)
 * "Simülatör tarafından yolcu oluşturmak ve her yolcu için kalkış ve varış
 * katlarını belirlemek için rastgele bir sayı üreteci kullanılır."
 */
export class RandomPassengerGenerator {
  private static readonly NAMES = [
    'Ahmet Yılmaz', 'Ayşe Demir', 'Mehmet Kaya', 'Zeynep Çelik', 'Can Şahin',
    'Elif Öztürk', 'Burak Yıldız', 'Fatma Aydın', 'Emre Koç', 'Gamze Arslan',
    'Oğuzhan Tekin', 'Merve Doğan', 'Murat Kurt', 'Selin Aksoy', 'Kaan Polat'
  ];

  public static generate(totalFloors: number): PassengerData {
    const origin = Math.floor(Math.random() * totalFloors) + 1;
    let destination = Math.floor(Math.random() * totalFloors) + 1;
    while (destination === origin) {
      destination = Math.floor(Math.random() * totalFloors) + 1;
    }

    const randomName = this.NAMES[Math.floor(Math.random() * this.NAMES.length)];
    const weight = Math.floor(Math.random() * 35) + 55; // 55kg - 90kg

    return {
      id: 'p-' + Math.random().toString(36).substring(2, 9),
      name: randomName,
      sourceFloor: origin,
      destinationFloor: destination,
      weightKg: weight,
      waitingSinceSec: 0,
      inElevatorId: null,
      state: 'WAITING',
    };
  }
}

/**
 * Ana Simülatör ve Bina Orkestratörü
 * 12 Katlı Ofis Binası & 5 Asansör
 */
export class BuildingSimulatorEngine {
  public static readonly TOTAL_FLOORS = 12;
  public static readonly TOTAL_ELEVATORS = 5;

  private _clock: SimulationClock;
  private _scheduler: IScheduler;
  private _floors: Floor[] = [];
  private _elevators: Elevator[] = [];
  private _logs: SimulationLogEntry[] = [];
  private _totalPassengersServed: number = 0;
  private _listeners: Set<ISimulatorListener> = new Set();
  
  // Asansör duraklama zamanlayıcıları (kapı açılma süresi yönetimi)
  private _stopTimers: Map<number, number> = new Map();

  constructor() {
    this._clock = new SimulationClock(8, 30); // 08:30 mesai başlangıcı
    this._scheduler = new EnergySavingScheduler();

    // 12 Katın oluşturulması
    for (let f = 1; f <= BuildingSimulatorEngine.TOTAL_FLOORS; f++) {
      const isTop = f === BuildingSimulatorEngine.TOTAL_FLOORS;
      const isBottom = f === 1;
      const floor = new Floor(
        f,
        BuildingSimulatorEngine.TOTAL_ELEVATORS,
        isTop,
        isBottom,
        (floorNum, dir) => this.handleFloorCall(floorNum, dir)
      );
      this._floors.push(floor);
    }

    // 5 Asansörün oluşturulması
    for (let e = 1; e <= BuildingSimulatorEngine.TOTAL_ELEVATORS; e++) {
      const elevator = new Elevator(
        e,
        `Asansör #${e}`,
        BuildingSimulatorEngine.TOTAL_FLOORS,
        (targetFloor) => {
          this.log('DISPATCH', `Asansör #${e} kabin panelinden Kat ${targetFloor} seçildi.`, e, targetFloor);
        }
      );
      this._elevators.push(elevator);
    }

    // Saat döngüsüne abone ol
    this._clock.subscribe(() => {
      this.step();
    });

    this.log('SYSTEM', 'Kodluyoruz Sigorta Şirketi 12 Katlı Asansör Simülatörü Başlatıldı.');
  }

  public addListener(listener: ISimulatorListener) {
    this._listeners.add(listener);
    listener.onUpdate(this.getSnapshot());
  }

  public removeListener(listener: ISimulatorListener) {
    this._listeners.delete(listener);
  }

  private notify() {
    const snap = this.getSnapshot();
    for (const l of this._listeners) {
      l.onUpdate(snap);
    }
  }

  public log(
    category: SimulationLogEntry['category'],
    message: string,
    elevatorId?: number,
    floor?: number
  ) {
    const entry: SimulationLogEntry = {
      id: 'log-' + Math.random().toString(36).substring(2, 9),
      timestamp: this._clock.getFormattedTimestamp(),
      secondsElapsed: this._clock.secondsElapsed,
      category,
      message,
      elevatorId,
      floor,
    };
    this._logs.unshift(entry);
    if (this._logs.length > 200) {
      this._logs.pop();
    }
    for (const l of this._listeners) {
      l.onLog(entry);
    }
  }

  public get logs(): SimulationLogEntry[] {
    return this._logs;
  }

  public get clock(): SimulationClock {
    return this._clock;
  }

  /**
   * Katta bir yolcunun çağrı butonuna basması
   */
  public handleFloorCall(floorNumber: number, direction: Direction): boolean {
    const assignedElevator = this._scheduler.assignElevator(this._elevators, floorNumber, direction);

    if (assignedElevator) {
      assignedElevator.addTargetFloor(floorNumber);
      this.log(
        'DISPATCH',
        `Programlayıcı Kat ${floorNumber} (${direction === 'UP' ? 'Yukarı' : 'Aşağı'}) çağrısını ${assignedElevator.name}'e atadı. (Mevcut kat: ${assignedElevator.currentFloor})`,
        assignedElevator.id,
        floorNumber
      );
      this.notify();
      return true;
    } else {
      this.log('DISPATCH', `Kat ${floorNumber} çağrısı için şu an uygun boş/çalışan asansör bulunamadı (Tümü dolu veya acil durumda).`, undefined, floorNumber);
      this.notify();
      return false;
    }
  }

  /**
   * Rastgele yolcu oluşturma
   */
  public spawnRandomPassenger(sourceFloor?: number, destFloor?: number): PassengerData {
    let p: PassengerData;
    if (sourceFloor && destFloor && sourceFloor !== destFloor) {
      p = {
        id: 'p-' + Math.random().toString(36).substring(2, 9),
        name: RandomPassengerGenerator.generate(12).name,
        sourceFloor,
        destinationFloor: destFloor,
        weightKg: 72,
        waitingSinceSec: 0,
        inElevatorId: null,
        state: 'WAITING',
      };
    } else {
      p = RandomPassengerGenerator.generate(BuildingSimulatorEngine.TOTAL_FLOORS);
    }

    const floor = this._floors[p.sourceFloor - 1];
    floor.addWaitingPassenger(p);

    const dir: Direction = p.destinationFloor > p.sourceFloor ? 'UP' : 'DOWN';
    // Katta çağrı butonuna basılır
    const station = floor.callStations[0];
    if (dir === 'UP' && station.upButton) {
      station.upButton.press();
    } else if (dir === 'DOWN' && station.downButton) {
      station.downButton.press();
    }

    this.log(
      'PASSENGER',
      `Yeni yolcu: ${p.name} (Kat ${p.sourceFloor} -> Kat ${p.destinationFloor}, ${p.weightKg} kg) çağrı düğmesine bastı.`,
      undefined,
      p.sourceFloor
    );

    this.notify();
    return p;
  }

  /**
   * Simülasyonun 1 Saniyelik Adımı (Step)
   */
  public step() {
    for (const elevator of this._elevators) {
      if (elevator.isEmergency) {
        continue;
      }

      // 1. Kapı açık bekleme sayacı kontrolü
      const currentStopTimer = this._stopTimers.get(elevator.id) || 0;
      if (currentStopTimer > 0) {
        const remaining = currentStopTimer - 1;
        this._stopTimers.set(elevator.id, remaining);

        if (remaining === 1) {
          // Kapılar kapanmaya başlıyor
          elevator.setDoorState('CLOSING');
          const floorObj = this._floors[elevator.currentFloor - 1];
          floorObj?.getDoor(elevator.id)?.setState('CLOSING');
          soundSynth.playDoorSound();
          this.log('DOOR', `${elevator.name} ve Kat ${elevator.currentFloor} kapıları otomatik kapanıyor.`, elevator.id, elevator.currentFloor);
        } else if (remaining === 0) {
          // Kapılar kapandı
          elevator.setDoorState('CLOSED');
          const floorObj = this._floors[elevator.currentFloor - 1];
          floorObj?.getDoor(elevator.id)?.setState('CLOSED');
          floorObj?.getSignalLight(elevator.id)?.turnOff();
          this._stopTimers.delete(elevator.id);
          elevator.determineNextState();
        }
        continue;
      }

      // 2. Asansör hareketi
      if (elevator.state === 'MOVING_UP' || elevator.state === 'MOVING_DOWN') {
        const arrived = elevator.stepMovement();

        if (arrived) {
          this.handleElevatorArrival(elevator);
        } else {
          // Katlar arası geçişte sonraki durumu kontrol et
          elevator.determineNextState();
        }
      } else if (elevator.state === 'IDLE' && elevator.targetFloors.length > 0) {
        elevator.determineNextState();
      }
    }

    this.notify();
  }

  /**
   * Asansörün kata varması:
   * "Bir asansörün bir kata varması, dış asansör kapısının üzerindeki gösterge lambasının
   * yakılması ve kat zilinin çalmasıyla belirtilir. Bir asansör bir katta durduğunda,
   * her iki kapı grubu da önceden belirlenmiş bir süre boyunca otomatik olarak açılarak
   * yolcuların asansöre girip çıkmalarına izin verir."
   */
  private handleElevatorArrival(elevator: Elevator) {
    const floorIndex = elevator.currentFloor - 1;
    const floor = this._floors[floorIndex];
    if (!floor) return;

    // 1. Kat kapısı üzerindeki sinyal lambasının yakılması
    const signalLight = floor.getSignalLight(elevator.id);
    if (signalLight) {
      signalLight.illuminateDirection(elevator.direction);
    }

    // 2. Kat zilinin çalması
    const bell = floor.getArrivalBell(elevator.id);
    if (bell) {
      bell.ring();
    }
    soundSynth.playArrivalBell();

    this.log(
      'ARRIVAL',
      `🔔 ${elevator.name} Kat ${elevator.currentFloor}'e ulaştı! Dış sinyal ışığı yandı ve kat zili çaldı.`,
      elevator.id,
      elevator.currentFloor
    );

    // 3. Her iki kapı grubunun otomatik senkronize açılması
    elevator.setDoorState('OPEN');
    elevator.setState('DOORS_OPEN');
    floor.getDoor(elevator.id)?.open();
    soundSynth.playDoorSound();

    this.log(
      'DOOR',
      `${elevator.name} kabin kapısı ve Kat ${elevator.currentFloor} şaft kapısı senkronize açıldı (3.5 sn bekleme).`,
      elevator.id,
      elevator.currentFloor
    );

    // 4. Hedefi bu kat olan yolcuların inmesi
    const alightedPassengers = elevator.removePassengersForCurrentFloor();
    if (alightedPassengers.length > 0) {
      this._totalPassengersServed += alightedPassengers.length;
      for (const p of alightedPassengers) {
        p.state = 'ARRIVED';
      }
      this.log(
        'PASSENGER',
        `${alightedPassengers.length} yolcu (${alightedPassengers.map(p => p.name).join(', ')}) Kat ${elevator.currentFloor}'de indi.`,
        elevator.id,
        elevator.currentFloor
      );
    }

    // 5. Bu katta bekleyen yolcuların asansöre binmesi (kapasite: 6 yetişkin)
    const waitingAtFloor = floor.waitingPassengers;
    const toBoard: PassengerData[] = [];

    for (const passenger of waitingAtFloor) {
      if (elevator.isFull) break;

      // Asansörün hareket yönü ile yolcunun gitmek istediği yön uyumu kontrolü (veya asansör boş ise)
      const passengerDir = passenger.destinationFloor > elevator.currentFloor ? 'UP' : 'DOWN';
      const canBoard = elevator.passengerCount === 0 || elevator.direction === 'IDLE' || elevator.direction === passengerDir;

      if (canBoard) {
        toBoard.push(passenger);
      }
    }

    for (const p of toBoard) {
      floor.removeWaitingPassenger(p.id);
      p.state = 'TRAVELLING';
      p.inElevatorId = elevator.id;
      elevator.addPassenger(p);
      this.log(
        'PASSENGER',
        `${p.name} ${elevator.name}'e bindi ve kabin panelinde Kat ${p.destinationFloor} düğmesine bastı. (Yolcu: ${elevator.passengerCount}/${Elevator.MAX_PASSENGER_CAPACITY})`,
        elevator.id,
        elevator.currentFloor
      );
    }

    // Çağrı butonlarını sıfırla
    floor.resetCallStationButtons(elevator.direction);

    // Önceden belirlenmiş süre boyunca açık kalma (3 saniye bekleme sayacı)
    this._stopTimers.set(elevator.id, 3);
  }

  public triggerElevatorEmergency(elevatorId: number) {
    const el = this._elevators.find(e => e.id === elevatorId);
    if (el) {
      el.toggleEmergency();
      if (el.isEmergency) {
        soundSynth.playEmergencyAlarm();
        this.log('EMERGENCY', `🚨 ${el.name} ACİL DURUM BUTONUNA BASILDI! Asansör acil duruşa geçti.`, el.id, el.currentFloor);
      } else {
        this.log('EMERGENCY', `✅ ${el.name} acil durum sıfırlandı. Asansör tekrar normal işletimde.`, el.id, el.currentFloor);
      }
      this.notify();
    }
  }

  public pressCabinButton(elevatorId: number, targetFloor: number) {
    const el = this._elevators.find(e => e.id === elevatorId);
    if (el) {
      soundSynth.playButtonClick();
      el.addTargetFloor(targetFloor);
      this.log('DISPATCH', `${el.name} kabin içi panelden Kat ${targetFloor} basıldı.`, el.id, targetFloor);
      this.notify();
    }
  }

  public manualDoorAction(elevatorId: number, action: 'OPEN' | 'CLOSE') {
    const el = this._elevators.find(e => e.id === elevatorId);
    if (el) {
      soundSynth.playButtonClick();
      if (action === 'OPEN') {
        el.controlPanel.openDoorButton.press();
        this._stopTimers.set(elevatorId, 4); // kapı açık süresini uzat
        this.log('DOOR', `${el.name} Kapı Aç (<|>) düğmesine basıldı. Bekleme süresi uzatıldı.`, el.id, el.currentFloor);
      } else {
        el.controlPanel.closeDoorButton.press();
        this._stopTimers.set(elevatorId, 1); // hemen kapatmaya başla
        this.log('DOOR', `${el.name} Kapı Kapa (>|<) düğmesine basıldı. Kapılar hemen kapanıyor.`, el.id, el.currentFloor);
      }
      this.notify();
    }
  }

  public getSnapshot(): SimulatorSnapshot {
    const elevatorStatuses: ElevatorStatus[] = this._elevators.map(e => ({
      id: e.id,
      name: e.name,
      currentFloor: e.currentFloor,
      targetFloors: e.targetFloors,
      direction: e.direction,
      state: e.state,
      doorState: e.door.state,
      passengers: e.passengers,
      maxCapacity: Elevator.MAX_PASSENGER_CAPACITY,
      isEmergencyActive: e.isEmergency,
      totalTrips: e.totalTrips,
      energyScoreKwh: Number(e.totalEnergyKwh.toFixed(2)),
      idleDurationSec: e.idleTimeSeconds,
      currentWeightKg: e.currentTotalWeightKg,
    }));

    const floorStatuses: FloorStatus[] = this._floors.map(f => ({
      floorNumber: f.floorNumber,
      name: f.name,
      waitingPassengers: f.waitingPassengers,
      callPanels: f.callStations.map(cs => ({
        id: cs.stationId,
        name: `İstasyon ${cs.stationId}`,
        upPressed: cs.upButton?.state === 'ACTIVE',
        downPressed: cs.downButton?.state === 'ACTIVE',
      })),
      shaftDoors: this._elevators.map(e => ({
        elevatorId: e.id,
        doorState: f.getDoor(e.id)?.state || 'CLOSED',
        signalLightDirection: f.getSignalLight(e.id)?.indicatedDirection || null,
        bellRinging: f.getArrivalBell(e.id)?.isRinging || false,
      })),
    }));

    const totalWaiting = this._floors.reduce((sum, f) => sum + f.waitingPassengers.length, 0);
    const totalEnergy = this._elevators.reduce((sum, e) => sum + e.totalEnergyKwh, 0);
    const emergencyCount = this._elevators.filter(e => e.isEmergency).length;

    return {
      elevators: elevatorStatuses,
      floors: floorStatuses,
      totalPassengersServed: this._totalPassengersServed,
      totalWaitingPassengers: totalWaiting,
      totalEnergyKwh: Number(totalEnergy.toFixed(2)),
      simulatedTimeStr: this._clock.getFormattedTimestamp(),
      isRunning: this._clock.isRunning,
      speedMultiplier: this._clock.speedMultiplier,
      activeEmergencyCount: emergencyCount,
    };
  }

  public clearAll() {
    this._logs = [];
    this._totalPassengersServed = 0;
    this._stopTimers.clear();
    for (const f of this._floors) {
      f.clearWaitingPassengers();
    }
    this.log('SYSTEM', 'Simülasyon sıfırlandı.');
    this.notify();
  }
}

// Tekil simülatör örneği
export const simulatorEngine = new BuildingSimulatorEngine();
