var express = require("express");
var app = express();
var handles = require("express-handlebars").create({defaultLayout: "main"});
var parser = require("body-parser");

app.engine("handlebars", handles.engine);
app.set("view engine", "handlebars");

app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());

app.set("port", 3000);

// set up Routes
app.get("/", function(req, res){
    res.render("home");
});

app.get("/other-page", function(req, res){
    res.render("other-page");
});

app.get("/get-results", function(req, res){
    var context = {};
    context.type = "GET";
    var qParameters = "";
    for (var p in req.query){
        qParameters += "The name " + p + " contains the value " + req.query[p] + "<br>";
    }
    context.dataList = qParameters;
    console.log(context);
    //render generic results view, reguardless of GET vs. POST
    res.render("results", context);
})

app.post("/get-results", function(req, res){
    var context = {};
    context.type = "POST";
    var qParameters = [];
    for (var p in req.body){
        qParameters.push({"key":p,"value":req.body[p]});
    }
    context.postList = qParameters;
    console.log(qParameters);
    console.log(req.body);
    //render generic results view, reguardless of GET vs. POST
    res.render("results", context);
})

//set up Error Routes
app.use(function(req, res){
    res.status(404);
    res.render("404");
});

app.use(function(err, req, res, next){
    console.log(err.stack);
    res.status(500);
    res.render("500");
});


// start Server
app.listen(app.get("port"), function(){
  console.log("Express has launched.  Please view from http://localhost:" + app.get("port") + "; Press Ctrl-C to return home instantly.");
});
