import * as PIXI from 'pixi.js'
import { GAME_WIDTH, GAME_HEIGHT } from '../Game'

/**
 * Level-themed backgrounds that progress from the National Mall to the Oval Office
 *
 * Level 1: National Mall - Outdoor, grass, Washington Monument in distance
 * Level 2: IRS Building - Office interior, cubicles, fluorescent lights
 * Level 3: Capitol Building - Marble halls, columns, red carpets
 * Level 4: Senate Chamber - Ornate chamber, benches, balconies
 * Level 5: Oval Office - Presidential office, Resolute Desk, blue carpet
 */

export type LevelTheme = 'national_mall' | 'irs_building' | 'capitol' | 'senate_chamber' | 'oval_office'

interface ThemeColors {
  floor: number
  floorAlt: number
  wall: number
  accent: number
  grid: number
}

const THEME_COLORS: Record<LevelTheme, ThemeColors> = {
  national_mall: {
    floor: 0x3d6b3d,      // Grass green
    floorAlt: 0x4a7a4a,   // Lighter grass
    wall: 0x87ceeb,       // Sky blue
    accent: 0xd4af37,     // Gold (monuments)
    grid: 0x2d5a2d,       // Dark grass lines
  },
  irs_building: {
    floor: 0x6b6b6b,      // Gray carpet
    floorAlt: 0x5a5a5a,   // Darker carpet
    wall: 0xb8b8a0,       // Beige walls
    accent: 0x4a4a4a,     // Dark gray (desks)
    grid: 0x555555,       // Carpet pattern
  },
  capitol: {
    floor: 0xd4c4b0,      // Marble tan
    floorAlt: 0xe8dcc8,   // Lighter marble
    wall: 0xf5f5dc,       // Cream walls
    accent: 0x8b0000,     // Dark red (carpet)
    grid: 0xc0b0a0,       // Marble veins
  },
  senate_chamber: {
    floor: 0x1a1a4a,      // Deep blue carpet
    floorAlt: 0x252560,   // Lighter blue
    wall: 0x8b7355,       // Wood panels
    accent: 0xffd700,     // Gold trim
    grid: 0x15153a,       // Carpet pattern
  },
  oval_office: {
    floor: 0x1a3a5c,      // Presidential blue carpet
    floorAlt: 0x254a6e,   // Lighter blue
    wall: 0xfaf0e6,       // Off-white walls
    accent: 0xffd700,     // Gold accents
    grid: 0x153050,       // Carpet pattern
  },
}

export function getLevelTheme(level: number): LevelTheme {
  switch (level) {
    case 1: return 'national_mall'
    case 2: return 'irs_building'
    case 3: return 'capitol'
    case 4: return 'senate_chamber'
    case 5: return 'oval_office'
    default: return 'oval_office'
  }
}

export function getLevelName(level: number): string {
  switch (level) {
    case 1: return 'National Mall'
    case 2: return 'IRS Headquarters'
    case 3: return 'Capitol Building'
    case 4: return 'Senate Chamber'
    case 5: return 'The Oval Office'
    default: return 'The Oval Office'
  }
}

export class LevelBackground {
  private graphics: PIXI.Graphics
  private decorations: PIXI.Container
  private currentTheme: LevelTheme | null = null

  constructor() {
    this.graphics = new PIXI.Graphics()
    this.decorations = new PIXI.Container()
  }

  getGraphics(): PIXI.Graphics {
    return this.graphics
  }

  getDecorations(): PIXI.Container {
    return this.decorations
  }

  draw(level: number): void {
    const theme = getLevelTheme(level)

    // Don't redraw if same theme
    if (theme === this.currentTheme) return
    this.currentTheme = theme

    this.graphics.clear()
    this.decorations.removeChildren()

    const colors = THEME_COLORS[theme]

    switch (theme) {
      case 'national_mall':
        this.drawNationalMall(colors)
        break
      case 'irs_building':
        this.drawIRSBuilding(colors)
        break
      case 'capitol':
        this.drawCapitol(colors)
        break
      case 'senate_chamber':
        this.drawSenateChamber(colors)
        break
      case 'oval_office':
        this.drawOvalOffice(colors)
        break
    }
  }

