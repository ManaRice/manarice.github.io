
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

    moveUp(index) {
        //console.log("Move up");
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
        //console.log("Move Down");
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
        //console.log("Move Right");
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
        //console.log("Move Left");
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
}

let board = new Board();

for (let i = 0; i < 300;) {
    let index = Math.floor(Math.random() * board.width * board.height - 1)
    if (board.move(index)) {
        //console.log(index);
        i++
    }
}


board.print()
