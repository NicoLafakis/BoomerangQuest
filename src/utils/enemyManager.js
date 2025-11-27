import { ZONE_WIDTH, TOTAL_ZONES, ENEMY_TYPES, MINI_BOSS_MULTIPLIER } from '../constants/gameConstants';
import { randomInt, randomRange } from './collision';

let enemyIdCounter = 0;

function createEnemy(type, x, y, isBoss = false) {
  const stats = ENEMY_TYPES[type];
  const multiplier = isBoss ? MINI_BOSS_MULTIPLIER : { health: 1, size: 1, damage: 1, score: 1 };
  
  return {
    id: enemyIdCounter++,
    type,
    x,
    y,
    width: stats.width * multiplier.size,
    height: stats.height * multiplier.size,
    health: stats.health * multiplier.health,
    maxHealth: stats.health * multiplier.health,
    damage: stats.damage * multiplier.damage,
    speed: stats.speed,
    score: stats.score * multiplier.score,
    color: stats.color,
    isBoss,
    velocityX: 0,
    velocityY: 0,
    direction: Math.random() > 0.5 ? 1 : -1,
    state: 'patrol',
    stateTimer: 0,
    animationFrame: 0,
    opacity: 1,
    phaseTimer: 0,
    aggroRange: 300,
    dead: false,
    hitFlash: 0
  };
}

export function generateZoneEnemies(zoneIndex) {
  const enemies = [];
  const zoneStart = zoneIndex * ZONE_WIDTH;
  
  switch (zoneIndex) {
    case 0: // Whispering Woods
      generateWoodsEnemies(enemies, zoneStart);
      break;
    case 1: // Frozen Crypts
      generateCryptEnemies(enemies, zoneStart);
      break;
    case 2: // Infernal Halls
      generateInfernalEnemies(enemies, zoneStart);
      break;
    case 3: // Haunted Castle
      generateCastleEnemies(enemies, zoneStart);
      break;
  }
  
  return enemies;
}

function generateWoodsEnemies(enemies, zoneStart) {
  // Skeletons - ground patrol
  const skeletonPositions = [200, 500, 800, 1100, 1500, 1800, 2000];
  skeletonPositions.forEach(x => {
    enemies.push(createEnemy('SKELETON', zoneStart + x, 550));
  });
  
  // Bats - aerial threats
  const batPositions = [
    { x: 350, y: 300 },
    { x: 600, y: 250 },
    { x: 900, y: 320 },
    { x: 1300, y: 280 },
    { x: 1650, y: 300 },
    { x: 1950, y: 260 },
  ];
  batPositions.forEach(pos => {
    enemies.push(createEnemy('BAT', zoneStart + pos.x, pos.y));
  });
}

function generateCryptEnemies(enemies, zoneStart) {
  // Zombies - slow but tough
  const zombiePositions = [250, 600, 1000, 1400, 1800];
  zombiePositions.forEach(x => {
    enemies.push(createEnemy('ZOMBIE', zoneStart + x, 545));
  });
  
  // Skeletons
  const skeletonPositions = [400, 800, 1200, 1600, 2000];
  skeletonPositions.forEach(x => {
    enemies.push(createEnemy('SKELETON', zoneStart + x, 550));
  });
  
  // Ghosts - phasing enemies
  const ghostPositions = [
    { x: 450, y: 350 },
    { x: 750, y: 280 },
    { x: 1100, y: 320 },
    { x: 1500, y: 280 },
    { x: 1900, y: 340 },
  ];
  ghostPositions.forEach(pos => {
    enemies.push(createEnemy('GHOST', zoneStart + pos.x, pos.y));
  });
  
  // Mini-boss: Frost Knight near zone end
  enemies.push(createEnemy('KNIGHT', zoneStart + 2050, 540, true));
}

