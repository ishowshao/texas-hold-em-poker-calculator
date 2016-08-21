let straightHelper = cards => {
    let straight = false;
    cards = Array.from(cards).sort((a, b) => a > b); // 去重 排序
    // cards = [5, 2, 1, 4, 3, 0, 6].sort((a, b) => a > b); // 去重 排序
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

    if (cards.length > 4 && cards[0] === 0
        && cards.pop() === 12
        && cards.pop() === 11
        && cards.pop() === 10
        && cards.pop() === 9) {
        straight = 2;
    }
    return straight;
};

module.exports = {
    pattern: '',
    reduce: null,
    state: {
        cards: [],
        kind: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        suit: [0, 0, 0, 0],
        suitTable: [[], [], [], []],
        straight: new Set(),
    },
    reset: function () {
        this.state = {
            category: '',
            cards: [],
            kind: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            suit: [0, 0, 0, 0],
            suitTable: [[], [], [], []],
            straight: new Set(),
        };
    },
    push: function (card) {
        let state = this.state;
        let pattern = this.pattern;
        let reduce = this.reduce;
        if (state.cards.length > 7) {
            return;
        }

        let suit = Math.floor(card / 13);
        let number = card % 13;
        state.cards.push(card);
        state.kind[number]++;
        state.suit[suit]++;
        state.suitTable[suit].push(number);
        state.straight.add(number);

        if (state.cards.length >= 5) {
            pattern = 'HighCard';

            // 判定牌型的顺子分类 0 不是顺子 1 普通顺子 2 TJQKA
            let straight = straightHelper(state.straight);

            if (state.suit.some(c => c > 4)) {
                pattern = 'Flush';
                if (straight === 2) {
                    pattern = 'RoyalStraightFlush';
                } else if (straight) {
                    pattern = 'StraightFlush';
                }
                // reduce
                for (let i = 0, suitTable = state.suitTable; i < 4; i++) {
                    if (suitTable[i].length > 4) {
                        reduce = Math.max(...suitTable[i]);
                        break;
                    }
                }
            } else {
                if (straight) {
                    pattern = 'Straight';
                } else {
                    let k4 = 0;
                    let k3 = 0;
                    let k2 = 0;
                    for (let i = 0, kind = state.kind; i < 13; i++) {
                        let c = kind[i];
                        if (c === 4) {
                            k4++;
                        } else if (c === 3) {
                            k3++;
                        } else if (c === 2) {
                            k2++;
                        }
                    }

                    if (k4) {
                        pattern = 'FourOfAKind';
                    } else if (k3) {
                        pattern = 'ThreeOfAKind';
                        if (k3 > 1 || k2 > 1) {
                            pattern = 'FullHouse';
                        }
                    } else if (k2 >= 2) {
                        pattern = 'TwoPair';
                    } else if (k2 === 1) {
                        pattern = 'OnePair';
                    }
                }
            }
        }
        this.pattern = pattern;
    }
};