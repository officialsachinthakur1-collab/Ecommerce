import { EffectComposer, Bloom, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

const SceneEffects = () => {
    return (
        <EffectComposer disableNormalPass>
            <Bloom
                luminanceThreshold={0.5}
                luminanceSmoothing={0.9}
                intensity={1.5}
                levels={9}
                mipmapBlur
            />
            <Noise opacity={0.05} blendFunction={BlendFunction.OVERLAY} />
            <ChromaticAberration
                offset={[0.002, 0.002]} // Slight shift for "glitch/tech" feel
            />
        </EffectComposer>
    );
};

export default SceneEffects;