function generateInfernalEnemies(enemies, zoneStart) {
  // Demons - aerial chasers
  const demonPositions = [
    { x: 300, y: 300 },
    { x: 650, y: 250 },
    { x: 1000, y: 280 },
    { x: 1350, y: 220 },
    { x: 1700, y: 300 },
  ];
  demonPositions.forEach(pos => {
    enemies.push(createEnemy('DEMON', zoneStart + pos.x, pos.y));
  });
  
  // Hellhounds - fast ground units
  const hellhoundPositions = [200, 550, 900, 1250, 1600, 1950];
  hellhoundPositions.forEach(x => {
    enemies.push(createEnemy('HELLHOUND', zoneStart + x, 565));
  });
  
  // Wraiths - phasing specters
  const wraithPositions = [
    { x: 400, y: 350 },
    { x: 800, y: 300 },
    { x: 1200, y: 280 },
    { x: 1550, y: 320 },
  ];
  wraithPositions.forEach(pos => {
    enemies.push(createEnemy('WRAITH', zoneStart + pos.x, pos.y));
  });
  
  // Mini-boss: Large Gargoyle
  enemies.push(createEnemy('GARGOYLE', zoneStart + 2000, 300, true));
}

function generateCastleEnemies(enemies, zoneStart) {
  // Knights - heavy units
  const knightPositions = [300, 700, 1100, 1500, 1900];
  knightPositions.forEach(x => {
    enemies.push(createEnemy('KNIGHT', zoneStart + x, 540));
  });
  
  // Gargoyles - swooping threats
  const gargoylePositions = [
    { x: 450, y: 280 },
    { x: 850, y: 250 },
    { x: 1250, y: 300 },
    { x: 1650, y: 260 },
  ];
  gargoylePositions.forEach(pos => {
    enemies.push(createEnemy('GARGOYLE', zoneStart + pos.x, pos.y));
  });
  
  // Wraiths
  const wraithPositions = [
    { x: 550, y: 320 },
    { x: 950, y: 280 },
    { x: 1400, y: 300 },
    { x: 1800, y: 280 },
  ];
  wraithPositions.forEach(pos => {
    enemies.push(createEnemy('WRAITH', zoneStart + pos.x, pos.y));
  });
  
  // Mini-boss: Elite Gargoyle before boss
  enemies.push(createEnemy('GARGOYLE', zoneStart + 2050, 280, true));
}

export function getAllEnemies() {
  let allEnemies = [];
  
  for (let i = 0; i < TOTAL_ZONES; i++) {
    allEnemies = allEnemies.concat(generateZoneEnemies(i));
  }
  
  return allEnemies;
}

export function updateEnemy(enemy, player, platforms, deltaTime) {
  const normalizedDelta = deltaTime / 16.67;
  
  // Update timers
  enemy.stateTimer++;
  enemy.animationFrame = (enemy.animationFrame + 0.1 * normalizedDelta) % 4;
  if (enemy.hitFlash > 0) enemy.hitFlash--;
  
  // Update based on type
  switch (enemy.type) {
    case 'SKELETON':
    case 'ZOMBIE':
    case 'KNIGHT':
      updateGroundEnemy(enemy, player, platforms, normalizedDelta);
      break;
    case 'BAT':
      updateBat(enemy, normalizedDelta);
      break;
    case 'GHOST':
    case 'WRAITH':
      updatePhasingEnemy(enemy, player, normalizedDelta);
      break;
    case 'DEMON':
      updateChaser(enemy, player, normalizedDelta);
      break;
    case 'HELLHOUND':
      updateHellhound(enemy, player, platforms, normalizedDelta);
      break;
    case 'GARGOYLE':
      updateGargoyle(enemy, player, normalizedDelta);
      break;
  }
}

function updateGroundEnemy(enemy, player, platforms, delta) {
  // Simple patrol behavior
  enemy.x += enemy.speed * enemy.direction * delta;
  
  // Reverse at edges or walls
  if (enemy.stateTimer > 120) {
    enemy.direction *= -1;
    enemy.stateTimer = 0;
  }
  
  // Apply gravity
  enemy.velocityY += 0.5 * delta;
  enemy.y += enemy.velocityY * delta;
  
  // Ground collision
  platforms.forEach(platform => {
    if (platform.type !== 'hazard' && platform.type !== 'wall') {
      if (enemy.x + enemy.width > platform.x && 
          enemy.x < platform.x + platform.width &&
          enemy.y + enemy.height > platform.y &&
          enemy.y + enemy.height < platform.y + platform.height + 20) {
        enemy.y = platform.y - enemy.height;
        enemy.velocityY = 0;
      }
    }
  });
}

