/*
Adina Edwards
8th February 2016
CS290
*/
// to get practice, rewrite createRow or wrapper as a higher-order function
function createPartOfTable(header, then) {
    if (header) { //create THEADER & header row 
        var table = document.getElementsByTagName("TABLE");
        var head = document.createElement("THEAD");
        for (var i = 1; i < 5; i++){
            var cell = document.createElement("TH");
            cell.innerHTML = "Header " + i;
            head.appendChild(cell);
        }
        head.style.borderColor = "red";
        //head.innerHTML = "higher-order table";
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
        cell.innerHTML = "cell " + (i+1) + ", ";
    }
}

var nothing = function(){
    return true;
}


function createRow(parent, columns, header){
    // parent is the table node (thead or tbody)
    // columns is the number of cells to add
    // header is a boolean indicating if the cell should be a header or not
    if (!header) { console.log("Creating table rows now!"); }
    function rowNumber(){ //closure on purpose!
        var j = 0;
        return ++j;
    }
    var row = parent.insertRow(-1);
    //now fill new row with cells
    for (var i = 1; i < columns + 1; i++){
        var cell;
        if (header) { 
            cell = document.createElement("TH"); 
            cell.innerHTML = "Header " + i;
        }
        else { 
            console.log("Creating table row "+ i);
            cell = document.createElement("TD");
            cell.innerHTML = "cell " + i + ", " + rowNumber();
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
createPartOfTable(false, newTableRow(table, 4));
createPartOfTable(false, newTableRow(table, 4));
createPartOfTable(false, newTableRow(table, 4));
console.log("DEBUG");
var tableBody = table.children[1];
var maxRow = tableBody.children.length - 1;
var currentRow = tableBody.children[0];
var currentCol = 0;

var currentCell = currentRow.children[currentCol];
currentCell.style.borderColor = "red";
currentCell.border = "3";

/*WORKING; KEEP IT! :D
var table1 = document.createElement("TABLE");
document.body.appendChild(table1);
table1.border = "2";//so I can see it
console.log("Created table1");
createRow(table1, 4, true);
createRow(table1, 4, false);
createRow(table1, 4, false);
createRow(table1, 4, false);
createRow(table1, 4, false);*/


//Button Event Functions
function moveUp(event){
    if(currentRow != tableBody.children[0])
        currentRow = currentRow.previousElementSibling;
    currentCell = currentRow.children[currentCol];
}

function moveDown(event){
    if(currentRow != table.children[maxRow])
        currentRow = currentRow.nextElementSibling;
    currentCell = currentRow.children[currentCol];
}

function moveLeft(event){
    if(currentCol < 5)
        currentCol++;
    currentCell = currentRow.children[currentCol];
}

function moveRight(event){
    if(currentCol > 0)
        currentCol--;
    currentCell = currentRow.children[currentCol];
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
