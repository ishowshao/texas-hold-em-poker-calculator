const CARDS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
const SUITS = ['♠', '♥', '♣', '♦'];

/**
 * ID 转换为 可读字符
 *
 * @param {number} id 牌ID 0-51
 * @returns {string}
 */
const ir = function (id) {
    return SUITS[Math.floor(id / 13)] + CARDS[id % 13];
};

let testIr = function () {
    for (let i = 0; i < 52; i++) {
        console.log(ir(i));
    }
};
// testIr();

/**
 * 可读字符转换到ID
 *
 * @param {string} str 字符
 * @returns {number}
 */
const ri = function (str) {
    return SUITS.indexOf(str.charAt(0)) * 13 + CARDS.indexOf(str.charAt(1));
};

let testRi = function () {
    for (let i = 0; i < 52; i++) {
        console.log(ri(ir(i)));
    }
};
// testRi();

const pokers = [];
for (let i = 0; i < 52; i++) {
    pokers.push(i);
}

let pairs = [];

for (let i = 0; i < 52; i++) {
    for (let j = 0; j < 52; j++) {
        let pair = [];
        if (i !== j) {
            pair[0] = i > j ? j : i;
            pair[1] = i > j ? i : j;
            pairs.push(pair);
        }
    }
}

let has = {};
let uPairs = [];
for (let i = 0; i < pairs.length; i++) {
    let key = pairs[i][0] + '-' + pairs[i][1];
    if (!(key in has)) {
        has[key] = true;
        uPairs.push(pairs[i]);
    }
}

let count = 0;

for (let i = 0; i < uPairs.length; i++) {
    let pair = uPairs[i];
    let c1 = pair[0];
    let c2 = pair[1];
    if (pair[0] % 13 === 0 && pair[1] % 13 === 12) {
        count++;
        console.log(ir(c1), ir(c2));
    }
}

// console.log(uPairs.length, count);
// console.log(uPairs);
let common = ['♠A', '♠K', '♠Q'];

let isFlush = function (cards) {
    let count = [0, 0, 0, 0];

    cards.forEach(card => count[Math.floor(card / 13)]++);

    return count.some(item => item >= 5);
};

let isStraight = function (cards) {
    let length = cards.length;
    let is = false;
    if (length >= 5 && length <= 7) {
        cards = cards.map(card => card % 13); // 去除花色
        cards = Array.from(new Set(cards)).sort((a, b) => a > b); // 去重 排序
        // console.log(cards);
        switch (cards.length) {
            case 5:
                is = (cards[4] - cards[0] === 4);
                break;
            case 6:
                is = (cards[4] - cards[0] === 4) || (cards[5] - cards[1] === 4);
                break;
            case 7:
                is = (cards[4] - cards[0] === 4) || (cards[5] - cards[1] === 4) || (cards[6] - cards[2] === 4);
                break;
        }

        if (cards.length > 4 && cards[0] === 0
            && cards.pop() === 12
            && cards.pop() === 11
            && cards.pop() === 10
            && cards.pop() === 9) {
            is = true;
        }
    }
    return is;
};

let isStraightFlush = function (cards) {
    return isFlush(cards) && isStraight(cards);
};

let isRoyalStraightFlush = function (cards) {
    return cards.indexOf()
};

let isFourOfAKind = function (cards) {
    let count = [];
    count.length = 13;
    count.fill(0);
    cards = cards.map(card => card % 13); // 去除花色
    cards.forEach(card => count[card]++);
    return count.some(item => item === 4);
};


let isFullHouse = function (cards) {
    let count = [];
    count.length = 13;
    count.fill(0);
    cards = cards.map(card => card % 13); // 去除花色
    cards.forEach(card => count[card]++);
    let hasThree = false;
    count.forEach((item, i) => {
        if (item === 3) {
            count[i] = 0;
            hasThree = true;
        }
    });
    return hasThree && count.some(item => item >= 2 && item < 4);
};

let isThreeOfAKind = function () {
};

let isTwoPair = function () {
};

let isOnePair = function () {
};

let isHighCard = function () {
};


let testCards = [0, 13, 26, 39, 1];
console.log(testCards.map(card => ir(card)));
console.log(isFourOfAKind(testCards));
// console.time('test');
// for (let i = 0; i < 23000; i++) {
//     isStraightFlush(testCards);
// }
// console.timeEnd('test');
// console.log(isStraight(testCards));

// console.log(ir(0));
// console.log(ir(1));
// console.log(ir(2));
// console.log(ir(3));
// console.log(ri(ir(0)));
// console.log(ri(ir(1)));
// console.log(ri(ir(2)));
// console.log(ri(ir(3)));