  private drawNationalMall(colors: ThemeColors): void {
    const g = this.graphics

    // Sky (top portion)
    g.beginFill(colors.wall)
    g.drawRect(0, 0, GAME_WIDTH, 100)
    g.endFill()

    // Grass field
    g.beginFill(colors.floor)
    g.drawRect(0, 100, GAME_WIDTH, GAME_HEIGHT - 100)
    g.endFill()

    // Grass pattern (lighter patches)
    for (let x = 0; x < GAME_WIDTH; x += 80) {
      for (let y = 120; y < GAME_HEIGHT; y += 80) {
        if ((x + y) % 160 === 0) {
          g.beginFill(colors.floorAlt, 0.5)
          g.drawEllipse(x + 40, y + 30, 35, 25)
          g.endFill()
        }
      }
    }

    // Path (walking area)
    g.beginFill(0xc4b59d, 0.6)
    g.drawRect(100, 200, GAME_WIDTH - 200, GAME_HEIGHT - 300)
    g.endFill()

    // Washington Monument in distance (simplified)
    g.beginFill(0xe8e8e8)
    g.moveTo(GAME_WIDTH / 2, 20)
    g.lineTo(GAME_WIDTH / 2 - 15, 90)
    g.lineTo(GAME_WIDTH / 2 + 15, 90)
    g.closePath()
    g.endFill()

    // Monument base
    g.beginFill(0xd0d0d0)
    g.drawRect(GAME_WIDTH / 2 - 20, 80, 40, 20)
    g.endFill()

    // Trees on sides
    this.drawTree(50, 150)
    this.drawTree(120, 180)
    this.drawTree(GAME_WIDTH - 70, 160)
    this.drawTree(GAME_WIDTH - 140, 190)

    // Border/fence
    g.lineStyle(4, 0x8b4513)
    g.drawRect(60, 160, GAME_WIDTH - 120, GAME_HEIGHT - 220)
  }

  private drawTree(x: number, y: number): void {
    const g = this.graphics

    // Trunk
    g.beginFill(0x8b4513)
    g.drawRect(x - 5, y, 10, 30)
    g.endFill()

    // Foliage
    g.beginFill(0x228b22)
    g.drawCircle(x, y - 10, 25)
    g.endFill()
    g.beginFill(0x2d8b2d)
    g.drawCircle(x - 15, y, 18)
    g.drawCircle(x + 15, y, 18)
    g.endFill()
  }

  private drawIRSBuilding(colors: ThemeColors): void {
    const g = this.graphics

    // Floor (carpet)
    g.beginFill(colors.floor)
    g.drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
    g.endFill()

    // Carpet pattern (grid)
    g.lineStyle(1, colors.grid, 0.3)
    for (let x = 0; x < GAME_WIDTH; x += 40) {
      g.moveTo(x, 0)
      g.lineTo(x, GAME_HEIGHT)
    }
    for (let y = 0; y < GAME_HEIGHT; y += 40) {
      g.moveTo(0, y)
      g.lineTo(GAME_WIDTH, y)
    }

    // Walls (top and sides)
    g.beginFill(colors.wall)
    g.drawRect(0, 0, GAME_WIDTH, 50)
    g.drawRect(0, 0, 50, GAME_HEIGHT)
    g.drawRect(GAME_WIDTH - 50, 0, 50, GAME_HEIGHT)
    g.endFill()

    // Cubicle walls
    g.beginFill(colors.accent)
    // Top row
    for (let x = 100; x < GAME_WIDTH - 100; x += 200) {
      g.drawRect(x, 70, 150, 10)
      g.drawRect(x, 70, 10, 80)
      g.drawRect(x + 140, 70, 10, 80)
    }
    // Bottom row
    for (let x = 150; x < GAME_WIDTH - 150; x += 200) {
      g.drawRect(x, GAME_HEIGHT - 150, 150, 10)
      g.drawRect(x, GAME_HEIGHT - 150, 10, 80)
      g.drawRect(x + 140, GAME_HEIGHT - 150, 10, 80)
    }
    g.endFill()

    // Filing cabinets (sides)
    g.beginFill(0x4a5568)
    g.drawRect(60, 150, 30, 60)
    g.drawRect(60, 250, 30, 60)
    g.drawRect(GAME_WIDTH - 90, 150, 30, 60)
    g.drawRect(GAME_WIDTH - 90, 250, 30, 60)
    g.endFill()

    // Fluorescent lights (on ceiling)
    g.beginFill(0xfffacd, 0.3)
    for (let x = 150; x < GAME_WIDTH - 100; x += 250) {
      g.drawRect(x, 10, 120, 20)
    }
    g.endFill()

    // Border
    g.lineStyle(4, 0x333333)
    g.drawRect(40, 40, GAME_WIDTH - 80, GAME_HEIGHT - 80)
  }

