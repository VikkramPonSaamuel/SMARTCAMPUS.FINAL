import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useCampus } from '../../context/CampusContext';
import { Building } from './Building';
import { NavigationRoute } from './NavigationRoute';
import { BuildingInfoPanel } from './BuildingInfoPanel';
import { CampusMarker } from './CampusMarker';
import { TwinLayerMode } from '../../types/campus';
import { NAVIGATION_NODES } from '../../data/campusData';
import {
  Box,
  Users,
  Zap,
  ShieldAlert,
  Car,
  Wind,
  Navigation,
  RotateCcw,
  Maximize2,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// Tree positions framing the VISTAS Central Ground, Upper Courtyard, and Perimeter (Matching Image 1)
const TREE_POSITIONS: [number, number, number][] = [
  // Perimeter of the Main Central Lawn
  [-9.5, 0, 3.2],
  [-8.0, 0, 3.2],
  [-6.2, 0, 3.2],
  [-10.2, 0, 5.5],
  [-10.2, 0, 7.8],
  [-8.2, 0, 8.2],
  [-5.2, 0, 8.2],
  [-2.2, 0, 8.2],
  [0.8, 0, 8.2],
  [3.8, 0, 8.2],
  [4.8, 0, 6.5],
  [4.8, 0, 4.0],
  [4.8, 0, 1.5],
  [2.5, 0, 0.2],
  [-0.5, 0, 0.2],
  // Upper Courtyard & North-West Park
  [2.8, 0, -6.5],
  [2.8, 0, -4.2],
  [-5.5, 0, -7.5],
  [-7.5, 0, -6.5],
  [-4.2, 0, -6.0],
];

// Street light positions along VISTAS main avenues
const STREET_LIGHT_POSITIONS: [number, number, number][] = [
  [-1.2, 0, -13.0],
  [-1.2, 0, -9.5],
  [-1.2, 0, -5.5],
  [-3.2, 0, -0.5],
  [1.5, 0, -0.5],
  [5.8, 0, -0.5],
  [5.8, 0, 4.5],
  [5.8, 0, 8.5],
  [-8.5, 0, 0.2],
  [-11.2, 0, 6.5],
];

// Low-poly stylized Coastal Emerald & Seafoam trees
const CampusTrees: React.FC<{ highlightEnv: boolean }> = ({ highlightEnv }) => {
  return (
    <group>
      {TREE_POSITIONS.map((pos, idx) => {
        const scale = 0.75 + (idx % 3) * 0.14;
        return (
          <group key={idx} position={pos} scale={[scale, scale, scale]}>
            <mesh position={[0, 0.35, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.1, 0.7, 6]} />
              <meshStandardMaterial color="#577572" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.9, 0]} castShadow>
              <coneGeometry args={[0.5, 1.0, 7]} />
              <meshStandardMaterial
                color={highlightEnv ? '#10B981' : '#0D9488'}
                emissive={highlightEnv ? '#34D399' : '#0F766E'}
                emissiveIntensity={highlightEnv ? 0.35 : 0.12}
                roughness={0.45}
              />
            </mesh>
            <mesh position={[0, 1.35, 0]} castShadow>
              <coneGeometry args={[0.36, 0.8, 7]} />
              <meshStandardMaterial
                color={highlightEnv ? '#34D399' : '#14B8A6'}
                emissive={highlightEnv ? '#6EE7B7' : '#14B8A6'}
                emissiveIntensity={highlightEnv ? 0.4 : 0.15}
                roughness={0.4}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// Architectural Street Lights
const StreetLights: React.FC = () => {
  return (
    <group>
      {STREET_LIGHT_POSITIONS.map((pos, idx) => (
        <group key={idx} position={pos}>
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.03, 0.04, 1.4, 8]} />
            <meshStandardMaterial color="#0F766E" metalness={0.5} roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.42, 0]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        </group>
      ))}
    </group>
  );
};


// Stylized Small Student Figures moving along VISTAS Central Ground & Walkways
const StudentFigures: React.FC = () => {
  const studentRefs = useRef<(THREE.Group | null)[]>([]);

  const paths = useMemo(
    () => [
      [new THREE.Vector3(-8, 0.1, 4.5), new THREE.Vector3(0, 0.1, 4.5), new THREE.Vector3(4, 0.1, 4.5)],
      [new THREE.Vector3(-1.2, 0.1, -9), new THREE.Vector3(-1.2, 0.1, -3), new THREE.Vector3(-1.2, 0.1, 2)],
      [new THREE.Vector3(5.8, 0.1, -1), new THREE.Vector3(5.8, 0.1, 4), new THREE.Vector3(5.8, 0.1, 9)],
    ],
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    studentRefs.current.forEach((student, idx) => {
      if (!student) return;
      const path = paths[idx % paths.length];
      const phase = (Math.sin(t * 0.35 + idx * 1.4) + 1) / 2;
      const pos = new THREE.Vector3().lerpVectors(path[0], path[2], phase);
      student.position.set(pos.x + (idx % 2 === 0 ? 0.25 : -0.25), 0.12, pos.z);
    });
  });

  return (
    <group>
      {Array.from({ length: 14 }).map((_, idx) => (
        <group
          key={idx}
          ref={(el) => {
            studentRefs.current[idx] = el;
          }}
        >
          <mesh position={[0, 0.14, 0]}>
            <capsuleGeometry args={[0.06, 0.16, 4, 8]} />
            <meshStandardMaterial
              color="#007F6E"
              emissive="#14B8A6"
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// VISTAS Gates 1, 2, 3, 4 and "YOU ARE HERE" Marker (Matching Image 1)
const CampusGatesAndLandmarks: React.FC = () => {
  const gates = [
    { id: 'Gate 1', pos: [-14.8, 0.6, 0.5] as [number, number, number] },
    { id: 'Gate 2', pos: [-3.4, 0.6, -2.0] as [number, number, number] },
    { id: 'Gate 3', pos: [-1.0, 0.6, -8.3] as [number, number, number] },
    { id: 'Gate 4', pos: [5.8, 0.6, -15.4] as [number, number, number] },
  ];

  return (
    <group>
      {gates.map((g) => (
        <group key={g.id} position={g.pos}>
          <Html center distanceFactor={24} zIndexRange={[4, 0]}>
            <div className="px-2.5 py-0.5 rounded-full bg-[#00A896] border-2 border-white !text-white text-[9px] font-mono font-bold shadow-md whitespace-nowrap">
              {g.id}
            </div>
          </Html>
        </group>
      ))}

      {/* "YOU ARE HERE" Marker below 1. Dr. MGR Block & Gate 3 (Matching Image 1) */}
      <group position={[1.1, 0.7, -8.2]}>
        <Html center distanceFactor={24} zIndexRange={[4, 0]}>
          <div className="px-2.5 py-1 rounded-full bg-rose-600 border-2 border-white !text-white text-[8px] font-mono font-bold uppercase tracking-wider shadow-lg whitespace-nowrap animate-pulse">
            ● YOU ARE HERE
          </div>
        </Html>
      </group>
    </group>
  );
};

// Animated Energy Flow Particles when Energy Layer is active
const EnergyFlowLines: React.FC<{ active: boolean }> = ({ active }) => {
  const particleRefs = useRef<(THREE.Mesh | null)[]>([]);

  const conduits = useMemo(
    () => [
      [new THREE.Vector3(0, 0.25, 3.5), new THREE.Vector3(3.4, 0.25, -11.8)],
      [new THREE.Vector3(0, 0.25, 3.5), new THREE.Vector3(8.8, 0.25, 3.8)],
      [new THREE.Vector3(0, 0.25, 3.5), new THREE.Vector3(9.2, 0.25, -1.5)],
      [new THREE.Vector3(0, 0.25, 3.5), new THREE.Vector3(-1.6, 0.25, 11.2)],
      [new THREE.Vector3(0, 0.25, 3.5), new THREE.Vector3(-11.8, 0.25, -3.2)],
      [new THREE.Vector3(0, 0.25, 3.5), new THREE.Vector3(5.2, 0.25, 11.8)],
    ],
    []
  );

  useFrame(({ clock }) => {
    if (!active) return;
    const t = clock.getElapsedTime();
    particleRefs.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const pair = conduits[idx % conduits.length];
      const u = (t * 0.45 + idx * 0.17) % 1;
      mesh.position.lerpVectors(pair[1], pair[0], u);
    });
  });

  if (!active) return null;

  return (
    <group>
      {conduits.map((pair, idx) => (
        <Line
          key={idx}
          points={[
            [pair[0].x, pair[0].y, pair[0].z],
            [pair[1].x, pair[1].y, pair[1].z],
          ]}
          color="#008F7A"
          lineWidth={2.5}
          transparent
          opacity={0.75}
        />
      ))}
      {Array.from({ length: 12 }).map((_, idx) => (
        <mesh
          key={idx}
          ref={(el) => {
            particleRefs.current[idx] = el;
          }}
        >
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshBasicMaterial color="#008F7A" />
        </mesh>
      ))}
    </group>
  );
};

// Camera Rig for smooth transitions toward selected VISTAS building
const CameraRig: React.FC<{
  selectedPosition: [number, number, number] | null;
  controlsRef: React.RefObject<OrbitControlsImpl>;
}> = ({ selectedPosition, controlsRef }) => {
  const defaultTarget = useMemo(() => new THREE.Vector3(-1, 0.5, 1.5), []);
  const targetVec = useMemo(() => new THREE.Vector3(), []);
  const desiredCamPos = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }, delta) => {
    if (!controlsRef.current) return;
    if (selectedPosition) {
      targetVec.set(selectedPosition[0], 1.8, selectedPosition[2]);
      controlsRef.current.target.lerp(targetVec, delta * 4);

      desiredCamPos.set(
        selectedPosition[0] + 6,
        11,
        selectedPosition[2] + 11
      );
      camera.position.lerp(desiredCamPos, delta * 3.2);
    } else {
      controlsRef.current.target.lerp(defaultTarget, delta * 3);
    }
    controlsRef.current.update();
  });

  return null;
};

interface CampusSceneProps {
  heightClass?: string;
  showFloatingCards?: boolean;
}

export const CampusScene: React.FC<CampusSceneProps> = ({
  heightClass = 'h-[540px] sm:h-[600px]',
  showFloatingCards = true,
}) => {
  const {
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
    setIsNavModalOpen,
    liveMetrics,
    incidents,
    parkingZones,
  } = useCampus();

  const controlsRef = useRef<OrbitControlsImpl>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const layers: { id: TwinLayerMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'buildings', label: 'Buildings (1–30)', icon: Box },
    { id: 'occupancy', label: 'Occupancy', icon: Users },
    { id: 'energy', label: 'Energy', icon: Zap },
    { id: 'security', label: 'Security', icon: ShieldAlert },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'environment', label: 'Environment', icon: Wind },
  ];

  const handleResetCamera = () => {
    setSelectedBuildingId(null);
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div
      className={`relative w-full ${heightClass} rounded-2xl overflow-hidden glass-panel border border-teal-600/25 select-none isolate`}
    >
      {/* Unified Top HUD Bar (z-20 so 3D badges never overlap) */}
      <div className="absolute inset-x-3 sm:inset-x-4 top-3 sm:top-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Layer Mode Switcher */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-1 p-1.5 rounded-xl bg-white/88 backdrop-blur-xl border border-teal-500/25 shadow-sm">
          {layers.map((layer) => {
            const Icon = layer.icon;
            const isActive = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  isActive
                    ? 'btn-ocean-primary bg-gradient-to-r from-[#008F7A] to-[#14B8A6] shadow-xs'
                    : 'text-[#1f5754] hover:text-[#042f2e] hover:bg-teal-500/10'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-[#008F7A]'}`} />
                <span className="hidden sm:inline">{layer.label}</span>
              </button>
            );
          })}
        </div>

        {/* Top Right Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          <button
            onClick={() => setIsNavModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-xl border transition-all shadow-xs ${
              isNavigating
                ? 'bg-[#1A73E8] !text-white border-white/70 shadow-[0_6px_20px_rgba(26,115,232,0.4)]'
                : 'bg-white/88 text-[#042f2e] hover:bg-white border-teal-500/25'
            }`}
          >
            <Navigation className={`h-3.5 w-3.5 ${isNavigating ? 'text-white' : 'text-[#008F7A]'}`} />
            <span>{isNavigating ? 'Google Maps Route Active' : 'Navigate Campus'}</span>
          </button>

          <button
            onClick={handleResetCamera}
            title="Reset 3D View"
            className="p-2 rounded-xl bg-white/88 hover:bg-white text-[#007F6E] border border-teal-500/25 backdrop-blur-xl transition-colors shadow-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          {location.pathname !== '/digital-twin' && (
            <button
              onClick={() => navigate('/digital-twin')}
              title="Expand Full Digital Twin & 30-Block Legend"
              className="p-2 rounded-xl bg-white/88 hover:bg-white text-[#007F6E] border border-teal-500/25 backdrop-blur-xl transition-colors shadow-xs"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* LIVE CAMPUS DATA — Frosted Pearl-Seafoam Cards Around the 3D Campus (z-20) */}
      {showFloatingCards && (
        <>
          {/* Left Floating Telemetry Stack */}
          <div className="hidden md:flex flex-col gap-2.5 absolute left-4 top-20 z-20 pointer-events-auto">
            <div
              onClick={() => setActiveLayer('occupancy')}
              className="cursor-pointer rounded-xl bg-white/90 hover:bg-white backdrop-blur-xl border border-teal-500/25 hover:border-[#008F7A] px-3.5 py-2.5 w-44 transition-all shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold uppercase tracking-[0.16em] text-[#467874]">
                  LIVE OCCUPANCY
                </span>
                <span className="h-2 w-2 rounded-full bg-[#008F7A] animate-pulse" />
              </div>
              <p className="font-display text-xl font-bold text-[#042f2e] mt-0.5">
                {liveMetrics.liveOccupancy.toLocaleString()}
              </p>
              <p className="text-[10px] text-[#007F6E] font-semibold">
                Students (30 Blocks)
              </p>
            </div>

            <div
              onClick={() => setActiveLayer('energy')}
              className="cursor-pointer rounded-xl bg-white/90 hover:bg-white backdrop-blur-xl border border-teal-500/25 hover:border-[#008F7A] px-3.5 py-2.5 w-44 transition-all shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold uppercase tracking-[0.16em] text-[#467874]">
                  ENERGY SAVED
                </span>
                <Zap className="h-3 w-3 text-[#008F7A]" />
              </div>
              <p className="font-display text-xl font-bold text-emerald-700 mt-0.5">
                {liveMetrics.energySavedPercent}%
              </p>
              <p className="text-[10px] text-[#467874] font-mono">
                {liveMetrics.currentPowerMw} MW Active
              </p>
            </div>

            <div
              onClick={() => navigate('/classrooms')}
              className="cursor-pointer rounded-xl bg-white/90 hover:bg-white backdrop-blur-xl border border-teal-500/25 hover:border-[#008F7A] px-3.5 py-2.5 w-44 transition-all shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold uppercase tracking-[0.16em] text-[#467874]">
                  AVAILABLE ROOMS
                </span>
                <span className="text-[9px] font-mono font-bold text-[#008F7A]">LIVE</span>
              </div>
              <p className="font-display text-xl font-bold text-[#042f2e] mt-0.5">
                {liveMetrics.availableRooms}
              </p>
              <p className="text-[10px] text-[#467874]">Smart Classrooms</p>
            </div>
          </div>

          {/* Bottom Floating Telemetry Cards */}
          <div className="hidden sm:flex items-center gap-2.5 absolute left-4 bottom-4 z-20 pointer-events-auto">
            <div
              onClick={() => setActiveLayer('security')}
              className="cursor-pointer rounded-xl bg-white/90 hover:bg-white backdrop-blur-xl border border-rose-400/45 hover:border-rose-500 px-3.5 py-2.5 flex items-center gap-3 transition-all shadow-md"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/15 text-rose-600">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[9px] font-mono font-bold uppercase tracking-[0.14em] text-[#467874]">
                  ACTIVE INCIDENTS
                </p>
                <p className="font-display text-lg font-bold text-rose-600 leading-tight">
                  0{liveMetrics.activeIncidents}
                </p>
              </div>
            </div>

            <div
              onClick={() => setActiveLayer('parking')}
              className="cursor-pointer rounded-xl bg-white/90 hover:bg-white backdrop-blur-xl border border-teal-500/25 hover:border-[#008F7A] px-3.5 py-2.5 flex items-center gap-3 transition-all shadow-md"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/15 text-[#008F7A]">
                <Car className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[9px] font-mono font-bold uppercase tracking-[0.14em] text-[#467874]">
                  PARKING
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-lg font-bold text-[#042f2e] leading-tight">
                    {liveMetrics.parkingSlotsAvailable}
                  </span>
                  <span className="text-[10px] font-semibold text-[#007F6E]">
                    Slots Available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Google Maps Style Turn-by-Turn Navigation Card at Bottom Right */}
      {isNavigating && (
        <div className="absolute bottom-4 right-4 z-20 w-80 sm:w-88 rounded-2xl bg-white/98 backdrop-blur-2xl border-2 border-[#1A73E8]/50 overflow-hidden shadow-[0_18px_45px_rgba(26,115,232,0.3)]">
          {/* Google Maps Green/Blue Turn-by-Turn Header */}
          <div className="bg-gradient-to-r from-[#0F9D58] to-[#008F7A] px-4 py-2.5 flex items-center justify-between !text-white">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 !text-white font-bold">
                <Navigation className="h-4 w-4 !text-white" />
              </div>
              <div>
                <span className="text-[9px] font-mono uppercase tracking-wider !text-emerald-100 block">
                  GOOGLE MAPS 3D WAYFINDING
                </span>
                <p className="text-xs font-bold !text-white leading-tight">
                  Follow Black Campus Walkway
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsNavigating(false)}
              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 !text-white text-[10px] font-mono font-bold shadow-xs transition-colors"
            >
              Exit
            </button>
          </div>

          {/* Live Origin -> Destination Block Switchers */}
          <div className="p-3.5 space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] font-mono font-bold uppercase text-[#1A73E8] flex items-center gap-1 mb-1">
                  <span className="h-2 w-2 rounded-full bg-[#1A73E8]" />
                  From Block
                </label>
                <select
                  value={navFrom}
                  onChange={(e) => setNavFrom(e.target.value)}
                  className="w-full rounded-lg bg-blue-50/70 border border-[#1A73E8]/35 px-2 py-1.5 text-[11px] font-semibold text-[#042f2e] focus:outline-none focus:border-[#1A73E8]"
                >
                  {NAVIGATION_NODES.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[9px] font-mono font-bold uppercase text-[#EA4335] flex items-center gap-1 mb-1">
                  <span className="h-2 w-2 rounded-full bg-[#EA4335]" />
                  To Block
                </label>
                <select
                  value={navTo}
                  onChange={(e) => setNavTo(e.target.value)}
                  className="w-full rounded-lg bg-rose-50/70 border border-[#EA4335]/35 px-2 py-1.5 text-[11px] font-semibold text-[#042f2e] focus:outline-none focus:border-[#EA4335]"
                >
                  {NAVIGATION_NODES.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Google Maps Live ETA & Distance Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-lg font-extrabold text-[#0F9D58]">
                  {activeRoute.walkingMinutes} min
                </span>
                <span className="text-xs font-mono font-bold text-slate-600">
                  ({activeRoute.distanceMeters} m)
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#1A73E8] border border-blue-200 text-[9px] font-mono font-bold">
                Fastest Pedestrian Route
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Selected Building Floating Information Panel (z-30) */}
      <BuildingInfoPanel
        building={selectedBuilding}
        onClose={() => setSelectedBuildingId(null)}
      />

      {/* React Three Fiber 3D Canvas (z-0 container) */}
      <div className="relative z-0 w-full h-full">
        <Canvas
          shadows
          camera={{ position: [14, 22, 24], fov: 42 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          onPointerMissed={() => setSelectedBuildingId(null)}
        >
          {/* Image 2 Soft Seafoam-Aqua Horizon & Fog */}
          <color attach="background" args={['#CFECE6']} />
          <fog attach="fog" args={['#CFECE6', 35, 78]} />

          {/* Architectural Daylight & Seafoam Lagoon Lighting */}
          <ambientLight intensity={1.18} color="#F0FDFA" />
          <directionalLight
            position={[18, 30, 18]}
            intensity={1.55}
            color="#FFFFFF"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={70}
            shadow-camera-left={-24}
            shadow-camera-right={24}
            shadow-camera-top={24}
            shadow-camera-bottom={-24}
          />
          <pointLight position={[0, 10, 2]} intensity={0.65} color="#14B8A6" distance={32} />

          {/* VISTAS Campus Architectural Base Platform & Ground Plan (Replicating Image 1) */}
          <group>
            {/* Main Pearl-Alabaster Campus Table Base */}
            <mesh position={[0, -0.25, -1]} receiveShadow>
              <boxGeometry args={[36, 0.5, 36]} />
              <meshStandardMaterial color="#EBF9F6" roughness={0.65} metalness={0.08} />
            </mesh>

            {/* Delicate Turquoise & Seafoam Grid Overlay */}
            <gridHelper
              args={[36, 36, '#14B8A6', '#B2EBE0']}
              position={[0, 0.01, -1]}
            />

            {/* 1. Vast Central Green Campus Ground (Image 1 Center Lawn) */}
            <mesh position={[-2.6, 0.03, 4.4]} receiveShadow>
              <boxGeometry args={[15.6, 0.04, 8.6]} />
              <meshStandardMaterial color="#99F6E4" roughness={0.75} />
            </mesh>

            {/* 2. Upper Courtyard Lawn East of 2. Ratan Tata Block */}
            <mesh position={[3.0, 0.03, -5.5]} receiveShadow>
              <boxGeometry args={[3.2, 0.04, 4.4]} />
              <meshStandardMaterial color="#6EE7B7" roughness={0.75} />
            </mesh>

            {/* 3. North-West Park Lawn above 28. Sapphire Hostel */}
            <mesh position={[-6.2, 0.03, -7.2]} receiveShadow>
              <boxGeometry args={[6.4, 0.04, 4.8]} />
              <meshStandardMaterial color="#A7F3D0" roughness={0.8} />
            </mesh>

            {/* Sports Courts on Image 1 */}
            {/* West Lawn Cricket / Tennis Turf */}
            <mesh position={[-8.8, 0.055, 4.2]} receiveShadow>
              <boxGeometry args={[1.6, 0.02, 2.8]} />
              <meshStandardMaterial color="#10B981" roughness={0.5} />
            </mesh>
            {/* South-West Volleyball Court near Block 19/21 */}
            <mesh position={[-6.0, 0.055, 9.2]} receiveShadow>
              <boxGeometry args={[1.4, 0.02, 2.0]} />
              <meshStandardMaterial color="#0EA5E9" roughness={0.4} />
            </mesh>
            {/* East Basketball Court next to 13. Ruby Girls Hostel */}
            <mesh position={[7.4, 0.055, 7.8]} receiveShadow>
              <boxGeometry args={[1.5, 0.02, 2.4]} />
              <meshStandardMaterial color="#F59E0B" roughness={0.5} />
            </mesh>

            {/* VISTAS Internal Pathways & Road Network in Realistic Asphalt Black (Matching Image 1) */}
            {/* 1. Main North-South Entrance Highway (Top -> Gate 3 -> Gate 2) */}
            <mesh position={[-1.4, 0.055, -8.8]} receiveShadow>
              <boxGeometry args={[2.6, 0.05, 16.5]} />
              <meshStandardMaterial color="#111317" roughness={0.85} metalness={0.08} />
            </mesh>
            {/* Highway Center Dashed Divider Line */}
            <mesh position={[-1.4, 0.085, -8.8]}>
              <boxGeometry args={[0.08, 0.01, 15.5]} />
              <meshBasicMaterial color="#FACC15" />
            </mesh>

            {/* 2. North-East Pathway around 1. Dr. MGR Block & Gate 4 */}
            <mesh position={[3.2, 0.055, -8.2]} receiveShadow>
              <boxGeometry args={[7.5, 0.05, 1.3]} />
              <meshStandardMaterial color="#111317" roughness={0.85} />
            </mesh>
            <mesh position={[6.2, 0.055, -11.8]} receiveShadow>
              <boxGeometry args={[1.4, 0.05, 8.2]} />
              <meshStandardMaterial color="#111317" roughness={0.85} />
            </mesh>
            <mesh position={[5.2, 0.055, -4.8]} receiveShadow>
              <boxGeometry args={[1.3, 0.05, 6.2]} />
              <meshStandardMaterial color="#111317" roughness={0.85} />
            </mesh>

            {/* 3. Central East-West Pathway (Gate 1 -> 26. Quadrangle -> Gate 2 -> 9. Radhakrishnan -> 10. New Library) */}
            <mesh position={[-1.0, 0.055, -0.3]} receiveShadow>
              <boxGeometry args={[28.5, 0.05, 1.5]} />
              <meshStandardMaterial color="#111317" roughness={0.85} />
            </mesh>

            {/* 4. Central Spine Pathway alongside 8. Dr. Ambedkar & 7. Velan Arangam */}
            <mesh position={[-2.2, 0.055, 2.4]} receiveShadow>
              <boxGeometry args={[1.1, 0.05, 5.6]} />
              <meshStandardMaterial color="#111317" roughness={0.85} />
            </mesh>

            {/* 5. West Perimeter Pathway (30. Abdul Kalam -> Gate 1 -> 25. Nethaji -> 24. Edison -> 23. VOC -> 22. Emerald) */}
            <mesh position={[-14.5, 0.055, 2.5]} receiveShadow>
              <boxGeometry args={[1.6, 0.05, 22.0]} />
              <meshStandardMaterial color="#111317" roughness={0.85} />
            </mesh>
            {/* Inner West Pathway between 25. Nethaji / 6. Shivalaya and Central Ground */}
            <mesh position={[-11.2, 0.055, 6.5]} receiveShadow>
              <boxGeometry args={[1.3, 0.05, 10.5]} />
              <meshStandardMaterial color="#111317" roughness={0.85} />
            </mesh>
            <mesh position={[-8.2, 0.055, 0.6]} receiveShadow>
              <boxGeometry args={[6.8, 0.05, 1.1]} />
              <meshStandardMaterial color="#111317" roughness={0.85} />
            </mesh>

            {/* 6. East Internal Corridor Pathway (Between Central Ground and 11. Pearl, 12. Steve Jobs, 13. Ruby Hostel) */}
            <mesh position={[5.9, 0.055, 4.8]} receiveShadow>
              <boxGeometry args={[1.5, 0.05, 11.5]} />
              <meshStandardMaterial color="#111317" roughness={0.85} />
            </mesh>

            {/* 7. Southern Avenue Pathway above 19. Guest House, 18. Fleming, 17. Central Library, 16. C.V. Raman */}
            <mesh position={[-2.2, 0.055, 8.8]} receiveShadow>
              <boxGeometry args={[17.8, 0.05, 1.4]} />
              <meshStandardMaterial color="#111317" roughness={0.85} />
            </mesh>
            {/* South Perimeter Connector Pathway */}
            <mesh position={[-1.0, 0.055, 13.4]} receiveShadow>
              <boxGeometry args={[24.0, 0.05, 1.2]} />
              <meshStandardMaterial color="#111317" roughness={0.85} />
            </mesh>
          </group>

          {/* All 30 VISTAS Campus Buildings */}
          {buildings.map((b) => (
            <Building
              key={b.id}
              building={b}
              isSelected={selectedBuildingId === b.id}
              onSelect={(id) =>
                setSelectedBuildingId(selectedBuildingId === id ? null : id)
              }
              activeLayer={activeLayer}
              isNavigating={isNavigating}
              isNavOrigin={isNavigating && activeRoute.fromId === b.id}
              isNavDestination={isNavigating && activeRoute.toId === b.id}
            />
          ))}

          {/* Gates 1-4 and "YOU ARE HERE" Marker */}
          <CampusGatesAndLandmarks />

          {/* Security Incident 3D Markers when Security Layer is Active */}
          {activeLayer === 'security' &&
            incidents
              .filter((i) => i.status !== 'Resolved')
              .map((inc) => (
                <CampusMarker
                  key={inc.id}
                  position={[inc.coordinates[0], inc.coordinates[1] + 2.5, inc.coordinates[2]]}
                  title={inc.code}
                  subtitle={`${inc.type} • ${inc.location}`}
                  badge={inc.severity}
                  variant={inc.severity === 'Critical' ? 'rose' : 'amber'}
                  onClick={() => setSelectedBuildingId(inc.buildingId)}
                />
              ))}

          {/* Parking Zone Markers when Parking Layer is Active */}
          {activeLayer === 'parking' &&
            parkingZones.map((pz) => (
              <CampusMarker
                key={pz.id}
                position={[pz.position[0], 2.4, pz.position[2]]}
                title={pz.name}
                subtitle={`${pz.availableSpaces} Open / ${pz.totalSpaces} Total`}
                badge={`${pz.occupancyPercent}%`}
                variant={pz.occupancyPercent > 80 ? 'amber' : 'cyan'}
                onClick={() => navigate('/parking')}
              />
            ))}

          {/* Energy Flow Particles */}
          <EnergyFlowLines active={activeLayer === 'energy'} />

          {/* Trees, Street Lights, and Student Figures */}
          <CampusTrees highlightEnv={activeLayer === 'environment'} />
          <StreetLights />
          <StudentFigures />

          {/* Glowing 3D Navigation Route when Navigation Mode is Active */}
          {isNavigating && <NavigationRoute route={activeRoute} />}

          {/* Smooth Camera Rig & OrbitControls */}
          <CameraRig
            selectedPosition={selectedBuilding ? selectedBuilding.position : null}
            controlsRef={controlsRef}
          />
          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.06}
            maxPolarAngle={Math.PI / 2.15}
            minPolarAngle={Math.PI / 6}
            minDistance={8}
            maxDistance={42}
          />
        </Canvas>
      </div>
    </div>
  );
};
