import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  BuildingData,
  TwinLayerMode,
  SmartRoom,
  SmartAlert,
  MaintenanceTicketItem,
  ParkingZoneData,
  NavigationRouteData,
  AIMessage,
  SecurityIncident,
  FacultyProfile,
  FacultySessionLog,
  CanteenMenuItem,
  CanteenOrder,
  CanteenOrderItem,
  CanteenName,
} from '../types/campus';
import {
  BUILDINGS,
  SMART_ROOMS,
  SMART_ALERTS,
  INITIAL_MAINTENANCE_TICKETS,
  PARKING_ZONES,
  SECURITY_INCIDENTS,
  INITIAL_AI_MESSAGES,
  computeNavigationRoute,
  LIVE_CAMPUS_METRICS,
} from '../data/campusData';
import {
  DEFAULT_GEMINI_API_KEY,
  generateCampusAiResponse,
  deriveStructuredCard,
} from '../services/geminiService';

interface CampusContextValue {
  buildings: BuildingData[];
  selectedBuildingId: string | null;
  setSelectedBuildingId: (id: string | null) => void;
  selectedBuilding: BuildingData | null;
  activeLayer: TwinLayerMode;
  setActiveLayer: (layer: TwinLayerMode) => void;
  isNavigating: boolean;
  setIsNavigating: (val: boolean) => void;
  navFrom: string;
  setNavFrom: (id: string) => void;
  navTo: string;
  setNavTo: (id: string) => void;
  activeRoute: NavigationRouteData;
  isNavModalOpen: boolean;
  setIsNavModalOpen: (open: boolean) => void;
  rooms: SmartRoom[];
  toggleRoomAc: (roomId: string) => void;
  reserveRoom: (roomId: string) => void;
  alerts: SmartAlert[];
  acknowledgeAlert: (alertId: string) => void;
  tickets: MaintenanceTicketItem[];
  addMaintenanceTicket: (ticket: {
    category: MaintenanceTicketItem['category'];
    location: string;
    buildingId: string;
    description: string;
    priority: MaintenanceTicketItem['priority'];
  }) => MaintenanceTicketItem;
  updateTicketStatus: (id: string, status: MaintenanceTicketItem['status']) => void;
  parkingZones: ParkingZoneData[];
  toggleParkingSlot: (zoneId: string, slotId: string) => void;
  incidents: SecurityIncident[];
  resolveIncident: (id: string) => void;
  aiMessages: AIMessage[];
  sendAiMessage: (prompt: string) => void;
  isAiTyping: boolean;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  aiModelUsed: string;
  liveMetrics: typeof LIVE_CAMPUS_METRICS;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  isFacultyLoggedIn: boolean;
  facultyProfile: FacultyProfile;
  loginFaculty: (profile?: Partial<FacultyProfile>) => void;
  logoutFaculty: () => void;
  facultySessions: FacultySessionLog[];
  facultyCheckIn: (payload: {
    roomNumber: string;
    blockId: string;
    subjectAndCourse: string;
    timing: string;
  }) => FacultySessionLog;
  facultyCheckOut: (sessionId?: string) => void;
  canteenMenu: CanteenMenuItem[];
  canteenOrders: CanteenOrder[];
  placeStudentOrder: (payload: {
    canteenName: CanteenName;
    studentName: string;
    studentRollNo: string;
    blockId: string;
    classroomNumber: string;
    deliveryMode: CanteenOrder['deliveryMode'];
    breakSlot: string;
    notes?: string;
    items: CanteenOrderItem[];
  }) => CanteenOrder;
  canteenOwnerSendQuoteAndQr: (
    orderId: string,
    prepTimeMinutes: number,
    confirmedCost: number
  ) => void;
  markOrderPaidViaQr: (orderId: string) => void;
  updateCanteenOrderStatus: (orderId: string, status: CanteenOrder['status']) => void;
  toggleMenuItemAvailability: (itemId: string) => void;
}

const DEFAULT_FACULTY_PROFILE: FacultyProfile = {
  id: 'fac-01',
  name: 'Dr. R. Subramanian',
  facultyCode: 'VISTAS-FAC-1042',
  department: 'School of Computing & AI Engineering',
  designation: 'Senior Professor & Smart Lab Coordinator',
};

