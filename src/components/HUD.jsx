import React from 'react';
import { GAME_WIDTH, GAME_HEIGHT, PLAYER_MAX_HEALTH, ZONE_NAMES } from '../constants/gameConstants';

function HUD({ gameState }) {
  const { health, score, combo, comboTimer, currentZone, magic, bossActive } = gameState;
  
  const healthPercent = health / PLAYER_MAX_HEALTH;
  const magicPercent = (magic || 0) / 100;
  const comboActive = combo > 0 && comboTimer > 0;
  
  return (
    <g>
      {/* Health bar */}
      <g transform="translate(20, 20)">
        {/* Background */}
        <rect x={0} y={0} width={200} height={24} fill="#1a1a1a" stroke="#444" strokeWidth="2" rx={4} />
        {/* Health fill */}
        <rect 
          x={2} 
          y={2} 
          width={196 * healthPercent} 
          height={20} 
          fill={healthPercent > 0.5 ? '#44aa44' : healthPercent > 0.25 ? '#aaaa44' : '#aa4444'} 
          rx={3}
        />
        {/* Health segments */}
        {[0.25, 0.5, 0.75].map(seg => (
          <line 
            key={seg} 
            x1={2 + 196 * seg} 
            y1={2} 
            x2={2 + 196 * seg} 
            y2={22} 
            stroke="#1a1a1a" 
            strokeWidth="2" 
          />
        ))}
        {/* Label */}
        <text x={100} y={17} fill="#fff" fontSize="12" fontFamily="Georgia" textAnchor="middle">
          HP
        </text>
      </g>
      
      {/* Magic bar */}
      <g transform="translate(20, 50)">
        <rect x={0} y={0} width={150} height={16} fill="#1a1a1a" stroke="#444" strokeWidth="2" rx={3} />
        <rect x={2} y={2} width={146 * magicPercent} height={12} fill="#4466aa" rx={2} />
        <text x={75} y={12} fill="#aaccff" fontSize="10" fontFamily="Georgia" textAnchor="middle">
          MAGIC
        </text>
      </g>
      
      {/* Score */}
      <g transform={`translate(${GAME_WIDTH - 20}, 20)`}>
        <text x={0} y={0} fill="#ffcc00" fontSize="14" fontFamily="Georgia" textAnchor="end">
          SCORE
        </text>
        <text x={0} y={24} fill="#ffffff" fontSize="24" fontFamily="Georgia" fontWeight="bold" textAnchor="end">
          {score.toLocaleString()}
        </text>
      </g>
      
      {/* Combo display */}
      {comboActive && (
        <g transform={`translate(${GAME_WIDTH - 20}, 70)`}>
          <text 
            x={0} 
            y={0} 
            fill={combo > 5 ? '#ff4444' : combo > 3 ? '#ffaa00' : '#ffff00'} 
            fontSize={18 + Math.min(combo * 2, 12)} 
            fontFamily="Georgia" 
            fontWeight="bold" 
            textAnchor="end"
          >
            {combo}x COMBO!
          </text>
          {/* Combo timer bar */}
          <rect x={-100} y={8} width={100} height={4} fill="#333" rx={2} />
          <rect x={-100} y={8} width={100 * (comboTimer / 120)} height={4} fill="#ffaa00" rx={2} />
        </g>
      )}
      
      {/* Zone indicator */}
      {!bossActive && (
        <g transform={`translate(${GAME_WIDTH / 2}, 30)`}>
          <text 
            x={0} 
            y={0} 
            fill="#888" 
            fontSize="14" 
            fontFamily="Georgia" 
            textAnchor="middle"
            opacity="0.7"
          >
            {ZONE_NAMES[currentZone] || 'Unknown Zone'}
          </text>
        </g>
      )}
      
      {/* Controls hint (fades after start) */}
      <g transform={`translate(${GAME_WIDTH / 2}, ${GAME_HEIGHT - 30})`} opacity="0.5">
        <text x={0} y={0} fill="#888" fontSize="11" fontFamily="Georgia" textAnchor="middle">
          WASD/Arrows: Move | Space: Jump | Click: Throw | Hold: Charge | Shift: Dash
        </text>
      </g>
    </g>
  );
}

