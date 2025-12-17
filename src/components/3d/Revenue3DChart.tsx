import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, Cylinder } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

interface RevenueData {
  month: string;
  mrr: number;
  arr: number;
}

interface Revenue3DChartProps {
  data: RevenueData[];
  className?: string;
}

function CylinderBar({ 
  position, 
  height, 
  color, 
  delay,
  glowColor
}: { 
  position: [number, number, number]; 
  height: number; 
  color: string;
  delay: number;
  glowColor: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const currentHeight = useRef(0.01);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime - delay;
      if (time > 0) {
        currentHeight.current = THREE.MathUtils.lerp(
          currentHeight.current,
          height,
          0.04
        );
        meshRef.current.scale.y = currentHeight.current;
        meshRef.current.position.y = currentHeight.current / 2;
        
        if (glowRef.current) {
          glowRef.current.scale.y = currentHeight.current;
          glowRef.current.position.y = currentHeight.current / 2;
        }
      }
      
      // Pulse effect
      const pulse = Math.sin(state.clock.elapsedTime * 3 + delay * 2) * 0.02 + 1;
      meshRef.current.scale.x = pulse;
      meshRef.current.scale.z = pulse;
    }
  });

  return (
    <group position={position}>
      {/* Glow cylinder */}
      <mesh ref={glowRef} position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 1, 32]} />
        <meshBasicMaterial 
          color={glowColor} 
          transparent 
          opacity={0.15}
        />
      </mesh>
      
      {/* Main cylinder */}
      <mesh ref={meshRef} position={[0, 0.01, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.25, 1, 32]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.8}
          roughness={0.15}
          emissive={color}
          emissiveIntensity={0.25}
        />
      </mesh>
      
      {/* Top cap glow */}
      <pointLight 
        position={[0, height + 0.2, 0]} 
        intensity={0.3} 
        color={glowColor} 
        distance={1}
      />
    </group>
  );
}

function HolographicGrid() {
  const gridRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={gridRef}>
      {/* Base platform with gradient */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <circleGeometry args={[4.5, 64]} />
        <meshStandardMaterial 
          color="#0f0f23"
          transparent 
          opacity={0.8}
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>
      
      {/* Concentric rings */}
      {[1, 2, 3, 4].map((r) => (
        <mesh key={r} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[r - 0.02, r, 64]} />
          <meshBasicMaterial color="#f6ad55" transparent opacity={0.15} />
        </mesh>
      ))}
      
      {/* Radial lines */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh 
          key={i} 
          position={[0, 0.01, 0]} 
          rotation={[0, (i * Math.PI) / 6, 0]}
        >
          <boxGeometry args={[4, 0.003, 0.003]} />
          <meshBasicMaterial color="#f6ad55" transparent opacity={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ data }: { data: RevenueData[] }) {
  const maxValue = useMemo(() => 
    Math.max(...data.map(d => Math.max(d.mrr, d.arr))) || 1,
    [data]
  );

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 8, 5]} intensity={1.2} color="#f6ad55" />
      <pointLight position={[-5, 5, -5]} intensity={0.6} color="#4299e1" />
      <spotLight 
        position={[0, 10, 0]} 
        angle={0.4} 
        penumbra={1} 
        intensity={0.8} 
        color="#fff"
        castShadow
      />
      
      <HolographicGrid />
      
      {data.map((item, index) => {
        const angle = ((index / data.length) * Math.PI * 2) - Math.PI / 2;
        const radius = 2.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        const mrrHeight = (item.mrr / maxValue) * 2.5 + 0.2;
        const arrHeight = (item.arr / maxValue) * 2.5 + 0.2;
        
        return (
          <group key={item.month}>
            <CylinderBar
              position={[x - 0.3, 0, z]}
              height={mrrHeight}
              color="#f6ad55"
              glowColor="#f6ad55"
              delay={index * 0.15}
            />
            <CylinderBar
              position={[x + 0.3, 0, z]}
              height={arrHeight}
              color="#4299e1"
              glowColor="#4299e1"
              delay={index * 0.15 + 0.07}
            />
            <Text
              position={[x, -0.4, z]}
              fontSize={0.2}
              color="white"
              anchorX="center"
              anchorY="top"
              rotation={[0, -angle + Math.PI / 2, 0]}
            >
              {item.month}
            </Text>
          </group>
        );
      })}
      
      {/* Center label */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.25}
          color="#f6ad55"
          anchorX="center"
          anchorY="middle"
        >
          Revenue
        </Text>
      </Float>
      
      {/* Legend */}
      <group position={[3.5, 2.2, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
          <meshStandardMaterial color="#f6ad55" emissive="#f6ad55" emissiveIntensity={0.4} />
        </mesh>
        <Text position={[0.3, 0, 0]} fontSize={0.12} color="white" anchorX="left">
          MRR ($K)
        </Text>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
          <meshStandardMaterial color="#4299e1" emissive="#4299e1" emissiveIntensity={0.4} />
        </mesh>
        <Text position={[0.3, -0.3, 0]} fontSize={0.12} color="white" anchorX="left">
          ARR ($K)
        </Text>
      </group>
    </>
  );
}

export const Revenue3DChart = ({ data, className = "" }: Revenue3DChartProps) => {
  return (
    <div className={`${className}`}>
      <Canvas
        camera={{ position: [0, 4, 6], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
        shadows
      >
        <Scene data={data} />
      </Canvas>
    </div>
  );
};

export default Revenue3DChart;