const INITIAL_CANTEEN_MENU: CanteenMenuItem[] = [
  // ==========================================
  // 1. MOJO Cafe (Artisan Cafe, Paninis, Wraps & Cold Brews)
  // ==========================================
  {
    id: 'mojo-1',
    name: 'Grilled Peri-Peri Paneer & Corn Panini',
    canteenName: 'MOJO Cafe',
    category: 'Quick Bites & Snacks',
    canteenBlock: '1. MOJO Cafe • Block 29 Plaza',
    price: 90,
    defaultPrepMins: 9,
    isVeg: true,
    calories: '390 kcal',
    rating: 4.9,
    popular: true,
    description: 'Artisan sourdough grilled with peri-peri cottage cheese, sweet corn, and melted cheddar.',
    available: true,
  },
  {
    id: 'mojo-2',
    name: 'Crispy Chicken Zinger Wrap & Peri Fries',
    canteenName: 'MOJO Cafe',
    category: 'Quick Bites & Snacks',
    canteenBlock: '1. MOJO Cafe • Block 29 Plaza',
    price: 125,
    defaultPrepMins: 11,
    isVeg: false,
    calories: '520 kcal',
    rating: 4.8,
    popular: true,
    description: 'Warm tortilla wrap loaded with crunchy chicken strips, chipotle slaw, and spiced fries.',
    available: true,
  },
  {
    id: 'mojo-3',
    name: 'Cold Brew Hazelnut Frappe (350ml)',
    canteenName: 'MOJO Cafe',
    category: 'Fresh Juices & Beverages',
    canteenBlock: '1. MOJO Cafe • Block 29 Plaza',
    price: 75,
    defaultPrepMins: 5,
    isVeg: true,
    calories: '210 kcal',
    rating: 4.9,
    popular: true,
    description: 'Double-shot Arabica espresso blended with roasted hazelnut & chilled creamy milk.',
    available: true,
  },
  {
    id: 'mojo-4',
    name: 'Classic Margherita Wood-Fired Mini Pizza (8")',
    canteenName: 'MOJO Cafe',
    category: 'Quick Bites & Snacks',
    canteenBlock: '1. MOJO Cafe • Block 29 Plaza',
    price: 110,
    defaultPrepMins: 12,
    isVeg: true,
    calories: '460 kcal',
    rating: 4.8,
    description: 'Hand-stretched crust topped with San Marzano basil sauce & fresh mozzarella.',
    available: true,
  },
  {
    id: 'mojo-5',
    name: 'Belgian Dark Chocolate Waffle & Iced Latte',
    canteenName: 'MOJO Cafe',
    category: 'Fresh Juices & Beverages',
    canteenBlock: '1. MOJO Cafe • Block 29 Plaza',
    price: 95,
    defaultPrepMins: 8,
    isVeg: true,
    calories: '380 kcal',
    rating: 4.9,
    description: 'Crispy Brussels waffle drizzled with warm 54% dark chocolate fudge + chilled latte.',
    available: true,
  },
  {
    id: 'mojo-6',
    name: 'Mediterranean Grilled Chicken & Avocado Sub',
    canteenName: 'MOJO Cafe',
    category: 'Healthy & Salads',
    canteenBlock: '1. MOJO Cafe • Block 29 Plaza',
    price: 130,
    defaultPrepMins: 10,
    isVeg: false,
    calories: '410 kcal',
    rating: 4.7,
    description: 'Multigrain sub roll filled with herb-roasted chicken, avocado slices, olives & pesto.',
    available: true,
  },

  // ==========================================
  // 2. JEVAN (Signature Biryani, Thalis, Wok Bowls & Salads)
  // ==========================================
  {
    id: 'jevan-1',
    name: 'Ambur Chicken Dum Biryani + Onion Raita',
    canteenName: 'JEVAN',
    category: 'Meals & Biryani',
    canteenBlock: '2. JEVAN • Block 12 Food Court',
    price: 150,
    defaultPrepMins: 15,
    isVeg: false,
    calories: '680 kcal',
    rating: 4.9,
    popular: true,
    description: 'Traditional seeraga samba chicken dum biryani served with brinjal thokku & chilled raita.',
    available: true,
  },
  {
    id: 'jevan-2',
    name: 'Executive Paneer Butter Masala Thali',
    canteenName: 'JEVAN',
    category: 'Meals & Biryani',
    canteenBlock: '2. JEVAN • Block 12 Food Court',
    price: 135,
    defaultPrepMins: 12,
    isVeg: true,
    calories: '610 kcal',
    rating: 4.8,
    popular: true,
    description: '2 Phulkas, jeera pulao, rich paneer makhani, dal tadka, salad & warm gulab jamun.',
    available: true,
  },
  {
    id: 'jevan-3',
    name: 'Schezwan Veg Fried Rice & Gobi Manchurian Bowl',
    canteenName: 'JEVAN',
    category: 'Meals & Biryani',
    canteenBlock: '2. JEVAN • Block 12 Food Court',
    price: 115,
    defaultPrepMins: 12,
    isVeg: true,
    calories: '540 kcal',
    rating: 4.7,
    description: 'Wok-tossed aromatic fried rice topped with crispy cauliflower manchurian gravy.',
    available: true,
  },
  {
    id: 'jevan-4',
    name: 'JEVAN Special South Indian Banana Leaf Meals',
    canteenName: 'JEVAN',
    category: 'Meals & Biryani',
    canteenBlock: '2. JEVAN • Block 12 Food Court',
    price: 120,
    defaultPrepMins: 10,
    isVeg: true,
    calories: '640 kcal',
    rating: 4.9,
    popular: true,
    description: 'Steamed ponni rice, sambar, vathakulambu, rasam, kootu, poriyal, curd, appalam & payasam.',
    available: true,
  },
  {
    id: 'jevan-5',
    name: 'Roasted Chicken & Quinoa Power Bowl',
    canteenName: 'JEVAN',
    category: 'Healthy & Salads',
    canteenBlock: '2. JEVAN • Block 12 Food Court',
    price: 145,
    defaultPrepMins: 12,
    isVeg: false,
    calories: '420 kcal',
    rating: 4.9,
    description: 'Herb-grilled chicken breast, fluffy quinoa, cherry tomatoes, broccoli & tahini drizzle.',
    available: true,
  },
  {
    id: 'jevan-6',
    name: 'High-Protein Sprouted Moong & Avocado Salad',
    canteenName: 'JEVAN',
    category: 'Healthy & Salads',
    canteenBlock: '2. JEVAN • Block 12 Food Court',
    price: 110,
    defaultPrepMins: 8,
    isVeg: true,
    calories: '260 kcal',
    rating: 4.8,
    description: 'Sprouted green gram, diced cucumber, pomegranate, feta crumble & lemon-herb dressing.',
    available: true,
  },

  // ==========================================
  // 3. SSS Canteen (Hot South Indian Tiffin, Dosas, Chaat & Fresh Juices)
  // ==========================================
  {
    id: 'sss-1',
    name: 'Ghee Podi Masala Dosa & Filter Coffee',
    canteenName: 'SSS Canteen',
    category: 'South Indian & Tiffin',
    canteenBlock: '3. SSS Canteen • Block 7 Main',
    price: 85,
    defaultPrepMins: 10,
    isVeg: true,
    calories: '410 kcal',
    rating: 4.9,
    popular: true,
    description: 'Crispy roasted dosa with house-ground Madurai podi, sambar, 3 chutneys & hot filter coffee.',
    available: true,
  },
  {
    id: 'sss-2',
    name: 'Mini Sambar Idli (14 pcs) + Crispy Medu Vada',
    canteenName: 'SSS Canteen',
    category: 'South Indian & Tiffin',
    canteenBlock: '3. SSS Canteen • Block 7 Main',
    price: 70,
    defaultPrepMins: 8,
    isVeg: true,
    calories: '340 kcal',
    rating: 4.8,
    popular: true,
    description: 'Steamed mini idlis soaked in aromatic arachuvitta sambar with crispy golden medu vada.',
    available: true,
  },
  {
    id: 'sss-3',
    name: 'Madurai Flaky Bun Parotta (2 pcs) & Veg/Chicken Salna',
    canteenName: 'SSS Canteen',
    category: 'South Indian & Tiffin',
    canteenBlock: '3. SSS Canteen • Block 7 Main',
    price: 80,
    defaultPrepMins: 10,
    isVeg: true,
    calories: '490 kcal',
    rating: 4.9,
    popular: true,
    description: 'Multi-layered soft golden bun parottas served piping hot with aromatic spiced salna.',
    available: true,
  },
  {
    id: 'sss-4',
    name: 'Punjabi Samosa Chaat Bowl (2 pcs)',
    canteenName: 'SSS Canteen',
    category: 'Quick Bites & Snacks',
    canteenBlock: '3. SSS Canteen • Block 7 Main',
    price: 60,
    defaultPrepMins: 6,
    isVeg: true,
    calories: '320 kcal',
    rating: 4.7,
    description: 'Crushed golden samosas topped with chana masala, sweetened yogurt, tamarind & mint chutney.',
    available: true,
  },
  {
    id: 'sss-5',
    name: 'Fresh Watermelon & Mint Cold-Pressed Juice',
    canteenName: 'SSS Canteen',
    category: 'Fresh Juices & Beverages',
    canteenBlock: '3. SSS Canteen • Block 7 Main',
    price: 55,
    defaultPrepMins: 5,
    isVeg: true,
    calories: '110 kcal',
    rating: 4.8,
    description: 'Zero added sugar, 100% chilled watermelon pressed with fresh garden mint leaves.',
    available: true,
  },
  {
    id: 'sss-6',
    name: 'Kumbakonam Degree Filter Coffee & Onion Bajji (4 pcs)',
    canteenName: 'SSS Canteen',
    category: 'South Indian & Tiffin',
    canteenBlock: '3. SSS Canteen • Block 7 Main',
    price: 50,
    defaultPrepMins: 6,
    isVeg: true,
    calories: '240 kcal',
    rating: 4.8,
    description: 'Traditional brass-davara frothy filter coffee paired with hot crispy onion bajjis & chutney.',
    available: true,
  },
];

