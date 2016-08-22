const CARDS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
const SUITS = ['♠', '♥', '♣', '♦'];
const LEVEL = {
    'RoyalStraightFlush': 9,
    'StraightFlush': 8,
    'FourOfAKind': 7,
    'FullHouse': 6,
    'Flush': 5,
    'Straight': 4,
    'ThreeOfAKind': 3,
    'TwoPair': 2,
    'OnePair': 1,
    'HighCard': 0
};

/**
 * ID 转换为 可读字符
 *
 * @param {number} id 牌ID 0-51
 * @returns {string}
 */
const ir = function (id) {
    return SUITS[Math.floor(id / 13)] + CARDS[id % 13];
};

/**
 * 可读字符转换到ID
 *
 * @param {string} str 字符
 * @returns {number}
 */
const ri = function (str) {
    return SUITS.indexOf(str.charAt(0)) * 13 + CARDS.indexOf(str.charAt(1));
};

const shuffle = a => {
    let j;
    let x;
    for (let i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
};

/**
 * 随机生成指定个数的牌
 *
 * @param {number} count 生成个数
 * @returns {Array}
 */
const generate = count => {
    let cards = new Set();
    while (true) {
        cards.add(Math.floor(Math.random() * 52));
        if (cards.size === count) {
            break;
        }
    }
    return Array.from(cards);
};

/**
 * 对牌数组转换可读
 *
 * @param {Array} cards
 * @returns {Array}
 */
const air = cards => {
    return cards.map(card => ir(card));
};

const reduce = cards => {
    switch (cards) {
        case 'RoyalStraightFlush':
            break;
        case 'StraightFlush':
            break;
        case 'FourOfAKind':
            break;
        case 'FullHouse':
            break;
        case 'Straight':
            break;
        case 'ThreeOfAKind':
            break;
        case 'TwoPair':
            break;
        case 'OnePair':
            break;
        case 'HighCard':
            break;
    }
};

/**
 * 获取剩余牌
 *
 * @param {Array} knownCards 已知牌
 * @returns {Array}
 */
const getRestCards = knownCards => {
    let cards = [];
    for (let i = 0; i < 52; i++) {
        if (knownCards.indexOf(i) === -1) {
            cards.push(i);
        }
    }
    return cards;
};

module.exports = {ir, ri, shuffle, generate, air};
