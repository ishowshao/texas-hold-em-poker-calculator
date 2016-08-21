console.time('speed');
let classifier = require('./classifier');
let util = require('./util');

let me = [0, 1];
let common = [2, 3, 4];
let known = me.concat(common);
let cards = [];
for (let i = 0; i < 52; i++) {
    if (known.indexOf(i) === -1) {
        cards.push(i);
    }
}

let count = 0;

// 已知手牌和公共三张之后,在剩余47张选4张组合一共178365种,代表对手的全部可能性
// 绝对牌力计算 178365 的意思代表对手的全部可能性
// 这好像没啥意义

// 47选2 1081 代表对手当前的全部可能性

let choose = [0, 0, 0, 0];
let length = cards.length;
for (let i = 0; i < length; i++) {
    choose[0] = i;
    for (let j = 0; j < length; j++) {
        if (j > i) {
            choose[1] = j;
            for (let k = 0; k < length; k++) {
                if (k > j) {
                    choose[2] = k;
                    for (let m = 0; m < length; m++) {
                        if (m > k) {
                            choose[3] = m;
                            count++;

                            let test = common.concat(choose);
                            test.forEach(card => classifier.push(card));
                            classifier.reset();

                        }
                    }
                }
            }
        }
    }
}

// 当前牌力计算

console.timeEnd('speed');
console.log(cards.length, count);
