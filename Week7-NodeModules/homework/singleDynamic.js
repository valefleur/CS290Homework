/*
Adina Edwards
21st February 2016
CS290 Week7
Help from handlebarsjs.com
*/

//set up server: node basics, express, handlebars, body-parser
var express = require("express");
var app = express();
var handles = require("express-handlebars").create({defaultLayout: "main"});
var parser = require("body-parser");

app.engine("handlebars", handles.engine);
app.set("view engine", "handlebars");

app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());

app.set("port", 3000);
var port = app.get("port");

app.get("/", function(req, res){
    var context = {};
    context.type = "GET";
    var qParameters = [];
    for (var p in req.query){
        qParameters.push({ "key":p, "value":req.query[p]});
    }
    context.dataList = qParameters;
    console.log(context);
    //render generic results view, reguardless of GET vs. POST
    res.render("results", context);
});

app.post("/", function(req, res){
    var context = {};
    context.type = "POST";
    var qParameters = [];
    
    console.log("DEBUG: " + req.body);
    for (var p in req.body){
        qParameters.push({"key":p,"value":req.body[p]});
    }
    context.dataList = qParameters;
    console.log(qParameters);
    console.log(req.body);
    //render generic results view, reguardless of GET vs. POST
    res.render("results", context);
});

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
app.listen(port, function(){
  console.log("Express has launched into the Intersphere.  Please view from http://localhost:" + port + "; Press Ctrl-C to return home instantly.");
});