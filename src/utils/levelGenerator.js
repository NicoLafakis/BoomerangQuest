import { ZONE_WIDTH, TOTAL_ZONES } from '../constants/gameConstants';
import { randomInt } from './collision';

// Generate platforms for each zone
export function generateZonePlatforms(zoneIndex) {
  const platforms = [];
  const zoneStart = zoneIndex * ZONE_WIDTH;
  
  // Ground platform (always present)
  platforms.push({
    x: zoneStart,
    y: 600,
    width: ZONE_WIDTH,
    height: 75,
    type: 'ground'
  });
  
  // Zone-specific platform generation
  switch (zoneIndex) {
    case 0: // Whispering Woods - natural, organic platforms
      generateWoodsPlatforms(platforms, zoneStart);
      break;
    case 1: // Frozen Crypts - structured, angular
      generateCryptPlatforms(platforms, zoneStart);
      break;
    case 2: // Infernal Halls - dangerous, with hazards
      generateInfernalPlatforms(platforms, zoneStart);
      break;
    case 3: // Haunted Castle - architectural
      generateCastlePlatforms(platforms, zoneStart);
      break;
  }
  
  return platforms;
}

function generateWoodsPlatforms(platforms, zoneStart) {
  // Fallen logs and root platforms
  const configs = [
    { x: 150, y: 480, width: 180, height: 25 },
    { x: 400, y: 400, width: 150, height: 20 },
    { x: 650, y: 350, width: 200, height: 25 },
    { x: 950, y: 450, width: 160, height: 22 },
    { x: 1200, y: 380, width: 180, height: 25 },
    { x: 1500, y: 320, width: 140, height: 20 },
    { x: 1750, y: 420, width: 200, height: 25 },
    { x: 2000, y: 500, width: 150, height: 22 },
  ];
  
  configs.forEach(config => {
    platforms.push({
      x: zoneStart + config.x,
      y: config.y,
      width: config.width,
      height: config.height,
      type: 'log'
    });
  });
  
  // Add some wall sections (large trees)
  platforms.push({
    x: zoneStart + 300,
    y: 400,
    width: 40,
    height: 200,
    type: 'wall'
  });
  
  platforms.push({
    x: zoneStart + 1100,
    y: 350,
    width: 45,
    height: 250,
    type: 'wall'
  });
  
  platforms.push({
    x: zoneStart + 1900,
    y: 380,
    width: 40,
    height: 220,
    type: 'wall'
  });
}

function generateCryptPlatforms(platforms, zoneStart) {
  // Stone ledges and frozen surfaces
  const configs = [
    { x: 100, y: 500, width: 200, height: 30 },
    { x: 350, y: 420, width: 180, height: 25 },
    { x: 600, y: 350, width: 220, height: 30 },
    { x: 900, y: 280, width: 160, height: 25 },
    { x: 1150, y: 380, width: 200, height: 30 },
    { x: 1400, y: 450, width: 180, height: 25 },
    { x: 1700, y: 350, width: 200, height: 30 },
    { x: 1950, y: 420, width: 180, height: 25 },
  ];
  
  configs.forEach(config => {
    platforms.push({
      x: zoneStart + config.x,
      y: config.y,
      width: config.width,
      height: config.height,
      type: 'stone'
    });
  });
  
  // Ice pillars for wall jumping
  platforms.push({
    x: zoneStart + 500,
    y: 350,
    width: 35,
    height: 250,
    type: 'wall'
  });
  
  platforms.push({
    x: zoneStart + 850,
    y: 280,
    width: 35,
    height: 320,
    type: 'wall'
  });
  
  platforms.push({
    x: zoneStart + 1600,
    y: 320,
    width: 40,
    height: 280,
    type: 'wall'
  });
}

