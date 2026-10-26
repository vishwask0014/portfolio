"use client";

import React, { Suspense, useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { SpotLight, Environment } from "@react-three/drei";
import {
  SpotLightHelper,
  SRGBColorSpace,
  PCFShadowMap,
  CanvasTexture,
  RepeatWrapping,
  TextureLoader,
} from "three";
import * as THREE from "three";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";
import css from "./HeroSection.module.css";

const MODEL_PATH = "/modal/Lucy100k.ply";
const TEXTURE_PATH = "/modal/textures/disturb.jpg";
const TARGET_SIZE = 2.8;

function ensureUVs(geometry) {
  if (geometry.attributes.uv) return geometry;

  geometry.computeBoundingBox();
  const { min, max } = geometry.boundingBox;
  const size = new THREE.Vector3().subVectors(max, min);
  const pos = geometry.attributes.position;
  const uvs = new Float32Array(pos.count * 2);

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    uvs[i * 2] = size.x ? (x - min.x) / size.x : 0;
    uvs[i * 2 + 1] = size.y ? (y - min.y) / size.y : 0;
  }

  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  return geometry;
}

function HeroMesh() {
  const geometry = useLoader(PLYLoader, MODEL_PATH);
  const texture = useLoader(TextureLoader, TEXTURE_PATH);

  const prepared = useMemo(() => {
    const geo = ensureUVs(geometry.clone());
    geo.scale(0.0024, 0.0024, 0.0024);
    geo.computeVertexNormals();
    geo.center();

    const box = new THREE.Box3().setFromBufferAttribute(geo.attributes.position);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = TARGET_SIZE / maxDim;

    return { geometry: geo, scale };
  }, [geometry]);

  useMemo(() => {
    texture.colorSpace = SRGBColorSpace;
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);

  return (
        <group
          // Stand upright, flipped front, tilted up + toward the right
          rotation={[-Math.PI / 2 + 0.28, -0.55, 0]}
          position={[0, 0.02, 0]}
        >
      <mesh
        geometry={prepared.geometry}
        scale={prepared.scale}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          map={texture}
          roughness={0.55}
          metalness={0.08}
        />
      </mesh>
    </group>
  );
}

function SpotLightSystem() {
  const spotLightRef = useRef();
  const [helper, setHelper] = useState(null);
  const cookieTexture = useLoader(TextureLoader, TEXTURE_PATH);

  useMemo(() => {
    cookieTexture.colorSpace = SRGBColorSpace;
    cookieTexture.needsUpdate = true;
  }, [cookieTexture]);

  useFrame((state) => {
    if (!spotLightRef.current) return;
    const t = state.clock.elapsedTime * 0.5;
    
    spotLightRef.current.position.x = Math.cos(t) * 3;
    spotLightRef.current.position.z = Math.sin(t) * 3;
    spotLightRef.current.position.y = 4;
    
    spotLightRef.current.target.position.set(0, 0, 0);
    
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
    
    const texture = new CanvasTexture(canvas);
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

export default function HeroModel() {
  return (
    <div className={css.canvasWrap}>
      <Canvas
        camera={{ position: [0, 2, 5], fov: 50 }}
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
        <Floor />
        <Suspense fallback={null}>
          <SpotLightSystem />
          <HeroMesh />
        </Suspense>
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}