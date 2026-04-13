import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { TriakisOctahedron } from './components/TriakisOctahedron';
import { Info, MousePointer2, Move } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="relative w-full h-screen bg-[#020617] text-slate-200 font-sans overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#0f172a_0%,_#020617_100%)] opacity-50" />

      {/* Header */}
      <header className="absolute top-8 left-8 z-10 max-w-md pointer-events-none">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold tracking-tight text-white mb-4"
        >
          Triakis Octahedron
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 leading-relaxed"
        >
          Interactive 3D model of the Catalan solid. 
          A triakis octahedron is an octahedron with a triangular pyramid 
          added to each face, resulting in 24 triangular faces.
        </motion.p>
      </header>

      {/* 3D Canvas */}
      <div className="w-full h-full">
        <Canvas shadows gl={{ antialias: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
          <Suspense fallback={null}>
            <TriakisOctahedron scale={2.2} />
            <Environment preset="city" />
            <ContactShadows 
              position={[0, -3.5, 0]} 
              opacity={0.4} 
              scale={10} 
              blur={2} 
              far={4.5} 
            />
          </Suspense>
          
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <OrbitControls 
            enablePan={false} 
            minDistance={4} 
            maxDistance={15} 
            autoRotate 
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* Legend */}
      <div className="absolute bottom-8 left-8 flex flex-col gap-3 z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-3 bg-slate-900/40 backdrop-blur-md border border-slate-800 px-4 py-2.5 rounded-xl"
        >
          <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
          <span className="text-sm font-medium">Octahedron Vertices</span>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-3 bg-slate-900/40 backdrop-blur-md border border-slate-800 px-4 py-2.5 rounded-xl"
        >
          <div className="w-3 h-3 rounded-full bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.3)]" />
          <span className="text-sm font-medium">Pyramid Tips</span>
        </motion.div>
      </div>

      {/* Interaction Hints */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 right-8 flex items-center gap-6 text-[11px] uppercase tracking-widest text-slate-500 font-semibold bg-slate-900/20 backdrop-blur-sm px-6 py-3 rounded-full border border-slate-800/50"
      >
        <div className="flex items-center gap-2">
          <MousePointer2 size={12} />
          <span>Drag to rotate</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-slate-700" />
        <div className="flex items-center gap-2">
          <Move size={12} />
          <span>Scroll to zoom</span>
        </div>
      </motion.div>

      {/* Info Button (Top Right) */}
      <button className="absolute top-8 right-8 p-3 rounded-full bg-slate-900/40 backdrop-blur-md border border-slate-800 hover:bg-slate-800 transition-colors text-slate-400 hover:text-white">
        <Info size={20} />
      </button>
    </div>
  );
}
