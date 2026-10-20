import { UmlClassDefinition } from '../types/elevator';

export const UML_CLASSES: UmlClassDefinition[] = [
  {
    id: 'building',
    name: 'Building',
    packageName: 'com.kodluyoruz.elevator.model',
    stereotype: '<<class>>',
    description: 'Kodluyoruz Sigorta Şirketi 12 katlı ofis binasını temsil eden ana agregasyon sınıfı.',
    specQuote: 'Kodluyoruz Sigorta Şirketi 12 katlı bir ofis binası inşa etmek ve onu en son asansör teknolojisi ile donatmak istiyor.',
    attributes: [
      { visibility: '-', name: 'name', type: 'string', description: 'Bina adı ("Kodluyoruz Sigorta Genel Müdürlük")' },
      { visibility: '-', name: 'floors', type: 'Floor[12]', description: 'Binadaki 12 katın koleksiyonu' },
      { visibility: '-', name: 'elevators', type: 'Elevator[5]', description: 'Binadaki 5 asansörün koleksiyonu' },
      { visibility: '-', name: 'scheduler', type: 'IScheduler', description: 'Asansör çağrılarını dağıtan programlayıcı' },
      { visibility: '-', name: 'clock', type: 'SimulationClock', description: 'Simülasyon saat motoru' }
    ],
    methods: [
      { visibility: '+', name: 'Building', parameters: 'name: string', returnType: 'void', description: '12 Katı ve 5 Asansörü ilklendirir' },
      { visibility: '+', name: 'getFloor', parameters: 'floorNumber: int', returnType: 'Floor', description: 'Numaraya göre kat nesnesini döndürür' },
      { visibility: '+', name: 'getElevator', parameters: 'id: int', returnType: 'Elevator', description: 'Numaraya göre asansör nesnesini döndürür' },
      { visibility: '+', name: 'requestElevator', parameters: 'floor: int, dir: Direction', returnType: 'void', description: 'Dış çağrıyı karşılar ve Scheduler üzerinden asansöre iletir' }
    ],
    oopPrinciples: [
      {
        pillar: 'Kapsülleme',
        explanation: 'Binadaki asansörler ve katlar dışarıdan doğrudan değiştirilemez (private). Sadece kontrollü arayüzler üzerinden erişilir.'
      },
      {
        pillar: 'Soyutlama',
        explanation: 'Dış dünya için binanın karmaşık elektromekanik süreçleri requestElevator() ve getFloor() seviyesinde soyutlanmıştır.'
      }
    ],
    relationships: [
      {
        type: 'aggregation',
        targetClassId: 'floor',
        targetClassName: 'Floor',
        multiplicity: '12',
        role: 'floors',
        description: 'Bina 12 adet Kattan oluşur (Agregasyon: Katlar binanın parçasıdır).'
      },
      {
        type: 'aggregation',
        targetClassId: 'elevator',
        targetClassName: 'Elevator',
        multiplicity: '5',
        role: 'elevators',
        description: 'Bina 5 adet Asansöre sahiptir (Agregasyon).'
      },
      {
        type: 'association',
        targetClassId: 'ischeduler',
        targetClassName: 'IScheduler',
        multiplicity: '1',
        role: 'scheduler',
        description: 'Bina çağrıları dağıtmak için bir programlayıcı stratejisini kullanır.'
      }
    ]
  },
  {
    id: 'elevator',
    name: 'Elevator',
    packageName: 'com.kodluyoruz.elevator.model',
    stereotype: '<<class>>',
    description: '12 kata çıkabilen, ~6 yetişkin kapasiteli, enerji tasarruflu asansör kabini.',
    specQuote: 'Binada, her biri binanın 12 katına çıkabilecek beş asansör bulunacaktır. Her asansörün yaklaşık altı yetişkin yolcu kapasitesi vardır. Asansörler enerji tasarruflu olacak şekilde tasarlanmıştır, bu nedenle yalnızca gerektiğinde hareket ederler.',
    attributes: [
      { visibility: '-', name: 'id', type: 'int', description: 'Asansör şaft kimlik numarası (1-5)' },
      { visibility: '-', name: 'currentFloor', type: 'int', description: 'Mevcut bulunduğu kat (1-12)' },
      { visibility: '-', name: 'direction', type: 'Direction', description: 'Hareket yönü (UP, DOWN, IDLE)' },
      { visibility: '-', name: 'state', type: 'ElevatorState', description: 'Durum makinesi (IDLE, MOVING, STOPPED vb.)' },
      { visibility: '-', name: 'maxCapacity', type: 'int = 6', description: 'Azami yetişkin yolcu kapasitesi (6 kişi / 450 kg)' },
      { visibility: '-', name: 'passengers', type: 'List<Passenger>', description: 'Kabin içerisindeki mevcut yolcular' },
      { visibility: '-', name: 'door', type: 'ElevatorDoor', description: 'Asansörün kendi kabin kapısı (Composition)' },
      { visibility: '-', name: 'indicatorLight', type: 'FloorIndicatorLight', description: 'Kabin içi kat gösterge ışığı (Composition)' },
      { visibility: '-', name: 'controlPanel', type: 'ElevatorControlPanel', description: 'Kabin içi kontrol paneli (Composition)' },
      { visibility: '-', name: 'targetFloors', type: 'Set<int>', description: 'Kayıtlı gidilecek hedef katlar listesi' }
    ],
    methods: [
      { visibility: '+', name: 'addTargetFloor', parameters: 'floor: int', returnType: 'boolean', description: 'Hedef kat listesine ekler ve enerji durumunu günceller' },
      { visibility: '+', name: 'addPassenger', parameters: 'passenger: Passenger', returnType: 'boolean', description: 'Kapasite < 6 ise yolcuyu kabul eder (Kapsülleme koruması)' },
      { visibility: '+', name: 'stepMovement', parameters: 'void', returnType: 'boolean', description: 'Bir kat adımı ilerler, kata vardığında true döner' },
      { visibility: '+', name: 'determineNextState', parameters: 'void', returnType: 'void', description: 'Enerji tasarrufu mantığına göre duruş/hareket kararı verir' },
      { visibility: '+', name: 'toggleEmergency', parameters: 'void', returnType: 'void', description: 'Acil durum frenlemesini devreye sokar/çıkarır' }
    ],
    oopPrinciples: [
      {
        pillar: 'Kapsülleme',
        explanation: 'Kapasite (6 kişi) ve kat aralığı (1-12) gibi kritik sınırlar addPassenger() ve addTargetFloor() metotları içinde sıkı bir şekilde kapsüllenmiştir.'
      },
      {
        pillar: 'Soyutlama',
        explanation: 'Enerji optimizasyonu, motor kontrolü ve fren mekanizması stepMovement() ve determineNextState() arkasına gizlenmiştir.'
      }
    ],
    relationships: [
      {
        type: 'composition',
        targetClassId: 'elevatordoor',
        targetClassName: 'ElevatorDoor',
        multiplicity: '1',
        role: 'door',
        description: 'Bileşim: Asansör kendi kapısına sahiptir, asansör yok edilirse kapısı da yok olur.'
      },
      {
        type: 'composition',
        targetClassId: 'floorindicatorlight',
        targetClassName: 'FloorIndicatorLight',
        multiplicity: '1',
        role: 'indicatorLight',
        description: 'Bileşim: Kabin içi kat gösterge ışığı asansörün ayrılmaz bir parçasıdır.'
      },
      {
        type: 'composition',
        targetClassId: 'elevatorcontrolpanel',
        targetClassName: 'ElevatorControlPanel',
        multiplicity: '1',
        role: 'controlPanel',
        description: 'Bileşim: Kontrol paneli asansör kabini ile birlikte var olur.'
      },
      {
        type: 'association',
        targetClassId: 'passenger',
        targetClassName: 'Passenger',
        multiplicity: '0..6',
        role: 'passengers',
        description: 'Birliktelik: Asansör anlık olarak 0 ile 6 arasında yolcu taşır.'
      }
    ]
  },
  {
    id: 'floor',
    name: 'Floor',
    packageName: 'com.kodluyoruz.elevator.model',
    stereotype: '<<class>>',
    description: 'Binadaki bir katı, 5 şaft kapısını, zillerini, sinyal ışıklarını ve 3 set çağrı butonunu temsil eder.',
    specQuote: 'Binadaki her katta, beş asansör boşluğunun her biri için bir kapı ve her kapı için bir varış zili vardır. Her kapının üzerinde bulunan bir sinyal ışığı, asansörün gelişini ve yönünü gösterir. Her katta ayrıca üç set asansör çağrı düğmesi vardır.',
    attributes: [
      { visibility: '-', name: 'floorNumber', type: 'int', description: 'Kat numarası (1-12)' },
      { visibility: '-', name: 'shaftDoors', type: 'Map<int, FloorDoor>', description: '5 asansör boşluğu için kat kapıları (Composition)' },
      { visibility: '-', name: 'arrivalBells', type: 'Map<int, ArrivalBell>', description: '5 şaft için varış zilleri (Composition)' },
      { visibility: '-', name: 'signalLights', type: 'Map<int, DirectionSignalLight>', description: '5 kapı üzerindeki geliş ve yön sinyal lambaları (Composition)' },
      { visibility: '-', name: 'callStations', type: 'HallCallStation[3]', description: 'Kattaki 3 set asansör çağırma paneli (Composition)' },
      { visibility: '-', name: 'waitingPassengers', type: 'List<Passenger>', description: 'Katta bekleyen yolcular listesi' }
    ],
    methods: [
      { visibility: '+', name: 'Floor', parameters: 'floorNumber: int, numElevators: int', returnType: 'void', description: '5 kapı, 5 zil, 5 sinyal lambası ve 3 set buton ilklendirir' },
      { visibility: '+', name: 'notifyArrival', parameters: 'elevatorId: int, dir: Direction', returnType: 'void', description: 'Kapı sinyal lambasını yakar, zili çalar ve kapıyı açar' },
      { visibility: '+', name: 'addWaitingPassenger', parameters: 'passenger: Passenger', returnType: 'void', description: 'Katta bekleyenler listesine ekler' },
      { visibility: '+', name: 'getDoor', parameters: 'elevatorId: int', returnType: 'FloorDoor', description: 'İlgili şaftın kat kapısını döndürür' }
    ],
    oopPrinciples: [
      {
        pillar: 'Kapsülleme',
        explanation: 'Şaft bileşenleri (kapı, zil, ışık) kat içinde haritalar ve listeler ile korunur.'
      }
    ],
    relationships: [
      {
        type: 'composition',
        targetClassId: 'floordoor',
        targetClassName: 'FloorDoor',
        multiplicity: '5',
        role: 'shaftDoors',
        description: 'Bileşim: Katta her 5 asansör şaftı için birer FloorDoor bulunur.'
      },
      {
        type: 'composition',
        targetClassId: 'arrivalbell',
        targetClassName: 'ArrivalBell',
        multiplicity: '5',
        role: 'arrivalBells',
        description: 'Bileşim: Her kapı için bir Varış Zili (ArrivalBell) bulunur.'
      },
      {
        type: 'composition',
        targetClassId: 'directionsignallight',
        targetClassName: 'DirectionSignalLight',
        multiplicity: '5',
        role: 'signalLights',
        description: 'Bileşim: Her kapının üzerinde geliş ve yön sinyali lambası bulunur.'
      },
      {
        type: 'composition',
        targetClassId: 'hallcallstation',
        targetClassName: 'HallCallStation',
        multiplicity: '3',
        role: 'callStations',
        description: 'Bileşim: Her katta 3 set asansör çağrı düğmesi istasyonu bulunur.'
      }
    ]
  },
  {
    id: 'button',
    name: 'Button',
    packageName: 'com.kodluyoruz.elevator.hardware',
    stereotype: '<<abstract>>',
    description: 'Tüm mekanik ve dijital düğmeler için ortak soyut temel sınıf.',
    specQuote: 'Kontrol panelinde hedef düğmeleri, kapı açma ve kapama düğmeleri ve bir acil durum sinyal düğmesi bulunur. Her katta ayrıca üç set asansör çağrı düğmesi vardır.',
    attributes: [
      { visibility: '#', name: 'state', type: 'ButtonState', description: 'Butonun durumu (ACTIVE, INACTIVE)' },
      { visibility: '#', name: 'label', type: 'string', description: 'Buton üzerindeki etiket' }
    ],
    methods: [
      { visibility: '+', name: 'activate', parameters: 'void', returnType: 'void', description: 'Buton ışığını ve durumunu aktif yapar' },
      { visibility: '+', name: 'deactivate', parameters: 'void', returnType: 'void', description: 'Buton durumunu pasife çeker' },
      { visibility: '+', name: 'press', parameters: 'void', returnType: 'void', description: 'Polimorfik soyut metot: Basılma olayını tetikler (abstract)' }
    ],
    oopPrinciples: [
      {
        pillar: 'Soyutlama',
        explanation: 'Ortak buton özellikleri Button soyut sınıfında toplanmıştır. press() metodu gövdesiz abstract bir metottur.'
      },
      {
        pillar: 'Kalıtım',
        explanation: 'ElevatorButton, FloorCallButton, DoorControlButton, EmergencyButton bu sınıftan türetilir.'
      },
      {
        pillar: 'Polimorfizm',
        explanation: 'press() çağrısı alt sınıflarda farklı somut davranışlar sergiler.'
      }
    ],
    relationships: []
  },
  {
    id: 'elevatorbutton',
    name: 'ElevatorButton',
    packageName: 'com.kodluyoruz.elevator.hardware',
    stereotype: '<<class>>',
    description: 'Kabin içi hedef kat düğmesi (Kat 1..12). Button sınıfından kalıtım alır.',
    specQuote: 'Kontrol panelinde hedef düğmeleri bulunur... yolcu tipik olarak bir veya daha fazla hedef düğmesine basar.',
    attributes: [
      { visibility: '-', name: 'targetFloor', type: 'int', description: 'Hedef kat numarası (1-12)' }
    ],
    methods: [
      { visibility: '+', name: 'press', parameters: 'void', returnType: 'void', description: 'Hedef katı asansör hedef kuyruğuna ekler ve ışığı yakar (override)' }
    ],
    oopPrinciples: [
      {
        pillar: 'Kalıtım',
        explanation: 'Button sınıfından türetilmiştir (Inheritance).'
      },
      {
        pillar: 'Polimorfizm',
        explanation: 'press() metodu kabin hedefini aktive edecek biçimde ezilmiştir (override).'
      }
    ],
    relationships: [
      {
        type: 'inheritance',
        targetClassId: 'button',
        targetClassName: 'Button',
        description: 'Genelleme: ElevatorButton bir Button türüdür.'
      }
    ]
  },
  {
    id: 'floorcallbutton',
    name: 'FloorCallButton',
    packageName: 'com.kodluyoruz.elevator.hardware',
    stereotype: '<<class>>',
    description: 'Katlardaki çağrı istasyonlarında yer alan Yukarı / Aşağı çağrı butonu.',
    specQuote: 'Bir kişi uygun çağrı düğmesine (yukarı veya aşağı) basarak bir asansörü çağırır.',
    attributes: [
      { visibility: '-', name: 'floorNumber', type: 'int', description: 'Butonun bulunduğu kat' },
      { visibility: '-', name: 'callDirection', type: 'Direction', description: 'Çağrı yönü (UP veya DOWN)' }
    ],
    methods: [
      { visibility: '+', name: 'press', parameters: 'void', returnType: 'void', description: 'Çağrıyı Scheduler nesnesine iletir ve butonu ışıklandırır (override)' }
    ],
    oopPrinciples: [
      {
        pillar: 'Kalıtım',
        explanation: 'Button sınıfından türer.'
      },
      {
        pillar: 'Polimorfizm',
        explanation: 'press() metodu kat çağrısını sisteme bildirecek şekilde ezilmiştir.'
      }
    ],
    relationships: [
      {
        type: 'inheritance',
        targetClassId: 'button',
        targetClassName: 'Button',
        description: 'Genelleme: FloorCallButton bir Button türüdür.'
      }
    ]
  },
  {
    id: 'doorcontrolbutton',
    name: 'DoorControlButton',
    packageName: 'com.kodluyoruz.elevator.hardware',
    stereotype: '<<class>>',
    description: 'Kabin içi kapı açma (<|>) ve kapama (>|<) butonu.',
    specQuote: 'Kontrol panelinde ... kapı açma ve kapama düğmeleri bulunur.',
    attributes: [
      { visibility: '-', name: 'actionType', type: 'DoorActionType', description: 'OPEN veya CLOSE' }
    ],
    methods: [
      { visibility: '+', name: 'press', parameters: 'void', returnType: 'void', description: 'Kapıyı anında açar veya açık kalma süresini sonlandırıp kapatır' }
    ],
    oopPrinciples: [
      {
        pillar: 'Kalıtım',
        explanation: 'Button sınıfından türetilmiştir.'
      }
    ],
    relationships: [
      {
        type: 'inheritance',
        targetClassId: 'button',
        targetClassName: 'Button',
        description: 'Genelleme: DoorControlButton bir Button türüdür.'
      }
    ]
  },
  {
    id: 'emergencybutton',
    name: 'EmergencyButton',
    packageName: 'com.kodluyoruz.elevator.hardware',
    stereotype: '<<class>>',
    description: 'Kabin içindeki acil durum sinyal düğmesi.',
    specQuote: '...ve bir acil durum sinyal düğmesi bulunur.',
    attributes: [
      { visibility: '-', name: 'isAlarmActive', type: 'boolean', description: 'Acil durum alarmının aktiflik durumu' }
    ],
    methods: [
      { visibility: '+', name: 'press', parameters: 'void', returnType: 'void', description: 'Acil durum sirenini tetikler ve asansörü acil durdurma moduna alır' }
    ],
    oopPrinciples: [
      {
        pillar: 'Kalıtım',
        explanation: 'Button sınıfından türetilmiştir.'
      }
    ],
    relationships: [
      {
        type: 'inheritance',
        targetClassId: 'button',
        targetClassName: 'Button',
        description: 'Genelleme: EmergencyButton bir Button türüdür.'
      }
    ]
  },
  {
    id: 'door',
    name: 'Door',
    packageName: 'com.kodluyoruz.elevator.hardware',
    stereotype: '<<abstract>>',
    description: 'Kapı mekanizmaları için soyut temel sınıf (State & Timing).',
    specQuote: 'Bir asansör bir katta durduğunda, her iki kapı grubu da önceden belirlenmiş bir süre boyunca otomatik olarak açılarak yolcuların asansöre girip çıkmalarına izin verir.',
    attributes: [
      { visibility: '#', name: 'state', type: 'DoorState', description: 'CLOSED, OPENING, OPEN, CLOSING' },
      { visibility: '#', name: 'openDurationSec', type: 'float = 3.5', description: 'Önceden belirlenmiş otomatik açık kalma süresi' }
    ],
    methods: [
      { visibility: '+', name: 'open', parameters: 'void', returnType: 'void', description: 'Kapıyı açma sekansını başlatır' },
      { visibility: '+', name: 'close', parameters: 'void', returnType: 'void', description: 'Kapıyı kapatır' },
      { visibility: '+', name: 'isOpen', parameters: 'void', returnType: 'boolean', description: 'Kapının açık olup olmadığını kontrol eder' }
    ],
    oopPrinciples: [
      {
        pillar: 'Soyutlama',
        explanation: 'Kapı açılma/kapanma ve açık kalma süresi Door soyut sınıfında toplanmıştır.'
      },
      {
        pillar: 'Kalıtım',
        explanation: 'ElevatorDoor (Kabin Kapısı) ve FloorDoor (Kat Kapısı) bu sınıftan türer.'
      }
    ],
    relationships: []
  },
  {
    id: 'elevatordoor',
    name: 'ElevatorDoor',
    packageName: 'com.kodluyoruz.elevator.hardware',
    stereotype: '<<class>>',
    description: 'Asansör kabininin kendi üzerinde taşıdığı sürgülü kapı.',
    specQuote: 'Her asansörün kendi kapısı, kat gösterge ışığı ve kontrol paneli vardır.',
    attributes: [
      { visibility: '-', name: 'elevatorId', type: 'int', description: 'Ait olduğu asansör ID' }
    ],
    methods: [
      { visibility: '+', name: 'synchronizeWith', parameters: 'floorDoor: FloorDoor', returnType: 'void', description: 'Kat kapısı ile senkronize açılma/kapanma sağlar' }
    ],
    oopPrinciples: [
      {
        pillar: 'Kalıtım',
        explanation: 'Door sınıfından türetilmiştir.'
      }
    ],
    relationships: [
      {
        type: 'inheritance',
        targetClassId: 'door',
        targetClassName: 'Door',
        description: 'Genelleme: ElevatorDoor bir Door türüdür.'
      }
    ]
  },
  {
    id: 'floordoor',
    name: 'FloorDoor',
    packageName: 'com.kodluyoruz.elevator.hardware',
    stereotype: '<<class>>',
    description: 'Katta bulunan 5 adet asansör boşluğu şaft kapısından biri.',
    specQuote: 'Binadaki her katta, beş asansör boşluğunun her biri için bir kapı...',
    attributes: [
      { visibility: '-', name: 'floorNumber', type: 'int', description: 'Bulunduğu kat' },
      { visibility: '-', name: 'shaftElevatorId', type: 'int', description: 'Hangi asansör şaftına ait olduğu (1-5)' }
    ],
    methods: [
      { visibility: '+', name: 'open', parameters: 'void', returnType: 'void', description: 'Asansör geldiğinde açılır' }
    ],
    oopPrinciples: [
      {
        pillar: 'Kalıtım',
        explanation: 'Door sınıfından türetilmiştir.'
      }
    ],
    relationships: [
      {
        type: 'inheritance',
        targetClassId: 'door',
        targetClassName: 'Door',
        description: 'Genelleme: FloorDoor bir Door türüdür.'
      }
    ]
  },
  {
    id: 'indicator',
    name: 'Indicator',
    packageName: 'com.kodluyoruz.elevator.hardware',
    stereotype: '<<abstract>>',
    description: 'Işıklı göstergeler için soyut temel sınıf.',
    specQuote: '...gösterge lambasının yakılması... gösterge ışığı yolcuları asansörün konumu hakkında bilgilendirir.',
    attributes: [
      { visibility: '#', name: 'isLit', type: 'boolean', description: 'Işığın yanık olma durumu' }
    ],
    methods: [
      { visibility: '+', name: 'turnOn', parameters: 'void', returnType: 'void', description: 'Işığı yakar' },
      { visibility: '+', name: 'turnOff', parameters: 'void', returnType: 'void', description: 'Işığı söndürür' }
    ],
    oopPrinciples: [
      {
        pillar: 'Soyutlama',
        explanation: 'Işık yakma/söndürme davranışı soyutlanır.'
      }
    ],
    relationships: []
  },
  {
    id: 'floorindicatorlight',
    name: 'FloorIndicatorLight',
    packageName: 'com.kodluyoruz.elevator.hardware',
    stereotype: '<<class>>',
    description: 'Asansör içindeki kat gösterge ışığı (asansörün anlık konumunu yolculara bildirir).',
    specQuote: 'Asansör kattan kata hareket ederken, asansörün içindeki bir gösterge ışığı yolcuları asansörün konumu hakkında bilgilendirir.',
    attributes: [
      { visibility: '-', name: 'displayedFloor', type: 'int', description: 'Ekranda gösterilen güncel kat numarası' }
    ],
    methods: [
      { visibility: '+', name: 'updateFloor', parameters: 'newFloor: int', returnType: 'void', description: 'Yeni kat numarasını gösterir ve aydınlatır' }
    ],
    oopPrinciples: [
      {
        pillar: 'Kalıtım',
        explanation: 'Indicator sınıfından türetilmiştir.'
      }
    ],
    relationships: [
      {
        type: 'inheritance',
        targetClassId: 'indicator',
        targetClassName: 'Indicator',
        description: 'Genelleme: FloorIndicatorLight bir Indicator türüdür.'
      }
    ]
  },
  {
    id: 'directionsignallight',
    name: 'DirectionSignalLight',
    packageName: 'com.kodluyoruz.elevator.hardware',
    stereotype: '<<class>>',
    description: 'Her kat kapısının üzerinde bulunan, asansörün gelişini ve yönünü gösteren sinyal lambası.',
    specQuote: 'Her kapının üzerinde bulunan bir sinyal ışığı, asansörün gelişini ve asansörün hareket ettiği yönü gösterir.',
    attributes: [
      { visibility: '-', name: 'indicatedDirection', type: 'Direction', description: 'Gösterilen yön oku (UP, DOWN veya ARRIVED)' }
    ],
    methods: [
      { visibility: '+', name: 'illuminateDirection', parameters: 'dir: Direction', returnType: 'void', description: 'İlgili yön okunu yakar' }
    ],
    oopPrinciples: [
      {
        pillar: 'Kalıtım',
        explanation: 'Indicator sınıfından türetilmiştir.'
      }
    ],
    relationships: [
      {
        type: 'inheritance',
        targetClassId: 'indicator',
        targetClassName: 'Indicator',
        description: 'Genelleme: DirectionSignalLight bir Indicator türüdür.'
      }
    ]
  },
  {
    id: 'arrivalbell',
    name: 'ArrivalBell',
    packageName: 'com.kodluyoruz.elevator.hardware',
    stereotype: '<<class>>',
    description: 'Her kat kapısı için varış zili; asansörün kata vardığını sesli olarak bildirir.',
    specQuote: '...ve her kapı için bir varış zili vardır. Varış zili, asansörlerin bir kata vardığını gösterir.',
    attributes: [
      { visibility: '-', name: 'floorNumber', type: 'int', description: 'Zilin bulunduğu kat' },
      { visibility: '-', name: 'shaftId', type: 'int', description: 'İlgili asansör şaft numarası (1-5)' },
      { visibility: '-', name: 'isRinging', type: 'boolean', description: 'Çalma durumu' }
    ],
    methods: [
      { visibility: '+', name: 'ring', parameters: 'void', returnType: 'void', description: 'Varış zilini çalar ("Ding!")' }
    ],
    oopPrinciples: [
      {
        pillar: 'Kapsülleme',
        explanation: 'Ses çalma durumu ve şaft eşleşmesi sınıf içerisinde korunur.'
      }
    ],
    relationships: []
  },
  {
    id: 'elevatorcontrolpanel',
    name: 'ElevatorControlPanel',
    packageName: 'com.kodluyoruz.elevator.hardware',
    stereotype: '<<class>>',
    description: 'Asansör içindeki kontrol paneli. 12 adet hedef butonu, kapı aç/kapa ve acil durum butonu içerir.',
    specQuote: 'Kontrol panelinde hedef düğmeleri, kapı açma ve kapama düğmeleri ve bir acil durum sinyal düğmesi bulunur.',
    attributes: [
      { visibility: '-', name: 'destinationButtons', type: 'ElevatorButton[12]', description: 'Kat 1 ile 12 arasındaki hedef düğmeleri' },
      { visibility: '-', name: 'openDoorButton', type: 'DoorControlButton', description: 'Kapı açma düğmesi' },
      { visibility: '-', name: 'closeDoorButton', type: 'DoorControlButton', description: 'Kapı kapama düğmesi' },
      { visibility: '-', name: 'emergencyButton', type: 'EmergencyButton', description: 'Acil durum sinyal düğmesi' }
    ],
    methods: [
      { visibility: '+', name: 'pressDestination', parameters: 'floor: int', returnType: 'void', description: 'Hedef kat düğmesine basılmasını simüle eder' },
      { visibility: '+', name: 'pressDoorOpen', parameters: 'void', returnType: 'void', description: 'Kapı açma düğmesine basar' },
      { visibility: '+', name: 'pressDoorClose', parameters: 'void', returnType: 'void', description: 'Kapı kapatma düğmesine basar' },
      { visibility: '+', name: 'pressEmergency', parameters: 'void', returnType: 'void', description: 'Acil durum sinyal düğmesine basar' }
    ],
    oopPrinciples: [
      {
        pillar: 'Kapsülleme',
        explanation: 'Paneldeki 15 farklı fiziksel buton tek bir kontrol ünitesi altında toplanmıştır.'
      }
    ],
    relationships: [
      {
        type: 'composition',
        targetClassId: 'elevatorbutton',
        targetClassName: 'ElevatorButton',
        multiplicity: '12',
        role: 'destinationButtons',
        description: 'Bileşim: Kontrol paneli 12 adet hedef butonuna sahiptir.'
      },
      {
        type: 'composition',
        targetClassId: 'doorcontrolbutton',
        targetClassName: 'DoorControlButton',
        multiplicity: '2',
        role: 'doorButtons',
        description: 'Bileşim: Kapı açma ve kapama butonları.'
      },
      {
        type: 'composition',
        targetClassId: 'emergencybutton',
        targetClassName: 'EmergencyButton',
        multiplicity: '1',
        role: 'emergencyButton',
        description: 'Bileşim: Acil durum sinyal butonu.'
      }
    ]
  },
  {
    id: 'hallcallstation',
    name: 'HallCallStation',
    packageName: 'com.kodluyoruz.elevator.hardware',
    stereotype: '<<class>>',
    description: 'Her katta bulunan 3 set çağrı buton panelinden biri.',
    specQuote: 'Her katta ayrıca üç set asansör çağrı düğmesi vardır. Bir kişi uygun çağrı düğmesine (yukarı veya aşağı) basarak bir asansörü çağırır.',
    attributes: [
      { visibility: '-', name: 'stationId', type: 'int', description: 'İstasyon numarası (1, 2 veya 3)' },
      { visibility: '-', name: 'floorNumber', type: 'int', description: 'Bulunduğu kat' },
      { visibility: '-', name: 'upButton', type: 'FloorCallButton', description: 'Yukarı çağrı butonu (en üst katta yoktur)' },
      { visibility: '-', name: 'downButton', type: 'FloorCallButton', description: 'Aşağı çağrı butonu (en alt katta yoktur)' }
    ],
    methods: [
      { visibility: '+', name: 'callUp', parameters: 'void', returnType: 'void', description: 'Yukarı butonuna basar' },
      { visibility: '+', name: 'callDown', parameters: 'void', returnType: 'void', description: 'Aşağı butonuna basar' }
    ],
    oopPrinciples: [
      {
        pillar: 'Kapsülleme',
        explanation: 'Kattaki çağrı düğmelerini paketler ve kat sınırlarına (zemin/çatı) göre filtreler.'
      }
    ],
    relationships: [
      {
        type: 'composition',
        targetClassId: 'floorcallbutton',
        targetClassName: 'FloorCallButton',
        multiplicity: '1..2',
        role: 'callButtons',
        description: 'Bileşim: HallCallStation yukarı ve/veya aşağı çağrı butonlarını içerir.'
      }
    ]
  },
  {
    id: 'ischeduler',
    name: 'IScheduler',
    packageName: 'com.kodluyoruz.elevator.control',
    stereotype: '<<interface>>',
    description: 'Asansör atama ve dağıtım algoritmaları için arayüz (Strategy Pattern).',
    specQuote: 'Bir programlayıcı, aramanın başladığı kata gitmek için beş asansörden birini görevlendirir.',
    attributes: [],
    methods: [
      { visibility: '+', name: 'assignElevator', parameters: 'elevators: List<Elevator>, floor: int, dir: Direction', returnType: 'Elevator', description: 'En uygun asansörü seçerek döndürür' }
    ],
    oopPrinciples: [
      {
        pillar: 'Soyutlama',
        explanation: 'Dağıtım algoritmasının detayları IScheduler arayüzü ile asansör çağırma akışından soyutlanmıştır.'
      },
      {
        pillar: 'Polimorfizm',
        explanation: 'EnergySavingScheduler ve alternatif algoritmalar çalışma anında birbirlerinin yerine kullanılabilir.'
      }
    ],
    relationships: []
  },
  {
    id: 'energysavingscheduler',
    name: 'EnergySavingScheduler',
    packageName: 'com.kodluyoruz.elevator.control',
    stereotype: '<<class>>',
    description: 'Yalnızca gerektiğinde hareket eden, minimum enerji tüketimini hedefleyen programlayıcı.',
    specQuote: 'Asansörler enerji tasarruflu olacak şekilde tasarlanmıştır, bu nedenle yalnızca gerektiğinde hareket ederler.',
    attributes: [],
    methods: [
      { visibility: '+', name: 'assignElevator', parameters: 'elevators: List<Elevator>, floor: int, dir: Direction', returnType: 'Elevator', description: 'Enerji tasarrufuna göre en düşük maliyetli asansörü atar (override)' }
    ],
    oopPrinciples: [
      {
        pillar: 'Polimorfizm',
        explanation: 'IScheduler arayüzünü uygular (Realization / Polymorphic method invocation).'
      }
    ],
    relationships: [
      {
        type: 'realization',
        targetClassId: 'ischeduler',
        targetClassName: 'IScheduler',
        description: 'Gerçekleme: EnergySavingScheduler IScheduler arayüzünü uygular.'
      }
    ]
  },
  {
    id: 'simulationclock',
    name: 'SimulationClock',
    packageName: 'com.kodluyoruz.elevator.sim',
    stereotype: '<<class>>',
    description: 'Zaman geçişini ve olay zaman damgalarını yöneten simülasyon saati.',
    specQuote: 'Simülatör, gerçek zaman geçişini simüle etmek ve simülasyonda meydana gelen olayları zaman damgası ve günlüğe kaydetmek için bir "saat" kullanır.',
    attributes: [
      { visibility: '-', name: 'secondsElapsed', type: 'long', description: 'Simülasyon başlangıcından itibaren geçen saniye' },
      { visibility: '-', name: 'isRunning', type: 'boolean', description: 'Saatin çalışma durumu' },
      { visibility: '-', name: 'speedMultiplier', type: 'int', description: 'Hızlandırma katsayısı (1x, 2x, 5x)' }
    ],
    methods: [
      { visibility: '+', name: 'start', parameters: 'void', returnType: 'void', description: 'Saati başlatır' },
      { visibility: '+', name: 'pause', parameters: 'void', returnType: 'void', description: 'Saati duraklatır' },
      { visibility: '+', name: 'tick', parameters: 'void', returnType: 'void', description: 'Bir birim zaman ilerletir' },
      { visibility: '+', name: 'getFormattedTimestamp', parameters: 'void', returnType: 'string', description: 'SS:DD:SN formatında zaman damgası döndürür' }
    ],
    oopPrinciples: [
      {
        pillar: 'Kapsülleme',
        explanation: 'Zaman akışı ve zamanlayıcı iç yapısı sınıf içinde saklıdır.'
      }
    ],
    relationships: []
  },
  {
    id: 'randompassengergenerator',
    name: 'RandomPassengerGenerator',
    packageName: 'com.kodluyoruz.elevator.sim',
    stereotype: '<<class>>',
    description: 'Yolcuları ve kalkış/varış katlarını rastgele üreten simülasyon bileşeni.',
    specQuote: 'Simülatör tarafından yolcu oluşturmak ve her yolcu için kalkış ve varış katlarını belirlemek için rastgele bir sayı üreteci kullanılır.',
    attributes: [
      { visibility: '-', name: 'namesPool', type: 'string[]', description: 'Örnek yolcu isimleri havuzu' }
    ],
    methods: [
      { visibility: '+', name: 'generatePassenger', parameters: 'totalFloors: int', returnType: 'Passenger', description: 'Kalkış != Varış olacak şekilde rastgele yolcu üretir' }
    ],
    oopPrinciples: [
      {
        pillar: 'Kapsülleme',
        explanation: 'Rastgele sayı üretim kuralları ve yolcu parametreleri fonksiyon içine hapsedilmiştir.'
      }
    ],
    relationships: [
      {
        type: 'dependency',
        targetClassId: 'passenger',
        targetClassName: 'Passenger',
        description: 'Bağımlılık: generatePassenger() Passenger nesneleri üretir.'
      }
    ]
  },
  {
    id: 'passenger',
    name: 'Passenger',
    packageName: 'com.kodluyoruz.elevator.model',
    stereotype: '<<class>>',
    description: 'Asansörü kullanan yetişkin yolcu nesnesi.',
    specQuote: 'Her asansörün yaklaşık altı yetişkin yolcu kapasitesi vardır... Bir kişi uygun çağrı düğmesine basarak bir asansörü çağırır.',
    attributes: [
      { visibility: '-', name: 'id', type: 'string', description: 'Benzersiz yolcu ID' },
      { visibility: '-', name: 'name', type: 'string', description: 'Yolcu Adı Soyadı' },
      { visibility: '-', name: 'sourceFloor', type: 'int', description: 'Biniş (kalkış) katı' },
      { visibility: '-', name: 'destinationFloor', type: 'int', description: 'İniş (varış) katı' },
      { visibility: '-', name: 'weightKg', type: 'double', description: 'Yolcu ağırlığı (~70 kg)' },
      { visibility: '-', name: 'state', type: 'PassengerState', description: 'WAITING, TRAVELLING, ARRIVED' }
    ],
    methods: [
      { visibility: '+', name: 'pressCallButton', parameters: 'station: HallCallStation', returnType: 'void', description: 'Katta yukarı veya aşağı çağrı butonuna basar' },
      { visibility: '+', name: 'enterElevator', parameters: 'elevator: Elevator', returnType: 'void', description: 'Kabin içine biner ve kontrol panelinde hedefine basar' },
      { visibility: '+', name: 'leaveElevator', parameters: 'void', returnType: 'void', description: 'Hedef kata varınca asansörden iner' }
    ],
    oopPrinciples: [
      {
        pillar: 'Kapsülleme',
        explanation: 'Yolcu bilgileri ve ağırlık ölçümü güvenli private alanlarda saklanır.'
      }
    ],
    relationships: []
  }
];

