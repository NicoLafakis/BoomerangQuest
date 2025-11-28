import * as PIXI from 'pixi.js'

export class SpriteGenerator {
  private static cache: Map<string, PIXI.Texture> = new Map()

  static generatePlayerSprite(): PIXI.Texture {
    const key = 'player'
    if (this.cache.has(key)) return this.cache.get(key)!

    const size = 32
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!

    // John Q. Public - Brown hair, red flannel, jeans
    // Head with brown hair
    ctx.fillStyle = '#8B4513' // Brown hair
    ctx.fillRect(10, 2, 12, 6)

    // Face
    ctx.fillStyle = '#FFD9B3' // Skin
    ctx.fillRect(11, 6, 10, 8)

    // Red flannel shirt
    ctx.fillStyle = '#CC3333'
    ctx.fillRect(8, 14, 16, 10)

    // White undershirt showing
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(12, 14, 8, 3)

    // Flannel pattern (darker red lines)
    ctx.fillStyle = '#992222'
    ctx.fillRect(8, 16, 16, 1)
    ctx.fillRect(8, 20, 16, 1)
    ctx.fillRect(10, 14, 1, 10)
    ctx.fillRect(15, 14, 1, 10)
    ctx.fillRect(21, 14, 1, 10)

    // Arms
    ctx.fillStyle = '#CC3333'
    ctx.fillRect(4, 15, 4, 8)
    ctx.fillRect(24, 15, 4, 8)

    // Hands
    ctx.fillStyle = '#FFD9B3'
    ctx.fillRect(4, 22, 4, 3)
    ctx.fillRect(24, 22, 4, 3)

    // Jeans
    ctx.fillStyle = '#4466AA'
    ctx.fillRect(10, 24, 5, 7)
    ctx.fillRect(17, 24, 5, 7)

    // Shoes
    ctx.fillStyle = '#333333'
    ctx.fillRect(9, 30, 6, 2)
    ctx.fillRect(17, 30, 6, 2)

    const texture = PIXI.Texture.from(canvas)
    this.cache.set(key, texture)
    return texture
  }

  static generateEnemySprite(type: string): PIXI.Texture {
    const key = `enemy_${type}`
    if (this.cache.has(key)) return this.cache.get(key)!

    const size = 32
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!

    switch (type) {
      case 'intern':
        // Young intern with tie
        ctx.fillStyle = '#333333' // Hair
        ctx.fillRect(10, 2, 12, 5)
        ctx.fillStyle = '#FFD9B3' // Face
        ctx.fillRect(11, 6, 10, 8)
        ctx.fillStyle = '#FFFFFF' // White shirt
        ctx.fillRect(8, 14, 16, 10)
        ctx.fillStyle = '#FF0000' // Red tie
        ctx.fillRect(14, 14, 4, 10)
        ctx.fillStyle = '#333333' // Pants
        ctx.fillRect(10, 24, 12, 6)
        break

      case 'bureaucrat':
        // Large, slow bureaucrat with stacks of paper
        ctx.fillStyle = '#666666' // Gray hair
        ctx.fillRect(8, 0, 16, 6)
        ctx.fillStyle = '#FFD9B3' // Face
        ctx.fillRect(9, 5, 14, 10)
        ctx.fillStyle = '#335577' // Blue suit
        ctx.fillRect(6, 15, 20, 12)
        ctx.fillStyle = '#FFFFFF' // Papers in hand
        ctx.fillRect(24, 16, 6, 8)
        ctx.fillRect(2, 16, 6, 8)
        ctx.fillStyle = '#333333' // Pants
        ctx.fillRect(8, 26, 16, 5)
        break

      case 'irs_agent':
        // IRS Agent in dark suit with glasses
        ctx.fillStyle = '#222222' // Dark hair
        ctx.fillRect(10, 2, 12, 5)
        ctx.fillStyle = '#FFD9B3' // Face
        ctx.fillRect(11, 6, 10, 8)
        // Glasses
        ctx.fillStyle = '#000000'
        ctx.fillRect(10, 8, 5, 3)
        ctx.fillRect(17, 8, 5, 3)
        ctx.fillRect(15, 9, 2, 1)
        ctx.fillStyle = '#1a1a1a' // Black suit
        ctx.fillRect(8, 14, 16, 12)
        ctx.fillStyle = '#AA0000' // Red tie
        ctx.fillRect(14, 14, 4, 8)
        ctx.fillStyle = '#1a1a1a' // Pants
        ctx.fillRect(10, 26, 12, 5)
        break

      case 'secret_service':
        // Secret Service with sunglasses and earpiece
        ctx.fillStyle = '#111111' // Short hair
        ctx.fillRect(10, 2, 12, 4)
        ctx.fillStyle = '#FFD9B3' // Face
        ctx.fillRect(11, 5, 10, 9)
        // Sunglasses
        ctx.fillStyle = '#000000'
        ctx.fillRect(10, 7, 12, 3)
        // Earpiece
        ctx.fillStyle = '#333333'
        ctx.fillRect(22, 8, 3, 5)
        ctx.fillStyle = '#000000' // Black suit
        ctx.fillRect(8, 14, 16, 10)
        ctx.fillStyle = '#FFFFFF' // White shirt collar
        ctx.fillRect(12, 14, 8, 2)
        ctx.fillStyle = '#000000' // Pants
        ctx.fillRect(10, 24, 12, 6)
        break

      case 'lobbyist':
        // Lobbyist with money
        ctx.fillStyle = '#AA8844' // Blonde/brown hair
        ctx.fillRect(10, 2, 12, 5)
        ctx.fillStyle = '#FFD9B3' // Face
        ctx.fillRect(11, 6, 10, 8)
        // Smug grin
        ctx.fillStyle = '#CC6666'
        ctx.fillRect(13, 11, 6, 2)
        ctx.fillStyle = '#445577' // Blue blazer
        ctx.fillRect(8, 14, 16, 10)
        ctx.fillStyle = '#228822' // Money in hand
        ctx.fillRect(24, 17, 6, 4)
        ctx.fillStyle = '#333333' // Pants
        ctx.fillRect(10, 24, 12, 6)
        break

      default:
        ctx.fillStyle = '#FF0000'
        ctx.fillRect(4, 4, 24, 24)
    }

    const texture = PIXI.Texture.from(canvas)
    this.cache.set(key, texture)
    return texture
  }

