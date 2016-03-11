/*
Adina Edwards
9th March 2016
CS290 Week10
HowTo on Echo Nest's API

Help with requests from
http://blog.modulus.io/node.js-tutorial-how-to-use-request-module
*/

/*
TODO
- have Next button render page about "Before we begin"
- Next, render page about getArtistHotttnesss
- then about parseArtistHotttness
- then show example JS request for artist hotttnesss
- render pages about getArtistImages & parseArtistImages
- render pages about getArtistBios & parseArtistBios
- show example of all of it put together
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

app.use(express.static(__dirname + '/public'));

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
    else{
        console.log("Resetting favArtist to null.");
        req.session.favArtist = null;
        res.render("intro1", context);
    }
});

app.post("/explaination", function(req, res, next){
    var context = {};
    if(req.body["next"]){
        console.log("Next button clicked.");
    }
    
    res.render("HowToPage", context); 
});

app.post("/BeforeWeBegin", function(req, res, next){
    console.log("At POST /BeforeWeBegin");
    var context = {};
    context.title = "Before We Begin";
    context.next = "keys";
    context.previous = ""; //go back to /
    context.assumptions = [{item:"Javascript"},{item:"JSON Objects"}, {item:"The concept of clients and servers"}];
    console.log(context.assumptions.length)
    context.text1 = "This tutorial assumes you area already familiar with: "
    context.text2 = "Please click Next to continue.";

    res.render("BeforeWeBegin", context);
});

app.post("/keys", function(req, res, next){
    console.log("At POST /keys");
    var context = {};
    context.ch = "Getting Started"
    context.pg = "Getting a Key & Why We Need One";
    context.next = "responses";
    context.previous = "BeforeWeBegin";
    context.text = [{item: "Echo Nest requires that developers create an Echo Nest Developer Account.  This account will be used to track a developer, and the developer’s use of the Echo Nest API key.  This key is important: it is required as part of any request to Echo Nest.  Without it, requests will be ignored."},{item: "Using this API key allows Echo Nest to track how often an application makes requests to the Echo Nest API.  If too many requests are received within a set amount of time, rate limiting will be applied.  This ensures access to other applications using the same API.  For our purposes, it is unlikely that we will encounter rate limiting."},{item: "To set up a developer account, go to Echo Nest’s Create an Account page: https://developer.echonest.com/account/register and fill in the requested information.  Follow the instructions for obtaining your key.", url: "https://developer.echonest.com/account/register"}];
    res.render("HowToPage", context);
});

//TODO problem displaying bullets.dif
//maybe not; had a typo in the handlebars page
app.post("/responses", function(req, res, next){
    console.log("At POST /responses");
    var context = {};
    context.ch = "Responses"
    context.pg = "Was the Request a Success or a Failure?";
    context.next = "warning";
    context.previous = "keys";
    context.text = [{item:"Responses can be in JSON, XML or JSONP.  We’re sticking with JSON for this How-To.  XML and JSONP requests and responses will hold the same information in a slightly different format.  The only differences are:", bullets:[{dif:"What format was requested"}, {dif:"How to parse the response, which will be based on the requested format"}, {dif:"Responses generally contain two objects: the payload, the contents of which depend on the initial request, and a status object, which provides information on the success, or lack thereof, of the request."}]}];
    
    res.render("HowToPage", context);
});

app.post("/warning", function(req, res, next){
    console.log("At POST /warning");
    var context = {};
    context.ch = "Getting Started"
    context.pg = "Warning About Dynamic Data";
    context.next = "hotttnesss";
    context.previous = "responses";
    context.text = [{item:"Because music data is constantly shifting, evolving and growing, it is foolish to assume all portions of a response will have complete data, or data at all.  Code dealing with responses should be robust enough to handle null or undefined data, new data fields or a new order of these data fields.  This library does not rely on hardcoded indices to locate data, and tries to protect against missing data."}];
    
    res.render("HowToPage", context);
});

app.post("/library", function(req, res, next){
    console.log("At POST /library");
    var context = {};
    context.ch = "Echo Nest JS Library"
    context.pg = "The Beginnings";
    context.next = "hotttnesss";
    context.previous = "warning";
    context.text = [{item:"Using the Echo Nest API, I was able to write the beginning portions of a JavaScript library that creates requests and parses responses for various Echo Nest API calls.  Here I will be presenting a total of six library functions, which correspond to the three API calls needed to request the information that was previously displayed about your favorite artist."}];
    
    res.render("HowToPage", context);
});

app.post("/hotttnesss", function(req, res, next){
    console.log("At POST /hotttnesss");
    var context = {};
    context.ch = "Hotttnesss"
    context.pg = "How Much Buzz Does this Artist Have?";
    context.next = "images";
    context.previous = "library";
    context.text = [{item:"Hotttnesss is a parameter defined by Echo Nest as “how hottt an artist currently is”. [http://developer.echonest.com/docs/v4/artist.html#hotttnesss]<a href=></a>  A blog post on Music Machinery mentions that hotttnesss is an indicator of how much buzz there is around a current artist.  This could correspond to how frequently their name is mentioned in blog posts, reviews, play counts, etc. [http://musicmachinery.com/2009/12/09/a-rising-star-or/]<a href=>Hottt or Nottt</a>"}, {item:"Hotttnesss is a value between 0 and 1, where the higher the value the more buzz the artist has.  Significantly popular artists like David Guetta have a hotttnesss around 0.7, where artists like Sleepy have a hotttnesss closer to 0.3.  Values outside of [0.3, 0.7] are very rare.  Even The Beatles have a hotttnesss of 0.776."}];
    context.get = {name:"getArtistHotttnesss",des:"This function will create the string sent to Echo Nest during a request.  The only parameter it accepts is the artist name, although it does expect Echo Nest developer credentials to be supplied via an external file.  The string returned from this function can immediately be used in the request like so:", hotttnesss:true, code:"ENTER CODE HERE"}
    console.log("context.get.code is: " + context.get.code);
    context.parse = {name:"parseArtistHotttnesss",des:"The response from a request for hotttnesss holds several values, but generally the value we care about is the hotttnesss value itself.  parseArtistHotttnesss returns that value if the request was successful.  Otherwise, it returns the error message from the response status.  It takes the entire response object.", hotttnesss:true, code:"ENTER CODE HERE"}
    context.together = {text:"Here's the code in action:", hotttnesss:true, code:"ENTER LIBRARY CODE HERE"};
    
    res.render("HowToPage", context);
});

app.post("/images", function(req, res, next){
    console.log("At POST /images");
    //if time allows, put up more pics of their favArtist
    var context = {};
    context.ch = "Images"
    context.pg = "Let's Get Some Visuals";
    //context.next = "bios";
    context.previous = "hotttnesss";
    context.text = [{item:"Echo Nest doesn’t have an API call for requesting a single image.  Instead, it has a call for requesting several images.  The hottter the artist, generally the more images are available."}, {item:"And since we are talking about making requests to and from webservers, the response doesn’t contain jpegs or pngs; instead, it contains web links to said jpegs and pngs.  Getting the resulting picture to display requires that the server hosting the image is up and running.  (While utilizing this particular call, I have noticed that the first sets of images returned by Echo Nest are frequently hosted on a server that doesn’t respond and may very well not be running at all.  If developing a professional website, I would put effort into protecting against this sort of behavior, but as my focus is on the content of this HowTo, and less so on developing a pristine browsing experience, we will all have to suffer with broken images.)"}];
    context.get = {name:"getArtistImages", des:"As it sounds, getArtistImages builds the request string for requesting images of a particular artist.  In order to do so, it takes in the artist, a quantity and a starting index as parameters.  Along with the request payload, Echo Nest will provide information about how many artist images it has.  The start value indicates from where in this entire list to start pulling images. It returns an array of length quantity where each element is an object containing information about a single image.", images:true, code:"ENTER CODE HERE"};
    context.parse = {name:"parseArtistImages",des:"parseArtistImages takes the response body from the images request.  If an error was received, it reports the error; otherwise it returns an array of image objects.  Image objects contain a url to an image file (whether or not the server on the receiving side of that url responds seems to be questionable as noted above) and some licensing information for that image.", images:true, code:"ENTER CODE HERE"}
    context.together = {text:"Together the two functions work as so:", images:true, code:"ENTER LIBRARY CODE HERE"};
    
    res.render("HowToPage", context);
});

app.post("/bios", function(req, res, next){
    console.log("At POST /bios");
    var context = {};
    context.ch = "Getting Biographies"
    context.pg = "Who is this Artist, Again?";
    context.previous = "images";
    context.text = [{item:""}];
    
    context.together = {text:"", bios:true, code:"ENTER LIBRARY CODE HERE"};
    res.render("HowToPage", context);
});

app.post("/intro2", function(req, res, next){
    console.log("At POST /intro2");
    var context = {}
    if(req.body["gotFavArtist"]){
        console.log("in /intro2 : gotFavArtist button clicked!  favArtist is: " + req.body.favArtist);
        req.session.favArtist = req.body.favArtist;
        
        //now, use said session info
        context.favArtist = req.session.favArtist;

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
                        if(context.images[0]){
                                console.log(context.images[0]);
                                console.log(context.images[0].license);
                                context.oneImageURL = context.images[0].url;
                        }
                        else context.oneImageURL = "https://www.wikipedia.org/portal/wikipedia.org/assets/img/Wikipedia-logo-v2@2x.png"
                        console.log("context.oneImageURL is: " +context.oneImageURL);
                        //Request bios
                        console.log("biosString is: "+ biosString);
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

//Creates a string for requesting artist bios
//Parameters: 
//  artist name
//  quantity
//  start index
//Returns: Array of objects representing bios
function parseArtistBiographies(body){
    var resObj = JSON.parse(body);
    if(resObj.response.status.message != "Success"){
       return "ERROR: Bio response from Echo Nest failed." + resObj.response.status.message;
       }
    var bioArray = [];
    var current = 0;
    var count = resObj.response.total;
    if (count > 3){
        count = 3;
    }
    var bios = resObj.response.biographies;
    //console.log("bio count is: " + count);
    console.log("bios[0] is: " + bios[0]);
    //console.log(typeof(bios[0]));
    //order bios by not truncated, then truncated
    for(var i = 0; i < count; i++){
        //console.log("i is: " + i);
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
    
    return bioArray;
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

//BROKEN
//Parses response from getArtistImages
//Parameters: body object returned by response
//Returns: array of image objects
function parseArtistImages(body){
    var resObj = JSON.parse(body);
    if(resObj.response.status.message != "Success"){
       return "ERROR: Images response from Echo Nest failed." + resObj.response.status.message;
       }
    console.log("resObj is: " + resObj);
    var imagesArray = [];
    var current = 0;
    var count = resObj.response.total;
    if (count > 5){
        count = 5;
    }
    var images = resObj.response.images;
    console.log("count is: " + count);
    
    //order bios by not truncated, then truncated
    for(var i = 0; i < count; i++){
        console.log("i is: " + i);
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