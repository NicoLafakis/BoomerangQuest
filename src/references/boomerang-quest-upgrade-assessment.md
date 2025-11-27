# Boomerang Quest Visual Polish Upgrade
## Assessment and AI Agent Instructions

---

# Part One: Current State Assessment

## Overview

Boomerang Quest is a functional 2D side-scrolling action platformer built with React and SVG rendering. The game has solid foundational systems but lacks the fluid, polished feel of games like Ori and the Blind Forest. This document identifies specific gaps and provides actionable instructions for an AI agent to implement improvements.

## Architecture Summary

| Component | File | Current State |
|-----------|------|---------------|
| Player Rendering | `src/components/Player.jsx` | Basic SVG shapes with minimal animation |
| Enemy Rendering | `src/components/Enemy.jsx` | Static poses with sin() wave movement |
| Particle System | `src/components/Particles.jsx` | Functional but underutilized |
| Backgrounds | `src/components/Background.jsx` | 3 parallax layers, zone-specific |
| Game Loop | `src/components/Game.jsx` | 60fps loop, handles physics/collision |
| Input Handling | `src/hooks/useInput.js` | Keyboard and mouse tracking |
| Audio | `src/audio/audioManager.js` | Procedural music with Tone.js |

---

# Part Two: Gap Analysis

## 1. Animation Quality

### Current Implementation
```javascript
// Player.jsx - Current animation approach
const cloakWave = Math.sin(animationFrame * 0.2) * 3;
const breathe = Math.sin(animationFrame * 0.1) * 1;
```

### Problems
- Animation is driven by simple sin() waves with no easing
- No keyframe-based animation system
- No squash/stretch on any movement
- No anticipation or follow-through
- Secondary motion (cape) is too uniform and predictable
- Leg animation only triggers when `isMoving` but has no weight transfer
- No landing compression animation
- No state blending between animations

### Missing Features
- [ ] Keyframe interpolation system with easing functions
- [ ] Squash on landing (15-20% vertical compression)
- [ ] Stretch during fast horizontal movement and dashing
- [ ] Anticipation crouch before jumping (3-4 frames)
- [ ] Follow-through on attack/throw animations
- [ ] Spring physics on cape/cloth elements
- [ ] Proper run cycle with weight transfer
- [ ] State machine with blended transitions

---

## 2. Input Feel

### Current Implementation
```javascript
// Game.jsx - Movement is instant
newPlayer.velocityX = moveX * PLAYER_SPEED * speedMultiplier;
```

### Problems
- Movement velocity is set instantly with no acceleration
- No deceleration/friction when releasing keys
- No coyote time (grace period after leaving platform)
- No jump buffering (queuing jump before landing)
- No variable jump height (hold for higher, tap for shorter)
- Turn-around is instant with no transition

### Missing Features
- [ ] Acceleration curve: 8-12 frames to reach full speed
- [ ] Deceleration curve: 6-8 frames to stop
- [ ] Coyote time: 6-8 frame grace period
- [ ] Jump buffering: 8-10 frame input queue
- [ ] Variable jump: Early release = short hop
- [ ] Turn delay: Brief deceleration before reversing

---

## 3. Particle Coverage

### Current Implementation
```javascript
// Particles.jsx - Types exist but underused
// Types: hit, death, score, ambient, ember, snow, leaf, mist, spark, trail
```

### What Triggers Particles Currently
- Enemy hit: Yes (createHitParticles)
- Enemy death: Yes (createDeathParticles)
- Score popup: Yes (createScoreParticle)
- Ambient atmosphere: Yes (createAmbientParticles)

### What SHOULD Trigger Particles But Doesn't
- [ ] Player footsteps while running
- [ ] Player jump (dust burst from ground)
- [ ] Player land (impact dust)
- [ ] Player dash (burst at start + trail during)
- [ ] Player wall slide (scraping particles)
- [ ] Player wall jump (kick-off burst)
- [ ] Player damage (hit sparks on player)
- [ ] Boomerang throw (launch particles)
- [ ] Boomerang catch (catch sparkle)
- [ ] Boomerang charged (charging aura particles)
- [ ] Powerup collection (absorption effect)
- [ ] Boss phase transitions (dramatic burst)

