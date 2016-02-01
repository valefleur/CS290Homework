function Automobile(year, make, model, type) {
    this.year = year; //integer (ex. 2001, 1995)
    this.make = make; //string (ex. Honda, Ford)
    this.model = model; //string (ex. Accord, Focus)
    this.type = type; //string (ex. Pickup, SUV)
}

Automobile.prototype.logMe = function (logType) {
    var thisCar = this.year + " " + this.make + " " + this.model;
    if (logType) {
        thisCar += " " + this.type;
    }
    console.log(thisCar);
};

var automobiles = [ 
    new Automobile(1995, "Honda", "Accord", "Sedan"),
    new Automobile(1990, "Ford", "F-150", "Pickup"),
    new Automobile(2000, "GMC", "Tahoe", "SUV"),
    new Automobile(2010, "Toyota", "Tacoma", "Pickup"),
    new Automobile(2005, "Lotus", "Elise", "Roadster"),
    new Automobile(2008, "Subaru", "Outback", "Wagon")
    ];

var weightType = function ( car ){
    if ( car.type.toLowerCase() == "roadster" ) { return 4; }
    else if ( car.type.toLowerCase() == "pickup") { return 3; }
    else if ( car.type.toLowerCase() == "suv") { return 2; }
    else if ( car.type.toLowerCase() == "wagon" ) { return 1; }
    else { return 0; }
}

/*This function sorts arrays using an arbitrary comparator. (This means use a higher-order function where an arbitrary comparator is compared to a specific variable.  Have this function return a function where the specific variable is compared to an input argument.  Hmm, maybe not here, but probably somewhere.) You pass it a comparator and an array of objects appropriate for that comparator and it will return a new array which is sorted with the largest object in index 0 and the smallest in the last index*/
function sortArr(comparator, array) {
    /*your code here*/
    var aLength = array.length;
    var tempArray = new Array(aLength);
    var sortedArray = new Array(aLength);
    var index, currentGreatest = null;
    
    for(var i in array){
        tempArray[i] = array[i];
        //console.log(i + "th element: " + tempArray[i].make);
    }
    for(var j=0; j < aLength; j++){
        for(var k=0; k < tempArray.length; k++){
            if(!comparator(currentGreatest, tempArray[k])){ //if false, tempArray[k] is the greatest
                currentGreatest = tempArray[k];
                index = k;
            }  
        }
        sortedArray[j] = currentGreatest;
        currentGreatest = null;
        tempArray.splice(index, 1);
        //console.log("j(" + j + ") loop: currentGreatest " + sortedArray[j].year);
    }
    return sortedArray;
}


/*A comparator takes two arguments and uses some algorithm to compare them. If the first argument is larger or greater than the 2nd it returns true, otherwise it returns false. Here is an example that works on integers*/
function exComparator(int1, int2) {
    if (int1 > int2) {
        return true;
    } else {
        return false;
    }
}

/*For all comparators if cars are 'tied' according to the comparison rules then the order of those 'tied' cars is not specified and either can come first*/

/*This compares two automobiles based on their year. Newer cars are "greater" than older cars.*/
function yearComparator(auto1, auto2) {
    /* your code here*/
    if (auto1 == null) { return false; }
    else if (auto1.year > auto2.year) { return true; }
    else { return false; }
}

/*This compares two automobiles based on their make. It should be case insensitive and makes which are alphabetically earlier in the alphabet are "greater" than ones that come later.*/
function makeComparator( auto1, auto2 ){
    /* your code here*/
    if (auto1 == null) { return false; }
    else if ( auto1.make.toLowerCase() < auto2.make.toLowerCase()) { return true; }
    else { return false; }
}

/*This compares two automobiles based on their type. The ordering from "greatest" to "least" is as follows: roadster, pickup, suv, wagon, (types not otherwise listed). It should be case insensitive. If two cars are of equal type then the newest one by model year should be considered "greater". (This last part means call yearComparator(tied1, tied2).)*/
function typeComparator( auto1, auto2 ){
    /* your code here*/
    if (auto1 == null) { return false; }
    else if ( auto1.type.toLowerCase() == auto2.type.toLowerCase() ) { 
        //console.log("typeComparator says same type: " + auto1.type.toLowerCase() + " and " + auto2.type.toLowerCase());
        return yearComparator(auto1, auto2); 
    }
    else if ( weightType(auto1) > weightType(auto2) ) { 
        //console.log("typeComparator says type1 is " + auto1.type + " with weight " + weightType(auto1));
        //console.log("     type2 is " + auto2.type + " with weight " + weightType(auto2));
        return true; 
    }
    else { 
        //console.log("typeComparator says type2 is greater: " + auto2.type);
        return false; 
    }
}

/* my "main" function */
/*console.log("DEBUG!!!");
automobiles[0].logMe(false);
console.log(automobiles[1].type + " is a better than a " + automobiles[2].type + ": " + typeComparator(automobiles[1], automobiles[2]));

console.log("DEBUG!!!");*/

console.log("*****");
console.log("The cars sorted by year are: ");
//sort by year
var sortedByYear = sortArr(yearComparator, automobiles);
//sortedByYear.logMe(false);
for (var i = 0; i < sortedByYear.length; i++) {
    //console.log("DEBUG: sortedByYear is: " + sortedByYear[i]);
    sortedByYear[i].logMe(false);
}

console.log(" ");
console.log("The cars sorted by make are: ");
//sort by make
var sortedByMake = sortArr(makeComparator, automobiles);
for( var i = 0; i < sortedByMake.length; i++){
    sortedByMake[i].logMe(false);
}

console.log(" ");
console.log("The cars sorted by type are: ");
var sortedByType = sortArr(typeComparator, automobiles);
for( var i = 0; i < sortedByType.length; i++){
    sortedByType[i].logMe(true);
}

console.log("*****");

/*Your program should output the following to the console.log, including the opening and closing 5 stars. All values in parenthesis should be replaced with appropriate values. Each line is a seperate call to console.log.

Each line representing a car should be produced via a logMe function. This function should be added to the Automobile class and accept a single boolean argument. If the argument is 'true' then it prints "year make model type" with the year, make, model and type being the values appropriate for the automobile. If the argument is 'false' then the type is ommited and just the "year make model" is logged. <<Is this referring to a prototype function?  I believe so, as it is a function that must know what instance of an object it is acting upon, but only accepts a boolean argument.  Additionally, all auto objects can use this same function as the specific car will be fordTruck.logMe(true);>>

*****
The cars sorted by year are:
(year make model of the 'greatest' car)
(...)
(year make model of the 'least' car)

The cars sorted by make are:
(year make model of the 'greatest' car)
(...)
(year make model of the 'least' car)

The cars sorted by type are:
(year make model type of the 'greatest' car)
(...)
(year make model type of the 'least' car)
*****

As an example of the content in the parenthesis:
1990 Ford F-150 */