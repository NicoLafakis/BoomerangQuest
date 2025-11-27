# AI Agent Instructions for Fluid 2D Game Development
## Achieving Ori-Level Polish with Pure Code Rendering

---

# How to Use This Document

This is a prompt engineering guide and instruction set for directing AI agents to create visually polished 2D games using only code-based rendering. No sprite sheets, no GIFs, no image files. Everything is generated procedurally through SVG, Canvas, or CSS.

You can:
1. Include sections directly in your prompts
2. Reference it as a style guide
3. Use the terminology when requesting specific features
4. Paste the full system prompt section into your AI conversations

---

# Part One: System Prompt Template

Copy and paste this into your AI conversation as foundational instructions:

```
You are building a 2D side-scrolling game with Ori and the Blind Forest-level visual polish using ONLY code-based rendering. No external images, sprites, or assets. Everything is procedurally generated using SVG elements, Canvas drawing, or CSS.

RENDERING APPROACH:
- Use SVG for all game graphics (characters, enemies, environments, effects)
- Build characters from layered geometric primitives (ellipses, paths, polygons)
- Use gradient fills, filters, and blend modes for depth and lighting
- Implement all animation through code, not sprite sheets

CORE VISUAL PRINCIPLES:
1. Nothing is static. Everything breathes, sways, pulses, or drifts.
2. Every action has anticipation, execution, and follow-through.
3. Squash and stretch on all movement (compress on impact, elongate during speed).
4. Secondary motion on all appendages (capes, hair, tails follow with delay).
5. Particle effects punctuate every significant action.
6. Easing functions on all transitions (never linear movement).
7. Layered depth through parallax, atmospheric perspective, and z-ordering.
8. Rim lighting and glow effects to make subjects pop from backgrounds.
9. Color tells story (warm=safe, cool=danger, vibrant=magic).
10. Screen feedback for all impacts (shake, flash, hit stop).

ANIMATION REQUIREMENTS:
- Minimum 24 frames per animation cycle for smooth motion
- Use keyframe interpolation with easeInOut curves
- Idle animations must have visible breathing/movement
- Run cycles need proper weight transfer and secondary motion
- All state transitions must blend smoothly (no instant cuts)
- Landing always has squash, jumping always has anticipation crouch

PARTICLE SYSTEM REQUIREMENTS:
- Particles for: footsteps, jumps, landings, dashes, hits, deaths, pickups, ambient atmosphere
- Each particle has: position, velocity, acceleration, life, size-over-life, alpha-over-life, color
- Particles respond to gravity and can have randomized properties
- Layer multiple particle systems for depth (foreground and background particles)

ENVIRONMENTAL REQUIREMENTS:
- Minimum 3 parallax background layers with different scroll speeds
- Foreground elements that pass in front of gameplay
- Ambient floating particles (dust, leaves, embers based on zone)
- All environmental elements have subtle animation (swaying plants, flickering lights)
- Atmospheric perspective (distant objects are desaturated and lower contrast)

LIGHTING REQUIREMENTS:
- Characters have rim/edge lighting effect (lighter outline on one side)
- Glowing elements use layered shapes with decreasing opacity
- Bloom effect through blurred duplicate shapes beneath sharp shapes
- Dynamic shadows or ambient occlusion where appropriate

INPUT FEEL REQUIREMENTS:
- Coyote time: 6-8 frames of jump grace after leaving platforms
- Jump buffering: Accept jump input 8-10 frames before landing
- Variable jump height: Short tap = short hop, hold = full jump
- Acceleration curves: 8-12 frames to reach full speed, not instant
- Air control: Allow horizontal influence while airborne (reduced from ground speed)

FEEDBACK REQUIREMENTS:
- Screen shake on impacts (intensity varies by event magnitude)
- Hit stop/freeze frames on significant hits (3-6 frames)
- Screen flash on damage (brief red overlay)
- Slowdown for dramatic moments (boss phase changes, deaths)
- Floating damage numbers with upward drift and fade

When implementing any feature, always ask: "How can this move more fluidly? What secondary motion should accompany this? What particles should this spawn? How does this ease in and out?"
```

