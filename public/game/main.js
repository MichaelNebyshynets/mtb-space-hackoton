import { Match3Game } from './game.js';

const params = new URLSearchParams(window.location.search)
const mascot = params.get('mascot') 

console.log('🎮 Mascot from URL:', mascot)

let game = new Match3Game(6, 6, ['₽', 'Б', '¥', '$', '€'], 20 + (mascot == "cat" ? 10 : 0), [3, 3, 3, 3, 3]);
let selectedCell = null;
let isAnimating = false;
let touchStart = null;
let activeAbility = null; // 'block', 'row', 'col', 'cross', 'special'

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

// Свайпы
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
    // Если касание не началось или игра уже закончена — выходим
    if (!touchStart || game.isLosed() || isAnimating) return;

    const touch = e.changedTouches[0];
    const touchEnd = { x: touch.clientX, y: touch.clientY };

    const dx = touchEnd.x - touchStart.x;
    const dy = touchEnd.y - touchStart.y;

    let newRow = touchStart.row;
    let newCol = touchStart.col;

    if (Math.abs(dx) > Math.abs(dy)) {
        newCol += dx > 0 ? 1 : -1;
    } else {
        newRow += dy > 0 ? 1 : -1;
    }

    // Если включена способность – сразу её используем, без попытки swap
    if (activeAbility) {
        useAbility(touchStart.row, touchStart.col);
        selectedCell = null; // сбрасываем выбранную ячейку
        touchStart = null;
        return;
    }

    // Убираем визуальное выделение всех ячеек
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('selected'));

    // Обычный обмен камнями (если координаты в пределах доски)
    if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 6) {
        const success = game.makeMove(touchStart.row, touchStart.col, newRow, newCol);
        if (success) processMatches();
    }

    touchStart = null;
}

function useAbility(r, c) {
    if (activeAbility === 'block') {        
        if(game.abilitiesCols[0] > 0) {
            game.abilitiesCols[0]--;
            // Способность перса — пока заглушка
            if(mascot == "lion") {
                const targetColor = game.board[r][c];
                const otherColors = game.colors.filter(col => col !== targetColor);
                const newColor = otherColors[Math.floor(Math.random() * otherColors.length)];
                
                for (let rr = 0; rr < game.rows; rr++) {
                    for (let cc = 0; cc < game.cols; cc++) {
                        if(game.board[rr][cc] == targetColor) {
                            game.board[rr][cc] = newColor;
                        }
                    }
                }

            } else if(mascot == "eagle"){                
                const targetColor = game.board[r][c];
                
                for (let rr = 0; rr < game.rows; rr++) {
                    for (let cc = 0; cc < game.cols; cc++) {
                        if(game.board[rr][cc] == targetColor && game.types[rr][cc] == 0) {
                            game.types[rr][cc] = 3;
                        }
                    }
                }
            } else if(mascot == "bear"){
                for (let rr = 0; rr < game.rows; rr++) {
                    for (let cc = 0; cc < game.cols; cc++) {
                        game.pop(rr, cc);
                    }
                }
            } else if(mascot == "stork"){
                    const colors = [];
                    for (let rr = 0; rr < game.rows; rr++) {
                        for (let cc = 0; cc < game.cols; cc++) {
                            if (game.board[rr][cc] !== ' ') {
                                colors.push(game.board[rr][cc]);
                            }
                        }
                    }
                    
                    // Перемешиваем (Фишер-Йетс)
                    for (let i = colors.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [colors[i], colors[j]] = [colors[j], colors[i]];
                    }
                    
                    let idx = 0;
                    for (let rr = 0; rr < game.rows; rr++) {
                        for (let cc = 0; cc < game.cols; cc++) {
                            if (game.board[rr][cc] !== ' ') {
                                game.board[rr][cc] = colors[idx++];
                                game.types[rr][cc] = 0;
                            }
                        }
                    }
            } else {
                game.pop(r, c);
            }
        }
    } else if (activeAbility === 'row') {
        if(game.abilitiesCols[1] > 0) {
            game.abilitiesCols[1]--;
            for (let cc = 0; cc < game.cols; cc++) {
                game.pop(r, cc);
            }
        }
    } else if (activeAbility === 'col') {
        if(game.abilitiesCols[2] > 0) {
            game.abilitiesCols[2]--;
            for (let rr = 0; rr < game.rows; rr++) {
                game.pop(rr, c);
            }
        }
    } else if (activeAbility === 'cross') {
        if(game.abilitiesCols[3] > 0) {
            game.abilitiesCols[3]--;
            for (let cc = 0; cc < game.cols; cc++) {
                game.pop(r, cc);
            }
            for (let rr = 0; rr < game.rows; rr++) {
                game.pop(rr, c);
            }
        }
    } else if (activeAbility === 'special') {
        if(game.abilitiesCols[4] > 0) {
            game.abilitiesCols[4]--;
            for (let rr = 0; rr < game.rows; rr++) {
                for (let cc = 0; cc < game.cols; cc++) {
                    if(rr == r && cc == c) {
                        continue;
                    }
                    if(game.board[r][c] == game.board[rr][cc]) {
                        game.pop(rr, cc);
                    }
                }
            }
            game.pop(r, c);
        }
    }

    activeAbility = null;
    updateAbilityButtons();
    
    // Запускаем каскад с анимациями
    processMatches();
}

