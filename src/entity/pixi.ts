import Entity from "./entity";
import Component from '../component';
import { Position, Text } from '../component/pixi'
import * as PIXI from 'pixi.js'

export class SpriteEntity extends Entity {
  sprite: PIXI.Sprite

  constructor(components: Component[] = []) {
    super()
    this.sprite = new PIXI.Sprite()
    this.add(
      new Position(this.sprite, 0, 0),
      ...components
    )
  }

  static texture: string | null = null
}

export class TextEntity extends Entity {
  sprite: PIXI.Text
  constructor(...components: Component[]) {
    super()
    this.sprite = new PIXI.Text()
    this.add(
      new Text(this.sprite),
      new Position(this.sprite, 0, 0)
    )
    this.add(...components)
  }
}
