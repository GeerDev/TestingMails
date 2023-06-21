const express = require('express');

const app = express();
const path = require('path');
const PORT = 8070;

app.use(express.json())
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'pug');

app.use( require('./routes/email'))

app.listen(PORT, () => {
    console.log('Server started on PORT', PORT);
})