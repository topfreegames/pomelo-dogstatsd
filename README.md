Pomelo StatsD
=============

### Example Usage

```javascript
const pomeloStatsD = require('pomelo-statsd')

app.configure('all', () => {
  app.load(pomeloStatsD, {
    host: 'localhost',
    port: 8125,
  })
})
```
