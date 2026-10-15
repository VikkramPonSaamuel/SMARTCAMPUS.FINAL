# CAMPUSOS — Autonomous Smart Campus 3D Digital Twin & Operating System

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r174-black.svg)](https://threejs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)](https://vitejs.dev/)

An autonomous, futuristic 3D Digital Twin and operating system for modern university campuses. Combines real-time telemetry, spatial occupancy heatmaps, smart grid energy optimization, Google Maps-style pedestrian wayfinding, classroom-to-kitchen QR canteen ordering, and Google Gemini AI assistance into a unified command platform.

---

## 🌟 Key Features

### 1. 3D Spatial Digital Twin & Procedural Architecture
- **Interactive 30-Block VISTAS Campus**: Complete spatial model of VELS Institute of Science, Technology & Advanced Studies (VISTAS) with all 30 numbered blocks, pedestrian avenues, and access gates.
- **Realistic Procedural Facades**: Limestone ashlar masonry, tinted curtain-wall glass, terracotta residential dormitories, and architectural roof decks.
- **6 Real-Time Telemetry Layers**:
  - **Buildings Mode**: Architectural inspection with camera auto-fly on block selection.
  - **Occupancy Heatmap Mode**: Volumetric luminescent density based on live student headcounts.
  - **Energy Flow Mode**: Animated power conduits and solar generation feeds.
  - **Security & Perimeter Mode**: Active incident beacons and perimeter surveillance coverage.
  - **Smart Mobility & Parking Mode**: Live bay occupancy across Gate 1, 2, and 3 zones.
  - **AQI & Micro-Climate Mode**: Environmental comfort telemetry and tree canopy highlights.

### 2. Google Maps-Style 3D Campus Wayfinding
- **Dijkstra Shortest-Path Algorithm**: Dynamic navigation graph routing along actual paved roads and sidewalks.
- **Turn-by-Turn Telemetry**: Live walking time (minutes), pedestrian distance (meters), crowd density, and accessibility levels.
- **Animated 3D Route Visualization**: Glowing directional waypoints guiding users directly to their destination block.

### 3. Smart Canteen System (MOJO Cafe • JEVAN • SSS Canteen)
- **Classroom-to-Kitchen Ordering**: Students order directly from their lecture halls or laboratories.
- **Three Specialized Canteens**:
  - **1. MOJO Cafe**: Artisan paninis, crispy wraps, mini pizzas & cold brews.
  - **2. JEVAN**: Ambur dum biryani, executive thalis & banana leaf meals.
  - **3. SSS Canteen**: Ghee podi masala dosa, bun parotta, chaat & filter coffee.
- **Kitchen Owner Portal**: Real-time kitchen dashboard to review incoming orders, estimate prep times, calculate costs, and dispatch dynamic payment UPI QR codes.

### 4. Smart Classrooms & Space Management
- **IoT Environmental Telemetry**: Real-time monitoring of CO2 ppm, temperature, humidity, and occupancy.
- **Remote Automation**: Smart toggles for ECO/ON air conditioning, projector maintenance status, and adaptive lighting.
- **Timetables & Reservations**: 1-click room booking and faculty schedule integration.

### 5. Gemini AI Neural Campus Assistant
- Integrated with Google Gemini API for natural-language campus queries, room discovery, incident reporting, and energy diagnostics.

---

## 🛠️ Tech Stack

- **Frontend Core**: React 18, TypeScript
- **3D Graphics**: Three.js, React Three Fiber (`@react-three/fiber`), React Three Drei (`@react-three/drei`)
- **Animations & Interactivity**: GSAP, GSAP ScrollTrigger, Framer Motion
- **Styling**: Tailwind CSS, Lucide React Icons
- **Data Visualization**: Recharts
- **AI Integration**: Google Gemini API (`@google/genai` / REST)
- **Build Tooling**: Vite 5

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/VikkramPonSaamuel/SMARTCAMPUS.FINAL.git
   cd SMARTCAMPUS.FINAL
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
d:/robo hackthon/
├── src/
│   ├── components/
│   │   ├── ai/            # Gemini AI chat interface & telemetry cards
│   │   ├── alerts/        # Real-time incident & system alerts
│   │   ├── analytics/     # Energy, occupancy & telemetry charts
│   │   ├── canteen/       # Smart Canteen (MOJO Cafe, JEVAN, SSS Canteen)
│   │   ├── classrooms/    # Smart Classroom cards & controls
│   │   ├── landing/       # Cinematic floating landing page
│   │   ├── layout/        # AppShell, Topbar, Sidebar, NavigationModal
│   │   ├── maintenance/   # Predictive maintenance tickets
│   │   ├── parking/       # Parking zones & slot monitors
│   │   ├── security/      # Security incidents & camera grid
│   │   ├── twin/          # 3D CampusScene, Building, NavigationRoute
│   │   └── ui/            # GlassCard, StatusIndicator, buttons
│   ├── context/           # CampusContext & state management
│   ├── data/              # 30-block campus data, road graphs & metrics
│   ├── pages/             # Route pages (Dashboard, DigitalTwin, Canteen, etc.)
│   ├── services/          # Gemini AI API integration
│   ├── types/             # TypeScript interfaces & types
│   ├── App.tsx            # Route configuration
│   ├── index.css          # Tailwind CSS & glassmorphism theme
│   └── main.tsx           # Application entry point
├── public/                # Static assets
├── index.html             # HTML entry template
├── vite.config.ts         # Vite bundler configuration
├── tailwind.config.js     # Tailwind design system configuration
└── package.json           # Dependencies and scripts
```

---

## 📄 License
This project is developed for hackathon presentation and campus operating system research.
