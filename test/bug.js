const util = require('../src/js/util');
const Classifier = require('../src/js/classifier');

let common = [ '♥4', '♣6', '♦5', '♣7', '♣8' ];

let hand = [ '♦3', '♦K' ];

let c = new Classifier(util.ari(hand.concat(common)));
let result = c.classify();
console.log(result.pattern, result.reduce);
