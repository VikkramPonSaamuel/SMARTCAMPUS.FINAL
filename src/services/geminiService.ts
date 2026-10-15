import {
  AIMessage,
  BuildingData,
  CanteenMenuItem,
  CanteenOrder,
  FacultySessionLog,
  MaintenanceTicketItem,
  ParkingZoneData,
  SmartAlert,
  SmartRoom,
} from '../types/campus';

export const DEFAULT_GEMINI_API_KEY =
  (import.meta as unknown as { env?: Record<string, string> })?.env
    ?.VITE_GEMINI_API_KEY || '';

const GEMINI_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
];

export interface CampusTelemetrySnapshot {
  buildings: BuildingData[];
  rooms: SmartRoom[];
  parkingZones: ParkingZoneData[];
  tickets: MaintenanceTicketItem[];
  alerts: SmartAlert[];
  canteenMenu: CanteenMenuItem[];
  canteenOrders: CanteenOrder[];
  facultySessions: FacultySessionLog[];
  liveMetrics: {
    liveOccupancy: number;
    currentPowerMw: number;
    energySavedPercent: number;
    campusHealthPercent: number;
  };
}

function buildSystemInstruction(snapshot: CampusTelemetrySnapshot): string {
  const availableRooms = snapshot.rooms
    .filter((r) => r.status === 'AVAILABLE')
    .map(
      (r) =>
        `${r.code} (${r.name}, ${r.buildingName}, Cap: ${r.capacity}, AC: ${r.ac}, Temp: ${r.temperature}°C)`
    )
    .join('; ');

  const parkingSummary = snapshot.parkingZones
    .map(
      (z) =>
        `${z.name}: ${z.availableSpaces}/${z.totalSpaces} open (${z.occupancyPercent}% full, ${z.evChargersAvailable} EV chargers free)`
    )
    .join(' | ');

  const canteenSummary = ['MOJO Cafe', 'JEVAN', 'SSS Canteen']
    .map((cName) => {
      const items = snapshot.canteenMenu
        .filter((m) => m.canteenName === cName && m.available)
        .map((m) => `${m.name} (₹${m.price}, ~${m.defaultPrepMins}m)`)
        .join(', ');
      return `${cName}: ${items}`;
    })
    .join('\n');

  const activeAlerts = snapshot.alerts
    .filter((a) => !a.acknowledged)
    .map((a) => `${a.title} at ${a.location} (${a.metric})`)
    .join('; ');

  const activeFaculty = snapshot.facultySessions
    .filter((f) => f.status === 'IN')
    .map((f) => `${f.facultyName} in ${f.roomNumber} (${f.blockName}) for ${f.subjectAndCourse}`)
    .join('; ');

  return `You are CampusOS Neural Core v4.2, the intelligent AI operating system for VISTAS Smart Campus.
Respond concisely, helpful, and accurately using the live campus telemetry below. Use clean bullet points where appropriate and keep responses under 120 words.

LIVE CAMPUS TELEMETRY:
- Campus Health: ${snapshot.liveMetrics.campusHealthPercent}% | Active People: ${snapshot.liveMetrics.liveOccupancy} | Power Load: ${snapshot.liveMetrics.currentPowerMw} MW (${snapshot.liveMetrics.energySavedPercent}% saved via Solar + AI HVAC).
- Total Campus Blocks: 30 (including 1. Velan Block, 2. Ratan Tata Block, 7. Main Canteen, 12. Food Court, 17. Computer Science, 18. Library, 24. Auditorium, 29. Snacks Bar).
- Available Smart Classrooms Right Now: ${availableRooms || 'Room B204, Room B302, Room A208'}.
- Active Faculty Sessions (IN): ${activeFaculty || 'Dr. R. Subramanian in ROOM M101 (Block 1)'}.
- Smart Parking Live Status: ${parkingSummary}.
- 3 Campus Canteens & Live Menus (Classroom-to-Kitchen QR Ordering available at /canteen):
${canteenSummary}
- Active Campus Alerts: ${activeAlerts || 'None'}.
- Open Maintenance Tickets: ${snapshot.tickets.length} active tickets.`;
}

