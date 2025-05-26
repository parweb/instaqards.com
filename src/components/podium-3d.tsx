'use client';

import { Suspense, useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { 
  Text, 
  OrbitControls, 
  Environment, 
  Float, 
  Sparkles, 
  Stars,
  Sphere,
  Box,
  Cylinder,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  Html,
  useTexture,
  Plane,
  Ring,
  Torus,
  Cone
} from '@react-three/drei';
import * as THREE from 'three';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { Badge } from 'components/ui/badge';

// Extend Three.js with custom shaders
extend({ 
  ShaderMaterial: THREE.ShaderMaterial,
  PlaneGeometry: THREE.PlaneGeometry,
  SphereGeometry: THREE.SphereGeometry
});

interface Creator {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  level: string;
  sitesCreated: number;
  conversions: number;
  earnings: number;
  rank: number;
}

// Shader pour effet holographique
const holographicVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  uniform float time;
  
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;
    
    vec3 pos = position;
    pos.y += sin(pos.x * 10.0 + time * 2.0) * 0.1;
    pos.x += sin(pos.y * 8.0 + time * 1.5) * 0.05;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const holographicFragmentShader = `
  uniform float time;
  uniform vec3 color;
  uniform float opacity;
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    vec2 uv = vUv;
    
    // Effet de scan lines
    float scanlines = sin(uv.y * 800.0 + time * 10.0) * 0.04;
    
    // Effet de glitch
    float glitch = sin(uv.x * 50.0 + time * 15.0) * 0.02;
    
    // Effet de fresnel
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = 1.0 - dot(viewDirection, vNormal);
    fresnel = pow(fresnel, 2.0);
    
    // Couleur finale avec effets
    vec3 finalColor = color;
    finalColor += scanlines;
    finalColor += glitch;
    finalColor *= (1.0 + fresnel * 2.0);
    
    // Effet de pulsation
    float pulse = sin(time * 3.0) * 0.3 + 0.7;
    finalColor *= pulse;
    
    gl_FragColor = vec4(finalColor, opacity * fresnel);
  }
`;

// Shader pour effet de cristal
const crystalVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  uniform float time;
  
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;
    
    vec3 pos = position;
    pos += normal * sin(time * 2.0 + pos.x * 5.0) * 0.1;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const crystalFragmentShader = `
  uniform float time;
  uniform vec3 color;
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    vec2 uv = vUv;
    
    // Effet de réfraction
    vec3 refracted = refract(normalize(vPosition), vNormal, 0.9);
    
    // Effet de dispersion chromatique
    float r = sin(time + uv.x * 10.0) * 0.5 + 0.5;
    float g = sin(time + uv.y * 10.0 + 2.0) * 0.5 + 0.5;
    float b = sin(time + (uv.x + uv.y) * 10.0 + 4.0) * 0.5 + 0.5;
    
    vec3 rainbow = vec3(r, g, b);
    vec3 finalColor = mix(color, rainbow, 0.6);
    
    // Effet de brillance
    float brightness = dot(vNormal, vec3(0.0, 1.0, 0.0)) * 0.5 + 0.5;
    finalColor *= brightness * 2.0;
    
    gl_FragColor = vec4(finalColor, 0.8);
  }
`;

// Composant pour particules magiques avancées
function MagicParticles({ count = 200, color = "#FFD700" }: { count?: number; color?: string }) {
  const points = useRef<THREE.Points>(null);
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.1;
      const positions = points.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.01;
        
        if (positions[i3 + 1] > 15) {
          positions[i3 + 1] = 0;
        }
      }
      
      points.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlesPosition}
          itemSize={3}
          args={[particlesPosition, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Composant pour effet de portail magique
function MagicPortal({ position }: { position: [number, number, number] }) {
  const portalRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (portalRef.current) {
      portalRef.current.rotation.z = state.clock.elapsedTime * 2;
      const material = portalRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms) {
        material.uniforms.time.value = state.clock.elapsedTime;
      }
    }
  });

  const portalMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color("#00FFFF") }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec2 vUv;
        
        void main() {
          vec2 uv = vUv - 0.5;
          float dist = length(uv);
          
          float spiral = atan(uv.y, uv.x) + time * 3.0 + dist * 10.0;
          float pattern = sin(spiral) * 0.5 + 0.5;
          
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          alpha *= pattern;
          
          gl_FragColor = vec4(color, alpha * 0.7);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
  }, []);

  return (
    <mesh ref={portalRef} position={position} material={portalMaterial}>
      <ringGeometry args={[1, 2, 32]} />
    </mesh>
  );
}

