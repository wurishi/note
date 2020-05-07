window._t = (x, y) => `translate(${x},${y})`
window._r = (r) => `rotate(${r})`

const DOM = {
  tmp: 0,
}
DOM.uid = (prefix) => {
  const id = prefix + "_" + Date.now() + "_" + DOM.tmp++
  return {
    id,
    href: `#${id}`,
    url: `url(#${id})`,
  }
}

window.DOM = DOM
