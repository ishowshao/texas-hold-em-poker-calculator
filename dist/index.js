/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// TODO 剩余两张可组牌型以及比率\nconst util = __webpack_require__(/*! ./src/js/util */ \"./src/js/util.js\");\nconst classifier = __webpack_require__(/*! ./src/js/classifier */ \"./src/js/classifier.js\");\nconst compare = __webpack_require__(/*! ./src/js/compare */ \"./src/js/compare.js\");\n\nconst hands = [null, null];\nconst boards = [null, null, null, null, null];\n\nconst header = new Vue({\n    el: '#header',\n    data: {\n        showMenu: false\n    },\n    methods: {\n        toggleMenu: function () {\n            this.showMenu = !this.showMenu\n        },\n        showApp: function (appName) {\n            app.currentApp = appName;\n            this.toggleMenu();\n        }\n    }\n});\n\nconst app = new Vue({\n    el: '#container',\n    data: {\n        currentApp: 'after-flop',\n        selectActive: false,\n        hands: ['?', '?'],\n        boards: ['?', '?', '?', '?', '?'],\n        selectCardText: ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'],\n        selectKindText: ['♠', '♥', '♣', '♦'],\n        currentSelection: {\n            card: '',\n            kind: ''\n        }\n    },\n    methods: {\n        showSelect: function (index, type) {\n            console.log('call', index, type);\n            this.selectActive = true;\n        },\n        selectCard: function (card) {\n            this.currentSelection.card = card;\n        },\n        selectKind: function (kind) {\n            this.currentSelection.kind = kind;\n        }\n    }\n});\n\n//# sourceURL=webpack:///./index.js?");

/***/ }),

