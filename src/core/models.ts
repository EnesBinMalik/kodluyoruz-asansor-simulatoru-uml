import { ButtonState, Direction, DoorState, ElevatorState, PassengerData } from '../types/elevator';

/**
 * =========================================================================
 * SOYUTLAMA (ABSTRACTION) & KALITIM (INHERITANCE): BUTON HİYERARŞİSİ
 * =========================================================================
 */

/**
 * Soyut Temel Buton Sınıfı (Abstract Base Class)
 * Tüm buton tiplerinin ortak durumunu ve davranışını soyutlar.
 */
export abstract class Button {
  protected _state: ButtonState = 'INACTIVE';
  protected _label: string;

  constructor(label: string) {
    this._label = label;
  }

  public get state(): ButtonState {
    return this._state;
  }

  public get label(): string {
    return this._label;
  }

  public activate(): void {
    this._state = 'ACTIVE';
  }

  public deactivate(): void {
    this._state = 'INACTIVE';
  }

  /**
   * Polimorfik metot: Her buton tipi basıldığında kendi özel mantığını çalıştırır.
   */
  public abstract press(): void;
}

/**
 * Asansör Kabin İçi Kat Hedef Düğmesi
 * Kalıtım: Button sınıfından türer.
 */
export class ElevatorButton extends Button {
  private readonly _targetFloor: number;
  private _onPressCallback?: (floor: number) => void;

  constructor(targetFloor: number, onPressCallback?: (floor: number) => void) {
    super(`Kat ${targetFloor}`);
    this._targetFloor = targetFloor;
    this._onPressCallback = onPressCallback;
  }

  public get targetFloor(): number {
    return this._targetFloor;
  }

  public override press(): void {
    this.activate();
    if (this._onPressCallback) {
      this._onPressCallback(this._targetFloor);
    }
  }
}

/**
 * Kat Çağrı Düğmesi (Yukarı veya Aşağı)
 * Her katta 3 set çağrı istasyonu içinde yer alır.
 * Kalıtım: Button sınıfından türer.
 */
export class FloorCallButton extends Button {
  private readonly _floorNumber: number;
  private readonly _callDirection: Direction;
  private _onCallCallback?: (floor: number, direction: Direction) => void;

  constructor(floorNumber: number, callDirection: Direction, onCallCallback?: (floor: number, direction: Direction) => void) {
    super(`${callDirection === 'UP' ? 'Yukarı' : 'Aşağı'} (Kat ${floorNumber})`);
    this._floorNumber = floorNumber;
    this._callDirection = callDirection;
    this._onCallCallback = onCallCallback;
  }

  public get floorNumber(): number {
    return this._floorNumber;
  }

  public get callDirection(): Direction {
    return this._callDirection;
  }

  public override press(): void {
    this.activate();
    if (this._onCallCallback) {
      this._onCallCallback(this._floorNumber, this._callDirection);
    }
  }
}

/**
 * Kapı Açma ve Kapama Düğmeleri
 * Kalıtım: Button sınıfından türer.
 */
export class DoorControlButton extends Button {
  private readonly _actionType: 'OPEN' | 'CLOSE';
  private _onActionCallback?: (action: 'OPEN' | 'CLOSE') => void;

  constructor(actionType: 'OPEN' | 'CLOSE', onActionCallback?: (action: 'OPEN' | 'CLOSE') => void) {
    super(actionType === 'OPEN' ? '<|> Kapı Aç' : '>|< Kapı Kapa');
    this._actionType = actionType;
    this._onActionCallback = onActionCallback;
  }

  public get actionType(): 'OPEN' | 'CLOSE' {
    return this._actionType;
  }

  public override press(): void {
    this.activate();
    if (this._onActionCallback) {
      this._onActionCallback(this._actionType);
    }
    // Geçici aktivasyon sonrası sıfırlanabilir
    setTimeout(() => this.deactivate(), 800);
  }
}

/**
 * Acil Durum Sinyal Butonu (Emergency Button)
 * Kalıtım: Button sınıfından türer.
 */
export class EmergencyButton extends Button {
  private _onEmergencyTriggered?: () => void;

  constructor(onEmergencyTriggered?: () => void) {
    super('Acil Durum (ALARM)');
    this._onEmergencyTriggered = onEmergencyTriggered;
  }

