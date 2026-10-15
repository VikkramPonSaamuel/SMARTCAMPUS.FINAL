export type SystemStatusLevel = 'normal' | 'warning' | 'critical';

export type TwinLayerMode =
  | 'buildings'
  | 'occupancy'
  | 'energy'
  | 'security'
  | 'parking'
  | 'environment';

export interface BuildingFloor {
  level: number;
  name: string;
  occupancy: number;
  activeRooms: number;
  totalRooms: number;
  temp: number;
}

export interface BuildingData {
  id: string;
  code: string; // e.g., "BLOCK A"
  name: string; // e.g., "Main Academic Building"
  shortName: string;
  category: 'academic' | 'tech' | 'library' | 'research' | 'amenity' | 'parking';
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  accentColor: string;
  occupancy: number; // percentage 0-100
  currentPeople: number;
  capacity: number;
  energyKw: number; // e.g. 4.2
  solarOutputKw: number;
  roomsAvailable: number;
  totalRooms: number;
  status: SystemStatusLevel;
  temperature: number;
  aqi: number;
  humidity: number;
  description: string;
  floors: BuildingFloor[];
}

export interface RoomScheduleSlot {
  time: string;
  course: string;
  instructor: string;
  status: 'completed' | 'ongoing' | 'upcoming' | 'free';
}

export interface SmartRoom {
  id: string;
  code: string; // e.g., "ROOM B204"
  name: string;
  buildingId: string;
  buildingName: string;
  floor: number;
  capacity: number;
  currentOccupancy: number;
  temperature: number;
  humidity: number;
  co2Ppm: number;
  projector: 'Working' | 'Standby' | 'Maintenance';
  ac: 'ON' | 'OFF' | 'ECO';
  lighting: 'Auto' | 'Dimmed' | 'Off';
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE';
  nextAvailable: string;
  distanceMeters?: number;
  timetable: RoomScheduleSlot[];
}

export interface EnergyDataPoint {
  label: string;
  consumption: number;
  solar: number;
  predicted: number;
  baseline: number;
}

export interface BuildingEnergyComparison {
  building: string;
  code: string;
  current: number;
  average: number;
  solar: number;
  efficiency: number;
  anomaly: boolean;
}

export interface SecurityIncident {
  id: string;
  code: string; // e.g., "INCIDENT #1042"
  location: string; // e.g., "Block B — Floor 2"
  buildingId: string;
  type: string; // e.g., "Fire Alert"
  severity: 'Critical' | 'Warning' | 'Info';
  time: string; // e.g., "09:42 AM"
  status: 'Active' | 'Investigating' | 'Resolved';
  description: string;
  assignedUnit: string;
  coordinates: [number, number, number];
  aiConfidence: number;
}

export interface SecurityCamera {
  id: string;
  name: string;
  location: string;
  buildingId: string;
  status: 'Online' | 'Offline';
  peopleDetected: number;
  anomalyScore: number;
}

export interface ParkingSlotItem {
  id: string;
  number: string;
  status: 'available' | 'occupied' | 'reserved' | 'ev-charging';
  vehiclePlate?: string;
  duration?: string;
}

export interface ParkingZoneData {
  id: string;
  name: string; // e.g., "Zone A"
  subtitle: string;
  occupancyPercent: number; // e.g., 83
  totalSpaces: number;
  availableSpaces: number;
  occupiedSpaces: number;
  reservedSpaces: number;
  evChargersAvailable: number;
  position: [number, number, number];
  slots: ParkingSlotItem[];
}

export interface MaintenanceTicketItem {
  id: string;
  ticketId: string; // e.g., "TKT-8942"
  issue: string;
  description: string;
  category: 'Electrical' | 'HVAC' | 'Plumbing' | 'Network' | 'Structural' | 'AV Equipment';
  location: string;
  buildingId: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  assignedTeam: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  time: string;
  aiClassification: {
    label: string;
    confidence: number;
    recommendedAction: string;
  };
}

export interface SmartAlert {
  id: string;
  title: string;
  location: string;
  buildingId: string;
  severity: SystemStatusLevel;
  aiConfidence: number;
  timestamp: string;
  description: string;
  metric: string;
  recommendation: string;
  acknowledged?: boolean;
}

export interface CampusSystemStatus {
  id: string;
  name: 'Power' | 'Network' | 'Water' | 'Security' | 'Environment';
  status: SystemStatusLevel;
  label: string;
  metric: string;
  uptime: string;
}

export interface NavigationNode {
  id: string;
  name: string;
  position: [number, number, number];
  buildingId?: string;
}

export interface NavigationRouteData {
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  walkingMinutes: number;
  distanceMeters: number;
  crowdLevel: 'Low' | 'Moderate' | 'High';
  accessibility: 'Available' | 'Elevator Required';
  waypoints: [number, number, number][];
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  structuredCard?: {
    type: 'room' | 'navigation' | 'energy' | 'maintenance' | 'parking';
    title: string;
    subtitle: string;
    metrics: { label: string; value: string }[];
    actionLabel?: string;
    actionRoute?: string;
  };
}

export interface FacultyProfile {
  id: string;
  name: string;
  facultyCode: string;
  department: string;
  designation: string;
}

export interface FacultySessionLog {
  id: string;
  facultyName: string;
  facultyCode: string;
  roomNumber: string;
  blockId: string;
  blockName: string;
  subjectAndCourse: string;
  timing: string;
  inTime: string;
  outTime: string | null;
  status: 'IN' | 'OUT';
}

export type CanteenName = 'MOJO Cafe' | 'JEVAN' | 'SSS Canteen';

export type CanteenCategory =
  | 'South Indian & Tiffin'
  | 'Meals & Biryani'
  | 'Quick Bites & Snacks'
  | 'Fresh Juices & Beverages'
  | 'Healthy & Salads';

export interface CanteenMenuItem {
  id: string;
  name: string;
  canteenName: CanteenName;
  category: CanteenCategory;
  canteenBlock: string;
  price: number;
  defaultPrepMins: number;
  isVeg: boolean;
  calories: string;
  rating: number;
  popular?: boolean;
  description: string;
  available: boolean;
}

export interface CanteenOrderItem {
  menuItemId: string;
  name: string;
  canteenName?: CanteenName;
  price: number;
  quantity: number;
  isVeg: boolean;
}

export interface CanteenOrder {
  id: string;
  orderCode: string;
  canteenName: CanteenName;
  studentName: string;
  studentRollNo: string;
  blockId: string;
  blockName: string;
  classroomNumber: string;
  deliveryMode: 'Classroom Delivery' | 'Express Counter Pickup';
  breakSlot: string;
  notes?: string;
  items: CanteenOrderItem[];
  subtotal: number;
  deliveryFee: number;
  confirmedCost: number;
  prepTimeMinutes: number | null;
  status:
    | 'Pending Owner Quote'
    | 'Quote & QR Sent'
    | 'Paid & Preparing'
    | 'Out for Classroom Delivery'
    | 'Delivered';
  paymentStatus: 'Awaiting Owner Quote' | 'QR Ready - Unpaid' | 'Paid via UPI QR';
  upiPayload: string;
  createdAt: string;
  updatedAt: string;
}



