//一連の進行を管理するクラス.
class Table{
    //gameType : ゲームの種類
    //betDominations : 配列。各要素はベットできるチップの単位
    //numberOfPlayers : テーブルに参加するプレイヤーの数
    //human: プレイヤーが人間かどうか表す。値がnullもしくは'ai'の場合はAIとして扱う
    constructor(numberOfPlayers, human ,gameType, betDominations = [1, 5, 10, 25, 100]){
        this.gameType = gameType;
        this.betDominations = betDominations;
        this.deck = new Deck(this.gameType);
        this.players = this.addPlayers();
        this.human = human;
        this.numberOfPlayers = numberOfPlayers;
        this.house = new Player('house', 'house', this.gameType);
        this.gamePhase = 'betting';
        this.resultLog = [];
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
        //humanがnullもしくは'ai'の場合はAIとして扱う。そうでない場合はhumanに入力された値を名前として扱う。typeはhumanとする。
        if (this.human === null || this.human === 'ai'){
            players.push(new Player('Player1', 'ai', this.gameType));
        }else{
            players.push(new Player(this.human, 'human', this.gameType));
        }
        //this.numberOfPlayersの数だけプレイヤーを追加する。
        for (let i = 1; i < this.numberOfPlayers; i++){
            players.push(new Player('Player' + (i + 1), 'ai', this.gameType));
        } 
        return players;
    }


    //playser: Player.promptPlayer()を使用してGameDecesionを取得。GameDecesionとgametypeに応じてPlayerの状態を更新する
    //例：playerがhitを選択。手札が21を超える場合はbustとなり、gameStatusをbustに変更する
    evaluateMove(player){

}
    //return string: 新しいターンが始まる直前の全プレイヤーの状態を表す文字列
    //このメソッドの出力は、各ラウンドの終了時にテーブルのresultLogメンバを更新するために使用される
    blackjackEvaluateAndGetRoundResult(){
    }

    //return null: デッキから2枚のカードを引き、プレイヤーの手札に加えることで全プレイヤーの状態を更新する。
    //プレイヤータイプがhouseの場合は、カードを伏せておく
    blackjackAssignPlayerHands(){

    }

    //return null: すべてのプレイヤーの状態を更新する。手札の配列をemptyにし、betを0にする
    blackjackClearPlayerHandsAndBets(){
    }

    //return Player: 現在のプレイヤーを返す
    getTurnPlayer(){

    }

    //reutrn null:テーブルの状態を更新する。
    haveTurn(userData){

    }

    //return booelan:テーブルがプレイヤー配列の最初のプレイヤーを指しているかときはtrueを返す。そうでない場合はfalseを返す。
    onFirstPlayer(){
        if (this.players[0] === this.getTurnPlayer()){
            return true;
        }else{
            return false;
        }
    }

    //return boolean:テーブルがプレイヤー配列の最+後のプレイヤーを指しているかときはtrueを返す。そうでない場合はfalseを返す。
    onLastPlayer(){
        if (this.players[this.players.length - 1] === this.getTurnPlayer()){
            return true;
        }else{
            return false;
    }
    }

    //return boolean: すべてのプレイヤー{'broken', 'bust', 'stand', 'surrender'}のいずれかの状態になっているかどうか
    allPlayerActionsResolved(){
        for (let i = 0; i < this.players.length; i++){
    }
}





}


class Player{
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
    promptPlayer(userData){
        if (userData === null){
            //userDataがnullの場合は、AIの場合とする
            userData = this.aiDecide();
        }
        return new GameDecision(userData.action, userData.amount);
    }
    //合計が21を超える場合は、手札のAを、合計が21以下になるまで1として扱う
    getHandScore(){
        //手札の合計を計算する
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
        //手札の合計が17以上ならstand
        if (this.getHandScore() >= 17){
            return 'stand';
        }
        //手札の合計が17未満ならhit
        else{
            return 'hit';
        }
    }

}

class GameDecision{
    // action : Blackjack ではhit, stand, double, split. プレイヤーのアクションの選択
    // amount : プレイヤーが選択する掛け金
    // Player.promptPlayer() メソッドが常にGameDecisionオブジェクトを返す
    constructor(action, amount){
        this.action = action;
        this.amount = amount;
    }
}





class Deck{
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


class Card{
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


let table1 = new Table('blackjack');
while(table1.gamePhase !== 'roundOver'){
    table1.haveTruen();
}

console.log(table1.resultLog);