import {Table, Player, Card, Deck} from "./model.js";
import { GameCon, Render } from "./controller.js";

document.getElementById("startGame").addEventListener("click", () => {
    let playerName = document.getElementById("playerName").value;
    if (playerName === ""){
        playerName = 'You';
    }
    let table = new Table("blackjack", playerName);
    console.log(table.players)
    Render.renderTable(table);
    GameCon.playGame(table);
});