---

## 4. Screen Effects

### Current Implementation
- No screen shake system
- No hit stop/freeze frames
- No screen flash
- No slowdown effects
- Basic enemy hit flash (white overlay for 10 frames)

### Missing Features
- [ ] Trauma-based screen shake with decay
- [ ] Hit stop on significant impacts (3-6 frames)
- [ ] Red screen flash on player damage
- [ ] White flash on powerup collection
- [ ] Slowdown for boss phase changes
- [ ] Slowdown on final boss hit
- [ ] Vignette effect (darker edges)

---

## 5. Environment Polish

### Current Implementation
```javascript
// Background.jsx - 3 parallax layers
const parallax1 = -cameraX * 0.1;  // Far
const parallax2 = -cameraX * 0.3;  // Mid  
const parallax3 = -cameraX * 0.5;  // Near
```

### Problems
- No foreground layer (elements in front of player)
- No atmospheric perspective (distant layers should be desaturated)
- Environmental elements are static (trees, crystals, etc.)
- Ambient particles spawn too infrequently (every 20 frames)

### Missing Features
- [ ] Foreground parallax layer (1.2-1.5x speed)
- [ ] Atmospheric perspective (desaturate far layers)
- [ ] Swaying vegetation with varied sin() offsets
- [ ] Flickering light sources
- [ ] More frequent ambient particle spawning
- [ ] Zone transition effects (color fade, particle burst)

---

## 6. Lighting and Glow

### Current Implementation
```javascript
// Player.jsx - Basic eye glow
<ellipse cx={8} cy={-PLAYER_HEIGHT/2 + 12 + breathe} rx={6} ry={4} fill="#ffcc00" opacity="0.3" />
```

### Problems
- No rim lighting on player or enemies
- Glow effects are single-layer (should be multi-layer bloom)
- No dynamic shadows
- Emissive objects (player eye, boss eyes) lack proper bloom

### Missing Features
- [ ] Rim lighting on player (lighter edge on one side)
- [ ] Rim lighting on enemies
- [ ] Multi-layer bloom (blurred underlayer + sharp top)
- [ ] Soft shadow beneath player (already exists but static)
- [ ] Pulsing glow on magical elements
- [ ] Point light effects on emissive sources

---

## 7. Character Detail

### Current Player Analysis
- Hood, face shadow, glowing eye: Good foundation
- Cloak body with wave: Needs spring physics
- Leg animation: Too mechanical, needs weight
- No arms visible (hidden in cloak): Fine for design
- Shadow beneath: Good but could scale with height

### Missing Details
- [ ] Eye tracks toward movement direction slightly
- [ ] Cloak responds to velocity (streams behind during movement)
- [ ] Cloak has overshoot/settle on direction changes
- [ ] Body tilt during movement (lean into direction)
- [ ] Squash/stretch transforms on body group
- [ ] Landing impact visual (body compress + rebound)

---

## 8. Enemy Animation

### Current Implementation
- Enemies have `animationFrame` counter
- Movement uses sin() waves for bobbing
- Basic direction facing
- Hit flash exists (white overlay)

### Problems
- No idle breathing or movement
- Flying enemies (bat, demon) have identical wing patterns
- Ground enemies lack proper walk cycles
- No anticipation on enemy attacks
- No death animation (instant removal after particles)

### Missing Features
- [ ] Unique idle animations per enemy type
- [ ] Proper wing flap cycles with easing
- [ ] Walk cycles with leg alternation
- [ ] Attack wind-up animations
- [ ] Death fade/dissolve over 20-30 frames
- [ ] Hit recoil animation

---

# Part Three: Priority Implementation Order

## Phase 1: Input Feel (Highest Impact)
These changes make the game FEEL better immediately.

1. Add acceleration/deceleration curves to movement
2. Implement coyote time (6 frames)
3. Implement jump buffering (8 frames)
4. Add variable jump height

## Phase 2: Player Animation
These changes make the player character feel alive.

1. Add squash on landing
2. Add stretch during dash
3. Implement spring physics on cape
4. Add anticipation crouch before jump
5. Add body tilt during movement

