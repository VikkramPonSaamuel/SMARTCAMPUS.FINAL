import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Edges } from '@react-three/drei';
import * as THREE from 'three';
import { BuildingData, TwinLayerMode } from '../../types/campus';

type FacadeTheme = 'academic-stone' | 'modern-glass' | 'hostel-terracotta' | 'landmark-blue' | 'temple-sandstone';

interface ArchitecturalPalette {
  wallBase: string;
  wallSecondary: string;
  spandrel: string;
  windowGlass: string;
  windowLit: string;
  mullion: string;
  roofDeck: string;
  parapet: string;
  plinth: string;
}

const PALETTES: Record<FacadeTheme, ArchitecturalPalette> = {
  'academic-stone': {
    wallBase: '#E6DEC8',      // Warm limestone / cream sandstone
    wallSecondary: '#D5C7AD', // Travertine stone banding
    spandrel: '#B8A990',      // Architectural concrete beam
    windowGlass: '#1E3A5F',   // Deep reflective architectural glass
    windowLit: '#38BDF8',     // Sunlit glass reflection
    mullion: '#27272A',       // Dark bronze window frame
    roofDeck: '#374151',      // Dark weathering roof membrane
    parapet: '#C2B299',       // Stone roof coping
    plinth: '#4B5563',        // Granite base plinth
  },
  'modern-glass': {
    wallBase: '#D8E0E8',      // Brushed architectural aluminum & pearl concrete
    wallSecondary: '#BCC8D4', // Steel cladding panel
    spandrel: '#475569',      // Dark slate spandrel
    windowGlass: '#0F2942',   // Deep sapphire curtain wall glass
    windowLit: '#0EA5E9',     // Sky reflection on glass
    mullion: '#1E293B',       // Anodized black aluminum frame
    roofDeck: '#27272A',      // Charcoal roof deck
    parapet: '#94A3B8',       // Metallic roof parapet
    plinth: '#334155',        // Dark basalt plinth
  },
  'hostel-terracotta': {
    wallBase: '#DDA372',      // Realistic warm terracotta / ochre brick stucco
    wallSecondary: '#C88452', // Deeper sienna recessed bay
    spandrel: '#F3ECE2',      // Crisp cream balcony slab & sun-breaker ledge
    windowGlass: '#1E293B',   // Shaded residential window
    windowLit: '#FDE68A',     // Warm interior room glow
    mullion: '#431407',       // Deep espresso frame
    roofDeck: '#44403C',      // Warm dark slate roof
    parapet: '#E7D8C5',       // Cream parapet wall
    plinth: '#57534E',        // Stone foundation
  },
  'landmark-blue': {
    wallBase: '#CEDCE6',      // Cool architectural ashlar stone
    wallSecondary: '#94B4C8', // Coastal blue-grey cladding
    spandrel: '#2B547E',      // Deep cobalt architectural band
    windowGlass: '#102A43',   // Tinted acoustic glass
    windowLit: '#38BDF8',     // Bright atrium glass
    mullion: '#1E293B',
    roofDeck: '#334155',
    parapet: '#CBD5E1',
    plinth: '#334155',
  },
  'temple-sandstone': {
    wallBase: '#DFC59B',      // Carved golden sandstone
    wallSecondary: '#C8A672',
    spandrel: '#A67C46',
    windowGlass: '#292524',
    windowLit: '#F59E0B',
    mullion: '#451A03',
    roofDeck: '#78350F',
    parapet: '#D97706',
    plinth: '#57534E',
  },
};

function getBuildingTheme(blockNum: string, category: BuildingData['category']): FacadeTheme {
  if (blockNum === '5') return 'temple-sandstone';
  if (['3', '11', '13', '22', '28', '29'].includes(blockNum)) return 'hostel-terracotta';
  if (['4', '7', '14', '19', '27'].includes(blockNum)) return 'landmark-blue';
  if (category === 'tech' || category === 'research' || category === 'library' || ['10', '12', '16', '17', '18', '20', '24', '30'].includes(blockNum)) {
    return 'modern-glass';
  }
  return 'academic-stone';
}

// Cache procedural CanvasTextures so all 30 buildings render at 60 FPS
const textureCache = new Map<string, THREE.CanvasTexture>();

