var http = require('http');
var express = require('express');
var fs = require('fs');
var app = express();

app.use(express.static('data'));

app.get("/sugarfact", function(request, response) {
	fs.readFile('page/sugarsalt_stack.html', function(err, data) {
		response.writeHead(200, {
			'Content-Type' : 'text/html'
		});
		response.end(data, 'utf-8');
	});
});

app.get("/energy", function(request, response) {
	fs.readFile('page/energy_multibar.html', function(err, data) {
		response.writeHead(200, {
			'Content-Type' : 'text/html'
		});
		response.end(data, 'utf-8');
	});
});


app.listen(3000, function() {
	console.log('Server running at http://127.0.0.1:3000/');
});