---

# Part Two: Specific Feature Prompts

Use these when requesting specific implementations:

## Character Creation

```
Create the player character using only SVG elements. Build them from layered primitives:
- Body: Ellipses and paths with gradient fills
- Head: Ellipse with facial features as smaller shapes
- Limbs: Paths or ellipses that can rotate from joint points
- Cape/cloth: Bezier curve path that responds to movement direction

The character must have:
- Visible breathing animation in idle (subtle body scale pulse)
- Eye that tracks slightly toward movement direction
- Cape/hair that flows opposite to movement with spring physics
- Rim lighting effect (lighter stroke or glow on one edge)
- Soft shadow beneath (ellipse with blur and low opacity)

All body parts should be separate elements that can animate independently for secondary motion.
```

## Movement System

```
Implement movement with the following feel:

GROUND MOVEMENT:
- Acceleration: Character takes 10 frames to reach full speed
- Deceleration: Character takes 8 frames to stop (slides slightly)
- Turn around: Brief deceleration, then acceleration in new direction
- Animation: Run cycle with 24+ frames, proper leg alternation, arm swing opposite to legs
- Secondary: Cape/hair flows behind, head bobs subtly, dust particles on footsteps

JUMPING:
- Anticipation: 3-4 frame crouch before leaving ground
- Ascent: Body tilts back slightly, limbs spread, cape lifts
- Apex: Brief hang time feel (reduced gravity at peak)
- Descent: Body tilts forward, limbs adjust for landing, cape trails above
- Landing: Squash effect (vertically compress character 15-20%), dust particles, 4-6 frame recovery
- Coyote time: Can still jump for 6 frames after leaving platform
- Jump buffer: Jump input is remembered for 8 frames before landing

DOUBLE JUMP:
- Unique animation (spin, flip, or burst effect)
- Particle burst at point of double jump
- Refreshes on ground touch or wall contact

WALL MECHANICS:
- Wall slide: Reduced fall speed, character presses against wall, scraping particles
- Wall jump: Push off animation, particles from wall, brief inverted horizontal velocity

DASH:
- Anticipation: 2 frame wind-up with body compression
- Execution: Horizontal stretch effect, motion blur trail, invincibility
- Recovery: Body snaps back to normal proportions
- Particles: Burst at start, trail during dash
```

## Animation System

```
Build an animation system with these properties:

KEYFRAME STRUCTURE:
Each animation is an array of keyframes with properties like:
{
  bodyY: 0,          // Vertical offset
  bodyScaleX: 1,     // Horizontal squash/stretch
  bodyScaleY: 1,     // Vertical squash/stretch
  bodyRotation: 0,   // Tilt in degrees
  headY: 0,          // Head offset from body
  headRotation: 0,   // Head tilt
  armLAngle: 0,      // Left arm rotation
  armRAngle: 0,      // Right arm rotation
  legLAngle: 0,      // Left leg rotation
  legRAngle: 0,      // Right leg rotation
  capePoints: [...], // Bezier control points for cape
}

INTERPOLATION:
- Use easeInOut for most transitions: t < 0.5 ? 2*t*t : 1 - pow(-2*t + 2, 2) / 2
- Use easeOut for impacts: 1 - pow(1 - t, 3)
- Use easeIn for anticipation: t * t * t
- Use spring/elastic for bouncy elements: sin(t * PI * bounces) * pow(1-t, damping)

STATE MACHINE:
- Track current state, previous state, and frame within state
- Blend between states over 4-8 frames when transitioning
- Priority system: damage > dash > attack > jump/fall > run > idle

FRAME COUNTS:
- Idle: 48 frames (slow breathing cycle)
- Run: 24-32 frames (full stride cycle)
- Jump ascent: 12-16 frames
- Fall: 12 frames (looping)
- Land: 10-12 frames
- Dash: 10-12 frames
- Attack: 16-24 frames (wind-up, strike, follow-through)

SECONDARY MOTION:
All secondary elements (cape, hair, tail, accessories) should:
- Follow primary motion with 4-8 frame delay
- Have their own momentum that overshoots and settles
- Respond to velocity (stream behind during movement)
- Have subtle idle animation even when character is still
```

