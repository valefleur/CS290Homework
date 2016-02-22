var express = require("express");
var app = express();
app.set("port", 3000);

app.get('/', function(req, res){
  res.type('text/plain');
  res.send('Welcome to the main page!  We are boring here.\n'+Math.random());
});

app.get('/other-page', function(req, res){
  res.type('text/plain');
  res.send('Welcome to the other page!  Does not get more exciting than this.');
});

app.use(function(req, res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - You are in uncharted territory!  Way to not be a sheep!');
});

app.use(function(err, req, res, next){
  res.type('text/plain');
  res.status(500);
  res.send('500 - Ah, you win!  I am too boring for the world.');
});

app.listen(app.get('port'), function(){
  console.log('Express has launched.  Please view from http://localhost:' + app.get('port') + '; Press Ctrl-C to return home instantly.');
});
