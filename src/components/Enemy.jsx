import React from 'react';

function Enemy({ enemy }) {
  const { x, y, width, height, type, direction, animationFrame, hitFlash, opacity, health, maxHealth, isBoss } = enemy;
  
  const scaleX = direction > 0 ? 1 : -1;
  const flashColor = hitFlash > 0 ? '#ffffff' : null;
  
  // Health bar for bosses and mini-bosses
  const showHealthBar = isBoss || type === 'KNIGHT';
  
  return (
    <g transform={`translate(${x + width/2}, ${y + height/2})`} opacity={opacity}>
      {/* Shadow */}
      <ellipse
        cx={0}
        cy={height/2 - 3}
        rx={width/2}
        ry={5}
        fill="rgba(0,0,0,0.3)"
      />
      
      <g transform={`scale(${scaleX}, 1)`}>
        {renderEnemyByType(type, width, height, animationFrame, flashColor, isBoss)}
      </g>
      
      {/* Health bar */}
      {showHealthBar && (
        <g transform={`translate(0, ${-height/2 - 15})`}>
          <rect
            x={-width/2}
            y={0}
            width={width}
            height={6}
            fill="#333"
            rx={2}
          />
          <rect
            x={-width/2 + 1}
            y={1}
            width={(width - 2) * (health / maxHealth)}
            height={4}
            fill={isBoss ? '#ff4444' : '#ff8844'}
            rx={1}
          />
        </g>
      )}
    </g>
  );
}

function renderEnemyByType(type, width, height, frame, flash, isBoss) {
  const bobY = Math.sin(frame * 0.15) * 2;
  const color = flash || getEnemyColor(type);
  const darkColor = flash || getDarkColor(type);
  
  switch (type) {
    case 'SKELETON':
      return <SkeletonSprite width={width} height={height} frame={frame} color={color} dark={darkColor} />;
    case 'BAT':
      return <BatSprite width={width} height={height} frame={frame} color={color} dark={darkColor} />;
    case 'ZOMBIE':
      return <ZombieSprite width={width} height={height} frame={frame} color={color} dark={darkColor} />;
    case 'GHOST':
      return <GhostSprite width={width} height={height} frame={frame} color={color} dark={darkColor} />;
    case 'DEMON':
      return <DemonSprite width={width} height={height} frame={frame} color={color} dark={darkColor} />;
    case 'HELLHOUND':
      return <HellhoundSprite width={width} height={height} frame={frame} color={color} dark={darkColor} />;
    case 'WRAITH':
      return <WraithSprite width={width} height={height} frame={frame} color={color} dark={darkColor} />;
    case 'KNIGHT':
      return <KnightSprite width={width} height={height} frame={frame} color={color} dark={darkColor} isBoss={isBoss} />;
    case 'GARGOYLE':
      return <GargoyleSprite width={width} height={height} frame={frame} color={color} dark={darkColor} isBoss={isBoss} />;
    default:
      return <rect x={-width/2} y={-height/2} width={width} height={height} fill={color} />;
  }
}

function getEnemyColor(type) {
  const colors = {
    SKELETON: '#d4c4a8',
    BAT: '#4a3728',
    ZOMBIE: '#4a6a5a',
    GHOST: '#a4b8c8',
    DEMON: '#cc4422',
    HELLHOUND: '#8b3a3a',
    WRAITH: '#5a4a7a',
    KNIGHT: '#6a6a7e',
    GARGOYLE: '#7a7a8e'
  };
  return colors[type] || '#888888';
}

function getDarkColor(type) {
  const colors = {
    SKELETON: '#8a7a5a',
    BAT: '#2a1a0a',
    ZOMBIE: '#2a4a3a',
    GHOST: '#6a7a8a',
    DEMON: '#8a2200',
    HELLHOUND: '#5a1a1a',
    WRAITH: '#3a2a5a',
    KNIGHT: '#3a3a4e',
    GARGOYLE: '#4a4a5e'
  };
  return colors[type] || '#444444';
}