export function TitleScreen({ onStart }) {
  return (
    <g>
      {/* Dark background */}
      <rect x={0} y={0} width={GAME_WIDTH} height={GAME_HEIGHT} fill="#0a0510" />
      
      {/* Decorative frame */}
      <rect 
        x={50} 
        y={50} 
        width={GAME_WIDTH - 100} 
        height={GAME_HEIGHT - 100} 
        fill="none" 
        stroke="#4a2a5a" 
        strokeWidth="3" 
        rx={10}
      />
      <rect 
        x={60} 
        y={60} 
        width={GAME_WIDTH - 120} 
        height={GAME_HEIGHT - 120} 
        fill="none" 
        stroke="#3a1a4a" 
        strokeWidth="1" 
        rx={8}
      />
      
      {/* Title */}
      <text 
        x={GAME_WIDTH / 2} 
        y={200} 
        fill="#ffcc00" 
        fontSize="64" 
        fontFamily="Georgia" 
        fontWeight="bold" 
        textAnchor="middle"
      >
        BOOMERANG
      </text>
      <text 
        x={GAME_WIDTH / 2} 
        y={270} 
        fill="#aa8844" 
        fontSize="48" 
        fontFamily="Georgia" 
        textAnchor="middle"
      >
        QUEST
      </text>
      
      {/* Subtitle */}
      <text 
        x={GAME_WIDTH / 2} 
        y={340} 
        fill="#8866aa" 
        fontSize="18" 
        fontFamily="Georgia" 
        fontStyle="italic" 
        textAnchor="middle"
      >
        Defeat the Phantom King
      </text>
      
      {/* Boomerang decoration */}
      <g transform={`translate(${GAME_WIDTH / 2}, 400)`}>
        <path
          d={`M -40 -15 Q 0 -30 40 -15 L 30 0 Q 0 -12 -30 0 Z`}
          fill="#c4a35a"
          stroke="#8b6914"
          strokeWidth="2"
        />
      </g>
      
      {/* Start prompt */}
      <text 
        x={GAME_WIDTH / 2} 
        y={500} 
        fill="#ffffff" 
        fontSize="24" 
        fontFamily="Georgia" 
        textAnchor="middle"
        style={{ cursor: 'pointer' }}
      >
        <animate
          attributeName="opacity"
          values="1;0.5;1"
          dur="2s"
          repeatCount="indefinite"
        />
        Click to Start
      </text>
      
      {/* Controls */}
      <g transform={`translate(${GAME_WIDTH / 2}, 570)`}>
        <text x={0} y={0} fill="#666" fontSize="12" fontFamily="Georgia" textAnchor="middle">
          WASD or Arrow Keys to Move | Space to Jump | Mouse to Aim and Throw
        </text>
        <text x={0} y={20} fill="#666" fontSize="12" fontFamily="Georgia" textAnchor="middle">
          Hold Mouse to Charge | Shift to Dash
        </text>
      </g>
    </g>
  );
}

export function GameOverScreen({ score, onRestart }) {
  return (
    <g>
      <rect x={0} y={0} width={GAME_WIDTH} height={GAME_HEIGHT} fill="rgba(10, 5, 16, 0.9)" />
      
      <text 
        x={GAME_WIDTH / 2} 
        y={200} 
        fill="#aa2222" 
        fontSize="64" 
        fontFamily="Georgia" 
        fontWeight="bold" 
        textAnchor="middle"
      >
        GAME OVER
      </text>
      
      <text 
        x={GAME_WIDTH / 2} 
        y={300} 
        fill="#888" 
        fontSize="24" 
        fontFamily="Georgia" 
        textAnchor="middle"
      >
        Final Score
      </text>
      
      <text 
        x={GAME_WIDTH / 2} 
        y={350} 
        fill="#ffcc00" 
        fontSize="48" 
        fontFamily="Georgia" 
        fontWeight="bold" 
        textAnchor="middle"
      >
        {score.toLocaleString()}
      </text>
      
      <text 
        x={GAME_WIDTH / 2} 
        y={480} 
        fill="#ffffff" 
        fontSize="24" 
        fontFamily="Georgia" 
        textAnchor="middle"
        style={{ cursor: 'pointer' }}
      >
        <animate
          attributeName="opacity"
          values="1;0.5;1"
          dur="2s"
          repeatCount="indefinite"
        />
        Click to Try Again
      </text>
    </g>
  );
}

