import React from 'react';
import { PLAYER_WIDTH, PLAYER_HEIGHT } from '../constants/gameConstants';

function Player({ player }) {
  const {
    x, y, facingRight, isJumping, isDashing, isWallSliding, invincible, animationFrame, velocityX,
    scaleX: playerScaleX = 1, scaleY: playerScaleY = 1, bodyTilt = 0, capeOffset = 0
  } = player;

  // Check if actually moving horizontally
  const isMoving = Math.abs(velocityX || 0) > 0.5;

  // Determine animation state for visual effects
  const cloakWave = capeOffset + Math.sin(animationFrame * 0.15) * 2; // Use cape physics
  const breathe = Math.sin(animationFrame * 0.1) * 1;

  // Flash when invincible
  const opacity = invincible ? (Math.floor(animationFrame / 3) % 2 === 0 ? 0.5 : 1) : 1;

  // Scale direction (horizontal flip for facing) * squash/stretch
  const finalScaleX = (facingRight ? 1 : -1) * playerScaleX;
  const finalScaleY = playerScaleY;
  const wallSlideScaleX = facingRight ? 1 : -1; // For wall slide particles

  return (
    <g
      transform={`
        translate(${x + PLAYER_WIDTH/2}, ${y + PLAYER_HEIGHT/2})
        scale(${finalScaleX}, ${finalScaleY})
        rotate(${bodyTilt})
      `}
      opacity={opacity}
    >
      {/* Cloak shadow/depth */}
      <ellipse
        cx={0}
        cy={PLAYER_HEIGHT/2 - 5}
        rx={PLAYER_WIDTH/2 + 5}
        ry={5}
        fill="rgba(0,0,0,0.3)"
      />
      
      {/* Cloak body */}
      <path
        d={`
          M ${-PLAYER_WIDTH/2 + 5} ${-PLAYER_HEIGHT/2 + 15}
          Q ${-PLAYER_WIDTH/2 - 5 + cloakWave} ${PLAYER_HEIGHT/4}
          ${-PLAYER_WIDTH/2 + 3} ${PLAYER_HEIGHT/2 - 5}
          L ${PLAYER_WIDTH/2 - 3} ${PLAYER_HEIGHT/2 - 5}
          Q ${PLAYER_WIDTH/2 + 5 - cloakWave} ${PLAYER_HEIGHT/4}
          ${PLAYER_WIDTH/2 - 5} ${-PLAYER_HEIGHT/2 + 15}
          Q ${0} ${-PLAYER_HEIGHT/2 + 20}
          ${-PLAYER_WIDTH/2 + 5} ${-PLAYER_HEIGHT/2 + 15}
        `}
        fill="#4a2d6a"
        stroke="#2d1a4a"
        strokeWidth="2"
      />
      
      {/* Cloak inner shadow */}
      <path
        d={`
          M ${-PLAYER_WIDTH/4} ${-PLAYER_HEIGHT/2 + 20}
          Q ${0} ${0}
          ${-PLAYER_WIDTH/4} ${PLAYER_HEIGHT/2 - 10}
          L ${PLAYER_WIDTH/4} ${PLAYER_HEIGHT/2 - 10}
          Q ${0} ${0}
          ${PLAYER_WIDTH/4} ${-PLAYER_HEIGHT/2 + 20}
        `}
        fill="#2d1a4a"
        opacity="0.5"
      />
      
      {/* Hood */}
      <ellipse
        cx={0}
        cy={-PLAYER_HEIGHT/2 + 12 + breathe}
        rx={PLAYER_WIDTH/2 - 5}
        ry={15}
        fill="#3d2255"
        stroke="#2d1a4a"
        strokeWidth="1"
      />
      
      {/* Face shadow (inside hood) */}
      <ellipse
        cx={2}
        cy={-PLAYER_HEIGHT/2 + 14 + breathe}
        rx={PLAYER_WIDTH/3}
        ry={10}
        fill="#1a0a2a"
      />
      
      {/* Glowing eye */}
      <ellipse
        cx={8}
        cy={-PLAYER_HEIGHT/2 + 12 + breathe}
        rx={4}
        ry={3}
        fill="#ffcc00"
      >
        <animate
          attributeName="opacity"
          values="0.8;1;0.8"
          dur="2s"
          repeatCount="indefinite"
        />
      </ellipse>
      
      {/* Eye glow */}
      <ellipse
        cx={8}
        cy={-PLAYER_HEIGHT/2 + 12 + breathe}
        rx={6}
        ry={4}
        fill="#ffcc00"
        opacity="0.3"
      />
      
      {/* Body under cloak hint */}
      <rect
        x={-PLAYER_WIDTH/4}
        y={-PLAYER_HEIGHT/4}
        width={PLAYER_WIDTH/2}
        height={PLAYER_HEIGHT/3}
        fill="#1a1a2a"
        rx={3}
      />
      
      {/* Legs (animate only when moving on ground) */}
      {!isWallSliding && (
        <>
          <rect
            x={-PLAYER_WIDTH/4}
            y={PLAYER_HEIGHT/4}
            width={8}
            height={PLAYER_HEIGHT/4 - 5}
            fill="#1a1a2a"
            rx={2}
            transform={isJumping ? 'rotate(-20)' : (isMoving ? `rotate(${Math.sin(animationFrame * 0.3) * 20})` : 'rotate(0)')}
          />
          <rect
            x={PLAYER_WIDTH/4 - 8}
            y={PLAYER_HEIGHT/4}
            width={8}
            height={PLAYER_HEIGHT/4 - 5}
            fill="#1a1a2a"
            rx={2}
            transform={isJumping ? 'rotate(20)' : (isMoving ? `rotate(${Math.sin(animationFrame * 0.3 + Math.PI) * 20})` : 'rotate(0)')}
          />
        </>
      )}
      
      {/* Dash effect */}
      {isDashing && (
        <>
          <rect
            x={-PLAYER_WIDTH * 1.5}
            y={-PLAYER_HEIGHT/4}
            width={PLAYER_WIDTH}
            height={PLAYER_HEIGHT/2}
            fill="url(#dashGradient)"
            opacity="0.6"
          />
        </>
      )}
      
      {/* Wall slide effect */}
      {isWallSliding && (
        <g>
          {[0, 1, 2].map(i => (
            <circle
              key={i}
              cx={scaleX * 15}
              cy={-10 + i * 15}
              r={2}
              fill="#aaa"
              opacity={0.5 - i * 0.15}
            />
          ))}
        </g>
      )}
    </g>
  );
}

export default React.memo(Player);