  public override press(): void {
    if (this._state === 'ACTIVE') {
      this.deactivate();
    } else {
      this.activate();
      if (this._onEmergencyTriggered) {
        this._onEmergencyTriggered();
      }
    }
  }
}

/**
 * =========================================================================
 * SOYUTLAMA & KALITIM: KAPI HİYERARŞİSİ
 * Problemde: Her asansörün kendi kapısı + her katta 5 şaft için kat kapıları vardır.
 * Asansör kata vardığında her iki kapı grubu da senkronize olarak açılır.
 * =========================================================================
 */

export abstract class Door {
  protected _state: DoorState = 'CLOSED';
  protected _openDurationSec: number = 3.5;

  public get state(): DoorState {
    return this._state;
  }

  public get isOpen(): boolean {
    return this._state === 'OPEN';
  }

  public open(): void {
    this._state = 'OPEN';
  }

  public close(): void {
    this._state = 'CLOSED';
  }

  public setState(newState: DoorState): void {
    this._state = newState;
  }
}

/**
 * Asansör Kabin Kapısı
 */
export class ElevatorDoor extends Door {
  private readonly _elevatorId: number;

  constructor(elevatorId: number) {
    super();
    this._elevatorId = elevatorId;
  }

  public get elevatorId(): number {
    return this._elevatorId;
  }
}

/**
 * Kat Asansör Şaft Kapısı (Her katta 5 adet bulunur)
 */
export class FloorDoor extends Door {
  private readonly _floorNumber: number;
  private readonly _shaftElevatorId: number;

  constructor(floorNumber: number, shaftElevatorId: number) {
    super();
    this._floorNumber = floorNumber;
    this._shaftElevatorId = shaftElevatorId;
  }

  public get floorNumber(): number {
    return this._floorNumber;
  }

  public get shaftElevatorId(): number {
    return this._shaftElevatorId;
  }
}

/**
 * =========================================================================
 * SOYUTLAMA & KALITIM: BİLDİRİM / GÖSTERGE HİYERARŞİSİ (LIGHTS & BELLS)
 * =========================================================================
 */

export abstract class Indicator {
  protected _isLit: boolean = false;

  public get isLit(): boolean {
    return this._isLit;
  }

  public turnOn(): void {
    this._isLit = true;
  }

  public turnOff(): void {
    this._isLit = false;
  }
}

/**
 * Kabin İçi Kat Gösterge Işığı (Floor Indicator Light)
 * Asansör kattan kata hareket ederken yolcuları bilgilendirir.
 */
export class FloorIndicatorLight extends Indicator {
  private _displayedFloor: number = 1;

  public get displayedFloor(): number {
    return this._displayedFloor;
  }

  public updateFloor(newFloor: number): void {
    this._displayedFloor = newFloor;
    this.turnOn();
  }
}

/**
 * Kat Kapısı Üzerindeki Sinyal Işığı (Direction Signal Light)
 * Asansörün gelişini ve yönünü (Yukarı/Aşağı) gösterir.
 */
export class DirectionSignalLight extends Indicator {
  private _indicatedDirection: Direction | null = null;

  public get indicatedDirection(): Direction | null {
    return this._indicatedDirection;
  }

  public illuminateDirection(direction: Direction): void {
    this._indicatedDirection = direction;
    this.turnOn();
  }

  public override turnOff(): void {
    super.turnOff();
    this._indicatedDirection = null;
  }
}

/**
 * Kat Varış Zili (Arrival Bell)
 * Her kapı için vardır; asansörün bir kata vardığını sesli olarak gösterir.
 */
export class ArrivalBell {
  private _isRinging: boolean = false;
  private readonly _floorNumber: number;
  private readonly _shaftId: number;

  constructor(floorNumber: number, shaftId: number) {
    this._floorNumber = floorNumber;
    this._shaftId = shaftId;
  }

  public get isRinging(): boolean {
    return this._isRinging;
  }

  public ring(): void {
    this._isRinging = true;
    setTimeout(() => {
      this._isRinging = false;
    }, 1200);
  }
}