  static generateProjectileSprite(type: string): PIXI.Texture {
    const key = `projectile_${type}`
    if (this.cache.has(key)) return this.cache.get(key)!

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    switch (type) {
      case 'wrench':
        canvas.width = 16
        canvas.height = 16
        ctx.fillStyle = '#888888' // Metal gray
        ctx.fillRect(2, 6, 12, 4) // Handle
        ctx.fillStyle = '#666666'
        ctx.fillRect(0, 4, 4, 8) // Head
        ctx.fillRect(12, 5, 4, 6) // Other end
        break

      case 'pistol':
        canvas.width = 8
        canvas.height = 8
        ctx.fillStyle = '#FFFF00' // Yellow bullet
        ctx.fillRect(2, 2, 4, 4)
        break

      case 'shotgun':
        canvas.width = 6
        canvas.height = 6
        ctx.fillStyle = '#FF8800' // Orange pellet
        ctx.fillRect(1, 1, 4, 4)
        break

      case 'rapidfire':
        canvas.width = 6
        canvas.height = 6
        ctx.fillStyle = '#00FFFF' // Cyan
        ctx.fillRect(1, 1, 4, 4)
        break

      case 'laser':
        canvas.width = 20
        canvas.height = 4
        ctx.fillStyle = '#FF00FF' // Magenta laser
        ctx.fillRect(0, 0, 20, 4)
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 1, 20, 2)
        break

      case 'spread':
        canvas.width = 8
        canvas.height = 8
        ctx.fillStyle = '#00FF00' // Green
        ctx.fillRect(2, 2, 4, 4)
        break

      case 'paperwork':
        canvas.width = 12
        canvas.height = 12
        ctx.fillStyle = '#FFFFFF' // Paper
        ctx.fillRect(2, 2, 8, 8)
        ctx.fillStyle = '#333333' // Text lines
        ctx.fillRect(3, 3, 6, 1)
        ctx.fillRect(3, 5, 5, 1)
        ctx.fillRect(3, 7, 6, 1)
        break

      case 'audit_beam':
        canvas.width = 24
        canvas.height = 6
        ctx.fillStyle = '#FF0000'
        ctx.fillRect(0, 0, 24, 6)
        ctx.fillStyle = '#FFFF00'
        ctx.fillRect(0, 2, 24, 2)
        break

      case 'enemy_pistol':
        canvas.width = 6
        canvas.height = 6
        ctx.fillStyle = '#FF4444'
        ctx.fillRect(1, 1, 4, 4)
        break

      default:
        canvas.width = 8
        canvas.height = 8
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(2, 2, 4, 4)
    }