## Particle System

```
Implement a particle system with these capabilities:

PARTICLE STRUCTURE:
{
  x, y,           // Position
  vx, vy,         // Velocity
  ax, ay,         // Acceleration (usually 0, gravity)
  life,           // Current life (0-1, decrements)
  maxLife,        // Starting life (for calculating ratios)
  size,           // Current size
  startSize,      // Size at spawn
  endSize,        // Size at death
  color,          // Current color (can interpolate)
  startColor,     // Color at spawn
  endColor,       // Color at death
  alpha,          // Current opacity
  rotation,       // Current rotation
  rotationSpeed,  // Rotation per frame
}

UPDATE LOOP:
- Apply acceleration to velocity
- Apply velocity to position
- Decrement life by (1/60) / maxLife
- Interpolate size between startSize and endSize based on life
- Interpolate color if start/end colors differ
- Interpolate alpha (usually 1 -> 0)
- Remove particles with life <= 0

EMITTER TYPES:
- Burst: Spawn N particles instantly with randomized velocities
- Stream: Spawn particles continuously at a rate
- Trail: Spawn particles at moving object's position each frame

SPAWN WITH VARIATION:
- Velocity: Base velocity +/- random spread
- Angle: Base angle +/- random arc
- Size: Base size * (0.5 + random * 0.5)
- Life: Base life * (0.8 + random * 0.4)
- Color: Can pick from palette or randomize hue slightly

PARTICLE PRESETS NEEDED:
- Dust (landing, running): Gray/brown, small, drift outward and down
- Magic (abilities, pickups): Saturated color, glow, float upward
- Impact (hits): White/enemy color, burst outward, fast fade
- Trail (dash, projectiles): Match source color, spawn along path, medium fade
- Ambient (atmosphere): Zone-colored, very slow drift, long life, subtle
- Death (enemy death): Enemy color, large burst, dramatic spread
```

## Environment Rendering

```
Create environments with these layered elements:

BACKGROUND LAYERS (back to front):
1. Sky/distant background (slowest parallax, 0.1x scroll speed)
   - Gradient fill, possibly with distant silhouettes
   - Barely moves, establishes horizon

2. Far background (0.3x scroll speed)
   - Mountains, distant trees, architecture silhouettes
   - Desaturated, low contrast, blue-shifted
   - Simple shapes, no detail

3. Mid background (0.5x scroll speed)
   - Closer environmental features
   - More detail than far background
   - Still muted compared to gameplay layer

4. Near background (0.7x scroll speed)
   - Immediate environment context
   - Higher saturation, more contrast
   - May include decorative non-collidable elements

5. Gameplay layer (1.0x scroll speed)
   - All platforms, hazards, interactive elements
   - Highest contrast, clearest silhouettes
   - Player, enemies, projectiles

6. Near foreground (1.3x scroll speed)
   - Elements that pass in front of gameplay
   - Grass blades, hanging vines, fog wisps
   - Partially transparent to not obscure action

7. Particle layer (1.0x scroll speed, rendered last)
   - All particle effects
   - Ambient particles span multiple depths

ENVIRONMENTAL ANIMATION:
- Plants sway with sin(time * speed + offset) for variation
- Water surfaces ripple with layered sine waves
- Light sources pulse subtly (0.9 to 1.1 intensity)
- Distant elements drift very slowly
- Fog/mist layers scroll at different rates

ATMOSPHERIC EFFECTS:
- Ambient particles always present (density varies by zone)
- Color grade entire scene based on zone mood
- Vignette (darker edges) for focus
- Optional fog layers between parallax depths
```

## Screen Effects