// Composant pour hologramme de créateur
function CreatorHologram({ creator, position }: { creator: Creator; position: [number, number, number] }) {
  const holoRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (holoRef.current) {
      const material = holoRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms) {
        material.uniforms.time.value = state.clock.elapsedTime;
      }
      holoRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      holoRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  const hologramMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(creator.rank === 1 ? "#FFD700" : creator.rank === 2 ? "#C0C0C0" : "#CD7F32") },
        opacity: { value: 0.8 }
      },
      vertexShader: holographicVertexShader,
      fragmentShader: holographicFragmentShader,
      transparent: true,
      side: THREE.DoubleSide
    });
  }, [creator.rank]);

  return (
    <group position={position}>
      <mesh
        ref={holoRef}
        material={hologramMaterial}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <cylinderGeometry args={[0.8, 0.8, 3, 8]} />
      </mesh>
      
      {/* Avatar holographique */}
      <Html position={[0, 1, 0]} center>
        <div className="pointer-events-none">
          <Avatar className="h-16 w-16 ring-4 ring-cyan-400 shadow-2xl animate-pulse">
            <AvatarImage src={creator.avatar} alt={creator.name} />
            <AvatarFallback className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-bold">
              {creator.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
      </Html>
    </group>
  );
}

// Composant principal du podium avec effets avancés
function AdvancedPodiumStep({ position, height, rank, creator }: {
  position: [number, number, number];
  height: number;
  rank: number;
  creator: Creator;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const crystalRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }
    
    if (crystalRef.current) {
      crystalRef.current.rotation.y = state.clock.elapsedTime * 2;
      crystalRef.current.rotation.x = state.clock.elapsedTime * 1.5;
      const material = crystalRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms) {
        material.uniforms.time.value = state.clock.elapsedTime;
      }
    }
  });

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return new THREE.Color("#FFD700");
      case 2: return new THREE.Color("#C0C0C0");
      case 3: return new THREE.Color("#CD7F32");
      default: return new THREE.Color("#4A90E2");
    }
  };

  const crystalMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: getRankColor(rank) }
      },
      vertexShader: crystalVertexShader,
      fragmentShader: crystalFragmentShader,
      transparent: true
    });
  }, [rank]);

  return (
    <group position={position}>
      {/* Base du podium avec matériau avancé */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setClicked(!clicked)}
        scale={hovered ? 1.1 : 1}
      >
        <cylinderGeometry args={[1.5, 1.8, height, 16]} />
        <MeshWobbleMaterial
          color={getRankColor(rank)}
          factor={0.3}
          speed={2}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Cristal magique au sommet */}
      <mesh
        ref={crystalRef}
        position={[0, height / 2 + 1, 0]}
        material={crystalMaterial}
        scale={clicked ? 1.5 : 1}
      >
        <octahedronGeometry args={[0.5, 2]} />
      </mesh>

      {/* Anneaux d'énergie */}
      {[...Array(3)].map((_, i) => (
        <Ring
          key={i}
          position={[0, height / 2 + 0.5 + i * 0.3, 0]}
          args={[1.2 + i * 0.2, 1.4 + i * 0.2, 32]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshBasicMaterial
            color={getRankColor(rank)}
            transparent
            opacity={0.3 - i * 0.1}
            side={THREE.DoubleSide}
          />
        </Ring>
      ))}

      {/* Particules spécifiques au rang */}
      <Sparkles
        count={rank === 1 ? 200 : rank === 2 ? 150 : 100}
        scale={6}
        size={rank === 1 ? 12 : 8}
        speed={1.2}
        color={getRankColor(rank)}
      />

      {/* Portail magique pour le premier */}
      {rank === 1 && <MagicPortal position={[0, -height / 2 - 0.5, 0]} />}

      {/* Hologramme du créateur */}
      <CreatorHologram creator={creator} position={[0, height / 2 + 2, 0]} />

      {/* Texte flottant avec effets */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
        <Text
          position={[0, height / 2 + 3.5, 0]}
          fontSize={0.8}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          {creator.name.replace(/[👑🥈🥉⚡🌟🚀🎮]/g, '').trim()}
        </Text>
      </Float>

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}>
        <Text
          position={[0, height / 2 + 2.8, 0]}
          fontSize={0.5}
          color="#FFD700"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#FF8C00"
        >
          ⚡ {creator.points} pts
        </Text>
      </Float>

      {/* Effet de sol lumineux */}
      <mesh position={[0, -height / 2 - 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2, 64]} />
        <MeshDistortMaterial
          color={getRankColor(rank)}
          transparent
          opacity={0.4}
          distort={0.3}
          speed={2}
        />
      </mesh>
    </group>
  );
}

