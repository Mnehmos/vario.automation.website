import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  z: number; // depth (0-1, 0=background, 1=foreground)
  size: number;
}

export default function OrbitAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [energy, setEnergy] = useState(0); // 0-100
  
  // Refs for animation loop values to avoid re-renders
  const particlesRef = useRef<Particle[]>([]);
  const energyRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const BASE_PARTICLE_COUNT = 40;
  const MAX_PARTICLE_COUNT = 120;
  const CONNECTION_DISTANCE = 15; // % distance

  // Initialize particles once
  useEffect(() => {
    const initialParticles: Particle[] = new Array(BASE_PARTICLE_COUNT).fill(0).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      z: Math.random(),
      size: 1 + Math.random() * 3,
    }));
    particlesRef.current = initialParticles;
    setParticles(initialParticles);
  }, []);

  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Update mouse ref directly
      const { innerWidth, innerHeight } = window;
      mouseRef.current = { 
        x: (e.clientX / innerWidth) * 100, 
        y: (e.clientY / innerHeight) * 100 
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animation Loop
  const animate = (time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    lastTimeRef.current = time;

    // 1. Calculate Energy
    const dx = mouseRef.current.x - lastMouseRef.current.x;
    const dy = mouseRef.current.y - lastMouseRef.current.y;
    const movement = Math.sqrt(dx * dx + dy * dy);
    
    // Add energy from movement, decay over time
    let newEnergy = energyRef.current + movement * 2;
    newEnergy *= 0.98; // Decay
    newEnergy = Math.max(0, Math.min(100, newEnergy));
    energyRef.current = newEnergy;

    lastMouseRef.current = mouseRef.current;

    // 2. Manage Particles
    const targetCount = Math.floor(BASE_PARTICLE_COUNT + (newEnergy / 100) * (MAX_PARTICLE_COUNT - BASE_PARTICLE_COUNT));
    let currentParticles = [...particlesRef.current];

    // Spawn/Despawn logic (simplified for RAF)
    if (currentParticles.length < targetCount && Math.random() > 0.8) {
       currentParticles.push({
          id: Date.now() + Math.random(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          z: Math.random(),
          size: 1 + Math.random() * 3,
       });
    } else if (currentParticles.length > targetCount && Math.random() > 0.8) {
       currentParticles.shift();
    }

    // 3. Update Physics
    const speedMultiplier = 0.25 + (newEnergy / 100) * 0.75; // Reduced by 75% total
    
    currentParticles = currentParticles.map(p => {
      let { x, y, vx, vy, z } = p;

      // Gravity/Parallax effect towards mouse
      const pullX = (mouseRef.current.x - x) * 0.0001 * z; // Further reduced pull
      const pullY = (mouseRef.current.y - y) * 0.0001 * z;

      vx += pullX;
      vy += pullY;

      // Update position
      x += vx * speedMultiplier;
      y += vy * speedMultiplier;

      // Bounds bounce
      if (x < 0 || x > 100) vx *= -1;
      if (y < 0 || y > 100) vy *= -1;
      x = Math.max(0, Math.min(100, x));
      y = Math.max(0, Math.min(100, y));

      // Z-cycle
      z += 0.002;
      if (z > 1) z = 0;

      return { ...p, x, y, vx, vy, z };
    });

    particlesRef.current = currentParticles;

    // Sync state for React render (throttled slightly if needed, but 60fps is fine for this count)
    setParticles(currentParticles);
    setEnergy(newEnergy);

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Simplified Color Palette: Copper -> Orange -> Amber
  const getParticleColor = (z: number, energyLvl: number) => {
    // Base opacity via Z
    const opacity = 0.2 + z * 0.6;
    
    if (energyLvl > 80) return `rgba(251, 191, 36, ${opacity})`; // Amber-400
    if (energyLvl > 40) return `rgba(245, 158, 11, ${opacity})`; // Amber-500
    return `rgba(184, 115, 51, ${opacity})`; // Copper
  };

  // Connection Lines
  const renderConnections = () => {
    const lines: React.ReactElement[] = [];
    const threshold = CONNECTION_DISTANCE;
    
    // Optimization: only check subset if too many particles
    const checkLimit = Math.min(particles.length, 60);

    for (let i = 0; i < checkLimit; i++) {
        for (let j = i + 1; j < checkLimit; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

            if (dist < threshold) {
                const opacity = (1 - dist / threshold) * 0.2 * Math.min(p1.z, p2.z) * (1 + energy/100);
                lines.push(
                    <line
                        key={`${p1.id}-${p2.id}`}
                        x1={`${p1.x}%`} 
                        y1={`${p1.y}%`}
                        x2={`${p2.x}%`}
                        y2={`${p2.y}%`}
                        stroke="#B87333"
                        strokeWidth={0.5}
                        strokeOpacity={opacity}
                    />
                );
            }
        }
    }
    return lines;
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Dynamic Background Gradient */}
      <div 
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(184, 115, 51, ${0.02 + energy / 2000}) 0%, transparent 70%)`,
        }}
      />
      
      {/* Connections Layer */}
      <svg className="absolute inset-0 w-full h-full">
        {renderConnections()}
      </svg>

      {/* Particles Layer */}
      {particles.map(p => (
         <motion.div
            key={p.id}
            className="absolute rounded-full bg-current"
            style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: getParticleColor(p.z, energy),
                boxShadow: energy > 50 ? `0 0 ${p.size * 2}px rgba(184, 115, 51, 0.4)` : 'none',
            }}
         />
      ))}
    </div>
  );
}
