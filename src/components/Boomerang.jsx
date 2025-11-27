import React from 'react';
import { BOOMERANG_SIZE } from '../constants/gameConstants';

function Boomerang({ boomerang }) {
  const { x, y, active, isCharging, chargeLevel, rotation, returning } = boomerang;
  
  if (!active && !isCharging) return null;
  
  // Calculate visual properties
  const size = BOOMERANG_SIZE + (isCharging ? chargeLevel * 5 : 0);
  const glowIntensity = isCharging ? 0.3 + chargeLevel * 0.4 : (returning ? 0.3 : 0.2);
  const mainColor = isCharging ? '#ffdd44' : '#c4a35a';
  const glowColor = isCharging ? '#ffff88' : '#ffcc55';
  
  // Trail particles when active
  const trailParticles = active ? Array.from({ length: 5 }, (_, i) => ({
    offset: i * 8,
    opacity: 0.5 - i * 0.1,
    size: 3 - i * 0.5
  })) : [];
  
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Trail effect when flying */}
      {active && trailParticles.map((particle, i) => (
        <circle
          key={i}
          cx={returning ? particle.offset : -particle.offset}
          cy={0}
          r={particle.size}
          fill={glowColor}
          opacity={particle.opacity}
        />
      ))}
      
      {/* Outer glow */}
      <ellipse
        cx={0}
        cy={0}
        rx={size + 8}
        ry={size + 8}
        fill={glowColor}
        opacity={glowIntensity}
      />
      
      {/* Main boomerang shape */}
      <g transform={`rotate(${rotation})`}>
        {/* Boomerang body - V shape */}
        <path
          d={`
            M ${-size/2} ${-size/3}
            Q ${0} ${-size/2}
            ${size/2} ${-size/3}
            L ${size/3} ${0}
            Q ${0} ${-size/4}
            ${-size/3} ${0}
            Z
          `}
          fill={mainColor}
          stroke="#8b6914"
          strokeWidth="2"
        />
        
        {/* Decorative trim */}
        <path
          d={`
            M ${-size/3} ${-size/4}
            Q ${0} ${-size/3}
            ${size/3} ${-size/4}
          `}
          fill="none"
          stroke="#5c4a1a"
          strokeWidth="2"
        />
        
        {/* Center gem/glow when charged */}
        {isCharging && chargeLevel > 0.5 && (
          <circle
            cx={0}
            cy={-size/4}
            r={4}
            fill="#ffff00"
          >
            <animate
              attributeName="r"
              values="3;5;3"
              dur="0.3s"
              repeatCount="indefinite"
            />
          </circle>
        )}
      </g>
      
      {/* Spinning effect indicator */}
      {active && (
        <circle
          cx={0}
          cy={0}
          r={size * 0.8}
          fill="none"
          stroke={glowColor}
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.4"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0"
            to="360"
            dur="0.2s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </g>
  );
}

export default React.memo(Boomerang);
