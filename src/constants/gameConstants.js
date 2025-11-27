// Game Constants
export const GAME_WIDTH = 1200;
export const GAME_HEIGHT = 675;

// Player Constants
export const PLAYER_WIDTH = 40;
export const PLAYER_HEIGHT = 60;
export const PLAYER_SPEED = 5;
export const PLAYER_JUMP_FORCE = 15;
export const PLAYER_MAX_HEALTH = 100;
export const GRAVITY = 0.6;
export const MAX_FALL_SPEED = 12;
export const DASH_SPEED = 20;
export const DASH_DURATION = 8;
export const DASH_COOLDOWN = 30;
export const WALL_SLIDE_SPEED = 2;
export const WALL_JUMP_FORCE_X = 10;
export const WALL_JUMP_FORCE_Y = 14;
export const INVINCIBILITY_FRAMES = 60;

// Boomerang Constants
export const BOOMERANG_SPEED = 12;
export const BOOMERANG_MAX_DISTANCE = 400;
export const BOOMERANG_RETURN_SPEED = 15;
export const BOOMERANG_SIZE = 20;
export const BOOMERANG_DAMAGE = 20;
export const BOOMERANG_CHARGE_TIME = 45;
export const BOOMERANG_CHARGED_DAMAGE = 40;
export const BOOMERANG_CHARGED_SPEED = 18;

// Zone Constants
export const ZONE_WIDTH = 2200;
export const TOTAL_ZONES = 4;
export const ZONE_NAMES = ['Whispering Woods', 'Frozen Crypts', 'Infernal Halls', 'Haunted Castle'];

// Enemy Base Stats
export const ENEMY_TYPES = {
  SKELETON: {
    width: 35,
    height: 50,
    health: 40,
    damage: 10,
    speed: 1.5,
    score: 100,
    color: '#d4c4a8'
  },
  BAT: {
    width: 30,
    height: 20,
    health: 20,
    damage: 5,
    speed: 3,
    score: 75,
    color: '#4a3728'
  },
  ZOMBIE: {
    width: 40,
    height: 55,
    health: 80,
    damage: 15,
    speed: 1,
    score: 150,
    color: '#3d5c4a'
  },
  GHOST: {
    width: 35,
    height: 45,
    health: 30,
    damage: 12,
    speed: 2,
    score: 125,
    color: '#8fa4b8'
  },
  DEMON: {
    width: 40,
    height: 40,
    health: 60,
    damage: 18,
    speed: 4,
    score: 200,
    color: '#8b2500'
  },
  HELLHOUND: {
    width: 50,
    height: 35,
    health: 50,
    damage: 20,
    speed: 6,
    score: 175,
    color: '#5c1a1a'
  },
  WRAITH: {
    width: 35,
    height: 50,
    health: 45,
    damage: 15,
    speed: 2.5,
    score: 200,
    color: '#2d1b4e'
  },
  KNIGHT: {
    width: 45,
    height: 60,
    health: 120,
    damage: 25,
    speed: 1.2,
    score: 250,
    color: '#4a4a5e'
  },
  GARGOYLE: {
    width: 45,
    height: 45,
    health: 70,
    damage: 20,
    speed: 3.5,
    score: 225,
    color: '#5a5a6e'
  }
};

// Mini-Boss Stats
export const MINI_BOSS_MULTIPLIER = {
  health: 3,
  size: 1.5,
  damage: 1.5,
  score: 5
};

// Phantom King Stats
export const PHANTOM_KING = {
  width: 80,
  height: 120,
  maxHealth: 1000,
  phases: [
    { threshold: 0.7, speed: 2, attackInterval: 90 },
    { threshold: 0.4, speed: 3, attackInterval: 70 },
    { threshold: 0.2, speed: 4, attackInterval: 50 },
    { threshold: 0, speed: 5, attackInterval: 35 }
  ],
  attacks: {
    HOMING_BOLTS: { damage: 15, speed: 5, count: 2 },
    SPREAD_SHOT: { damage: 12, speed: 8, count: 5 },
    SWEEP: { damage: 20, speed: 6, height: 40 },
    RING: { damage: 10, speed: 6, count: 8 }
  }
};

// Zone Color Palettes
export const ZONE_PALETTES = {
  0: { // Whispering Woods
    background: ['#0d1a0d', '#1a2e1a', '#2d3d2d'],
    platform: '#3d2817',
    accent: '#4a5c3a',
    particle: '#8fa87a',
    fog: 'rgba(100, 120, 100, 0.3)'
  },
  1: { // Frozen Crypts
    background: ['#0a0f1a', '#1a2535', '#2a3a50'],
    platform: '#4a5a6a',
    accent: '#7a9ab8',
    particle: '#c4d4e8',
    fog: 'rgba(150, 180, 220, 0.3)'
  },
  2: { // Infernal Halls
    background: ['#1a0a0a', '#2d1515', '#4a2020'],
    platform: '#3d2d1d',
    accent: '#8b4500',
    particle: '#ff6a30',
    fog: 'rgba(180, 80, 30, 0.2)'
  },
  3: { // Haunted Castle
    background: ['#15101a', '#2a1d35', '#3d2850'],
    platform: '#4a3a5a',
    accent: '#7a5a9a',
    particle: '#a87ac4',
    fog: 'rgba(120, 80, 150, 0.3)'
  },
  4: { // Boss Arena
    background: ['#0a0508', '#150a10', '#200f18'],
    platform: '#2a1a2a',
    accent: '#8b0000',
    particle: '#ff3030',
    fog: 'rgba(100, 20, 20, 0.4)'
  }
};

// Audio Constants
export const ZONE_MUSIC_CONFIG = {
  0: { scale: 'major', key: 'C', bpm: 110 },
  1: { scale: 'minor', key: 'A', bpm: 120 },
  2: { scale: 'minor', key: 'D', bpm: 130 },
  3: { scale: 'minor', key: 'E', bpm: 130 },
  4: { scale: 'diminished', key: 'B', bpm: 140 }
};

// Combo System
export const COMBO_TIMEOUT = 120; // frames before combo resets
export const COMBO_MULTIPLIERS = [1, 1.5, 2, 2.5, 3, 4, 5];

// Powerup Types
export const POWERUP_TYPES = {
  HEALTH: { color: '#ff5555', effect: 'heal', value: 25, name: 'Health' },
  MAGIC: { color: '#5555ff', effect: 'magic', value: 25, name: 'Magic' },
  SPEED: { color: '#55ff55', effect: 'speed', duration: 300, name: 'Speed' },
  JUMP: { color: '#ffaa00', effect: 'jump', maxLevel: 4, name: 'Multi-Jump' }
};

// Powerup Constants
export const POWERUP_DROP_RATE = 0.12; // 12% chance to drop from enemies
export const POWERUP_SIZE = 30;
export const POWERUP_FLOAT_SPEED = 1;
export const POWERUP_LIFETIME = 600; // frames before despawn (10 seconds at 60fps)
