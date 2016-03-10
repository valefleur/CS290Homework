/*
Adina Edwards
9th March 2016
CS290 Week10
HowTo on Echo Nest's API

Help with requests from
http://blog.modulus.io/node.js-tutorial-how-to-use-request-module
*/

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

//DON'T TOUCH THE ABOVE CODE; IT WORKS FINE

//set up Routes
app.get("/", function(req, res, next){
    console.log("Here we are at GET /");
    var context = {};
    if(!req.session.favArtist){
        console.log("GET: no session favArtist");
        res.render("intro1", context);
        return;
    }
});

app.post("/intro2", function(req, res, next){
    console.log("At POST /intro2");
    var context = {}
    if(req.body["gotFavArtist"]){
        console.log("in /intro2 : gotFavArtist button clicked!  favArtist is: " + req.body.favArtist);
        req.session.favArtist = req.body.favArtist;
        
        //now, use said session info
        context.favArtist = req.session.favArtist;
        //var response = null;
        
        hotttString = getArtistHotttnesss(context.favArtist);
        request(hotttString, function(error, response, body){
            console.log("Sent request hotttnesss...");
            if(!error && response.statusCode < 400){
                console.log("GetArtistHotttnesss responded with: " + body);
                context.hotttnesss = parseArtistHotttnesss(body);
                res.render("intro2", context); 
            }
            else console.log("Error getting hotttnesss: " + error);
        });
    }
    
});


//Set up functions for requesting and parsing
// These functions will make up the actual
// JS Echo Nest Library

//Creates a string for requesting artist hotttnesss
//Parameters: artist name
//Returns: A string which will request artist hotttnesss
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
    
    return hotttString;
}

//parse an Artist Hottttnesss response
//Parameters: body is the response object from Echo Nest
//Returns:
//  On success: hottttnesss value
//  On failure: message about request
function parseArtistHotttnesss(body){
    var resObj = JSON.parse(body);
    if(resObj.response.status.message != "Success"){
        return "ERROR: Response from Echo Nest failed." + resObj.response.status.message;
    }
    return resObj.response.artist.hotttnesss;
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