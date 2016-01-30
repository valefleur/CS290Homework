function buildList(list) {
    var result = [];
    var i;
    for (i = 0; i < list.length; i++) {
        var item = 'item' + list[i];
        result.push(pushedAlert(item, list[i]));
        /*
        0: itemlist[0]  alert(itemlist[0] list[0])
        1: itemlist[1]
        */
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