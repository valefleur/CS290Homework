//set up Node & extentions
var express = require("express");
var app = express();
app.set("port", 3001);
var port = app.get("port");

//set up Express-Handlebars
var handles = require("express-handlebars").create({defaultLayout:"main"});
app.engine("handlebars", handles.engine);
app.set("view engine", "handlebars");

//set up Express-Sessions
var session = require("express-session");
app.use(session({secret:"MtWoRw", resave:"false", saveUninitialized:"false"}));

//set up BodyParser
var bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({extended:false}));

//set up Routes
app.get("/", function(req,res,next){
    var context = {};
    //If no session, go to main page
    //**I don't understand where users should enter their name the first time around
    if(!req.session.name){
        console.log("GET: no session name");
        res.render("newSession", context); //**nvm
        return;
    }
    context.name = req.session.name;
    context.count = req.session.toDo.length || 0;
    context.toDo = req.session.toDo || [];
    console.log(context.toDo);
    res.render("toDos", context);
});

app.post("/", function(req,res){
    var context = {};
    if(req.body["New List"]){
        console.log("Making new list.");
        req.session.name = req.body.name;
        req.session.toDo = [];
        req.session.curId = 0;
    }
    //if no session, go to main page
    if(!req.session.name){
        console.log("POST: No session name.  Redirecting to make one.");
        res.render("newSession", context);
        return;
    }
    //if adding item, push it to the array
    if(req.body["Add Item"]){
        console.log("Adding item.");
        req.session.toDo.push({"name":req.body.name, "id":req.session.curId});
        req.session.curId++;
    }
    //**why does Done have a return, but Add Item doesn't?
    if(req.body["Done"]){
        console.log("Marking as done.");
        req.session.toDo = req.session.toDo.filter(function(e){
            return e.id != req.body.id;
        });
    }
    
    context.name = req.session.name;
    context.count = req.session.toDo.length;
    context.toDo = req.session.toDo;
    console.log(context.toDo);
    res.render("toDos", context);
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