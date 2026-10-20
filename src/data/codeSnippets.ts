export const CODE_SNIPPETS = {
  typescript: `/**
 * Kodluyoruz Sigorta Şirketi 12 Katlı Ofis Binası Asansör Sistemi
 * Tasarım ve Mimari: Enes Öztürk
 * Nesne Yönelimli Programlama (OOP) İlkeleri İle Modellenmiştir.
 */

// 1. SOYUTLAMA & KALITIM: Buton Hiyerarşisi
export abstract class Button {
  protected state: 'ACTIVE' | 'INACTIVE' = 'INACTIVE';
  constructor(protected label: string) {}
  public activate(): void { this.state = 'ACTIVE'; }
  public deactivate(): void { this.state = 'INACTIVE'; }
  public abstract press(): void; // Polimorfik metot
}

export class ElevatorButton extends Button {
  constructor(public readonly targetFloor: number, private onSelect: (floor: number) => void) {
    super(\`Kat \${targetFloor}\`);
  }
  public override press(): void {
    this.activate();
    this.onSelect(this.targetFloor);
  }
}

export class FloorCallButton extends Button {
  constructor(
    public readonly floorNumber: number,
    public readonly callDirection: 'UP' | 'DOWN',
    private onCall: (floor: number, dir: 'UP' | 'DOWN') => void
  ) {
    super(\`\${callDirection === 'UP' ? 'Yukarı' : 'Aşağı'} Kat \${floorNumber}\`);
  }
  public override press(): void {
    this.activate();
    this.onCall(this.floorNumber, this.callDirection);
  }
}

// 2. KAPI HİYERARŞİSİ (Soyutlama & Kalıtım)
export abstract class Door {
  protected state: 'CLOSED' | 'OPENING' | 'OPEN' | 'CLOSING' = 'CLOSED';
  public open(): void { this.state = 'OPEN'; }
  public close(): void { this.state = 'CLOSED'; }
  public isOpen(): boolean { return this.state === 'OPEN'; }
}

export class ElevatorDoor extends Door {
  constructor(public readonly elevatorId: number) { super(); }
}

export class FloorDoor extends Door {
  constructor(public readonly floorNumber: number, public readonly shaftId: number) { super(); }
}

// 3. IŞIK VE GÖSTERGELER
export abstract class Indicator {
  protected isLit: boolean = false;
  public turnOn(): void { this.isLit = true; }
  public turnOff(): void { this.isLit = false; }
}

export class FloorIndicatorLight extends Indicator {
  private currentFloor: number = 1;
  public updateFloor(floor: number): void {
    this.currentFloor = floor;
    this.turnOn();
  }
}

export class DirectionSignalLight extends Indicator {
  private direction: 'UP' | 'DOWN' | null = null;
  public illuminateDirection(dir: 'UP' | 'DOWN'): void {
    this.direction = dir;
    this.turnOn();
  }
}

export class ArrivalBell {
  constructor(private floor: number, private shaftId: number) {}
  public ring(): void {
    console.log(\`Ding! Kat \${this.floor} Şaft \${this.shaftId} Asansör Vardı.\`);
  }
}

// 4. POLİMORFİZM: STRATEJİ DESENİ PROGRAMLAYICI
export interface IScheduler {
  assignElevator(elevators: Elevator[], floor: number, dir: 'UP' | 'DOWN'): Elevator | null;
}

export class EnergySavingScheduler implements IScheduler {
  public assignElevator(elevators: Elevator[], floor: number, dir: 'UP' | 'DOWN'): Elevator | null {
    // Enerji tasarruflu algoritma: yalnızca gerektiğinde hareket eder,
    // aynı yönde giden veya en yakın bekleyen (IDLE) asansöre öncelik tanır.
    return elevators.find(e => !e.isFull && !e.isEmergency) || null;
  }
}

// 5. KAPSÜLLEME: ASANSÖR KABİNİ (ELEVATOR)
export class Elevator {
  public static readonly MAX_CAPACITY = 6; // Yaklaşık altı yetişkin kapasitesi
  private currentFloor: number = 1;
  private direction: 'UP' | 'DOWN' | 'IDLE' = 'IDLE';
  private passengers: any[] = [];
  
  // Bileşim (Composition) bileşenleri
  private door: ElevatorDoor;
  private indicator: FloorIndicatorLight;

  constructor(public readonly id: number) {
    this.door = new ElevatorDoor(id);
    this.indicator = new FloorIndicatorLight();
  }

  public get isFull(): boolean {
    return this.passengers.length >= Elevator.MAX_CAPACITY;
  }

  public get isEmergency(): boolean {
    return false;
  }

  public addPassenger(p: any): boolean {
    if (this.isFull) return false;
    this.passengers.push(p);
    return true;
  }
}
`,

  java: `/**
 * Kodluyoruz Sigorta Şirketi 12 Katlı Ofis Binası Asansör Sistemi
 * Tasarım ve Mimari: Enes Öztürk
 * Java 17+ Nesne Yönelimli Programlama Gerçeklemesi
 */
package com.kodluyoruz.elevator;

import java.util.*;

// ==========================================
// 1. SOYUTLAMA & KALITIM (ABSTRACTION & INHERITANCE)
// ==========================================
public abstract class Button {
    protected boolean isActive = false;
    protected String label;

    public Button(String label) { this.label = label; }
    public void activate() { this.isActive = true; }
    public void deactivate() { this.isActive = false; }
    public abstract void press(); // Polimorfik metot
}

public class ElevatorButton extends Button {
    private final int targetFloor;
    private final Elevator targetElevator;

    public ElevatorButton(int targetFloor, Elevator targetElevator) {
        super("Kat " + targetFloor);
        this.targetFloor = targetFloor;
        this.targetElevator = targetElevator;
    }

    @Override
    public void press() {
        activate();
        targetElevator.addTargetFloor(targetFloor);
    }
}

public class FloorCallButton extends Button {
    private final int floorNumber;
    private final Direction direction;
    private final IScheduler scheduler;

    public FloorCallButton(int floorNumber, Direction direction, IScheduler scheduler) {
        super(direction + " (Kat " + floorNumber + ")");
        this.floorNumber = floorNumber;
        this.direction = direction;
        this.scheduler = scheduler;
    }

    @Override
    public void press() {
        activate();
        scheduler.onFloorCall(floorNumber, direction);
    }
}

// ==========================================
// 2. KAPI HİYERARŞİSİ (DOOR INHERITANCE)
// ==========================================
public abstract class Door {
    protected boolean isOpen = false;
    public void open() { this.isOpen = true; }
    public void close() { this.isOpen = false; }
    public boolean isOpen() { return isOpen; }
}

public class ElevatorDoor extends Door {
    private final int elevatorId;
    public ElevatorDoor(int elevatorId) { this.elevatorId = elevatorId; }
}

public class FloorDoor extends Door {
    private final int floorNumber;
    private final int shaftId;
    public FloorDoor(int floorNumber, int shaftId) {
        this.floorNumber = floorNumber;
        this.shaftId = shaftId;
    }
}

// ==========================================
// 3. POLİMORFİZM (STRATEGY PATTERN SCHEDULER)
// ==========================================
public interface IScheduler {
    Elevator assignElevator(List<Elevator> elevators, int floor, Direction dir);
    void onFloorCall(int floor, Direction dir);
}

public class EnergySavingScheduler implements IScheduler {
    @Override
    public Elevator assignElevator(List<Elevator> elevators, int floor, Direction dir) {
        // Enerji tasarruflu atama algoritması:
        // Yalnızca gerektiğinde hareket ettirilir.
        return elevators.stream()
            .filter(e -> !e.isFull() && !e.isEmergency())
            .min(Comparator.comparingInt(e -> Math.abs(e.getCurrentFloor() - floor)))
            .orElse(null);
    }

    @Override
    public void onFloorCall(int floor, Direction dir) {
        // Çağrıyı asansöre bağlar
    }
}

// ==========================================
// 4. KAPSÜLLEME: ASANSÖR SINIFI (ENCAPSULATION)
// ==========================================
public class Elevator {
    public static final int MAX_CAPACITY = 6; // 6 yetişkin yolcu
    private final int id;
    private int currentFloor = 1;
    private Direction direction = Direction.IDLE;
    private final List<Passenger> passengers = new ArrayList<>();
    private final ElevatorDoor door;
    private final FloorIndicatorLight indicatorLight;

    public Elevator(int id) {
        this.id = id;
        this.door = new ElevatorDoor(id);
        this.indicatorLight = new FloorIndicatorLight();
    }

    public synchronized boolean addPassenger(Passenger p) {
        if (passengers.size() >= MAX_CAPACITY) {
            return false; // Kapsülleme: Kapasite aşımını engeller
        }
        passengers.add(p);
        return true;
    }

    public int getCurrentFloor() { return currentFloor; }
    public boolean isFull() { return passengers.size() >= MAX_CAPACITY; }
    public boolean isEmergency() { return false; }
    public void addTargetFloor(int f) { /* ... */ }
}
`,

  csharp: `/**
 * Kodluyoruz Sigorta Şirketi 12 Katlı Ofis Binası Asansör Sistemi
 * Tasarım ve Mimari: Enes Öztürk
 * C# .NET 8 / 9 OOP Sınıf Yapısı
 */
namespace Kodluyoruz.ElevatorSystem;

// 1. SOYUTLAMA & KALITIM (Abstract Class & Inheritance)
public abstract class Button
{
    public bool IsActive { get; protected set; }
    public string Label { get; }

    protected Button(string label) => Label = label;
    public virtual void Activate() => IsActive = true;
    public virtual void Deactivate() => IsActive = false;
    public abstract void Press(); // Polimorfizm
}

public class ElevatorButton : Button
{
    public int TargetFloor { get; }
    private readonly Action<int> _onSelect;

    public ElevatorButton(int targetFloor, Action<int> onSelect) : base($"Kat {targetFloor}")
    {
        TargetFloor = targetFloor;
        _onSelect = onSelect;
    }

    public override void Press()
    {
        Activate();
        _onSelect?.Invoke(TargetFloor);
    }
}

public class FloorCallButton : Button
{
    public int FloorNumber { get; }
    public Direction Direction { get; }
    private readonly Action<int, Direction> _onCall;

    public FloorCallButton(int floorNumber, Direction dir, Action<int, Direction> onCall) 
        : base($"{dir} (Kat {floorNumber})")
    {
        FloorNumber = floorNumber;
        Direction = dir;
        _onCall = onCall;
    }

    public override void Press()
    {
        Activate();
        _onCall?.Invoke(FloorNumber, Direction);
    }
}

// 2. KAPI BİLEŞENLERİ (Door Hierarchy)
public abstract class Door
{
    public DoorState State { get; protected set; } = DoorState.Closed;
    public virtual void Open() => State = DoorState.Open;
    public virtual void Close() => State = DoorState.Closed;
}

public class ElevatorDoor : Door
{
    public int ElevatorId { get; }
    public ElevatorDoor(int elevatorId) => ElevatorId = elevatorId;
}

public class FloorDoor : Door
{
    public int FloorNumber { get; }
    public int ShaftId { get; }
    public FloorDoor(int floor, int shaft) { FloorNumber = floor; ShaftId = shaft; }
}

// 3. DAĞITICI ARAYÜZÜ (IScheduler & Polymorphism)
public interface IScheduler
{
    Elevator? AssignElevator(IReadOnlyList<Elevator> elevators, int floor, Direction dir);
}

public class EnergySavingScheduler : IScheduler
{
    public Elevator? AssignElevator(IReadOnlyList<Elevator> elevators, int floor, Direction dir)
    {
        return elevators
            .Where(e => !e.IsFull && !e.IsEmergency)
            .OrderBy(e => Math.Abs(e.CurrentFloor - floor))
            .FirstOrDefault();
    }
}

// 4. ASANSÖR (Kapsülleme)
public class Elevator
{
    public const int MaxCapacity = 6;
    public int Id { get; }
    public int CurrentFloor { get; private set; } = 1;
    public Direction Direction { get; private set; } = Direction.Idle;
    
    // Bileşim (Composition)
    public ElevatorDoor Door { get; }
    private readonly List<Passenger> _passengers = new();

    public Elevator(int id)
    {
        Id = id;
        Door = new ElevatorDoor(id);
    }

    public bool IsFull => _passengers.Count >= MaxCapacity;
    public bool IsEmergency { get; private set; }

    public bool AddPassenger(Passenger passenger)
    {
        if (IsFull) return false;
        _passengers.Add(passenger);
        return true;
    }
}
`
};
