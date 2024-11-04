// game.js

const BOARD_SIZE = 5;
const SHIP_COUNT = 3;

// Crea una griglia vuota
function createBoard() {
    return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
}

// Posiziona le navi in posizioni casuali e restituisce le posizioni
function placeShips(board, shipCount) {
    let shipsPlaced = 0;
    const shipPositions = [];

    while (shipsPlaced < shipCount) {
        const x = Math.floor(Math.random() * BOARD_SIZE);
        const y = Math.floor(Math.random() * BOARD_SIZE);

        if (board[x][y] === 0) {
            board[x][y] = 1; // 1 rappresenta una nave
            shipPositions.push([x, y]);
            shipsPlaced++;
        }
    }

    return shipPositions;
}

// Crea una nuova partita
function createGame() {
    const board1 = createBoard();
    const board2 = createBoard();
    const shipPositions1 = placeShips(board1, SHIP_COUNT);
    const shipPositions2 = placeShips(board2, SHIP_COUNT);

    return {
        boards: [board1, board2],
        ships: [SHIP_COUNT, SHIP_COUNT],
        shipPositions: [shipPositions1, shipPositions2],
    };
}

// Gestisce un attacco
function handleAttack(game, player, x, y) {
    const opponent = player === 1 ? 1 : 0;
    const board = game.boards[opponent];
    let hit = false;

    if (board[x][y] === 1) {
        hit = true;
        board[x][y] = "X"; // Colpo riuscito
        game.ships[opponent]--;
        console.log(`Giocatore ${player} ha colpito (${x}, ${y})`);
    } else if (board[x][y] === 0) {
        board[x][y] = "O"; // Colpo a vuoto
        console.log(`Giocatore ${player} ha mancato (${x}, ${y})`);
    }

    return { hit, x, y, player };
}

// Verifica se un giocatore ha vinto
function checkWin(game) {
    return game.ships.some((ships) => ships === 0);
}

module.exports = { createGame, handleAttack, checkWin };
