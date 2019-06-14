import Clock from './clock'
import { EntityManager } from './entity'
import GameLevel from './level'
import * as PIXI from 'pixi.js';

interface GameState {
  clock: Clock;
  levels: GameLevel[];
  currentLevelIndex: number;
}

interface SpriteSheet {
  name: string;
  url: string;
  data: any
}

export default class GameWorld<T = {}> extends EntityManager {
  state: T & GameState
  app?: PIXI.Application

  get currentLevel() {
    return this.state.levels[this.state.currentLevelIndex]
  }

  constructor(state: T) {
    super()
    this.state = {
      ...state,
      clock: new Clock(),
      levels: [],
      currentLevelIndex: 0
    }
  }

  addLevel(level: GameLevel, onLoad?: () => void, onFinish?: () => void) {
    level.onLoad = onLoad
    level.onFinish = onFinish
    this.state.levels.push(level)
    return this
  }

  spriteSheetPrefix({ name, url, data }: SpriteSheet) {
    const callback = (resource: any) => {
      if(resource.error) {
        console.error(resource.error); // tslint:disable-line
      } else {
        const texture = resource.texture.baseTexture;
        const sheet = new PIXI.Spritesheet(texture, data);
        sheet.parse(() => {});
      }
    }
    return { name, url, callback }
  }

  preload(...resources: Array<SpriteSheet | string>) {
    PIXI.loader.add(resources.flat().map(resource => {
      if (typeof resource === 'string') {
        return resource
      }
      return this.spriteSheetPrefix(resource)
    }))
    return this
  }

  preloadNetWorkResource(...resources: { url: string, loadType: number }[]) {
    resources.forEach(resource =>
      PIXI.loader.add(resource.url, resource.loadType)
    )
    return this
  }

  loop() {
    const { levels, currentLevelIndex } = this.state
    if (!levels.length) {
      return false
    }
    levels[currentLevelIndex].loop()
  }

  nextLevel() {
    const lastLevel = this.state.levels[this.state.currentLevelIndex]
    lastLevel.finish()
    this.removeEntity(lastLevel)
    const nextLevelIndex = this.state.currentLevelIndex + 1
    if (!this.state.levels[nextLevelIndex]) {
      return this.finish()
    }
    this.state.currentLevelIndex += 1
    this.currentLevel.initLevel(this)
  }

  finish() {
    console.log('Game Over'); // tslint:disable-line
    (this.app as PIXI.Application).ticker.remove(this.tickId)
  }

  tickId = (delta: number) => {
    this.state.clock.updateTime(delta)
    this.loop()
  }

  /**
   *
   * @param app PIXI.Application instance
   * @param callbackFn Callback function
   * @example
   * const app = new PIXI.Application({
   *   width,
   *   height,
   *   backgroundColor,
   *   view
   * })
   * new GameWorld()
   *  .render(app, () => {
   *     console.log('Hello world')
   *   })
   */
  render(app: PIXI.Application, callbackFn?: () => void) {
    PIXI.loader.load(() => {
      if (callbackFn) callbackFn()
      this.state.clock.start()
      this.currentLevel.initLevel(this)
      this.app = app
      this.app.stage.addChild(this.sprite)
      this.app.ticker.add(this.tickId)
    })
    return this
  }
}
