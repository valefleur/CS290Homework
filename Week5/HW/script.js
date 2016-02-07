/*
Adina Edwards
8th February 2016
CS290
Help with border styles from W3schools.com
*/
// to get practice, rewrite createRow or wrapper as a higher-order function
function createPartOfTable(header, then, index) {
    if (header) { //create THEADER & header row 
        var table = document.getElementsByTagName("TABLE");
        var head = document.createElement("THEAD");
        for (var i = 1; i < 5; i++){
            var cell = document.createElement("TH");
            cell.innerHTML = "Header " + i;
            cell.style.border = "3px solid";
            head.appendChild(cell);
        }
        table[0].appendChild(head);
        console.log("THEAD created");
        //finally, create TBODY
        var body = document.createElement("TBODY");
        table[0].appendChild(body);
        console.log("TBODY created");
    }
    else { then; }
}

var newTableRow = function(node, length, index) {
    var row = node.insertRow(-1);
    for (var i = 0; i < length; i++){
        var cell = row.insertCell(i);
        cell.style.border = "thin solid";
        //enter cell content here
        cell.innerHTML = (i+1) + ", "   + index;
    }
}

var nothing = function(){
    return true;
}


function createRow(parent, columns, header, index){
    // parent is the table node (thead or tbody)
    // columns is the number of cells to add
    // header is a boolean indicating if the cell should be a header or not
    if (!header) { console.log("Creating table rows now!"); }
    var row = parent.insertRow(-1);
    //now fill new row with cells
    for (var i = 1; i < columns + 1; i++){
        var cell;
        if (header) { 
            cell = document.createElement("TH"); 
            cell.style.border = "3px solid blue";
            cell.innerHTML = "Header " + i;
        }
        else { 
            //console.log("Creating table row "+ i);
            cell = document.createElement("TD");
            cell.style.border = "thin solid";
            cell.innerHTML = i + ", " + index;
        }
        row.appendChild(cell);
        console.log("created row i: " + i );
    }
}


var table = document.createElement("TABLE");
table.border = "2";
document.body.appendChild(table);
console.log("Table created");
createPartOfTable(true, nothing);
createPartOfTable(false, newTableRow(table, 4, 1));
createPartOfTable(false, newTableRow(table, 4, 2));
createPartOfTable(false, newTableRow(table, 4, 3));
createPartOfTable(false, newTableRow(table, 4, 4));
console.log("DEBUG");
var tableBody = table.children[1];
var currentRow = tableBody.children[0];
var currentCol = 0

var currentCell = currentRow.children[currentCol];
currentCell.style.border = "medium solid";

/*WORKING; KEEP IT! :D 
This code also creates a table using different methods.  While
this table is functional, it is NOT wired up with the buttons,
etc. If uncommented, a second table will appear, but will not
be interactive.
var table1 = document.createElement("TABLE");
document.body.appendChild(table1);
table1.border = "2 solid";//so I can see it
console.log("Created table1");
createRow(table1, 4, true, 0);
createRow(table1, 4, false, 1);
createRow(table1, 4, false, 2);
createRow(table1, 4, false, 3);
createRow(table1, 4, false, 4);
*/

//Button Event Functions
function moveUp(event){
    if(currentRow.previousElementSibling != (null || undefined)){
        currentRow = currentRow.previousElementSibling;
        currentCell.style.border = "thin solid";
    }
    currentCell = currentRow.children[currentCol];
    currentCell.style.border = "medium solid";
}

function moveDown(event){
    if(currentRow.nextElementSibling != (null || undefined)){
        currentCell.style.border = "thin solid";
        console.log("in moveDown: updated currentCell to no bold");
        currentRow = currentRow.nextElementSibling;
    }
    currentCell = currentRow.children[currentCol];
    currentCell.style.border = "medium solid";
}

function moveLeft(event){
    if(currentCell.previousElementSibling != (null || undefined)){
        currentCol--;
        currentCell.style.border = "thin solid";
    }
    currentCell = currentRow.children[currentCol];
    currentCell.style.border = "medium solid";
}

function moveRight(event){
    if(currentCell.nextElementSibling != (null || undefined)){
        currentCell.style.border = "thin solid";
        currentCol++;
        console.log("in moveRight: currentCol increased to " + currentCol);
    }
    currentCell = currentRow.children[currentCol];
    currentCell.style.border = "medium solid";
}

function markCell(event) {
    currentCell.style.backgroundColor = "yellow";
}

//BUTTON TIME!!!!
var upButton = document.createElement("BUTTON");
upButton.innerHTML = "Move up";
document.body.appendChild(upButton);
upButton.addEventListener("click", moveUp);

var downButton = document.createElement("BUTTON");
downButton.innerHTML = "Move down";
document.body.appendChild(downButton);
downButton.addEventListener("click", moveDown);

var leftButton = document.createElement("BUTTON");
leftButton.innerHTML = "Move left";
document.body.appendChild(leftButton);
leftButton.addEventListener("click", moveLeft);

var rightButton = document.createElement("BUTTON");
rightButton.innerHTML = "Move right";
document.body.appendChild(rightButton);
rightButton.addEventListener("click", moveRight);

var markIt = document.createElement("BUTTON");
markIt.innerHTML = "Mark cell";
document.body.appendChild(markIt);
markIt.addEventListener("click", markCell);
