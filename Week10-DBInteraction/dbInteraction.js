//set up Express
var express = require("express");
var app = express();

//set up Handlebars
var handles = require("express-handlebars").create({defaultLayout:'main'});
app.engine("handlebars", handles.engine);
app.set("view engine", "handlebars");

//set up BodyParser
var bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//set up basic Node
app.set("port", 3001);
var port = app.get("port");

//set up DB
var mysql = require("mysql");
var pool = mysql.createPool({
    host: 'localhost',
    user: 'student',
    password: 'default',
    database: 'todo'
});

// set up Routes
app.get("/", function(req, res){
    console.log("Inside '/'");
    var context = {};
    mysql.pool.query('SELECT * FROM todo', function(err, rows, fields){ //errs on this line
        //is this file connected to my DB correctly?
        //is my DB even set up correctly? file extention and all that
        console.log("Request to DB sent");
       if(err){
           console.log("DB err: " + err);
           next(err);
           return;
       }
        context.results = JSON.stringify(rows);
    });
    context.db = "Nothing yet!";
   res.render("home", context); 
});


//set up Error Routes
app.use(function(req, res){
    res.status(404);
    res.render("404");
});

app.use(function(err,req,res,next){
    res.status(500);
    res.render("500");
});

//Listen for communication
app.listen(port, function(){
    console.log("Launched into Interesphere on port " + port + ". Press Ctrl-C to land.");
});