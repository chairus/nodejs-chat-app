var express = require('express');
var routes = require('../routes/index');

const path = require('path');

var app = express();
var port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));

app.use(routes);

app.listen(port, () => {
    console.log(`Server has started. Listening on PORT ${port}`);
});
