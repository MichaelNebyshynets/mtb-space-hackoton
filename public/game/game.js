export class Match3Game {
    constructor(rows, cols, colors, startMoves, abilitiesCols) {
        this.rows = rows;
        this.cols = cols;
        this.colors = colors;
        this.startMoves = startMoves;
        this.abilitiesCols = abilitiesCols;
        
        this.board = [];
        this.types = [];
        this.score = 0;
        this.movesUsed = 0;
        
        for (let r = 0; r < rows; r++) {
            const row = [];
            const trow = [];
            for (let c = 0; c < cols; c++) {
                row.push(colors[Math.floor(Math.random() * colors.length)]);
                trow.push(0);
            }
            this.board.push(row);
            this.types.push(trow);
        }

        while(this.checkMatches()) {
            this.gravitate();
            this.fill();
        }

        this.score = 0;
    }

    possibleMoves() {
        return this.startMoves + Math.floor(this.score / 15);
    }

    isLosed() {
        return this.movesUsed >= this.possibleMoves();
    }

    makeMove(r1, c1, r2, c2) {
        if(this.movesUsed >= this.possibleMoves()) return false;
        if(0 > r1 || r1 >= this.rows || 0 > r2 || r2 >= this.rows) return false;
        if(0 > c1 || c1 >= this.cols || 0 > c2 || c2 >= this.cols) return false;
        if(this.board[r1][c1] == this.board[r2][c2]) return false;
        if(Math.abs(r1 - r2) + Math.abs(c1 - c2) > 1) return false;
        
        [this.board[r1][c1], this.board[r2][c2]] = [this.board[r2][c2], this.board[r1][c1]];
        [this.types[r1][c1], this.types[r2][c2]] = [this.types[r2][c2], this.types[r1][c1]];
        
        this.movesUsed++;

        // while(this.checkMatches()) {
        //     this.gravitate();
        //     this.fill();
        // }
        return true;
    }

    pop(r, c) {
        if(r < 0 || r >= this.rows || c < 0 || c >= this.cols) return;
        
        if(this.types[r][c] == 0) {
            this.score++;
            this.types[r][c] = 0;
            this.board[r][c] = ' ';
            return;
        }
        if(this.types[r][c] == 1) {
            this.types[r][c] = 0;
            this.board[r][c] = ' ';
            for(let cc = 0; cc < this.cols; cc++) {
                this.pop(r, cc);
            }
            return;
        }
        if(this.types[r][c] == 2) {
            this.types[r][c] = 0;
            this.board[r][c] = ' ';
            for(let cr = 0; cr < this.rows; cr++) {
                this.pop(cr, c);
            }
            return;
        }
        if(this.types[r][c] == 3) {
            this.types[r][c] = 0;
            this.board[r][c] = ' ';
            for(let cr = 0; cr < this.rows; cr++) {
                this.pop(cr, c);
            }
            for(let cc = 0; cc < this.cols; cc++) {
                this.pop(r, cc);
            }
            return;
        }
        if(this.types[r][c] == 4) {
            const targetColor = this.board[r][c];
            this.types[r][c] = 0;
            this.board[r][c] = ' ';
            for(let cr = 0; cr < this.rows; cr++) {
                for(let cc = 0; cc < this.cols; cc++) {
                    if(this.board[cr][cc] == targetColor) {
                        this.pop(cr, cc);
                    }
                }
            }
            return;
        }
    }

    checkMatches() {
        let flag = false;
        let inMatche = [];
        let len = [], high = [];
        let que = [];

        for(let i = 0; i < this.rows; i++) {
            let row1 = [];
            let row2 = [];
            let row3 = [];
            for(let j = 0; j < this.cols; j++) {
                row1.push(false);
                row2.push(0);
                row3.push(0);
            }
            inMatche.push(row1);
            len.push(row2);
            high.push(row3);
        }

        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                if(j > 0) {
                    if(this.board[i][j] == this.board[i][j - 1]){
                        len[i][j] = len[i][j - 1];
                    }
                }
                if(len[i][j] == 0){
                    for(let r = j; r < this.cols; r++){
                        if(this.board[i][j] == this.board[i][r]){
                            len[i][j]++;
                        } else {
                            break;
                        }
                    }
                }
            }
        }
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                if(i > 0) {
                    if(this.board[i][j] == this.board[i - 1][j]){
                        high[i][j] = high[i - 1][j];
                    }
                }
                if(high[i][j] == 0){
                    for(let r = i; r < this.rows; r++){
                        if(this.board[i][j] == this.board[r][j]){
                            high[i][j]++;
                        } else {
                            break;
                        }
                    }
                }
            }
        }

        // проверка крест
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                if((len[i][j] >= 4 && high[i][j] >= 3) || (len[i][j] >= 3 && high[i][j] >= 4)){
                    que.push([i, j, 3, this.board[i][j]]);
                    for(let a = i - 1; a >= 0; a--){
                        if(this.board[i][j] == this.board[a][j]) {
                            high[a][j] = 0;
                            inMatche[a][j] = true;
                        }else{
                            break;
                        }
                    }
                    for(let a = i; a < this.rows; a++){
                        if(this.board[i][j] == this.board[a][j]) {
                            high[a][j] = 0;
                            inMatche[a][j] = true;
                        }else{
                            break;
                        }
                    }                    
                    for(let a = j - 1; a >= 0; a--){
                        if(this.board[i][j] == this.board[i][a]) {
                            len[i][a] = 0;
                            inMatche[i][a] = true;
                        }else{
                            break;
                        }
                    }
                    for(let a = j; a < this.cols; a++){
                        if(this.board[i][j] == this.board[i][a]) {
                            len[i][a] = 0;
                            inMatche[i][a] = true;
                        }else{
                            break;
                        }
                    }
                    flag = true;
                }
            }
        }
        // проверка 5 в ряд
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                if(len[i][j] >= 5){
                    for(let k = Math.min(len[i][j] - 1, this.cols - j - 1); k >= 0; k--){
                        inMatche[i][j + k] = true;
                        len[i][j + k] = 0;
                    }
                    que.push([i, j + 2, 4, this.board[i][j]]);
                    flag = true;
                } else if(high[i][j] >= 5){
                    for(let k = Math.min(high[i][j] - 1, this.rows - i - 1); k >= 0; k--){
                        inMatche[i + k][j] = true;
                        high[i + k][j] = 0;
                    }
                    que.push([i + 2, j, 4, this.board[i][j]]);
                    flag = true;
                }
            }
        }
        // проверка 4 в ряд
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                if(len[i][j] >= 4){
                    for(let k = Math.min(len[i][j] - 1, this.cols - j - 1); k >= 0; k--){
                        inMatche[i][j + k] = true;
                        len[i][j + k] = 0;
                    }
                    que.push([i, j + 1, 1, this.board[i][j]]);
                    flag = true;
                } else if(high[i][j] >= 4){
                    for(let k = Math.min(high[i][j] - 1, this.rows - i - 1); k >= 0; k--){
                        inMatche[i + k][j] = true;
                        high[i + k][j] = 0;
                    }
                    que.push([i + 1, j, 2, this.board[i][j]]);
                    flag = true;
                }
            }
        }
        // проверка 3 в ряд
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                if(len[i][j] >= 3){
                    for(let k = Math.min(len[i][j] - 1, this.cols - j - 1); k >= 0; k--){
                        inMatche[i][j + k] = true;
                        len[i][j + k] = 0;
                    }
                    flag = true;
                } else if(high[i][j] >= 3){
                    for(let k = Math.min(high[i][j] - 1, this.rows - i - 1); k >= 0; k--){
                        inMatche[i + k][j] = true;
                        high[i + k][j] = 0;
                    }
                    flag = true;
                }
            }
        }
        if(flag) {
            for(let i = 0; i < this.rows; i++) {
                for(let j = 0; j < this.cols; j++) {
                    if(inMatche[i][j]) {
                        this.pop(i, j);
                    }
                }
            }
            for(let i = 0; i < que.length; i++){
                let x = que[i][0], y = que[i][1], type = que[i][2], color = que[i][3];
                this.board[x][y] = color;
                this.types[x][y] = type;
            }
        }

        return flag;
    }

    gravitate() {
        for(let c = 0; c < this.cols; c++) {
            let cur = this.rows - 2;
            for(let r = this.rows - 1; r >= 0 && cur >= 0; r--) {
                //let cur = this.rows - 2;
                if(this.board[r][c] == ' ') {
                    while(cur >= 0 && this.board[cur][c] == ' ') {
                        cur--;
                    }
                    if(cur >= 0) {
                        [this.board[r][c], this.board[cur][c]] = [this.board[cur][c], this.board[r][c]];
                        [this.types[r][c], this.types[cur][c]] = [this.types[cur][c], this.types[r][c]];
                        cur--;
                    }
                }
                if(cur > r - 2) {
                    cur = r - 2;
                }
            }
        }
    }

    fill() {
        for(let r = 0; r < this.rows; r++) {
            for(let c = 0; c < this.cols; c++) {
                if(this.board[r][c] == ' ') {
                    this.board[r][c] = this.colors[Math.floor(Math.random() * this.colors.length)];
                    this.types[r][c] = 0;
                }
            }
        }
    }

    // В класс Match3Game добавить:
    gravitateAnimated() {
        const moves = [];

        for (let c = 0; c < this.cols; c++) {
            let cur = this.rows - 2; // 👈 ОБЪЯВЛЯЕМ ЗДЕСЬ

            for (let r = this.rows - 1; r >= 0 && cur >= 0; r--) {

                if (this.board[r][c] == ' ') {

                    while (cur >= 0 && this.board[cur][c] == ' ') {
                        cur--;
                    }

                    if (cur >= 0) {
                        moves.push({
                            fromRow: cur,
                            fromCol: c,
                            toRow: r,
                            toCol: c,
                            distance: r - cur // 👈 теперь правильно
                        });

                        cur--;
                    }
                }

                if (cur > r - 2) {
                    cur = r - 2;
                }
            }
        }

        return moves;
    }

    fillAnimated() {
        const newCells = []; // { row, col, color, type }
        
        for(let r = 0; r < this.rows; r++) {
            for(let c = 0; c < this.cols; c++) {
                if(this.board[r][c] == ' ') {
                    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
                    this.board[r][c] = color;
                    this.types[r][c] = 0;
                    newCells.push({ row: r, col: c, color, type: 0 });
                }
            }
        }
        return newCells;
    }

    getBoard() { return this.board; }
    getScore() { return this.score; }
    getMoves() { return this.movesUsed; }
    getTypes() { return this.types; }
}