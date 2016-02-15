/*
Adina Edwards
14th February 2016
CS290 Week 6 HW, Part I
*/
document.addEventListener("DOMContentLoaded", main);

function askForWeather(){
    var sync = true;
    var URL = "http://api.openweathermap.org/data/2.5/weather?q=";
    var sendString = null;
    var city = document.getElementById("city_name").value;
    //document.getElementById("debug").innerHTML = "<br>City is: " + city;
    var state = document.getElementById("state_name").value;
    //document.getElementById("debug").innerHTML += "<br>State is: " + state;
    var zip = document.getElementById("zip_name").value;
    var appID = "&appid=fa7d80c48643dfadde2cced1b1be6ca1";
    var units = document.getElementsByName("units");
    var unit = null;
    for (var i = 0; i < units.length; i++){
        if(units[i].checked){
            if("Fahrenheit" == units[i].value){
                unit = "imperial";
                unitReadable = " degrees Fahrenheit";
            }
            else if("Celsius" == units[i].value){
                unit = "metric";
                unitReadable = " degrees Celsius";
            }
            break; //only 1 will be checked
        }
        if(!unit){ // unit is still null if Kelvins
            unitReadable = " Kelvins";
        }
    }
    //document.getElementById("debug").innerHTML += "<br>Unit is: " + unit;
    //document.getElementById("debug").innerHTML += "<br>UnitReadable is: " + unitReadable;
    if(city && state){
        sendString = URL + city + "," + state;
        if(unit){
            sendString += "&units=" + unit;
        }
        sendString += appID;
    }
    else if (zip){
        sendString = URL + zip;
        if(unit){
            sendString += "&units=" + unit;
        }
        sendString += appID;
        //request.open("GET", URL+zip+appID, sync);
    }
    else{
        document.getElementById("weatherResult").innerHTML = "I need a city and a state to get you the weather!  Alternatively, I will take a Zip code.  I'm not as sophisticated as all of those other sites that just take your location as if they know you personally...";
        return null;
    }
    //document.getElementById("debug").innerHTML += "<br>sendString is: " + sendString;

    //create AJAX moment
    var request = new XMLHttpRequest();
    request.open("GET", sendString, sync);
    //register event listener so it will present response later
    request.addEventListener("load",function(){
        presentResponse(JSON.parse(request.responseText), unit)
    });
    request.send(null);
}

function presentResponse(result, unit){
    console.log(result);
    // determine units first
    var t, w = null;
    if(unit=="imperial"){
        t = " degrees Fahrenheit";
        w = " mph"
    }
    else if(unit=="metric"){
        t = " degrees Celsius";
        w = " m/sec";
    }
    else{
        t = " Kelvins";
        w = " m/sec";
    }
    
    document.getElementById("city").innerHTML = "City: " + result.name;
    document.getElementById("latitude").innerHTML = "Latitude: " + result.coord.lat+" degrees";
    document.getElementById("longitude").innerHTML = "Longitude: " + result.coord.lon+" degrees";
    document.getElementById("main").innerHTML = "Main Weather: "+result.weather[0].main;
    document.getElementById("description").innerHTML = "Description: "+result.weather[0].description;
    document.getElementById("temp").innerHTML = "Temperature: "+ result.main.temp+t;
    document.getElementById("pressure").innerHTML = "Pressure: "+ result.main.pressure + "hPa";
    document.getElementById("humidity").innerHTML = "Humidity: "+ result.main.humidity+"%";
    document.getElementById("windSpeed").innerHTML = "Wind Speed: "+ result.wind.speed+w;
    document.getElementById("windDeg").innerHTML = "Wind Direction: "+ result.wind.deg+" degrees";
    document.getElementById("clouds").innerHTML = "Cloudiness: "+result.clouds.all+"%";
    document.getElementById("time").innerHTML = "Info collected at: "+result.dt+" UTC";
}

function main(){
    var submit_city = document.getElementById("submit_city");
    submit_city.addEventListener("click", function(event){
        event.preventDefault();
        askForWeather();
    });
}