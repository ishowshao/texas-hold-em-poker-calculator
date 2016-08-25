let $ = require('./src/js/jquery-3.1.0.min');
let util = require('./src/js/util');
let classifier = require('./src/js/classifier');
let compare = require('./src/js/compare');

let holeCards = [null, null];
let communityCards = [null, null, null, null, null];
let known = {
    hole: holeCards,
    community: communityCards
};
let selectedKind = '';
let selectKinds = $('#card-select-kind').find('> div');
selectKinds.click(function () {
    selectKinds.removeClass('selected');
    $(this).addClass('selected');
    selectedKind = $(this).html();
    console.log(selectedKind);
});
let selectedSuit = '';
let selectSuit = $('#card-select-suit').find('> div');
selectSuit.click(function () {
    selectSuit.removeClass('selected');
    $(this).addClass('selected');
    selectedSuit = $(this).html();
    console.log(selectedSuit);
});

let currentCard = null;
$('.card').click(function (e) {
    currentCard = $(this);
    $('#card-select').show().offset({left: e.clientX, top: e.clientY});
    selectKinds.removeClass('selected');
    selectSuit.removeClass('selected');

});

$('#card-select-ok').find('.ok').click(function () {
    $('#card-select').hide();
    if (selectedKind && selectedSuit) {
        currentCard.html(selectedSuit + selectedKind);
        let type = currentCard.data('type');
        let index = currentCard.data('index');
        known[type][Number(index)] = selectedSuit + (selectedKind === '10' ? 'T' : selectedKind);
        console.log(holeCards, communityCards);
    }
    currentCard = null;
    selectedKind = '';
    selectedSuit = '';
});
$('#card-select-ok').find('.cancel').click(function () {
    $('#card-select').hide();
    currentCard = null;
    selectedKind = '';
    selectedSuit = '';
});
$('#card-select-ok').find('.delete').click(function () {
    $('#card-select').hide();
    currentCard.html('?');
    let type = currentCard.data('type');
    let index = currentCard.data('index');
    known[type][Number(index)] = null;
    console.log(holeCards, communityCards);
    currentCard = null;
    selectedKind = '';
    selectedSuit = '';
});

$('#calculate').click(function () {
    // 先判定能不能计算
    let community = known.community.filter(i => i);
    let hole = known.hole.filter(i => i);
    if (hole.length === 2 && community.length >= 3) {
        // 转换为ID
        hole = util.ari(hole);
        community = util.ari(community);
        let mine = hole.concat(community);
        classifier.reset();
        mine.forEach(c => classifier.push(c));
        let myValue = classifier.value;
        console.log(myValue);
        $('#my-info').html(myValue.pattern + myValue.reduce);
        // 剩余牌ID
        let rest = util.getRestCards(mine);

        let count = 0;
        let win = 0;
        util.combine2(rest, combine => {
            count++;
            classifier.reset();
            combine.concat(community).forEach(c => classifier.push(c));
            if (compare(myValue, classifier.value) > 0) {
                win++;
            }
        });
        let rate = (win / count * 100).toFixed(2);
        $('#my-info').append(`<div>count:${count} win:${win} rate: ${rate}%</div>`);
    }
});