## Phase 3: Particle Expansion
These changes add visual feedback to actions.

1. Add footstep dust particles
2. Add jump/land dust particles
3. Add dash burst and trail particles
4. Add wall interaction particles
5. Add boomerang particles

## Phase 4: Screen Effects
These changes add impact and drama.

1. Implement trauma-based screen shake
2. Add hit stop on impacts
3. Add screen flash on damage/pickup
4. Add slowdown for boss phases

## Phase 5: Environment Polish
These changes make the world feel alive.

1. Add foreground parallax layer
2. Implement atmospheric perspective
3. Add swaying vegetation
4. Increase ambient particle density

## Phase 6: Lighting
These changes add depth and atmosphere.

1. Add rim lighting to player
2. Implement multi-layer bloom
3. Add pulsing to magical elements

---

# Part Four: AI Agent System Prompt

Use this system prompt when instructing an AI to implement these upgrades:

```
You are upgrading Boomerang Quest to achieve Ori and the Blind Forest-level visual polish using ONLY code-based SVG rendering. No external images or sprites.

CRITICAL PRINCIPLES:
1. Nothing is static. Everything breathes, sways, pulses, or drifts.
2. Every action has anticipation, execution, and follow-through.
3. Squash and stretch on all movement.
4. Secondary motion on all appendages with spring physics.
5. Particle effects punctuate every significant action.
6. Easing functions on all transitions (never linear).
7. Screen feedback for all impacts (shake, flash, hit stop).

CODEBASE CONTEXT:
- React 19 with SVG rendering
- Game loop in src/components/Game.jsx at 60fps
- Player state includes: x, y, velocityX, velocityY, animationFrame, isJumping, isDashing, isWallSliding
- Particle system in src/components/Particles.jsx with createHitParticles, createDeathParticles, etc.
- Constants in src/constants/gameConstants.js

EASING FUNCTIONS TO USE:
```javascript
const easeInOut = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeIn = (t) => t * t * t;
const spring = (t, bounces = 3, damping = 0.5) => Math.sin(t * Math.PI * bounces) * Math.pow(1 - t, damping);
```

WHEN MODIFYING PLAYER MOVEMENT:
- Add `accelerationProgress` to player state (0-1)
- Interpolate velocity using easing: `targetSpeed * easeOut(accelerationProgress)`
- Increment accelerationProgress by 1/10 each frame when moving
- Decrement by 1/8 each frame when not moving
- Add `coyoteTimer` (starts at 6 when grounded, decrements in air)
- Add `jumpBuffer` (set to 8 when jump pressed, decrements each frame)

WHEN MODIFYING PLAYER RENDERING:
- Add `scaleX` and `scaleY` to player for squash/stretch
- On landing: scaleY = 0.8, scaleX = 1.2, then spring back over 12 frames
- During dash: scaleX = 1.3, scaleY = 0.85
- Apply scale to main player group: `transform="scale(${scaleX}, ${scaleY})"`

WHEN ADDING PARTICLES:
- Create new functions: createJumpParticles, createLandParticles, createDashParticles, createFootstepParticles
- Call them from Game.jsx at appropriate moments
- Footsteps: Every 8 frames while running and grounded
- Jump: 6 particles bursting downward on jump start
- Land: 8 particles bursting outward on ground contact
- Dash: 10 particles burst at start, 1 particle per frame during dash

WHEN ADDING SCREEN SHAKE:
- Add `screenTrauma` to game state (0-1)
- Add `screenShakeX` and `screenShakeY` to game state
- Each frame: trauma *= 0.92 (decay)
- Shake offset = trauma² * 15 * (Math.random() - 0.5)
- Apply to main game container transform
- Trigger amounts: player hit +0.4, enemy death +0.1, boss hit +0.2

WHEN ADDING HIT STOP:
- Add `hitStopFrames` to game state
- When hitStopFrames > 0, skip physics/movement updates but continue rendering
- Set hitStopFrames = 4 on enemy kills, = 6 on boss hits
- Decrement each frame

WHEN MODIFYING CAPE/CLOAK:
- Track `capeVelocity` and `capeOffset` in player state
- Target position based on player velocity (opposite direction)
- Apply spring physics: capeVelocity += (target - capeOffset) * 0.15
- Apply damping: capeVelocity *= 0.85
- Update: capeOffset += capeVelocity
- Use capeOffset in the cape path bezier control points
```

