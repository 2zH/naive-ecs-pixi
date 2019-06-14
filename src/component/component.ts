export type ComponentConstructor<T = Component> = new (...args: any[]) => T

type ComponentLike = Component | None

export default abstract class Component<T = any> {

  id: Symbol

  abstract value: T

  constructor() {
    this.id = Symbol()
  }

  fmap<U>(fn: (value: T) => U): Value<U> {
    return new Value<U>(fn(this.value))
  }

  mutation(fn: (value: T) => T | void): Component<T> {
    const nextValue = fn(this.value)
    if (typeof nextValue !== 'undefined') {
      this.value = nextValue
    }
    return this
  }

  chain<U>(fn: (value: T) => U) {
    return this.fmap(fn).join()
  }

  join(): T {
    return this.value
  }

  concat(...components: ComponentLike[]): Values | None {
    if (components.some(component => component instanceof None)) {
      return new None()
    }
    return new Values(
      Array.of<Component>(this)
        .concat(components as Component[])
        .map(component => component.join())
    )
  }
}

export class None {
  id = Symbol()

  fmap() {
    return new None()
  }

  mutation() {
    return this
  }

  join() {
    return undefined
  }

  chain() {
    return this.join()
  }

  concat() {
    return this
  }
}

export class Value<T> extends Component<T> {

  value: T

  constructor(value: T) {
    super()
    this.value = value
  }
}

class Values extends Value<any[]> {
  concat(...components: Component[]): Values | None {
    if (components.some(component => component instanceof None)) {
      return new None()
    }
    return new Values(this.join().concat(components))
  }
}

export class Binder<T> extends Component<T[keyof T]> {
  ctx: T
  propName: keyof T
  getterHook?: (value: T[keyof T]) => void
  setterHook?: (value: T[keyof T]) => void

  constructor(ctx: T, propName: keyof T) {
    super()
    this.ctx = ctx
    this.propName = propName
  }

  get value() {
    if (this.getterHook) {
      this.getterHook(this.ctx[this.propName])
    }
    return this.ctx[this.propName]
  }

  set value(value) {
    this.ctx[this.propName] = value
    if (this.setterHook) {
      this.setterHook(value)
    }
  }
}

export class Mutator<T> extends Component<T> {
  _value: T
  hook?: (_value: T) => void

  constructor(value: T, hook?: (_value: T) => void) {
    super()
    this.hook = hook
    this._value = value
    this.value = value
  }

  get value() {
    return this._value
  }

  set value(value) {
    this._value = value
    if (this.hook) {
      this.hook(this._value)
    }
  }
}

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
