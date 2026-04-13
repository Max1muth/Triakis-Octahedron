import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Sphere, Cylinder } from '@react-three/drei';

interface TriakisOctahedronProps {
  scale?: number;
}

export const TriakisOctahedron: React.FC<TriakisOctahedronProps> = ({ scale = 2 }) => {
  const c = 0.6; // Height of the pyramids
  
  const vertices = useMemo(() => {
    const v: [number, number, number][] = [
      // Octahedron vertices (6)
      [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
      // Pyramid tips (8)
      [c, c, c], [c, c, -c], [c, -c, c], [c, -c, -c],
      [-c, c, c], [-c, c, -c], [-c, -c, c], [-c, -c, -c]
    ];
    return v.map(pos => pos.map(coord => coord * scale) as [number, number, number]);
  }, [scale, c]);

  const edges = useMemo(() => {
    const e: [number, number][] = [];
    
    // Octahedron edges
    const octEdges: [number, number][] = [
      [0, 2], [0, 3], [0, 4], [0, 5],
      [1, 2], [1, 3], [1, 4], [1, 5],
      [2, 4], [2, 5], [3, 4], [3, 5]
    ];
    e.push(...octEdges);

    // Pyramid edges (each tip to 3 octahedron vertices)
    // Tip 6 (c,c,c) -> 0(1,0,0), 2(0,1,0), 4(0,0,1)
    e.push([6, 0], [6, 2], [6, 4]);
    // Tip 7 (c,c,-c) -> 0(1,0,0), 2(0,1,0), 5(0,0,-1)
    e.push([7, 0], [7, 2], [7, 5]);
    // Tip 8 (c,-c,c) -> 0(1,0,0), 3(0,-1,0), 4(0,0,1)
    e.push([8, 0], [8, 3], [8, 4]);
    // Tip 9 (c,-c,-c) -> 0(1,0,0), 3(0,-1,0), 5(0,0,-1)
    e.push([9, 0], [9, 3], [9, 5]);
    // Tip 10 (-c,c,c) -> 1(-1,0,0), 2(0,1,0), 4(0,0,1)
    e.push([10, 1], [10, 2], [10, 4]);
    // Tip 11 (-c,c,-c) -> 1(-1,0,0), 2(0,1,0), 5(0,0,-1)
    e.push([11, 1], [11, 2], [11, 5]);
    // Tip 12 (-c,-c,c) -> 1(-1,0,0), 3(0,-1,0), 4(0,0,1)
    e.push([12, 1], [12, 3], [12, 4]);
    // Tip 13 (-c,-c,-c) -> 1(-1,0,0), 3(0,-1,0), 5(0,0,-1)
    e.push([13, 1], [13, 3], [13, 5]);

    return e;
  }, []);

  return (
    <group>
      {/* Vertices */}
      {vertices.map((pos, i) => (
        <Sphere key={`v-${i}`} position={pos} args={[i < 6 ? 0.15 : 0.12, 32, 32]}>
          <meshStandardMaterial 
            color={i < 6 ? "#facc15" : "#94a3b8"} 
            roughness={0.1} 
            metalness={0.8} 
            emissive={i < 6 ? "#422006" : "#0f172a"}
            emissiveIntensity={0.5}
          />
        </Sphere>
      ))}

      {/* Edges */}
      {edges.map(([startIdx, endIdx], i) => {
        const start = new THREE.Vector3(...vertices[startIdx]);
        const end = new THREE.Vector3(...vertices[endIdx]);
        const direction = end.clone().sub(start);
        const length = direction.length();
        const midpoint = start.clone().add(direction.clone().multiplyScalar(0.5));
        
        // Orientation
        const quaternion = new THREE.Quaternion();
        const up = new THREE.Vector3(0, 1, 0);
        quaternion.setFromUnitVectors(up, direction.clone().normalize());

        return (
          <mesh key={`e-${i}`} position={midpoint} quaternion={quaternion}>
            <cylinderGeometry args={[0.03, 0.03, length, 8]} />
            <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.5} transparent opacity={0.8} />
          </mesh>
        );
      })}

      {/* Faces (Volume) */}
      <mesh>
        <polyhedronGeometry 
          args={[
            vertices.flat(),
            [
              // Tip 6 (c,c,c) -> 0, 2, 4
              6, 0, 2,  6, 2, 4,  6, 4, 0,
              // Tip 7 (c,c,-c) -> 0, 5, 2
              7, 0, 5,  7, 5, 2,  7, 2, 0,
              // Tip 8 (c,-c,c) -> 0, 3, 4
              8, 0, 4,  8, 4, 3,  8, 3, 0,
              // Tip 9 (c,-c,-c) -> 0, 3, 5
              9, 0, 5,  9, 3, 0,  9, 5, 3,
              // Tip 10 (-c,c,c) -> 1, 4, 2
              10, 1, 2, 10, 2, 4, 10, 4, 1,
              // Tip 11 (-c,c,-c) -> 1, 2, 5
              11, 1, 5, 11, 5, 2, 11, 2, 1,
              // Tip 12 (-c,-c,c) -> 1, 3, 4
              12, 1, 4, 12, 4, 3, 12, 3, 1,
              // Tip 13 (-c,-c,-c) -> 1, 5, 3
              13, 1, 3, 13, 3, 5, 13, 5, 1
            ],
            1, 0
          ]}
        />
        <meshStandardMaterial 
          color="#1e293b" 
          transparent 
          opacity={0.4} 
          side={THREE.DoubleSide} 
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
};
