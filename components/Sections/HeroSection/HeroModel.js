"use client";

import React, { Suspense, useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, primitive } from "@react-three/fiber";
import { useGLTF, SpotLight, Environment, Center } from "@react-three/drei";
import { SpotLightHelper, SRGBColorSpace, PCFShadowMap, CanvasTexture, RepeatWrapping } from "three";
import * as THREE from "three";
import css from "./HeroSection.module.css";

const MODEL_PATH = "/modal/scene.gltf";
const TARGET_SIZE = 2.8;

function HeroMesh() {
  const { scene } = useGLTF(MODEL_PATH);
  const groupRef = useRef(null);

  const prepared = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];
      materials.forEach((mat) => {
        if (!mat) return;
        mat.side = THREE.DoubleSide;
        if ("metalness" in mat) mat.metalness = Math.min(mat.metalness ?? 0.4, 0.45);
        if ("roughness" in mat) mat.roughness = Math.max(mat.roughness ?? 0.5, 0.4);
        mat.needsUpdate = true;
      });
    });

    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;

    return { clone, scale: TARGET_SIZE / maxDim };
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * 0.35) * 0.2;
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.04;
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={prepared.clone} scale={prepared.scale} />
      </Center>
    </group>
  );
}

function SpotLightSystem() {
  const spotLightRef = useRef();
  const [helper, setHelper] = useState(null);

  // Create procedural cookie texture for spotlight pattern (gobo effect)
  const cookieTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Create a noise/disturb pattern similar to the three.js example
    const imageData = ctx.createImageData(512, 512);
    const data = imageData.data;
    
    for (let y = 0; y < 512; y++) {
      for (let x = 0; x < 512; x++) {
        const dx = (x - 256) / 256;
        const dy = (y - 256) / 256;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Create circular gobo pattern with noise
        let value = 0;
        if (dist < 1) {
          // Add some noise/disturbance
          const noise = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 
                       Math.sin(x * 0.05 + y * 0.05) * 0.5 + 0.5;
          value = (1 - dist) * noise * 255;
        }
        
        const i = (y * 512 + x) * 4;
        data[i] = data[i + 1] = data[i + 2] = value;
        data[i + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.colorSpace = SRGBColorSpace;
    
    return texture;
  }, []);

  useFrame((state) => {
    if (!spotLightRef.current) return;
    const t = state.clock.elapsedTime * 0.5;
    
    spotLightRef.current.position.x = Math.cos(t) * 2.5;
    spotLightRef.current.position.z = Math.sin(t) * 2.5;
    spotLightRef.current.position.y = 5;
    
    spotLightRef.current.target.position.set(0, 1, 0);
    
    if (helper) {
      helper.update();
    }
  });

  React.useEffect(() => {
    if (spotLightRef.current) {
      const h = new SpotLightHelper(spotLightRef.current);
      h.visible = false;
      setHelper(h);
    }
  }, [spotLightRef.current]);

  return (
    <>
      <SpotLight
        ref={spotLightRef}
        position={[2.5, 5, 2.5]}
        angle={Math.PI / 6}
        penumbra={1}
        decay={2}
        distance={0}
        intensity={100}
        castShadow
        map={cookieTexture}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={2}
        shadow-camera-far={10}
        shadow-focus={1}
        shadow-bias={-0.003}
        shadow-intensity={1}
      >
        {helper && <primitive object={helper} />}
      </SpotLight>
      <ambientLight intensity={0.25} color="#ffffff" groundColor="#8d8d8d" />
    </>
  );
}

function Floor() {
  const floorRef = useRef();

  // Create solid sand texture procedurally
  const sandTexture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Solid sand background
    ctx.fillStyle = '#d4c4a8';
    ctx.fillRect(0, 0, size, size);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(1, 1);
    texture.colorSpace = SRGBColorSpace;
    
    return texture;
  }, []);

  return (
    <group ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <mesh receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshLambertMaterial map={sandTexture} />
      </mesh>
    </group>
  );
}

useGLTF.preload(MODEL_PATH);

export default function HeroModel() {
  return (
    <div className={css.canvasWrap}>
      <Canvas
        camera={{ position: [0, 1.2, 4.2], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.75]}
        shadows
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = THREE.NeutralToneMapping;
          gl.toneMappingExposure = 1;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = PCFShadowMap;
        }}
      >
        <SpotLightSystem />
        <Floor />
        <Suspense fallback={null}>
          <HeroMesh />
        </Suspense>
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}