/**
 * =========================================================================
 * BİLEŞİM (COMPOSITION): KONTROL PANELİ
 * Asansörün içinde hedef düğmeleri (1-12), açma/kapama ve acil durum butonu vardır.
 * =========================================================================
 */
export class ElevatorControlPanel {
  private readonly _destinationButtons: Map<number, ElevatorButton> = new Map();
  private readonly _openDoorButton: DoorControlButton;
  private readonly _closeDoorButton: DoorControlButton;
  private readonly _emergencyButton: EmergencyButton;

  constructor(
    totalFloors: number,
    onFloorSelected: (floor: number) => void,
    onDoorAction: (action: 'OPEN' | 'CLOSE') => void,
    onEmergency: () => void
  ) {
    for (let f = 1; f <= totalFloors; f++) {
      this._destinationButtons.set(f, new ElevatorButton(f, onFloorSelected));
    }
    this._openDoorButton = new DoorControlButton('OPEN', onDoorAction);
    this._closeDoorButton = new DoorControlButton('CLOSE', onDoorAction);
    this._emergencyButton = new EmergencyButton(onEmergency);
  }

  public getDestinationButton(floor: number): ElevatorButton | undefined {
    return this._destinationButtons.get(floor);
  }

  public get allDestinationButtons(): ElevatorButton[] {
    return Array.from(this._destinationButtons.values());
  }

  public get openDoorButton(): DoorControlButton {
    return this._openDoorButton;
  }

  public get closeDoorButton(): DoorControlButton {
    return this._closeDoorButton;
  }

  public get emergencyButton(): EmergencyButton {
    return this._emergencyButton;
  }

  public clearButton(floor: number): void {
    this._destinationButtons.get(floor)?.deactivate();
  }
}

/**
 * Kat Çağrı İstasyonu (Hall Call Station)
 * "Her katta ayrıca üç set asansör çağrı düğmesi vardır."
 */
export class HallCallStation {
  private readonly _stationId: number;
  private readonly _floorNumber: number;
  private readonly _upButton?: FloorCallButton;
  private readonly _downButton?: FloorCallButton;

  constructor(
    stationId: number,
    floorNumber: number,
    isTopFloor: boolean,
    isBottomFloor: boolean,
    onCall: (floor: number, dir: Direction) => void
  ) {
    this._stationId = stationId;
    this._floorNumber = floorNumber;

    if (!isTopFloor) {
      this._upButton = new FloorCallButton(floorNumber, 'UP', onCall);
    }
    if (!isBottomFloor) {
      this._downButton = new FloorCallButton(floorNumber, 'DOWN', onCall);
    }
  }

  public get stationId(): number {
    return this._stationId;
  }

  public get floorNumber(): number {
    return this._floorNumber;
  }

  public get upButton(): FloorCallButton | undefined {
    return this._upButton;
  }

  public get downButton(): FloorCallButton | undefined {
    return this._downButton;
  }
}

/**
 * =========================================================================
 * KAPSÜLLEME (ENCAPSULATION): ASANSÖR (ELEVATOR / CAR) SINIFI
 * Kapasite kontrolü (yaklaşık 6 yetişkin yolcu), enerji tasarruflu çalışma mantığı,
 * durum makinesi yönetimi tamamen sınıf içinde kapsüllenmiştir.
 * =========================================================================
 */
export class Elevator {
  public static readonly MAX_PASSENGER_CAPACITY: number = 6;
  public static readonly MAX_WEIGHT_CAPACITY_KG: number = 450;

  private readonly _id: number;
  private readonly _name: string;
  private _currentFloor: number = 1;
  private _targetFloors: Set<number> = new Set();
  private _direction: Direction = 'IDLE';
  private _state: ElevatorState = 'IDLE';
  
  // Bileşim (Composition) İlişkileri:
  private readonly _door: ElevatorDoor;
  private readonly _indicatorLight: FloorIndicatorLight;
  private readonly _controlPanel: ElevatorControlPanel;

  // Yolcular (Aggregation / Association)
  private readonly _passengers: PassengerData[] = [];
  
  // Enerji ve İstatistikler (Enerji tasarrufu metriği)
  private _totalEnergyKwh: number = 0;
  private _totalTrips: number = 0;
  private _idleTimeSeconds: number = 0;
  private _isEmergency: boolean = false;

