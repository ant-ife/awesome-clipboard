# Awesome-clipboard

Please use [es6-promise polyfill](https://github.com/stefanpenner/es6-promise) if not have native Promise implementation.

# Usage

- click to copy

```javascript
import Clipboard from 'awesome-clipboard'

const code = 'SOME_STRING'

document.getElementById('element').addEventListener('click', () => {
  Clipboard.write(code).then(() => {
    // 'SOME_STRING' is copied to your system clipboard
  })
}, true)
```