/***/ "./src/js/classifier.js":
/*!******************************!*\
  !*** ./src/js/classifier.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * helper to check straight type\n * 0 - not straight\n * n - normal straight\n * 13 - top straight AKQJT\n *\n * @param {Array} cards 去除重复且排好序的数组\n * @returns {number}\n */\nlet checkStraight = cards => {\n    let straight = 0;\n    switch (cards.length) {\n        case 5:\n            straight = (cards[4] - cards[0] === 4 ? cards[4] : 0);\n            break;\n        case 6:\n            straight = (cards[5] - cards[1] === 4 ? cards[5] : 0)\n                || (cards[4] - cards[0] === 4 ? cards[4] : 0);\n            break;\n        case 7:\n            straight = (cards[6] - cards[2] === 4 ? cards[6] : 0)\n                || (cards[5] - cards[1] === 4 ? cards[5] : 0)\n                || (cards[4] - cards[0] === 4 ? cards[4] : 0);\n            break;\n    }\n\n    let l = cards.length;\n    if (l > 4 && cards[0] === 0\n        && cards[l - 1] === 12\n        && cards[l - 2] === 11\n        && cards[l - 3] === 10\n        && cards[l - 4] === 9) {\n        straight = 13;\n    }\n\n    return straight;\n};\n\n/**\n * 化简金刚\n *\n * @param {Array} kind 分类器生成的记录每种牌数量的数组\n * @returns {number[]}\n */\nlet reduceFourOfAKind = kind => {\n    let reduce = [0, 0];\n\n    for (let i = 0; i < 13; i++) {\n        if (kind[i] === 4) {\n            // 找到有4张的牌,只可能有一种成4张\n            reduce[0] = (i === 0 ? 13 : i); // 如果是A,处理成13,方便之后比较大小\n        } else if (kind[i] > 0) {\n            // 如果不是4张的,记录最大的kicker\n            let rank = (i === 0 ? 13 : i);\n            reduce[1] = (rank > reduce[1] ? rank : reduce[1]);\n        }\n    }\n    return reduce;\n};\n\n/**\n * 化简葫芦\n *\n * @param {Array} kind 分类器生成的记录每种牌数量的数组\n * @returns {number[]}\n */\nlet reduceFullHouse = kind => {\n    let triplet = [];\n    let pair = [];\n\n    // full house 有几种特殊情况\n    // 5556667, 5556677 5556689\n    for (let i = 0; i < 13; i++) {\n        let count = kind[i];\n        let rank = (i === 0 ? 13 : i);\n        if (count === 3) {\n            triplet.push(rank);\n        }\n        if (count === 2) {\n            pair.push(rank);\n        }\n    }\n\n    if (triplet.length > 1) {\n        return triplet.sort((a, b) => a < b);\n    } else {\n        return [triplet[0], Math.max(...pair)];\n    }\n};\n\n/**\n * 化简两对\n *\n * @param {Array} kind 分类器生成的记录每种牌数量的数组\n * @returns {Array}\n */\nlet reduceTwoPair = kind => {\n    let reduce = [];\n\n    let pair = [];\n    let single = [];\n    // two pair: 1122334, 1122345\n\n    for (let i = 0; i < 13; i++) {\n        let count = kind[i];\n        let rank = (i === 0 ? 13 : i);\n        if (count === 2) {\n            pair.push(rank);\n        }\n        if (count === 1) {\n            single.push(rank);\n        }\n    }\n    pair.sort((a, b) => a < b);\n    single.sort((a, b) => a < b);\n    reduce[0] = pair[0];\n    reduce[1] = pair[1];\n    reduce[2] = pair.length > 2\n        ? (pair[pair.length - 1] > single[0] ? pair[pair.length - 1] : single[0])\n        : single[0];\n\n    return reduce;\n};\n\n/**\n * 化简三条\n * three of a kind : 111357\n *\n * @param {Array} kind\n * @returns {number[]}\n */\nlet reduceThreeOfAKind = kind => {\n    let triplet = 0;\n    let single = [];\n\n    for (let i = 0; i < 13; i++) {\n        let count = kind[i];\n        let rank = (i === 0 ? 13 : i);\n        if (count === 3) {\n            triplet = rank;\n        }\n        if (count === 1) {\n            single.push(rank);\n        }\n    }\n    single.sort((a, b) => a < b);\n\n    return [triplet, single[0], single[1]];\n};\n\n/**\n * 化简对子\n * one pair : 112468T\n *\n * @param {Array} kind\n * @returns {number[]}\n */\nlet reduceOnePair = kind => {\n    let pair = 0;\n    let single = [];\n\n    for (let i = 0; i < 13; i++) {\n        let count = kind[i];\n        let rank = (i === 0 ? 13 : i);\n        if (count === 2) {\n            pair = rank;\n        }\n        if (count === 1) {\n            single.push(rank);\n        }\n    }\n    single.sort((a, b) => a < b);\n\n    return [pair, single[0], single[1], single[2]];\n};\n\nclass Classifier {\n    constructor(cards) {\n        this.cards = cards;\n        this.state = {\n            cards: [],\n            kind: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],\n            suit: [[], [], [], []],\n            straight: new Set(),\n        };\n        this.prepared = false;\n    }\n\n    prepare() {\n        if (!this.prepared) {\n            let cards = this.cards;\n            let state = this.state;\n            for (let i = 0, l = cards.length; i < l; i++) {\n                let card = cards[i];\n                let suit = Math.floor(card / 13);\n                let rank = card % 13;\n                state.cards.push(card);\n                state.kind[rank]++;\n                state.suit[suit].push(rank);\n                state.straight.add(rank); // use to check straight\n            }\n            this.prepared = true;\n        }\n    }\n\n    classify() {\n        this.prepare();\n        let pattern = '';\n        let reduce = [];\n        let state = this.state;\n        if (state.cards.length >= 5) {\n\n            // check flush first\n            // find if some suit has 5 cards\n            let flush = state.suit.filter(c => c.length > 4);\n\n            if (flush.length > 0) {\n                // if flush, only can be RoyalStraightFlush,StraightFlush,Flush\n                // 如果是同花,只能是同花、同花顺、皇家同花顺三种,其他要么冲突要么比同花小\n                // reduce: Flush & StraightFlush always compare biggest rank card, RoyalStraightFlush all same rank\n                let straight = checkStraight(flush[0].sort((a, b) => a > b));\n                if (straight === 13) {\n                    pattern = 'RoyalStraightFlush';\n                    reduce = [13];\n                } else if (straight) {\n                    pattern = 'StraightFlush';\n                    reduce = [straight];\n                } else {\n                    pattern = 'Flush';\n                    // reduce = (flush[0].indexOf(0) !== -1 ? [13] : [Math.max(...flush[0])]);\n                    reduce = flush[0].map(i => i === 0 ? 13 : i).sort((a, b) => a < b).slice(0, 5); // fix bug 同花要选前5大\n                }\n            } else {\n\n                // 去除重复从小到大排序的array\n                let straightArray = Array.from(state.straight).sort((a, b) => a > b);\n\n                let straight = checkStraight(straightArray);\n\n                if (straight) {\n                    // 顺子的情况有可能同时也是三条、两对、一对,但是都没顺子大\n                    pattern = 'Straight';\n                    reduce = [straight];\n                } else {\n                    let k4 = 0;\n                    let k3 = 0;\n                    let k2 = 0;\n                    for (let i = 0, kind = state.kind; i < 13; i++) {\n                        let count = kind[i];\n                        if (count === 4) {\n                            k4++;\n                        } else if (count === 3) {\n                            k3++;\n                        } else if (count === 2) {\n                            k2++;\n                        }\n                    }\n\n                    if (k4) {\n                        pattern = 'FourOfAKind';\n                        reduce = reduceFourOfAKind(state.kind);\n                    } else if (k3) {\n                        if (k3 > 1 || k2 > 0) {\n                            pattern = 'FullHouse';\n                            reduce = reduceFullHouse(state.kind);\n                        } else {\n                            pattern = 'ThreeOfAKind';\n                            reduce = reduceThreeOfAKind(state.kind);\n                        }\n                    } else if (k2 >= 2) {\n                        pattern = 'TwoPair';\n                        reduce = reduceTwoPair(state.kind);\n                    } else if (k2 === 1) {\n                        pattern = 'OnePair';\n                        reduce = reduceOnePair(state.kind);\n                    } else {\n                        pattern = 'HighCard';\n                        let l = straightArray.length;\n                        if (straightArray[0] === 0) {\n                            reduce = [13, straightArray[l - 1], straightArray[l - 2], straightArray[l - 3], straightArray[l - 4]];\n                        } else {\n                            reduce = [straightArray[l - 1], straightArray[l - 2], straightArray[l - 3], straightArray[l - 4], straightArray[l - 5]];\n                        }\n                    }\n                }\n            }\n        }\n        return {pattern, reduce};\n    }\n}\n\nmodule.exports = Classifier;\n\n//# sourceURL=webpack:///./src/js/classifier.js?");

/***/ }),

/***/ "./src/js/compare.js":
/*!***************************!*\
  !*** ./src/js/compare.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * 牌型等级\n */\nconst RANK = {\n    'RoyalStraightFlush': 9,\n    'StraightFlush': 8,\n    'FourOfAKind': 7,\n    'FullHouse': 6,\n    'Flush': 5,\n    'Straight': 4,\n    'ThreeOfAKind': 3,\n    'TwoPair': 2,\n    'OnePair': 1,\n    'HighCard': 0\n};\n\n/**\n * 比较两个reduce的大小\n * reduce1 == reduce2 返回 0\n * reduce1 > reduce2 返回 大于0的值\n * reduce1 < reduce2 返回 小于0的值\n *\n * @param {Array} reduce1\n * @param {Array} reduce2\n * @returns {number}\n */\nconst compareReduce = (reduce1, reduce2) => {\n    let result = 0;\n    let length = reduce1.length;\n    for (let i = 0; i < length; i++) {\n        result = reduce1[i] - reduce2[i];\n        if (result !== 0) {\n            break;\n        }\n    }\n    return result;\n};\n\n/**\n * 建立在分类器的pattern和reduce基础上,进行牌面大小比较\n * value 是 {pattern, reduce} 这即可表示一个牌面的绝对价值大小\n * value1 == value2 返回 0\n * value1 > value2 返回 大于0的值\n * value1 < value2 返回 小于0的值\n * pattern 大小通过rank计算\n * reduce 是一个数组, 牌型的需比较值的最简化,例如:\n *     金刚牌: [2, 3] 表示4张相同的牌是2 剩下一张是3\n *     葫芦: [2, 3] 表示3张相同的是2 一对是3\n *     顺子: [9] 表示顺子大头是9 顺子只需要比较最大的那个牌\n *     高牌: [9, 7, 5, 3, 2] 高牌需要依次比较每个牌\n *\n * @param {Object} value1\n * @param {Object} value2\n * @returns {number}\n */\nconst compare = (value1, value2) => {\n    const p1 = RANK[value1.pattern];\n    const p2 = RANK[value2.pattern];\n\n    if (p1 === p2) {\n        return compareReduce(value1.reduce, value2.reduce);\n    } else {\n        return p1 - p2;\n    }\n};\n\nmodule.exports = compare;\n\n//# sourceURL=webpack:///./src/js/compare.js?");

/***/ }),

