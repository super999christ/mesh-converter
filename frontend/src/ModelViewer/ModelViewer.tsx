import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import MeshModel from "../Components/MeshModel";

const ModelViewer = ({ modelPath, scale = 40, position = [0, 0, 0] }: any) => {
  return (
    <Canvas camera={{ position: [1, 1, 2] }}>
      <ambientLight intensity={0.3} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Suspense fallback={null}>
        <MeshModel modelPath={modelPath} scale={scale} position={position} />
      </Suspense>
    </Canvas>
  );
};

export default ModelViewer;