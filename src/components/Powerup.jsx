import React from 'react';
import { POWERUP_SIZE, POWERUP_TYPES } from '../constants/gameConstants';

function Powerup({ powerup }) {
  const { x, y, type, lifetime } = powerup;
  const config = POWERUP_TYPES[type];

  if (!config) return null;

  // Floating animation
  const floatOffset = Math.sin(lifetime * 0.1) * 5;
  const pulseScale = 1 + Math.sin(lifetime * 0.15) * 0.1;

  // Fade out when near expiration
  const opacity = lifetime < 120 ? lifetime / 120 : 1;

  // Color based on type
  const mainColor = config.color;
  const glowColor = config.color;

  return (
    <g transform={`translate(${x}, ${y + floatOffset})`} opacity={opacity}>
      {/* Outer glow */}
      <circle
        cx={0}
        cy={0}
        r={POWERUP_SIZE + 8}
        fill={glowColor}
        opacity={0.3 * pulseScale}
      />

      {/* Secondary glow pulse */}
      <circle
        cx={0}
        cy={0}
        r={POWERUP_SIZE + 4}
        fill={glowColor}
        opacity={0.5}
      >
        <animate
          attributeName="r"
          values={`${POWERUP_SIZE + 4};${POWERUP_SIZE + 8};${POWERUP_SIZE + 4}`}
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.5;0.2;0.5"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Main powerup orb */}
      <circle
        cx={0}
        cy={0}
        r={POWERUP_SIZE / 2}
        fill={mainColor}
        stroke={glowColor}
        strokeWidth="2"
        transform={`scale(${pulseScale})`}
      />

      {/* Inner highlight */}
      <circle
        cx={-POWERUP_SIZE / 6}
        cy={-POWERUP_SIZE / 6}
        r={POWERUP_SIZE / 4}
        fill="white"
        opacity="0.4"
        transform={`scale(${pulseScale})`}
      />

      {/* Icon based on type */}
      <g transform={`scale(${pulseScale})`}>
        {type === 'HEALTH' && (
          <g>
            {/* Health cross */}
            <rect x={-2} y={-8} width={4} height={16} fill="white" />
            <rect x={-8} y={-2} width={16} height={4} fill="white" />
          </g>
        )}

        {type === 'MAGIC' && (
          <g>
            {/* Magic star */}
            <path
              d="M 0,-8 L 2,-3 L 8,-2 L 3,1 L 4,8 L 0,4 L -4,8 L -3,1 L -8,-2 L -2,-3 Z"
              fill="white"
            />
          </g>
        )}

        {type === 'SPEED' && (
          <g>
            {/* Speed arrows */}
            <path d="M -8,0 L -2,-5 L -2,5 Z" fill="white" />
            <path d="M -2,0 L 4,-5 L 4,5 Z" fill="white" />
          </g>
        )}

        {type === 'JUMP' && (
          <g>
            {/* Jump up arrow */}
            <path d="M 0,-8 L 5,0 L 2,0 L 2,6 L -2,6 L -2,0 L -5,0 Z" fill="white" />
          </g>
        )}
      </g>

      {/* Sparkle particles */}
      {[0, 1, 2, 3].map((i) => (
        <circle
          key={i}
          cx={Math.cos((lifetime * 0.05 + i * Math.PI / 2)) * (POWERUP_SIZE + 10)}
          cy={Math.sin((lifetime * 0.05 + i * Math.PI / 2)) * (POWERUP_SIZE + 10)}
          r={2}
          fill="white"
          opacity={0.6}
        />
      ))}
    </g>
  );
}

export default React.memo(Powerup);
