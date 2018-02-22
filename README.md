Pomelo DogStatsD
=============

### Example Usage

```javascript
const pomeloDogStatsD = require('pomelo-dogstatsd')

app.configure('all', () => {
  app.load(pomeloDogStatsD, {
    host: 'localhost',
    port: 8125,
  })
})
```