function getProceduralFacadeTexture(theme: FacadeTheme, floors: number, bays: number): THREE.CanvasTexture {
  const key = `${theme}-${floors}-${bays}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const p = PALETTES[theme];
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // 1. Base Wall Cladding (Stone / Terracotta / Concrete)
  ctx.fillStyle = p.wallBase;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle vertical architectural pilasters / cladding seams
  const bayWidth = 512 / bays;
  for (let b = 0; b < bays; b++) {
    ctx.fillStyle = b % 2 === 0 ? p.wallBase : p.wallSecondary;
    ctx.fillRect(b * bayWidth, 0, bayWidth, 512);
  }

  // 2. Floor Slabs, Spandrel Bands & Realistic Multi-Pane Windows
  const floorHeight = 512 / floors;
  for (let f = 0; f < floors; f++) {
    const yTop = f * floorHeight;

    // Horizontal concrete slab / balcony ledge
    ctx.fillStyle = p.spandrel;
    ctx.fillRect(0, yTop, 512, floorHeight * 0.18);

    // Subtle shadow under ledge
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.fillRect(0, yTop + floorHeight * 0.18, 512, 4);

    // Windows across each bay
    const winMarginX = bayWidth * 0.14;
    const winWidth = bayWidth - winMarginX * 2;
    const winTop = yTop + floorHeight * 0.25;
    const winHeight = floorHeight * 0.62;

    for (let b = 0; b < bays; b++) {
      const winX = b * bayWidth + winMarginX;

      // Window outer frame / mullion
      ctx.fillStyle = p.mullion;
      ctx.fillRect(winX - 2, winTop - 2, winWidth + 4, winHeight + 4);

      // Window glass gradient (sky reflection + architectural tint)
      const grad = ctx.createLinearGradient(winX, winTop, winX + winWidth, winTop + winHeight);
      const isLit = (f + b * 3) % 5 === 0;
      grad.addColorStop(0, isLit ? p.windowLit : p.windowGlass);
      grad.addColorStop(1, p.windowGlass);
      ctx.fillStyle = grad;
      ctx.fillRect(winX, winTop, winWidth, winHeight);

      // Center vertical window mullion bar
      ctx.fillStyle = p.mullion;
      ctx.fillRect(winX + winWidth * 0.48, winTop, Math.max(2, winWidth * 0.04), winHeight);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  textureCache.set(key, texture);
  return texture;
}

interface BuildingProps {
  building: BuildingData;
  isSelected: boolean;
  onSelect: (id: string) => void;
  activeLayer: TwinLayerMode;
  isNavigating?: boolean;
  isNavOrigin?: boolean;
  isNavDestination?: boolean;
}

export const Building: React.FC<BuildingProps> = ({
  building,
  isSelected,
  onSelect,
  activeLayer,
  isNavigating = false,
  isNavOrigin = false,
  isNavDestination = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const [w, h, d] = building.size;
  const [x, y, z] = building.position;
  const blockNumber = building.id.replace('block-', '');

  const isNavEndpoint = isNavOrigin || isNavDestination;
  const isDimmedByNav = isNavigating && !isNavEndpoint && !isSelected && !hovered;

  const theme = useMemo(
    () => getBuildingTheme(blockNumber, building.category),
    [blockNumber, building.category]
  );
  const palette = PALETTES[theme];

  const floorsCount = Math.max(2, Math.round(h * 1.1));
  const baysCount = Math.max(3, Math.round(Math.max(w, d) * 1.6));

  const facadeTexture = useMemo(
    () => getProceduralFacadeTexture(theme, floorsCount, baysCount),
    [theme, floorsCount, baysCount]
  );

  // Smoothly lift building on hover, selection, or when it is a navigation Origin/Destination
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetY = isSelected || isNavEndpoint ? 0.42 : hovered ? 0.24 : 0;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      delta * 8
    );
  });

  // Layer overlay tint (or Google Maps navigation highlight / dim state)
  const getLayerTint = () => {
    if (isDimmedByNav) {
      return {
        emissive: '#FFFFFF',
        intensity: 0.15,
        edge: '#CBD5E1',
      };
    }
    if (isNavOrigin) {
      return {
        emissive: '#1A73E8',
        intensity: 0.28,
        edge: '#1A73E8',
      };
    }
    if (isNavDestination) {
      return {
        emissive: '#EA4335',
        intensity: 0.28,
        edge: '#EA4335',
      };
    }
    if (activeLayer === 'occupancy') {
      if (building.occupancy >= 80) return { emissive: '#008F7A', intensity: 0.35, edge: '#042F2E' };
      if (building.occupancy >= 68) return { emissive: '#14B8A6', intensity: 0.25, edge: '#007F6E' };
      return { emissive: '#5EEAD4', intensity: 0.15, edge: '#0D9488' };
    }
    if (activeLayer === 'energy') {
      if (building.status === 'warning') return { emissive: '#F59E0B', intensity: 0.4, edge: '#D97706' };
      return { emissive: '#14B8A6', intensity: 0.25, edge: '#008F7A' };
    }
    if (activeLayer === 'security') {
      if (building.id === 'block-12' || building.id === 'block-10') {
        return { emissive: '#F43F5E', intensity: 0.4, edge: '#E11D48' };
      }
      return { emissive: '#10B981', intensity: 0.1, edge: '#059669' };
    }
    return {
      emissive: isSelected || hovered ? '#0D9488' : '#000000',
      intensity: isSelected ? 0.25 : hovered ? 0.15 : 0,
      edge: isSelected || hovered ? '#008F7A' : '#475569',
    };
  };

  const layerTint = getLayerTint();

  const renderBoxMaterials = () => {
    if (isDimmedByNav) {
      return (
        <>
          {[0, 1, 2, 3, 4, 5].map((faceIdx) => (
            <meshStandardMaterial
              key={`dim-wall-${faceIdx}`}
              attach={`material-${faceIdx}`}
              color="#F1F5F9"
              roughness={0.85}
              metalness={0.05}
              transparent
              opacity={0.38}
            />
          ))}
        </>
      );
    }

    return (
      <>
        {[0, 1, 4, 5].map((faceIdx) => (
          <meshStandardMaterial
            key={`wall-${faceIdx}-${theme}`}
            attach={`material-${faceIdx}`}
            map={facadeTexture}
            roughness={theme === 'modern-glass' ? 0.28 : 0.55}
            metalness={theme === 'modern-glass' ? 0.32 : 0.08}
            emissive={layerTint.emissive}
            emissiveIntensity={layerTint.intensity}
          />
        ))}
        {[2, 3].map((roofIdx) => (
          <meshStandardMaterial
            key={`roof-${roofIdx}-${theme}`}
            attach={`material-${roofIdx}`}
            color={palette.roofDeck}
            roughness={0.8}
            metalness={0.15}
          />
        ))}
      </>
    );
  };

  return (
    <group position={[x, y, z]}>
      {/* Realistic Granite / Concrete Foundation Plinth & Sidewalk Apron */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[w + 0.45, 0.08, d + 0.45]} />
        <meshStandardMaterial
          color={isDimmedByNav ? '#E2E8F0' : palette.plinth}
          roughness={0.7}
          metalness={0.1}
          transparent={isDimmedByNav}
          opacity={isDimmedByNav ? 0.4 : 1}
        />
      </mesh>

      {/* Google Maps Highlight Base Ring when this Building is Origin or Destination */}
      {isNavEndpoint && (
        <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.max(w, d) * 0.58, Math.max(w, d) * 0.72, 36]} />
          <meshBasicMaterial
            color={isNavOrigin ? '#1A73E8' : '#EA4335'}
            side={THREE.DoubleSide}
            transparent
            opacity={0.85}
          />
        </mesh>
      )}

      {/* Security Layer Perimeter Ring */}
      {activeLayer === 'security' && (
        <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.max(w, d) * 0.6, Math.max(w, d) * 0.68, 36]} />
          <meshBasicMaterial
            color={building.id === 'block-12' || building.id === 'block-10' ? '#E11D48' : '#059669'}
            side={THREE.DoubleSide}
            transparent
            opacity={0.75}
          />
        </mesh>
      )}

      {/* Interactive Lifting Building Group */}
      <group
        ref={groupRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(building.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Main Realistic Textured Building Volume */}
        <mesh
          key={`main-vol-${building.id}-${theme}-${isDimmedByNav ? 'dim' : 'full'}`}
          position={[0, h / 2 + 0.08, 0]}
          castShadow={!isDimmedByNav}
          receiveShadow
        >
          <boxGeometry args={[w, h, d]} />
          {renderBoxMaterials()}
          <Edges scale={1.001} threshold={15} color={layerTint.edge} />
        </mesh>

        {/* Realistic Architectural Roof Parapet / Cornice Ledge */}
        <mesh position={[0, h + 0.11, 0]} castShadow={!isDimmedByNav}>
          <boxGeometry args={[w + 0.14, 0.1, d + 0.14]} />
          <meshStandardMaterial
            color={isDimmedByNav ? '#F8FAFC' : palette.parapet}
            roughness={0.5}
            transparent={isDimmedByNav}
            opacity={isDimmedByNav ? 0.38 : 1}
          />
        </mesh>

        {/* Rooftop Mechanical / Elevator Penthouse Core */}
        {w >= 1.8 && d >= 1.8 && !isDimmedByNav && (
          <mesh position={[-w * 0.22, h + 0.32, -d * 0.18]} castShadow>
            <boxGeometry args={[Math.min(1.1, w * 0.3), 0.38, Math.min(1.1, d * 0.3)]} />
            <meshStandardMaterial color={palette.wallSecondary} roughness={0.6} />
            <Edges color="#475569" />
          </mesh>
        )}

        {/* Ground Floor Entrance Canopy / Portico */}
        {!isDimmedByNav && (
          <mesh position={[0, 0.55, d / 2 + 0.18]} castShadow>
            <boxGeometry args={[Math.min(1.6, w * 0.45), 0.08, 0.36]} />
            <meshStandardMaterial color={palette.spandrel} roughness={0.4} metalness={0.3} />
          </mesh>
        )}

        {/* Special Architectural Wings Matching Image 1 Footprints */}
        {/* 1. Dr. MGR Block North Crown & East Annex */}
        {building.id === 'block-1' && (
          <>
            <mesh
              key={`mgr-wing-1-${isDimmedByNav ? 'dim' : 'full'}`}
              position={[-0.6, h * 0.55, -d * 0.55]}
              castShadow={!isDimmedByNav}
              receiveShadow
            >
              <boxGeometry args={[w * 0.45, h * 0.9, 1.4]} />
              {renderBoxMaterials()}
              <Edges color={layerTint.edge} />
            </mesh>
            <mesh
              key={`mgr-wing-2-${isDimmedByNav ? 'dim' : 'full'}`}
              position={[w * 0.68, h * 0.45, -0.4]}
              castShadow={!isDimmedByNav}
              receiveShadow
            >
              <boxGeometry args={[0.9, h * 0.8, d * 0.85]} />
              {renderBoxMaterials()}
              <Edges color={layerTint.edge} />
            </mesh>
          </>
        )}

        {/* 26. Quadrangle Courtyard Wings */}
        {building.id === 'block-26' && (
          <>
            <mesh
              key={`quad-wing-1-${isDimmedByNav ? 'dim' : 'full'}`}
              position={[-w * 0.38, h * 0.55, -0.8]}
              castShadow={!isDimmedByNav}
            >
              <boxGeometry args={[0.9, h, 1.2]} />
              {renderBoxMaterials()}
              <Edges color={layerTint.edge} />
            </mesh>
            <mesh
              key={`quad-wing-2-${isDimmedByNav ? 'dim' : 'full'}`}
              position={[w * 0.38, h * 0.55, -0.8]}
              castShadow={!isDimmedByNav}
            >
              <boxGeometry args={[0.9, h, 1.2]} />
              {renderBoxMaterials()}
              <Edges color={layerTint.edge} />
            </mesh>
          </>
        )}

        {/* 5. Vinayagar Temple Stepped Gopuram Tower */}
        {building.id === 'block-5' && !isDimmedByNav && (
          <group position={[0, h + 0.15, 0]}>
            <mesh position={[0, 0.2, 0]} castShadow>
              <coneGeometry args={[0.55, 0.9, 4]} />
              <meshStandardMaterial color="#D97706" roughness={0.5} />
            </mesh>
          </group>
        )}

        {/* 17. Central Library & 10. New Library Realistic Skylight Domes */}
        {building.category === 'library' && !isDimmedByNav && (
          <mesh position={[0, h + 0.15, 0]} castShadow>
            <cylinderGeometry args={[Math.min(w, d) * 0.3, Math.min(w, d) * 0.38, 0.85, 20]} />
            <meshPhysicalMaterial
              color="#38BDF8"
              emissive="#0284C7"
              emissiveIntensity={0.2}
              roughness={0.1}
              metalness={0.2}
              transmission={0.65}
              transparent
              opacity={0.88}
            />
          </mesh>
        )}

        {/* Realistic Deep-Blue Photovoltaic Solar Panel Arrays with Silver Frames */}
        {w >= 2.2 && !isDimmedByNav && (
          <group position={[w * 0.12, h + 0.16, 0.15]}>
            {[-0.5, 0.5].map((col) => (
              <mesh
                key={col}
                position={[col * (w * 0.26), 0.04, 0]}
                rotation={[0.18, 0, 0]}
              >
                <boxGeometry args={[w * 0.22, 0.03, d * 0.5]} />
                <meshStandardMaterial
                  color="#0F172A"
                  emissive={activeLayer === 'energy' ? '#0EA5E9' : '#1E3A8A'}
                  emissiveIntensity={activeLayer === 'energy' ? 0.6 : 0.25}
                  metalness={0.85}
                  roughness={0.15}
                />
                <Edges color="#CBD5E1" />
              </mesh>
            ))}
          </group>
        )}

        {/* 3D Block Number + Name Label */}
        <Html
          position={[0, h + (hovered || isSelected || isNavEndpoint ? 1.85 : 0.9), 0]}
          center
          distanceFactor={24}
          zIndexRange={[4, 0]}
        >
          {hovered || isSelected ? (
            <div className="pointer-events-none select-none rounded-2xl bg-white/95 backdrop-blur-xl border-2 border-[#008F7A] px-3.5 py-2.5 shadow-[0_12px_28px_rgba(0,143,122,0.28)] min-w-[185px]">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 font-display text-xs font-bold text-[#007F6E]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#008F7A] !text-white text-[10px] font-mono">
                    {blockNumber}
                  </span>
                  {building.name}
                </span>
              </div>
              <div className="mt-2 pt-1.5 border-t border-teal-500/20 grid grid-cols-3 gap-2 text-[10px] font-mono">
                <div>
                  <span className="text-[#467874] block">OCC</span>
                  <span className="text-[#042f2e] font-bold">{building.occupancy}%</span>
                </div>
                <div>
                  <span className="text-[#467874] block">LOAD</span>
                  <span className="text-[#007F6E] font-bold">{building.energyKw}kW</span>
                </div>
                <div>
                  <span className="text-[#467874] block">ROOMS</span>
                  <span className="text-emerald-700 font-bold">{building.roomsAvailable}</span>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onSelect(building.id);
              }}
              className={`cursor-pointer select-none px-2 py-0.5 rounded-full backdrop-blur-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                isNavOrigin
                  ? 'bg-white border-2 border-[#1A73E8] shadow-[0_6px_18px_rgba(26,115,232,0.4)] scale-110'
                  : isNavDestination
                  ? 'bg-white border-2 border-[#EA4335] shadow-[0_6px_18px_rgba(234,67,53,0.4)] scale-110'
                  : isDimmedByNav
                  ? 'bg-white/55 border border-slate-300/40 opacity-35 hover:opacity-100 scale-90'
                  : 'bg-white/92 border border-teal-600/35 hover:border-[#008F7A] shadow-xs'
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full !text-white text-[9px] font-mono font-bold ${
                  isNavOrigin
                    ? 'bg-[#1A73E8]'
                    : isNavDestination
                    ? 'bg-[#EA4335]'
                    : 'bg-[#008F7A]'
                }`}
              >
                {blockNumber}
              </span>
              <span className="text-[9px] font-sans font-bold text-[#042f2e]">
                {building.name}
              </span>
            </div>
          )}
        </Html>
      </group>
    </group>
  );
};

