/**
 * Simplify https://github.com/lgarron/clipboard-polyfill
 */
const TEXT_PLAIN = 'text/plain'
let copySuccess = false

module.exports = class Clipboard {
  /**
   * @param {String} text
   *
   * @return {Primise<boolean>}
   */
  static write (text) {
    return (new Promise(resolve => {
      copySuccess = false

      const listener = copyListener.bind(this, text)
      document.addEventListener('copy', listener)
      try {
        document.execCommand('copy')
      } finally {
        document.removeEventListener('copy', listener)
      }

      // for iOS Safari
      if (!copySuccess) {
        copySuccess = copyTextUsingDOM(text)
      }

      resolve(!!copySuccess)
    }))
  }
}

/**
 * @param {String} text
 * @param {ClipboardEvent} e clipboard event
 *
 * @return void
 */
function copyListener (text, e) {
  copySuccess = true
  e.clipboardData.setData(TEXT_PLAIN, text)

  if (e.clipboardData.getData(TEXT_PLAIN) !== text) {
    copySuccess = false
  }
  e.preventDefault()
}

/**
 * for iOS Safari
 * @param {String} str
 *
 * @return {Boolean}
 */
function copyTextUsingDOM (str) {
  // https://caniuse.com/#search=execCommand not support execCommand
  if (typeof document.execCommand !== 'function') return false

  const tempElem = document.createElement('div')
  // Setting an individual property does not support `!important`, so we set the
  // whole style instead of just the `-webkit-user-select` property.
  tempElem.setAttribute('style', '-webkit-user-select: text !important')

  // Use shadow DOM if available.
  let spanParent = tempElem
  if (tempElem.attachShadow) {
    spanParent = tempElem.attachShadow({ mode: 'open' })
  }

  const span = document.createElement('span')
  span.innerText = str

  spanParent.appendChild(span)
  document.body.appendChild(tempElem)
  selectionSet(span)

  const result = document.execCommand('copy')

  selectionClear()
  document.body.removeChild(tempElem)

  return result
}

/**
 * @param {Element} elem
 *
 * @return void
 */
function selectionSet (elem) {
  const sel = document.getSelection()
  const range = document.createRange()
  range.selectNodeContents(elem)
  sel.removeAllRanges()
  sel.addRange(range)
}

function selectionClear () {
  const sel = document.getSelection()
  sel.removeAllRanges()
}
