/// <reference types="@react-three/fiber" />
import React, { useMemo } from 'react';
import { Float, Instance, Instances, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { ThemeColor } from '../types';

interface LuxuryTreeProps {
  theme: ThemeColor;
}

const LuxuryTree: React.FC<LuxuryTreeProps> = ({ theme }) => {
  // Tree Dimensions
  const treeHeight = 8;
  const baseRadius = 3.2;
  const yStart = -3.5;

  // 1. Generate Foliage Instances (Needles/Branches)
  const foliageData = useMemo(() => {
    const data: { position: [number, number, number]; rotation: [number, number, number]; scale: number }[] = [];
    const count = 1200; // Number of branches

    for (let i = 0; i < count; i++) {
      const t = i / count;
      // Distribution: More at bottom, fewer at top (cone volume surface bias)
      const y = yStart + t * treeHeight;
      const progress = (y - yStart) / treeHeight; // 0 to 1
      
      const currentRadius = baseRadius * (1 - progress);
      if (currentRadius < 0.1) continue;

      // Golden angle spiral
      const angle = i * 2.39996; 
      // Add some depth jitter so it's not a perfect smooth cone
      const r = currentRadius * (0.6 + 0.4 * Math.random());
      
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;

      // Orientation: Look out and slightly up
      const dummy = new THREE.Object3D();
      dummy.position.set(x, y, z);
      dummy.lookAt(x * 2, y + (1.5 - progress), z * 2); 
      
      data.push({
        position: [x, y, z],
        rotation: [dummy.rotation.x, dummy.rotation.y, dummy.rotation.z],
        scale: (1 - progress * 0.6) * (0.8 + Math.random() * 0.4),
      });
    }
    return data;
  }, []);

  // 2. Generate Ornament Positions (Surface only)
  const ornamentData = useMemo(() => {
    const pos: [number, number, number][] = [];
    const count = 70;
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 2 * 9; // 9 turns
      const y = yStart + 0.5 + (t * (treeHeight - 1));
      
      const progress = (y - yStart) / treeHeight;
      const r = (baseRadius * (1 - progress)) + 0.2; // Slightly outside foliage
      
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      pos.push([x, y, z]);
    }
    return pos;
  }, []);

  // 3. Generate Lights Positions
  const lightPositions = useMemo(() => {
    const pos: [number, number, number][] = [];
    const count = 150;
    for (let i = 0; i < count; i++) {
        const t = i / count;
        const angle = t * Math.PI * 2 * 13; // Different frequency
        const y = yStart + 0.5 + (t * (treeHeight - 1.2));
        const progress = (y - yStart) / treeHeight;
        const r = (baseRadius * (1 - progress)) * 0.95; // Slightly inside foliage
        
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        pos.push([x, y, z]);
    }
    return pos;
  }, []);

  const ornamentColor = useMemo(() => {
    switch (theme) {
      case 'diamond': return '#E0FFFF';
      case 'patriot': return '#B22234'; 
      default: return '#D4AF37'; // Gold
    }
  }, [theme]);

  return (
    <group position={[0, 0, 0]}>
      {/* Trunk */}
      <mesh position={[0, yStart + treeHeight * 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.6, treeHeight * 0.8, 8]} />
        <meshStandardMaterial color="#2e1c11" roughness={0.9} />
      </mesh>

      {/* Foliage Instances */}
      <Instances range={foliageData.length} castShadow receiveShadow>
        {/* Flattened cone creates a "branch" look */}
        <coneGeometry args={[0.35, 1.2, 4]} /> 
        {/* RICH GREEN MATERIAL UPDATE */}
        <meshStandardMaterial 
          color="#0B6623" 
          roughness={0.6} 
          metalness={0.1} 
          emissive="#002200"
          emissiveIntensity={0.2}
        />
        {foliageData.map((data, i) => (
          <Instance
            key={i}
            position={data.position}
            rotation={data.rotation}
            scale={data.scale}
            color={Math.random() > 0.6 ? '#138808' : '#0B6623'} // Varying shades of emerald and forest green
          />
        ))}
      </Instances>

      {/* The Grand Star */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group position={[0, yStart + treeHeight, 0]}>
            <mesh>
            <octahedronGeometry args={[0.6, 0]} />
            <meshStandardMaterial
                color="#FFD700"
                emissive="#FFAA00"
                emissiveIntensity={2}
                toneMapped={false}
                roughness={0.2}
                metalness={1}
            />
            </mesh>
            <pointLight distance={8} intensity={3} color="#FFD700" />
            <Sparkles count={20} scale={2} size={6} speed={0.4} opacity={1} color="#FFF" />
        </group>
      </Float>

      {/* Ornaments */}
      <Instances range={ornamentData.length} castShadow>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial
          color={ornamentColor}
          roughness={0.1}
          metalness={0.9}
          envMapIntensity={1.5}
        />
        {ornamentData.map((pos, i) => (
          <Instance
            key={i}
            position={pos}
            color={theme === 'patriot' ? (i % 2 === 0 ? '#B22234' : '#3C3B6E') : undefined}
          />
        ))}
      </Instances>

      {/* Lights */}
      <Instances range={lightPositions.length}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial toneMapped={false} />
        {lightPositions.map((pos, i) => (
          <Instance
            key={i}
            position={pos}
            color={theme === 'diamond' ? '#FFFFFF' : '#FFDD88'}
          />
        ))}
      </Instances>
      
      {/* Ribbon Tube */}
       <mesh position={[0, 0, 0]} castShadow>
         <tubeGeometry args={[new THREE.CatmullRomCurve3(
            ornamentData.map(p => new THREE.Vector3(p[0]*1.05, p[1], p[2]*1.05)), // Slightly offset from ornaments
            true, 'catmullrom', 0.5
         ), 200, 0.08, 8, false]} />
         <meshStandardMaterial
            color={theme === 'gold' ? '#C5B358' : '#E5E5E5'}
            roughness={0.3}
            metalness={1}
            emissive={theme === 'gold' ? '#554400' : '#222'}
         />
      </mesh>
    </group>
  );
};

export default LuxuryTree;