function onCellClick(e) {
    if (game.isLosed() || isAnimating) return;
    
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    
    // Если активна способность
    if (activeAbility) {
        // При активной способности отменяем обычный обмен ячейками
        useAbility(row, col);
        selectedCell = null; // сбрасываем выбранную ячейку
        return;
    }

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

// async function processMatches() {
//     isAnimating = true;
    
//     while (true) {
//         const hadMatches = game.checkMatches();
//         if (!hadMatches) break;

//         renderBoard();

//         // 👇 СНАЧАЛА считаем
//         const moves = game.gravitateAnimated();

//         // 👇 ПОТОМ анимация
//         if (moves.length > 0) {
//             await animateGravity(moves);
//         }

//         // 👇 ТОЛЬКО ТЕПЕРЬ реально двигаем
//         game.gravitate();
//         renderBoard();

//         await sleep(50);

//         const newCells = game.fillAnimated();

//         if (newCells.length > 0) {
//             await animateNewCells(newCells);
//         }

//         renderBoard();
//         await sleep(100);
//     }
    
//     renderBoard();
//     isAnimating = false;
// }


/**
 * Обработчик матчей с ограничениями, чтобы не перегружать главный поток.
 * При большом числе пустых ячеек сначала применяем гравитацию/заполнение,
 * а затем проверяем совпадения. Анимация запускается только если
 * количество перемещений > 3 – иначе сразу обновляем доску.
 */
async function processMatches() {
    if (isAnimating) return;
    isAnimating = true;
    const MAX_ITER = 5; // ограничиваем количество полных итераций за один вызов
    let iter = 0;

    while (true) {
        if (iter++ >= MAX_ITER) {
            // даём браузеру возможность отрисовать кадр
            await new Promise(r => requestAnimationFrame(r));
            iter = 0;
        }

        // ---- пустые клетки -------------------------------------------------
        let hasEmpty = false;
        outer: for (let r = 0; r < game.rows; r++) {
            for (let c = 0; c < game.cols; c++) {
                if (game.board[r][c] === ' ') { hasEmpty = true; break outer; }
            }
        }
        if (hasEmpty) {
            const moves = game.gravitateAnimated();
            if (moves.length > 3) await animateGravity(moves);
            else if (moves.length) game.gravitate(); // без анимации

            game.gravitate();
            renderBoard();
            await new Promise(r => requestAnimationFrame(r));

            const newCells = game.fillAnimated();
            if (newCells.length) {
                renderBoard();
                if (newCells.length > 3) await animateNewCells(newCells);
            }
            continue;
        }

        // ---- проверка матчей ---------------------------------------------
        const hasMatches = game.checkMatches();
        if (!hasMatches) break;

        renderBoard();
        document.querySelectorAll('.cell').forEach(c => { c.style.transform=''; c.style.transition=''; });
        await new Promise(r => requestAnimationFrame(r));

        // падения
        const moves = game.gravitateAnimated();
        if (moves.length > 3) await animateGravity(moves);
        else if (moves.length) game.gravitate();
        game.gravitate();
        renderBoard();
        await new Promise(r => requestAnimationFrame(r));

        // новые камни
        const newCells = game.fillAnimated();
        if (newCells.length) {
            renderBoard();
            if (newCells.length > 3) await animateNewCells(newCells);
        }
    }

    renderBoard();
    isAnimating = false;
}


//поменял
function animateGravity(moves) {
    return new Promise(resolve => {
        const cells = document.querySelectorAll('.cell');

        moves.forEach(move => {
            const cell = Array.from(cells).find(
                c => c.dataset.row == move.fromRow && c.dataset.col == move.fromCol
            );

            if (cell) {
                const distance = move.distance;

                // 👇 двигаем на реальное расстояние
                cell.style.transform = `translateY(${distance * 100}%)`;
                cell.style.transition = 'transform 0.2s ease';
            }
        });

        setTimeout(() => {
            resolve();
        }, 200);
    });
}


function animateNewCells(newCells) {
    return new Promise(resolve => {
        setTimeout(() => {
            const cells = document.querySelectorAll('.cell');
            newCells.forEach(cell => {
                const newCell = Array.from(cells).find(
                    c => c.dataset.row == cell.row && c.dataset.col == cell.col
                );
                if (newCell) {
                    newCell.classList.add('new');
                }
            });
            setTimeout(() => {
                cells.forEach(c => c.classList.remove('new'));
                resolve();
            }, 200);
        }, 50);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateAbilityButtons() {
    document.querySelectorAll('.ability-btn').forEach(btn => btn.classList.remove('active'));
    
    // Обновляем цифры только если есть abilitiesCols
    if (game.abilitiesCols) {
        document.querySelector('#ability-block .ability-count').textContent = game.abilitiesCols[0];
        document.querySelector('#ability-row .ability-count').textContent = game.abilitiesCols[1];
        document.querySelector('#ability-col .ability-count').textContent = game.abilitiesCols[2];
        document.querySelector('#ability-cross .ability-count').textContent = game.abilitiesCols[3];
        document.querySelector('#ability-special .ability-count').textContent = game.abilitiesCols[4];
    }
    
    if (activeAbility === 'block') document.getElementById('ability-block').classList.add('active');
    if (activeAbility === 'row') document.getElementById('ability-row').classList.add('active');
    if (activeAbility === 'col') document.getElementById('ability-col').classList.add('active');
    if (activeAbility === 'cross') document.getElementById('ability-cross').classList.add('active');
    if (activeAbility === 'special') document.getElementById('ability-special').classList.add('active');
}

window.addEventListener('DOMContentLoaded', () => {
    
    renderBoard();
    
    document.getElementById('ability-block').addEventListener('click', () => {
        activeAbility = activeAbility === 'block' ? null : 'block';
        updateAbilityButtons();
    });
    document.getElementById('ability-row').addEventListener('click', () => {
        activeAbility = activeAbility === 'row' ? null : 'row';
        updateAbilityButtons();
    });
    document.getElementById('ability-col').addEventListener('click', () => {
        activeAbility = activeAbility === 'col' ? null : 'col';
        updateAbilityButtons();
    });
    document.getElementById('ability-cross').addEventListener('click', () => {
        activeAbility = activeAbility === 'cross' ? null : 'cross';
        updateAbilityButtons();
    });
    document.getElementById('ability-special').addEventListener('click', () => {
        activeAbility = activeAbility === 'special' ? null : 'special';
        updateAbilityButtons();
    });
    // window.parent.postMessage({ type: 'GAME_READY' }, '*');
});

// Переопределяем конец игры
const originalProcessMatches = processMatches;
processMatches = async function() {
    await originalProcessMatches();
    if (game.isLosed()) {
        window.parent.postMessage({ 
            type: 'GAME_OVER', 
            score: game.getScore() 
        }, '*');
    }
};