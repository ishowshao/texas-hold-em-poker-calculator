/**
 * n人桌，AK 对 口袋对的概率计算
 */
const util = require('../src/js/util');
const generate = util.generate;

const playerCount = 9;

let testCount = 1000000;

let match = 0;

for (let i = 0; i < testCount; i++) {
    const cards = generate(playerCount * 2);

    const div = [];
    for (let i = 0; i < playerCount; i++) {
        div[i] = [cards[i * 2], cards[i * 2 + 1]];
    }

    let hasPair = false;
    let hasAK = false;

    div.forEach((item) => {
        if (util.isPocketPair(...item)) {
            hasPair = true;
        }
        if (util.isPocketAK(...item)) {
            hasAK = true;
        }
    });

    if (hasPair && hasAK) {
        match++;
    }
}

console.log(match, testCount, match / testCount);
