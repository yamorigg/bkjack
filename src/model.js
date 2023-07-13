
export class Table{
    //gameType : ゲームの種類
    //betDominations : 配列。各要素はベットできるチップの単位
    //numberOfPlayers : テーブルに参加するプレイヤーの数
    //human: プレイヤーが人間かどうか表す。値がnullもしくは'ai'の場合はAIとして扱う
    constructor(gameType, human = null ,betDominations = [1, 5, 10, 25, 100], numberOfPlayers = 3){
        this.gameType = gameType;
        this.betDominations = betDominations;
        this.deck = new Deck(this.gameType);
        this.human = human;
        this.numberOfPlayers = numberOfPlayers;
        this.house = new Player('house', 'house', this.gameType);
        //gamePhaseはゲームの進行状況を表す。betting, playerTurn, houseTurn, roundOverのいずれかの値を取る
        this.gamePhase = 'betting';
        this.resultLog = [];
        this.players = this.addPlayers();
        }

    /*プレイヤーをplayers配列に追加する。
    humanは最初のプレイヤーとして扱う。
    this.numberOfPlayersの数だけプレイヤーを追加する。
    humanがnullもしくは'ai'の場合はAIとして扱う。そうでない場合はhumanに入力された値を名前として扱う。typeはhumanとする。
    houseはplayers配列に追加しない
    return:Playerの配列
    */
    addPlayers(){
        let players = [];
        players.push(new Player('Player1', 'ai', this.gameType));
        //humanがnullもしくは'ai'の場合はAIとして扱う。そうでない場合はhumanに入力された値を名前として扱う。typeはhumanとする。
        if (this.human === null || this.human === 'ai'){
            players.push(new Player('Player2', 'ai', this.gameType));
            players.push(new Player('Player3', 'ai', this.gameType));
        }else{
            players.push(new Player(this.human, 'human', this.gameType));
            players.push(new Player('Player2', 'ai', this.gameType));
        }
        
        //最初に足したプレイヤーとthis.numberOfPlayersの数だけプレイヤーを追加する。
        // for (let i = 1; i < this.numberOfPlayers; i++){
        //     players.push(new Player('Player' + (i + 1), 'ai', this.gameType));
        // } 
        return players;
    }




    //return string: 新しいターンが始まる直前の全プレイヤーの状態を表す文字列
    //このメソッドの出力は、各ラウンドの終了時にテーブルのresultLogメンバを更新するために使用される
    //houseとの勝敗を判定し、プレイヤーの所持金を更新する。プレイヤーが勝利した場合はbetの2倍をPlayer.chipsに加える。引き分けの場合は何もしない。プレイヤーが敗北した場合はbetをPlayer.chipsから引く。プレイヤーの所持金が0になった場合は、players配列からプレイヤーを削除する。gamePhaseをbettingに更新する。
    blackjackEvaluateAndGetRoundResult(){
        let roundResult = '';
        for (let i = 0; i < this.players.length; i++){
            let player = this.players[i];

            if (player.gameStatus === 'stand' || player.gameStatus === 'double'){
                let houseScore = this.house.getHandScore();
                let playerScore = player.getHandScore();
                if (playerScore === 21){
                    player.gameStatus = 'blackjack';
                }
                else if (houseScore > 21){
                    player.gameStatus = 'win';
                }else if (playerScore > houseScore){
                    player.gameStatus = 'win';
                }else if (playerScore === houseScore){
                    player.gameStatus = 'draw';
                }else{
                    player.gameStatus = 'lose';
                }
            }

            //プレイヤーの所持金を更新する
            if (player.gameStatus === 'bust'){
                roundResult += player.name + 'はバーストしました。';
                if (player.chips <= 0){
                    roundResult += player.name + 'は破産しました。';
                    this.players.gameStatus = 'broken';

                }
            }else if (player.gameStatus === 'blackjack'){
                roundResult += player.name + 'はブラックジャックです。';
                player.chips += player.bet * 2;
            }else if (player.gameStatus === 'win'){
                roundResult += player.name + 'は勝ちました。';
                player.chips += player.bet * 2;
            }else if (player.gameStatus === 'lose'){
                roundResult += player.name + 'は負けました。';
                if (player.chips <= 0){
                    roundResult += player.name + 'は破産しました。';
                    this.players.gameStatus = 'broken';
                }
            }else if (player.gameStatus === 'draw'){
                roundResult += player.name + 'は引き分けです。';
                player.chips += player.bet;
            }
            //プレイヤーの状態をbettingに戻す
            if (player.gameStatus !== 'broken'){
                player.gameStatus = 'betting';
            }
        }
        return this.resultLog.push(roundResult);
    }

