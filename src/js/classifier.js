/**
 * helper to check straight type
 * 0 - not straight
 * 1 - normal straight
 * 2 - top straight AKQJT
 *
 * @param {Array} cards 去除重复且排好序的数组
 * @returns {number}
 */
let checkStraight = cards => {
    let straight = 0;
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

    let l = cards.length;
    if (l > 4 && cards[0] === 0
        && cards[l - 1] === 12
        && cards[l - 2] === 11
        && cards[l - 3] === 10
        && cards[l - 4] === 9) {
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
        } else if (kind[i] > 0) {
            // 如果不是4张的,记录最大的kicker
            let rank = (i === 0 ? 13 : i);
            reduce[1] = (rank > reduce[1] ? rank : reduce[1]);
        }
    }
    return reduce;
};

/**
 * 化简葫芦
 *
 * @param {Array} kind 分类器生成的记录每种牌数量的数组
 * @returns {number[]}
 */
let reduceFullHouse = kind => {
    let triplet = [];
    let pair = [];

    // full house 有几种特殊情况
    // 5556667, 5556677 5556689
    for (let i = 0; i < 13; i++) {
        let count = kind[i];
        let rank = (i === 0 ? 13 : i);
        if (count === 3) {
            triplet.push(rank);
        }
        if (count === 2) {
            pair.push(rank);
        }
    }

    if (triplet.length > 1) {
        return triplet.sort((a, b) => a < b);
    } else {
        return [triplet[0], Math.max(...pair)];
    }
};

/**
 * 化简两对
 *
 * @param {Array} kind 分类器生成的记录每种牌数量的数组
 * @returns {Array}
 */
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
        suit: [[], [], [], []],
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
            suit: [[], [], [], []],
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
        state.suit[suit].push(rank);
        state.straight.add(rank); // use to check straight

        if (state.cards.length >= 5) {

            // check flush first
            // find if some suit has 5 cards
            let flush = state.suit.filter(c => c.length > 4);

            if (flush.length > 0) {
                // if flush, only can be RoyalStraightFlush,StraightFlush,Flush
                // 如果是同花,只能是同花、同花顺、皇家同花顺三种,其他要么冲突要么比同花小
                // reduce: Flush & StraightFlush always compare biggest rank card, RoyalStraightFlush all same rank
                let straight = checkStraight(flush[0].sort((a, b) => a > b));
                if (straight === 2) {
                    pattern = 'RoyalStraightFlush';
                    reduce = [13];
                } else if (straight) {
                    pattern = 'StraightFlush';
                    console.log(flush);
                    reduce = [Math.max(...flush[0])];
                } else {
                    pattern = 'Flush';
                    console.log(flush);
                    reduce = (flush[0].indexOf(0) !== -1 ? [13] : [Math.max(...flush[0])]);
                }
            } else {

                // 去除重复从小到大排序的array
                let straightArray = Array.from(state.straight).sort((a, b) => a > b);

                let straight = checkStraight(straightArray);

                if (straight) {
                    // 顺子的情况有可能同时也是三条、两对、一对,但是都没顺子大
                    pattern = 'Straight';
                    if (straight === 2) {
                        reduce = [13]; // 顶顺子最大的是A
                    } else {
                        reduce = [straightArray[straightArray.length - 1]];
                    }
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
                        let l = straightArray.length;
                        if (straightArray[0] === 0) {
                            reduce = [13, straightArray[l - 1], straightArray[l - 2], straightArray[l - 3], straightArray[l - 4]];
                        } else {
                            reduce = [straightArray[l - 1], straightArray[l - 2], straightArray[l - 3], straightArray[l - 4], straightArray[l - 5]];
                        }
                    }
                }
            }
        }
        this.value.pattern = pattern;
        this.value.reduce = reduce;
    }
};