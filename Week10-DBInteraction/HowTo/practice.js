//set up a function that makes a request to Echo Nest
// and writes the response out to the console
function makeRequest(){
    var sync = true;
    var sendString = null;
    
    //set up variables which hold request info
    var url = "http://developer.echonest.com/api/v4/";
    var getArtist = "artist/";
    var hotttnesss = "hotttnesss";
    var withkey = "?api_key=FILDTEOIK2HBORODV";
    var ofArtist = "&name=lady+gaga";
    
    var artist = document.getElementById("artist").value;
    //document.getElementById("debug").innerHTML = "<br>Artist is: " + artist;
    sendString = url + getArtist + hotttnesss + withkey + ofArtist;
    console.log("**sendString is: " + sendString);
    
    //set up js requirements for making requests
    var request = new XMLHttpRequest();
    request.open("GET", sendString, sync);
    console.log("**Opened connection");
    request.addEventListener("load", function(){
        console.log("**Hit a 'load' event");
        var response = JSON.parse(request.responseText);
        console.log(response);
    });
    request.send(null);
    console.log("**Sent null");
}
 makeRequest();