```
Implement these screen-level effects:

SCREEN SHAKE:
- Maintain trauma value (0-1) that decays over time
- Each impact adds to trauma (small hit: +0.2, big hit: +0.5, boss hit: +0.8)
- Shake offset = trauma² * maxShake * random direction
- Decay: trauma *= 0.9 each frame (or trauma -= 0.05)
- Apply offset to entire game container transform

HIT STOP:
- On significant impacts, pause game updates for N frames
- Visual time stops but input is still read (for buffering)
- Duration: 3 frames for normal hits, 6-10 for critical/boss
- Can selectively freeze only combat participants, not whole game

SCREEN FLASH:
- Full-screen color overlay with high initial opacity
- Fade out over 6-12 frames
- White flash: pickups, level transitions, boss phases
- Red flash: player damage
- Use mix-blend-mode or transparent overlay div

SLOW MOTION:
- Reduce game speed by processing fewer updates
- During slowmo: process every 2nd or 3rd frame
- Duration: 20-60 frames for dramatic moments
- Use for: boss phase changes, final kills, near-death

CHROMATIC ABERRATION (optional):
- Offset red and blue channels slightly at screen edges
- Intensity based on game events or constant subtle amount
- Implemented via multiple offset renders or shader

BLOOM/GLOW:
- For SVG: Duplicate glowing element, apply blur filter, place behind original
- For Canvas: Draw blurred version at lower opacity, then sharp version on top
- Intensity can pulse for magical effects
```

## Lighting System

```
Create lighting effects using these techniques:

RIM LIGHTING (per character/object):
- Add a lighter stroke or secondary shape along one edge
- Edge position based on global light direction
- Can be static or follow a moving light source
- Implementation: Offset duplicate with lighter color, mask to edge

GLOW EFFECTS:
- Layer 1: Large blurred shape, low opacity, saturated color
- Layer 2: Medium blurred shape, medium opacity
- Layer 3: Small sharp shape, full opacity, core color
- Pulse all layers in sync for living glow

POINT LIGHTS (SVG approach):
- Create radial gradient from light position
- Gradient: light color at center -> transparent at radius
- Apply as overlay or use to modulate existing colors
- Multiple lights = multiple gradient overlays

SHADOWS:
- Simple: Ellipse beneath character, dark color, low opacity, blur filter
- Shadow offset slightly based on light direction
- Scale shadow based on character height above ground

AMBIENT LIGHT:
- Overall color tint applied to scene
- Warmer in safe areas, cooler in dangerous areas
- Can shift gradually as player moves through zones

EMISSIVE OBJECTS:
- Objects that appear to emit light (torches, crystals, character abilities)
- Glow layers as described above
- Cast "light" on nearby surfaces via gradient overlays
- Animate intensity with subtle pulsing
```

---

# Part Three: Quality Check Prompts

Use these to review and improve existing implementations:

## Animation Quality Check

```
Review the current animations and improve them:

For each animation state, verify:
1. Does it have enough frames for smooth motion? (minimum 12, prefer 24+)
2. Is there easing on all transitions? (no linear movement)
3. Does the idle have visible breathing/life?
4. Do impacts have squash? Do fast movements have stretch?
5. Is there anticipation before major actions?
6. Is there follow-through after major actions?
7. Do secondary elements (cape, hair) have delayed response?
8. Are transitions between states smooth, not instant?

Add what's missing. Increase frame counts where motion looks choppy. Add secondary motion where characters feel stiff.
```

## Particle Check

```
Review all game events and ensure appropriate particles:

Events that MUST have particles:
- Player footsteps while running
- Player jump (ground dust)
- Player land (ground dust + impact)
- Player dash (burst + trail)
- Player damage (hit sparks)
- Enemy damage (hit sparks in enemy color)
- Enemy death (burst in enemy color)
- Projectile travel (trail)
- Projectile impact (burst)
- Powerup collection (burst + floating motes)
- Ability activation (varies by ability)
- Ambient atmosphere (always present)

For each particle type, verify:
1. Does it spawn enough particles to be visible but not overwhelming?
2. Do particles have appropriate lifetime (not too short, not lingering)?
3. Do particles have size and alpha fade over lifetime?
4. Are colors appropriate to the source?
5. Is there velocity variation for organic look?
```

## Feel Check

