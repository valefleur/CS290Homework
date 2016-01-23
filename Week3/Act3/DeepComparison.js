console.log("This should implement Deep Comparison.");

function deepEqual(first, second){
    if (first == second && first === second) { return true; }
    else if (typeof first == "object" && first != null &&
        typeof second == "object" && second != null){
        console.log("Both are objects and not null: " + first.prime + "\t" + second.prime);
        var i = 0;
        for (var prop in first){
            console.log("Inside for in loop the " + i + "th time.");
            if(deepEqual(prop, second.i)){
                return true;
            }
            else { return false; }
            i++;
        }
    }
    else if (first === second) { return true; }
    else { return false; }
}

var addressBook = {
    prime: "addressBook",
    annieAnderson: {
        name: "Annie Anderson",
        address: "1234 Louis Lane, Kent City, Nevada 88852",
        phone: 5436238875
    },
    bobBillson: {
        name: "Bob Billson",
        address: "283 Rudalph Road, Happy Valley, Montana 69003",
        phone: 0118999889113
    }
};

var singleNum = 88000;

var complexObject = {
    prime: "complexObject",
    anotherNumber: 8,
    aString: "Wouldn't it be cool to store a picture in an object?!",
    anArray: [667, "Then we could put pictures on web pages!", 
             "I'm in the array, too."]
};
console.log("complexObject.anArray is an: " + typeof(complexObject.anArray));
console.log("deepEqual of addressBook and complexObject: " + deepEqual(addressBook, complexObject));
console.log("deepEqual of undefined and null: " + deepEqual(undefined, null));
console.log("deepEqual of null and null: " + deepEqual(null, null));
console.log("deepEqual of singleNum and singleNum: " + deepEqual(singleNum, singleNum));
console.log("deepEqual of complexObject and null: " + deepEqual(complexObject, null));
console.log("deepEqual of addressBook and addressBook: " + deepEqual(addressBook, addressBook));
console.log("deepEqual of singleNum and complexObject: " + deepEqual(singleNum, complexObject));
console.log("Done executing deepEquals.");