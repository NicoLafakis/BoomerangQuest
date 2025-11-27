import React from 'react';
import { PHANTOM_KING } from '../constants/gameConstants';

function PhantomKing({ boss }) {
  if (!boss || !boss.active) return null;
  
  const { x, y, health, phase, attackState, hitFlash, direction } = boss;
  const { width, height, maxHealth } = PHANTOM_KING;
  
  const healthPercent = health / maxHealth;
  const scaleX = direction > 0 ? 1 : -1;
  const flashOpacity = hitFlash > 0 ? 0.8 : 0;
  
  // Phase-based visual intensity
  const auraIntensity = 0.3 + (4 - phase) * 0.15;
  const auraSize = 1 + (4 - phase) * 0.1;
  
  // Floating animation
  const floatY = Math.sin(Date.now() * 0.002) * 10;
  
  return (
    <g transform={`translate(${x + width/2}, ${y + height/2 + floatY})`}>
      {/* Dark aura */}
      <ellipse
        cx={0}
        cy={0}
        rx={width * auraSize}
        ry={height * 0.8 * auraSize}
        fill="#440022"
        opacity={auraIntensity}
      >
        <animate
          attributeName="rx"
          values={`${width * auraSize};${width * auraSize * 1.1};${width * auraSize}`}
          dur="2s"
          repeatCount="indefinite"
        />
      </ellipse>
      
      {/* Secondary aura */}
      <ellipse
        cx={0}
        cy={0}
        rx={width * 0.8}
        ry={height * 0.6}
        fill="#660033"
        opacity={auraIntensity * 0.5}
      />
      
      <g transform={`scale(${scaleX}, 1)`}>
        {/* Robes */}
        <path
          d={`
            M ${-width/3} ${-height/3}
            Q ${-width/2} ${0}
            ${-width/2 + 10} ${height/2}
            L ${width/2 - 10} ${height/2}
            Q ${width/2} ${0}
            ${width/3} ${-height/3}
            Q ${0} ${-height/4}
            ${-width/3} ${-height/3}
          `}
          fill="#4a0020"
          stroke="#2a0010"
          strokeWidth="3"
        />
        
        {/* Robe inner */}
        <path
          d={`
            M ${-width/4} ${-height/4}
            Q ${0} ${0}
            ${-width/4} ${height/3}
            L ${width/4} ${height/3}
            Q ${0} ${0}
            ${width/4} ${-height/4}
          `}
          fill="#2a0010"
          opacity="0.6"
        />
        
        {/* Hood */}
        <ellipse
          cx={0}
          cy={-height/3}
          rx={width/3}
          ry={height/4}
          fill="#3a0015"
          stroke="#2a0010"
          strokeWidth="2"
        />
        
        {/* Face shadow */}
        <ellipse
          cx={0}
          cy={-height/3 + 10}
          rx={width/4}
          ry={height/6}
          fill="#1a0008"
        />
        
        {/* Burning eyes */}
        <ellipse
          cx={-15}
          cy={-height/3}
          rx={8}
          ry={10}
          fill="#ff3300"
        >
          <animate
            attributeName="opacity"
            values="0.8;1;0.8"
            dur="0.5s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse
          cx={15}
          cy={-height/3}
          rx={8}
          ry={10}
          fill="#ff3300"
        >
          <animate
            attributeName="opacity"
            values="0.8;1;0.8"
            dur="0.5s"
            repeatCount="indefinite"
            begin="0.25s"
          />
        </ellipse>
        
        {/* Eye glow */}
        <ellipse cx={-15} cy={-height/3} rx={12} ry={14} fill="#ff6600" opacity="0.3" />
        <ellipse cx={15} cy={-height/3} rx={12} ry={14} fill="#ff6600" opacity="0.3" />
        
        {/* Crown */}
        <g transform={`translate(0, ${-height/2 - 15})`}>
          <path
            d={`
              M -30 10 L -25 -10 L -15 5 L 0 -20 L 15 5 L 25 -10 L 30 10 Z
            `}
            fill="#2a2a2a"
            stroke="#ffaa00"
            strokeWidth="2"
          />
          {/* Crown gems */}
          <circle cx={-15} cy={0} r={4} fill="#ff0000" />
          <circle cx={0} cy={-10} r={5} fill="#ff3300">
            <animate
              attributeName="fill"
              values="#ff3300;#ff6600;#ff3300"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx={15} cy={0} r={4} fill="#ff0000" />
        </g>
        
        {/* Clawed hands */}
        <g transform={`translate(${-width/2 + 5}, ${-height/6})`}>
          <path
            d={`M 0 0 L -10 -15 M 0 0 L -15 -10 M 0 0 L -15 -5 M 0 0 L -12 5`}
            stroke="#5a4a5a"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
        <g transform={`translate(${width/2 - 5}, ${-height/6})`}>
          <path
            d={`M 0 0 L 10 -15 M 0 0 L 15 -10 M 0 0 L 15 -5 M 0 0 L 12 5`}
            stroke="#5a4a5a"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
        
        {/* Attack charging effect */}
        {attackState === 'charging' && (
          <g>
            <circle cx={0} cy={0} r={30} fill="#ff0000" opacity="0.3">
              <animate
                attributeName="r"
                values="20;50;20"
                dur="0.5s"
                repeatCount="indefinite"
              />
            </circle>
            {/* Energy particles */}
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              return (
                <circle
                  key={i}
                  cx={Math.cos(angle) * 40}
                  cy={Math.sin(angle) * 40}
                  r={3}
                  fill="#ff4400"
                >
                  <animate
                    attributeName="cx"
                    values={`${Math.cos(angle) * 60};${Math.cos(angle) * 20}`}
                    dur="0.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="cy"
                    values={`${Math.sin(angle) * 60};${Math.sin(angle) * 20}`}
                    dur="0.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              );
            })}
          </g>
        )}
      </g>
      
      {/* Hit flash overlay */}
      {hitFlash > 0 && (
        <rect
          x={-width/2}
          y={-height/2}
          width={width}
          height={height}
          fill="#ffffff"
          opacity={flashOpacity}
          rx={10}
        />
      )}
      
      {/* Health bar */}
      <g transform={`translate(0, ${-height/2 - 40})`}>
        <rect x={-60} y={0} width={120} height={12} fill="#222" stroke="#444" strokeWidth="2" rx={3} />
        <rect x={-58} y={2} width={116 * healthPercent} height={8} fill={healthPercent > 0.3 ? '#cc0000' : '#ff0000'} rx={2} />
        <text x={0} y={-5} fill="#ff6666" fontSize="12" textAnchor="middle" fontFamily="Georgia">
          PHANTOM KING
        </text>
      </g>
    </g>
  );
}

export function BossProjectile({ projectile }) {
  const { x, y, type, angle } = projectile;
  
  const colors = {
    homing: '#ff4444',
    spread: '#ff8844',
    sweep: '#ff2222',
    ring: '#ffaa44'
  };
  
  const color = colors[type] || '#ff0000';
  
  return (
    <g transform={`translate(${x}, ${y}) rotate(${(angle || 0) * 180 / Math.PI})`}>
      {/* Glow */}
      <ellipse cx={0} cy={0} rx={15} ry={15} fill={color} opacity="0.3" />
      
      {/* Core */}
      <ellipse cx={0} cy={0} rx={8} ry={8} fill={color} />
      
      {/* Inner bright */}
      <ellipse cx={0} cy={0} rx={4} ry={4} fill="#ffffff" opacity="0.5" />
      
      {/* Trail */}
      <ellipse cx={-10} cy={0} rx={12} ry={4} fill={color} opacity="0.4" />
      <ellipse cx={-20} cy={0} rx={8} ry={3} fill={color} opacity="0.2" />
    </g>
  );
}

export default React.memo(PhantomKing);
