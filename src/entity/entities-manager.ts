import Entity from './entity'
import { ComponentConstructor } from '../component'

type OneOrMultiple<T> = T | T[]

export default class EntityManager extends Entity {
  entities: Entity[] = []

  addEntity(...entities: Array<OneOrMultiple<Entity>>) {
    entities.flat().forEach(entity => {
      this.entities.push(entity)
      this.sprite.addChild(entity.sprite)
    })
    return this
  }

  filterEntity(composition: ComponentConstructor[] = []) {
    return this.entities.filter(entity => entity.has(composition))
  }

  removeEntity(...entities: Array<OneOrMultiple<Entity>>) {
    entities.flat().forEach(entity => {
      this.entities.splice(this.entities.indexOf(entity), 1)
      this.sprite.removeChild(entity.sprite)
      entity.sprite.destroy()
    })
    return this
  }

  clearEntity() {
    this.entities.forEach(
      entity => entity.sprite.destroy()
    )
    this.entities = []
    return this
  }
}
