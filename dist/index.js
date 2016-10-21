/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// TODO 剩余两张可组牌型以及比率
	const util = __webpack_require__(1);
	const classifier = __webpack_require__(2);
	const compare = __webpack_require__(3);

	const holeCards = [null, null];
	const communityCards = [null, null, null, null, null];


/***/ },
/* 1 */
/***/ function(module, exports) {

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

	/**
	 * 牌的可读数组转换为ID数组
	 *
	 * @param {Array} cards 可读数组
	 * @returns {Array}
	 */
	const ari = cards => {
	    return cards.map(card => ri(card));
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

	/**
	 * 在给定牌中选择两张的所有组合
	 *
	 * @param {Array} cards 给定牌
	 * @param {Function} callback 对每个组合执行此回调
	 */
	const combine2 = (cards, callback) => {
	    let combine = [0, 0];
	    let length = cards.length;
	    for (let i = 0; i < length; i++) {
	        combine[0] = cards[i];
	        for (let j = 0; j < length; j++) {
	            if (j > i) {
	                combine[1] = cards[j];
	                callback(combine);
	            }
	        }
	    }
	};

	module.exports = {ir, ri, shuffle, generate, air, ari, getRestCards, combine2};


/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * helper to check straight type
	 * 0 - not straight
	 * n - normal straight
	 * 13 - top straight AKQJT
	 *
	 * @param {Array} cards 去除重复且排好序的数组
	 * @returns {number}
	 */
	let checkStraight = cards => {
	    let straight = 0;
	    switch (cards.length) {
	        case 5:
	            straight = (cards[4] - cards[0] === 4 ? cards[4] : 0);
	            break;
	        case 6:
	            straight = (cards[4] - cards[0] === 4 ? cards[4] : 0)
	                || (cards[5] - cards[1] === 4 ? cards[5] : 0);
	            break;
	        case 7:
	            straight = (cards[4] - cards[0] === 4 ? cards[4] : 0)
	                || (cards[5] - cards[1] === 4 ? cards[5] : 0)
	                || (cards[6] - cards[2] === 4 ? cards[6] : 0);
	            break;
	    }

	    let l = cards.length;
	    if (l > 4 && cards[0] === 0
	        && cards[l - 1] === 12
	        && cards[l - 2] === 11
	        && cards[l - 3] === 10
	        && cards[l - 4] === 9) {
	        straight = 13;
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
	                if (straight === 13) {
	                    pattern = 'RoyalStraightFlush';
	                    reduce = [13];
	                } else if (straight) {
	                    pattern = 'StraightFlush';
	                    reduce = [straight];
	                } else {
	                    pattern = 'Flush';
	                    reduce = (flush[0].indexOf(0) !== -1 ? [13] : [Math.max(...flush[0])]);
	                }
	            } else {

	                // 去除重复从小到大排序的array
	                let straightArray = Array.from(state.straight).sort((a, b) => a > b);

	                let straight = checkStraight(straightArray);

	                if (straight) {
	                    // 顺子的情况有可能同时也是三条、两对、一对,但是都没顺子大
	                    pattern = 'Straight';
	                    reduce = [straight];
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

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * 牌型等级
	 */
	const RANK = {
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
	 * 比较两个reduce的大小
	 * reduce1 == reduce2 返回 0
	 * reduce1 > reduce2 返回 大于0的值
	 * reduce1 < reduce2 返回 小于0的值
	 *
	 * @param {Array} reduce1
	 * @param {Array} reduce2
	 * @returns {number}
	 */
	const compareReduce = (reduce1, reduce2) => {
	    let result = 0;
	    let length = reduce1.length;
	    for (let i = 0; i < length; i++) {
	        result = reduce1[i] - reduce2[i];
	        if (result !== 0) {
	            break;
	        }
	    }
	    return result;
	};

	/**
	 * 建立在分类器的pattern和reduce基础上,进行牌面大小比较
	 * value 是 {pattern, reduce} 这即可表示一个牌面的绝对价值大小
	 * value1 == value2 返回 0
	 * value1 > value2 返回 大于0的值
	 * value1 < value2 返回 小于0的值
	 * pattern 大小通过rank计算
	 * reduce 是一个数组, 牌型的需比较值的最简化,例如:
	 *     金刚牌: [2, 3] 表示4张相同的牌是2 剩下一张是3
	 *     葫芦: [2, 3] 表示3张相同的是2 一对是3
	 *     顺子: [9] 表示顺子大头是9 顺子只需要比较最大的那个牌
	 *     高牌: [9, 7, 5, 3, 2] 高牌需要依次比较每个牌
	 *
	 * @param {Object} value1
	 * @param {Object} value2
	 * @returns {number}
	 */
	const compare = (value1, value2) => {
	    const p1 = RANK[value1.pattern];
	    const p2 = RANK[value2.pattern];

	    if (p1 === p2) {
	        return compareReduce(value1.reduce, value2.reduce);
	    } else {
	        return p1 - p2;
	    }
	};

	module.exports = compare;

/***/ }
/******/ ]);