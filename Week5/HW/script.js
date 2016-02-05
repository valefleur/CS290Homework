function createRow(parent, columns, header){
    // parent is the table node (thead or tbody)
    // columns is the number of cells to add
    // header is a boolean indicating if the cell should be a header or not
    if(header){
        var headerRow = parent.insertRow(0);
        for (var i = 0; i < columns; i++){
            headerRow.
        }
    }
    var row = parent.createElement("tr");
    for (var i = 0; i < columns; i++){
        if (header) { row.createElement("th"); }
        else { row.createElement("td"); }
    }
    
}

var table = document.createElement("table");
//var table = document.body.firstElementChild;
console.log("Created table");
var tHeader = table.createTHead();
//> Uncaught TypeError: table.createElement is not a function

//var node = document.body
//var tHeader = table.firstChild;
console.log("Created table head");
createRow(tHeader, 4, true);