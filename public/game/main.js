import { Match3Game } from './game.js';

let game = new Match3Game(6, 6, ['₽', 'Б', '¥', '$', '€'], 20);
let selectedCell = null;

function renderBoard() {
    const boardEl = document.getElementById('board');
    const board = game.getBoard();
    const types = game.getTypes();
    
    boardEl.innerHTML = '';
    boardEl.style.gridTemplateColumns = `repeat(${board[0].length}, 50px)`;
    
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[0].length; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.dataset.color = board[r][c];
            
            const cellType = types[r][c];
            cell.dataset.type = cellType;
            
            if (cellType === 0) {
                cell.textContent = board[r][c];
            } else if (cellType === 1) {
                cell.textContent = '↔';
            } else if (cellType === 2) {
                cell.textContent = '↕';
            } else if (cellType === 3) {
                cell.textContent = '✚';
            } else if (cellType === 4) {
                cell.textContent = '💣';
            }
            
            cell.addEventListener('click', onCellClick);
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
        messageEl.textContent = 'Кликни на две соседние клетки чтобы поменять';
        messageEl.style.color = '#58585a';
    }
}

function onCellClick(e) {
    if (game.isLosed()) return;
    
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
            renderBoard();
        }
        
        selectedCell = null;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const resetBtn = document.getElementById('reset');
    
    resetBtn.addEventListener('click', () => {
        game = new Match3Game(6, 6, ['₽', 'Б', '¥', '$', '€'], 20);
        renderBoard();
        selectedCell = null;
    });
    
    renderBoard();
    
    // Сообщаем React, что игра загружена
    window.parent.postMessage({ type: 'GAME_READY' }, '*');
});

// Переопределяем renderBoard для отправки GAME_OVER
const originalRender = renderBoard;
renderBoard = function() {
    originalRender();
    if (game.isLosed()) {
        window.parent.postMessage({ 
            type: 'GAME_OVER', 
            score: game.getScore() 
        }, '*');
    }
};