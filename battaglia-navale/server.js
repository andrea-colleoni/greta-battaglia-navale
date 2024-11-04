// server.js

const express = require("express");
const { WebSocketServer } = require("ws");
const { createGame, handleAttack, checkWin } = require("./game");

const app = express();
const PORT = 3000;
const wss = new WebSocketServer({ noServer: true });
let players = [];
let game;

app.use(express.static("public"));

wss.on("connection", (ws) => {
    if (players.length < 2) {
        players.push(ws);
        if (players.length === 2) {
            game = createGame();

            players.forEach((p, i) => {
                p.send(JSON.stringify({ type: "start", player: i + 1 }));
                p.send(JSON.stringify({ type: "placeShips", ships: game.shipPositions[i] }));
            });
        }
    }

    ws.on("message", (message) => {
        const data = JSON.parse(message);

        if (data.type === "attack" && game) {
            const result = handleAttack(game, data.player, data.x, data.y);
            players.forEach((p) => p.send(JSON.stringify({ type: "attack", ...result })));

            if (checkWin(game)) {
                players.forEach((p) => p.send(JSON.stringify({ type: "win", winner: data.player })));
            }
        }
    });

    ws.on("close", () => {
        players = players.filter((p) => p !== ws);
        if (players.length < 2) {
            game = null;
            players.forEach((p) => p.send(JSON.stringify({ type: "reset" })));
        }
    });
});

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
    });
});
