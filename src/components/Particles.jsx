import React from 'react';

function Particles({ particles }) {
  return (
    <g>
      {particles.map(particle => (
        <Particle key={particle.id} particle={particle} />
      ))}
    </g>
  );
}

function Particle({ particle }) {
  const { x, y, size, color, opacity, type, rotation } = particle;
  
  switch (type) {
    case 'hit':
      return (
        <circle
          cx={x}
          cy={y}
          r={size}
          fill={color}
          opacity={opacity}
        />
      );
    
    case 'death':
      return (
        <g transform={`translate(${x}, ${y}) rotate(${rotation || 0})`}>
          <rect
            x={-size/2}
            y={-size/2}
            width={size}
            height={size}
            fill={color}
            opacity={opacity}
          />
        </g>
      );
    
    case 'score':
      return (
        <text
          x={x}
          y={y}
          fill={color}
          fontSize={size}
          fontFamily="Georgia"
          fontWeight="bold"
          textAnchor="middle"
          opacity={opacity}
        >
          {particle.text}
        </text>
      );
    
    case 'ambient':
      return (
        <circle
          cx={x}
          cy={y}
          r={size}
          fill={color}
          opacity={opacity * 0.5}
        />
      );
    
    case 'ember':
      return (
        <ellipse
          cx={x}
          cy={y}
          rx={size}
          ry={size * 1.5}
          fill={color}
          opacity={opacity}
        />
      );
    
    case 'snow':
      return (
        <circle
          cx={x}
          cy={y}
          r={size}
          fill="#ffffff"
          opacity={opacity}
        />
      );
    
    case 'leaf':
      return (
        <ellipse
          cx={x}
          cy={y}
          rx={size}
          ry={size * 0.5}
          fill={color}
          opacity={opacity}
          transform={`rotate(${rotation || 0}, ${x}, ${y})`}
        />
      );
    
    case 'mist':
      return (
        <ellipse
          cx={x}
          cy={y}
          rx={size * 2}
          ry={size}
          fill={color}
          opacity={opacity * 0.3}
        />
      );
    
    case 'spark':
      return (
        <g transform={`translate(${x}, ${y})`}>
          <line x1={-size} y1={0} x2={size} y2={0} stroke={color} strokeWidth="2" opacity={opacity} />
          <line x1={0} y1={-size} x2={0} y2={size} stroke={color} strokeWidth="2" opacity={opacity} />
        </g>
      );
    
    case 'trail':
      return (
        <circle
          cx={x}
          cy={y}
          r={size}
          fill={color}
          opacity={opacity}
        />
      );

    case 'dust':
      return (
        <ellipse
          cx={x}
          cy={y}
          rx={size}
          ry={size * 0.6}
          fill={color}
          opacity={opacity}
        />
      );

    default:
      return (
        <circle
          cx={x}
          cy={y}
          r={size}
          fill={color}
          opacity={opacity}
        />
      );
  }
}

export function createHitParticles(x, y, color, count = 8) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const speed = 2 + Math.random() * 4;
    particles.push({
      id: Date.now() + Math.random(),
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 3 + Math.random() * 4,
      color,
      opacity: 1,
      type: 'hit',
      life: 30
    });
  }
  return particles;
}

export function createDeathParticles(x, y, color, count = 15) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 6;
    particles.push({
      id: Date.now() + Math.random(),
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      size: 5 + Math.random() * 8,
      color,
      opacity: 1,
      type: 'death',
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 20,
      life: 45
    });
  }
  return particles;
}

export function createScoreParticle(x, y, score, combo = 1) {
  const color = combo > 3 ? '#ffff00' : combo > 1 ? '#ffaa00' : '#ffffff';
  return {
    id: Date.now() + Math.random(),
    x,
    y,
    vx: 0,
    vy: -2,
    size: 14 + Math.min(combo * 2, 10),
    color,
    opacity: 1,
    type: 'score',
    text: `+${score}`,
    life: 60
  };
}

export function createFootstepParticles(x, y, facingRight) {
  const particles = [];
  const count = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < count; i++) {
    const angle = Math.PI * 0.5 + (Math.random() - 0.5) * 0.8;
    const speed = 0.5 + Math.random() * 1.5;
    particles.push({
      id: Date.now() + Math.random(),
      x: x + (facingRight ? -5 : 5),
      y: y,
      vx: Math.cos(angle) * speed * (facingRight ? -1 : 1) * 0.5,
      vy: -Math.sin(angle) * speed,
      size: 2 + Math.random() * 3,
      color: '#8a7a6a',
      opacity: 0.6,
      type: 'dust',
      life: 20
    });
  }
  return particles;
}

