class Table{
    
}


class Player{


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