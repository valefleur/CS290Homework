//set up Express
var express = require("express");
var app = express();

//set up Handlebars
var handles = require("express-handlebars").create({defaultLayout:"main"});
app.engine("handlebars", handles.engine);
app.set("view engine", "handlebars");

//set up Sessions
var session = require("express-session");
app.use(session({secret:"MtWoRw", resave:"false", saveUninitialized:"false"}));
//ERROR: see: https://github.com/expressjs/session/issues/56


//set up BodyParser
var bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({extended:false}));
//TODO don't we need another line to parse JSON POST requests?

//set up basic Node stuff
app.set("port", 3001);
var port = app.get("port");


//set up Routes
app.get("/count", function(req, res){
   var context = {};
    context.count = req.session.count || 0;
    req.session.count = context.count + 1;
    //could we have used req.session.count++ instead?
    //Or would that mess with the variable because it's live somehow?
    res.render("count", context);
});

app.post("/count", function(req, res){
    var context = {};
    if(req.body.command === "resetCount"){
        req.session.count = 0;
    } else{
        context.err = true;
    }
    context.count = req.session.count || 0;
    req.session.count = context.count + 1;
    res.render("count", context);
});

//set up Error Routes
app.use(function(req,res){
    res.status(404);
    res.render("404");
});

app.use(function(err,req,res,next){ //needs another arg (I think it's err)
    res.status(500);
    res.render("500");
})

app.listen(port, function(){
    console.log("Listening on port " + port + ".  Press Ctrl-C to land.");
});