const INITIAL_CANTEEN_ORDERS: CanteenOrder[] = [
  {
    id: 'ord-101',
    orderCode: 'MOJO-4092',
    canteenName: 'MOJO Cafe',
    studentName: 'Arjun Mehta',
    studentRollNo: '22CS1048',
    blockId: 'block-17',
    blockName: '17. Computer Science',
    classroomNumber: 'ROOM C-204',
    deliveryMode: 'Classroom Delivery',
    breakSlot: '11:15 AM Short Break',
    notes: 'Deliver outside Lab C-204 corridor',
    items: [
      {
        menuItemId: 'mojo-1',
        name: 'Grilled Peri-Peri Paneer & Corn Panini',
        canteenName: 'MOJO Cafe',
        price: 90,
        quantity: 1,
        isVeg: true,
      },
      {
        menuItemId: 'mojo-3',
        name: 'Cold Brew Hazelnut Frappe (350ml)',
        canteenName: 'MOJO Cafe',
        price: 75,
        quantity: 1,
        isVeg: true,
      },
    ],
    subtotal: 165,
    deliveryFee: 10,
    confirmedCost: 175,
    prepTimeMinutes: 12,
    status: 'Quote & QR Sent',
    paymentStatus: 'QR Ready - Unpaid',
    upiPayload:
      'upi://pay?pa=mojocafe.vistas@okaxis&pn=MOJO%20Cafe%20CampusOS&tr=MOJO-4092&am=175&cu=INR',
    createdAt: '2 mins ago',
    updatedAt: 'Just now',
  },
  {
    id: 'ord-102',
    orderCode: 'JEV-4093',
    canteenName: 'JEVAN',
    studentName: 'Priya Darshini',
    studentRollNo: '23AI2019',
    blockId: 'block-12',
    blockName: '12. Food Court / Steve Jobs Block',
    classroomNumber: 'ROOM B-302',
    deliveryMode: 'Classroom Delivery',
    breakSlot: '01:00 PM Lunch Break',
    notes: 'Extra onion raita please',
    items: [
      {
        menuItemId: 'jevan-1',
        name: 'Ambur Chicken Dum Biryani + Onion Raita',
        canteenName: 'JEVAN',
        price: 150,
        quantity: 2,
        isVeg: false,
      },
      {
        menuItemId: 'jevan-6',
        name: 'High-Protein Sprouted Moong & Avocado Salad',
        canteenName: 'JEVAN',
        price: 110,
        quantity: 1,
        isVeg: true,
      },
    ],
    subtotal: 410,
    deliveryFee: 10,
    confirmedCost: 420,
    prepTimeMinutes: null,
    status: 'Pending Owner Quote',
    paymentStatus: 'Awaiting Owner Quote',
    upiPayload: '',
    createdAt: 'Just now',
    updatedAt: 'Just now',
  },
  {
    id: 'ord-103',
    orderCode: 'SSS-4089',
    canteenName: 'SSS Canteen',
    studentName: 'Karthik Rajan',
    studentRollNo: '21EC1105',
    blockId: 'block-1',
    blockName: '1. Velan Block',
    classroomNumber: 'ROOM M-101',
    deliveryMode: 'Express Counter Pickup',
    breakSlot: '11:15 AM Short Break',
    items: [
      {
        menuItemId: 'sss-1',
        name: 'Ghee Podi Masala Dosa & Filter Coffee',
        canteenName: 'SSS Canteen',
        price: 85,
        quantity: 1,
        isVeg: true,
      },
      {
        menuItemId: 'sss-5',
        name: 'Fresh Watermelon & Mint Cold-Pressed Juice',
        canteenName: 'SSS Canteen',
        price: 55,
        quantity: 1,
        isVeg: true,
      },
    ],
    subtotal: 140,
    deliveryFee: 0,
    confirmedCost: 140,
    prepTimeMinutes: 10,
    status: 'Paid & Preparing',
    paymentStatus: 'Paid via UPI QR',
    upiPayload:
      'upi://pay?pa=ssscanteen.vistas@okaxis&pn=SSS%20Canteen%20CampusOS&tr=SSS-4089&am=140&cu=INR',
    createdAt: '8 mins ago',
    updatedAt: '4 mins ago',
  },
];