function generateInfernalPlatforms(platforms, zoneStart) {
  // Rocky platforms with lava gaps
  const configs = [
    { x: 120, y: 480, width: 180, height: 30 },
    { x: 400, y: 400, width: 150, height: 25 },
    { x: 700, y: 320, width: 200, height: 30 },
    { x: 1000, y: 400, width: 180, height: 28 },
    { x: 1300, y: 350, width: 160, height: 25 },
    { x: 1550, y: 280, width: 200, height: 30 },
    { x: 1850, y: 380, width: 180, height: 28 },
    { x: 2050, y: 450, width: 140, height: 25 },
  ];
  
  configs.forEach(config => {
    platforms.push({
      x: zoneStart + config.x,
      y: config.y,
      width: config.width,
      height: config.height,
      type: 'rock'
    });
  });
  
  // Lava hazards
  const hazards = [
    { x: 320, y: 580, width: 80, height: 20 },
    { x: 580, y: 580, width: 100, height: 20 },
    { x: 920, y: 580, width: 80, height: 20 },
    { x: 1200, y: 580, width: 90, height: 20 },
    { x: 1480, y: 580, width: 70, height: 20 },
    { x: 1780, y: 580, width: 80, height: 20 },
  ];
  
  hazards.forEach(hazard => {
    platforms.push({
      x: zoneStart + hazard.x,
      y: hazard.y,
      width: hazard.width,
      height: hazard.height,
      type: 'hazard'
    });
  });
  
  // Stone walls
  platforms.push({
    x: zoneStart + 250,
    y: 380,
    width: 40,
    height: 220,
    type: 'wall'
  });
  
  platforms.push({
    x: zoneStart + 1150,
    y: 350,
    width: 45,
    height: 250,
    type: 'wall'
  });
}

function generateCastlePlatforms(platforms, zoneStart) {
  // Castle architecture - balconies, parapets
  const configs = [
    { x: 100, y: 500, width: 220, height: 35 },
    { x: 380, y: 400, width: 200, height: 30 },
    { x: 650, y: 320, width: 180, height: 30 },
    { x: 900, y: 420, width: 200, height: 35 },
    { x: 1180, y: 350, width: 180, height: 30 },
    { x: 1450, y: 280, width: 220, height: 35 },
    { x: 1750, y: 400, width: 200, height: 30 },
    { x: 2000, y: 320, width: 180, height: 30 },
  ];
  
  configs.forEach(config => {
    platforms.push({
      x: zoneStart + config.x,
      y: config.y,
      width: config.width,
      height: config.height,
      type: 'castle'
    });
  });
  
  // Castle walls/pillars
  platforms.push({
    x: zoneStart + 200,
    y: 350,
    width: 50,
    height: 250,
    type: 'wall'
  });
  
  platforms.push({
    x: zoneStart + 800,
    y: 320,
    width: 50,
    height: 280,
    type: 'wall'
  });
  
  platforms.push({
    x: zoneStart + 1350,
    y: 280,
    width: 50,
    height: 320,
    type: 'wall'
  });
  
  platforms.push({
    x: zoneStart + 1900,
    y: 320,
    width: 50,
    height: 280,
    type: 'wall'
  });
}

// Generate boss arena platforms
export function generateBossArena() {
  const arenaStart = TOTAL_ZONES * ZONE_WIDTH;
  const platforms = [];
  
  // Main floor
  platforms.push({
    x: arenaStart,
    y: 600,
    width: 1000,
    height: 75,
    type: 'arena'
  });
  
  // Floating platforms for dodging
  platforms.push({
    x: arenaStart + 150,
    y: 450,
    width: 150,
    height: 25,
    type: 'arena'
  });
  
  platforms.push({
    x: arenaStart + 700,
    y: 450,
    width: 150,
    height: 25,
    type: 'arena'
  });
  
  platforms.push({
    x: arenaStart + 425,
    y: 320,
    width: 150,
    height: 25,
    type: 'arena'
  });
  
  // Side walls
  platforms.push({
    x: arenaStart - 50,
    y: 0,
    width: 50,
    height: 675,
    type: 'wall'
  });
  
  platforms.push({
    x: arenaStart + 1000,
    y: 0,
    width: 50,
    height: 675,
    type: 'wall'
  });
  
  return platforms;
}

// Get all platforms
export function getAllPlatforms() {
  let allPlatforms = [];
  
  for (let i = 0; i < TOTAL_ZONES; i++) {
    allPlatforms = allPlatforms.concat(generateZonePlatforms(i));
  }
  
  allPlatforms = allPlatforms.concat(generateBossArena());
  
  return allPlatforms;
}