---

# Part Five: Specific Code Change Instructions

## 5.1 Movement Feel Upgrade

### File: src/components/Game.jsx

Add to player state:
```javascript
const initialPlayerState = () => ({
  // ... existing properties ...
  accelerationProgress: 0,
  decelerationProgress: 0,
  coyoteTimer: 0,
  jumpBufferTimer: 0,
  landingSquash: 0,
  wasGrounded: false,
});
```

Replace movement logic:
```javascript
// BEFORE
newPlayer.velocityX = moveX * PLAYER_SPEED * speedMultiplier;

// AFTER
const targetSpeed = moveX * PLAYER_SPEED * speedMultiplier;
if (moveX !== 0) {
  newPlayer.accelerationProgress = Math.min(1, newPlayer.accelerationProgress + 0.1);
  newPlayer.decelerationProgress = 0;
} else {
  newPlayer.decelerationProgress = Math.min(1, newPlayer.decelerationProgress + 0.125);
  newPlayer.accelerationProgress = Math.max(0, newPlayer.accelerationProgress - 0.1);
}
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const speedFactor = moveX !== 0 ? easeOut(newPlayer.accelerationProgress) : (1 - easeOut(newPlayer.decelerationProgress));
newPlayer.velocityX = targetSpeed * speedFactor;
```

Add coyote time:
```javascript
// Update coyote timer
if (newPlayer.isGrounded) {
  newPlayer.coyoteTimer = 6;
} else if (newPlayer.coyoteTimer > 0) {
  newPlayer.coyoteTimer--;
}

// Modify jump condition
if (jumpPressed && !keys['_jumpHeld']) {
  keys['_jumpHeld'] = true;
  
  // Can jump if grounded OR within coyote time
  if (newPlayer.isGrounded || newPlayer.coyoteTimer > 0) {
    newPlayer.velocityY = -PLAYER_JUMP_FORCE;
    newPlayer.isJumping = true;
    newPlayer.isGrounded = false;
    newPlayer.coyoteTimer = 0; // Consume coyote time
    audioManager.playJump();
    // ADD: Jump particles here
  }
  // ... rest of jump logic
}
```

Add landing detection for squash:
```javascript
// Detect landing moment
if (newPlayer.isGrounded && !newPlayer.wasGrounded) {
  newPlayer.landingSquash = 1; // Start squash animation
  // ADD: Landing particles here
  // ADD: Screen shake here (small amount)
}
newPlayer.wasGrounded = newPlayer.isGrounded;

// Decay landing squash
if (newPlayer.landingSquash > 0) {
  newPlayer.landingSquash -= 0.08;
}
```

---

## 5.2 Player Rendering Upgrade

### File: src/components/Player.jsx

Add squash/stretch calculation:
```javascript
function Player({ player }) {
  const { 
    x, y, facingRight, isJumping, isDashing, isWallSliding, 
    invincible, animationFrame, velocityX, velocityY,
    landingSquash = 0, accelerationProgress = 0
  } = player;
  
  // Calculate squash/stretch
  let scaleX = 1;
  let scaleY = 1;
  
  // Landing squash
  if (landingSquash > 0) {
    const squashAmount = landingSquash * 0.2;
    scaleY = 1 - squashAmount;
    scaleX = 1 + squashAmount * 0.6;
  }
  
  // Dash stretch
  if (isDashing) {
    scaleX = 1.25;
    scaleY = 0.85;
  }
  
  // Falling stretch
  if (velocityY > 8) {
    const fallStretch = Math.min((velocityY - 8) / 12, 0.15);
    scaleY = 1 + fallStretch;
    scaleX = 1 - fallStretch * 0.3;
  }
  
  // Body tilt based on velocity
  const bodyTilt = (velocityX / PLAYER_SPEED) * 5;
  
  // Apply to main group
  return (
    <g 
      transform={`
        translate(${x + PLAYER_WIDTH/2}, ${y + PLAYER_HEIGHT/2}) 
        scale(${scaleX * (facingRight ? 1 : -1)}, ${scaleY})
        rotate(${bodyTilt})
      `}
      opacity={opacity}
    >
      {/* ... rest of player rendering ... */}
    </g>
  );
}
```

