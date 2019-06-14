import Entity, { EntityManager } from './entity'
import System from './system';
import GameWorld from './world'

type OneOrMultiple<T> = T | T[]

export default class GameLevel extends EntityManager {

  systems: System[] = []
  status: 'pending' | 'working' | 'finished' | 'paused' = 'pending'
  onLoad?: () => void
  onFinish?: () => void

  constructor(...systems: System[]) {
    super()
    this.addSystem(...systems)
  }

  initLevel(game: GameWorld) {
    game.sprite.addChild(this.sprite)
    if (this.onLoad) this.onLoad()
  }

  addSystem(...systems: OneOrMultiple<System>[]) {
    for (const system of systems.flat()) {
      this.systems.push(system)
    }
    return this
  }

  loop() {
    this.systems.forEach(system => {
      const entities = this.filter(system)
      if (Array.isArray(entities)) {
        system.update(entities)
      }
    })
  }

  filter(system: System) {
    if (system.type) {
      return this.filterEntity(system.type)
    }
    if (system.filter) {
      return system.filter(this.entities)
    }
    return this.entities
  }

  finish() {
    this.status = 'finished';
    if (this.onFinish) this.onFinish()
  }
}
