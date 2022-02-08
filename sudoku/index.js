class Cell {
    constructor(val) {
        this.val = val;
        if (val == 0) this.gen = false;
        else this.gen = true;
    }
}



var board = [
    new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0),
    new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0),
    new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0),
    new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0),
    new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0),
    new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0),
    new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0),
    new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0),
    new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0),
]

/*

var board = [
    new Cell(3),new Cell(0),new Cell(6),new Cell(5),new Cell(0),new Cell(8),new Cell(4),new Cell(0),new Cell(0),
    new Cell(5),new Cell(2),new Cell(0),new Cell(0),new Cell(0),new Cell(0),new Cell(0),new Cell(0),new Cell(0),
    new Cell(0),new Cell(8),new Cell(7),new Cell(0),new Cell(0),new Cell(0),new Cell(0),new Cell(3),new Cell(1),
    new Cell(0),new Cell(0),new Cell(3),new Cell(0),new Cell(1),new Cell(0),new Cell(0),new Cell(8),new Cell(0),
    new Cell(9),new Cell(0),new Cell(0),new Cell(8),new Cell(6),new Cell(3),new Cell(0),new Cell(0),new Cell(5),
    new Cell(0),new Cell(5),new Cell(0),new Cell(0),new Cell(9),new Cell(0),new Cell(6),new Cell(0),new Cell(0),
    new Cell(1),new Cell(3),new Cell(0),new Cell(0),new Cell(0),new Cell(0),new Cell(2),new Cell(5),new Cell(0),
    new Cell(0),new Cell(0),new Cell(0),new Cell(0),new Cell(0),new Cell(0),new Cell(0),new Cell(7),new Cell(4),
    new Cell(0),new Cell(0),new Cell(5),new Cell(2),new Cell(0),new Cell(6),new Cell(0),new Cell(0),new Cell(0),
];
var board = [
    new Cell(0), new Cell(0), new Cell(0), new Cell(5), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(4),
    new Cell(0), new Cell(0), new Cell(1), new Cell(0), new Cell(0), new Cell(8), new Cell(0), new Cell(0), new Cell(7),
    new Cell(0), new Cell(7), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(8), new Cell(0),
    new Cell(0), new Cell(0), new Cell(6), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0),
    new Cell(0), new Cell(0), new Cell(0), new Cell(4), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0),
    new Cell(0), new Cell(2), new Cell(0), new Cell(0), new Cell(9), new Cell(0), new Cell(0), new Cell(0), new Cell(0),
    new Cell(0), new Cell(5), new Cell(9), new Cell(0), new Cell(7), new Cell(0), new Cell(6), new Cell(0), new Cell(0),
    new Cell(0), new Cell(6), new Cell(0), new Cell(8), new Cell(0), new Cell(0), new Cell(0), new Cell(0), new Cell(0),
    new Cell(8), new Cell(1), new Cell(0), new Cell(6), new Cell(5), new Cell(0), new Cell(0), new Cell(0), new Cell(9),
]
*/

// Stolen from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArr(array){
    for (var i = array.length - 1; i > 0; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        [array[i], array[rand]] = [array[rand], array[i]]
    }
}

function uniqueArray(arr) {
    var temp = [];
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < temp.length; j++) {
            if (arr[i] == 0 || temp[i] == 0)
                continue;
            if (arr[i] == temp[j])
                return false;
        }
        temp.push(arr[i]);
    }
    return true;
}

function boardContainsZero(board) {
    for (var i = 0; i < board.length; i++)
        if (board[i].val == 0)
            return true;
    return false;

}

function getCol(index, board) {
    var col = [];
    var coli = index % 9;
    for (var i = coli; i < board.length; i += 9) {
        col.push(board[i].val);
    }
    return col;
}

function getRow(index, board) {
    var row = [];
    var rowi = index - index % 9;
    for (var i = rowi; i < rowi + 9; i++) {
        row.push(board[i].val);
    }
    return row;
}

function getSqr(index, board) {
    var sqr = [];
    var sqri = ((index % 9) - (index % 3)) + Math.floor(Math.floor(index / 9) / 3) * 9 * 3;
    for (var i = 0; i < 9; i++){
        sqr.push(board[sqri + (i % 3) + ( Math.floor(i / 3) * 9)].val)
    }
    return sqr;
}