// Individual enemy sprites
function SkeletonSprite({ width, height, frame, color, dark }) {
  const walkBob = Math.sin(frame * 0.2) * 2;
  return (
    <g>
      {/* Skull */}
      <ellipse cx={0} cy={-height/2 + 12} rx={10} ry={12} fill={color} stroke={dark} strokeWidth="1" />
      <circle cx={-4} cy={-height/2 + 10} r={3} fill="#1a1a1a" />
      <circle cx={4} cy={-height/2 + 10} r={3} fill="#1a1a1a" />
      <ellipse cx={0} cy={-height/2 + 18} rx={3} ry={2} fill="#1a1a1a" />
      
      {/* Spine/ribs */}
      <rect x={-2} y={-height/2 + 22} width={4} height={20} fill={color} />
      {[0, 6, 12].map(i => (
        <rect key={i} x={-8} y={-height/2 + 25 + i} width={16} height={3} fill={color} rx={1} />
      ))}
      
      {/* Arms */}
      <rect x={-width/2 + 2} y={-height/2 + 25} width={8} height={4} fill={color} 
        transform={`rotate(${Math.sin(frame * 0.2) * 10})`} />
      <rect x={width/2 - 10} y={-height/2 + 25} width={8} height={4} fill={color}
        transform={`rotate(${Math.sin(frame * 0.2 + Math.PI) * 10})`} />
      
      {/* Legs */}
      <rect x={-6} y={0 + walkBob} width={4} height={height/3} fill={color} />
      <rect x={2} y={0 - walkBob} width={4} height={height/3} fill={color} />
    </g>
  );
}

function BatSprite({ width, height, frame, color, dark }) {
  const wingFlap = Math.sin(frame * 0.4) * 20;
  return (
    <g>
      {/* Wings */}
      <path
        d={`M 0 0 Q ${-width/2} ${-height/2 + wingFlap} ${-width} 0`}
        fill={color}
        stroke={dark}
        strokeWidth="1"
      />
      <path
        d={`M 0 0 Q ${width/2} ${-height/2 + wingFlap} ${width} 0`}
        fill={color}
        stroke={dark}
        strokeWidth="1"
      />
      {/* Body */}
      <ellipse cx={0} cy={0} rx={8} ry={10} fill={dark} />
      {/* Eyes */}
      <circle cx={-3} cy={-3} r={2} fill="#ff3333" />
      <circle cx={3} cy={-3} r={2} fill="#ff3333" />
      {/* Ears */}
      <path d={`M -5 -8 L -3 -15 L 0 -8`} fill={color} />
      <path d={`M 5 -8 L 3 -15 L 0 -8`} fill={color} />
    </g>
  );
}

function ZombieSprite({ width, height, frame, color, dark }) {
  const shamble = Math.sin(frame * 0.1) * 3;
  return (
    <g transform={`translate(${shamble}, 0)`}>
      {/* Head */}
      <ellipse cx={0} cy={-height/2 + 15} rx={12} ry={14} fill={color} stroke={dark} strokeWidth="1" />
      {/* Eyes */}
      <ellipse cx={-4} cy={-height/2 + 12} rx={3} ry={4} fill="#1a1a1a" />
      <ellipse cx={4} cy={-height/2 + 12} rx={3} ry={4} fill="#1a1a1a" />
      {/* Mouth */}
      <path d={`M -5 ${-height/2 + 22} Q 0 ${-height/2 + 26} 5 ${-height/2 + 22}`} fill="none" stroke="#1a1a1a" strokeWidth="2" />
      {/* Body */}
      <rect x={-width/3} y={-height/2 + 28} width={width*2/3} height={height/2} fill={dark} rx={5} />
      {/* Arms (reaching) */}
      <rect x={-width/2} y={-height/4} width={width/4} height={6} fill={color} rx={2}
        transform={`rotate(${30 + Math.sin(frame * 0.1) * 5})`} />
      <rect x={width/4} y={-height/4} width={width/4} height={6} fill={color} rx={2}
        transform={`rotate(${-30 + Math.sin(frame * 0.1 + Math.PI) * 5})`} />
      {/* Legs */}
      <rect x={-8} y={height/4} width={6} height={height/4} fill={dark} />
      <rect x={2} y={height/4} width={6} height={height/4} fill={dark} />
    </g>
  );
}

function GhostSprite({ width, height, frame, color, dark }) {
  const float = Math.sin(frame * 0.1) * 5;
  const waver = Math.sin(frame * 0.15) * 3;
  return (
    <g transform={`translate(0, ${float})`}>
      {/* Main body */}
      <path
        d={`
          M ${-width/2} ${0}
          Q ${-width/2} ${-height/2} ${0} ${-height/2}
          Q ${width/2} ${-height/2} ${width/2} ${0}
          Q ${width/2 - waver} ${height/3} ${width/4} ${height/2}
          Q ${width/8} ${height/3} ${0} ${height/2}
          Q ${-width/8} ${height/3} ${-width/4} ${height/2}
          Q ${-width/2 + waver} ${height/3} ${-width/2} ${0}
        `}
        fill={color}
        opacity="0.8"
      />
      {/* Eyes */}
      <ellipse cx={-6} cy={-8} rx={5} ry={6} fill="#1a1a2a" />
      <ellipse cx={6} cy={-8} rx={5} ry={6} fill="#1a1a2a" />
      {/* Mouth */}
      <ellipse cx={0} cy={8} rx={4} ry={6} fill="#1a1a2a" />
    </g>
  );
}

