//set up node, express, handlebars, etc.
var express = require("express");
var app = express();
var handles = require("express-handlebars").create({defaultLayout: "main"});
app.engine("handlebars", handles.engine);
app.set("view engine", "handlebars");

app.set("port", 3000);


// functions
function random(){
    var ran = {};
    ran.num = Math.random() * 10;
    //ran.num = 5;
    return ran;
}


// set up Routes
app.get("/", function(req, res){
  //res.send("Welcome to the main page!  We are boring here.\n"+Math.random());
    res.render("home", random());
});

app.get("/other-page", function(req, res){
  //res.send("Welcome to the other page!  Does not get more exciting than this.");
    res.render("other-page");
});

//set up Error Routes
app.use(function(req, res){
  res.status(404);
  //res.send("404 - You are in uncharted territory!  Way to not be a sheep!");
    res.render("404");
});

app.use(function(err, req, res, next){
    console.log(err.stack);
  res.status(500);
  //res.send("500 - Ah, you win!  I am too boring for the world.");
    res.render("500");
});


// start Server
app.listen(app.get("port"), function(){
  console.log("Express has launched.  Please view from http://localhost:" + app.get("port") + "; Press Ctrl-C to return home instantly.");
});
