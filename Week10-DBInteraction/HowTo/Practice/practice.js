var PORT = 3000;
var express = require("express");
var app = express();

var creds = require("./credentials.js");

var request = require("request");

app.set("port", PORT);
var port = app.get("port");

//document.addEventListener("DOMContentLoaded",makeRequest);

app.get("/", function(req, res, next){
    console.log("Inside app.get('/'...)");
    var context = {};
    makeRequest();
    console.log("Called makeRequest(), waiting on results");
});

//set up a function that makes a request to Echo Nest
// and writes the response out to the console
function makeRequest(){
    var sync = true;
    var sendString = null;
    
    //set up variables which hold request info
    var url = "http://developer.echonest.com/api/v4/";
    var getArtist = "artist/";
    var hotttnesss = "hotttnesss";
    var withkey = "?api_key=" + creds.echoNest;
    console.log("Key string: " + withkey);
    var ofArtist = "&name=lady+gaga";
    
    var artist = document.getElementById("artist").value;
    //document.getElementById("debug").innerHTML = "<br>Artist is: " + artist;
    sendString = url + getArtist + hotttnesss + withkey + ofArtist;
    console.log("**sendString is: " + sendString);
    
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
    
    request(sendString, function(error, response, body){
        console.log("Sent request...");
        if(!error && response.statusCode < 400){
            console.log("Node request responded with: " + body);
        }
    });
}