const INITIAL_FACULTY_SESSIONS: FacultySessionLog[] = [
  {
    id: 'fsess-1',
    facultyName: 'Dr. R. Subramanian',
    facultyCode: 'VISTAS-FAC-1042',
    roomNumber: 'ROOM B204',
    blockId: 'block-12',
    blockName: '12. Steve Jobs Block',
    subjectAndCourse: 'CS-401 Deep Reinforcement Learning • B.Tech AI & DS',
    timing: '08:30 AM - 10:00 AM',
    inTime: '08:28 AM',
    outTime: '10:02 AM',
    status: 'OUT',
  },
  {
    id: 'fsess-2',
    facultyName: 'Dr. R. Subramanian',
    facultyCode: 'VISTAS-FAC-1042',
    roomNumber: 'ROOM M101',
    blockId: 'block-1',
    blockName: '1. Dr. MGR Block',
    subjectAndCourse: 'ENG-102 Quantum Mechanics & Photonics • B.E. ECE',
    timing: '10:15 AM - 11:45 AM',
    inTime: '10:14 AM',
    outTime: null,
    status: 'IN',
  },
];

const CampusContext = createContext<CampusContextValue | undefined>(undefined);

export const CampusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [buildings, setBuildings] = useState<BuildingData[]>(BUILDINGS);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<TwinLayerMode>('buildings');

  // Navigation mode state
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [isNavModalOpen, setIsNavModalOpen] = useState<boolean>(false);
  const [navFrom, setNavFrom] = useState<string>('gate-3');
  const [navTo, setNavTo] = useState<string>('block-12');

  // Interactive datasets
  const [rooms, setRooms] = useState<SmartRoom[]>(SMART_ROOMS);
  const [alerts, setAlerts] = useState<SmartAlert[]>(SMART_ALERTS);
  const [tickets, setTickets] = useState<MaintenanceTicketItem[]>(INITIAL_MAINTENANCE_TICKETS);
  const [parkingZones, setParkingZones] = useState<ParkingZoneData[]>(PARKING_ZONES);
  const [incidents, setIncidents] = useState<SecurityIncident[]>(SECURITY_INCIDENTS);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>(INITIAL_AI_MESSAGES);
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const [geminiApiKey, setGeminiApiKey] = useState<string>(DEFAULT_GEMINI_API_KEY);
  const [aiModelUsed, setAiModelUsed] = useState<string>('gemini-3.1-flash-lite');
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [liveMetrics, setLiveMetrics] = useState(LIVE_CAMPUS_METRICS);

  // Faculty Portal State
  const [isFacultyLoggedIn, setIsFacultyLoggedIn] = useState<boolean>(false);
  const [facultyProfile, setFacultyProfile] = useState<FacultyProfile>(DEFAULT_FACULTY_PROFILE);
  const [facultySessions, setFacultySessions] = useState<FacultySessionLog[]>(INITIAL_FACULTY_SESSIONS);

  // Smart Canteen State
  const [canteenMenu, setCanteenMenu] = useState<CanteenMenuItem[]>(INITIAL_CANTEEN_MENU);
  const [canteenOrders, setCanteenOrders] = useState<CanteenOrder[]>(INITIAL_CANTEEN_ORDERS);

  // Subtle live telemetry heartbeat every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics((prev) => {
        const deltaOcc = Math.floor(Math.random() * 5) - 2;
        const nextOcc = Math.max(2750, Math.min(2950, prev.liveOccupancy + deltaOcc));
        const deltaPower = (Math.random() * 0.06 - 0.03);
        const nextPower = Number(Math.max(4.5, Math.min(5.2, prev.currentPowerMw + deltaPower)).toFixed(2));
        return {
          ...prev,
          liveOccupancy: nextOcc,
          currentPowerMw: nextPower,
        };
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const selectedBuilding = useMemo(
    () => buildings.find((b) => b.id === selectedBuildingId) || null,
    [buildings, selectedBuildingId]
  );

  const activeRoute = useMemo(
    () => computeNavigationRoute(navFrom, navTo),
    [navFrom, navTo]
  );

  const toggleRoomAc = (roomId: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId) return r;
        const nextAc = r.ac === 'ON' ? 'ECO' : r.ac === 'ECO' ? 'OFF' : 'ON';
        return { ...r, ac: nextAc };
      })
    );
  };

  const reserveRoom = (roomId: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId) return r;
        const isAvailable = r.status === 'AVAILABLE';
        return {
          ...r,
          status: isAvailable ? 'RESERVED' : 'AVAILABLE',
          nextAvailable: isAvailable ? 'Reserved by Admin (Now)' : 'Available Now',
        };
      })
    );
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  };

  const addMaintenanceTicket = (input: {
    category: MaintenanceTicketItem['category'];
    location: string;
    buildingId: string;
    description: string;
    priority: MaintenanceTicketItem['priority'];
  }): MaintenanceTicketItem => {
    const confidenceMap: Record<MaintenanceTicketItem['category'], { label: string; conf: number; rec: string }> = {
      Electrical: {
        label: 'Electrical Issue',
        conf: 96,
        rec: 'Isolate sub-circuit breaker and dispatch HV diagnostic crew.',
      },
      HVAC: {
        label: 'HVAC & Thermal Anomaly',
        conf: 94,
        rec: 'Recalibrate VAV damper actuator and verify chilled water loop.',
      },
      Plumbing: {
        label: 'Hydraulic / Flow Issue',
        conf: 93,
        rec: 'Actuate zone shutoff valve and inspect acoustic flow sensor.',
      },
      Network: {
        label: 'Optical / Wi-Fi 7 Mesh Fault',
        conf: 97,
        rec: 'Reroute traffic via redundant core switch and reset AP node.',
      },
      Structural: {
        label: 'Civil & Access Infrastructure',
        conf: 91,
        rec: 'Schedule facilities engineering inspection within 4 hours.',
      },
      'AV Equipment': {
        label: 'Smart Classroom AV System',
        conf: 95,
        rec: 'Trigger remote firmware diagnostic on laser projection matrix.',
      },
    };

    const teamMap: Record<MaintenanceTicketItem['category'], string> = {
      Electrical: 'Grid & HV Systems Unit',
      HVAC: 'Safety & HVAC Automation',
      Plumbing: 'Hydro & Civil Engineering',
      Network: 'Optical & Wireless Core',
      Structural: 'Campus Facilities Ops',
      'AV Equipment': 'Smart Classroom AV Ops',
    };

    const aiInfo = confidenceMap[input.category];
    const newTicket: MaintenanceTicketItem = {
      id: `tkt-${Date.now()}`,
      ticketId: `TKT-${Math.floor(8945 + Math.random() * 50)}`,
      issue: input.description.slice(0, 64) || `${input.category} service request`,
      description: input.description,
      category: input.category,
      location: input.location,
      buildingId: input.buildingId,
      priority: input.priority,
      assignedTeam: teamMap[input.category],
      status: 'Open',
      time: 'Just now',
      aiClassification: {
        label: aiInfo.label,
        confidence: aiInfo.conf,
        recommendedAction: aiInfo.rec,
      },
    };

    setTickets((prev) => [newTicket, ...prev]);
    return newTicket;
  };

  const updateTicketStatus = (id: string, status: MaintenanceTicketItem['status']) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const toggleParkingSlot = (zoneId: string, slotId: string) => {
    setParkingZones((prev) =>
      prev.map((zone) => {
        if (zone.id !== zoneId) return zone;
        const updatedSlots = zone.slots.map((slot) => {
          if (slot.id !== slotId) return slot;
          const nextStatus: typeof slot.status =
            slot.status === 'available' ? 'occupied' : 'available';
          return {
            ...slot,
            status: nextStatus,
            vehiclePlate: nextStatus === 'occupied' ? 'EV-908' : undefined,
            duration: nextStatus === 'occupied' ? 'Just arrived' : undefined,
          };
        });
        const availDelta = updatedSlots.filter((s) => s.status === 'available').length -
          zone.slots.filter((s) => s.status === 'available').length;
        const newAvail = Math.max(0, zone.availableSpaces + availDelta);
        const newOcc = Math.max(0, zone.occupiedSpaces - availDelta);
        const newPct = Math.round(((newOcc + zone.reservedSpaces) / zone.totalSpaces) * 100);
        return {
          ...zone,
          availableSpaces: newAvail,
          occupiedSpaces: newOcc,
          occupancyPercent: newPct,
          slots: updatedSlots,
        };
      })
    );
  };

  const resolveIncident = (id: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: 'Resolved' } : inc))
    );
  };

  const sendAiMessage = (prompt: string) => {
    if (!prompt.trim()) return;
    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const nextHistory = [...aiMessages, userMsg];
    setAiMessages(nextHistory);
    setIsAiTyping(true);

    const snapshot = {
      buildings,
      rooms,
      parkingZones,
      tickets,
      alerts,
      canteenMenu,
      canteenOrders,
      facultySessions,
      liveMetrics,
    };

    const structuredCard = deriveStructuredCard(prompt, snapshot);

    generateCampusAiResponse(prompt, aiMessages, snapshot, geminiApiKey)
      .then(({ text, modelUsed }) => {
        setAiModelUsed(modelUsed);
        const aiMsg: AIMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          structuredCard,
        };
        setAiMessages((prev) => [...prev, aiMsg]);
      })
      .catch(() => {
        // Intelligent local telemetry fallback if network is unreachable
        const q = prompt.toLowerCase();
        let responseText = '';

        if (q.includes('classroom') || q.includes('room') || q.includes('b204')) {
          responseText =
            'Room B204 is available now.\n\nCapacity: 60 • Distance: 120m • AC: Available (23°C)\nAdditionally, Room B302 (40 seats) and Room A208 (45 seats) are ready for smart booking.';
        } else if (q.includes('canteen') || q.includes('mojo') || q.includes('jevan') || q.includes('sss')) {
          responseText =
            'All 3 Campus Canteens are open for classroom QR ordering:\n• 1. MOJO Cafe (Block 29): Paninis, Wraps & Cold Brews\n• 2. JEVAN (Block 12): Ambur Biryani, Thalis & Banana Leaf Meals\n• 3. SSS Canteen (Block 7): Ghee Podi Dosa, Sambar Idli & Filter Coffee';
        } else if (q.includes('parking') || q.includes('slot') || q.includes('ev')) {
          responseText =
            'Zone C currently has the highest availability with 40 open bays (42% occupancy) and 9 EV superchargers free.';
        } else if (q.includes('energy') || q.includes('power') || q.includes('solar')) {
          responseText =
            'Campus power draw is currently 4.82 MW with 18.6% energy saved via predictive HVAC optimization.';
        } else {
          responseText = `CampusOS Neural Core analyzed your request: "${prompt}". All 30 campus blocks and 3 smart canteens (MOJO Cafe, JEVAN, SSS Canteen) are online.`;
        }

        const aiMsg: AIMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          structuredCard,
        };
        setAiMessages((prev) => [...prev, aiMsg]);
      })
      .finally(() => {
        setIsAiTyping(false);
      });
  };

  const loginFaculty = (profile?: Partial<FacultyProfile>) => {
    if (profile) {
      setFacultyProfile((prev) => ({
        ...prev,
        ...profile,
      }));
    }
    setIsFacultyLoggedIn(true);
  };

  const logoutFaculty = () => {
    setIsFacultyLoggedIn(false);
  };

  const facultyCheckIn = (payload: {
    roomNumber: string;
    blockId: string;
    subjectAndCourse: string;
    timing: string;
  }): FacultySessionLog => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const blk = buildings.find((b) => b.id === payload.blockId);
    const blockName = blk ? `${blk.id.replace('block-', '')}. ${blk.name}` : payload.blockId;

    const newSession: FacultySessionLog = {
      id: `fsess-${Date.now()}`,
      facultyName: facultyProfile.name,
      facultyCode: facultyProfile.facultyCode,
      roomNumber: payload.roomNumber.trim().toUpperCase(),
      blockId: payload.blockId,
      blockName,
      subjectAndCourse: payload.subjectAndCourse.trim(),
      timing: payload.timing.trim(),
      inTime: nowStr,
      outTime: null,
      status: 'IN',
    };

    setFacultySessions((prev) => [newSession, ...prev]);

    // Sync with Smart Classrooms if a matching room exists
    setRooms((prev) =>
      prev.map((r) => {
        const roomMatches =
          r.code.toLowerCase() === payload.roomNumber.trim().toLowerCase() ||
          r.code.toLowerCase().includes(payload.roomNumber.trim().toLowerCase());
        if (!roomMatches) return r;
        return {
          ...r,
          status: 'OCCUPIED',
          ac: 'ON',
          lighting: 'Auto',
          nextAvailable: `In Session (${payload.timing})`,
          timetable: [
            {
              time: payload.timing,
              course: payload.subjectAndCourse,
              instructor: facultyProfile.name,
              status: 'ongoing',
            },
            ...r.timetable,
          ],
        };
      })
    );

    return newSession;
  };

  const facultyCheckOut = (sessionId?: string) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let checkedOutRoom = '';

    setFacultySessions((prev) =>
      prev.map((sess) => {
        const isTarget = sessionId ? sess.id === sessionId : sess.status === 'IN';
        if (!isTarget || sess.status === 'OUT') return sess;
        checkedOutRoom = sess.roomNumber;
        return {
          ...sess,
          outTime: nowStr,
          status: 'OUT',
        };
      })
    );

    if (checkedOutRoom) {
      setRooms((prev) =>
        prev.map((r) => {
          if (r.code.toLowerCase() !== checkedOutRoom.toLowerCase()) return r;
          return {
            ...r,
            status: 'AVAILABLE',
            ac: 'ECO',
            nextAvailable: 'Available Now (Faculty Checked Out)',
          };
        })
      );
    }
  };

  const placeStudentOrder = (payload: {
    canteenName: CanteenName;
    studentName: string;
    studentRollNo: string;
    blockId: string;
    classroomNumber: string;
    deliveryMode: CanteenOrder['deliveryMode'];
    breakSlot: string;
    notes?: string;
    items: CanteenOrderItem[];
  }): CanteenOrder => {
    const blk = buildings.find((b) => b.id === payload.blockId);
    const blockName = blk ? `${blk.id.replace('block-', '')}. ${blk.name}` : payload.blockId;
    const subtotal = payload.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const deliveryFee = payload.deliveryMode === 'Classroom Delivery' ? 10 : 0;
    const confirmedCost = subtotal + deliveryFee;
    const prefix =
      payload.canteenName === 'MOJO Cafe'
        ? 'MOJO'
        : payload.canteenName === 'JEVAN'
        ? 'JEV'
        : 'SSS';
    const orderCode = `${prefix}-${Math.floor(4100 + Math.random() * 890)}`;

    const newOrder: CanteenOrder = {
      id: `ord-${Date.now()}`,
      orderCode,
      canteenName: payload.canteenName,
      studentName: payload.studentName.trim() || 'Student User',
      studentRollNo: payload.studentRollNo.trim() || '22CS1088',
      blockId: payload.blockId,
      blockName,
      classroomNumber: payload.classroomNumber.trim().toUpperCase() || 'ROOM C-204',
      deliveryMode: payload.deliveryMode,
      breakSlot: payload.breakSlot,
      notes: payload.notes,
      items: payload.items,
      subtotal,
      deliveryFee,
      confirmedCost,
      prepTimeMinutes: null,
      status: 'Pending Owner Quote',
      paymentStatus: 'Awaiting Owner Quote',
      upiPayload: '',
      createdAt: 'Just now',
      updatedAt: 'Just now',
    };

    setCanteenOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const canteenOwnerSendQuoteAndQr = (
    orderId: string,
    prepTimeMinutes: number,
    confirmedCost: number
  ) => {
    setCanteenOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const cleanPrep = Math.max(1, Math.round(prepTimeMinutes));
        const cleanCost = Math.max(1, Math.round(confirmedCost));
        return {
          ...ord,
          prepTimeMinutes: cleanPrep,
          confirmedCost: cleanCost,
          status: 'Quote & QR Sent',
          paymentStatus:
            ord.paymentStatus === 'Paid via UPI QR' ? 'Paid via UPI QR' : 'QR Ready - Unpaid',
          upiPayload: `upi://pay?pa=vistas.canteen@okaxis&pn=${encodeURIComponent(
            ord.canteenName
          )}&tr=${ord.orderCode}&am=${cleanCost}&cu=INR`,
          updatedAt: 'Just now',
        };
      })
    );
  };

  const markOrderPaidViaQr = (orderId: string) => {
    setCanteenOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          paymentStatus: 'Paid via UPI QR',
          status: ord.status === 'Quote & QR Sent' ? 'Paid & Preparing' : ord.status,
          updatedAt: 'Paid just now',
        };
      })
    );
  };

  const updateCanteenOrderStatus = (orderId: string, status: CanteenOrder['status']) => {
    setCanteenOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          status,
          updatedAt: 'Just now',
        };
      })
    );
  };

  const toggleMenuItemAvailability = (itemId: string) => {
    setCanteenMenu((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, available: !item.available } : item))
    );
  };

  return (
    <CampusContext.Provider
      value={{
        buildings,
        selectedBuildingId,
        setSelectedBuildingId,
        selectedBuilding,
        activeLayer,
        setActiveLayer,
        isNavigating,
        setIsNavigating,
        navFrom,
        setNavFrom,
        navTo,
        setNavTo,
        activeRoute,
        isNavModalOpen,
        setIsNavModalOpen,
        rooms,
        toggleRoomAc,
        reserveRoom,
        alerts,
        acknowledgeAlert,
        tickets,
        addMaintenanceTicket,
        updateTicketStatus,
        parkingZones,
        toggleParkingSlot,
        incidents,
        resolveIncident,
        aiMessages,
        sendAiMessage,
        isAiTyping,
        geminiApiKey,
        setGeminiApiKey,
        aiModelUsed,
        liveMetrics,
        globalSearch,
        setGlobalSearch,
        isFacultyLoggedIn,
        facultyProfile,
        loginFaculty,
        logoutFaculty,
        facultySessions,
        facultyCheckIn,
        facultyCheckOut,
        canteenMenu,
        canteenOrders,
        placeStudentOrder,
        canteenOwnerSendQuoteAndQr,
        markOrderPaidViaQr,
        updateCanteenOrderStatus,
        toggleMenuItemAvailability,
      }}
    >
      {children}
    </CampusContext.Provider>
  );
};

export const useCampus = () => {
  const ctx = useContext(CampusContext);
  if (!ctx) throw new Error('useCampus must be used within a CampusProvider');
  return ctx;
};
