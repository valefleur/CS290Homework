glorious("HW");

function glorious(item) {
    if (item == "HW") {
        console.log("Glorious HW!!!");
    }
    else { console.log("Nothing glorious... :'(");}
}

var onScreen = function (input){
    document.getElementById("id1").textContent = "I'm ID1!!!!";
};
//onScreen("Stuff in onScreen arg.");
cubed(10);
var cubed = function (number) {
    var quotient = number * number * number;
    //document.getElementById("cube_it").textContent = quotient;
    console.log(number + " cubed is: " + quotient);
};

