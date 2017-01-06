/**
 * n人桌，模拟发牌测试
 */
const util = require('../src/js/util');
const generate = util.generate;

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
console.timeEnd('done');
console.log(players, common, used);