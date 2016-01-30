/*
Adina Edwards
31st January 2016
CS290 Week4 Act1
*/
function buildList(list) {
    var result = [];
    var i;
    for (i = 0; i < list.length; i++) {
        var item = 'item' + list[i];
        result.push(pushedAlert(item, list[i]));
    }
    return result;
}

var pushedAlert = function(item, listEntry) {
    alert(item + ' ' + listEntry);
}
 
function testList() {
    var fnlist = buildList([1,2,3]);
    // using j only to help prevent confusion - could use i
    for (var j = 0; j < fnlist.length; j++) {
        fnlist[j]();
    }
}

console.log("Running...");
testList();