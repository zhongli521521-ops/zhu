import React from 'react';
import { TreeState, ThemeColor } from '../types';

interface UIProps {
  state: TreeState;
  onUpdate: (key: keyof TreeState, value: any) => void;
}

const UI: React.FC<UIProps> = ({ state, onUpdate }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between p-6 md:p-12 z-10">
      
      {/* Header */}
      <div className="pointer-events-auto self-center text-center mt-4">
        <h1 className="font-cinzel text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-800 font-black tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] uppercase">
          Grand Holiday
        </h1>
        <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto my-2 opacity-80"></div>
        <p className="text-yellow-100/80 font-serif italic text-sm md:text-lg tracking-wider">
          The most luxurious celebration
        </p>
      </div>

      {/* Controls Panel */}
      <div className="pointer-events-auto max-w-md w-full mx-auto md:mx-0 bg-black/40 backdrop-blur-md border border-yellow-600/30 p-6 rounded-sm shadow-[0_0_30px_rgba(212,175,55,0.1)] transition-all hover:bg-black/50 hover:border-yellow-500/50">
        
        {/* AR / Camera Toggle */}
        <div className="mb-6 flex justify-center">
            <button
                onClick={() => onUpdate('useCamera', !state.useCamera)}
                className={`px-6 py-2 border-2 text-sm font-cinzel font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.5)]
                ${state.useCamera 
                    ? 'bg-red-800 border-red-500 text-white shadow-[0_0_20px_rgba(255,0,0,0.4)] animate-pulse' 
                    : 'bg-gradient-to-r from-yellow-600 to-yellow-800 border-yellow-500 text-black hover:scale-105'
                }`}
            >
                {state.useCamera ? 'Close Camera' : 'Live Camera View'}
            </button>
        </div>

        {/* Theme Select */}
        <div className="mb-6">
          <label className="block text-yellow-500 font-cinzel text-xs uppercase tracking-widest mb-3">
            Select Collection
          </label>
          <div className="flex gap-2">
            {(['gold', 'patriot', 'diamond'] as ThemeColor[]).map((theme) => (
              <button
                key={theme}
                onClick={() => onUpdate('theme', theme)}
                className={`flex-1 py-2 px-1 text-xs md:text-sm font-bold border transition-all duration-300 uppercase tracking-wider
                  ${state.theme === theme 
                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-700 text-black border-yellow-300 shadow-[0_0_15px_rgba(255,215,0,0.4)]' 
                    : 'bg-transparent text-yellow-600 border-yellow-900/50 hover:border-yellow-500 hover:text-yellow-400'
                  }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-yellow-500/80 font-cinzel text-xs uppercase">Rotation</label>
              <span className="text-yellow-500/80 text-xs font-mono">{(state.rotationSpeed * 10).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={state.rotationSpeed}
              onChange={(e) => onUpdate('rotationSpeed', parseFloat(e.target.value))}
              className="w-full h-1 bg-yellow-900/30 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
          </div>

          <div>
             <div className="flex justify-between mb-1">
              <label className="text-yellow-500/80 font-cinzel text-xs uppercase">Brilliance</label>
              <span className="text-yellow-500/80 text-xs font-mono">{(state.lightIntensity * 10).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={state.lightIntensity}
              onChange={(e) => onUpdate('lightIntensity', parseFloat(e.target.value))}
              className="w-full h-1 bg-yellow-900/30 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="mt-6 flex items-center justify-between border-t border-yellow-900/30 pt-4">
          <span className="text-yellow-400 font-cinzel text-xs uppercase tracking-wide">Atmospheric Snow</span>
          <button
            onClick={() => onUpdate('isSnowing', !state.isSnowing)}
            className={`w-12 h-6 rounded-full relative transition-colors duration-300 focus:outline-none border border-yellow-700/50 ${
              state.isSnowing ? 'bg-yellow-900/80' : 'bg-black/50'
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-600 shadow-md transition-transform duration-300 ${
                state.isSnowing ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="pointer-events-auto self-end text-right hidden md:block">
         <div className="text-yellow-600/40 text-[10px] uppercase tracking-[0.2em] font-cinzel">
            Est. 2024 • Limited Edition
         </div>
      </div>
    </div>
  );
};

export default UI;