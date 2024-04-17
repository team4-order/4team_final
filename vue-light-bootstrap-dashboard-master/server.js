const express = require('express');
const history = require('connect-history-api-fallback');
const path = require('path');

const app = express();

app.use(history());
app.use(express.static(path.join(__dirname, 'dist')));

const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
