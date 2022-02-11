/*
 *  Sudoku game made by ManaRice (Douglas Modin Lindström)
 *  on manarice.github.io.
 *
 *  This is my first attempt at creating a sudoku game
 *  The functionality of the board may be moved to a language
 *  that can generate WASM in the future.
 *
 */





/*
 *  A cell contains of a number and the information
 *  if it was generated or if the user has the ability
 *  to change the number in the cell
 *
 */

class Cell {
    constructor(val) {
        this.val = val;
        if (val == 0) this.gen = false;
        else this.gen = true;
    }
}

/*
 *  The difficulty indicates how many iterations the generation
 *  step will fail in removing a new number from a fully
 *  solved board.
 *
 *  HARD   = 10 failed attempts
 *  MEDIUM = 5  failed attempts
 *  EAZY   = 1  failed attempt
 *
 *  The difficultys are not final in any way and may change
 *  at any time in development
 *
 */

const EAZY   = 1;
const MEDIUM = 5;
const HARD   = 10;


/*
 *  A board is a collection of 9 x 9 cells
 *  that can generate a valid sudoku board.
 *
 *  To generate a board you need to instanciate a
 *  board with a difficulty and call board.generateNewBoard().
 *  This process will go through all the steps to make a valid
 *  sudoku board.
 *
 */

class Board {
    constructor(difficulty) {
        this.numberList = [1,2,3,4,5,6,7,8,9];
        this.width = 9;
        this.height = 9;
        this.cells = [];
        this.difficulty = difficulty;
    }

    // Used to run the solve() method.
    // This method may leave some solved cells in the board.
    clone() {
        let copy = new Board(this.difficulty);
        copy.numberList = [...this.numberList];
        copy.cells = [...this.cells];
        return copy;
    }

    // Inatiate the board with zeros.
    zeroCells() {
        for (let i = 0; i < this.width * this.height; i++) {
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

    // Used to generate random boards
    // Stolen from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    shuffleNumberlist(){
        for (let i = this.numberList.length - 1; i > 0; i--) {
            let rand = Math.floor(Math.random() * (i + 1));
            [this.numberList[i], this.numberList[rand]] = [this.numberList[rand], this.numberList[i]]
        }
    }

    // Check if an array contains only unique elements
    // Exept for multiple zeros.
    // Used for checking if row, column or square is valid
    uniqueArray(arr) {
        let temp = [];
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < temp.length; j++) {
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
        for (let i = 0; i < this.cells.length; i++)
            if (this.cells[i].val == 0)
                return true;
        return false;

    }

    // Returns an array containing the column the cell of "index"
    // belongs to
    getCol(index) {
        let col = [];
        let coli = index % 9;
        for (let i = coli; i < this.cells.length; i += 9) {
            col.push(this.cells[i].val);
        }
        return col;
    }
    // Returns an array containing the row the cell of "index"
    // belongs to
    getRow(index) {
        let row = [];
        let rowi = index - index % 9;
        for (let i = rowi; i < rowi + 9; i++) {
            row.push(this.cells[i].val);
        }
        return row;
    }

    // Returns an array containing the square the cell of "index"
    // belongs to
    getSqr(index) {
        let sqr = [];
        let sqri = ((index % 9) - (index % 3)) + Math.floor(Math.floor(index / 9) / 3) * 9 * 3;
        for (let i = 0; i < 9; i++){
            sqr.push(this.cells[sqri + (i % 3) + ( Math.floor(i / 3) * 9)].val)
        }
        return sqr;
    }

    // Check if the board is solved
    check() {
        if (this.boardContainsZero())
            return false;

        for (let i = 0; i < 9; i++) {
            let row = [];
            let col = [];
            let sqr = [];
            for (let j = 0; j < 9; j++) {
                let rowi = j + i * 9;
                let coli = i + j * 9;
                let sqri = ((j % 3) + ((i % 3) * 3)) + (Math.floor(j / 3) + (Math.floor(i / 3) * 3)) * 9;
                row.push(this.cells[rowi].val);
                col.push(this.cells[coli].val);
                sqr.push(this.cells[sqri].val);
            }
            if (!this.uniqueArray(row) || !this.uniqueArray(col) || !this.uniqueArray(sqr))
                return false;
        }

        return true;
    }

    // Returns the number of solutions this board has at current state.
    // Will return max 2, because if the number of solutions are greater
    // than 1 it is not a valid sudoku board so it is irelevant calculations
    solve(counter) {
        let i;
        for (i = 0; i < this.cells.length; i++) {
            if (this.cells[i].val == 0) {
                for (let j = 1; j < 10; j++) {
                    this.cells[i] = new Cell(j);
                    let row = this.getRow(i);
                    let col = this.getCol(i);
                    let sqr = this.getSqr(i);

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

    // Generates a fully solved valid sudoku board
    generateFullBoard() {
        let i;
        for (i = 0; i < this.cells.length; i++) {
            if (this.cells[i].val == 0) {
                this.shuffleNumberlist();

                for (let j = 0; j < this.numberList.length; j++) {
                    this.cells[i] = new Cell(this.numberList[j]);
                    let row = this.getRow(i);
                    let col = this.getCol(i);
                    let sqr = this.getSqr(i);

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

    // Returns if the current board is valid e.i has exactly 1 solution
    isValid() {
        let copy = this.clone();
        return copy.solve(0) < 2;
    }

    // Generates a new solvable and valid sudoku board at this.difficulty
    generateNewBoard() {
        this.zeroCells();
        this.generateFullBoard();
        let index;
        let cellVal;
        let copy;
        for (let i = 0; i < this.difficulty; i++) {
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

/*
 *  This is the entry point of the script when it loads
 *  We first create a new board and generate the cells
 *  into a valid sudoku board.
 *  The difficulty indicates how many iterations the generation
 *  step will fail in removing a new number from a fully
 *  solved board.
 *
 *  HARD   = 10 failed attempts
 *  MEDIUM = 5  failed attempts
 *  EAZY   = 1  failed attempt
 *
 *  The difficultys are not final in any way and may change
 *  at any time in development
 *
 */

let board = new Board(HARD);
board.generateNewBoard();
updateBoard();

// Updates the visual board, and checks if it is solved
function updateBoard(){
    for (let i = 0; i < board.cells.length; i++) {
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

// Called when user is clicking a cell
function selectNumber(id) {
    if (board.isCellGenerated(id)) return;
    let sel = document.getElementById("sel");
    let cell = document.getElementById(id);
    if (!sel.classList.contains("active")){
        sel.classList.add("active");
    }
    for (let i = 0; i < board.cells.length; i++) {
        document.getElementById(i.toString()).classList.remove("selected");
    }
    document.getElementById(id.toString()).classList.add("selected");
    document.getElementById("index-holder").innerHTML = id.toString();
}

// Called when user clicks a number in the selector panel
function changeNumber(number) {
    let div = document.getElementById("sel");
    if (!div.classList.contains("active")) return;

    let index_holder =  document.getElementById('index-holder');
    let index = index_holder.innerHTML;

    board.cells[index].val = number;
    index_holder.innerHTML = index.toString();
    document.getElementById(index.toString()).classList.remove("selected");
    div.classList.remove("active");
    updateBoard()
}
