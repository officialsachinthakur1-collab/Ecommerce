import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Icosahedron, MeshDistortMaterial, Wireframe } from '@react-three/drei';

const TechCore = () => {
    const coreRef = useRef();
    const shellRef = useRef();
    const outerRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Core rotation (slow)
        if (coreRef.current) {
            coreRef.current.rotation.y = t * 0.2;
            coreRef.current.rotation.z = t * 0.1;
        }

        // Shell rotation (faster, opposite)
        if (shellRef.current) {
            shellRef.current.rotation.x = t * 0.3;
            shellRef.current.rotation.y = -t * 0.5;
        }

        // Outer ring rotation
        if (outerRef.current) {
            outerRef.current.rotation.z = t * 0.1;
            outerRef.current.rotation.x = Math.sin(t * 0.2) * 0.5;
        }
    });

    return (
        <group scale={1.2}>
            {/* INNER MOLTEN CORE */}
            <Sphere ref={coreRef} args={[1, 32, 32]}>
                <MeshDistortMaterial
                    color="#ff0000"
                    emissive="#550000"
                    emissiveIntensity={2}
                    distort={0.4}
                    speed={3}
                    roughness={0}
                    metalness={1}
                />
            </Sphere>

            {/* TECH SHELL (Wireframe) */}
            <Icosahedron ref={shellRef} args={[1.5, 1]}>
                <meshStandardMaterial
                    color="#333"
                    wireframe
                    transparent
                    opacity={0.3}
                    roughness={0.2}
                    metalness={1}
                />
            </Icosahedron>

            {/* OUTER ORBITAL RINGS */}
            <group ref={outerRef}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[2.2, 0.02, 16, 100]} />
                    <meshBasicMaterial color="#ff3333" transparent opacity={0.5} />
                </mesh>
            </group>
        </group>
    );
};

export default TechCore;
