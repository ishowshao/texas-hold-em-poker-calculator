const util = require('../src/js/util');
const Classifier = require('../src/js/classifier');

// let common = [ '♥4', '♣6', '♦5', '♣7', '♣8' ];
// let common = [ '♦9', '♣K', '♥A', '♣4', '♠A' ];
// let common = [ '♣A', '♣5', '♣K', '♥K', '♣T' ];
let common = [ '♣7', '♥4', '♥7', '♠5', '♥5' ];

// let hand = [ '♦3', '♦K' ];
// let hand = [ '♥6', '♠7' ];
// let hand = [ '♣3', '♣8' ];
let hand = [ '♦4', '♠2' ];

let c = new Classifier(util.ari(hand.concat(common)));
let result = c.classify();
console.log(result.pattern, result.reduce);

