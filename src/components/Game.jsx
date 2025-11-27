import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useKeyboard, useMouse, useGameLoop } from '../hooks/useInput';
import { getAllPlatforms } from '../utils/levelGenerator';
import { getAllEnemies, updateEnemy } from '../utils/enemyManager';
import { checkRectCollision, checkCircleRectCollision, normalizeVector, clamp } from '../utils/collision';
import { audioManager } from '../audio/audioManager';
import {
  GAME_WIDTH, GAME_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT,
  PLAYER_SPEED, PLAYER_JUMP_FORCE, PLAYER_MAX_HEALTH, GRAVITY, MAX_FALL_SPEED,
  DASH_SPEED, DASH_DURATION, DASH_COOLDOWN, WALL_SLIDE_SPEED,
  WALL_JUMP_FORCE_X, WALL_JUMP_FORCE_Y, INVINCIBILITY_FRAMES,
  BOOMERANG_SPEED, BOOMERANG_MAX_DISTANCE, BOOMERANG_RETURN_SPEED,
  BOOMERANG_SIZE, BOOMERANG_DAMAGE, BOOMERANG_CHARGE_TIME,
  BOOMERANG_CHARGED_DAMAGE, BOOMERANG_CHARGED_SPEED,
  ZONE_WIDTH, TOTAL_ZONES, ZONE_NAMES, COMBO_TIMEOUT, COMBO_MULTIPLIERS,
  PHANTOM_KING, POWERUP_TYPES, POWERUP_DROP_RATE, POWERUP_LIFETIME
} from '../constants/gameConstants';

import Player from './Player';
import Boomerang from './Boomerang';
import Enemy from './Enemy';
import Platform from './Platform';
import Background from './Background';
import PhantomKing, { BossProjectile } from './PhantomKing';
import Powerup from './Powerup';
import Particles, {
  createHitParticles, createDeathParticles, createScoreParticle,
  createAmbientParticles, updateParticle,
  createFootstepParticles, createJumpParticles, createLandingParticles,
  createDashBurstParticles, createDashTrailParticle, createBoomerangTrailParticle
} from './Particles';
import HUD, { TitleScreen, GameOverScreen, VictoryScreen, ZoneTransition } from './HUD';

const initialPlayerState = () => ({
  x: 100,
  y: 400,
  velocityX: 0,
  velocityY: 0,
  health: PLAYER_MAX_HEALTH,
  magic: 50,
  facingRight: true,
  isJumping: false,
  isGrounded: false,
  isDashing: false,
  dashTimer: 0,
  dashCooldown: 0,
  isWallSliding: false,
  wallDirection: 0,
  canDoubleJump: true,
  invincible: 0,
  animationFrame: 0,
  jumpLevel: 1, // 1 = normal, 2-4 = multi-jump levels
  jumpsRemaining: 1,
  speedBoost: 0, // Speed powerup timer
  jumpEffectIntensity: 0, // Visual effect for multi-jump
  // Input feel properties
  accelerationProgress: 0, // 0-1, for smooth acceleration
  decelerationProgress: 0, // 0-1, for smooth deceleration
  coyoteTimer: 0, // Frames of jump grace after leaving platform
  jumpBufferTimer: 0, // Frames to remember jump input
  wasGrounded: false, // Track landing moment
  landingSquash: 0, // 0-1, squash animation intensity
  jumpHoldTime: 0, // Track how long jump is held for variable height
  jumpAnticipation: 0, // Frames of anticipation crouch before jump
  // Cape physics
  capeOffset: 0, // Cape position offset
  capeVelocity: 0, // Cape physics velocity
  // Body transform for animations
  bodyTilt: 0, // Body rotation during movement
  scaleX: 1, // Horizontal scale (for squash/stretch)
  scaleY: 1, // Vertical scale (for squash/stretch)
  footstepCounter: 0 // For particle timing
});

const initialScreenState = () => ({
  trauma: 0, // 0-1, camera shake intensity
  flashIntensity: 0, // 0-1, screen flash intensity
  flashColor: '#ffffff', // Color of screen flash
  hitStopFrames: 0, // Frames to freeze gameplay
  slowMotion: 1 // Time scale multiplier (1 = normal, <1 = slow)
});

const initialBoomerangState = () => ({
  x: 0,
  y: 0,
  velocityX: 0,
  velocityY: 0,
  active: false,
  returning: false,
  startX: 0,
  startY: 0,
  isCharging: false,
  chargeLevel: 0,
  charged: false,
  rotation: 0
});

const initialBossState = () => ({
  x: TOTAL_ZONES * ZONE_WIDTH + 500,
  y: 200,
  health: PHANTOM_KING.maxHealth,
  active: false,
  phase: 0,
  attackState: 'idle',
  attackTimer: 0,
  currentAttack: null,
  direction: -1,
  hitFlash: 0,
  projectiles: []
});