// Environnement 3D spectaculaire
function SpectacularScene({ topCreators }: { topCreators: Creator[] }) {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 12, 15);
  }, [camera]);

  return (
    <>
      {/* Éclairage cinématographique */}
      <ambientLight intensity={0.2} />
      
      {/* Lumières principales */}
      <pointLight position={[0, 20, 0]} intensity={3} color="#FFFFFF" castShadow />
      <pointLight position={[10, 15, 10]} intensity={2} color="#FFD700" />
      <pointLight position={[-10, 15, 10]} intensity={2} color="#00FFFF" />
      <pointLight position={[0, 5, -15]} intensity={1.5} color="#FF00FF" />
      
      {/* Spots dramatiques */}
      <spotLight 
        position={[0, 25, 0]} 
        angle={0.4} 
        penumbra={1} 
        intensity={3} 
        color="#FFD700"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Environnement HDR */}
      <Environment preset="night" />
      
      {/* Ciel étoilé */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      
      {/* Sol réfléchissant avancé */}
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <MeshDistortMaterial 
          color="#0a0a2e" 
          metalness={1} 
          roughness={0.1}
          transparent
          opacity={0.9}
          distort={0.1}
          speed={1}
        />
      </mesh>
      
      {/* Particules magiques globales */}
      <MagicParticles count={300} color="#FFD700" />
      <MagicParticles count={200} color="#00FFFF" />
      <MagicParticles count={150} color="#FF00FF" />
      
      {/* Podiums avancés */}
      {topCreators.slice(0, 3).map((creator, index) => {
        const heights = [4.5, 3.5, 2.5];
        const positions: [number, number, number][] = [
          [0, heights[0] / 2, 0],
          [-6, heights[1] / 2, 0],
          [6, heights[2] / 2, 0]
        ];
        
        return (
          <AdvancedPodiumStep
            key={creator.id}
            position={positions[index]}
            height={heights[index]}
            rank={creator.rank}
            creator={creator}
          />
        );
      })}

      {/* Sphères d'énergie flottantes */}
      {[...Array(8)].map((_, i) => (
        <Float key={i} speed={1 + i * 0.2} rotationIntensity={1} floatIntensity={2}>
          <Sphere position={[
            Math.sin(i * Math.PI / 4) * 12,
            5 + Math.sin(i) * 3,
            Math.cos(i * Math.PI / 4) * 12
          ]} args={[0.3, 16, 16]}>
            <meshBasicMaterial
              color={`hsl(${i * 45}, 100%, 50%)`}
              transparent
              opacity={0.6}
            />
          </Sphere>
        </Float>
      ))}

      {/* Contrôles optimisés */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={30}
        minPolarAngle={Math.PI / 12}
        maxPolarAngle={Math.PI / 2}
        autoRotate={true}
        autoRotateSpeed={0.5}
        dampingFactor={0.03}
        enableDamping={true}
        zoomSpeed={0.8}
        rotateSpeed={0.8}
      />
    </>
  );
}