  constructor(id: number, name: string, totalFloors: number, onDispatchFloor: (f: number) => void) {
    this._id = id;
    this._name = name;
    this._door = new ElevatorDoor(id);
    this._indicatorLight = new FloorIndicatorLight();
    this._indicatorLight.updateFloor(1);

    this._controlPanel = new ElevatorControlPanel(
      totalFloors,
      (targetFloor) => {
        this.addTargetFloor(targetFloor);
        onDispatchFloor(targetFloor);
      },
      (action) => {
        if (action === 'OPEN' && (this._state === 'STOPPED' || this._state === 'IDLE')) {
          this._state = 'DOORS_OPEN';
          this._door.open();
        } else if (action === 'CLOSE') {
          this._door.close();
        }
      },
      () => {
        this.toggleEmergency();
      }
    );
  }

  public get id(): number { return this._id; }
  public get name(): string { return this._name; }
  public get currentFloor(): number { return this._currentFloor; }
  public get direction(): Direction { return this._direction; }
  public get state(): ElevatorState { return this._state; }
  public get door(): ElevatorDoor { return this._door; }
  public get indicatorLight(): FloorIndicatorLight { return this._indicatorLight; }
  public get controlPanel(): ElevatorControlPanel { return this._controlPanel; }
  public get passengers(): PassengerData[] { return [...this._passengers]; }
  public get passengerCount(): number { return this._passengers.length; }
  public get isFull(): boolean { return this._passengers.length >= Elevator.MAX_PASSENGER_CAPACITY; }
  public get targetFloors(): number[] { return Array.from(this._targetFloors).sort((a, b) => a - b); }
  public get isEmergency(): boolean { return this._isEmergency; }
  public get totalEnergyKwh(): number { return this._totalEnergyKwh; }
  public get totalTrips(): number { return this._totalTrips; }
  public get idleTimeSeconds(): number { return this._idleTimeSeconds; }

  public get currentTotalWeightKg(): number {
    return this._passengers.reduce((sum, p) => sum + p.weightKg, 0);
  }

  public addTargetFloor(floor: number): boolean {
    if (floor < 1 || floor > 12) return false;
    this._targetFloors.add(floor);
    this._controlPanel.getDestinationButton(floor)?.activate();

    if (this._state === 'IDLE') {
      this.determineNextState();
    }
    return true;
  }

  public removeTargetFloor(floor: number): void {
    this._targetFloors.delete(floor);
    this._controlPanel.clearButton(floor);
  }

  public addPassenger(passenger: PassengerData): boolean {
    if (this.isFull) return false;
    this._passengers.push(passenger);
    // Yolcu hedef katını panele otomatik basar
    this.addTargetFloor(passenger.destinationFloor);
    return true;
  }

  public removePassengersForCurrentFloor(): PassengerData[] {
    const alighted: PassengerData[] = [];
    const remaining: PassengerData[] = [];

    for (const p of this._passengers) {
      if (p.destinationFloor === this._currentFloor) {
        alighted.push(p);
      } else {
        remaining.push(p);
      }
    }

    this._passengers.length = 0;
    this._passengers.push(...remaining);
    this.removeTargetFloor(this._currentFloor);
    return alighted;
  }

  public toggleEmergency(): void {
    this._isEmergency = !this._isEmergency;
    if (this._isEmergency) {
      this._state = 'EMERGENCY_STOP';
    } else {
      this._state = 'IDLE';
      this.determineNextState();
    }
  }

