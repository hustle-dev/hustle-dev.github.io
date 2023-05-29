export const optimizedScroll = (callback: () => void) => {
  let tick = false

  return () => {
    if (tick) return

    tick = true
    window.requestAnimationFrame(() => {
      callback()
      tick = false
    })
  }
}