/***/ "./src/js/util.js":
/*!************************!*\
  !*** ./src/js/util.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const CARDS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];\nconst SUITS = ['♠', '♥', '♣', '♦'];\n\n/**\n * ID 转换为 可读字符\n *\n * @param {number} id 牌ID 0-51\n * @returns {string}\n */\nconst ir = function (id) {\n    return SUITS[Math.floor(id / 13)] + CARDS[id % 13];\n};\n\n/**\n * 可读字符转换到ID\n *\n * @param {string} str 字符\n * @returns {number}\n */\nconst ri = function (str) {\n    return SUITS.indexOf(str.charAt(0)) * 13 + CARDS.indexOf(str.charAt(1));\n};\n\nconst shuffle = a => {\n    let j;\n    let x;\n    for (let i = a.length; i; i--) {\n        j = Math.floor(Math.random() * i);\n        x = a[i - 1];\n        a[i - 1] = a[j];\n        a[j] = x;\n    }\n};\n\n/**\n * 随机生成指定个数的牌\n *\n * @param {number} count 生成个数\n * @returns {Array}\n */\nconst generate = count => {\n    let cards = new Set();\n    while (true) {\n        cards.add(Math.floor(Math.random() * 52));\n        if (cards.size === count) {\n            break;\n        }\n    }\n    return Array.from(cards);\n};\n\n/**\n * 对牌数组转换可读\n *\n * @param {Array} cards\n * @returns {Array}\n */\nconst air = cards => {\n    return cards.map(card => ir(card));\n};\n\n/**\n * 牌的可读数组转换为ID数组\n *\n * @param {Array} cards 可读数组\n * @returns {Array}\n */\nconst ari = cards => {\n    return cards.map(card => ri(card));\n};\n\n\n/**\n * 获取剩余牌\n *\n * @param {Array} knownCards 已知牌\n * @returns {Array}\n */\nconst getRestCards = knownCards => {\n    let cards = [];\n    for (let i = 0; i < 52; i++) {\n        if (knownCards.indexOf(i) === -1) {\n            cards.push(i);\n        }\n    }\n    return cards;\n};\n\n/**\n * 在给定牌中选择两张的所有组合\n *\n * @param {Array} cards 给定牌\n * @param {Function} callback 对每个组合执行此回调\n */\nconst combine2 = (cards, callback) => {\n    let combine = [0, 0];\n    let length = cards.length;\n    for (let i = 0; i < length; i++) {\n        combine[0] = cards[i];\n        for (let j = 0; j < length; j++) {\n            if (j > i) {\n                combine[1] = cards[j];\n                callback(combine);\n            }\n        }\n    }\n};\n\nconst isPocketPair = (cardA, cardB) => {\n    return cardA % 13 === cardB % 13;\n};\n\nconst isPocketAK = (cardA, cardB) => {\n    let hasA = (cardA % 13 === 0) || (cardB % 13 === 0);\n    let hasK = (cardA % 13 === 12) || (cardB % 13 === 12);\n    return hasA && hasK;\n};\n\nmodule.exports = {ir, ri, shuffle, generate, air, ari, getRestCards, combine2, isPocketPair, isPocketAK};\n\n\n//# sourceURL=webpack:///./src/js/util.js?");

/***/ })

/******/ });