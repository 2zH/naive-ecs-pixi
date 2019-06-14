import { Binder, Value } from './component'
import * as PIXI from 'pixi.js'

export interface PIXIPosition {
  x: number;
  y: number;
  set: (x: number, y: number) => void
}

export class Position extends Value<PIXIPosition> {
  constructor(value: PIXI.Container, x = 0, y = 0) {
    super(value.position)
    this.value.set(x, y)
  }
}

export class Texture extends Binder<PIXI.Sprite> {
  constructor(ctx: PIXI.Sprite, image?: string) {
    super(ctx, 'texture')
    if (image && PIXI.utils.TextureCache[image]) {
      this.value = PIXI.utils.TextureCache[image]
    }
  }
}

export class EffectTexture extends Value<PIXI.Texture[]> {
  constructor(frames: string[]) {
    super(frames.map(frame => PIXI.Texture.fromFrame(frame)))
  }
}

export class Text extends Binder<PIXI.Text> {
  constructor(ctx: PIXI.Text, text?: any) {
    super(ctx, 'text')
    if (text) {
      this.value = String(text)
    }
  }
}