Add spring physics cape:
```javascript
// Replace simple sin wave with velocity-responsive cape
// Add to player state: capeOffset, capeVelocity (both start at 0)

// In Player.jsx, calculate cape position:
const targetCapeOffset = -velocityX * 2; // Streams opposite to movement
const capeSpring = 0.15;
const capeDamping = 0.85;
// Note: capeVelocity and capeOffset should be tracked in player state
// and updated in Game.jsx each frame

const capeWave = player.capeOffset + Math.sin(animationFrame * 0.15) * 2;
```

---

## 5.3 Particle System Expansion

### File: src/components/Particles.jsx

Add new particle creators:
```javascript
export function createJumpParticles(x, y) {
  const particles = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 0.3) + (Math.random() * Math.PI * 0.4); // Downward arc
    const speed = 2 + Math.random() * 3;
    particles.push({
      id: Date.now() + Math.random(),
      x,
      y,
      vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
      vy: Math.sin(angle) * speed,
      size: 3 + Math.random() * 3,
      color: '#8a7a6a',
      opacity: 0.8,
      type: 'dust',
      life: 25
    });
  }
  return particles;
}

export function createLandParticles(x, y, intensity = 1) {
  const particles = [];
  const count = Math.floor(8 * intensity);
  for (let i = 0; i < count; i++) {
    const angle = Math.PI + (Math.random() - 0.5) * Math.PI * 0.8; // Outward from ground
    const speed = 3 + Math.random() * 4 * intensity;
    particles.push({
      id: Date.now() + Math.random(),
      x: x + (Math.random() - 0.5) * 20,
      y,
      vx: Math.cos(angle) * speed,
      vy: -Math.abs(Math.sin(angle) * speed * 0.5),
      size: 2 + Math.random() * 4,
      color: '#9a8a7a',
      opacity: 0.9,
      type: 'dust',
      life: 30
    });
  }
  return particles;
}

export function createDashParticles(x, y, direction) {
  const particles = [];
  // Burst at start
  for (let i = 0; i < 10; i++) {
    const angle = (direction > 0 ? Math.PI : 0) + (Math.random() - 0.5) * 0.5;
    const speed = 2 + Math.random() * 4;
    particles.push({
      id: Date.now() + Math.random(),
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 30,
      vx: Math.cos(angle) * speed,
      vy: (Math.random() - 0.5) * 2,
      size: 4 + Math.random() * 4,
      color: '#6a4a9a',
      opacity: 0.8,
      type: 'trail',
      life: 20
    });
  }
  return particles;
}

export function createFootstepParticle(x, y) {
  return {
    id: Date.now() + Math.random(),
    x: x + (Math.random() - 0.5) * 10,
    y,
    vx: (Math.random() - 0.5) * 1.5,
    vy: -Math.random() * 2,
    size: 2 + Math.random() * 2,
    color: '#7a7a6a',
    opacity: 0.5,
    type: 'dust',
    life: 20
  };
}
```

---

## 5.4 Screen Effects System

### File: src/components/Game.jsx

Add to game state:
```javascript
const [screenEffects, setScreenEffects] = useState({
  trauma: 0,
  shakeX: 0,
  shakeY: 0,
  hitStopFrames: 0,
  flashColor: null,
  flashOpacity: 0,
  slowMotion: false,
  slowMotionFrames: 0
});
```

