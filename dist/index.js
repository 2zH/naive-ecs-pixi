'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var PIXI = require('pixi.js');

class Component {
  constructor() {
    this.id = Symbol();
  }

  fmap(fn) {
    return new Value(fn(this.value));
  }

  mutation(fn) {
    const nextValue = fn(this.value);

    if (typeof nextValue !== 'undefined') {
      this.value = nextValue;
    }

    return this;
  }

  chain(fn) {
    return this.fmap(fn).join();
  }

  join() {
    return this.value;
  }

  concat(...components) {
    if (components.some(component => component instanceof None)) {
      return new None();
    }

    return new Values(Array.of(this).concat(components).map(component => component.join()));
  }

}
class None {
  constructor() {
    this.id = Symbol();
  }

  fmap() {
    return new None();
  }

  mutation() {
    return this;
  }

  join() {
    return undefined;
  }

  chain() {
    return this.join();
  }

  concat() {
    return this;
  }

}
class Value extends Component {
  constructor(value) {
    super();
    this.value = value;
  }

}

class Values extends Value {
  concat(...components) {
    if (components.some(component => component instanceof None)) {
      return new None();
    }

    return new Values(this.join().concat(components));
  }

}

class Binder extends Component {
  constructor(ctx, propName) {
    super();
    this.ctx = ctx;
    this.propName = propName;
  }

  get value() {
    if (this.getterHook) {
      this.getterHook(this.ctx[this.propName]);
    }

    return this.ctx[this.propName];
  }

  set value(value) {
    this.ctx[this.propName] = value;

    if (this.setterHook) {
      this.setterHook(value);
    }
  }

}
class Mutator extends Component {
  constructor(value, hook) {
    super();
    this.hook = hook;
    this._value = value;
    this.value = value;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;

    if (this.hook) {
      this.hook(this._value);
    }
  }

} // interface Sprite {
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

class Position extends Value {
  constructor(value, x = 0, y = 0) {
    super(value.position);
    this.value.set(x, y);
  }

}
class Texture extends Binder {
  constructor(ctx, image) {
    super(ctx, 'texture');

    if (image && PIXI.utils.TextureCache[image]) {
      this.value = PIXI.utils.TextureCache[image];
    }
  }

}
class EffectTexture extends Value {
  constructor(frames) {
    super(frames.map(frame => PIXI.Texture.fromFrame(frame)));
  }

}
class Text extends Binder {
  constructor(ctx, text) {
    super(ctx, 'text');

    if (text) {
      this.value = String(text);
    }
  }

}

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

exports.None = None;
exports.Value = Value;
exports.Binder = Binder;
exports.Mutator = Mutator;
exports.Position = Position;
exports.Text = Text;
exports.Texture = Texture;
exports.EffectTexture = EffectTexture;