export function VictoryScreen({ score, time, onRestart }) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  
  return (
    <g>
      <rect x={0} y={0} width={GAME_WIDTH} height={GAME_HEIGHT} fill="rgba(10, 5, 16, 0.9)" />
      
      {/* Victory particles */}
      {Array.from({ length: 20 }, (_, i) => (
        <circle
          key={i}
          cx={GAME_WIDTH / 2}
          cy={GAME_HEIGHT / 2}
          r={3}
          fill="#ffcc00"
        >
          <animate
            attributeName="cx"
            values={`${GAME_WIDTH / 2};${100 + Math.random() * (GAME_WIDTH - 200)}`}
            dur={`${1 + Math.random()}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values={`${GAME_HEIGHT / 2};${100 + Math.random() * (GAME_HEIGHT - 200)}`}
            dur={`${1 + Math.random()}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0"
            dur={`${1 + Math.random()}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
      
      <text 
        x={GAME_WIDTH / 2} 
        y={150} 
        fill="#ffcc00" 
        fontSize="64" 
        fontFamily="Georgia" 
        fontWeight="bold" 
        textAnchor="middle"
      >
        VICTORY!
      </text>
      
      <text 
        x={GAME_WIDTH / 2} 
        y={220} 
        fill="#aa88cc" 
        fontSize="24" 
        fontFamily="Georgia" 
        fontStyle="italic" 
        textAnchor="middle"
      >
        The Phantom King has been vanquished!
      </text>
      
      <text 
        x={GAME_WIDTH / 2} 
        y={320} 
        fill="#888" 
        fontSize="20" 
        fontFamily="Georgia" 
        textAnchor="middle"
      >
        Final Score
      </text>
      <text 
        x={GAME_WIDTH / 2} 
        y={360} 
        fill="#ffcc00" 
        fontSize="48" 
        fontFamily="Georgia" 
        fontWeight="bold" 
        textAnchor="middle"
      >
        {score.toLocaleString()}
      </text>
      
      <text 
        x={GAME_WIDTH / 2} 
        y={420} 
        fill="#888" 
        fontSize="20" 
        fontFamily="Georgia" 
        textAnchor="middle"
      >
        Time: {minutes}:{seconds.toString().padStart(2, '0')}
      </text>
      
      <text 
        x={GAME_WIDTH / 2} 
        y={540} 
        fill="#ffffff" 
        fontSize="24" 
        fontFamily="Georgia" 
        textAnchor="middle"
        style={{ cursor: 'pointer' }}
      >
        <animate
          attributeName="opacity"
          values="1;0.5;1"
          dur="2s"
          repeatCount="indefinite"
        />
        Click to Play Again
      </text>
    </g>
  );
}

export function ZoneTransition({ zoneName, opacity }) {
  if (opacity <= 0) return null;
  
  return (
    <g opacity={opacity}>
      <rect 
        x={GAME_WIDTH / 2 - 200} 
        y={GAME_HEIGHT / 2 - 40} 
        width={400} 
        height={80} 
        fill="rgba(0, 0, 0, 0.7)" 
        rx={10}
      />
      <text 
        x={GAME_WIDTH / 2} 
        y={GAME_HEIGHT / 2 + 10} 
        fill="#ffffff" 
        fontSize="32" 
        fontFamily="Georgia" 
        textAnchor="middle"
      >
        {zoneName}
      </text>
    </g>
  );
}

export default React.memo(HUD);