export const MERMAID_UML_CODE = `classDiagram
    direction TB
    
    %% ==========================================
    %% KODLUYORUZ SİGORTA ŞİRKETİ ASANSÖR SİSTEMİ
    %% TASARIM & MİMARİ: ENES ÖZTÜRK
    %% ==========================================

    class Building {
        -String name
        -Floor[12] floors
        -Elevator[5] elevators
        -IScheduler scheduler
        -SimulationClock clock
        +Building(name: String)
        +getFloor(floorNumber: int) Floor
        +getElevator(id: int) Elevator
        +requestElevator(floor: int, dir: Direction) void
    }

    class Elevator {
        -int id
        -int currentFloor
        -Direction direction
        -ElevatorState state
        -int maxCapacity = 6
        -List~Passenger~ passengers
        -ElevatorDoor door
        -FloorIndicatorLight indicatorLight
        -ElevatorControlPanel controlPanel
        -Set~int~ targetFloors
        +addTargetFloor(floor: int) boolean
        +addPassenger(passenger: Passenger) boolean
        +stepMovement() boolean
        +determineNextState() void
        +toggleEmergency() void
    }

    class Floor {
        -int floorNumber
        -Map~int, FloorDoor~ shaftDoors
        -Map~int, ArrivalBell~ arrivalBells
        -Map~int, DirectionSignalLight~ signalLights
        -HallCallStation[3] callStations
        -List~Passenger~ waitingPassengers
        +notifyArrival(elevatorId: int, dir: Direction) void
        +addWaitingPassenger(p: Passenger) void
        +getDoor(elevatorId: int) FloorDoor
    }

    class Button {
        <<abstract>>
        #ButtonState state
        #String label
        +activate() void
        +deactivate() void
        +press()* void
    }

    class ElevatorButton {
        -int targetFloor
        +press() void
    }

    class FloorCallButton {
        -int floorNumber
        -Direction callDirection
        +press() void
    }

    class DoorControlButton {
        -DoorActionType actionType
        +press() void
    }

    class EmergencyButton {
        -boolean isAlarmActive
        +press() void
    }

    class Door {
        <<abstract>>
        #DoorState state
        #float openDurationSec = 3.5
        +open() void
        +close() void
        +isOpen() boolean
    }

    class ElevatorDoor {
        -int elevatorId
        +synchronizeWith(floorDoor: FloorDoor) void
    }

    class FloorDoor {
        -int floorNumber
        -int shaftElevatorId
        +open() void
    }

    class Indicator {
        <<abstract>>
        #boolean isLit
        +turnOn() void
        +turnOff() void
    }

    class FloorIndicatorLight {
        -int displayedFloor
        +updateFloor(newFloor: int) void
    }

    class DirectionSignalLight {
        -Direction indicatedDirection
        +illuminateDirection(dir: Direction) void
    }

    class ArrivalBell {
        -int floorNumber
        -int shaftId
        -boolean isRinging
        +ring() void
    }

    class ElevatorControlPanel {
        -ElevatorButton[12] destinationButtons
        -DoorControlButton openDoorButton
        -DoorControlButton closeDoorButton
        -EmergencyButton emergencyButton
        +pressDestination(floor: int) void
        +pressDoorOpen() void
        +pressDoorClose() void
        +pressEmergency() void
    }

    class HallCallStation {
        -int stationId
        -int floorNumber
        -FloorCallButton upButton
        -FloorCallButton downButton
        +callUp() void
        +callDown() void
    }

    class IScheduler {
        <<interface>>
        +assignElevator(elevators, floor, dir)* Elevator
    }

    class EnergySavingScheduler {
        +assignElevator(elevators, floor, dir) Elevator
    }

    class SimulationClock {
        -long secondsElapsed
        -boolean isRunning
        -int speedMultiplier
        +start() void
        +pause() void
        +tick() void
        +getFormattedTimestamp() String
    }

    class RandomPassengerGenerator {
        -String[] namesPool
        +generatePassenger(totalFloors: int) Passenger
    }

    class Passenger {
        -String id
        -String name
        -int sourceFloor
        -int destinationFloor
        -double weightKg
        -PassengerState state
        +pressCallButton(station: HallCallStation) void
        +enterElevator(elevator: Elevator) void
        +leaveElevator() void
    }

    %% İLİŞKİLER (RELATIONSHIPS)
    %% Kalıtım (Inheritance / Generalization)
    Button <|-- ElevatorButton
    Button <|-- FloorCallButton
    Button <|-- DoorControlButton
    Button <|-- EmergencyButton

    Door <|-- ElevatorDoor
    Door <|-- FloorDoor

    Indicator <|-- FloorIndicatorLight
    Indicator <|-- DirectionSignalLight

    %% Gerçekleme (Realization / Interface Implementation)
    IScheduler <|.. EnergySavingScheduler

    %% Bileşim (Composition - Siyah Baklava)
    Elevator *-- ElevatorDoor : 1
    Elevator *-- FloorIndicatorLight : 1
    Elevator *-- ElevatorControlPanel : 1

    ElevatorControlPanel *-- ElevatorButton : 12
    ElevatorControlPanel *-- DoorControlButton : 2
    ElevatorControlPanel *-- EmergencyButton : 1

    Floor *-- FloorDoor : 5
    Floor *-- ArrivalBell : 5
    Floor *-- DirectionSignalLight : 5
    Floor *-- HallCallStation : 3

    HallCallStation *-- FloorCallButton : 1..2

    %% Agregasyon (Aggregation - Beyaz Baklava)
    Building o-- Floor : 12
    Building o-- Elevator : 5

    %% Birliktelik & Bağımlılık (Association & Dependency)
    Building --> IScheduler : scheduler
    Building --> SimulationClock : clock
    Elevator --> Passenger : 0..6 (yolcular)
    Floor --> Passenger : waiting
    RandomPassengerGenerator ..> Passenger : creates
`;

