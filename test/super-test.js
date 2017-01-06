/**
 * n人桌，模拟发牌测试
 */
const util = require('../src/js/util');
const compare = require('../src/js/compare');
const Classifier = require('../src/js/classifier');

const getCard = (used) => {
    while (true) {
        let card = Math.floor(Math.random() * 52);
        if (!used.has(card)) {
            used.add(card);
            return card;
        }
    }
};
const levelCount = {
    'RoyalStraightFlush': 0,
    'StraightFlush': 0,
    'FourOfAKind': 0,
    'FullHouse': 0,
    'Flush': 0,
    'Straight': 0,
    'ThreeOfAKind': 0,
    'TwoPair': 0,
    'OnePair': 0,
    'HighCard': 0
};

const playerCount = 9;

let simulateCount = 300000;
const result = new Map();

for (let t = 0; t < simulateCount; t++) {
    let used = new Set();

    // 发牌
    const players = [];
    for (let i = 0; i < playerCount; i++) {
        players[i] = [getCard(used), getCard(used)];
    }

    // flop turn river
    const common = [getCard(used), getCard(used), getCard(used), getCard(used), getCard(used)];

    // console.log('公共牌：', util.air(common));

    // get winner
    let winner = {pattern: ''};

    for (let i = 0; i < playerCount; i++) {
        let hands = players[i];
        let c = new Classifier(hands.concat(common));
        let result = c.classify();
        // console.log('Player', i, util.air(players[i]), result.pattern, result.reduce);
        if (!winner.pattern) {
            winner = result;
            winner.index = i;
            winner.hands = hands;
        }
        else {
            if (compare(result, winner) > 0) {
                winner = result;
                winner.index = i;
                winner.hands = hands;
            }
        }
    }

    // console.log('\nWinner', winner.index, util.air(winner.hands), winner.pattern, winner.reduce);

    let key = util.air(winner.hands.sort()).toString();
    let v = result.get(key);
    if (v) {
        result.set(key, ++v);
    }
    else {
        result.set(key, 1);
    }
}

// console.log(result, result.size);

let resultArray = Array.from(result);
resultArray = resultArray.sort((a, b) => b[1] - a[1]);
console.log(resultArray);

