const express = require('express');
const path = require('path');
const app = express();

// Serve your HTML and JS files
app.use(express.static(__dirname));

// Serve the /songs folder as static files
app.use('/songs', express.static(path.join(__dirname, 'songs')));

app.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000');
});
