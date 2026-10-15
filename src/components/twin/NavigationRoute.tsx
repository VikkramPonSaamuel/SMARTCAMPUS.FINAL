import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { NavigationRouteData } from '../../types/campus';

interface NavigationRouteProps {
  route: NavigationRouteData;
}

export const NavigationRoute: React.FC<NavigationRouteProps> = ({ route }) => {
  const arrowRefs = useRef<(THREE.Group | null)[]>([]);
  const pinRef = useRef<THREE.Group>(null);
  const pulseRingRef = useRef<THREE.Mesh>(null);

  const curve = useMemo(() => {
    const vectors = route.waypoints.map((pt) => new THREE.Vector3(pt[0], pt[1], pt[2]));
    return new THREE.CatmullRomCurve3(vectors, false, 'catmullrom', 0.08);
  }, [route.waypoints]);

  const curvePoints = useMemo(() => {
    return curve.getPoints(90).map((v) => [v.x, v.y, v.z] as [number, number, number]);
  }, [curve]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Animate directional chevrons along the Google Maps route
    arrowRefs.current.forEach((grp, idx) => {
      if (!grp) return;
      const progress = (t * 0.18 + idx / 8) % 1;
      const nextProgress = Math.min(0.999, progress + 0.015);
      const pos = curve.getPointAt(progress);
      const nextPos = curve.getPointAt(nextProgress);
      grp.position.set(pos.x, pos.y + 0.05, pos.z);
      grp.lookAt(nextPos.x, nextPos.y + 0.05, nextPos.z);
    });

    // Subtle floating bounce on Destination Red Pin
    if (pinRef.current) {
      pinRef.current.position.y = 0.85 + Math.sin(t * 3.2) * 0.12;
      pinRef.current.rotation.y = t * 1.2;
    }

    // Pulsing target ring at destination
    if (pulseRingRef.current) {
      const s = 1 + ((t * 1.2) % 1) * 0.9;
      pulseRingRef.current.scale.set(s, s, 1);
      const mat = pulseRingRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = 0.8 * (1 - ((t * 1.2) % 1));
      }
    }
  });

  const startPt = route.waypoints[0];
  const endPt = route.waypoints[route.waypoints.length - 1];
  const midPt = curve.getPointAt(0.5);

  return (
    <group>
      {/* 1. Google Maps Outer Soft Glow Halo */}
      <Line
        points={curvePoints.map((p) => [p[0], p[1] - 0.02, p[2]])}
        color="#3B82F6"
        lineWidth={16}
        transparent
        opacity={0.35}
      />

      {/* 2. Google Maps Deep Royal Blue Route Casing / Border */}
      <Line
        points={curvePoints.map((p) => [p[0], p[1] - 0.01, p[2]])}
        color="#174EA6"
        lineWidth={11}
        transparent
        opacity={0.98}
      />

      {/* 3. Google Maps Primary Navigation Blue Ribbon (#1A73E8 / #4285F4) */}
      <Line
        points={curvePoints}
        color="#1A73E8"
        lineWidth={7}
        transparent
        opacity={1}
      />

      {/* 4. Luminous Center Highlight Line */}
      <Line
        points={curvePoints.map((p) => [p[0], p[1] + 0.01, p[2]])}
        color="#93C5FD"
        lineWidth={2.5}
        transparent
        opacity={0.95}
      />

      {/* 5. Animated White Directional Arrows Flowing Along Route */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
        <group
          key={idx}
          ref={(el) => {
            arrowRefs.current[idx] = el;
          }}
        >
          {/* Directional Arrow Cone pointing along route */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.2, 0.42, 3]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        </group>
      ))}

      {/* 6. Google Maps Origin Dot (White Ring + #1A73E8 Blue Core) */}
      <group position={[startPt[0], startPt[1], startPt[2]]}>
        {/* Outer Blue Halo */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.75, 32]} />
          <meshBasicMaterial color="#1A73E8" transparent opacity={0.28} side={THREE.DoubleSide} />
        </mesh>
        {/* White Casing Disc */}
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.45, 32]} />
          <meshBasicMaterial color="#FFFFFF" side={THREE.DoubleSide} />
        </mesh>
        {/* Google Maps Blue Inner Dot */}
        <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.3, 32]} />
          <meshBasicMaterial color="#1A73E8" side={THREE.DoubleSide} />
        </mesh>

        {/* Origin Floating Callout */}
        <Html position={[0, 2.2, 0]} center distanceFactor={22} zIndexRange={[8, 0]}>
          <div className="px-3 py-1.5 rounded-full bg-white border-2 border-[#1A73E8] text-[10px] font-sans font-bold text-[#0F172A] whitespace-nowrap shadow-[0_8px_24px_rgba(26,115,232,0.35)] flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1A73E8] ring-2 ring-blue-200 inline-block" />
            <span className="text-[#1A73E8] uppercase font-mono text-[9px]">Start:</span>
            <span>{route.fromName}</span>
          </div>
        </Html>
      </group>

      {/* 7. Google Maps 3D Red Destination Pin (#EA4335) */}
      <group position={[endPt[0], endPt[1], endPt[2]]}>
        {/* Expanding Radar Pulse Ring on Ground */}
        <mesh
          ref={pulseRingRef}
          position={[0, 0.03, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.5, 0.82, 32]} />
          <meshBasicMaterial color="#EA4335" transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>

        {/* Target Base Bullseye */}
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.45, 32]} />
          <meshBasicMaterial color="#EA4335" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.2, 32]} />
          <meshBasicMaterial color="#FFFFFF" side={THREE.DoubleSide} />
        </mesh>

        {/* Floating 3D Red Map Pin */}
        <group ref={pinRef} position={[0, 0.85, 0]}>
          {/* Pin Teardrop Sphere Head */}
          <mesh position={[0, 0.55, 0]} castShadow>
            <sphereGeometry args={[0.38, 24, 24]} />
            <meshStandardMaterial color="#EA4335" roughness={0.25} metalness={0.1} />
          </mesh>
          {/* Dark Crimson Inner Dot on Pin */}
          <mesh position={[0, 0.55, 0.33]}>
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshBasicMaterial color="#7F1D1D" />
          </mesh>
          <mesh position={[0, 0.55, -0.33]}>
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshBasicMaterial color="#7F1D1D" />
          </mesh>
          {/* Pin Inverted Cone Tip */}
          <mesh position={[0, 0.18, 0]} rotation={[Math.PI, 0, 0]} castShadow>
            <coneGeometry args={[0.34, 0.65, 24]} />
            <meshStandardMaterial color="#EA4335" roughness={0.25} metalness={0.1} />
          </mesh>
        </group>

        {/* Destination Floating Callout */}
        <Html position={[0, 2.5, 0]} center distanceFactor={22} zIndexRange={[8, 0]}>
          <div className="px-3.5 py-1.5 rounded-full bg-[#EA4335] border-2 border-white text-[10px] font-sans font-bold !text-white whitespace-nowrap shadow-[0_10px_28px_rgba(234,67,53,0.45)] flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-white animate-ping" />
            <span className="uppercase font-mono text-[9px] opacity-90">Dest:</span>
            <span>{route.toName}</span>
          </div>
        </Html>
      </group>

      {/* 8. Google Maps Floating Route Duration & Distance Bubble at Midpoint */}
      <Html position={[midPt.x, midPt.y + 1.35, midPt.z]} center distanceFactor={23} zIndexRange={[9, 0]}>
        <div className="px-3.5 py-2 rounded-2xl bg-[#1A73E8] border-2 border-white !text-white whitespace-nowrap shadow-[0_12px_30px_rgba(26,115,232,0.45)] flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#1A73E8] font-bold text-xs shadow-xs">
            🚶
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-xs font-extrabold !text-white">
                {route.walkingMinutes} min
              </span>
              <span className="text-[10px] font-mono !text-blue-100">
                ({route.distanceMeters} m)
              </span>
            </div>
            <p className="text-[8px] font-mono uppercase tracking-wider !text-blue-100">
              Fastest Campus Route • {route.crowdLevel} Crowd
            </p>
          </div>
        </div>
      </Html>
    </group>
  );
};
