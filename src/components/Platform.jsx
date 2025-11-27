import React from 'react';
import { ZONE_PALETTES } from '../constants/gameConstants';

function Platform({ platform, zoneIndex }) {
  const palette = ZONE_PALETTES[zoneIndex] || ZONE_PALETTES[0];
  const { x, y, width, height, type } = platform;
  
  if (type === 'hazard') {
    return <HazardPlatform x={x} y={y} width={width} height={height} />;
  }
  
  if (type === 'wall') {
    return <WallPlatform x={x} y={y} width={width} height={height} zoneIndex={zoneIndex} />;
  }
  
  return (
    <g>
      {/* Main platform body */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={palette.platform}
        stroke={palette.accent}
        strokeWidth="2"
        rx={type === 'log' ? 8 : 3}
      />
      
      {/* Top surface highlight */}
      <rect
        x={x + 2}
        y={y + 2}
        width={width - 4}
        height={4}
        fill={palette.accent}
        opacity="0.3"
        rx={2}
      />
      
      {/* Surface detail based on type */}
      {type === 'log' && (
        <>
          {/* Wood grain lines */}
          {Array.from({ length: Math.floor(width / 30) }, (_, i) => (
            <line
              key={i}
              x1={x + 15 + i * 30}
              y1={y + 5}
              x2={x + 15 + i * 30}
              y2={y + height - 5}
              stroke={palette.accent}
              strokeWidth="1"
              opacity="0.3"
            />
          ))}
        </>
      )}
      
      {type === 'stone' && (
        <>
          {/* Stone texture */}
          {Array.from({ length: 3 }, (_, i) => (
            <rect
              key={i}
              x={x + 10 + i * (width / 3)}
              y={y + height / 3}
              width={width / 4}
              height={height / 3}
              fill="none"
              stroke={palette.accent}
              strokeWidth="1"
              opacity="0.2"
            />
          ))}
        </>
      )}
      
      {type === 'castle' && (
        <>
          {/* Battlements */}
          {Array.from({ length: Math.floor(width / 40) }, (_, i) => (
            <rect
              key={i}
              x={x + 5 + i * 40}
              y={y - 8}
              width={15}
              height={10}
              fill={palette.platform}
              stroke={palette.accent}
              strokeWidth="1"
            />
          ))}
        </>
      )}
      
      {/* Ground platform special treatment */}
      {type === 'ground' && (
        <>
          {/* Grass/surface layer */}
          <rect
            x={x}
            y={y}
            width={width}
            height={8}
            fill={palette.accent}
            opacity="0.4"
          />
        </>
      )}
    </g>
  );
}

function WallPlatform({ x, y, width, height, zoneIndex }) {
  const palette = ZONE_PALETTES[zoneIndex] || ZONE_PALETTES[0];
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={palette.platform}
        stroke={palette.accent}
        strokeWidth="2"
      />
      
      {/* Vertical detail lines */}
      {Array.from({ length: Math.floor(height / 50) }, (_, i) => (
        <line
          key={i}
          x1={x + width / 2}
          y1={y + 25 + i * 50}
          x2={x + width / 2}
          y2={y + 45 + i * 50}
          stroke={palette.accent}
          strokeWidth="2"
          opacity="0.3"
        />
      ))}
      
      {/* Edge highlight */}
      <line
        x1={x + 2}
        y1={y}
        x2={x + 2}
        y2={y + height}
        stroke={palette.accent}
        strokeWidth="2"
        opacity="0.2"
      />
    </g>
  );
}

function HazardPlatform({ x, y, width, height }) {
  return (
    <g>
      {/* Lava glow */}
      <rect
        x={x - 5}
        y={y - 10}
        width={width + 10}
        height={height + 15}
        fill="#ff4400"
        opacity="0.3"
        rx={5}
      />
      
      {/* Lava surface */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="#ff6600"
        rx={3}
      />
      
      {/* Lava bubbles */}
      <circle cx={x + width * 0.25} cy={y + height / 2} r={4} fill="#ffaa00">
        <animate
          attributeName="cy"
          values={`${y + height / 2};${y - 5};${y + height / 2}`}
          dur="1.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="1;0;1"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx={x + width * 0.75} cy={y + height / 2} r={3} fill="#ffcc00">
        <animate
          attributeName="cy"
          values={`${y + height / 2};${y - 8};${y + height / 2}`}
          dur="2s"
          repeatCount="indefinite"
          begin="0.5s"
        />
        <animate
          attributeName="opacity"
          values="1;0;1"
          dur="2s"
          repeatCount="indefinite"
          begin="0.5s"
        />
      </circle>
      
      {/* Hot air shimmer effect */}
      <rect
        x={x}
        y={y - 30}
        width={width}
        height={30}
        fill="url(#heatShimmer)"
        opacity="0.2"
      />
    </g>
  );
}

export default React.memo(Platform);
