import Entity from './entity'
import { ComponentConstructor } from './component'
import Clock from './clock'

export default abstract class System {

  lock = false

  type?: ComponentConstructor[]

  abstract update(entities: Entity[]): void

  filter?(entities?: Entity[]): Entity[] | boolean

  setUpdateGap(clock: Clock, gap: number) {
    clock
      .removeTimer(this.unlock)
      .setInterval(this.unlock, gap)
    const originUpdater = this.update.bind(this)
    this.update = (entities: Entity[]) => {
      originUpdater(entities)
      this.lock = true
    }
  }

  isLocked() {
    if (this.lock) {
      return true
    }
    this.lock = true
    return false
  }

  unlock = () => {
    this.lock = false
  }
}
