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
    console.log("Here we are at GET /");
    var context = {};
    context.msg = "Here's a message!";
    //getArtistHotttnesss("versaille");
    //getBiographies("versaille");
    if(!req.session.favArtist){
        console.log("GET: no session favArtist");
        res.render("intro1", context);
        return;
    }

});

app.post("/", function(req, res, next){
    console.log("Here we are at POST /");
    var context = {};
    
    //if info was given to us, capture it in a session here
    if(req.body["gotFavArtist"]){
        console.log("gotFavArtist button clicked!  favArtist is: " + req.body.favArtist);
        req.session.favArtist = req.body.favArtist;
        
        //now, use said session info
        context.favArtist = req.session.favArtist;
        var response = null;
        
        //I think this line is executing and returning before the request
        //is even sent, which means the response will always be undefined
        //How do I give getArtistHotttnesss access to res.render() and/or
        //ensure that my app.post(route) will have access to a response 
        //that has been locked away in a different function 
        //(for library purposes)?  This is the big question to answer.
        response = getArtistHotttnesss(context.favArtist);
        console.log("resonse from getArtistHotttnesss is: " + response);
        if(response != undefined || null){
            console.log("rendering intro2 with artist hotttnesss info");
            res.render("intro2", context); 
        }
        else console.log("Error getting hotttnesss: " + response);
    }
    
    //if no session info, ask for it
    if(!req.session.favArtist){
        console.log("POST: no session favArtist.  Rendering intro1 now.");
        res.render("intro1", context);
        return;
    }
    
    console.log("Got to end of POST /.  Did anything get rendered?");
});

app.get("/intro2", function(req, res, next){
    console.log("DEBUG: at /intro2");
    var context = {};
    //var artist = req.body["favArtist"];
    var artist = req.session.favArtist;
    console.log("artist is: " + artist);
    //make request for artist hotttness and display on intro2
    var response = null;
    response = getArtistHotttnesss(artist);
    console.log("resonse from getArtistHotttnesss is: " + response);
    if(response != undefined || null){
        res.render("intro2", context);      
    }
    else console.log("Error getting hotttnesss: " + response);
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