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

/*
//This function should no longer be needed
app.post("/", function(req, res, next){
    console.log("Here we are at POST /");
    var context = {};
    
    //if info was given to us, capture it in a session here
    if(req.body["gotFavArtist"]){
        console.log("in / : gotFavArtist button clicked!  favArtist is: " + req.body.favArtist);
        req.session.favArtist = req.body.favArtist;
        
        //now, use said session info
        context.favArtist = req.session.favArtist;
        var response = null;
        
        hotttString = getArtistHotttnesss(context.favArtist);
        request(hotttString, function(error, response, body){
            console.log("Sent request hotttnesss...");
            if(!error && response.statusCode < 400){
                console.log("GetArtistHotttnesss responded with: " + body);
                res.render("intro2", context); 
            }
            else console.log("Error getting hotttnesss: " + response);
        });
    }
    
    //if no session info, ask for it
    if(!req.session.favArtist){
        console.log("POST: no session favArtist.  Rendering intro1 now.");
        res.render("intro1", context);
        return;
    }
    
    console.log("Got to end of POST /.  Did anything get rendered?");
});
*/

app.post("/intro2", function(req, res, next){
    console.log("At POST /intro2");
    var context = {}
    if(req.body["gotFavArtist"]){
        console.log("in /intro2 : gotFavArtist button clicked!  favArtist is: " + req.body.favArtist);
        req.session.favArtist = req.body.favArtist;
        
        //now, use said session info
        context.favArtist = req.session.favArtist;
        var response = null;
        
        var hotttString = getArtistHotttnesss(context.favArtist);
        var biosString = getArtistBiographies(context.favArtist, 1, 0);
        var imagesString = getArtistImages(context.favArtist, 1, 0);
        //request hotttnesss
        request(hotttString, function(error, response, body){
            console.log("Sent request hotttnesss...");
            if(!error && response.statusCode < 400){
                console.log("GetArtistHotttnesss responded with: " + body);
                context.hotttnesss = parseArtistHotttnesss(body);
                
                //Request image
                request(imagesString, function(error0, response0, body0){
                    console.log("Sent request images...");
                    if(!error0 && response0.statusCode < 400){
                        //console.log("getArtistImages responded with: " + body0);
                        context.images = parseArtistImages(body0);
                        context.oneImageURL = context.images[0].url;
                        console.log("context.oneImageURL is: " +context.oneImageURL);
                        //Request bios
                        request(biosString, function(error1, response1, body1){
                            if(!error1 && response1.statusCode < 400){
                                //console.log("GetArtistBiographies responded with: " + body1);
                                context.bios = parseArtistBiographies(body1);
                                res.render("intro2", context); //GOES IN INNER MOST REQUEST
                            }
                            else console.log("Error getting bios: " + error1);
                        });
                    }
                    else console.log("Error getting images: " + error0);
                });
            }
            else console.log("Error getting hotttnesss: " + error);
        });
    }
});


app.get("/intro2", function(req, res, next){
    console.log("DEBUG: at GET /intro2");
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
        return "ERROR: Hotttnesss response from Echo Nest failed." + resObj.response.status.message;
    }
    return resObj.response.artist.hotttnesss;
}


function parseArtistBiographies(body){
    var resObj = JSON.parse(body);
    if(resObj.response.status.message != "Success"){
       return "ERROR: Bio response from Echo Nest failed." + resObj.response.status.message;
       }
    var bioArray = [];
    var current = 0;
    var count = resObj.response.total;
    if (count > 5){
        count = 5;
    }
    var bios = resObj.response.biographies;
    //console.log(typeof(bios));
    //console.log(typeof(resObj.response.biographies));
    //order bios by not truncated, then truncated
    for(var i = 0; i < count; i++){
        if(bios[i].truncated){
            //put item at end of bioArray
            bioArray.push(bios[i]);
        }
        else bioArray.unshift(bios[i]);
    }
    if(bioArray.length != count){
        console.log("ERROR: bioArray.length != count " + bioArray.length + " " + count);
        for(var j = 0; j < bioArray.length; j++){
            console.log(bioArray[i]);
        }
    }
    //else console.log("bioArray.length & count " + bioArray.length + " " + count);
    
    return bioArray; //probably the wrong last part
    //I suspect this will fail because biographies: [{test:"", site:""...}]
    //I need to access this differently.  Is [] an array?  I think so...
}

//Creates a string for requesting artist biographies
//Parameters:
//  artist is the name of the artist
//  quantity indicates how many bios to request
//  start indicates which bio to start with
//Returns: a string requesting a quantity number of bios for artist from start onward
function getArtistBiographies(artist, quantity, start){
    var sync = true;
    var bioString = null;
    
    //set up variables which hold request info
    var url = "http://developer.echonest.com/api/v4/";
    var getArtist = "artist/";
    var getBios = "biographies/";
    var withkey = "?api_key=" + creds.echoNest;
    var results = quantity || 15;
    var start = start || 0;
    //console.log("Key string: " + withkey);
    var ofArtist = "&name="+artist;

    bioString = url + getArtist + getBios + withkey + ofArtist;
    return bioString;
    console.log("**bioString is: " + bioString);
}

//Creates a string for requesting artist images
//Parameters: 
//  artist name
//  quantity
//  start index
//Returns: Array of objects representing images
function getArtistImages(artist, quantity, start){
    var imagesString = null;
    //set up variables which hold request info
    var url = "http://developer.echonest.com/api/v4/";
    var getArtist = "artist/";
    var getImages = "images/";
    var withkey = "?api_key=" + creds.echoNest;
    var results = quantity || 15;
    var start = start || 0;
    var ofArtist = "&name=" + artist;

    imagesString = url + getArtist + getImages + withkey + ofArtist;
    return imagesString;
    console.log("**imagesString is: " + imagesString);
    
}


//Parses response from getArtistImages
//Parameters: body object returned by response
//Returns: array of image objects
function parseArtistImages(body){
    var resObj = JSON.parse(body);
    if(resObj.response.status.message != "Success"){
       return "ERROR: Images response from Echo Nest failed." + resObj.response.status.message;
       }
    var imagesArray = [];
    var current = 0;
    var count = resObj.response.total;
    var images = resObj.response.images;
    console.log("count is: " + count);
    console.log("images: " + images);
    //order bios by not truncated, then truncated
    for(var i = 0; i < count; i++){
        if(images[i].url){
            //put item at end of bioArray
            imagesArray.push(images[i]);
        }
        else console.log("Image without URL!");
    }
    if(imagesArray.length != count){
        console.log("ERROR: imagesArray.length != count " + imagesArray.length + " " + count);
        for(var j = 0; j < imagesArray.length; j++){
            console.log(imagesArray[j]);
        }
    }
    else console.log("imagesArray.length & count " + imagesArray.length + " " + count);
    
    return imagesArray;
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