    //return null: デッキから2枚のカードを引き、プレイヤーの手札に加えることで全プレイヤーの状態を更新する。
    //プレイヤータイプがhouseの場合は、カードを伏せておく
    blackjackAssignPlayerHands(){
        for (let i = 0; i < this.players.length; i++){
            this.players[i].hand.push(this.deck.drawOne());
            this.players[i].hand.push(this.deck.drawOne());
        }
        this.house.hand.push(this.deck.drawOne());
    }

    //return null: すべてのプレイヤーの状態を更新する。手札の配列をemptyにし、betを0にする
    blackjackClearPlayerHandsAndBets(){
        for (let i = 0; i < this.players.length; i++){
            this.players[i].hand = [];
            this.players[i].bet = 0;
        }
        this.house.hand = [];
    }

    //return Player: 現在のプレイヤーを返す
    //現在のプレイヤーはplayers配列のgameStatusがbettingの状態である。findIndexを使用することで最初の'betting'のプレイヤーを取得する
    getTurnPlayer(status){
        let currentPlayerindex = this.players.findIndex(player => player.gameStatus === status );
        return this.players[currentPlayerindex];
    }

    //reutrn null:テーブルの状態を更新する
    //gamePhaseがbettingの場合は、現在のプレイヤーのbetを更新し、次のプレイヤーに移る。最後のプレイヤーの場合は、gamePhaseをplayerTurnに更新すると同時にblackjackAssignPlayerHandsを使う。
    //gamePhaseがplayerTurnの場合は、現在のプレイヤーのアクションをし、次のプレイヤーへ移る。最後のプレイヤーの場合はgamePhaseをhouseTurnに更新する。
    //gamePhaseがhouseTurnの場合は、houseのアクションを行う。houseは手札の合計が17以上になると終了する。gamePhaseをroundOverに更新する。
    //gamePhaseがroundOverの場合は、テーブルの状態を更新する。houseとの勝敗を判定し、プレイヤーの所持金を更新する。プレイヤーが勝利した場合はbetの2倍をPlayer.chipsに加える。引き分けの場合は何もしない。プレイヤーが敗北した場合はbetをPlayer.chipsから引く。プレイヤーの所持金が0になった場合は、players配列からプレイヤーを削除する。gamePhaseをbettingに更新する。
    haveTurn(userData){
        let searchStatus = 'None';
        let lastPlayer ;
        if (this.gamePhase === 'betting'){
            searchStatus = 'betting'
            lastPlayer = this.onLastPlayer(searchStatus);
            //現在のプレイヤーを取得する
            let currentPlayer = this.getTurnPlayer(searchStatus);
            //現在のプレイヤーのbet額を更新する。
            //プレイヤーの状態がbettingの場合は、promptPlayerを使用してbetを取得する
            if (currentPlayer.gameStatus === 'betting'){
                currentPlayer.bet = currentPlayer.promptPlayer(userData).amount;
                currentPlayer.gameStatus = 'playing';
            }
        
        } else if (this.gamePhase === 'playerTurn'){
            searchStatus = 'playing'
            lastPlayer = this.onLastPlayer(searchStatus);
            //現在のプレイヤーを取得する
            let currentPlayer = this.getTurnPlayer(searchStatus);
            //現在のプレイヤーのアクションを実行する。
            //プレイヤーの状態がplayingの場合は、promptPlayerを使用してアクションを取得する
            //取得したactionをevaluateMoveに渡す。currentPlayerのgameStatusがstandかbustになるまで繰り返す。
            while (currentPlayer.gameStatus === 'playing' || currentPlayer.gameStatus === 'hit'){
                currentPlayer.gameStatus = currentPlayer.promptPlayer(userData).action;
                this.evaluateMove(currentPlayer);
            }
        }else if (this.gamePhase === 'houseTurn'){
            lastPlayer = true;
            while (this.house.gameStatus === 'playing' || this.house.gameStatus === 'hit'){
                this.house.gameStatus = this.house.promptPlayer(userData).action;
                this.evaluateMove(this.house);
            }
        }else if (this.gamePhase === 'roundOver'){
            this.blackjackEvaluateAndGetRoundResult();
        }
        //テーブルの状態を更新する
        //現在のプレイヤーが最後のプレイヤーの場合は、ゲームのフェーズを更新する
        if (lastPlayer) {
            if (this.gameType === 'blackjack'){
                switch(this.gamePhase){
                    case 'betting':
                        this.gamePhase = 'playerTurn';
                        this.blackjackAssignPlayerHands();
                        break;
                    case 'playerTurn':
                        this.house.gameStatus = 'playing'
                        this.gamePhase = 'houseTurn';
                        break;
                    case 'houseTurn':
                        this.gamePhase = 'roundOver';
                        this.blackjackEvaluateAndGetRoundResult();
                        this.blackjackClearPlayerHandsAndBets();
                        break;
                    case 'roundOver':
                        this.gamePhase = 'betting';
                        break;
                    }
                } 
            }    
}