function DemonSprite({ width, height, frame, color, dark }) {
  const wingFlap = Math.sin(frame * 0.3) * 15;
  return (
    <g>
      {/* Wings */}
      <path
        d={`M -5 0 Q ${-width/2 - 5} ${-10 + wingFlap} ${-width/2 - 10} ${10}`}
        fill={dark}
        stroke={color}
        strokeWidth="1"
      />
      <path
        d={`M 5 0 Q ${width/2 + 5} ${-10 + wingFlap} ${width/2 + 10} ${10}`}
        fill={dark}
        stroke={color}
        strokeWidth="1"
      />
      {/* Body */}
      <ellipse cx={0} cy={0} rx={width/3} ry={height/3} fill={color} stroke={dark} strokeWidth="2" />
      {/* Head */}
      <ellipse cx={0} cy={-height/3} rx={10} ry={10} fill={color} stroke={dark} strokeWidth="1" />
      {/* Horns */}
      <path d={`M -8 ${-height/3 - 8} L -12 ${-height/3 - 20} L -5 ${-height/3 - 10}`} fill={dark} />
      <path d={`M 8 ${-height/3 - 8} L 12 ${-height/3 - 20} L 5 ${-height/3 - 10}`} fill={dark} />
      {/* Eyes */}
      <circle cx={-4} cy={-height/3 - 2} r={3} fill="#ffff00" />
      <circle cx={4} cy={-height/3 - 2} r={3} fill="#ffff00" />
    </g>
  );
}

function HellhoundSprite({ width, height, frame, color, dark }) {
  const run = Math.sin(frame * 0.3) * 5;
  return (
    <g>
      {/* Body */}
      <ellipse cx={0} cy={0} rx={width/2 - 5} ry={height/3} fill={color} stroke={dark} strokeWidth="2" />
      {/* Head */}
      <ellipse cx={width/3} cy={-5} rx={12} ry={10} fill={color} stroke={dark} strokeWidth="1" />
      {/* Snout */}
      <ellipse cx={width/3 + 10} cy={-2} rx={6} ry={4} fill={dark} />
      {/* Eyes */}
      <circle cx={width/3 + 2} cy={-8} r={3} fill="#ff4400" />
      {/* Ears */}
      <path d={`M ${width/3 - 5} -12 L ${width/3 - 8} -22 L ${width/3} -15`} fill={color} />
      <path d={`M ${width/3 + 5} -12 L ${width/3 + 8} -22 L ${width/3} -15`} fill={color} />
      {/* Legs */}
      <rect x={-width/3} y={height/4 + run} width={5} height={height/3} fill={dark} />
      <rect x={-width/3 + 8} y={height/4 - run} width={5} height={height/3} fill={dark} />
      <rect x={width/6} y={height/4 - run} width={5} height={height/3} fill={dark} />
      <rect x={width/6 + 8} y={height/4 + run} width={5} height={height/3} fill={dark} />
      {/* Tail */}
      <path d={`M ${-width/2 + 5} 0 Q ${-width/2 - 10} ${-10 + Math.sin(frame * 0.2) * 5} ${-width/2 - 5} -15`} 
        fill="none" stroke={color} strokeWidth="4" />
    </g>
  );
}

function WraithSprite({ width, height, frame, color, dark }) {
  const phase = Math.sin(frame * 0.05);
  const drift = Math.sin(frame * 0.08) * 8;
  return (
    <g transform={`translate(${drift}, 0)`} opacity={0.5 + phase * 0.3}>
      {/* Ethereal body */}
      <path
        d={`
          M ${-width/2} ${height/4}
          Q ${-width/3} ${-height/2} ${0} ${-height/2}
          Q ${width/3} ${-height/2} ${width/2} ${height/4}
          Q ${width/4} ${height/2} ${0} ${height/2}
          Q ${-width/4} ${height/2} ${-width/2} ${height/4}
        `}
        fill={color}
        stroke={dark}
        strokeWidth="1"
      />
      {/* Inner darkness */}
      <ellipse cx={0} cy={-height/6} rx={width/4} ry={height/4} fill={dark} opacity="0.6" />
      {/* Eyes */}
      <ellipse cx={-6} cy={-height/4} rx={4} ry={5} fill="#aa88ff" />
      <ellipse cx={6} cy={-height/4} rx={4} ry={5} fill="#aa88ff" />
      {/* Trailing wisps */}
      {[0, 1, 2].map(i => (
        <path
          key={i}
          d={`M ${-10 + i * 10} ${height/3} Q ${-15 + i * 10 + Math.sin(frame * 0.1 + i) * 5} ${height/2 + 10} ${-10 + i * 10} ${height/2 + 20}`}
          fill="none"
          stroke={color}
          strokeWidth="3"
          opacity={0.5 - i * 0.1}
        />
      ))}
    </g>
  );
}