  /**
   * Enerji Tasarrufu Mantığı:
   * Yalnızca hedef kat varsa hareket eder, yoksa IDLE konumda enerji tüketmeden bekler.
   */
  public determineNextState(): void {
    if (this._isEmergency) return;

    if (this._targetFloors.size === 0) {
      this._state = 'IDLE';
      this._direction = 'IDLE';
      this._door.close();
      return;
    }

    const targets = Array.from(this._targetFloors);

    // Eğer şu anki kat hedefse dur
    if (this._targetFloors.has(this._currentFloor)) {
      this._state = 'STOPPED';
      return;
    }

    // Yön belirleme (Mevcut yöne öncelik verilir)
    if (this._direction === 'UP') {
      const higher = targets.filter(f => f > this._currentFloor);
      if (higher.length > 0) {
        this._state = 'MOVING_UP';
        return;
      }
      const lower = targets.filter(f => f < this._currentFloor);
      if (lower.length > 0) {
        this._direction = 'DOWN';
        this._state = 'MOVING_DOWN';
        return;
      }
    } else if (this._direction === 'DOWN') {
      const lower = targets.filter(f => f < this._currentFloor);
      if (lower.length > 0) {
        this._state = 'MOVING_DOWN';
        return;
      }
      const higher = targets.filter(f => f > this._currentFloor);
      if (higher.length > 0) {
        this._direction = 'UP';
        this._state = 'MOVING_UP';
        return;
      }
    } else {
      // IDLE durumdan başlarken en yakın hedefe göre yön belirle
      const nearest = targets.reduce((prev, curr) => 
        Math.abs(curr - this._currentFloor) < Math.abs(prev - this._currentFloor) ? curr : prev
      );
      if (nearest > this._currentFloor) {
        this._direction = 'UP';
        this._state = 'MOVING_UP';
      } else if (nearest < this._currentFloor) {
        this._direction = 'DOWN';
        this._state = 'MOVING_DOWN';
      } else {
        this._state = 'STOPPED';
      }
    }
  }

  /**
   * Bir kat adımı ilerleme (Simülasyon motoru tarafından çağrılır)
   */
  public stepMovement(): boolean {
    if (this._state === 'IDLE') {
      this._idleTimeSeconds += 1;
      return false;
    }

    if (this._state === 'MOVING_UP') {
      this._currentFloor += 1;
      this._indicatorLight.updateFloor(this._currentFloor);
      this._totalEnergyKwh += 0.08 + (this._passengers.length * 0.015);
    } else if (this._state === 'MOVING_DOWN') {
      this._currentFloor -= 1;
      this._indicatorLight.updateFloor(this._currentFloor);
      this._totalEnergyKwh += 0.04 + (this._passengers.length * 0.01); // İnişte rejeneratif frenleme avantajı
    }

    // Hedefe varıldı mı?
    if (this._targetFloors.has(this._currentFloor)) {
      this._state = 'STOPPED';
      this._totalTrips += 1;
      return true; // Varış gerçekleşti!
    }

    return false;
  }

  public setDoorState(doorState: DoorState): void {
    this._door.setState(doorState);
  }

  public setState(state: ElevatorState): void {
    this._state = state;
  }
}

/**
 * =========================================================================
 * BİNA KATI (FLOOR) SINIFI
 * - 5 asansör şaft kapısı (FloorDoor)
 * - Her kapı için varış zili (ArrivalBell)
 * - Her kapı üzerinde yön sinyal ışığı (DirectionSignalLight)
 * - 3 set asansör çağrı düğmesi istasyonu (HallCallStation)
 * =========================================================================
 */
export class Floor {
  private readonly _floorNumber: number;
  private readonly _name: string;
  private readonly _shaftDoors: Map<number, FloorDoor> = new Map();
  private readonly _arrivalBells: Map<number, ArrivalBell> = new Map();
  private readonly _signalLights: Map<number, DirectionSignalLight> = new Map();
  private readonly _callStations: HallCallStation[] = [];
  private readonly _waitingPassengers: PassengerData[] = [];

  constructor(
    floorNumber: number,
    numElevators: number,
    isTopFloor: boolean,
    isBottomFloor: boolean,
    onCallElevator: (floor: number, dir: Direction) => void
  ) {
    this._floorNumber = floorNumber;
    this._name = `Kat ${floorNumber}`;

    // 5 Asansör boşluğunun her biri için kapı, zil ve sinyal ışığı
    for (let eId = 1; eId <= numElevators; eId++) {
      this._shaftDoors.set(eId, new FloorDoor(floorNumber, eId));
      this._arrivalBells.set(eId, new ArrivalBell(floorNumber, eId));
      this._signalLights.set(eId, new DirectionSignalLight());
    }

    // Her katta 3 set çağrı düğmesi
    for (let sId = 1; sId <= 3; sId++) {
      this._callStations.push(
        new HallCallStation(sId, floorNumber, isTopFloor, isBottomFloor, onCallElevator)
      );
    }
  }