    //playser: Player.promptPlayer()を使用してGameDecesionを取得。GameDecesionとgametypeに応じてPlayerの状態を更新する
    //例：playerがhitを選択。手札が21を超える場合はbustとなり、gameStatusをbustに変更する
    evaluateMove(player){
        let action = player.gameStatus;
        //actionに応じてplayerの状態を更新する
        //actionがhitの場合は、playerのhandにdeckから1枚カードを引く
        if (action === 'hit'){
            player.hand.push(this.deck.drawOne());
            if (this.gameType === 'blackjack'){
                if (player.getHandScore() > 21){
                    player.gameStatus = 'bust';
                }
                else{
                    player.gameStatus = 'playing';
                }
            }
        }else if (action === 'stand'){
            player.gameStatus = 'stand';
        }else if (action === 'surrender'){
            player.gameStatus = 'surrender';
        }else if (action === 'double'){
            player.hand.push(this.deck.drawOne());
            player.bet *= 2;
            player.gameStatus = 'stand';
    }
}
    //return booelan:テーブルがプレイヤー配列の最初のプレイヤーを指しているかときはtrueを返す。そうでない場合はfalseを返す。
    onFirstPlayer(status){
        if (this.players[0] === this.getTurnPlayer(status)){
            return true;
        }else{
            return false;
        }
    }

    //return boolean:テーブルがプレイヤー配列の最後のプレイヤーを指しているかときはtrueを返す。そうでない場合はfalseを返す。
    onLastPlayer(status){
        if (this.players[this.players.length - 1] === this.getTurnPlayer(status)){
            return true;
        }else{
            return false;
        }
    }

    //return boolean: すべてのプレイヤー{'broken', 'bust', 'stand', 'surrender'}のいずれかの状態になっているかどうか
    allPlayerActionsResolved(){
        for (let i = 0; i < this.players.length; i++){
            if (this.players[i].gameStatus === 'betting'){
                return false;
            }
        }
        return true;
    }
}

