var express = require('express');
var app = express();
var cors = require('cors');
app.use(cors());

//Ülesanne 1
app.get('/', function(req, res) {
	res.send('Hello, world!');
});

app.get('/tere', function(req, res) {
	res.send('Tere, Maailm!');
});

var PORT = process.env.PORT || 8000;
var apiController = require('./controllers/apiController');
apiController(app);
app.listen(PORT);
