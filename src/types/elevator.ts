export type Direction = 'UP' | 'DOWN' | 'IDLE';

export type ElevatorState = 
  | 'IDLE'
  | 'MOVING_UP'
  | 'MOVING_DOWN'
  | 'STOPPED'
  | 'DOORS_OPENING'
  | 'DOORS_OPEN'
  | 'DOORS_CLOSING'
  | 'EMERGENCY_STOP';

export type DoorState = 'CLOSED' | 'OPENING' | 'OPEN' | 'CLOSING';

export type ButtonState = 'ACTIVE' | 'INACTIVE';

export interface PassengerData {
  id: string;
  name: string;
  sourceFloor: number;
  destinationFloor: number;
  weightKg: number;
  waitingSinceSec: number;
  inElevatorId: number | null;
  state: 'WAITING' | 'TRAVELLING' | 'ARRIVED';
}

export interface ElevatorStatus {
  id: number;
  name: string;
  currentFloor: number;
  targetFloors: number[];
  direction: Direction;
  state: ElevatorState;
  doorState: DoorState;
  passengers: PassengerData[];
  maxCapacity: number;
  isEmergencyActive: boolean;
  totalTrips: number;
  energyScoreKwh: number;
  idleDurationSec: number;
  currentWeightKg: number;
}

export interface FloorStatus {
  floorNumber: number;
  name: string;
  waitingPassengers: PassengerData[];
  callPanels: {
    id: number;
    name: string;
    upPressed: boolean;
    downPressed: boolean;
  }[];
  shaftDoors: {
    elevatorId: number;
    doorState: DoorState;
    signalLightDirection: Direction | null;
    bellRinging: boolean;
  }[];
}

export interface SimulationLogEntry {
  id: string;
  timestamp: string;
  secondsElapsed: number;
  category: 'DISPATCH' | 'ARRIVAL' | 'DOOR' | 'PASSENGER' | 'EMERGENCY' | 'ENERGY' | 'SYSTEM';
  message: string;
  elevatorId?: number;
  floor?: number;
}

export interface UmlClassDefinition {
  id: string;
  name: string;
  packageName: string;
  stereotype?: '<<abstract>>' | '<<interface>>' | '<<enumeration>>' | '<<class>>';
  description: string;
  attributes: {
    visibility: '+' | '-' | '#';
    name: string;
    type: string;
    description: string;
  }[];
  methods: {
    visibility: '+' | '-' | '#';
    name: string;
    parameters: string;
    returnType: string;
    description: string;
  }[];
  oopPrinciples: {
    pillar: 'Kapsülleme' | 'Kalıtım' | 'Polimorfizm' | 'Soyutlama';
    explanation: string;
  }[];
  relationships: {
    type: 'inheritance' | 'realization' | 'composition' | 'aggregation' | 'association' | 'dependency';
    targetClassId: string;
    targetClassName: string;
    multiplicity?: string;
    role?: string;
    description: string;
  }[];
  specQuote: string;
}