  public get floorNumber(): number { return this._floorNumber; }
  public get name(): string { return this._name; }
  public get callStations(): HallCallStation[] { return this._callStations; }
  public get waitingPassengers(): PassengerData[] { return [...this._waitingPassengers]; }

  public getDoor(elevatorId: number): FloorDoor | undefined {
    return this._shaftDoors.get(elevatorId);
  }

  public getArrivalBell(elevatorId: number): ArrivalBell | undefined {
    return this._arrivalBells.get(elevatorId);
  }

  public getSignalLight(elevatorId: number): DirectionSignalLight | undefined {
    return this._signalLights.get(elevatorId);
  }

  public addWaitingPassenger(passenger: PassengerData): void {
    this._waitingPassengers.push(passenger);
  }

  public removeWaitingPassenger(passengerId: string): PassengerData | undefined {
    const idx = this._waitingPassengers.findIndex(p => p.id === passengerId);
    if (idx !== -1) {
      return this._waitingPassengers.splice(idx, 1)[0];
    }
    return undefined;
  }

  public clearWaitingPassengers(): PassengerData[] {
    const copy = [...this._waitingPassengers];
    this._waitingPassengers.length = 0;
    return copy;
  }

  public resetCallStationButtons(direction: Direction): void {
    for (const station of this._callStations) {
      if (direction === 'UP' && station.upButton) {
        station.upButton.deactivate();
      } else if (direction === 'DOWN' && station.downButton) {
        station.downButton.deactivate();
      }
    }
  }
}

/**
 * =========================================================================
 * POLİMORFİZM (POLYMORPHISM) & STRATEJİ PATTERN: PROGRAMLAYICI (SCHEDULER)
 * "Bir programlayıcı, aramanın başladığı kata gitmek için beş asansörden birini görevlendirir."
 * =========================================================================
 */

export interface IScheduler {
  assignElevator(
    elevators: Elevator[],
    requestedFloor: number,
    direction: Direction
  ): Elevator | null;
}

/**
 * Enerji Tasarruflu ve Akıllı Asansör Dağıtımcısı (Energy-Saving Dispatcher)
 * Asansörlerin gereksiz çalışmasını engelleyerek en az enerji tüketecek
 * ve yolcu kapasitesini aşmayacak en uygun asansörü seçer.
 */
export class EnergySavingScheduler implements IScheduler {
  public assignElevator(
    elevators: Elevator[],
    requestedFloor: number,
    direction: Direction
  ): Elevator | null {
    // 1. Acil durumda olmayan ve kapasitesi dolmamış asansörleri filtrele
    const available = elevators.filter(e => !e.isEmergency && !e.isFull);
    if (available.length === 0) return null;

    let bestElevator: Elevator | null = null;
    let lowestPenalty = Number.MAX_SAFE_INTEGER;

    for (const elevator of available) {
      const distance = Math.abs(elevator.currentFloor - requestedFloor);
      let penalty = distance * 10; // Temel mesafe maliyeti

      // Asansör zaten bu kata gidiyor mu?
      if (elevator.targetFloors.includes(requestedFloor)) {
        return elevator;
      }

      // 1. Zaten aynı yönde giden ve bu katın önünde olan asansör (EN YÜKSEK ENERJİ TASARRUFU)
      if (
        (direction === 'UP' && elevator.direction === 'UP' && elevator.currentFloor <= requestedFloor) ||
        (direction === 'DOWN' && elevator.direction === 'DOWN' && elevator.currentFloor >= requestedFloor)
      ) {
        penalty -= 15; // Büyük ödül: Ekstra hareket gerektirmez
      } 
      // 2. Beklemede (IDLE) duran asansör
      else if (elevator.state === 'IDLE') {
        penalty += 5; // Yeni bir motor başlatma maliyeti
      } 
      // 3. Ters yönde giden asansör
      else {
        penalty += 35; // Ters yön ekstra enerji harcatır
      }

      // Doluluk oranı cezası (boş asansör daha rahat yolcu alır)
      penalty += elevator.passengerCount * 3;

      if (penalty < lowestPenalty) {
        lowestPenalty = penalty;
        bestElevator = elevator;
      }
    }

    return bestElevator;
  }
}
