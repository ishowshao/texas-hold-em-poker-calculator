let $ = require('./src/js/jquery-3.1.0.min');
let util = require('./src/js/util');
let classifier = require('./src/js/classifier');

let me = [null, null];
let common = [null, null, null, null, null];
let known = {
    me: me,
    common: common
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
        console.log(me, common);
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

$('#calculate').click(function () {
    // 先判定能不能计算
    let common = known.common.filter(i => i);
    let me = known.me.filter(i => i);
    if (me.length === 2 && common.length >= 3) {
        // 转换为ID
        me = util.ari(me);
        common = util.ari(common);
        let mine = me.concat(common);
        mine.forEach(c => classifier.push(c));
        console.log(classifier.pattern);
        // 剩余牌ID
        let rest = util.getRestCards(mine);

        util.combine2(rest, combine => {
            // console.log(combine);
            classifier.reset();
            combine.concat(common).forEach(c => classifier.push(c));
            console.log(classifier.pattern);
        });
    }
});
