let classifier = require('./classifier');
let util = require('./util');

console.time('speed');
for (let i = 0; i < 170000; i++) {
    let cards = util.generate(7);
// console.log(util.air(cards));
    cards.forEach(card => classifier.push(card));
    classifier.reset();
// console.log(classifier.pattern);
}
console.timeEnd('speed');