function updateBat(enemy, delta) {
  // Sine wave movement
  enemy.x += enemy.speed * enemy.direction * delta;
  enemy.y += Math.sin(enemy.stateTimer * 0.05) * 2 * delta;
  
  // Reverse direction periodically
  if (enemy.stateTimer > 180) {
    enemy.direction *= -1;
    enemy.stateTimer = 0;
  }
}

function updatePhasingEnemy(enemy, player, delta) {
  // Phase in and out
  enemy.phaseTimer += delta;
  enemy.opacity = 0.3 + Math.sin(enemy.phaseTimer * 0.03) * 0.7;
  
  // Drift toward player when visible
  if (enemy.opacity > 0.5) {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < enemy.aggroRange && dist > 0) {
      enemy.x += (dx / dist) * enemy.speed * delta;
      enemy.y += (dy / dist) * enemy.speed * 0.5 * delta;
    }
  }
  
  // Float up and down
  enemy.y += Math.sin(enemy.stateTimer * 0.03) * 0.8 * delta;
}

function updateChaser(enemy, player, delta) {
  // Actively chase player
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  if (dist < enemy.aggroRange && dist > 0) {
    enemy.x += (dx / dist) * enemy.speed * delta;
    enemy.y += (dy / dist) * enemy.speed * delta;
    enemy.direction = dx > 0 ? 1 : -1;
  } else {
    // Patrol
    enemy.x += enemy.speed * 0.5 * enemy.direction * delta;
    enemy.y += Math.sin(enemy.stateTimer * 0.04) * delta;
    
    if (enemy.stateTimer > 120) {
      enemy.direction *= -1;
      enemy.stateTimer = 0;
    }
  }
}

function updateHellhound(enemy, player, platforms, delta) {
  const dx = player.x - enemy.x;
  const dist = Math.abs(dx);
  
  // Charge if player is close
  if (dist < enemy.aggroRange) {
    enemy.direction = dx > 0 ? 1 : -1;
    enemy.x += enemy.speed * enemy.direction * delta;
  } else {
    // Patrol slower
    enemy.x += enemy.speed * 0.3 * enemy.direction * delta;
    if (enemy.stateTimer > 100) {
      enemy.direction *= -1;
      enemy.stateTimer = 0;
    }
  }
  
  // Apply gravity
  enemy.velocityY += 0.5 * delta;
  enemy.y += enemy.velocityY * delta;
  
  // Ground collision
  platforms.forEach(platform => {
    if (platform.type !== 'hazard' && platform.type !== 'wall') {
      if (enemy.x + enemy.width > platform.x && 
          enemy.x < platform.x + platform.width &&
          enemy.y + enemy.height > platform.y &&
          enemy.y + enemy.height < platform.y + platform.height + 20) {
        enemy.y = platform.y - enemy.height;
        enemy.velocityY = 0;
      }
    }
  });
}

function updateGargoyle(enemy, player, delta) {
  // Swoop attack pattern
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  if (enemy.state === 'patrol') {
    // Circle around
    enemy.x += Math.cos(enemy.stateTimer * 0.02) * enemy.speed * delta;
    enemy.y += Math.sin(enemy.stateTimer * 0.02) * enemy.speed * 0.5 * delta;
    
    // Start swoop if player is below
    if (dist < enemy.aggroRange && dy > 50) {
      enemy.state = 'swoop';
      enemy.stateTimer = 0;
    }
  } else if (enemy.state === 'swoop') {
    // Dive toward player
    if (dist > 0) {
      enemy.x += (dx / dist) * enemy.speed * 1.5 * delta;
      enemy.y += (dy / dist) * enemy.speed * 2 * delta;
    }
    
    // End swoop
    if (enemy.stateTimer > 60 || enemy.y > 550) {
      enemy.state = 'rise';
      enemy.stateTimer = 0;
    }
  } else if (enemy.state === 'rise') {
    // Rise back up
    enemy.y -= enemy.speed * delta;
    
    if (enemy.y < 250 || enemy.stateTimer > 90) {
      enemy.state = 'patrol';
      enemy.stateTimer = 0;
    }
  }
  
  enemy.direction = dx > 0 ? 1 : -1;
}
