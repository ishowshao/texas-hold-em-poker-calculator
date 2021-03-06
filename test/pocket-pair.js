/**
 * 计算起手拿口袋对的概率
 */
const util = require('../src/js/util');
const generate = util.generate;

const playerCount = 1;

let testCount = 1000000;

let match = 0;

for (let i = 0; i < testCount; i++) {
    const cards = generate(playerCount * 2);

    const div = [];
    for (let i = 0; i < playerCount; i++) {
        div[i] = [cards[i * 2], cards[i * 2 + 1]];
    }

    let hasPair = 0;

    div.forEach((item) => {
        if (util.isPocketPair(...item)) {
            hasPair++;
        }
    });

    if (hasPair > 0) {
        match++;
    }
}

console.log(match, testCount, match / testCount);
