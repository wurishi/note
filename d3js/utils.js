window._t = (x, y) => `translate(${x},${y})`

const DOM = {
  tmp: 0,
}
DOM.uid = (prefix) => ({
  id: prefix + "_" + Date.now() + "_" + DOM.tmp++,
  href: "href",
})

window.DOM = DOM
