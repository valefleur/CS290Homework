//set up Node & extensions
var express = require("express");
var app = express();

app.set("port", 3000);
var port = app.get("port");

var handles = require("express-handlebars").create({defaultLayout:"main"});
app.engine("handlebars", handles.engine);
app.set("view engine", "handlebars");

//set up Request Module
var request = require("request");
var creds = require("./credentials.js");

//set up Express-sessions
var session = require("express-session");
app.use(session({secret:"MtWoRw", resave:"false", saveUninitialized:"false"}));

//set up BodyParser
var bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//set up Routes
app.get("/", function(req, res, next){
    console.log("Here we are at /");
    var context = {};
    context.msg = "Here's a message!";
    //getArtistHotttnesss("versaille");
    //getBiographies("versaille");
    if(req.body["favArtist"] == undefined){
        console.log("rendering intro1");
        res.render("intro1", context);
    }
    else{
        var artist = req.body["favArtist"];
        console.log("req.body is: " + req.body["favArtist"]);
        //make request for artist hotttness and display on intro2
        var body = null;
        if(body = getArtistHotttnesss(artist)){
            console.log("rendering intro2");
            res.render("intro2", context); 
        }
        else console.log("Error getting hotttnesss: " + body);
    }
});

app.get("/intro2", function(req, res, next){
    console.log("DEBUG: at /intro2");
    var context = {};
    var artist = req.body["favArtist"];
    console.log("req.body is: " + req.body["favArtist"]);
    //make request for artist hotttness and display on intro2
    var body = null;
    if(body = getArtistHotttnesss(artist)){
        res.render("intro2", context);      
    }
    else console.log("Error getting hotttnesss: " + body);
});


//set up a function that makes a request to Echo Nest
// and writes the response out to the console
function getArtistHotttnesss(artist){
    var sync = true;
    var hotttString = null;
    
    //set up variables which hold request info
    var url = "http://developer.echonest.com/api/v4/";
    var getArtist = "artist/";
    var hotttnesss = "hotttnesss";
    var withkey = "?api_key=" + creds.echoNest;
    var ofArtist = "&name="+artist;
    
    hotttString = url + getArtist + hotttnesss + withkey + ofArtist;
    console.log("**hotttString is: " + hotttString);
    
    //set up js requirements for making requests
/* THIS WAY CAME FROM THE TEACHER AND GIVES THE CORS PROBLEM
    var request = new XMLHttpRequest();
    request.open("GET", sendString, sync);
    console.log("**Opened connection");
    request.addEventListener("load", function(){
        console.log("**Hit a 'load' event");
        var response = JSON.parse(request.responseText);
        console.log(response);
    });
    request.send(null);
    console.log("**Sent null");*/
    
    request(hotttString, function(error, response, body){
        console.log("Sent request hotttnesss...");
        if(!error && response.statusCode < 400){
            console.log("GetArtistHotttnesss responded with: " + body);
            return body;
        }
    });
}

function getBiographies(artist){
    var sync = true;
    var bioString = null;
    
    //set up variables which hold request info
    var url = "http://developer.echonest.com/api/v4/";
    var getArtist = "artist/";
    var getBios = "biographies/";
    var withkey = "?api_key=" + creds.echoNest;
    console.log("Key string: " + withkey);
    var ofArtist = "&name="+artist;

    bioString = url + getArtist + getBios + withkey + ofArtist;
    console.log("**bioString is: " + bioString);
    
    request(bioString, function(error, response, body){
        console.log("Sent request bio...");
        if(!error && response.statusCode < 400){
            console.log("Get Biographies responded with: " + body);
        }
    });
}


//set up Error Routes
app.use(function(req,res){
    res.status(404);
    res.render("404");
});

app.use(function(err,req,res,next){ //needs another arg (I think it's err)
    res.status(500);
    console.log("Error is: " + err);
    res.render("500");
});

app.listen(port, function(){
    console.log("Listening on port " + port + ".  Press Ctrl-C to land.");
});