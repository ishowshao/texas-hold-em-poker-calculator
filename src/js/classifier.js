/**
 * helper to check straight type
 * 0 - not straight
 * 1 - normal straight
 * 2 - top straight AKQJT
 *
 * @param {Set} cardSet
 * @returns {number}
 */
let checkStraight = cardSet => {
    let straight = 0;
    let cards = Array.from(cardSet).sort((a, b) => a > b); // 去重 排序
    switch (cards.length) {
        case 5:
            straight = (cards[4] - cards[0] === 4);
            break;
        case 6:
            straight = (cards[4] - cards[0] === 4) || (cards[5] - cards[1] === 4);
            break;
        case 7:
            straight = (cards[4] - cards[0] === 4) || (cards[5] - cards[1] === 4) || (cards[6] - cards[2] === 4);
            break;
    }

    straight = Number(straight);

    if (cards.length > 4 && cards[0] === 0
        && cards.pop() === 12
        && cards.pop() === 11
        && cards.pop() === 10
        && cards.pop() === 9) {
        straight = 2;
    }

    return straight;
};

/**
 * 化简金刚
 *
 * @param {Array} kind 分类器生成的记录每种牌数量的数组
 * @returns {number[]}
 */
let reduceFourOfAKind = kind => {
    let reduce = [0, 0];

    for (let i = 0; i < 13; i++) {
        if (kind[i] === 4) {
            // 找到有4张的牌,只可能有一种成4张
            reduce[0] = (i === 0 ? 13 : i); // 如果是A,处理成13,方便之后比较大小
        } else {
            // 如果不是4张的,记录最大的kicker
            let rank = (i === 0 ? 13 : i);
            reduce[1] = (rank > reduce[1] ? rank : reduce[1]);
        }
    }
    return reduce;
};

let reduceFullHouse = kind => {
    let reduce = [];

    // full house 有几种特殊情况
    // 5556667, 5556677
    for (let i = 0; i < 13; i++) {
        if (kind[i] === 3) {
            // 找到有3张的牌,可能有两种成3的,需要两种里面大的
            reduce.push(i === 0 ? 13 : i); // 如果是A,处理成13,方便之后比较大小
        }
    }
    if (reduce.length === 2) {
        // case 5556667 -> 66655
        if (reduce[0] < reduce[1]) {
            let tmp = reduce[0];
            reduce[0] = reduce[1];
            reduce[1] = tmp;
        }
    } else {
        // case 5556678 or 5556677
        let rank2 = [];
        for (let i = 0; i < 13; i++) {
            if (kind[i] === 2) {
                // find the bigger pair
                rank2.push(i === 0 ? 13 : i); // 如果是A,处理成13,方便之后比较大小
            }
        }
        if (rank2.length === 1) { // only one pair
            reduce.push(rank2[0]);
        } else { // two pair
            reduce.push(rank2[0] > rank2[1] ? rank2[0] : rank2[1]);
        }
    }
    return reduce;
};

let reduceTwoPair = kind => {
    let reduce = [];

    let pair = [];
    let single = [];
    // two pair: 1122334, 1122345

    for (let i = 0; i < 13; i++) {
        let count = kind[i];
        let rank = (i === 0 ? 13 : i);
        if (count === 2) {
            pair.push(rank);
        }
        if (count === 1) {
            single.push(rank);
        }
    }
    pair.sort((a, b) => a < b);
    single.sort((a, b) => a < b);
    reduce[0] = pair[0];
    reduce[1] = pair[1];
    reduce[2] = single[0];

    return reduce;
};

/**
 * 化简三条
 * three of a kind : 111357
 *
 * @param {Array} kind
 * @returns {number[]}
 */
let reduceThreeOfAKind = kind => {
    let triplet = 0;
    let single = [];

    for (let i = 0; i < 13; i++) {
        let count = kind[i];
        let rank = (i === 0 ? 13 : i);
        if (count === 3) {
            triplet = rank;
        }
        if (count === 1) {
            single.push(rank);
        }
    }
    single.sort((a, b) => a < b);

    return [triplet, single[0], single[1]];
};

/**
 * 化简对子
 * one pair : 112468T
 *
 * @param {Array} kind
 * @returns {number[]}
 */
let reduceOnePair = kind => {
    let pair = 0;
    let single = [];

    for (let i = 0; i < 13; i++) {
        let count = kind[i];
        let rank = (i === 0 ? 13 : i);
        if (count === 2) {
            pair = rank;
        }
        if (count === 1) {
            single.push(rank);
        }
    }
    single.sort((a, b) => a < b);

    return [pair, single[0], single[1], single[2]];
};

module.exports = {
    value: {
        pattern: '',
        reduce: []
    },
    state: {
        cards: [],
        kind: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        suit: [0, 0, 0, 0],
        suitTable: [[], [], [], []],
        straight: new Set(),
    },
    reset: function () {
        this.value = {
            pattern: '',
            reduce: []
        };
        this.state = {
            cards: [],
            kind: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            suit: [0, 0, 0, 0],
            suitTable: [[], [], [], []],
            straight: new Set(),
        };
    },
    push: function (card) {
        // todo reduce
        let state = this.state;
        let pattern = '';
        let reduce = [];
        if (state.cards.length > 7) {
            return;
        }

        let suit = Math.floor(card / 13);
        let rank = card % 13;
        state.cards.push(card);
        state.kind[rank]++;
        state.suit[suit]++;
        state.suitTable[suit].push(rank);
        state.straight.add(rank); // use to check straight

        if (state.cards.length >= 5) {
            // 判定牌型的顺子分类 0 不是顺子 1 普通顺子 2 TJQKA
            let straight = checkStraight(state.straight);

            if (state.suit.some(c => c > 4)) {
                pattern = 'Flush';
                if (straight === 2) {
                    pattern = 'RoyalStraightFlush';
                } else if (straight) {
                    pattern = 'StraightFlush';
                }
                // reduce: Flush & StraightFlush always compare biggest rank card, RoyalStraightFlush all same rank
                for (let i = 0, suitTable = state.suitTable; i < 4; i++) {
                    if (suitTable[i].length > 4) {
                        reduce = [Math.max(...suitTable[i])];
                        break;
                    }
                }
            } else {

                const array = Array.from(state.straight).map(a => a === 1 ? 13 : a).sort((a, b) => a < b);

                if (straight) {
                    pattern = 'Straight';
                    reduce = [array[0]];
                } else {
                    let k4 = 0;
                    let k3 = 0;
                    let k2 = 0;
                    for (let i = 0, kind = state.kind; i < 13; i++) {
                        let count = kind[i];
                        if (count === 4) {
                            k4++;
                        } else if (count === 3) {
                            k3++;
                        } else if (count === 2) {
                            k2++;
                        }
                    }

                    if (k4) {
                        pattern = 'FourOfAKind';
                        reduce = reduceFourOfAKind(state.kind);
                    } else if (k3) {
                        if (k3 > 1 || k2 > 0) {
                            pattern = 'FullHouse';
                            reduce = reduceFullHouse(state.kind);
                        } else {
                            pattern = 'ThreeOfAKind';
                            reduce = reduceThreeOfAKind(state.kind);
                        }
                    } else if (k2 >= 2) {
                        pattern = 'TwoPair';
                        reduce = reduceTwoPair(state.kind);
                    } else if (k2 === 1) {
                        pattern = 'OnePair';
                        reduce = reduceOnePair(state.kind);
                    } else {
                        pattern = 'HighCard';
                        reduce = array.slice(0, 4);
                    }
                }
            }
        }
        this.value.pattern = pattern;
        this.value.reduce = reduce;
    }
};