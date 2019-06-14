import Component, { None } from '../component'
import * as PIXI from 'pixi.js'

export type ComponentConstructor<T = Component> = new (...args: any[]) => T

export default class Entity {

  id: Symbol;
  components: Map<Symbol, Component> = new Map();
  sprite: PIXI.Container = new PIXI.Container()

  constructor(components?: Component[]) {
    this.id = Symbol()
    if (components) {
      this.add(...components)
    }
  }

  component<T extends Component>(Ent: ComponentConstructor<T>): T | None {
    const component = Array
      .from(this.components.values())
      .find((component): component is T =>
        component instanceof Ent
      )
    if (!component) {
      return new None()
    }
    return component
  }

  /**
   *
   * @example
   * add(component)
   * add(component, component)
   * add([component, component])
   */
  add(...components: Array<Component | Component[]>) {
    components.flat().forEach(
      component => this.components.set(component.id, component)
    )
    return this
  }

  /**
   *
   * @example
   * has(component)
   * has(component, component)
   * has([component, component])
   */
  has(...composition: Array<ComponentConstructor | ComponentConstructor[]>) {
    return composition
      .flat()
      .every((Type): Type is ComponentConstructor => Array
        .from(this.components.values())
        .some(component => component instanceof Type)
      )
  }

  /**
   *
   * @example
   * remove(component)
   * remove(component, component)
   * remove([component, component])
   */
  remove(...components: Array<
    Component | Component[] | ComponentConstructor | ComponentConstructor[]
  >) {
    components.flat().forEach(component => {
      if (typeof component === 'function') {
        return Array
          .from(this.components.values())
          .filter(c => c instanceof component)
          .forEach(({ id }) => {
            this.components.delete(id)
          })
      }

      if (component.id) {
        return this.components.delete(component.id)
      }
    })
  }
}
