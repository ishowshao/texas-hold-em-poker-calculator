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

	let util = __webpack_require__(1);

	var me = [null, null];
	var common = [null, null, null, null, null];
	var known = {
	    me: me,
	    common: common
	};
	jQuery(function () {
	    var selectedKind = '';
	    var selectKinds = jQuery('#card-select-kind').find('> div');
	    selectKinds.click(function () {
	        selectKinds.removeClass('selected');
	        $(this).addClass('selected');
	        selectedKind = $(this).html();
	        console.log(selectedKind);
	    });
	    var selectedSuit = '';
	    var selectSuit = jQuery('#card-select-suit').find('> div');
	    selectSuit.click(function () {
	        selectSuit.removeClass('selected');
	        $(this).addClass('selected');
	        selectedSuit = $(this).html();
	        console.log(selectedSuit);
	    });

	    var currentCard = null;
	    jQuery('.card').click(function (e) {
	        currentCard = $(this);
	        $('#card-select').show().offset({left: e.clientX, top: e.clientY});
	        selectKinds.removeClass('selected');
	        selectSuit.removeClass('selected');

	    });

	    jQuery('#card-select-ok').find('.ok').click(function () {
	        $('#card-select').hide();
	        if (selectedKind && selectedSuit) {
	            currentCard.html(selectedSuit + selectedKind);
	            var type = currentCard.data('type');
	            var index = currentCard.data('index');
	            known[type][Number(index)] = selectedSuit + selectedKind;
	            console.log(me, common);
	        }
	        currentCard = null;
	        selectedKind = '';
	        selectedSuit = '';
	    });
	    jQuery('#card-select-ok').find('.cancel').click(function () {
	        $('#card-select').hide();
	        currentCard = null;
	        selectedKind = '';
	        selectedSuit = '';
	    });
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);