Update in game loop:
```javascript
// At start of game loop, check hit stop
if (screenEffects.hitStopFrames > 0) {
  setScreenEffects(prev => ({
    ...prev,
    hitStopFrames: prev.hitStopFrames - 1
  }));
  // Skip physics updates but continue rendering
  return;
}

// Update screen shake
setScreenEffects(prev => {
  const newTrauma = prev.trauma * 0.92;
  const shakeIntensity = newTrauma * newTrauma * 15;
  return {
    ...prev,
    trauma: newTrauma,
    shakeX: shakeIntensity * (Math.random() - 0.5) * 2,
    shakeY: shakeIntensity * (Math.random() - 0.5) * 2,
    flashOpacity: Math.max(0, prev.flashOpacity - 0.1)
  };
});

// Trigger functions
const triggerScreenShake = (amount) => {
  setScreenEffects(prev => ({
    ...prev,
    trauma: Math.min(1, prev.trauma + amount)
  }));
};

const triggerHitStop = (frames) => {
  setScreenEffects(prev => ({
    ...prev,
    hitStopFrames: frames
  }));
};

const triggerFlash = (color) => {
  setScreenEffects(prev => ({
    ...prev,
    flashColor: color,
    flashOpacity: 0.4
  }));
};
```

Apply to render:
```javascript
<svg width={GAME_WIDTH} height={GAME_HEIGHT}>
  {/* Apply screen shake to game world */}
  <g transform={`translate(${screenEffects.shakeX}, ${screenEffects.shakeY})`}>
    {/* ... game content ... */}
  </g>
  
  {/* Screen flash overlay */}
  {screenEffects.flashOpacity > 0 && (
    <rect
      x={0}
      y={0}
      width={GAME_WIDTH}
      height={GAME_HEIGHT}
      fill={screenEffects.flashColor || '#ff0000'}
      opacity={screenEffects.flashOpacity}
      pointerEvents="none"
    />
  )}
</svg>
```

---

# Part Six: Testing Checklist

After implementing changes, verify each item:

## Input Feel
- [ ] Player accelerates to full speed over ~10 frames
- [ ] Player decelerates to stop over ~8 frames
- [ ] Can jump within 6 frames after leaving platform edge
- [ ] Jump queued before landing executes on contact
- [ ] Short tap produces shorter jump than held button

## Animation
- [ ] Player visibly compresses on landing
- [ ] Player stretches horizontally during dash
- [ ] Cape streams behind during movement
- [ ] Cape overshoots and settles on stop
- [ ] Body tilts slightly into movement direction

## Particles
- [ ] Dust appears on footsteps while running
- [ ] Dust bursts on jump initiation
- [ ] Dust bursts on landing (intensity scales with fall distance)
- [ ] Dash creates burst and trail
- [ ] Wall slide shows scraping particles

## Screen Effects
- [ ] Screen shakes on player damage
- [ ] Screen shakes on enemy death (subtle)
- [ ] Screen shakes on boss hit (moderate)
- [ ] Brief freeze on significant hits
- [ ] Red flash on player damage
- [ ] White flash on powerup collection

## Environment
- [ ] Foreground elements pass in front of player
- [ ] Distant backgrounds are slightly desaturated
- [ ] Vegetation sways with varied timing
- [ ] Ambient particles spawn frequently

---

# Part Seven: Performance Considerations

When implementing these changes, be aware of performance:

1. **Particle pooling**: Reuse particle objects instead of creating/destroying
2. **Early exit**: Skip updates for off-screen elements
3. **Throttle ambient particles**: Don't spawn every frame
4. **Batch state updates**: Use functional setState to batch related changes
5. **Memoization**: Continue using React.memo on all components
6. **Animation frame counts**: Keep to 24-48 max, not infinite

Monitor for:
- Consistent 60fps
- No garbage collection stutters
- Smooth camera movement
- Responsive input

---

# Conclusion

This document provides a complete roadmap for upgrading Boomerang Quest from a functional platformer to a visually polished experience. The changes are ordered by impact, with input feel and player animation providing the most noticeable improvements for the least implementation effort.

The key insight is that polish comes from layering many small effects, not from one big change. Each particle burst, each easing curve, each frame of squash adds a small amount. Together, they create the feeling that the game was made with care.

Start with Phase 1 (Input Feel) and Phase 2 (Player Animation). These changes will transform how the game feels within a few hours of work. Then layer in the remaining phases over time.

---

*Assessment document for Boomerang Quest visual upgrade.*
*Reference: src/references/ai-fluid-game-instructions.md*
*Reference: src/references/2d-visual-polish-vocabulary.md*
