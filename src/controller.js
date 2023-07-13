
export class GameCon{
    static playGame(table){
    if (table.gameStatus === 'roundOver'){
        return;
    }
    //houseのターンの場合の処理

    //player.typeがaiの場合は自動でbetを行う
    if (table.getTurnPlayer(table.gamePhase).type === 'ai'){
        console.log( "aiのターンです");
        //1秒待機
        setTimeout(() => {
            table.haveTurn();
            Render.renderTable(table);
            this.playGame(table);
        }, 1000);
    }
    //player.typeがhumanの場合はボタンを表示
    else if (table.getTurnPlayer(table.gamePhase).type === 'human'){
        console.log("playerのターンです");
        let betsDiv = document.getElementById("betsDiv");
        //betsDivにrenderBetsを実行してボタンを表示
        betsDiv.innerHTML = Render.renderBets(table);
        Render.btnNumberEvent(table);
        document.getElementById("submitDiv").addEventListener("click", () => {
        let userData = {'action': "", 'amount': ''}
        userData.amount = document.getElementById("totalAmount").value;

        table.haveTurn();
        Render.renderTable(table);
        this.playGame(table);
    });
    }
    else{
        console.log('error');
    }
    }
}

export class Render{
    static renderTable(table){
        let gameDiv = document.getElementById("gameDiv");
        gameDiv.innerHTML =`
        <!-- all cards (dealer, players) div -->
        <div class="col-12">
            <div class="pt-5">
                <p class="m-0 text-center text-white rem3">Dealer</p>

                <!-- House Card Row -->
                <div id="houesCardDiv" class="d-flex justify-content-center pt-3 pb-5">
                    ${this.renderCards(table.house.hand)}
                </div>
            </div>

            <div class="">

                <!-- Players Div -->
                <div id="playersDiv" class="d-flex justify-content-between w-100">
                    ${this.renderPlayers(table)}
                </div><!-- end players -->

                <!-- actionsAndBetsDiv -->
                <div id="actionsAndBetsDiv" class="d-flex justify-content-center mt-3">
                    <div id="betsDiv" class="d-flex flex-column w-50">

                        </div>
                    </div>
                </div><!-- end actionsAndBetsDiv-->
            </div>
        </div>

        `;
        
    }

    static renderCards(hands){
        let cardsDiv = "";
        if (hands.length === 0){
            hands = [{suit:'questionMark', rank:'?'},{suit:'questionMark', rank:'?'}];
        }
        for (let card of hands){
                
            cardsDiv += `
            <div class="bg-white border mx-2">
                    <div class="text-center">
                        <img src="./img/${card.suit}.png" alt="" width="50" height="50">
                    </div>
                    <div class="text-center">
                        <p class="m-0">${card.rank}</p>
                    </div>
                </div>
            `;
        }
        return cardsDiv;
    }

    static renderPlayers(table){
        let playersDiv = "";
        let players = table.players;
        for (let player of players) {
            playersDiv += `
                <div class="flex-column w-25">
                    <p class="m-0 text-white text-center h2">${player.name}</p>
                    <p class="text-white  text-center m-0 h6">S: ${player.gameStatus}    B: ${player.bet}    C: ${player.chips}</p>
                    <div class="d-flex justify-content-center m-2">
                        ${this.renderCards(player.hand)}
                    </div>
                </div>
            `;
        }
        return playersDiv;
    }

    static renderBets(table){ 
            let betsDiv = ' <div class="d-flex justify-content-around">';
            let bets = table.betDominations;

            for (let bet of bets){
            betsDiv += `
                        <div class="d-flex flex-column">
                            <div>
                                <div class="input-group" >
                                    <span class="input-group-btn">
                                        <button type="button" class="btn btn-danger btn-number">
                                            -
                                        </button>
                                    </span>
                                    <span class="bg-white">0</span>
                                    <span class="input-group-btn">
                                        <button type="button" class="btn btn-success btn-number">
                                            +
                                        </button>
                                    </span>
                                </div><!--end input group div -->
                                <p class="text-white text-center">${bet}</p>
                            </div>
                        </div>
            `;
                        }
        betsDiv += `
        </div>
            <div  id="submitDiv" class="btn bg-primary">
            Your bet is <span id="totalAmount" class ="text-white ml-2">0</span> $
            </div>
        `;
        
        return betsDiv;
        }

    static btnNumberEvent(table){
        let btnSuccessList = document.querySelectorAll(".btn-success");

        btnSuccessList.forEach((btnSuccess) =>{
            btnSuccess.addEventListener("click", (event) => {
                let eventTarget = event.target;
                //対象のbet額の変数名;
                let betAmount = parseInt(eventTarget.parentElement.parentElement.parentElement.querySelector('p').textContent);
                let bet = eventTarget.parentElement.parentElement.querySelector(".bg-white");
                let currentValue = parseInt(bet.textContent);
                let newValue = currentValue + 1;
                bet.textContent = newValue;

                this.updateTotalAmount(betAmount);
            });

        });
        let btnDangerList = document.querySelectorAll(".btn-danger");
        btnDangerList.forEach((btnDanger) =>{
            btnDanger.addEventListener("click", (event) => {
                let eventTarget = event.target;
                let betAmount = -(parseInt(eventTarget.parentElement.parentElement.parentElement.querySelector('p').textContent));
                let bet = eventTarget.parentElement.parentElement.querySelector(".bg-white");
                let currentValue = parseInt(bet.textContent);
                let newValue = currentValue - 1;
                bet.textContent = newValue;
                
                this.updateTotalAmount(betAmount);
            });
        });
    }
    static updateTotalAmount(amount) {
        let totalAmountElement = document.getElementById("totalAmount");
        let totalAmount = parseInt(totalAmountElement.textContent);
        totalAmount += amount;
        

        totalAmountElement.textContent = totalAmount.toString();
    }
}