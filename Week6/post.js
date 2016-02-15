/*
Adina Edwards
14th February 2016
CS290 Week 6 HW, Part II
*/
document.addEventListener("DOMContentLoaded", main);

function parseResponse(response){
    //document.getElementById("debug").innerHTML = response.candy;
    console.log(response);
    document.getElementById("candyChoice").innerHTML = "You prefer: " +response.candy;
    document.getElementById("dishChoice").innerHTML = "Your favorite dish is: " + response.dish;
    
    var resObject = document.getElementById("object");
    resObject.style.backgroundColor = "aquamarine";
    resObject.style.border = "2px solid";
    resObject.style.maxWidth = "300px";
    resObject.innerHTML = "The response object from the server is: ";
    for(var key in response ){
        resObject.innerHTML += "<br>" + key +":" + response[key];
    }
}

function sendRequest(){
    var sendString = {};
    var candyChoices = document.getElementsByName("candy");
    var preference = null;
    for (var i = 0; i < candyChoices.length; i++){
        if(candyChoices[i].checked){
            preference = candyChoices[i].value;
            break; //only 1 checked
        }
    }
    sendString.candy = preference;
    //console.log("SendString.candy is: " + sendString.candy);
    
    var dish = document.getElementById("dish").value;
    console.log("dish is: " + dish);
    sendString.dish = dish;
    
    //set up request stuff
    var async = true;
    var URL = "http://httpbin.org/post";
    var request = new XMLHttpRequest();
    request.open("POST", URL, async);
    request.setRequestHeader("Content-type", "application/json");
    request.addEventListener("load", function(){
        var stuff = JSON.parse(request.responseText);
        parseResponse(JSON.parse(stuff.data));
    });
    request.send(JSON.stringify(sendString));
}


function main(){
    var submit = document.getElementById("submit").addEventListener("click", function(event){
        event.preventDefault();
        sendRequest();
    });
}