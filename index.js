// TODO 剩余两张可组牌型以及比率
const util = require('./src/js/util');
const classifier = require('./src/js/classifier');
const compare = require('./src/js/compare');

const hands = [null, null];
const boards = [null, null, null, null, null];

const header = new Vue({
    el: '#header',
    data: {
        showMenu: false
    },
    methods: {
        toggleMenu: function () {
            this.showMenu = !this.showMenu
        },
        showApp: function (appName) {
            app.currentApp = appName;
            this.toggleMenu();
        }
    }
});

const app = new Vue({
    el: '#container',
    data: {
        currentApp: 'after-flop',
        selectActive: false,
        hands: ['?', '?'],
        boards: ['?', '?', '?', '?', '?'],
        selectCardText: ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'],
        selectKindText: ['♠', '♥', '♣', '♦'],
        currentSelection: {
            card: '',
            kind: ''
        }
    },
    methods: {
        showSelect: function (index, type) {
            console.log('call', index, type);
            this.selectActive = true;
        },
        selectCard: function (card) {
            this.currentSelection.card = card;
        },
        selectKind: function (kind) {
            this.currentSelection.kind = kind;
        }
    }
});