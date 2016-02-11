document.addEventListener("DOMContentLoaded", main);

function askForWeather(){
    var request = new XMLHttpRequest();
    var URL = "http://api.openweathermap.org/data/2.5/weather?q=";
    var city = document.getElementById("city_name").value;
    console.log("City is: " + city);
    var state = document.getElementById("state_name").value;
    console.log("State is: " + state);
    var appID = "&appid=fa7d80c48643dfadde2cced1b1be6ca1";
    var sync = false;
    if(city && state){
        request.open("GET", URL+city+appID, sync);
        request.send(null);
        var result = JSON.parse(request.responseText);
        console.log(result);
        document.getElementById("weatherResult").innerHTML = result;
    }
    else{
        document.getElementById("cityResult").innerHTML = "I need a city and a state to get you the weather!  I'm not as sophisticated as all of those other sites that just take your location as if they know you personally...";
    }
}

function main(){
    var submit_city = document.getElementById("submit_city");
    /*This line is broken because "submit_city" is a NAME not an ID.*/
    submit_city.addEventListener("click", function(event){
        event.preventDefault();
        askForWeather();
    });

    var submit_zip = document.getElementById("submit_zip");
    submit_zip.addEventListener("click", function(event){
        event.preventDefault();
        askForWeather();
    }); //might switch to askForWeatherZip()
}
/*
Think about creating a higher-order function that does all the askForWeather stuff, but differentiates between city and zip.  Would this be higher-order?

Any other JS specific functionality I can add here for learning purposes?  Would closures be helpful?  Probably not.  Ditto for prototypes.
*/

/*
var upButton = document.createElement("BUTTON");
upButton.innerHTML = "Move up";
document.body.appendChild(upButton);
upButton.addEventListener("click", moveUp);*/