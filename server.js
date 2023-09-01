const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;
require('./config/mongoose');


app.use(express.urlencoded({ extended: true }));

app.use('/', require('./routes'));
app.use('/', require('./routes'));
//setting up template engine
app.set('view engine', 'ejs');
app.set('views', './views');

//listening on port
app.listen(PORT, () => {
    console.log(`Server is running on port:${PORT}`);
});
