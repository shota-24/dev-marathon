 
 	
const express = require('express');
const app = express();
const port = 4000;

app.get('/', (req, res) => {
  res.send('hego');
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});