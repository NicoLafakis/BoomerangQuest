import React from 'react';
import { ZONE_PALETTES, GAME_WIDTH, GAME_HEIGHT, ZONE_WIDTH } from '../constants/gameConstants';

function Background({ cameraX, currentZone }) {
  const palette = ZONE_PALETTES[currentZone] || ZONE_PALETTES[0];
  
  // Parallax offsets
  const parallax1 = -cameraX * 0.1;
  const parallax2 = -cameraX * 0.3;
  const parallax3 = -cameraX * 0.5;
  
  return (
    <g>
      {/* Sky/Background gradient */}
      <defs>
        <linearGradient id={`bgGradient-${currentZone}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={palette.background[2]} />
          <stop offset="50%" stopColor={palette.background[1]} />
          <stop offset="100%" stopColor={palette.background[0]} />
        </linearGradient>
        
        {/* Fog gradient */}
        <linearGradient id="fogGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={palette.fog} stopOpacity="0" />
          <stop offset="70%" stopColor={palette.fog} stopOpacity="0.5" />
          <stop offset="100%" stopColor={palette.fog} stopOpacity="0.8" />
        </linearGradient>
      </defs>
      
      {/* Main background */}
      <rect
        x={0}
        y={0}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        fill={`url(#bgGradient-${currentZone})`}
      />
      
      {/* Far background layer */}
      <g transform={`translate(${parallax1 % 400}, 0)`}>
        {renderBackgroundElements(currentZone, 'far')}
      </g>
      
      {/* Mid background layer */}
      <g transform={`translate(${parallax2 % 300}, 0)`}>
        {renderBackgroundElements(currentZone, 'mid')}
      </g>
      
      {/* Near background layer */}
      <g transform={`translate(${parallax3 % 200}, 0)`}>
        {renderBackgroundElements(currentZone, 'near')}
      </g>
      
      {/* Fog overlay */}
      <rect
        x={0}
        y={GAME_HEIGHT - 200}
        width={GAME_WIDTH}
        height={200}
        fill="url(#fogGradient)"
      />
    </g>
  );
}

function renderBackgroundElements(zoneIndex, layer) {
  switch (zoneIndex) {
    case 0: return <WoodsBackground layer={layer} />;
    case 1: return <CryptBackground layer={layer} />;
    case 2: return <InfernalBackground layer={layer} />;
    case 3: return <CastleBackground layer={layer} />;
    case 4: return <BossBackground layer={layer} />;
    default: return <WoodsBackground layer={layer} />;
  }
}

function WoodsBackground({ layer }) {
  const opacity = layer === 'far' ? 0.3 : layer === 'mid' ? 0.5 : 0.7;
  const scale = layer === 'far' ? 0.5 : layer === 'mid' ? 0.7 : 1;
  const baseY = layer === 'far' ? 350 : layer === 'mid' ? 320 : 280;
  
  return (
    <g opacity={opacity}>
      {/* Trees */}
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i} transform={`translate(${i * 200 - 100}, ${baseY}) scale(${scale})`}>
          {/* Trunk */}
          <rect x={-15} y={0} width={30} height={400} fill="#1a1008" />
          {/* Foliage */}
          <ellipse cx={0} cy={-30} rx={80} ry={100} fill="#0d1a0d" />
          <ellipse cx={-40} cy={20} rx={50} ry={70} fill="#0a150a" />
          <ellipse cx={40} cy={10} rx={60} ry={80} fill="#0a150a" />
        </g>
      ))}
      
      {/* Fireflies */}
      {layer === 'near' && Array.from({ length: 5 }, (_, i) => (
        <circle
          key={`firefly-${i}`}
          cx={100 + i * 250}
          cy={300 + Math.sin(i * 2) * 100}
          r={2}
          fill="#aaffaa"
        >
          <animate
            attributeName="opacity"
            values="0.2;1;0.2"
            dur={`${2 + i * 0.5}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </g>
  );
}

function CryptBackground({ layer }) {
  const opacity = layer === 'far' ? 0.2 : layer === 'mid' ? 0.4 : 0.6;
  const baseY = layer === 'far' ? 100 : layer === 'mid' ? 50 : 0;
  
  return (
    <g opacity={opacity}>
      {/* Ice pillars */}
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i} transform={`translate(${i * 250 - 50}, ${baseY})`}>
          {/* Stalactite */}
          <path
            d={`M ${20 + i * 30} 0 L ${30 + i * 30} ${100 + i * 20} L ${10 + i * 30} ${100 + i * 20} Z`}
            fill="#3a5a7a"
          />
          {/* Ice crystal */}
          <polygon
            points={`${80 + i * 10},50 ${100 + i * 10},100 ${60 + i * 10},100`}
            fill="#6a9aba"
            opacity="0.5"
          />
        </g>
      ))}
      
      {/* Frozen waterfall */}
      {layer === 'mid' && (
        <g transform="translate(600, 50)">
          <path
            d={`M 0 0 Q 20 100 0 200 Q -20 300 0 400`}
            fill="none"
            stroke="#8ab8d8"
            strokeWidth="40"
            opacity="0.4"
          />
          <path
            d={`M 0 0 Q 10 100 0 200 Q -10 300 0 400`}
            fill="none"
            stroke="#aad8f8"
            strokeWidth="20"
            opacity="0.3"
          />
        </g>
      )}
      
      {/* Snow particles */}
      {layer === 'near' && Array.from({ length: 10 }, (_, i) => (
        <circle
          key={`snow-${i}`}
          cx={i * 130}
          cy={100}
          r={2}
          fill="#ffffff"
          opacity="0.6"
        >
          <animate
            attributeName="cy"
            values="0;675"
            dur={`${5 + i % 3}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </g>
  );
}

function InfernalBackground({ layer }) {
  const opacity = layer === 'far' ? 0.3 : layer === 'mid' ? 0.5 : 0.7;
  
  return (
    <g opacity={opacity}>
      {/* Lava pools in background */}
      {Array.from({ length: 4 }, (_, i) => (
        <g key={i} transform={`translate(${i * 350}, 500)`}>
          <ellipse cx={100} cy={0} rx={80} ry={20} fill="#ff4400" opacity="0.4" />
          <ellipse cx={100} cy={0} rx={60} ry={15} fill="#ff6600" opacity="0.5" />
          <ellipse cx={100} cy={0} rx={40} ry={10} fill="#ffaa00" opacity="0.6" />
        </g>
      ))}
      
      {/* Rock formations */}
      {layer !== 'far' && Array.from({ length: 5 }, (_, i) => (
        <path
          key={i}
          d={`M ${i * 300 - 50} 675 L ${i * 300} ${400 - i * 30} L ${i * 300 + 50} 675 Z`}
          fill="#2a1a0a"
        />
      ))}
      
      {/* Embers rising */}
      {layer === 'near' && Array.from({ length: 8 }, (_, i) => (
        <circle
          key={`ember-${i}`}
          cx={80 + i * 150}
          cy={600}
          r={3}
          fill="#ff8844"
        >
          <animate
            attributeName="cy"
            values="650;100"
            dur={`${3 + i % 2}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0"
            dur={`${3 + i % 2}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </g>
  );
}

function CastleBackground({ layer }) {
  const opacity = layer === 'far' ? 0.2 : layer === 'mid' ? 0.4 : 0.6;
  
  return (
    <g opacity={opacity}>
      {/* Castle towers in distance */}
      {layer === 'far' && (
        <g>
          <rect x={200} y={100} width={60} height={400} fill="#2a1a3a" />
          <polygon points="200,100 230,30 260,100" fill="#3a2a4a" />
          <rect x={500} y={150} width={80} height={350} fill="#25152a" />
          <polygon points="500,150 540,60 580,150" fill="#352545" />
          <rect x={900} y={120} width={70} height={380} fill="#2a1a3a" />
          <polygon points="900,120 935,40 970,120" fill="#3a2a4a" />
        </g>
      )}
      
      {/* Windows with eerie glow */}
      {layer === 'mid' && Array.from({ length: 6 }, (_, i) => (
        <g key={i} transform={`translate(${i * 220}, 200)`}>
          <rect x={0} y={0} width={20} height={30} fill="#5a2a6a" opacity="0.3" />
          <rect x={0} y={0} width={20} height={30} fill="#7a4a9a">
            <animate
              attributeName="opacity"
              values="0.2;0.5;0.2"
              dur={`${3 + i}s`}
              repeatCount="indefinite"
            />
          </rect>
        </g>
      ))}
      
      {/* Mist wisps */}
      {layer === 'near' && Array.from({ length: 5 }, (_, i) => (
        <ellipse
          key={`mist-${i}`}
          cx={100 + i * 260}
          cy={400}
          rx={100}
          ry={30}
          fill="#6a4a8a"
          opacity="0.2"
        >
          <animate
            attributeName="cx"
            values={`${100 + i * 260};${150 + i * 260};${100 + i * 260}`}
            dur={`${8 + i}s`}
            repeatCount="indefinite"
          />
        </ellipse>
      ))}
    </g>
  );
}

function BossBackground({ layer }) {
  return (
    <g>
      {/* Void with occasional lightning */}
      <rect x={0} y={0} width={GAME_WIDTH} height={GAME_HEIGHT} fill="#0a0510" />
      
      {/* Arcane circles */}
      {layer === 'mid' && (
        <g opacity="0.3">
          <circle cx={GAME_WIDTH / 2} cy={GAME_HEIGHT / 2} r={300} fill="none" stroke="#880000" strokeWidth="2" />
          <circle cx={GAME_WIDTH / 2} cy={GAME_HEIGHT / 2} r={250} fill="none" stroke="#660000" strokeWidth="1" />
          <circle cx={GAME_WIDTH / 2} cy={GAME_HEIGHT / 2} r={200} fill="none" stroke="#440000" strokeWidth="1" />
        </g>
      )}
      
      {/* Pulsing symbols */}
      {layer === 'near' && Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = GAME_WIDTH / 2 + Math.cos(angle) * 280;
        const y = GAME_HEIGHT / 2 + Math.sin(angle) * 200;
        return (
          <text
            key={i}
            x={x}
            y={y}
            fill="#aa0000"
            fontSize="24"
            textAnchor="middle"
            opacity="0.5"
          >
            <animate
              attributeName="opacity"
              values="0.2;0.6;0.2"
              dur={`${2 + i * 0.3}s`}
              repeatCount="indefinite"
            />
            ⛧
          </text>
        );
      })}
    </g>
  );
}

export default React.memo(Background);