    const texture = PIXI.Texture.from(canvas)
    this.cache.set(key, texture)
    return texture
  }

  static generatePickupSprite(type: string): PIXI.Texture {
    const key = `pickup_${type}`
    if (this.cache.has(key)) return this.cache.get(key)!

    const size = 24
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!

    switch (type) {
      case 'tax_refund_small':
        // Small dollar bill
        ctx.fillStyle = '#228822'
        ctx.fillRect(4, 8, 16, 8)
        ctx.fillStyle = '#44AA44'
        ctx.fillRect(5, 9, 14, 6)
        ctx.fillStyle = '#FFFFFF'
        ctx.font = '8px Arial'
        ctx.fillText('$', 10, 15)
        break

      case 'tax_refund_large':
        // Stack of bills
        ctx.fillStyle = '#228822'
        ctx.fillRect(2, 6, 20, 12)
        ctx.fillStyle = '#44AA44'
        ctx.fillRect(3, 7, 18, 10)
        ctx.fillStyle = '#FFFFFF'
        ctx.font = '10px Arial'
        ctx.fillText('$$$', 5, 15)
        break

      case 'health':
        // Red cross
        ctx.fillStyle = '#FF0000'
        ctx.fillRect(9, 4, 6, 16)
        ctx.fillRect(4, 9, 16, 6)
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(10, 5, 4, 14)
        ctx.fillRect(5, 10, 14, 4)
        break

      case 'damage_boost':
        // Explosion/star shape
        ctx.fillStyle = '#FF8800'
        ctx.beginPath()
        ctx.moveTo(12, 2)
        ctx.lineTo(14, 8)
        ctx.lineTo(20, 8)
        ctx.lineTo(16, 12)
        ctx.lineTo(18, 20)
        ctx.lineTo(12, 16)
        ctx.lineTo(6, 20)
        ctx.lineTo(8, 12)
        ctx.lineTo(4, 8)
        ctx.lineTo(10, 8)
        ctx.closePath()
        ctx.fill()
        break

      case 'spread_boost':
        // Triple arrow
        ctx.fillStyle = '#00AAFF'
        ctx.fillRect(10, 4, 4, 16)
        ctx.fillRect(4, 8, 4, 12)
        ctx.fillRect(16, 8, 4, 12)
        break

      case 'shield':
        // Shield shape
        ctx.fillStyle = '#4488FF'
        ctx.beginPath()
        ctx.moveTo(12, 2)
        ctx.lineTo(20, 6)
        ctx.lineTo(20, 14)
        ctx.lineTo(12, 22)
        ctx.lineTo(4, 14)
        ctx.lineTo(4, 6)
        ctx.closePath()
        ctx.fill()
        ctx.fillStyle = '#88AAFF'
        ctx.beginPath()
        ctx.moveTo(12, 5)
        ctx.lineTo(17, 8)
        ctx.lineTo(17, 13)
        ctx.lineTo(12, 19)
        ctx.lineTo(7, 13)
        ctx.lineTo(7, 8)
        ctx.closePath()
        ctx.fill()
        break

      case 'extra_life':
        // Heart
        ctx.fillStyle = '#FF4488'
        ctx.beginPath()
        ctx.moveTo(12, 20)
        ctx.lineTo(4, 12)
        ctx.bezierCurveTo(4, 6, 12, 4, 12, 10)
        ctx.bezierCurveTo(12, 4, 20, 6, 20, 12)
        ctx.lineTo(12, 20)
        ctx.closePath()
        ctx.fill()
        break

      case 'weapon_pistol':
      case 'weapon_shotgun':
      case 'weapon_rapidfire':
      case 'weapon_laser':
      case 'weapon_spread':
        // Weapon crate
        ctx.fillStyle = '#8B4513'
        ctx.fillRect(2, 6, 20, 14)
        ctx.fillStyle = '#A0522D'
        ctx.fillRect(4, 8, 16, 10)
        ctx.fillStyle = '#FFFF00'
        ctx.font = '8px Arial'
        ctx.fillText('W', 9, 16)
        break

      default:
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(4, 4, 16, 16)
    }

    const texture = PIXI.Texture.from(canvas)
    this.cache.set(key, texture)
    return texture
  }

  static clearCache(): void {
    this.cache.forEach((texture) => texture.destroy(true))
    this.cache.clear()
  }
}