  private drawCapitol(colors: ThemeColors): void {
    const g = this.graphics

    // Marble floor
    g.beginFill(colors.floor)
    g.drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
    g.endFill()

    // Marble pattern (checkerboard)
    g.beginFill(colors.floorAlt)
    for (let x = 0; x < GAME_WIDTH; x += 80) {
      for (let y = 0; y < GAME_HEIGHT; y += 80) {
        if ((x / 80 + y / 80) % 2 === 0) {
          g.drawRect(x, y, 80, 80)
        }
      }
    }
    g.endFill()

    // Red carpet runner (center)
    g.beginFill(colors.accent, 0.8)
    g.drawRect(GAME_WIDTH / 2 - 60, 0, 120, GAME_HEIGHT)
    g.endFill()

    // Carpet border
    g.lineStyle(3, 0xffd700)
    g.drawRect(GAME_WIDTH / 2 - 60, 0, 120, GAME_HEIGHT)

    // Columns (on sides)
    this.drawColumn(80, 100)
    this.drawColumn(80, 300)
    this.drawColumn(80, 500)
    this.drawColumn(GAME_WIDTH - 80, 100)
    this.drawColumn(GAME_WIDTH - 80, 300)
    this.drawColumn(GAME_WIDTH - 80, 500)

    // Archways (top)
    g.lineStyle(0)
    g.beginFill(colors.wall)
    g.drawRect(0, 0, GAME_WIDTH, 60)
    g.endFill()

    // Arch decorations
    g.beginFill(0xdaa520)
    g.drawRect(150, 50, 100, 10)
    g.drawRect(400, 50, 100, 10)
    g.drawRect(GAME_WIDTH - 250, 50, 100, 10)
    g.drawRect(GAME_WIDTH - 500, 50, 100, 10)
    g.endFill()

    // Border
    g.lineStyle(4, 0x8b7355)
    g.drawRect(40, 40, GAME_WIDTH - 80, GAME_HEIGHT - 80)
  }

  private drawColumn(x: number, y: number): void {
    const g = this.graphics

    // Column base
    g.beginFill(0xc0c0c0)
    g.drawRect(x - 25, y + 80, 50, 20)
    g.endFill()

    // Column shaft
    g.beginFill(0xe0e0e0)
    g.drawRect(x - 20, y, 40, 80)
    g.endFill()

    // Column highlights
    g.beginFill(0xf0f0f0)
    g.drawRect(x - 15, y, 10, 80)
    g.endFill()

    // Column capital
    g.beginFill(0xd0d0d0)
    g.drawRect(x - 25, y - 10, 50, 15)
    g.endFill()
  }

  private drawSenateChamber(colors: ThemeColors): void {
    const g = this.graphics

    // Floor (blue carpet)
    g.beginFill(colors.floor)
    g.drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
    g.endFill()

    // Carpet pattern (subtle)
    g.beginFill(colors.floorAlt, 0.5)
    for (let x = 0; x < GAME_WIDTH; x += 60) {
      for (let y = 0; y < GAME_HEIGHT; y += 60) {
        g.drawCircle(x + 30, y + 30, 20)
      }
    }
    g.endFill()

    // Wood paneled walls
    g.beginFill(colors.wall)
    g.drawRect(0, 0, GAME_WIDTH, 80)
    g.drawRect(0, GAME_HEIGHT - 40, GAME_WIDTH, 40)
    g.drawRect(0, 0, 60, GAME_HEIGHT)
    g.drawRect(GAME_WIDTH - 60, 0, 60, GAME_HEIGHT)
    g.endFill()

    // Wood grain lines
    g.lineStyle(1, 0x6b5344, 0.3)
    for (let i = 0; i < 20; i++) {
      g.moveTo(0, i * 4)
      g.lineTo(GAME_WIDTH, i * 4)
    }

    // Gold trim
    g.beginFill(colors.accent)
    g.drawRect(60, 75, GAME_WIDTH - 120, 5)
    g.drawRect(60, GAME_HEIGHT - 45, GAME_WIDTH - 120, 5)
    g.drawRect(55, 80, 5, GAME_HEIGHT - 125)
    g.drawRect(GAME_WIDTH - 60, 80, 5, GAME_HEIGHT - 125)
    g.endFill()

    // Senator benches (semi-circular arrangement)
    g.beginFill(0x5d4037)
    // Left side benches
    g.drawRect(100, 150, 200, 20)
    g.drawRect(120, 250, 180, 20)
    g.drawRect(140, 350, 160, 20)
    // Right side benches
    g.drawRect(GAME_WIDTH - 300, 150, 200, 20)
    g.drawRect(GAME_WIDTH - 300, 250, 180, 20)
    g.drawRect(GAME_WIDTH - 300, 350, 160, 20)
    g.endFill()

    // Podium at front
    g.beginFill(0x4a3728)
    g.drawRect(GAME_WIDTH / 2 - 60, 100, 120, 60)
    g.endFill()
    g.beginFill(colors.accent)
    g.drawRect(GAME_WIDTH / 2 - 50, 105, 100, 5)
    g.endFill()

    // US Seal placeholder
    g.beginFill(colors.accent, 0.5)
    g.drawCircle(GAME_WIDTH / 2, 40, 25)
    g.endFill()

    // Border
    g.lineStyle(4, 0x3d2817)
    g.drawRect(50, 70, GAME_WIDTH - 100, GAME_HEIGHT - 110)
  }

