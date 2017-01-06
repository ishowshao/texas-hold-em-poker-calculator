let test = new Map();

let hand = [ '♦4', '♠2' ];
let hand2 = [ '♦4', '♠2' ];
test.set(hand.toString(), 0);

if (test.has([ '♦4', '♠2' ].toString())) {
    console.log('has');
}