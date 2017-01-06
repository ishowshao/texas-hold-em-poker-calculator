/**
 * n人桌，模拟发牌测试
 */
const util = require('../src/js/util');
const generate = util.generate;
const Classifier = require('../src/js/classifier');

const playerCount = 9;

const used = new Set();

const getCard = () => {
    while (true) {
        let card = Math.floor(Math.random() * 52);
        if (!used.has(card)) {
            used.add(card);
            return card;
        }
    }
};

console.time('done');

// 发牌
const players = [];
for (let i = 0; i < playerCount; i++) {
    players[i] = [getCard(), getCard()];
}

// flop turn river
const common = [getCard(), getCard(), getCard(), getCard(), getCard()];

console.log('公共牌：', util.air(common));

// get winner
let winner = {};

for (let i = 0; i < playerCount; i++) {
    let hands = players[i];
    let c = new Classifier(hands.concat(common));
    let result = c.classify();
    console.log('Player', i, util.air(players[i]), result.pattern, result.reduce);
}

console.timeEnd('done');
