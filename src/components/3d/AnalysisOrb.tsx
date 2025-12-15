import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

interface AnalysisOrbProps {
  isLoading?: boolean;
  className?: string;
}

function LoadingOrb({ isLoading }: { isLoading: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * (isLoading ? 2 : 0.5);
      meshRef.current.rotation.x = state.clock.elapsedTime * (isLoading ? 1.5 : 0.3);
    }
    if (materialRef.current) {
      materialRef.current.distort = isLoading 
        ? 0.4 + Math.sin(state.clock.elapsedTime * 3) * 0.2 
        : 0.3;
    }
  });

  return (
    <Float speed={isLoading ? 3 : 1.5} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1.2, 64, 64]}>
        <MeshDistortMaterial
          ref={materialRef}
          color={isLoading ? "#f6ad55" : "#4299e1"}
          attach="material"
          distort={0.3}
          speed={isLoading ? 4 : 2}
          roughness={0.1}
          metalness={0.9}
          emissive={isLoading ? "#f6ad55" : "#4299e1"}
          emissiveIntensity={isLoading ? 0.3 : 0.1}
        />
      </Sphere>
    </Float>
  );
}

function ParticleRing({ isLoading }: { isLoading: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * (isLoading ? 1.5 : 0.3);
      ringRef.current.rotation.x = Math.PI * 0.4;
    }
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[1.8, 0.015, 16, 64]} />
      <meshBasicMaterial 
        color={isLoading ? "#f6ad55" : "#4299e1"} 
        transparent 
        opacity={0.7} 
      />
    </mesh>
  );
}

export const AnalysisOrb = ({ isLoading = false, className = "" }: AnalysisOrbProps) => {
  return (
    <div className={`${className}`}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#4299e1" />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#f6ad55" />
        
        <LoadingOrb isLoading={isLoading} />
        <ParticleRing isLoading={isLoading} />
      </Canvas>
    </div>
  );
};

export default AnalysisOrb;
