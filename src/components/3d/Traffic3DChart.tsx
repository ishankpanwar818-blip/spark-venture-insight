import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, RoundedBox } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

interface TrafficData {
  month: string;
  visitors: number;
  pageViews: number;
}

interface Traffic3DChartProps {
  data: TrafficData[];
  className?: string;
}

function Bar({ 
  position, 
  height, 
  color, 
  label,
  delay 
}: { 
  position: [number, number, number]; 
  height: number; 
  color: string;
  label: string;
  delay: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetHeight = useRef(0);
  const currentHeight = useRef(0.01);

  useFrame((state) => {
    if (meshRef.current) {
      // Animate height on mount
      const time = state.clock.elapsedTime - delay;
      if (time > 0) {
        currentHeight.current = THREE.MathUtils.lerp(
          currentHeight.current,
          height,
          0.05
        );
        meshRef.current.scale.y = currentHeight.current;
        meshRef.current.position.y = currentHeight.current / 2;
      }
      
      // Subtle floating animation
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 2 + delay) * 0.002;
    }
  });

  return (
    <group position={position}>
      <Float speed={1} rotationIntensity={0} floatIntensity={0.1}>
        <mesh ref={meshRef} position={[0, 0.01, 0]} castShadow>
          <boxGeometry args={[0.4, 1, 0.4]} />
          <meshStandardMaterial 
            color={color} 
            metalness={0.7}
            roughness={0.2}
            emissive={color}
            emissiveIntensity={0.2}
          />
        </mesh>
      </Float>
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="top"
      >
        {label}
      </Text>
    </group>
  );
}

function ChartGrid() {
  return (
    <>
      {/* Base platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          transparent 
          opacity={0.6}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
      
      {/* Grid lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[-3.5, i * 0.5, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[7, 0.005, 0.005]} />
          <meshBasicMaterial color="#4299e1" transparent opacity={0.3} />
        </mesh>
      ))}
    </>
  );
}

function Scene({ data }: { data: TrafficData[] }) {
  const maxValue = useMemo(() => 
    Math.max(...data.map(d => Math.max(d.visitors, d.pageViews))) || 1,
    [data]
  );

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#4299e1" />
      <pointLight position={[-5, 3, -5]} intensity={0.5} color="#f6ad55" />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.5} />
      
      <ChartGrid />
      
      {data.map((item, index) => {
        const x = (index - (data.length - 1) / 2) * 1.2;
        const visitorsHeight = (item.visitors / maxValue) * 2 + 0.1;
        const pageViewsHeight = (item.pageViews / maxValue) * 2 + 0.1;
        
        return (
          <group key={item.month}>
            <Bar
              position={[x - 0.25, 0, 0.3]}
              height={visitorsHeight}
              color="#4299e1"
              label=""
              delay={index * 0.1}
            />
            <Bar
              position={[x + 0.25, 0, 0.3]}
              height={pageViewsHeight}
              color="#f6ad55"
              label=""
              delay={index * 0.1 + 0.05}
            />
            <Text
              position={[x, -0.4, 0.3]}
              fontSize={0.18}
              color="white"
              anchorX="center"
              anchorY="top"
            >
              {item.month}
            </Text>
          </group>
        );
      })}
      
      {/* Legend */}
      <group position={[3, 1.8, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.15, 0.15, 0.15]} />
          <meshStandardMaterial color="#4299e1" emissive="#4299e1" emissiveIntensity={0.3} />
        </mesh>
        <Text position={[0.4, 0, 0]} fontSize={0.12} color="white" anchorX="left">
          Visitors
        </Text>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.15, 0.15, 0.15]} />
          <meshStandardMaterial color="#f6ad55" emissive="#f6ad55" emissiveIntensity={0.3} />
        </mesh>
        <Text position={[0.4, -0.25, 0]} fontSize={0.12} color="white" anchorX="left">
          Page Views
        </Text>
      </group>
    </>
  );
}

export const Traffic3DChart = ({ data, className = "" }: Traffic3DChartProps) => {
  return (
    <div className={`${className}`}>
      <Canvas
        camera={{ position: [0, 3, 5], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
        shadows
      >
        <Scene data={data} />
      </Canvas>
    </div>
  );
};

export default Traffic3DChart;
