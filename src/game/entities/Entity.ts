import * as PIXI from 'pixi.js'
import { AABB } from '../utils/Collision'

// Scale factor for pixel art sprites (32x32 becomes 64x64, etc.)
export const SPRITE_SCALE = 2

export abstract class Entity {
  public sprite: PIXI.Sprite
  public x: number = 0
  public y: number = 0
  public vx: number = 0
  public vy: number = 0
  public width: number
  public height: number
  public active: boolean = true

  constructor(texture: PIXI.Texture, width: number, height: number) {
    this.sprite = new PIXI.Sprite(texture)
    this.sprite.anchor.set(0.5)
    // Scale up pixel art sprites
    this.sprite.scale.set(SPRITE_SCALE)
    // Collision size is the scaled size
    this.width = width * SPRITE_SCALE
    this.height = height * SPRITE_SCALE
  }

  abstract update(dt: number): void

  getBounds(): AABB {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height
    }
  }

  updateSprite(): void {
    this.sprite.x = this.x
    this.sprite.y = this.y
  }

  destroy(): void {
    this.sprite.destroy()
    this.active = false
  }
}