```
Test the game and evaluate feel:

INPUT RESPONSE:
- Does movement feel responsive? (should reach speed within 8-12 frames)
- Does jumping feel snappy? (should leave ground within 4 frames of input)
- Does landing feel impactful? (should see squash + particles + sound)
- Is there coyote time? (can jump briefly after leaving platform?)
- Is there jump buffering? (can press jump before landing?)

VISUAL FEEDBACK:
- Does every hit have visible feedback? (particles, flash, shake)
- Are impacts punctuated with hit stop?
- Does the screen shake on major events?
- Are damage events clearly communicated?
- Do pickups have satisfying collection effects?

FLUIDITY:
- Does the character ever feel stiff or robotic?
- Do state transitions look smooth?
- Is there secondary motion on appendages?
- Does the environment feel alive (swaying, particles, animation)?
- Are there any jarring instant changes that should be smoothed?

Identify the three weakest areas and improve them.
```

---

# Part Four: Terminology Quick Reference

When you need a specific effect, use these terms:

**For smoother motion:** "Add easing functions" "Increase frame count" "Add interpolation between keyframes" "Implement tweening"

**For weightier feel:** "Add squash and stretch" "Implement anticipation frames" "Add landing recovery" "Include follow-through animation"

**For livelier characters:** "Add secondary motion" "Implement cloth/cape physics" "Add breathing to idle" "Make eyes track movement"

**For better feedback:** "Add screen shake with trauma decay" "Implement hit stop on impacts" "Add particle bursts on events" "Include screen flash on damage"

**For richer environments:** "Add parallax layers" "Implement atmospheric perspective" "Add ambient particles" "Include environmental animation"

**For better lighting:** "Add rim lighting to characters" "Implement glow with layered blurs" "Add point light gradients" "Include dynamic shadows"

**For responsive controls:** "Add coyote time" "Implement jump buffering" "Use acceleration curves" "Add variable jump height"

---

# Part Five: Example Conversation Flow

Here's how a development conversation might go:

**You:** Create a player character for a 2D platformer using SVG. The character should be a small spirit-like creature similar to Ori.

**AI:** [Creates basic SVG character]

**You:** The character feels static. Add breathing animation to idle, make the glow pulse gently, and add a wispy tail that follows movement with spring physics.

**AI:** [Adds animations]

**You:** Movement feels robotic. Implement acceleration curves so the character takes 10 frames to reach full speed. Add dust particles on footsteps. The character needs squash on landing and stretch during fast horizontal movement.

**AI:** [Improves movement]

**You:** Jumping lacks weight. Add a 3-frame anticipation crouch, make the character's limbs spread during ascent, and implement coyote time (6 frames) and jump buffering (8 frames).

**AI:** [Improves jumping]

**You:** The environment is flat. Add 4 parallax background layers, ambient floating particles, and make all plants sway gently. Distant layers should be desaturated.

**AI:** [Improves environment]

**You:** Hits don't feel impactful. Add 4-frame hit stop, screen shake with trauma decay, particle bursts in the enemy's color, and a brief white flash on the enemy sprite.

**AI:** [Adds feedback]

This iterative approach, using the specific terminology from this guide, will progressively build toward the quality you want.

---

# Conclusion

The key to achieving Ori-level polish with code-based rendering is:

1. **Be specific in your requests.** Use the terminology. Ask for "squash and stretch" not "make it bouncier."

2. **Iterate relentlessly.** Each pass should identify what feels wrong and specifically address it.

3. **Layer effects.** Polish comes from many small things, not one big thing. Particles AND easing AND secondary motion AND screen shake AND hit stop.

4. **Prioritize feel over complexity.** A character that moves well is better than a detailed character that moves poorly.

5. **Reference constantly.** Record Ori footage, step through frame by frame, and describe what you see when requesting features.

Everything in this document can be achieved with pure code: SVG paths, Canvas drawing, CSS transforms, and JavaScript logic. No external assets required. The techniques are the same whether you're rendering pixels or vectors.

The goal is not to copy Ori. The goal is to understand WHY Ori feels the way it does, then apply those principles to your own creation.

---

*Instruction guide for AI-assisted game development.*
*All techniques achievable with code-based rendering.*
