import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Edges, Line } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from 'recharts';
import {
  Users,
  Zap,
  ShieldAlert,
  Wrench,
  Wifi,
  ArrowUpRight,
  Sparkles,
  Activity,
  DoorOpen,
  Car,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface TwinBuildingSpec {
  id: string;
  name: string;
  pos: [number, number, number];
  size: [number, number, number];
  status: 'NORMAL' | 'ALERT';
  occupancy: number;
  energy: string;
  network: string;
  maintenance: number;
  alertDetail?: string;
}

const TWIN_BUILDINGS: TwinBuildingSpec[] = [
  {
    id: 'block-a',
    name: 'BLOCK A',
    pos: [-4.2, 0, -1.5],
    size: [2.8, 3.4, 2.2],
    status: 'NORMAL',
    occupancy: 72,
    energy: '1,280 kWh',
    network: '98%',
    maintenance: 2,
  },
  {
    id: 'block-b',
    name: 'BLOCK B',
    pos: [0.4, 0, -2.0],
    size: [3.0, 4.2, 2.4],
    status: 'ALERT',
    occupancy: 84,
    energy: '1,640 kWh',
    network: '99%',
    maintenance: 1,
    alertDetail: 'Smoke detected • Room B204',
  },
  {
    id: 'library',
    name: 'LIBRARY',
    pos: [4.5, 0, -1.2],
    size: [2.6, 2.8, 2.6],
    status: 'NORMAL',
    occupancy: 65,
    energy: '940 kWh',
    network: '99.5%',
    maintenance: 0,
  },
  {
    id: 'admin',
    name: 'ADMINISTRATION',
    pos: [-3.8, 0, 2.6],
    size: [2.5, 2.6, 2.0],
    status: 'NORMAL',
    occupancy: 58,
    energy: '820 kWh',
    network: '99.8%',
    maintenance: 0,
  },
  {
    id: 'hostel',
    name: 'HOSTEL',
    pos: [0.5, 0, 3.0],
    size: [3.4, 3.2, 2.0],
    status: 'NORMAL',
    occupancy: 79,
    energy: '1,420 kWh',
    network: '97%',
    maintenance: 1,
  },
  {
    id: 'sports',
    name: 'SPORTS COMPLEX',
    pos: [4.6, 0, 2.8],
    size: [2.8, 2.0, 2.4],
    status: 'NORMAL',
    occupancy: 48,
    energy: '760 kWh',
    network: '98%',
    maintenance: 0,
  },
  {
    id: 'parking',
    name: 'PARKING',
    pos: [-0.2, 0, 6.0],
    size: [4.4, 1.1, 1.8],
    status: 'NORMAL',
    occupancy: 70,
    energy: '410 kWh',
    network: '99%',
    maintenance: 0,
  },
];

type TwinFilter = 'Occupancy' | 'Energy' | 'Safety' | 'Maintenance' | 'Network';

const LandingTwinScene: React.FC<{
  selectedId: string;
  onSelect: (id: string) => void;
  activeFilter: TwinFilter;
}> = ({ selectedId, onSelect, activeFilter }) => {
  const pulseRef = useRef<THREE.Mesh>(null);
  const selectedBldg = TWIN_BUILDINGS.find((b) => b.id === selectedId) || TWIN_BUILDINGS[1];

  useFrame(({ camera, clock }, delta) => {
    const t = clock.getElapsedTime();
    if (pulseRef.current) {
      const s = 1 + ((t * 1.4) % 1) * 1.1;
      pulseRef.current.scale.set(s, s, 1);
      const mat = pulseRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = 0.75 * (1 - ((t * 1.4) % 1));
    }

    // Subtle camera focus toward selected building
    const targetX = selectedBldg.pos[0] * 0.35 + 8;
    const targetZ = selectedBldg.pos[2] * 0.35 + 11;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, delta * 2.2);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, delta * 2.2);
    camera.lookAt(selectedBldg.pos[0] * 0.3, 1.2, selectedBldg.pos[2] * 0.3);
  });

  const connections = useMemo(
    () => [
      [
        [-4.2, 0.2, -1.5],
        [0.4, 0.2, -2.0],
      ],
      [
        [0.4, 0.2, -2.0],
        [4.5, 0.2, -1.2],
      ],
      [
        [0.4, 0.2, -2.0],
        [0.5, 0.2, 3.0],
      ],
      [
        [-3.8, 0.2, 2.6],
        [0.5, 0.2, 3.0],
      ],
      [
        [0.5, 0.2, 3.0],
        [4.6, 0.2, 2.8],
      ],
      [
        [0.5, 0.2, 3.0],
        [-0.2, 0.2, 6.0],
      ],
    ],
    []
  );

  return (
    <group>
      <color attach="background" args={['#D7F5EE']} />
      <ambientLight intensity={1.15} color="#FFFFFF" />
      <directionalLight position={[12, 18, 10]} intensity={1.5} color="#FFFFFF" />
      <pointLight position={[0, 6, 0]} intensity={0.9} color="#008F7A" distance={20} />

      {/* Base Platform (Coastal Seafoam & Asphalt Grid) */}
      <mesh position={[0, -0.2, 1]} receiveShadow>
        <boxGeometry args={[16, 0.4, 14]} />
        <meshStandardMaterial color="#BFECE2" roughness={0.75} metalness={0.1} />
      </mesh>
      <gridHelper args={[16, 16, '#008F7A', '#99F6E4']} position={[0, 0.02, 1]} />

      {/* IoT Data Conduits */}
      {connections.map((pair, idx) => (
        <Line
          key={idx}
          points={pair as [number, number, number][]}
          color={activeFilter === 'Energy' ? '#047857' : '#008F7A'}
          lineWidth={2.5}
          transparent
          opacity={0.65}
        />
      ))}

      {/* 7 Interactive Buildings */}
      {TWIN_BUILDINGS.map((b) => {
        const isSelected = b.id === selectedId;
        const isDimmed = selectedId && !isSelected;
        const isAlert = b.status === 'ALERT';
        const [w, h, d] = b.size;

        const baseColor = isAlert
          ? '#F43F5E'
          : isSelected
          ? '#008F7A'
          : activeFilter === 'Energy'
          ? '#10B981'
          : '#F8FAFC';

        return (
          <group
            key={b.id}
            position={b.pos}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(b.id);
            }}
          >
            {/* Red/Orange Alert Pulse Ring under BLOCK B */}
            {isAlert && (
              <mesh
                ref={pulseRef}
                position={[0, 0.06, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <ringGeometry args={[1.4, 2.0, 32]} />
                <meshBasicMaterial
                  color="#F97316"
                  transparent
                  opacity={0.75}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}

            <mesh
              position={[0, h / 2 + (isSelected ? 0.25 : 0), 0]}
              onPointerOver={() => {
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'auto';
              }}
            >
              <boxGeometry args={[w, h, d]} />
              <meshStandardMaterial
                color={baseColor}
                emissive={isAlert ? '#E11D48' : isSelected ? '#06B6D4' : '#0F172A'}
                emissiveIntensity={isAlert ? 0.45 : isSelected ? 0.35 : 0.1}
                roughness={0.35}
                metalness={0.3}
                transparent={Boolean(isDimmed)}
                opacity={isDimmed ? 0.42 : 0.95}
              />
              <Edges
                color={isAlert ? '#FB7185' : isSelected ? '#67E8F9' : '#64748B'}
              />
            </mesh>

            {/* Floating Building Badge */}
            <Html
              position={[0, h + (isSelected ? 1.1 : 0.65), 0]}
              center
              distanceFactor={18}
              zIndexRange={[4, 0]}
            >
              <button
                onClick={() => onSelect(b.id)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold whitespace-nowrap border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isAlert
                    ? 'bg-rose-600 text-white border-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.7)] animate-pulse'
                    : isSelected
                    ? 'bg-cyan-400 text-[#050814] border-white shadow-lg scale-110'
                    : 'bg-[#0B1226]/90 text-slate-200 border-white/20 opacity-80 hover:opacity-100'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isAlert ? 'bg-white' : isSelected ? 'bg-[#050814]' : 'bg-emerald-400'
                  }`}
                />
                <span>{b.name}</span>
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
};

export const DigitalTwin: React.FC = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string>('block-b');
  const [activeFilter, setActiveFilter] = useState<TwinFilter>('Safety');

  const selectedBldg =
    TWIN_BUILDINGS.find((b) => b.id === selectedId) || TWIN_BUILDINGS[0];

  const filters: { id: TwinFilter; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'Occupancy', icon: Users },
    { id: 'Energy', icon: Zap },
    { id: 'Safety', icon: ShieldAlert },
    { id: 'Maintenance', icon: Wrench },
    { id: 'Network', icon: Wifi },
  ];

  return (
    <section
      id="sec-twin"
      className="relative w-full rounded-[32px] overflow-hidden bg-[#040711] text-white border border-white/12 p-6 sm:p-12 lg:p-16 shadow-2xl"
    >
      {/* Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8">
        <div>
          <span className="inline-block text-xs font-mono font-bold uppercase tracking-[0.24em] text-cyan-300">
            04 — INTERACTIVE 3D DIGITAL TWIN
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white mt-2 leading-[1.04]">
            See your campus
            <span className="block bg-gradient-to-r from-cyan-300 via-violet-300 to-emerald-300 bg-clip-text text-transparent">
              come alive.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 max-w-xl">
            A living digital representation of your campus infrastructure. Click any
            building below to inspect real-time telemetry.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white/[0.05] border border-white/10">
          {filters.map((f) => {
            const Icon = f.icon;
            const active = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-cyan-400 text-[#050814] font-bold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{f.id}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive 3D Viewport + Live Information Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* 3D Canvas */}
        <div className="lg:col-span-8 h-[440px] sm:h-[520px] rounded-[28px] overflow-hidden bg-[#060B19] border border-white/12 relative">
          <Canvas camera={{ position: [9, 9, 12], fov: 42 }}>
            <LandingTwinScene
              selectedId={selectedId}
              onSelect={setSelectedId}
              activeFilter={activeFilter}
            />
            <OrbitControls
              enableZoom={false}
              maxPolarAngle={Math.PI / 2.2}
              minPolarAngle={Math.PI / 5}
            />
          </Canvas>

          {/* Bottom Building Selector Pills */}
          <div className="absolute bottom-4 inset-x-4 flex flex-wrap items-center justify-center gap-1.5 pointer-events-auto">
            {TWIN_BUILDINGS.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedId(b.id)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                  selectedId === b.id
                    ? 'bg-white text-[#050814] border-white shadow-md'
                    : b.status === 'ALERT'
                    ? 'bg-rose-500/25 text-rose-200 border-rose-400/40'
                    : 'bg-[#050814]/80 text-slate-300 border-white/15 hover:border-white/40'
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Building Telemetry & Alert Panel */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-[28px] bg-white/[0.04] backdrop-blur-2xl border border-white/15 p-6 sm:p-7">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  SELECTED INFRASTRUCTURE NODE
                </span>
                <h3 className="font-display text-2xl font-extrabold text-white mt-1">
                  {selectedBldg.name}
                </h3>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
                  selectedBldg.status === 'ALERT'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40 animate-pulse'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                }`}
              >
                <span>●</span>
                <span>{selectedBldg.status}</span>
              </span>
            </div>

            {selectedBldg.status === 'ALERT' && (
              <div className="rounded-2xl bg-rose-500/15 border border-rose-400/40 p-4 space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-300">
                  ACTIVE SAFETY ALERT
                </span>
                <p className="text-sm font-bold text-white">
                  {selectedBldg.alertDetail}
                </p>
                <p className="text-xs text-rose-200/80">
                  Automated HVAC dampers isolated • Evacuation guidance active.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#090F22] border border-white/10 p-4">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Occupancy
                </span>
                <p className="font-display text-2xl font-bold text-white mt-1">
                  {selectedBldg.occupancy}%
                </p>
              </div>

              <div className="rounded-2xl bg-[#090F22] border border-white/10 p-4">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Energy
                </span>
                <p className="font-display text-2xl font-bold text-cyan-300 mt-1">
                  {selectedBldg.energy}
                </p>
              </div>

              <div className="rounded-2xl bg-[#090F22] border border-white/10 p-4">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Network
                </span>
                <p className="font-display text-2xl font-bold text-emerald-300 mt-1">
                  {selectedBldg.network}
                </p>
              </div>

              <div className="rounded-2xl bg-[#090F22] border border-white/10 p-4">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Maintenance
                </span>
                <p className="font-display text-2xl font-bold text-amber-300 mt-1">
                  {selectedBldg.maintenance}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/digital-twin')}
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 py-3.5 text-xs font-bold text-[#050814] shadow-lg hover:opacity-95 transition-opacity cursor-pointer"
          >
            <span>Open Full 30-Block VISTAS Digital Twin</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

const COMMAND_ENERGY_DATA = [
  { time: '08:00', kwh: 2100, pred: 1950 },
  { time: '10:00', kwh: 3200, pred: 2900 },
  { time: '12:00', kwh: 3850, pred: 3400 },
  { time: '14:00', kwh: 4100, pred: 3650 },
  { time: '16:00', kwh: 3120, pred: 2890 },
  { time: '18:00', kwh: 2050, pred: 1900 },
];

const COMMAND_OCCUPANCY_DATA = [
  { block: 'Blk A', occ: 91 },
  { block: 'Blk B', occ: 78 },
  { block: 'Blk C', occ: 84 },
  { block: 'Lib', occ: 68 },
  { block: 'Hostel', occ: 74 },
];

export const CommandCenter: React.FC = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        frameRef.current,
        { scale: 0.88, opacity: 0, filter: 'blur(10px)' },
        {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const metrics = [
    { label: 'Campus Health', value: '98.4%', icon: Activity, color: 'text-emerald-300' },
    { label: 'Energy', value: '18,420 kWh', icon: Zap, color: 'text-cyan-300' },
    { label: 'Active Incidents', value: '03', icon: ShieldAlert, color: 'text-rose-300' },
    { label: 'Available Rooms', value: '42', icon: DoorOpen, color: 'text-violet-300' },
    { label: 'Parking', value: '70%', icon: Car, color: 'text-amber-300' },
    { label: 'Network', value: '99.2%', icon: Wifi, color: 'text-emerald-300' },
  ];

  const insights = [
    { num: '01', text: 'Block A occupancy is expected to reach 91% at 2:00 PM.' },
    { num: '02', text: 'Energy consumption in Block C is 14% above normal.' },
    { num: '03', text: 'Three maintenance issues require attention.' },
    { num: '04', text: 'Parking Zone B is expected to reach capacity by 4:30 PM.' },
  ];

  return (
    <section
      id="sec-command"
      ref={sectionRef}
      className="relative w-full rounded-[32px] overflow-hidden bg-gradient-to-b from-[#060A18] to-[#0B1228] text-white border border-white/12 p-6 sm:p-12 lg:p-16 shadow-2xl"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-block text-xs font-mono font-bold uppercase tracking-[0.24em] text-violet-300">
            05 — UNIFIED COMMAND CENTER
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            From data{' '}
            <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">
              to decisions.
            </span>
          </h2>
        </div>

        {/* Floating Command Dashboard Frame */}
        <div
          ref={frameRef}
          className="mt-12 rounded-[30px] bg-[#050916]/90 backdrop-blur-2xl border border-white/15 p-6 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.65)] space-y-6"
        >
          {/* 6 Top KPI Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {metrics.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.label}
                  className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 hover:border-white/25 transition-colors"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400">
                    <span>{m.label}</span>
                    <Icon className={`h-3.5 w-3.5 ${m.color}`} />
                  </div>
                  <p className={`font-display text-xl sm:text-2xl font-extrabold mt-2 ${m.color}`}>
                    {m.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Charts + AI Insights Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Energy & Occupancy Charts */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300">
                    ENERGY CONSUMPTION (kWh)
                  </span>
                  <p className="text-sm font-bold text-white mt-0.5">
                    Live vs AI Predicted Load
                  </p>
                </div>
                <div className="h-44 mt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={COMMAND_ENERGY_DATA}>
                      <defs>
                        <linearGradient id="cmdEnergy" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" stroke="#64748B" fontSize={10} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0B1224',
                          borderColor: 'rgba(255,255,255,0.15)',
                          borderRadius: '12px',
                          fontSize: '11px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="kwh"
                        stroke="#22D3EE"
                        fill="url(#cmdEnergy)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-violet-300">
                    OCCUPANCY & ACTIVITY (%)
                  </span>
                  <p className="text-sm font-bold text-white mt-0.5">
                    Zone Utilization Matrix
                  </p>
                </div>
                <div className="h-44 mt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={COMMAND_OCCUPANCY_DATA}>
                      <XAxis dataKey="block" stroke="#64748B" fontSize={10} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0B1224',
                          borderColor: 'rgba(255,255,255,0.15)',
                          borderRadius: '12px',
                          fontSize: '11px',
                        }}
                      />
                      <Bar dataKey="occ" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* AI INSIGHTS PANEL: "CAMPUS INTELLIGENCE" */}
            <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-violet-950/40 via-[#0B1228] to-cyan-950/30 border border-violet-400/30 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-cyan-300" />
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-white">
                      CAMPUS INTELLIGENCE
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-300">
                    LIVE AI STREAM
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  {insights.map((item) => (
                    <div
                      key={item.num}
                      className="flex items-start gap-3 rounded-xl bg-white/[0.04] border border-white/10 p-3 text-xs text-slate-200"
                    >
                      <span className="font-mono text-[11px] font-bold text-cyan-300 shrink-0">
                        {item.num}
                      </span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="mt-4 w-full py-2.5 rounded-xl bg-white text-[#050814] font-bold text-xs hover:opacity-95 transition-opacity cursor-pointer"
              >
                Enter Full Command Center →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