  private drawOvalOffice(colors: ThemeColors): void {
    const g = this.graphics

    // Blue carpet
    g.beginFill(colors.floor)
    g.drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
    g.endFill()

    // Presidential seal pattern (center)
    g.beginFill(colors.floorAlt)
    g.drawCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 150)
    g.endFill()
    g.beginFill(colors.floor)
    g.drawCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 120)
    g.endFill()
    g.beginFill(colors.accent, 0.3)
    g.drawCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 80)
    g.endFill()

    // Walls (curved top to simulate oval)
    g.beginFill(colors.wall)
    g.drawRect(0, 0, GAME_WIDTH, 70)
    g.drawRect(0, GAME_HEIGHT - 30, GAME_WIDTH, 30)
    g.endFill()

    // Oval shape suggestion
    g.beginFill(colors.wall, 0.5)
    g.moveTo(0, 70)
    g.quadraticCurveTo(GAME_WIDTH / 2, 30, GAME_WIDTH, 70)
    g.lineTo(GAME_WIDTH, 0)
    g.lineTo(0, 0)
    g.closePath()
    g.endFill()

    // Resolute Desk
    g.beginFill(0x5d4037)
    g.drawRect(GAME_WIDTH / 2 - 80, 120, 160, 60)
    g.endFill()
    g.beginFill(0x4a3728)
    g.drawRect(GAME_WIDTH / 2 - 70, 125, 140, 50)
    g.endFill()

    // Presidential chair
    g.beginFill(0x1a1a3a)
    g.drawRect(GAME_WIDTH / 2 - 30, 85, 60, 40)
    g.endFill()

    // Couches (sides)
    g.beginFill(0x8b7355)
    g.drawRect(100, GAME_HEIGHT / 2 - 40, 100, 50)
    g.drawRect(GAME_WIDTH - 200, GAME_HEIGHT / 2 - 40, 100, 50)
    g.endFill()

    // Windows (back)
    g.beginFill(0x87ceeb, 0.5)
    g.drawRect(GAME_WIDTH / 2 - 150, 10, 80, 50)
    g.drawRect(GAME_WIDTH / 2 + 70, 10, 80, 50)
    g.endFill()
    g.lineStyle(3, 0xffffff)
    g.drawRect(GAME_WIDTH / 2 - 150, 10, 80, 50)
    g.drawRect(GAME_WIDTH / 2 + 70, 10, 80, 50)

    // Flags (on sides of desk)
    this.drawFlag(GAME_WIDTH / 2 - 100, 100, 0xff0000) // US flag colors
    this.drawFlag(GAME_WIDTH / 2 + 100, 100, 0x0000ff) // Presidential flag

    // Gold curtains
    g.beginFill(colors.accent, 0.4)
    g.drawRect(30, 60, 60, GAME_HEIGHT - 90)
    g.drawRect(GAME_WIDTH - 90, 60, 60, GAME_HEIGHT - 90)
    g.endFill()

    // Curtain folds
    g.lineStyle(2, 0xc0a000, 0.5)
    for (let y = 80; y < GAME_HEIGHT - 50; y += 30) {
      g.moveTo(30, y)
      g.quadraticCurveTo(60, y + 15, 90, y)
      g.moveTo(GAME_WIDTH - 90, y)
      g.quadraticCurveTo(GAME_WIDTH - 60, y + 15, GAME_WIDTH - 30, y)
    }

    // Border (oval suggestion)
    g.lineStyle(4, colors.accent)
    g.drawRect(20, 50, GAME_WIDTH - 40, GAME_HEIGHT - 70)
  }

  private drawFlag(x: number, y: number, color: number): void {
    const g = this.graphics

    // Pole
    g.beginFill(0xd4af37)
    g.drawRect(x - 2, y - 60, 4, 80)
    g.endFill()

    // Flag
    g.beginFill(color, 0.7)
    g.drawRect(x + 2, y - 55, 30, 20)
    g.endFill()

    // Pole top
    g.beginFill(0xffd700)
    g.drawCircle(x, y - 62, 5)
    g.endFill()
  }

  destroy(): void {
    this.graphics.destroy()
    this.decorations.destroy()
  }
}
