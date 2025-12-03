import React, { useState, Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import Scene from './components/Scene';
import UI from './components/UI';
import { TreeState, ThemeColor } from './types';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeState>({
    rotationSpeed: 0.2,
    lightIntensity: 1.5,
    theme: 'gold',
    isSnowing: true,
    useCamera: false,
  });

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleUpdateState = (key: keyof TreeState, value: any) => {
    setTreeState((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (treeState.useCamera) {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          handleUpdateState('useCamera', false);
        }
      };
      startCamera();
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [treeState.useCamera]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Camera Feed Background */}
      <video
        ref={videoRef}
        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${treeState.useCamera ? 'opacity-100' : 'opacity-0'}`}
        playsInline
        muted
      />

      <Suspense fallback={null}>
        <Canvas
          shadows
          camera={{ position: [0, 4, 12], fov: 45 }}
          dpr={[1, 2]}
          gl={{ 
            antialias: true, 
            toneMappingExposure: 1.2,
            alpha: true // Enable transparency for camera feed
          }}
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
        >
          <Scene state={treeState} />
        </Canvas>
      </Suspense>
      <Loader 
        containerStyles={{ background: '#020402' }}
        innerStyles={{ width: '300px', height: '10px', background: '#333' }}
        barStyles={{ background: '#D4AF37', height: '10px' }}
        dataStyles={{ fontFamily: 'Cinzel', color: '#D4AF37', fontSize: '1.2rem' }}
        dataInterpolation={(p) => `Forging Luxury... ${p.toFixed(0)}%`}
      />
      <UI state={treeState} onUpdate={handleUpdateState} />
    </div>
  );
};

export default App;