function Game() {
  const [gameState, setGameState] = useState('title'); // title, playing, gameover, victory
  const [player, setPlayer] = useState(initialPlayerState);
  const [boomerang, setBoomerang] = useState(initialBoomerangState);
  const [enemies, setEnemies] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [particles, setParticles] = useState([]);
  const [powerups, setPowerups] = useState([]);
  const [boss, setBoss] = useState(initialBossState);
  const [screenEffects, setScreenEffects] = useState(initialScreenState);
  const [cameraX, setCameraX] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [comboTimer, setComboTimer] = useState(0);
  const [currentZone, setCurrentZone] = useState(0);
  const [zoneTransition, setZoneTransition] = useState({ active: false, name: '', opacity: 0 });
  const [gameTime, setGameTime] = useState(0);
  const [audioInitialized, setAudioInitialized] = useState(false);
  
  const keysRef = useKeyboard();
  const { mousePos, mouseDown } = useMouse();
  const frameCountRef = useRef(0);
  
  // Initialize game
  const initGame = useCallback(async () => {
    if (!audioInitialized) {
      await audioManager.initialize();
      setAudioInitialized(true);
    }
    
    setPlatforms(getAllPlatforms());
    setEnemies(getAllEnemies());
    setPlayer(initialPlayerState());
    setBoomerang(initialBoomerangState());
    setBoss(initialBossState());
    setParticles([]);
    setPowerups([]);
    setScore(0);
    setCombo(0);
    setComboTimer(0);
    setCameraX(0);
    setCurrentZone(0);
    setGameTime(0);
    setGameState('playing');
    
    audioManager.startMusic(0);
  }, [audioInitialized]);
  
  // Handle click to start/restart
  const handleClick = useCallback(() => {
    if (gameState === 'title' || gameState === 'gameover' || gameState === 'victory') {
      initGame();
    }
  }, [gameState, initGame]);
  
  // Main game loop
  const gameLoop = useCallback((deltaTime) => {
    if (gameState !== 'playing') return;

    frameCountRef.current++;
    let delta = deltaTime / 16.67; // Normalize to ~60fps

    // Apply slow motion effect
    delta *= screenEffects.slowMotion;

    // Update game time
    if (frameCountRef.current % 60 === 0) {
      setGameTime(t => t + 1);
    }

    // Skip game updates during hit stop (freeze frame effect)
    // Screen effects will still update at the end of the loop
    if (screenEffects.hitStopFrames > 0) {
      // Only update screen effects during hit stop
      setScreenEffects(prev => ({
        ...prev,
        hitStopFrames: prev.hitStopFrames - 1
      }));
      return;
    }

    const keys = keysRef.current;
    const mouse = mousePos.current;
    const isMouseDown = mouseDown.current;

    setPlayer(prevPlayer => {
      let newPlayer = { ...prevPlayer };
      newPlayer.animationFrame++;
      
      // Horizontal movement with acceleration/deceleration
      let moveX = 0;
      if (keys['a'] || keys['arrowleft']) moveX -= 1;
      if (keys['d'] || keys['arrowright']) moveX += 1;

      if (!newPlayer.isDashing) {
        const speedMultiplier = newPlayer.speedBoost > 0 ? 1.5 : 1;
        const targetSpeed = moveX * PLAYER_SPEED * speedMultiplier;

        // Acceleration/deceleration curves
        if (moveX !== 0) {
          // Accelerating
          newPlayer.accelerationProgress = Math.min(1, newPlayer.accelerationProgress + 0.1);
          newPlayer.decelerationProgress = 0;
          newPlayer.facingRight = moveX > 0;
        } else {
          // Decelerating
          newPlayer.decelerationProgress = Math.min(1, newPlayer.decelerationProgress + 0.125);
          newPlayer.accelerationProgress = Math.max(0, newPlayer.accelerationProgress - 0.1);
        }

        // Easing functions
        const easeOut = (t) => 1 - Math.pow(1 - t, 3);
        const speedFactor = moveX !== 0
          ? easeOut(newPlayer.accelerationProgress)
          : (1 - easeOut(newPlayer.decelerationProgress));

        newPlayer.velocityX = targetSpeed * speedFactor;

        // Body tilt based on velocity (lean into movement)
        newPlayer.bodyTilt = (newPlayer.velocityX / PLAYER_SPEED) * 5;
      }

      // Decrease speed boost timer
      if (newPlayer.speedBoost > 0) {
        newPlayer.speedBoost--;
      }

      // Footstep particles when moving on ground
      if (newPlayer.isGrounded && Math.abs(newPlayer.velocityX) > 2 && !newPlayer.isDashing) {
        newPlayer.footstepCounter++;
        if (newPlayer.footstepCounter >= 10) { // Emit footstep every 10 frames
          newPlayer.footstepCounter = 0;
          const footsteps = createFootstepParticles(
            newPlayer.x + PLAYER_WIDTH / 2,
            newPlayer.y + PLAYER_HEIGHT,
            newPlayer.facingRight
          );
          setParticles(p => [...p, ...footsteps]);
        }
      } else {
        newPlayer.footstepCounter = 0;
      }

      // Dash
      if ((keys['shift'] || keys['shiftleft']) && newPlayer.dashCooldown <= 0 && !newPlayer.isDashing) {
        newPlayer.isDashing = true;
        newPlayer.dashTimer = DASH_DURATION;
        newPlayer.velocityX = (newPlayer.facingRight ? 1 : -1) * DASH_SPEED;
        newPlayer.invincible = Math.max(newPlayer.invincible, DASH_DURATION);
        audioManager.playDash();
        // Add dash burst particles
        const burstParticles = createDashBurstParticles(
          newPlayer.x + PLAYER_WIDTH / 2,
          newPlayer.y + PLAYER_HEIGHT / 2,
          newPlayer.facingRight
        );
        setParticles(p => [...p, ...burstParticles]);
      }

      if (newPlayer.isDashing) {
        newPlayer.dashTimer--;
        // Add dash trail particles every few frames
        if (newPlayer.dashTimer % 2 === 0) {
          const trailParticle = createDashTrailParticle(
            newPlayer.x + PLAYER_WIDTH / 2,
            newPlayer.y + PLAYER_HEIGHT / 2
          );
          setParticles(p => [...p, trailParticle]);
        }
        if (newPlayer.dashTimer <= 0) {
          newPlayer.isDashing = false;
          newPlayer.dashCooldown = DASH_COOLDOWN;
        }
      }
      
      if (newPlayer.dashCooldown > 0) newPlayer.dashCooldown--;
      if (newPlayer.invincible > 0) newPlayer.invincible--;
      
      // Update coyote timer
      if (newPlayer.isGrounded) {
        newPlayer.coyoteTimer = 6;
      } else if (newPlayer.coyoteTimer > 0) {
        newPlayer.coyoteTimer--;
      }

      // Update jump buffer timer
      if (newPlayer.jumpBufferTimer > 0) {
        newPlayer.jumpBufferTimer--;
      }

      // Jump (Z key, W, Space, or ArrowUp)
      const jumpPressed = keys['z'] || keys[' '] || keys['w'] || keys['arrowup'];

      // Buffer jump input
      if (jumpPressed && !keys['_jumpHeld']) {
        keys['_jumpHeld'] = true;
        newPlayer.jumpBufferTimer = 8; // Queue jump for 8 frames
      }

      // Execute jump if buffered or just pressed
      if (newPlayer.jumpBufferTimer > 0 && !newPlayer.isJumping) {
        // Can jump if grounded OR within coyote time
        if (newPlayer.isGrounded || newPlayer.coyoteTimer > 0) {
          // Start anticipation crouch (ground jump only)
          if (newPlayer.jumpAnticipation === 0) {
            newPlayer.jumpAnticipation = 4; // 4 frames of anticipation
            newPlayer.jumpBufferTimer = 0; // Consume buffer
          }
        } else if (newPlayer.isWallSliding) {
          // Wall jump - instant, no anticipation
          newPlayer.velocityY = -WALL_JUMP_FORCE_Y;
          newPlayer.velocityX = -newPlayer.wallDirection * WALL_JUMP_FORCE_X;
          newPlayer.facingRight = newPlayer.wallDirection < 0;
          newPlayer.isWallSliding = false;
          newPlayer.jumpsRemaining = newPlayer.jumpLevel;
          newPlayer.canDoubleJump = true;
          newPlayer.jumpBufferTimer = 0;
          newPlayer.jumpHoldTime = 0;
          audioManager.playJump();
        } else if (newPlayer.jumpsRemaining > 0) {
          // Multi-jump in air - instant, no anticipation
          newPlayer.velocityY = -PLAYER_JUMP_FORCE * 0.85;
          newPlayer.jumpsRemaining--;
          newPlayer.jumpBufferTimer = 0;
          newPlayer.jumpHoldTime = 0;
          audioManager.playJump();
        }
      }

      // Process jump anticipation
      if (newPlayer.jumpAnticipation > 0) {
        newPlayer.jumpAnticipation--;
        if (newPlayer.jumpAnticipation === 0) {
          // Execute the jump after anticipation
          newPlayer.velocityY = -PLAYER_JUMP_FORCE * 1.05; // Slight boost for satisfying feel
          newPlayer.isJumping = true;
          newPlayer.isGrounded = false;
          newPlayer.jumpsRemaining = newPlayer.jumpLevel - 1;
          newPlayer.coyoteTimer = 0; // Consume coyote time
          newPlayer.jumpHoldTime = 0; // Start tracking hold time
          audioManager.playJump();
          // Add jump particles
          const jumpParticles = createJumpParticles(
            newPlayer.x + PLAYER_WIDTH / 2,
            newPlayer.y + PLAYER_HEIGHT,
            newPlayer.facingRight
          );
          setParticles(p => [...p, ...jumpParticles]);
        }
      }

      // Variable jump height: reduce upward velocity if jump released early
      if (jumpPressed && newPlayer.isJumping && newPlayer.velocityY < 0) {
        newPlayer.jumpHoldTime++;
      } else if (!jumpPressed && newPlayer.isJumping && newPlayer.velocityY < 0 && newPlayer.jumpHoldTime < 10) {
        // Released early - cut jump short
        newPlayer.velocityY *= 0.5;
      }

      if (!jumpPressed) {
        keys['_jumpHeld'] = false;
      }
      
      // Apply gravity
      if (!newPlayer.isDashing) {
        newPlayer.velocityY += GRAVITY * delta;
        if (newPlayer.velocityY > MAX_FALL_SPEED) {
          newPlayer.velocityY = MAX_FALL_SPEED;
        }
      }
      
      // Wall slide
      newPlayer.isWallSliding = false;
      if (!newPlayer.isGrounded && newPlayer.velocityY > 0) {
        platforms.forEach(platform => {
          if (platform.type === 'wall') {
            // Check left side of player against right side of wall
            if (newPlayer.x <= platform.x + platform.width &&
                newPlayer.x >= platform.x + platform.width - 5 &&
                newPlayer.y + PLAYER_HEIGHT > platform.y &&
                newPlayer.y < platform.y + platform.height) {
              if (moveX < 0) {
                newPlayer.isWallSliding = true;
                newPlayer.wallDirection = -1;
                newPlayer.velocityY = Math.min(newPlayer.velocityY, WALL_SLIDE_SPEED);
                newPlayer.canDoubleJump = true;
              }
            }
            // Check right side of player against left side of wall
            if (newPlayer.x + PLAYER_WIDTH >= platform.x &&
                newPlayer.x + PLAYER_WIDTH <= platform.x + 5 &&
                newPlayer.y + PLAYER_HEIGHT > platform.y &&
                newPlayer.y < platform.y + platform.height) {
              if (moveX > 0) {
                newPlayer.isWallSliding = true;
                newPlayer.wallDirection = 1;
                newPlayer.velocityY = Math.min(newPlayer.velocityY, WALL_SLIDE_SPEED);
                newPlayer.canDoubleJump = true;
              }
            }
          }
        });
      }

      // Wall slide particles
      if (newPlayer.isWallSliding && newPlayer.animationFrame % 3 === 0) {
        const wallX = newPlayer.wallDirection === 1
          ? newPlayer.x + PLAYER_WIDTH
          : newPlayer.x;
        const wallParticles = createFootstepParticles(
          wallX,
          newPlayer.y + PLAYER_HEIGHT / 2 + Math.random() * 20,
          newPlayer.wallDirection === 1
        );
        setParticles(p => [...p, ...wallParticles]);
      }
      
      // Apply velocity
      newPlayer.x += newPlayer.velocityX * delta;
      newPlayer.y += newPlayer.velocityY * delta;
      
      // Platform collision
      newPlayer.isGrounded = false;
      platforms.forEach(platform => {
        if (platform.type === 'hazard') {
          // Lava damage
          if (checkRectCollision(
            { x: newPlayer.x, y: newPlayer.y, width: PLAYER_WIDTH, height: PLAYER_HEIGHT },
            platform
          ) && newPlayer.invincible <= 0) {
            newPlayer.health -= 20;
            newPlayer.invincible = INVINCIBILITY_FRAMES;
            newPlayer.velocityY = -10;
            audioManager.playPlayerHit();
            setScreenEffects(se => ({
              ...se,
              trauma: Math.min(1, se.trauma + 0.4),
              flashIntensity: 0.5,
              flashColor: '#ff5500'
            }));
          }
          return;
        }
        
        if (platform.type === 'wall') {
          // Horizontal collision
          if (newPlayer.y + PLAYER_HEIGHT > platform.y &&
              newPlayer.y < platform.y + platform.height) {
            if (newPlayer.x + PLAYER_WIDTH > platform.x &&
                newPlayer.x < platform.x + platform.width) {
              // Push out
              if (newPlayer.velocityX > 0) {
                newPlayer.x = platform.x - PLAYER_WIDTH;
              } else if (newPlayer.velocityX < 0) {
                newPlayer.x = platform.x + platform.width;
              }
              newPlayer.velocityX = 0;
            }
          }
          return;
        }
        
        // Ground collision (top of platform)
        if (newPlayer.velocityY >= 0 &&
            newPlayer.x + PLAYER_WIDTH > platform.x &&
            newPlayer.x < platform.x + platform.width &&
            newPlayer.y + PLAYER_HEIGHT >= platform.y &&
            newPlayer.y + PLAYER_HEIGHT <= platform.y + platform.height + 10) {
          newPlayer.y = platform.y - PLAYER_HEIGHT;
          newPlayer.velocityY = 0;
          newPlayer.isGrounded = true;
          newPlayer.isJumping = false;
          newPlayer.canDoubleJump = true;
          newPlayer.jumpsRemaining = newPlayer.jumpLevel; // Reset jumps when landing
        }
      });
      
      // Keep in bounds
      newPlayer.x = Math.max(0, newPlayer.x);
      if (newPlayer.y > GAME_HEIGHT) {
        newPlayer.health -= 50;
        newPlayer.y = 100;
        newPlayer.velocityY = 0;
        newPlayer.invincible = INVINCIBILITY_FRAMES;
        audioManager.playPlayerHit();
        setScreenEffects(se => ({
          ...se,
          trauma: Math.min(1, se.trauma + 0.6),
          flashIntensity: 0.7,
          flashColor: '#ff0000'
        }));
      }

      // Detect landing moment for squash animation
      if (newPlayer.isGrounded && !newPlayer.wasGrounded) {
        newPlayer.landingSquash = 1; // Start squash animation
        // Add landing particles based on fall speed
        const fallIntensity = Math.min(Math.abs(newPlayer.velocityY) / 15, 2);
        const landParticles = createLandingParticles(
          newPlayer.x + PLAYER_WIDTH / 2,
          newPlayer.y + PLAYER_HEIGHT,
          fallIntensity
        );
        setParticles(p => [...p, ...landParticles]);
        // Add screen shake based on fall intensity
        if (fallIntensity > 0.5) {
          setScreenEffects(se => ({
            ...se,
            trauma: Math.min(1, se.trauma + fallIntensity * 0.15)
          }));
        }
      }
      newPlayer.wasGrounded = newPlayer.isGrounded;

      // Decay landing squash over time
      if (newPlayer.landingSquash > 0) {
        newPlayer.landingSquash = Math.max(0, newPlayer.landingSquash - 0.08);
      }

      // Calculate squash/stretch based on state
      // Jump anticipation crouch (highest priority for ground jumps)
      if (newPlayer.jumpAnticipation > 0) {
        const anticipationProgress = newPlayer.jumpAnticipation / 4; // 0-1 where 1 is start
        const squashAmount = anticipationProgress * 0.25; // Deep crouch
        newPlayer.scaleY = 1 - squashAmount;
        newPlayer.scaleX = 1 + squashAmount * 0.5;
      }
      // Landing squash
      else if (newPlayer.landingSquash > 0) {
        const squashAmount = newPlayer.landingSquash * 0.2;
        newPlayer.scaleY = 1 - squashAmount;
        newPlayer.scaleX = 1 + squashAmount * 0.6;
      }
      // Dash stretch
      else if (newPlayer.isDashing) {
        newPlayer.scaleX = 1.25;
        newPlayer.scaleY = 0.85;
      }
      // Falling stretch
      else if (newPlayer.velocityY > 8) {
        const fallStretch = Math.min((newPlayer.velocityY - 8) / 12, 0.15);
        newPlayer.scaleY = 1 + fallStretch;
        newPlayer.scaleX = 1 - fallStretch * 0.3;
      }
      // Return to normal
      else {
        newPlayer.scaleX = 1;
        newPlayer.scaleY = 1;
      }

      // Update cape physics (spring system)
      const targetCapeOffset = -newPlayer.velocityX * 2; // Cape streams opposite to movement
      const capeSpring = 0.15;
      const capeDamping = 0.85;
      newPlayer.capeVelocity += (targetCapeOffset - newPlayer.capeOffset) * capeSpring;
      newPlayer.capeVelocity *= capeDamping;
      newPlayer.capeOffset += newPlayer.capeVelocity;

      return newPlayer;
    });
    
    // Boomerang logic
    setBoomerang(prevBoom => {
      let newBoom = { ...prevBoom };
      
      // Charging
      if (isMouseDown && !newBoom.active) {
        if (!newBoom.isCharging) {
          newBoom.isCharging = true;
          newBoom.chargeLevel = 0;
        } else {
          newBoom.chargeLevel = Math.min(1, newBoom.chargeLevel + 1 / BOOMERANG_CHARGE_TIME);
        }
      }
      
      // Release / Throw
      if (!isMouseDown && newBoom.isCharging) {
        const playerCenterX = player.x + PLAYER_WIDTH / 2;
        const playerCenterY = player.y + PLAYER_HEIGHT / 2;
        const dx = mouse.x + cameraX - playerCenterX;
        const dy = mouse.y - playerCenterY;
        const norm = normalizeVector(dx, dy);
        
        const isCharged = newBoom.chargeLevel >= 0.8;
        const speed = isCharged ? BOOMERANG_CHARGED_SPEED : BOOMERANG_SPEED;
        
        newBoom.active = true;
        newBoom.returning = false;
        newBoom.x = playerCenterX;
        newBoom.y = playerCenterY;
        newBoom.startX = playerCenterX;
        newBoom.startY = playerCenterY;
        newBoom.velocityX = norm.x * speed;
        newBoom.velocityY = norm.y * speed;
        newBoom.isCharging = false;
        newBoom.charged = isCharged;
        newBoom.rotation = 0;
        
        audioManager.playThrow();
      }
      
      // Update active boomerang
      if (newBoom.active) {
        newBoom.rotation += 25;
        
        if (newBoom.returning) {
          // Return to player
          const playerCenterX = player.x + PLAYER_WIDTH / 2;
          const playerCenterY = player.y + PLAYER_HEIGHT / 2;
          const dx = playerCenterX - newBoom.x;
          const dy = playerCenterY - newBoom.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 30) {
            newBoom.active = false;
            audioManager.playCatch();
          } else {
            const norm = normalizeVector(dx, dy);
            newBoom.velocityX = norm.x * BOOMERANG_RETURN_SPEED;
            newBoom.velocityY = norm.y * BOOMERANG_RETURN_SPEED;
          }
        } else {
          // Check max distance
          const travelDist = Math.sqrt(
            Math.pow(newBoom.x - newBoom.startX, 2) +
            Math.pow(newBoom.y - newBoom.startY, 2)
          );
          if (travelDist >= BOOMERANG_MAX_DISTANCE) {
            newBoom.returning = true;
          }
          
          // Wall collision
          platforms.forEach(platform => {
            if (platform.type === 'wall' || platform.type === 'ground' || platform.type === 'arena') {
              if (checkCircleRectCollision(
                { x: newBoom.x, y: newBoom.y, radius: BOOMERANG_SIZE / 2 },
                platform
              )) {
                newBoom.returning = true;
              }
            }
          });
        }
        
        newBoom.x += newBoom.velocityX * delta;
        newBoom.y += newBoom.velocityY * delta;

        // Add boomerang trail particles
        const trailColor = newBoom.charged ? '#ff5500' : '#ffaa00';
        const trail = createBoomerangTrailParticle(newBoom.x, newBoom.y, trailColor);
        setParticles(p => [...p, trail]);
      }

      return newBoom;
    });
    
    // Enemy updates and collision
    setEnemies(prevEnemies => {
      return prevEnemies.map(enemy => {
        if (enemy.dead) return enemy;
        
        let newEnemy = { ...enemy };
        updateEnemy(newEnemy, player, platforms, deltaTime);
        
        // Boomerang hit
        if (boomerang.active) {
          if (checkCircleRectCollision(
            { x: boomerang.x, y: boomerang.y, radius: BOOMERANG_SIZE / 2 },
            { x: newEnemy.x, y: newEnemy.y, width: newEnemy.width, height: newEnemy.height }
          )) {
            const damage = boomerang.charged ? BOOMERANG_CHARGED_DAMAGE : BOOMERANG_DAMAGE;
            newEnemy.health -= damage;
            newEnemy.hitFlash = 10;

            // Create hit particles
            const hitParticles = createHitParticles(
              newEnemy.x + newEnemy.width / 2,
              newEnemy.y + newEnemy.height / 2,
              newEnemy.color
            );
            setParticles(p => [...p, ...hitParticles]);

            audioManager.playHit();

            if (newEnemy.health <= 0) {
              newEnemy.dead = true;
              // Stronger hit stop for killing blow
              setScreenEffects(se => ({
                ...se,
                hitStopFrames: boomerang.charged ? 6 : 4,
                trauma: Math.min(1, se.trauma + 0.25)
              }));

              // Death particles
              const deathParticles = createDeathParticles(
                newEnemy.x + newEnemy.width / 2,
                newEnemy.y + newEnemy.height / 2,
                newEnemy.color
              );

              // Score
              const comboMult = COMBO_MULTIPLIERS[Math.min(combo, COMBO_MULTIPLIERS.length - 1)];
              const earnedScore = Math.floor(newEnemy.score * comboMult);
              const scoreParticle = createScoreParticle(
                newEnemy.x + newEnemy.width / 2,
                newEnemy.y,
                earnedScore,
                combo
              );

              setParticles(p => [...p, ...deathParticles, scoreParticle]);
              setScore(s => s + earnedScore);
              setCombo(c => c + 1);
              setComboTimer(COMBO_TIMEOUT);

              // Powerup drop chance
              if (Math.random() < POWERUP_DROP_RATE) {
                const powerupTypes = ['HEALTH', 'MAGIC', 'SPEED', 'JUMP'];
                const randomType = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];

                setPowerups(p => [...p, {
                  id: Date.now() + Math.random(),
                  type: randomType,
                  x: newEnemy.x + newEnemy.width / 2,
                  y: newEnemy.y + newEnemy.height / 2,
                  lifetime: POWERUP_LIFETIME
                }]);
              }

              audioManager.playEnemyDeath();
            } else {
              // Light hit stop for normal hits
              setScreenEffects(se => ({
                ...se,
                hitStopFrames: boomerang.charged ? 3 : 2,
                trauma: Math.min(1, se.trauma + 0.1)
              }));
            }
            
            // Boomerang bounces back on hit
            setBoomerang(b => ({ ...b, returning: true }));
          }
        }
        
        // Player collision (damage)
        if (!newEnemy.dead && player.invincible <= 0) {
          if (checkRectCollision(
            { x: player.x, y: player.y, width: PLAYER_WIDTH, height: PLAYER_HEIGHT },
            { x: newEnemy.x, y: newEnemy.y, width: newEnemy.width, height: newEnemy.height }
          )) {
            setPlayer(p => {
              let updatedPlayer = {
                ...p,
                health: p.health - newEnemy.damage,
                invincible: INVINCIBILITY_FRAMES,
                velocityY: -8
              };

              // Lose one level of each powerup when hit
              if (updatedPlayer.jumpLevel > 1) {
                updatedPlayer.jumpLevel--;
                updatedPlayer.jumpsRemaining = Math.min(updatedPlayer.jumpsRemaining, updatedPlayer.jumpLevel);
                updatedPlayer.jumpEffectIntensity = updatedPlayer.jumpLevel;
              }

              if (updatedPlayer.speedBoost > 0) {
                updatedPlayer.speedBoost = Math.max(0, updatedPlayer.speedBoost - 60); // Reduce by 1 second
              }

              return updatedPlayer;
            });
            audioManager.playPlayerHit();
            setScreenEffects(se => ({
              ...se,
              trauma: Math.min(1, se.trauma + 0.35),
              flashIntensity: 0.4,
              flashColor: '#ff3333'
            }));
          }
        }
        
        return newEnemy;
      }).filter(e => !e.dead);
    });
    
    // Boss logic
    if (boss.active) {
      setBoss(prevBoss => {
        let newBoss = { ...prevBoss };
        
        // Determine phase
        const oldPhase = newBoss.phase;
        const healthPercent = newBoss.health / PHANTOM_KING.maxHealth;
        for (let i = PHANTOM_KING.phases.length - 1; i >= 0; i--) {
          if (healthPercent <= PHANTOM_KING.phases[i].threshold) {
            newBoss.phase = i + 1;
          }
        }
        if (newBoss.phase === 0) newBoss.phase = 1;

        // Trigger slow motion on phase change
        if (newBoss.phase !== oldPhase && newBoss.phase > 1) {
          setScreenEffects(se => ({
            ...se,
            slowMotion: 0.3, // 30% speed
            trauma: Math.min(1, se.trauma + 0.5),
            flashIntensity: 0.8,
            flashColor: '#ff00ff'
          }));
        }

        const phaseConfig = PHANTOM_KING.phases[Math.min(newBoss.phase - 1, 3)];
        
        // Update timers
        if (newBoss.hitFlash > 0) newBoss.hitFlash--;
        newBoss.attackTimer++;
        
        // Movement
        const playerCenterX = player.x + PLAYER_WIDTH / 2;
        if (Math.abs(newBoss.x - playerCenterX) > 100) {
          newBoss.x += (playerCenterX > newBoss.x ? 1 : -1) * phaseConfig.speed * delta;
        }
        newBoss.direction = playerCenterX > newBoss.x + PHANTOM_KING.width / 2 ? 1 : -1;
        
        // Attack patterns
        if (newBoss.attackTimer >= phaseConfig.attackInterval && newBoss.attackState === 'idle') {
          newBoss.attackState = 'charging';
          newBoss.currentAttack = ['homing', 'spread', 'sweep', 'ring'][Math.floor(Math.random() * 4)];
          newBoss.attackTimer = 0;
        }
        
        if (newBoss.attackState === 'charging' && newBoss.attackTimer >= 30) {
          // Fire attack
          const bossCenter = { 
            x: newBoss.x + PHANTOM_KING.width / 2, 
            y: newBoss.y + PHANTOM_KING.height / 2 
          };
          
          const newProjectiles = [];
          
          switch (newBoss.currentAttack) {
            case 'homing':
              for (let i = 0; i < PHANTOM_KING.attacks.HOMING_BOLTS.count; i++) {
                newProjectiles.push({
                  id: Date.now() + i,
                  x: bossCenter.x,
                  y: bossCenter.y + i * 30 - 15,
                  type: 'homing',
                  speed: PHANTOM_KING.attacks.HOMING_BOLTS.speed,
                  damage: PHANTOM_KING.attacks.HOMING_BOLTS.damage,
                  angle: 0,
                  life: 180
                });
              }
              break;
            case 'spread':
              for (let i = 0; i < PHANTOM_KING.attacks.SPREAD_SHOT.count; i++) {
                const angle = ((i - 2) / 2) * 0.4 + (newBoss.direction > 0 ? 0 : Math.PI);
                newProjectiles.push({
                  id: Date.now() + i,
                  x: bossCenter.x,
                  y: bossCenter.y,
                  type: 'spread',
                  vx: Math.cos(angle) * PHANTOM_KING.attacks.SPREAD_SHOT.speed,
                  vy: Math.sin(angle) * PHANTOM_KING.attacks.SPREAD_SHOT.speed,
                  damage: PHANTOM_KING.attacks.SPREAD_SHOT.damage,
                  angle,
                  life: 120
                });
              }
              break;
            case 'sweep':
              newProjectiles.push({
                id: Date.now(),
                x: bossCenter.x,
                y: 560,
                type: 'sweep',
                vx: newBoss.direction * PHANTOM_KING.attacks.SWEEP.speed,
                vy: 0,
                width: 60,
                height: PHANTOM_KING.attacks.SWEEP.height,
                damage: PHANTOM_KING.attacks.SWEEP.damage,
                life: 150
              });
              break;
            case 'ring':
              for (let i = 0; i < PHANTOM_KING.attacks.RING.count; i++) {
                const angle = (i / PHANTOM_KING.attacks.RING.count) * Math.PI * 2;
                newProjectiles.push({
                  id: Date.now() + i,
                  x: bossCenter.x,
                  y: bossCenter.y,
                  type: 'ring',
                  vx: Math.cos(angle) * PHANTOM_KING.attacks.RING.speed,
                  vy: Math.sin(angle) * PHANTOM_KING.attacks.RING.speed,
                  damage: PHANTOM_KING.attacks.RING.damage,
                  angle,
                  life: 120
                });
              }
              break;
          }
          
          newBoss.projectiles = [...newBoss.projectiles, ...newProjectiles];
          newBoss.attackState = 'idle';
          newBoss.attackTimer = 0;
        }
        
        // Update projectiles
        newBoss.projectiles = newBoss.projectiles.map(proj => {
          let newProj = { ...proj };
          newProj.life--;
          
          if (proj.type === 'homing') {
            // Home toward player
            const dx = player.x + PLAYER_WIDTH / 2 - proj.x;
            const dy = player.y + PLAYER_HEIGHT / 2 - proj.y;
            const norm = normalizeVector(dx, dy);
            newProj.x += norm.x * proj.speed * delta;
            newProj.y += norm.y * proj.speed * delta;
            newProj.angle = Math.atan2(dy, dx);
          } else {
            newProj.x += (proj.vx || 0) * delta;
            newProj.y += (proj.vy || 0) * delta;
          }
          
          // Check player collision
          if (player.invincible <= 0) {
            const projRect = proj.type === 'sweep' 
              ? { x: proj.x - proj.width / 2, y: proj.y - proj.height / 2, width: proj.width, height: proj.height }
              : { x: proj.x - 10, y: proj.y - 10, width: 20, height: 20 };
            
            if (checkRectCollision(
              { x: player.x, y: player.y, width: PLAYER_WIDTH, height: PLAYER_HEIGHT },
              projRect
            )) {
              setPlayer(p => ({
                ...p,
                health: p.health - proj.damage,
                invincible: INVINCIBILITY_FRAMES,
                velocityY: -8
              }));
              audioManager.playPlayerHit();
              setScreenEffects(se => ({
                ...se,
                trauma: Math.min(1, se.trauma + 0.5),
                flashIntensity: 0.6,
                flashColor: '#9933ff'
              }));
              newProj.life = 0;
            }
          }
          
          return newProj;
        }).filter(p => p.life > 0);
        
        // Boomerang hit on boss
        if (boomerang.active) {
          if (checkCircleRectCollision(
            { x: boomerang.x, y: boomerang.y, radius: BOOMERANG_SIZE / 2 },
            { x: newBoss.x, y: newBoss.y, width: PHANTOM_KING.width, height: PHANTOM_KING.height }
          )) {
            const damage = boomerang.charged ? BOOMERANG_CHARGED_DAMAGE : BOOMERANG_DAMAGE;
            newBoss.health -= damage;
            newBoss.hitFlash = 10;

            setBoomerang(b => ({ ...b, returning: true }));

            const hitParticles = createHitParticles(
              boomerang.x, boomerang.y, '#ff4444'
            );
            setParticles(p => [...p, ...hitParticles]);

            // Boss hit stop (stronger effect)
            setScreenEffects(se => ({
              ...se,
              hitStopFrames: boomerang.charged ? 8 : 5,
              trauma: Math.min(1, se.trauma + 0.3)
            }));
            
            audioManager.playBossHit();
            
            if (newBoss.health <= 0) {
              audioManager.playBossDeath();
              setTimeout(() => {
                audioManager.playVictory();
                audioManager.stopMusic();
              }, 1000);
              setGameState('victory');
            }
          }
        }
        
        return newBoss;
      });
    }
    
    // Combo timer
    if (comboTimer > 0) {
      setComboTimer(c => c - 1);
    } else if (combo > 0) {
      setCombo(0);
    }

    // Powerup update and collection
    setPowerups(prevPowerups => {
      return prevPowerups.map(powerup => {
        let newPowerup = { ...powerup };
        newPowerup.lifetime--;

        // Check player collision
        const playerCenterX = player.x + PLAYER_WIDTH / 2;
        const playerCenterY = player.y + PLAYER_HEIGHT / 2;
        const dx = powerup.x - playerCenterX;
        const dy = powerup.y - playerCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 30) {
          // Collect powerup
          const config = POWERUP_TYPES[powerup.type];

          setPlayer(p => {
            let updatedPlayer = { ...p };

            switch (powerup.type) {
              case 'HEALTH':
                updatedPlayer.health = Math.min(PLAYER_MAX_HEALTH, p.health + config.value);
                setScreenEffects(se => ({
                  ...se,
                  flashIntensity: 0.3,
                  flashColor: '#55ff55'
                }));
                break;

              case 'MAGIC':
                updatedPlayer.magic = Math.min(100, p.magic + config.value);
                setScreenEffects(se => ({
                  ...se,
                  flashIntensity: 0.3,
                  flashColor: '#5555ff'
                }));
                break;

              case 'SPEED':
                updatedPlayer.speedBoost = config.duration;
                setScreenEffects(se => ({
                  ...se,
                  flashIntensity: 0.3,
                  flashColor: '#ffff55'
                }));
                break;

              case 'JUMP':
                // Stack jump levels up to 4
                if (p.jumpLevel < 4) {
                  updatedPlayer.jumpLevel = p.jumpLevel + 1;
                  updatedPlayer.jumpsRemaining = updatedPlayer.jumpLevel;
                  updatedPlayer.jumpEffectIntensity = updatedPlayer.jumpLevel;
                  setScreenEffects(se => ({
                    ...se,
                    flashIntensity: 0.3,
                    flashColor: '#ffaa00'
                  }));
                }
                break;
            }

            return updatedPlayer;
          });

          audioManager.playPowerup();
          newPowerup.lifetime = 0; // Mark for removal
        }

        return newPowerup;
      }).filter(p => p.lifetime > 0);
    });

    // Update particles
    setParticles(prevParticles => {
      // Add ambient particles occasionally
      if (frameCountRef.current % 20 === 0) {
        const ambient = createAmbientParticles(currentZone, cameraX, 1);
        prevParticles = [...prevParticles, ...ambient];
      }

      return prevParticles.filter(p => updateParticle(p));
    });

    // Update screen effects (except hit stop which is handled at loop start)
    setScreenEffects(prev => {
      const newEffects = { ...prev };

      // Decay trauma (exponential falloff)
      if (newEffects.trauma > 0) {
        newEffects.trauma = Math.max(0, newEffects.trauma - 0.05);
      }

      // Decay flash
      if (newEffects.flashIntensity > 0) {
        newEffects.flashIntensity = Math.max(0, newEffects.flashIntensity - 0.1);
      }

      // Decay slow motion back to normal
      if (newEffects.slowMotion < 1) {
        newEffects.slowMotion = Math.min(1, newEffects.slowMotion + 0.02);
      }

      return newEffects;
    });

    // Camera follow
    const targetCameraX = player.x - GAME_WIDTH / 3;
    setCameraX(prevCam => {
      const newCam = prevCam + (targetCameraX - prevCam) * 0.1;
      return Math.max(0, newCam);
    });
    
    // Zone detection
    const newZone = Math.floor(player.x / ZONE_WIDTH);
    if (newZone !== currentZone && newZone < TOTAL_ZONES) {
      setCurrentZone(newZone);
      audioManager.setZone(newZone);
      setZoneTransition({ active: true, name: ZONE_NAMES[newZone], opacity: 1 });
    }
    
    // Zone transition fade
    if (zoneTransition.active) {
      setZoneTransition(zt => {
        const newOpacity = zt.opacity - 0.02;
        if (newOpacity <= 0) {
          return { ...zt, active: false, opacity: 0 };
        }
        return { ...zt, opacity: newOpacity };
      });
    }
    
    // Boss activation
    if (player.x >= TOTAL_ZONES * ZONE_WIDTH - 100 && !boss.active) {
      setBoss(b => ({ ...b, active: true }));
      setCurrentZone(4);
      audioManager.setZone(4);
      setZoneTransition({ active: true, name: 'THE DARK THRONE', opacity: 1 });
    }
    
    // Check game over
    if (player.health <= 0) {
      audioManager.stopMusic();
      setGameState('gameover');
    }
    
  }, [gameState, player, boomerang, platforms, boss, cameraX, combo, comboTimer, currentZone, zoneTransition]);
  
  // Run game loop
  useGameLoop(gameLoop);

  // Calculate screen shake offset from trauma
  const trauma = screenEffects.trauma;
  const shake = trauma * trauma; // Square for smoother falloff
  const maxOffset = 12;
  const shakeX = (Math.random() * 2 - 1) * maxOffset * shake;
  const shakeY = (Math.random() * 2 - 1) * maxOffset * shake;

  // Render
  if (gameState === 'title') {
    return (
      <svg 
        width={GAME_WIDTH} 
        height={GAME_HEIGHT} 
        style={{ display: 'block', cursor: 'pointer' }}
        onClick={handleClick}
      >
        <TitleScreen onStart={handleClick} />
      </svg>
    );
  }
  
  return (
    <svg 
      width={GAME_WIDTH} 
      height={GAME_HEIGHT} 
      style={{ display: 'block' }}
      onClick={handleClick}
    >
      <defs>
        <linearGradient id="dashGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6a4a9a" stopOpacity="0" />
          <stop offset="100%" stopColor="#6a4a9a" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="heatShimmer" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#ff6600" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ff6600" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Game world container with camera transform and shake */}
      <g transform={`translate(${-cameraX + shakeX}, ${shakeY})`}>
        {/* Background */}
        <g transform={`translate(${cameraX}, 0)`}>
          <Background cameraX={cameraX} currentZone={currentZone} />
        </g>
        
        {/* Platforms */}
        {platforms.filter(p => 
          p.x + p.width > cameraX - 100 && 
          p.x < cameraX + GAME_WIDTH + 100
        ).map((platform, i) => (
          <Platform 
            key={`${platform.type}-${platform.x}-${platform.y}`} 
            platform={platform} 
            zoneIndex={Math.floor(platform.x / ZONE_WIDTH)}
          />
        ))}
        
        {/* Particles (behind entities) */}
        <Particles particles={particles.filter(p => p.type === 'ambient' || p.type === 'mist')} />

        {/* Powerups */}
        {powerups.filter(p =>
          p.x > cameraX - 50 &&
          p.x < cameraX + GAME_WIDTH + 50
        ).map(powerup => (
          <Powerup key={powerup.id} powerup={powerup} />
        ))}

        {/* Enemies */}
        {enemies.filter(e => 
          e.x + e.width > cameraX - 50 && 
          e.x < cameraX + GAME_WIDTH + 50
        ).map(enemy => (
          <Enemy key={enemy.id} enemy={enemy} />
        ))}
        
        {/* Boss */}
        {boss.active && <PhantomKing boss={boss} />}
        {boss.projectiles.map(proj => (
          <BossProjectile key={proj.id} projectile={proj} />
        ))}
        
        {/* Player */}
        <Player player={player} />

        {/* Jump level visual effects */}
        {player.jumpLevel > 1 && (
          <g transform={`translate(${player.x + PLAYER_WIDTH / 2}, ${player.y + PLAYER_HEIGHT + 10})`}>
            {/* Multi-jump effect rings based on level */}
            {[...Array(player.jumpLevel - 1)].map((_, i) => {
              const ringRadius = 15 + i * 8;
              const opacity = 0.4 - i * 0.1;
              const pulseOffset = i * 0.3;

              return (
                <circle
                  key={i}
                  cx={0}
                  cy={0}
                  r={ringRadius}
                  fill="none"
                  stroke={player.jumpLevel === 4 ? '#ff00ff' : player.jumpLevel === 3 ? '#ffaa00' : '#00ffff'}
                  strokeWidth={2}
                  opacity={opacity}
                >
                  <animate
                    attributeName="r"
                    values={`${ringRadius};${ringRadius + 5};${ringRadius}`}
                    dur={`${1 + pulseOffset}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values={`${opacity};${opacity * 0.5};${opacity}`}
                    dur={`${1 + pulseOffset}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              );
            })}

            {/* Central glow effect - more intense at higher levels */}
            <circle
              cx={0}
              cy={0}
              r={player.jumpLevel * 5}
              fill={player.jumpLevel === 4 ? '#ff00ff' : player.jumpLevel === 3 ? '#ffaa00' : '#00ffff'}
              opacity={0.2 + player.jumpLevel * 0.1}
            >
              <animate
                attributeName="r"
                values={`${player.jumpLevel * 5};${player.jumpLevel * 8};${player.jumpLevel * 5}`}
                dur="0.8s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Particle burst effect for level 4 */}
            {player.jumpLevel === 4 && (
              <g>
                {[...Array(8)].map((_, i) => {
                  const angle = (i / 8) * Math.PI * 2;
                  const distance = 25 + Math.sin(player.animationFrame * 0.1 + i) * 5;

                  return (
                    <circle
                      key={`particle-${i}`}
                      cx={Math.cos(angle) * distance}
                      cy={Math.sin(angle) * distance}
                      r={3}
                      fill="#ff00ff"
                      opacity={0.8}
                    >
                      <animate
                        attributeName="opacity"
                        values="0.8;0.3;0.8"
                        dur="0.6s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  );
                })}
              </g>
            )}
          </g>
        )}

        {/* Boomerang */}
        <Boomerang boomerang={boomerang} />
        
        {/* Particles (in front) */}
        <Particles particles={particles.filter(p => p.type !== 'ambient' && p.type !== 'mist')} />
      </g>
      
      {/* HUD (fixed position) */}
      <HUD 
        gameState={{
          health: player.health,
          score,
          combo,
          comboTimer,
          currentZone,
          magic: player.magic,
          bossActive: boss.active
        }} 
      />
      
      {/* Zone transition */}
      <ZoneTransition 
        zoneName={zoneTransition.name} 
        opacity={zoneTransition.opacity} 
      />
      
      {/* Game over / Victory screens */}
      {gameState === 'gameover' && (
        <GameOverScreen score={score} onRestart={handleClick} />
      )}
      {gameState === 'victory' && (
        <VictoryScreen score={score} time={gameTime} onRestart={handleClick} />
      )}
      
      {/* Charging indicator near player */}
      {boomerang.isCharging && (
        <g transform={`translate(${player.x + PLAYER_WIDTH / 2 - cameraX}, ${player.y - 20})`}>
          <rect x={-25} y={0} width={50} height={6} fill="#333" rx={2} />
          <rect
            x={-24}
            y={1}
            width={48 * boomerang.chargeLevel}
            height={4}
            fill={boomerang.chargeLevel >= 0.8 ? '#ffff00' : '#ffaa00'}
            rx={1}
          />
        </g>
      )}

      {/* Screen flash overlay */}
      {screenEffects.flashIntensity > 0 && (
        <rect
          x={0}
          y={0}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          fill={screenEffects.flashColor}
          opacity={screenEffects.flashIntensity}
          pointerEvents="none"
        />
      )}
    </svg>
  );
}

export default Game;
