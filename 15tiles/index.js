
class Board {
    constructor(){
        this.width = 4;
        this.height = 4;
        this.cells = [
            1,   2,   3,   4,
            5,   6,   7,   8,
            9,  10,  11,  12,
            13, 14,  15,   0
        ]

    }

    getZeroIndex() {
        for (let i = 0; i < this.cells.length; i++) {
            if (this.cells[i] == 0) return i;
        }
        throw new Error("Board contains no zero!");
    }

    arrContainsZero(arr) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == 0) return true;
        }
        return false;
    }

    indexOf(n) {
        return this.cells.indexOf(parseInt(n));
    }

    moveUp(index) {
        let val = this.cells[index];
        this.cells[index] = 0;
        for (let i = index - this.width; i >= 0; i -= this.width) {
            //console.log(i)
            let temp = this.cells[i];
            this.cells[i] = val;
            if (temp == 0) break;
            val = temp;
        }
        return true;
    }

    moveDown(index) {
        let val = this.cells[index];
        this.cells[index] = 0;
        for (let i = index + this.width; i < this.width * this.height; i += this.width) {
            let temp = this.cells[i];
            this.cells[i] = val;
            if (temp == 0) break;
            val = temp;
        }
        return true;
    }

    moveRight(index) {
        let val = this.cells[index];
        this.cells[index] = 0;
        for (let i = index + 1; i % this.width != index % this.width; i++) {
            let temp = this.cells[i];
            this.cells[i] = val;
            if (temp == 0) break;
            val = temp;
        }
        return true;
    }

    moveLeft(index) {
        let val = this.cells[index];
        this.cells[index] = 0;
        for (let i = index - 1; i % this.width != index % this.width; i--) {
            let temp = this.cells[i];
            this.cells[i] = val;
            if (temp == 0) break;
            val = temp;
        }
        return true;
    }

    move(index) {
        let zeroIndex = this.getZeroIndex();

        if (zeroIndex == index) return;

        if ((index % this.width) == (zeroIndex % this.width)) {
            // Column
            if (index < zeroIndex) return this.moveDown(index);
            return this.moveUp(index);
        }

        if (Math.floor(index / this.width) ==
            (Math.floor(zeroIndex / this.width))) {
            // Row
            if (index < zeroIndex) return this.moveRight(index);
            return this.moveLeft(index);
        }
        return false;
    }

    print() {
        for (let i = 0; i < this.height; i++) {
            let row = "";
            for (let j = 0; j < this.width; j++) {
                row += this.cells[j + i * this.width].toString();
                row += "  "
            }
            console.log(row);
        }
    }

    check() {
        let solved = [
            1,   2,   3,   4,
            5,   6,   7,   8,
            9,  10,  11,  12,
            13, 14,  15,   0
        ]

        for (let i = 0; i < solved.length; i++){
            if (this.cells[i] != solved[i]) return false;
        }
        return true;
    }

    scramble() {
        for (let i = 0; i < 300;) {
            let index = Math.floor(Math.random() * this.width * this.height)
            if (this.move(index)) i++;
        }
    }
}



// Updates the visual board, and checks if it is solved
function updateBoard(){
    for (let i = 0; i < board.cells.length; i++) {
        let x = i % board.width;
        let y = Math.floor(i / board.width);
        let translate = "translate(" + (x * 100) + "%, " + (y * 100) + "%)"
        document.getElementById(board.cells[i]).style.transform = translate;
    }

    if (board.check()) {
        window.clearInterval(timer);
        alert("You won in " + (Math.round(timer_time * 10) / 10).toString() + " seconds");
        restart();
    }
}

function updateTime() {
    timer_time += 0.1;
}

function userClick(id) {
    if (board.move(board.indexOf(id))){
        if (!timer_running) {
            timer_running = true;
            timer = window.setInterval(updateTime, 100);
        }
        updateBoard();
    }
}

function restart(){
    timer_time = 0.0;
    if (timer_running) {
        window.clearInterval(timer);
        timer_running = false;
    }
    board.scramble();
    updateBoard();
}

let board = new Board();
let timer;
let timer_time;
let timer_running;
restart();