export const PLANTUML_CODE = `@startuml
title Kodluyoruz Sigorta Şirketi 12 Katlı Ofis Binası Asansör Sistemi UML Sınıf Diyagramı\\nYazar & Tasarım: Enes Öztürk

skinparam classAttributeIconSize 0
skinparam monochrome false
skinparam roundcorner 10
skinparam shadowing true

package "Bina & Çekirdek Model" {
    class Building {
        - String name
        - Floor[12] floors
        - Elevator[5] elevators
        - IScheduler scheduler
        - SimulationClock clock
        + Building(name: String)
        + getFloor(floorNumber: int): Floor
        + getElevator(id: int): Elevator
        + requestElevator(floor: int, dir: Direction): void
    }

    class Elevator {
        - int id
        - int currentFloor
        - Direction direction
        - ElevatorState state
        - int maxCapacity = 6
        - List<Passenger> passengers
        - ElevatorDoor door
        - FloorIndicatorLight indicatorLight
        - ElevatorControlPanel controlPanel
        - Set<Integer> targetFloors
        + addTargetFloor(floor: int): boolean
        + addPassenger(p: Passenger): boolean
        + stepMovement(): boolean
        + determineNextState(): void
        + toggleEmergency(): void
    }

    class Floor {
        - int floorNumber
        - Map<Integer, FloorDoor> shaftDoors
        - Map<Integer, ArrivalBell> arrivalBells
        - Map<Integer, DirectionSignalLight> signalLights
        - HallCallStation[3] callStations
        - List<Passenger> waitingPassengers
        + notifyArrival(elevatorId: int, dir: Direction): void
        + addWaitingPassenger(p: Passenger): void
        + getDoor(elevatorId: int): FloorDoor
    }

    class Passenger {
        - String id
        - String name
        - int sourceFloor
        - int destinationFloor
        - double weightKg
        + pressCallButton(station: HallCallStation): void
        + enterElevator(elevator: Elevator): void
        + leaveElevator(): void
    }
}

package "Donanım & Aygıtlar (Hardware)" {
    abstract class Button {
        # ButtonState state
        # String label
        + activate(): void
        + deactivate(): void
        + {abstract} press(): void
    }

    class ElevatorButton extends Button {
        - int targetFloor
        + press(): void
    }

    class FloorCallButton extends Button {
        - int floorNumber
        - Direction callDirection
        + press(): void
    }

    class DoorControlButton extends Button {
        - DoorActionType actionType
        + press(): void
    }

    class EmergencyButton extends Button {
        - boolean isAlarmActive
        + press(): void
    }

    abstract class Door {
        # DoorState state
        # float openDurationSec = 3.5
        + open(): void
        + close(): void
        + isOpen(): boolean
    }

    class ElevatorDoor extends Door {
        - int elevatorId
        + synchronizeWith(floorDoor: FloorDoor): void
    }

    class FloorDoor extends Door {
        - int floorNumber
        - int shaftElevatorId
        + open(): void
    }

    abstract class Indicator {
        # boolean isLit
        + turnOn(): void
        + turnOff(): void
    }

    class FloorIndicatorLight extends Indicator {
        - int displayedFloor
        + updateFloor(newFloor: int): void
    }

    class DirectionSignalLight extends Indicator {
        - Direction indicatedDirection
        + illuminateDirection(dir: Direction): void
    }

    class ArrivalBell {
        - int floorNumber
        - int shaftId
        - boolean isRinging
        + ring(): void
    }

    class ElevatorControlPanel {
        - ElevatorButton[12] destinationButtons
        - DoorControlButton openDoorButton
        - DoorControlButton closeDoorButton
        - EmergencyButton emergencyButton
        + pressDestination(floor: int): void
    }

    class HallCallStation {
        - int stationId
        - int floorNumber
        - FloorCallButton upButton
        - FloorCallButton downButton
        + callUp(): void
        + callDown(): void
    }
}

package "Kontrol, Dağıtım & Simülasyon" {
    interface IScheduler {
        + {abstract} assignElevator(elevators: List<Elevator>, floor: int, dir: Direction): Elevator
    }

    class EnergySavingScheduler implements IScheduler {
        + assignElevator(elevators: List<Elevator>, floor: int, dir: Direction): Elevator
    }

    class SimulationClock {
        - long secondsElapsed
        - boolean isRunning
        - int speedMultiplier
        + start(): void
        + pause(): void
        + tick(): void
        + getFormattedTimestamp(): String
    }

    class RandomPassengerGenerator {
        - String[] namesPool
        + generatePassenger(totalFloors: int): Passenger
    }
}

' İlişkiler (Relationships)
Building "1" *-- "12" Floor : aggregates
Building "1" *-- "5" Elevator : aggregates
Building --> "1" IScheduler
Building --> "1" SimulationClock

Elevator "1" *-- "1" ElevatorDoor : composition
Elevator "1" *-- "1" FloorIndicatorLight : composition
Elevator "1" *-- "1" ElevatorControlPanel : composition
Elevator "1" o-- "0..6" Passenger : transports

Floor "1" *-- "5" FloorDoor : composition
Floor "1" *-- "5" ArrivalBell : composition
Floor "1" *-- "5" DirectionSignalLight : composition
Floor "1" *-- "3" HallCallStation : composition

HallCallStation "1" *-- "1..2" FloorCallButton : composition
ElevatorControlPanel "1" *-- "12" ElevatorButton : composition
ElevatorControlPanel "1" *-- "2" DoorControlButton : composition
ElevatorControlPanel "1" *-- "1" EmergencyButton : composition

RandomPassengerGenerator ..> Passenger : creates

@enduml`;