export class Player{
    constructor(name , type, gameType, chips = 400){
        this.name = name;
        this.type = type;
        this.gameType = gameType;
        this.chips = chips;
        this.hand = [];
        this.bet = 0;
        this.winAmount = 0;
        this.gameStatus = 'betting';
    }
    //Object userData: model.js外から渡される。nullになることもある。
    //GameDecisionオブジェクトを返す: 状態を考慮した上で、プレイヤーが行った意思決定。
    //userData{action: 'hit', amount: 0}のような形式で渡される
    promptPlayer(userData = null){
        if (userData === null){
            //userDataがnullの場合は、AIの場合とする
            userData = this.aiDecide();
            this.bet = userData.amount;
            this.chips -= userData.amount;
        }
        return new GameDecision(userData.action, userData.amount);
    }
    //合計が21を超える場合は、手札のAを、合計が21以下になるまで1として扱う
    getHandScore(){
        let score = 0;
        //Aの枚数を数える
        let aceCount = 0;
        //手札の合計を計算する
        for (let i = 0; i < this.hand.length; i++){
            score += this.hand[i].getRankNumber();
            //Aだった場合はaceCountを増やす
            if (this.hand[i].rank === 'A'){
                aceCount++;
            }
        }
        //合計が21を超えていて、Aがある場合は、Aを1として扱う
        while (score > 21 && aceCount > 0){
            score -= 10;
            aceCount--;
        }
        //手札の合計を返す
        return score;
    }
    //AIのゲーム判断アルゴリズム
    aiDecide(){
        let action = '';
        let amount = 10;
        //hoseの場合は、手札の合計が17以上ならstand、17未満ならhit
        if (this.type === 'house'){
            if (this.getHandScore() >= 17){
                action = 'stand';
            }else{
                action = 'hit';
            }
            return {'action': action, 'amount': amount};
        }


        //手札の合計が17以上ならstand
        if (this.gameStatus === 'playing' && this.getHandScore() >= 17){
            action = 'stand';
        }
        //手札の合計が17未満ならhit
        else{
            action =  'hit';
        }
        return {'action': action, 'amount': amount};
    }

}

export class GameDecision{
    // action : Blackjack ではhit, stand, double, split. プレイヤーのアクションの選択
    // amount : プレイヤーが選択する掛け金
    // Player.promptPlayer() メソッドが常にGameDecisionオブジェクトを返す
    constructor(action, amount){
        this.action = action;
        this.amount = amount;
    }
}

export class Deck{
    constructor(gameType){
        this.cards = [];
        this.gameType = gameType;

        if (this.gameType ==='blackjack'){
            this.resetDeck();
        }
    }
    //デッキをシャッフルする
    shuffle(){
        // Fisher-Yatesアルゴリズム
        for (let i = this.cards.length - 1; i >= 0; i--){
            let rand = Math.floor(Math.random() * (i + 1));
            let temp = this.cards[i];
            this.cards[i] = this.cards[rand];
            this.cards[rand] = temp;
        }
    }
    //デッキをリセットする
    resetDeck(){
        this.cards = this.generateDeck();
        this.shuffle();
    }

    // 先頭からカードを一枚引く
    drawOne(){
        // カードがない場合はデッキをリセットする
        if (this.cards.length === 0){
            this.resetDeck();
        }
        //Cardクラスのインスタンスを返す
        return this.cards.shift();
    }

    //デッキを生成する
    generateDeck(){
        let newDeck = [];
        const suits = ['C', 'H', 'S', 'D']
        const rnak = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        //newDeckにカードを追加
        for (let i = 0; i < suits.length; i++){
            for (let j = 0; j < rnak.length; j++){
                newDeck.push(new Card(suits[i], rnak[j]))
            }
    }
    return newDeck;
    }
}


export class Card{
/*
String suit : {"H", "D", "C", "S"}から選択
String rank : {"A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"}から選択
*/
    constructor(suit, rank){
        this.suit = suit;
        this.rank = rank;
    }

    //カードのスコアを返す
    getRankNumber(){
        //Aは11として扱う
        if  (this.rank === 'A'){
            return Number(11)
        }
        //J,Q,Kは10として扱う
        if (this.rank === 'J' || this.rank === 'Q' || this.rank === 'K'){
            return Number(10)
        }
        //2~10はそのままの値を返す
        return Number(this.rank);

    }
}