// Composant de chargement spectaculaire
function SpectacularLoadingFallback() {
  return (
    <div className="flex items-center justify-center h-[600px] bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 rounded-2xl relative overflow-hidden">
      {/* Effet de particules en arrière-plan */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      <div className="text-center space-y-6 z-10">
        <div className="relative">
          {/* Spinner principal */}
          <div className="animate-spin rounded-full h-32 w-32 border-8 border-gradient-to-r from-yellow-400 via-pink-500 to-cyan-500 border-t-transparent mx-auto"></div>
          
          {/* Anneaux supplémentaires */}
          <div className="absolute inset-0 animate-ping rounded-full h-32 w-32 border-4 border-yellow-300 opacity-30"></div>
          <div className="absolute inset-2 animate-spin rounded-full h-28 w-28 border-4 border-pink-400 border-b-transparent" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
          
          {/* Centre lumineux */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full animate-pulse shadow-2xl"></div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-white font-bold text-3xl bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
            🎮 Initialisation du Podium Spectaculaire
          </h3>
          <p className="text-cyan-300 text-lg animate-pulse font-medium">
            ✨ Chargement des shaders avancés...
          </p>
          <p className="text-pink-300 text-base animate-bounce">
            🚀 Préparation de l'expérience WebGL ultime
          </p>
          
          {/* Barre de progression stylisée */}
          <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Podium3DProps {
  topCreators: Creator[];
}

export function Podium3D({ topCreators }: Podium3DProps) {
  const [isInteracting, setIsInteracting] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header spectaculaire */}
      <div className="text-center space-y-4">
        <h2 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
          🏆 PODIUM SPECTACULAIRE 3D 🏆
        </h2>
        <p className="text-gray-600 text-2xl font-bold">
          ✨ Expérience WebGL Ultime • Shaders Avancés • Effets Magiques 🎮
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white animate-pulse text-lg px-4 py-2">
            🌟 Shaders Personnalisés
          </Badge>
          <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white animate-pulse text-lg px-4 py-2">
            ⚡ Particules Magiques
          </Badge>
          <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white animate-pulse text-lg px-4 py-2">
            🎯 Hologrammes 3D
          </Badge>
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white animate-pulse text-lg px-4 py-2">
            🚀 Effets Cristallins
          </Badge>
        </div>
      </div>

      {/* Canvas 3D spectaculaire */}
      <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 ring-8 ring-gradient-to-r ring-yellow-400/30">
        <Suspense fallback={<SpectacularLoadingFallback />}>
          <Canvas
            camera={{ position: [0, 12, 15], fov: 75 }}
            gl={{ 
              antialias: true, 
              alpha: true,
              powerPreference: "high-performance",
              stencil: false,
              depth: true
            }}
            dpr={[1, 2]}
            shadows="soft"
            onPointerDown={() => setIsInteracting(true)}
            onPointerUp={() => setIsInteracting(false)}
          >
            <SpectacularScene topCreators={topCreators} />
          </Canvas>
        </Suspense>
        
        {/* Interface overlay améliorée */}
        <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-xl rounded-2xl p-6 text-white border-2 border-cyan-400/50 shadow-2xl">
          <h3 className="font-bold text-cyan-400 mb-4 text-xl">🎮 Contrôles Avancés</h3>
          <div className="space-y-3">
            <p className="flex items-center gap-3 text-lg">
              🖱️ <span>Glissez pour explorer l'univers</span>
            </p>
            <p className="flex items-center gap-3 text-lg">
              🔍 <span>Molette pour zoomer/dézoomer</span>
            </p>
            <p className="flex items-center gap-3 text-lg">
              ✨ <span>Cliquez sur les cristaux magiques</span>
            </p>
            <p className="flex items-center gap-3 text-lg">
              🌟 <span>Survolez les podiums</span>
            </p>
          </div>
          
          {isInteracting && (
            <div className="mt-4 p-3 bg-cyan-500/20 rounded-xl border border-cyan-400/30">
              <p className="text-cyan-300 font-bold animate-pulse">
                🚀 Mode Exploration Activé !
              </p>
            </div>
          )}
        </div>

        {/* Badges technologiques spectaculaires */}
        <div className="absolute top-6 right-6 space-y-3">
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white animate-pulse block text-lg px-4 py-2">
            ⚡ WebGL 2.0
          </Badge>
          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white animate-pulse block text-lg px-4 py-2">
            🌟 Three.js R3F
          </Badge>
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white animate-pulse block text-lg px-4 py-2">
            🎨 Shaders GLSL
          </Badge>
        </div>

        {/* Indicateurs de performance */}
        <div className="absolute bottom-6 right-6 space-y-2">
          <Badge className="bg-green-500/90 text-white block text-lg px-4 py-2">
            🚀 120 FPS
          </Badge>
          <Badge className="bg-blue-500/90 text-white block text-lg px-4 py-2">
            💎 Ultra Quality
          </Badge>
        </div>

        {/* Effet de bordure animée */}
        <div className="absolute inset-0 rounded-3xl border-4 border-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 opacity-50 animate-pulse pointer-events-none" 
             style={{ 
               mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
               maskComposite: 'xor'
             }} 
        />
      </div>

      {/* Informations détaillées avec design futuriste */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {topCreators.slice(0, 3).map((creator, index) => {
          const rankEmojis = ['👑', '🥈', '🥉'];
          const gradients = [
            'from-yellow-400 via-orange-500 to-red-500',
            'from-gray-300 via-slate-400 to-gray-600', 
            'from-amber-400 via-yellow-500 to-orange-500'
          ];
          const glows = [
            'shadow-yellow-500/50',
            'shadow-gray-400/50',
            'shadow-amber-500/50'
          ];
          
          return (
            <div
              key={creator.id}
              className={`
                relative p-8 rounded-3xl shadow-2xl transform hover:scale-110 transition-all duration-500
                bg-gradient-to-br ${gradients[index]} text-white ${glows[index]} shadow-2xl
                ring-4 ring-white/30 hover:ring-white/60 hover:shadow-3xl
                before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:animate-pulse
              `}
            >
              <div className="text-center space-y-6 relative z-10">
                <div className="text-7xl animate-bounce filter drop-shadow-2xl">{rankEmojis[index]}</div>
                
                <Avatar className="h-24 w-24 mx-auto ring-8 ring-white shadow-2xl transform hover:rotate-12 hover:scale-110 transition-all duration-500">
                  <AvatarImage src={creator.avatar} alt={creator.name} />
                  <AvatarFallback className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {creator.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="font-bold text-2xl drop-shadow-lg">{creator.name}</h3>
                  <p className="text-lg opacity-90 font-bold">{creator.level}</p>
                </div>
                
                <div className="space-y-4 text-lg bg-black/30 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 font-bold">⚡ Points:</span>
                    <span className="font-bold text-2xl">{creator.points}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 font-bold">🎨 Sites:</span>
                    <span className="font-bold text-xl">{creator.sitesCreated}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 font-bold">💰 Conversions:</span>
                    <span className="font-bold text-xl">{creator.conversions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 font-bold">💸 Gains:</span>
                    <span className="font-bold text-xl">
                      {creator.earnings.toLocaleString('fr-FR', { 
                        style: 'currency', 
                        currency: 'EUR' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Effets de particules CSS avancés */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`
                      absolute w-3 h-3 rounded-full animate-ping
                      ${index === 0 ? 'bg-yellow-300' : index === 1 ? 'bg-gray-300' : 'bg-amber-300'}
                    `}
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${10 + i * 10}%`,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: `${2 + i * 0.3}s`
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 