import { Match3Game } from './game.js';

let game = new Match3Game(6, 6, ['₽', 'Б', '¥', '$', '€'], 20);
let selectedCell = null;
let isAnimating = false;
let touchStart = null;

function renderBoard() {
    const boardEl = document.getElementById('board');
    const board = game.getBoard();
    const types = game.getTypes();
    
    boardEl.innerHTML = '';
    boardEl.style.gridTemplateColumns = `repeat(${board[0].length}, 1fr)`;
    
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[0].length; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.dataset.color = board[r][c];
            cell.dataset.type = types[r][c];
            
            if (types[r][c] === 0) {
                cell.textContent = board[r][c];
            } else if (types[r][c] === 1) {
                cell.textContent = '⇄';
            } else if (types[r][c] === 2) {
                cell.textContent = '⇅';
            } else if (types[r][c] === 3) {
                cell.textContent = '✚';
            } else if (types[r][c] === 4) {
                cell.textContent = '💣';
            }
            
            cell.addEventListener('click', onCellClick);
            cell.addEventListener('touchstart', onTouchStart);
            cell.addEventListener('touchmove', onTouchMove);
            cell.addEventListener('touchend', onTouchEnd);
            boardEl.appendChild(cell);
        }
    }
    
    document.getElementById('score').textContent = game.getScore();
    document.getElementById('moves').textContent = `${game.getMoves()}/${game.possibleMoves()}`;
    
    const messageEl = document.getElementById('message');
    if (game.isLosed()) {
        messageEl.textContent = '💀 ИГРА ОКОНЧЕНА 💀';
        messageEl.style.color = '#da291c';
    } else {
        messageEl.textContent = 'Свайпайте или кликайте соседние клетки';
        messageEl.style.color = '#58585a';
    }
}

function onTouchStart(e) {
    if (game.isLosed() || isAnimating) return;
    const touch = e.touches[0];
    touchStart = {
        x: touch.clientX,
        y: touch.clientY,
        row: parseInt(e.target.dataset.row),
        col: parseInt(e.target.dataset.col)
    };
    e.target.classList.add('selected');
}

function onTouchMove(e) {
    e.preventDefault();
}

function onTouchEnd(e) {
    if (!touchStart || game.isLosed() || isAnimating) return;
    
    const touch = e.changedTouches[0];
    const touchEnd = {
        x: touch.clientX,
        y: touch.clientY
    };
    
    const dx = touchEnd.x - touchStart.x;
    const dy = touchEnd.y - touchStart.y;
    
    let newRow = touchStart.row;
    let newCol = touchStart.col;
    
    if (Math.abs(dx) > Math.abs(dy)) {
        newCol += dx > 0 ? 1 : -1;
    } else {
        newRow += dy > 0 ? 1 : -1;
    }
    
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('selected'));
    
    if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 6) {
        const success = game.makeMove(touchStart.row, touchStart.col, newRow, newCol);
        if (success) {
            processMatches();
        }
    }
    
    touchStart = null;
}

function onCellClick(e) {
    if (game.isLosed() || isAnimating) return;
    
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    
    if (selectedCell === null) {
        selectedCell = { row, col };
        e.target.classList.add('selected');
    } else {
        const prevRow = selectedCell.row;
        const prevCol = selectedCell.col;
        
        document.querySelectorAll('.cell').forEach(c => c.classList.remove('selected'));
        
        const success = game.makeMove(prevRow, prevCol, row, col);
        if (success) {
            processMatches();
        }
        
        selectedCell = null;
    }
}

function processMatches() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Запускаем обработку без анимаций (просто мгновенно)
    while (game.checkMatches()) {
        game.gravitate();
        game.fill();
    }
    
    renderBoard();
    isAnimating = false;
    
    if (game.isLosed()) {
        window.parent.postMessage({ 
            type: 'GAME_OVER', 
            score: game.getScore() 
        }, '*');
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const resetBtn = document.getElementById('reset');
    
    resetBtn.addEventListener('click', () => {
        if (isAnimating) return;
        game = new Match3Game(6, 6, ['₽', 'Б', '¥', '$', '€'], 20);
        renderBoard();
        selectedCell = null;
        isAnimating = false;
    });
    
    renderBoard();
    window.parent.postMessage({ type: 'GAME_READY' }, '*');
});