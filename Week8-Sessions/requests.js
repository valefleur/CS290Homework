var express = require("express");
var app = express();

var handles = require("express-handlebars").create({defaultLayout: "main"});
app.engine("handlebars", handles.engine);
app.set("view engine", "handlebars");

//TODO create the page!!!!
//var creds = require("./credentials.js");
var creds = null;

var request = require("request");

app.set("port", 3001);
var port = app.get("port");

//NEW CODE; figure it out
app.use(express.static("public"));

app.get("/", function(req,res,next){
    var context = {}; 
    request("http://api.openweathermap.org/data/2.5/weather?q=corvallis&APPID=" + creds, function( err, response, body){
        if(!err && response.statusCode < 400){
            context.owm = body;
            request({
                "url":"http://httpbin.org/post",
                "method":"POST",
                "headers":{
                    "Content-Type":"application/JSON"
                },
                "body": '{"foo":"bar", "number":1}'
            }, function(err, response, body){
                if(!err && response.statusCode < 400){
                    context.httpbin = body;
                    res.render("home", context);
                } else{
                    console.log(err);
                    if(response) { console.log(response.statusCode); }
                }
                next(err);
            });
        }
    });
});


app.use(function(req, res){
    app.status(404);
    app.render("404");
});
app.use(function(err, req, res, next){
    app.status(500);
    app.render("500");
});

app.listen(port, function(){
    console.log("Lift off from port " + port + ".  Hit Ctrl-C to land.")
})