function KnightSprite({ width, height, frame, color, dark, isBoss }) {
  const scale = isBoss ? 1 : 1;
  return (
    <g>
      {/* Helmet */}
      <rect x={-12 * scale} y={-height/2} width={24 * scale} height={20 * scale} fill={color} stroke={dark} strokeWidth="2" rx={3} />
      <rect x={-8 * scale} y={-height/2 + 8} width={16 * scale} height={3} fill={dark} />
      {/* Visor slit */}
      <rect x={-6 * scale} y={-height/2 + 12} width={12 * scale} height={2} fill="#1a1a1a" />
      {/* Plume for boss */}
      {isBoss && (
        <path d={`M 0 ${-height/2} Q 15 ${-height/2 - 20} 5 ${-height/2 - 30}`} fill="#cc2222" stroke="#880000" />
      )}
      {/* Body armor */}
      <path
        d={`
          M ${-width/3} ${-height/2 + 22}
          L ${-width/2 + 5} ${0}
          L ${-width/3} ${height/3}
          L ${width/3} ${height/3}
          L ${width/2 - 5} ${0}
          L ${width/3} ${-height/2 + 22}
          Z
        `}
        fill={color}
        stroke={dark}
        strokeWidth="2"
      />
      {/* Shield */}
      <ellipse cx={-width/2 + 8} cy={0} rx={10} ry={15} fill={dark} stroke={color} strokeWidth="2" />
      {/* Sword */}
      <rect x={width/3} y={-height/4} width={4} height={height/2} fill="#888" stroke="#666" />
      <rect x={width/3 - 4} y={-height/4} width={12} height={4} fill="#aa8822" />
      {/* Legs */}
      <rect x={-10} y={height/3} width={8} height={height/4} fill={color} stroke={dark} />
      <rect x={2} y={height/3} width={8} height={height/4} fill={color} stroke={dark} />
    </g>
  );
}

function GargoyleSprite({ width, height, frame, color, dark, isBoss }) {
  const wingSpread = Math.sin(frame * 0.2) * 10;
  return (
    <g>
      {/* Wings */}
      <path
        d={`
          M -5 ${-height/4}
          Q ${-width/2 - wingSpread} ${-height/2} ${-width - 10} ${-height/4}
          Q ${-width/2} ${0} -10 ${height/4}
          Z
        `}
        fill={dark}
        stroke={color}
        strokeWidth="1"
      />
      <path
        d={`
          M 5 ${-height/4}
          Q ${width/2 + wingSpread} ${-height/2} ${width + 10} ${-height/4}
          Q ${width/2} ${0} 10 ${height/4}
          Z
        `}
        fill={dark}
        stroke={color}
        strokeWidth="1"
      />
      {/* Body */}
      <ellipse cx={0} cy={0} rx={width/3} ry={height/3} fill={color} stroke={dark} strokeWidth="2" />
      {/* Head */}
      <ellipse cx={0} cy={-height/3} rx={12} ry={10} fill={color} stroke={dark} strokeWidth="1" />
      {/* Horns */}
      <path d={`M -10 ${-height/3 - 5} L -15 ${-height/3 - 18} L -5 ${-height/3 - 8}`} fill={dark} />
      <path d={`M 10 ${-height/3 - 5} L 15 ${-height/3 - 18} L 5 ${-height/3 - 8}`} fill={dark} />
      {/* Eyes */}
      <circle cx={-5} cy={-height/3} r={3} fill={isBoss ? '#ff0000' : '#ffaa00'} />
      <circle cx={5} cy={-height/3} r={3} fill={isBoss ? '#ff0000' : '#ffaa00'} />
      {/* Fangs */}
      <path d={`M -3 ${-height/3 + 8} L -3 ${-height/3 + 14}`} stroke="#eee" strokeWidth="2" />
      <path d={`M 3 ${-height/3 + 8} L 3 ${-height/3 + 14}`} stroke="#eee" strokeWidth="2" />
      {/* Claws */}
      <path d={`M ${-width/3} ${height/4} L ${-width/3 - 5} ${height/2}`} stroke={dark} strokeWidth="3" />
      <path d={`M ${width/3} ${height/4} L ${width/3 + 5} ${height/2}`} stroke={dark} strokeWidth="3" />
    </g>
  );
}

export default React.memo(Enemy);
