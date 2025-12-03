/// <reference types="@react-three/fiber" />
import React, { useRef } from 'react';
import { OrbitControls, Environment, Sparkles, MeshReflectorMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import LuxuryTree from './LuxuryTree';
import { TreeState } from '../types';

interface SceneProps {
  state: TreeState;
}

const Scene: React.FC<SceneProps> = ({ state }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Slower, more majestic auto-rotation
      groupRef.current.rotation.y += delta * state.rotationSpeed * 0.2;
    }
  });

  return (
    <>
      {/* Only render environment background if NOT in Camera/AR mode */}
      {!state.useCamera && (
        <>
          <color attach="background" args={['#010603']} />
          <fog attach="fog" args={['#010603', 5, 25]} />
        </>
      )}

      {/* Cinematic Lighting */}
      <ambientLight intensity={state.useCamera ? 0.8 : 0.2} color="#002211" />
      <spotLight
        position={[10, 20, 10]}
        angle={0.25}
        penumbra={1}
        intensity={state.lightIntensity * 2.5}
        castShadow
        shadow-bias={-0.0001}
        color="#fff5cc"
      />
      {/* Fill lights for luxury shine */}
      <pointLight position={[-10, 5, -10]} intensity={0.8} color={state.theme === 'patriot' ? '#FF0000' : '#D4AF37'} />
      <pointLight position={[10, 5, -10]} intensity={0.8} color={state.theme === 'patriot' ? '#0000FF' : '#D4AF37'} />
      <pointLight position={[0, 0, 10]} intensity={0.5} color="#ffffff" />

      <group ref={groupRef}>
        <LuxuryTree theme={state.theme} />
      </group>

      {/* Floor - Hide in AR mode */}
      {!state.useCamera && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.5, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={1024}
            mixBlur={1}
            mixStrength={40}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#050505"
            metalness={0.5}
          />
        </mesh>
      )}

      {/* Atmospheric Particles */}
      {state.isSnowing && (
        <Sparkles
          count={300}
          scale={[15, 15, 15]}
          size={4}
          speed={0.4}
          opacity={0.6}
          color={state.theme === 'gold' ? '#FFD700' : '#FFFFFF'}
        />
      )}

      {/* Environment Reflections */}
      <Environment preset="city" />

      {/* Controls - Updated for smooth gestures */}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.05}
        autoRotate={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2 - 0.1}
        minDistance={5}
        maxDistance={20}
        rotateSpeed={0.5}
      />

      {/* Post Processing for the "Glamour" look */}
      <EffectComposer enableNormalPass={false}>
        <Bloom
          luminanceThreshold={0.9}
          mipmapBlur
          intensity={1.2}
          radius={0.4}
        />
        {!state.useCamera && (
           <Vignette eskil={false} offset={0.1} darkness={1.1} />
        )}
        <Noise opacity={0.02} />
      </EffectComposer>
    </>
  );
};

export default Scene;