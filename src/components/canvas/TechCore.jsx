import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, Torus } from '@react-three/drei';
import * as THREE from 'three';

const TechCore = () => {
    const groupRef = useRef();
    const coreRef = useRef();
    const ring1Ref = useRef();
    const ring2Ref = useRef();
    const ring3Ref = useRef();

    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime();
        const { x, y } = state.mouse;

        // Main group reaction to mouse
        if (groupRef.current) {
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, x * 0.2, 0.1);
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -y * 0.2, 0.1);
        }

        if (coreRef.current) {
            coreRef.current.rotation.x = time * 0.2;
            coreRef.current.rotation.y = time * 0.3;
        }

        if (ring1Ref.current) {
            ring1Ref.current.rotation.z = time * 0.5;
            ring1Ref.current.rotation.x = Math.sin(time * 0.5) * 0.2;
        }

        if (ring2Ref.current) {
            ring2Ref.current.rotation.z = -time * 0.3;
            ring2Ref.current.rotation.y = Math.cos(time * 0.5) * 0.2;
        }

        if (ring3Ref.current) {
            ring3Ref.current.rotation.x = time * 0.4;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Inner Crystalline Core */}
            <mesh ref={coreRef}>
                <octahedronGeometry args={[2.2, 0]} />
                <MeshTransmissionMaterial
                    backside
                    backsideThickness={5}
                    thickness={2}
                    samples={10}
                    transmission={1}
                    clearcoat={1}
                    clearcoatRoughness={0}
                    ior={1.5}
                    chromaticAberration={0.06}
                    anisotropy={0.1}
                    distortion={0.1}
                    distortionScale={0.3}
                    temporalDistortion={0.5}
                    color="#ffffff"
                />
            </mesh>

            {/* Glowing Center */}
            <mesh>
                <sphereGeometry args={[0.6, 32, 32]} />
                <meshBasicMaterial color="#ff0000" toneMapped={false} />
                <pointLight intensity={2} color="#ff0000" />
            </mesh>

            {/* Outer Tech Rings */}
            <group ref={ring1Ref}>
                <Torus args={[3.5, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshBasicMaterial color="#333" transparent opacity={0.5} />
                </Torus>
                {/* Orbital particles on ring */}
                {[...Array(8)].map((_, i) => (
                    <mesh key={i} position={[Math.cos((i / 8) * Math.PI * 2) * 3.5, 0, Math.sin((i / 8) * Math.PI * 2) * 3.5]}>
                        <sphereGeometry args={[0.06, 16, 16]} />
                        <meshBasicMaterial color="#ff0000" />
                    </mesh>
                ))}
            </group>

            <group ref={ring2Ref} rotation={[Math.PI / 4, 0, 0]}>
                <Torus args={[4.2, 0.01, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshBasicMaterial color="#444" transparent opacity={0.3} />
                </Torus>
            </group>

            <Float speed={4} rotationIntensity={1} floatIntensity={2}>
                <group ref={ring3Ref} rotation={[-Math.PI / 4, 0, 0]}>
                    <Torus args={[2.8, 0.01, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
                        <meshBasicMaterial color="#ff0000" transparent opacity={0.2} />
                    </Torus>
                </group>
            </Float>

            {/* Background Particles/Dust */}
            <Particles count={60} />
        </group>
    );
};

const Particles = ({ count }) => {
    const mesh = useRef();
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            temp.push({
                t: Math.random() * 100,
                factor: 20 + Math.random() * 100,
                speed: 0.01 + Math.random() / 200,
                xFactor: -5 + Math.random() * 10,
                yFactor: -5 + Math.random() * 10,
                zFactor: -5 + Math.random() * 10
            });
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        const { x, y } = state.mouse;
        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);
            dummy.position.set(
                (xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10) + (x * 2),
                (yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10) + (y * 2),
                (zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10)
            );
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
        </instancedMesh>
    );
};

export default TechCore;