export function createJumpParticles(x, y, facingRight) {
  const particles = [];
  const count = 6 + Math.floor(Math.random() * 4);
  for (let i = 0; i < count; i++) {
    const angle = Math.PI * 0.3 + Math.random() * Math.PI * 0.4;
    const speed = 2 + Math.random() * 3;
    particles.push({
      id: Date.now() + Math.random(),
      x,
      y,
      vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
      vy: Math.abs(Math.sin(angle)) * speed,
      size: 3 + Math.random() * 4,
      color: '#9a8a7a',
      opacity: 0.8,
      type: 'dust',
      life: 25
    });
  }
  return particles;
}

export function createLandingParticles(x, y, intensity = 1) {
  const particles = [];
  const count = Math.floor(8 + intensity * 6);
  for (let i = 0; i < count; i++) {
    const angle = Math.PI * 0.2 + Math.random() * Math.PI * 0.6;
    const speed = 2 + Math.random() * 4 * intensity;
    const direction = i < count / 2 ? -1 : 1;
    particles.push({
      id: Date.now() + Math.random(),
      x,
      y,
      vx: Math.cos(angle) * speed * direction,
      vy: -Math.abs(Math.sin(angle)) * speed * 0.5,
      size: 3 + Math.random() * 5,
      color: '#aa9a8a',
      opacity: 0.9,
      type: 'dust',
      life: 30
    });
  }
  return particles;
}

export function createDashBurstParticles(x, y, facingRight) {
  const particles = [];
  const count = 12;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const speed = 3 + Math.random() * 5;
    particles.push({
      id: Date.now() + Math.random(),
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 4 + Math.random() * 6,
      color: '#9a7aff',
      opacity: 1,
      type: 'spark',
      life: 20
    });
  }
  return particles;
}

export function createDashTrailParticle(x, y) {
  return {
    id: Date.now() + Math.random(),
    x: x + (Math.random() - 0.5) * 20,
    y: y + (Math.random() - 0.5) * 30,
    vx: 0,
    vy: 0,
    size: 3 + Math.random() * 4,
    color: '#7a5aff',
    opacity: 0.7,
    type: 'trail',
    life: 15
  };
}

export function createBoomerangTrailParticle(x, y, color = '#ffaa00') {
  return {
    id: Date.now() + Math.random(),
    x: x + (Math.random() - 0.5) * 8,
    y: y + (Math.random() - 0.5) * 8,
    vx: 0,
    vy: 0,
    size: 2 + Math.random() * 3,
    color,
    opacity: 0.8,
    type: 'trail',
    life: 12
  };
}

export function createAmbientParticles(zoneIndex, cameraX, count = 3) {
  const particles = [];
  
  for (let i = 0; i < count; i++) {
    const particle = {
      id: Date.now() + Math.random(),
      x: cameraX + Math.random() * 1200,
      y: Math.random() * 600,
      size: 2 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.4,
      life: 120 + Math.random() * 60
    };
    
    switch (zoneIndex) {
      case 0: // Woods - floating leaves
        particle.type = 'leaf';
        particle.color = '#6a8a5a';
        particle.vx = 0.5 + Math.random() * 1;
        particle.vy = 0.2 + Math.random() * 0.5;
        particle.rotation = Math.random() * 360;
        particle.rotationSpeed = (Math.random() - 0.5) * 5;
        break;
      
      case 1: // Crypts - snow
        particle.type = 'snow';
        particle.color = '#ffffff';
        particle.vx = (Math.random() - 0.5) * 0.5;
        particle.vy = 1 + Math.random() * 1.5;
        break;
      
      case 2: // Infernal - embers
        particle.type = 'ember';
        particle.color = Math.random() > 0.5 ? '#ff6600' : '#ff4400';
        particle.vx = (Math.random() - 0.5) * 1;
        particle.vy = -1.5 - Math.random() * 2;
        particle.y = 550 + Math.random() * 50;
        break;
      
      case 3: // Castle - mist
        particle.type = 'mist';
        particle.color = '#8a6aaa';
        particle.vx = 0.3 + Math.random() * 0.5;
        particle.vy = (Math.random() - 0.5) * 0.3;
        particle.size = 10 + Math.random() * 20;
        break;
      
      case 4: // Boss - chaos
        particle.type = 'spark';
        particle.color = '#ff3333';
        particle.vx = (Math.random() - 0.5) * 3;
        particle.vy = (Math.random() - 0.5) * 3;
        break;
      
      default:
        particle.type = 'ambient';
        particle.color = '#888888';
        particle.vx = 0;
        particle.vy = 0;
    }
    
    particles.push(particle);
  }
  
  return particles;
}

export function updateParticle(particle) {
  particle.x += particle.vx || 0;
  particle.y += particle.vy || 0;
  particle.life--;
  particle.opacity = Math.max(0, particle.life / 60);
  
  if (particle.rotationSpeed) {
    particle.rotation = (particle.rotation || 0) + particle.rotationSpeed;
  }
  
  // Gravity for death particles
  if (particle.type === 'death') {
    particle.vy += 0.2;
  }
  
  return particle.life > 0;
}

export default React.memo(Particles);
