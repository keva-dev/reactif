const $ = document.getElementById.bind(document);
type Handler = () => void
const used: Handler[] = []

export function on(selector: string) {
  return {
    click: function (handler: () => void) {
      if (!used.some(e => e === handler)) {
        $(selector).addEventListener('click', handler)
      }
    }
  }
}
