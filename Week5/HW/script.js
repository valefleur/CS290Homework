function createRow(parent, columns, header){
    // parent is the table node (thead or tbody)
    // columns is the number of cells to add
    // header is a boolean indicating if the cell should be a header or not
    var row = parent.insertRow(-1);
    //now fill new row with cells
    for (var i = 0; i < columns; i++){
        var cell;
        if (header) { cell = document.createElement("TH"); }
        else { cell = row.createElement("TD"); }
        cell.innerHTML = "text before adding cell";
        row.appendChild(cell);
        console.log("created row i: " + i );
    }
    
}

var table = document.createElement("TABLE");
table.border = "2"; //so I can see it
console.log("Created table");
createRow(table, 4, true);