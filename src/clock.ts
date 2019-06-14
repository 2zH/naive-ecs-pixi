interface Listener {
  startTime: number;
  timeout: number;
  once: boolean;
  callbackFn: () => void
}

export default class Clock {
  startTime = 0
  now = 0
  listeners: Listener[] = []

  start(startTime = Date.now()) {
    this.startTime = startTime
    this.now = this.startTime
    return this
  }

  updateTime(delta: number) {
    this.now += delta
    this.listeners.forEach(listener => {
      const timeout = listener.timeout / 1000 * 60
      if ((this.now - listener.startTime) < timeout) {
        return
      }
      listener.callbackFn()
      if (listener.once) {
        return this.listeners.splice(this.listeners.indexOf(listener), 1)
      }
      listener.startTime = this.now
    })
    return this
  }

  removeTimer(id: () => void) {
    const index = this.listeners.findIndex(({ callbackFn }) =>
      callbackFn === id
    )
    if (index >= 0) {
      this.listeners.splice(index, 1)
    }
    return this
  }

  setInterval(fn: () => void, timeout: number) {
    this.listeners.push({
      startTime: this.now,
      timeout,
      callbackFn: fn,
      once: false
    })
    return this
  }

  setTimeout(fn: () => void, timeout: number) {
    this.listeners.push({
      startTime: this.now,
      timeout,
      callbackFn: fn,
      once: true
    })
    return this
  }
}
