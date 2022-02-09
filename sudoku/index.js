class Cell {
    constructor(val) {
        this.val = val;
        if (val == 0) this.gen = false;
        else this.gen = true;
    }
}

const EAZY   = 1;
const MEDIUM = 5;
const HARD   = 10;

class Board {
    constructor(difficulty) {
        this.numberList = [1,2,3,4,5,6,7,8,9];
        this.width = 9;
        this.height = 9;
        this.cells = [];
        this.difficulty = difficulty;
    }

    clone() {
        var copy = new Board(this.difficulty);
        copy.numberList = [...this.numberList];
        copy.cells = [...this.cells];
        return copy;
    }

    zeroCells() {
        for (var i = 0; i < this.width * this.height; i++) {
            this.cells.push(new Cell(0));
        }
    }

    cell(index) {
        return this.cells[index];
    }

    cellVal(index) {
        return this.cells[index].val;
    }

    isCellGenerated(index) {
        return this.cells[index].gen
    }

    // Stolen from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    shuffleNumberlist(){
        for (var i = this.numberList.length - 1; i > 0; i--) {
            var rand = Math.floor(Math.random() * (i + 1));
            [this.numberList[i], this.numberList[rand]] = [this.numberList[rand], this.numberList[i]]
        }
    }

    uniqueArray(arr) {
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

    boardContainsZero() {
        for (var i = 0; i < this.cells.length; i++)
            if (this.cells[i].val == 0)
                return true;
        return false;

    }

    getCol(index) {
        var col = [];
        var coli = index % 9;
        for (var i = coli; i < this.cells.length; i += 9) {
            col.push(this.cells[i].val);
        }
        return col;
    }

    getRow(index) {
        var row = [];
        var rowi = index - index % 9;
        for (var i = rowi; i < rowi + 9; i++) {
            row.push(this.cells[i].val);
        }
        return row;
    }

    getSqr(index) {
        var sqr = [];
        var sqri = ((index % 9) - (index % 3)) + Math.floor(Math.floor(index / 9) / 3) * 9 * 3;
        for (var i = 0; i < 9; i++){
            sqr.push(this.cells[sqri + (i % 3) + ( Math.floor(i / 3) * 9)].val)
        }
        return sqr;
    }

    check() {
        if (this.boardContainsZero())
            return false;

        for (var i = 0; i < 9; i++) {
            var row = [];
            var col = [];
            var sqr = [];
            for (var j = 0; j < 9; j++) {
                var rowi = j + i * 9;
                var coli = i + j * 9;
                var sqri = ((j % 3) + ((i % 3) * 3)) + (Math.floor(j / 3) + (Math.floor(i / 3) * 3)) * 9;
                row.push(this.cells[rowi].val);
                col.push(this.cells[coli].val);
                sqr.push(this.cells[sqri].val);
            }
            if (!this.uniqueArray(row) || !this.uniqueArray(col) || !this.uniqueArray(sqr))
                return false;
        }

        return true;
    }

    solve(counter) {
        for (var i = 0; i < this.cells.length; i++) {
            if (this.cells[i].val == 0) {
                for (var j = 1; j < 10; j++) {
                    this.cells[i] = new Cell(j);
                    var row = this.getRow(i);
                    var col = this.getCol(i);
                    var sqr = this.getSqr(i);

                    if (this.uniqueArray(row) && this.uniqueArray(col) && this.uniqueArray(sqr)) {
                        if (this.check()) {
                            counter++;
                            break;
                        }
                        counter = this.solve(counter);
                        if (counter > 1)
                            return counter;
                    }
                    this.cells[i] = new Cell(0);
                }
                break;
            }
        }
        this.cells[i] = new Cell(0);
        return counter;
    }


    generateFullBoard() {
        var i;
        for (i = 0; i < this.cells.length; i++) {
            if (this.cells[i].val == 0) {
                this.shuffleNumberlist();

                for (var j = 0; j < this.numberList.length; j++) {
                    this.cells[i] = new Cell(this.numberList[j]);
                    var row = this.getRow(i);
                    var col = this.getCol(i);
                    var sqr = this.getSqr(i);

                    if (this.uniqueArray(row) && this.uniqueArray(col) && this.uniqueArray(sqr)){
                        if (this.check())
                            return true;
                        else
                            if (this.generateFullBoard())
                                return true;
                    }
                    this.cells[i] = new Cell(0);
                }
                break;
            }
        }
        return false;
    }

    isValid() {
        var copy = this.clone();
        return copy.solve(0) < 2;
    }

    generateNewBoard() {
        this.zeroCells();
        this.generateFullBoard();
        var index;
        var cellVal;
        var copy;
        for (var i = 0; i < this.difficulty; i++) {
            do {
                do {
                    index = Math.floor(Math.random() * 80);
                } while(this.cells[index].val == 0);

                cellVal = this.cells[index].val;
                this.cells[index] = new Cell(0);
            } while(this.isValid());

            this.cells[index] = new Cell(cellVal);
        }
    }
}



var board = new Board(HARD);
board.generateNewBoard();
updateBoard();

function updateBoard(){
    for (var i = 0; i < board.cells.length; i++) {
        let cell = board.cell(i);
        let div = document.getElementById(i.toString());
        if (!div) {
            console.log("Div not found " + i);
            console.log(board.length);
        }
        if (cell.val > 0) div.innerHTML = cell.val.toString();
        else div.innerHTML = "&nbsp&nbsp";
        if (cell.gen && !div.classList.contains("generated")) div.classList.add("generated");
    }
    if (board.check()) alert("You won");
}

function disableSel() {
    let div = document.getElementById("sel");
    if (div.classList.contains("reveal")){
        div.classList.remove("reveal");
    }
}

function selectNumber(id) {
    if (board.isCellGenerated()) return;
    let sel = document.getElementById("sel");
    let cell = document.getElementById(id);
    if (!sel.classList.contains("active")){
        sel.classList.add("active");
    }
    for (var i = 0; i < board.cells.length; i++) {
        document.getElementById(i.toString()).classList.remove("selected");
    }
    document.getElementById(id.toString()).classList.add("selected");
    document.getElementById("index-holder").innerHTML = id.toString();
}


function changeNumber(number, id) {
    let div = document.getElementById("sel");
    if (!div.classList.contains("active")) return;
    if (number.includes("Clear")) number = 0;
    board.cells[id].val = parseInt(number);
    document.getElementById("index-holder").innerHTML = id.toString();
    document.getElementById(id.toString()).classList.remove("selected");
    div.classList.remove("active");
    updateBoard()
}
