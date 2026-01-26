"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Line } from "@react-three/drei";

/* ================= CENTRAL IOT HUB ================= */
function IoTHub() {
  return (
    <mesh>
      <boxGeometry args={[2.4, 0.4, 2.4]} />
      <meshStandardMaterial
        color="#2563eb"
        metalness={0.8}
        roughness={0.2}
        emissive="#1e40af"
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}

/* ================= SENSOR NODE ================= */
function Sensor({ position }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.25, 32, 32]} />
      <meshStandardMaterial
        color="#38bdf8"
        emissive="#0ea5e9"
        emissiveIntensity={0.6}
      />
    </mesh>
  );
}

/* ================= NETWORK ================= */
function Network() {
  const sensors = [
    [2.5, 1, 0],
    [-2.5, 1, 0],
    [0, 1, 2.5],
    [0, 1, -2.5],
    [1.8, 1.5, 1.8],
    [-1.8, 1.5, -1.8],
  ];

  return (
    <>
      {/* Sensors */}
      {sensors.map((pos, i) => (
        <Sensor key={i} position={pos} />
      ))}

      {/* Connection lines */}
      {sensors.map((pos, i) => (
        <Line
          key={`line-${i}`}
          points={[[0, 0.3, 0], pos]}
          color="#60a5fa"
          lineWidth={1}
          dashed={false}
        />
      ))}
    </>
  );
}

/* ================= MAIN SCENE ================= */
export default function Iot3DModel() {
  return (
    <Canvas camera={{ position: [0, 3.5, 6], fov: 45 }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[6, 6, 6]} intensity={1.2} />
      <pointLight position={[-5, 3, -5]} intensity={0.6} color="#38bdf8" />

      <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
        <IoTHub />
        <Network />
      </Float>

      <OrbitControls
        enableZoom={false}
        autoRotate
        autoRotateSpeed={1.2}
      />
    </Canvas>
  );
}
