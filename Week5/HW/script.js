// to get practice, rewrite createRow or wrapper as a higher-order function
function createPartOfTable(header, then) {
    if (header) { //create THEADER & header row 
        var table = document.getElementsByTagName("TABLE");
        var head = document.createElement("THEAD");
        head.border = "gold";
        head.innerHTML = "higher-order table";
        table[0].appendChild(head);
        console.log("THEAD created");
        //TODO: create a td in the head
        //finally, create TBODY
        var body = document.createElement("TBODY");
        table[0].appendChild(body);
        console.log("TBODY created");
    }
    else { then; }
}

var newTableRow = function(node, length) {
    var row = node.insertRow(-1);
    for (var i = 0; i < length; i++){
        var cell = row.insertCell(i);
        //enter cell content here
        cell.innerHTML = "cell contents" + i;
    }
}

var nothing = function(){
    return true;
}


function createRow(parent, columns, header){
    // parent is the table node (thead or tbody)
    // columns is the number of cells to add
    // header is a boolean indicating if the cell should be a header or not
    var row = parent.insertRow(-1);
    //now fill new row with cells
    for (var i = 0; i < columns; i++){
        var cell;
        if (header) { 
            cell = document.createElement("TH"); 
            cell.innerHTML = "normal function table";
        }
        else { 
            cell = row.createElement("TD");
            cell.innerHTML = "text before adding cell" + i;
        }
        row.appendChild(cell);
        console.log("created row i: " + i );
    }
    
}


console.log("DEBUG");
//var location = document.getElementById("gameboard");
var table = document.createElement("TABLE");
table.border = "2";
document.body.appendChild(table);
console.log("Table created");
createPartOfTable(true, nothing);
createPartOfTable(false, newTableRow(table, 4));
console.log("DEBUG");

var table1 = document.createElement("TABLE");
document.body.appendChild(table1);
table1.border = "2";//so I can see it
console.log("Created table1");
createRow(table1, 4, true);