function checkBoard(board) {
    if (boardContainsZero(board))
        return false;

    for (var i = 0; i < 9; i++) {
        var row = [];
        var col = [];
        var sqr = [];
        for (var j = 0; j < 9; j++) {
            var rowi = j + i * 9;
            var coli = i + j * 9;
            var sqri = ((j % 3) + ((i % 3) * 3)) + (Math.floor(j / 3) + (Math.floor(i / 3) * 3)) * 9;
            row.push(board[rowi].val);
            col.push(board[coli].val);
            sqr.push(board[sqri].val);
        }
        if (!uniqueArray(row) || !uniqueArray(col) || !uniqueArray(sqr))
            return false;
    }

    return true;
}

function solveBoard(board, counter) {
    for (var i = 0; i < board.length; i++) {
        if (board[i].val == 0) {
            for (var j = 1; j < 10; j++) {
                board[i] = new Cell(j);
                var row = getRow(i, board);
                var col = getCol(i, board);
                var sqr = getSqr(i, board);

                if (uniqueArray(row) && uniqueArray(col) && uniqueArray(sqr)) {
                    if (checkBoard(board)){
                        counter++;
                        break;
                    }
                    else{
                        counter = solveBoard(board, counter);
                        if (counter > 1)
                            return counter;
                    }
                }
                board[i] = new Cell(0);
            }
            break;
        }
    }
    return counter;
}

var numberList = [1,2,3,4,5,6,7,8,9];

function generateFullBoard(board) {
    var i;
    for (i = 0; i < board.length; i++) {
        if (board[i].val == 0) {
            shuffleArr(numberList);

            for (var j = 0; j < numberList.length; j++) {
                board[i] = new Cell(numberList[j]);
                var row = getRow(i, board);
                var col = getCol(i, board);
                var sqr = getSqr(i, board);

                if (uniqueArray(row) && uniqueArray(col) && uniqueArray(sqr)){
                    if (checkBoard(board))
                        return true;
                    else
                        if (generateFullBoard(board))
                            return true;
                }
                board[i] = new Cell(0);
            }
            break;
        }
    }
    return false;
}

function newBoard() {
    generateFullBoard(board);

    var attempts = 5;

    var index;
    var cellVal;
    var copy;
    for (var i = 0; i < attempts; i++) {
        do {
            do {
                index = Math.floor(Math.random() * 80);
            } while(board[index].val == 0);

            cellVal = board[index].val;
            board[index] = new Cell(0);
            copy = Object.assign([], board);
        } while(solveBoard(copy, 0) <= 1);

        board[index].val = cellVal;
        board[index].gen = true;
    }
}


newBoard();
updateBoard();

function updateBoard(){
    for (var i = 0; i < board.length; i++) {
        let cell = board[i];
        let div = document.getElementById(i.toString());
        if (!div) {
            console.log("Div not found " + i);
            console.log(board.length);
        }
        if (cell.val > 0) div.innerHTML = cell.val.toString();
        else div.innerHTML = "&nbsp&nbsp";
        if (cell.gen && !div.classList.contains("generated")) div.classList.add("generated");
    }
    if (checkBoard(board)) alert("You won");
}

function disableSel() {
    let div = document.getElementById("sel");
    if (div.classList.contains("reveal")){
        div.classList.remove("reveal");
    }
}

function selectNumber(id) {
    if (board[id].gen) return;
    let sel = document.getElementById("sel");
    let cell = document.getElementById(id);
    if (!sel.classList.contains("active")){
        sel.classList.add("active");
    }
    for (var i = 0; i < board.length; i++) {
        document.getElementById(i.toString()).classList.remove("selected");
    }
    document.getElementById(id.toString()).classList.add("selected");
    document.getElementById("index-holder").innerHTML = id.toString();
}


function changeNumber(number, id) {
    let div = document.getElementById("sel");
    if (!div.classList.contains("active")) return;
    if (number.includes("Clear")) number = 0;
    board[id].val = parseInt(number);
    document.getElementById("index-holder").innerHTML = id.toString();
    document.getElementById(id.toString()).classList.remove("selected");
    div.classList.remove("active");
    updateBoard()
}
