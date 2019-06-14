import Component, { ComponentConstructor, None, Value, Binder, Mutator } from './component'
import { Position, Text, Texture, EffectTexture } from './pixi'

export {
  ComponentConstructor,
  None,
  Value,
  Binder,
  Mutator,
  Position,
  Text,
  Texture,
  EffectTexture
}

export default Component

// interface Sprite {
//   x: number,
//   y: number
// }

// class Position extends Value<Sprite> {
//   constructor(value: Sprite, x: number, y: number) {
//     super(value)
//     this.value.x = x
//     this.value.y = y
//   }
// }

// let b = new Position({ x: 1, y: 2 }, 10, 20)
// let a: Component<string> | None = b instanceof Position ? b : new None()

// function getComponent<T>(type: { new (...args: any): T }): T | None {
//   return b instanceof type ? b : new None()
// }

// let foo = getComponent(Position)
//   .mutation(sprite => {
//     sprite.x = 10,
//     sprite.y = 20
//   })
