import React, { useEffect, useRef } from "react";
import { useLoader, useFrame, useThree } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

const MeshModel = ({ modelPath, scale = 40, position = [0, 0, 0] }: any) => {
  const ref = useRef<any>(null);
  const gltf: any = useLoader(STLLoader, modelPath);
  const { camera } = useThree();

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useEffect(() => {
    camera.lookAt(ref.current.position);
  });
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += 0.003;
      ref.current.rotation.x += 0.001;
    }
  });
  
  return (
    <>
      <mesh ref={ref}>
        <primitive
          object={gltf}
          position={position}
          attach="geometry"
          scale={scale}
        />
        <meshStandardMaterial color={"orange"}/>
      </mesh>
    </>
  );
};

export default MeshModel;