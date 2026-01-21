import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Image } from '@react-three/drei';
import * as THREE from 'three';

const TechCore = () => {
    const groupRef = useRef();

    // Load textures
    const textures = useTexture([
        '/assets/products/black_tshirt.png',
        '/assets/products/white_hoodie.png',
        '/assets/products/denim_jacket.png'
    ]);

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Rotate the entire carousel
            groupRef.current.rotation.y += delta * 0.5;
        }
    });

    return (
        <group ref={groupRef} rotation={[0, 0, 0.1]}>
            {/* 3 Products arranged in a circle */}
            {textures.map((texture, i) => {
                const angle = (i / 3) * Math.PI * 2;
                const radius = 2.5;
                const x = Math.sin(angle) * radius;
                const z = Math.cos(angle) * radius;

                return (
                    <group key={i} position={[x, 0, z]} rotation={[0, angle, 0]}>
                        {/* Card Background */}
                        <mesh position={[0, 0, -0.1]}>
                            <planeGeometry args={[2.2, 2.8]} />
                            <meshStandardMaterial
                                color="#111"
                                metalness={0.8}
                                roughness={0.2}
                                side={THREE.DoubleSide}
                                transparent
                                opacity={0.8}
                            />
                        </mesh>

                        {/* Product Image */}
                        <Image
                            url={[
                                '/assets/products/black_tshirt.png',
                                '/assets/products/white_hoodie.png',
                                '/assets/products/denim_jacket.png'
                            ][i]}
                            scale={[2, 2]}
                            transparent
                            opacity={1}
                        />

                        {/* Border/Glow */}
                        <mesh position={[0, 0, -0.15]}>
                            <planeGeometry args={[2.3, 2.9]} />
                            <meshBasicMaterial color={i === 0 ? "red" : "#333"} />
                        </mesh>
                    </group>
                );
            })}
        </group>
    );
};

export default TechCore;