export function deriveStructuredCard(
  prompt: string,
  snapshot: CampusTelemetrySnapshot
): AIMessage['structuredCard'] | undefined {
  const q = prompt.toLowerCase();

  if (
    q.includes('canteen') ||
    q.includes('food') ||
    q.includes('mojo') ||
    q.includes('jevan') ||
    q.includes('sss') ||
    q.includes('menu') ||
    q.includes('biryani') ||
    q.includes('dosa') ||
    q.includes('coffee') ||
    q.includes('eat') ||
    q.includes('order')
  ) {
    return {
      type: 'navigation',
      title: 'Smart Canteen • 1. MOJO Cafe • 2. JEVAN • 3. SSS',
      subtitle: 'Classroom-to-Kitchen Ordering & Instant UPI QR Payment',
      metrics: [
        { label: '1. MOJO Cafe', value: 'Paninis & Cold Brew (6-11m)' },
        { label: '2. JEVAN', value: 'Biryani & Thalis (10-15m)' },
        { label: '3. SSS Canteen', value: 'Dosa, Idli & Coffee (5-10m)' },
        { label: 'Payment', value: 'Live Owner Quote + UPI QR' },
      ],
      actionLabel: 'Open Smart Canteen & QR App',
      actionRoute: '/canteen',
    };
  }

  if (
    q.includes('classroom') ||
    q.includes('room') ||
    q.includes('b204') ||
    q.includes('block') ||
    q.includes('free') ||
    q.includes('study')
  ) {
    const openRoom =
      snapshot.rooms.find((r) => r.status === 'AVAILABLE') || snapshot.rooms[0];
    return {
      type: 'room',
      title: `${openRoom.code} • ${openRoom.name}`,
      subtitle: `${openRoom.buildingName} • ${openRoom.status}`,
      metrics: [
        { label: 'Capacity', value: `${openRoom.capacity} Seats` },
        { label: 'Temperature', value: `${openRoom.temperature}°C` },
        { label: 'AC Status', value: openRoom.ac },
        { label: 'Projector', value: openRoom.projector },
      ],
      actionLabel: 'View in Smart Classrooms',
      actionRoute: '/classrooms',
    };
  }

  if (q.includes('parking') || q.includes('slot') || q.includes('car') || q.includes('ev')) {
    return {
      type: 'parking',
      title: 'Smart Parking • Zone C Recommended',
      subtitle: 'Live Ultrasonic & Camera Bay Telemetry',
      metrics: [
        { label: 'Zone C Open', value: '40 Bays (42%)' },
        { label: 'Zone B Open', value: '27 Bays (61%)' },
        { label: 'Zone A Open', value: '10 Bays (83%)' },
        { label: 'EV Chargers', value: '18 Available' },
      ],
      actionLabel: 'Open Parking Matrix',
      actionRoute: '/parking',
    };
  }

  if (
    q.includes('energy') ||
    q.includes('power') ||
    q.includes('solar') ||
    q.includes('hvac')
  ) {
    return {
      type: 'energy',
      title: 'Campus Energy Telemetry',
      subtitle: `${snapshot.liveMetrics.currentPowerMw} MW Active • ${snapshot.liveMetrics.energySavedPercent}% Saved Today`,
      metrics: [
        { label: 'Current Load', value: `${snapshot.liveMetrics.currentPowerMw} MW` },
        { label: 'Solar Yield', value: '18.7% Offset' },
        { label: 'CO₂ Saved', value: '2.8 Tons' },
        { label: 'Anomaly', value: 'Block C Floor 2' },
      ],
      actionLabel: 'Inspect Energy Intelligence',
      actionRoute: '/energy',
    };
  }

  if (
    q.includes('maintenance') ||
    q.includes('report') ||
    q.includes('issue') ||
    q.includes('fault') ||
    q.includes('repair')
  ) {
    return {
      type: 'maintenance',
      title: 'AI Maintenance Dispatch Ready',
      subtitle: 'Auto-Classification • 96% Confidence',
      metrics: [
        { label: 'Active Tickets', value: `${snapshot.tickets.length} Open` },
        { label: 'Critical SLA', value: '03 Priority' },
        { label: 'Avg Response', value: '6.4 mins' },
        { label: 'AI Triage', value: '96% Accuracy' },
      ],
      actionLabel: 'Open Maintenance Hub',
      actionRoute: '/maintenance',
    };
  }

  if (q.includes('navigate') || q.includes('route') || q.includes('map') || q.includes('twin')) {
    return {
      type: 'navigation',
      title: '3D Digital Twin & Google Maps Navigation',
      subtitle: '30 VISTAS Campus Blocks • Shortest Path Routing',
      metrics: [
        { label: 'Campus Blocks', value: '30 Active' },
        { label: 'Route Mode', value: '3D Google Maps Style' },
        { label: 'Crowd Level', value: 'Low / Optimal' },
        { label: 'Accessibility', value: '100% Ramp Ready' },
      ],
      actionLabel: 'Open 3D Digital Twin',
      actionRoute: '/digital-twin',
    };
  }

  return undefined;
}

export async function generateCampusAiResponse(
  prompt: string,
  history: AIMessage[],
  snapshot: CampusTelemetrySnapshot,
  customApiKey?: string
): Promise<{ text: string; modelUsed: string }> {
  const apiKey = (customApiKey || DEFAULT_GEMINI_API_KEY).trim();
  const systemInstruction = buildSystemInstruction(snapshot);

  // Convert recent conversation history (last 6 messages) to Gemini format
  const recentContents = history.slice(-6).map((m) => ({
    role: m.sender === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }));

  const contents = [
    ...recentContents,
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ];

  let lastError = '';

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
        apiKey
      )}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents,
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 360,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const text =
          data?.candidates?.[0]?.content?.parts
            ?.map((p: { text?: string }) => p.text || '')
            .join('')
            .trim() || '';
        if (text) {
          return { text, modelUsed: model };
        }
      } else {
        lastError = data?.error?.message || `HTTP ${response.status}`;
      }
    } catch (err) {
      lastError = err instanceof Error ? err.message : 'Network error';
    }
  }

  throw new Error(lastError || 'Unable to reach Gemini API');
}
