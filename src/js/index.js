let util = require('./util');

jQuery(function () {
    let me = [null, null];
    let common = [null, null, null, null, null];
    let known = {
        me: me,
        common: common
    };
    let selectedKind = '';
    let selectKinds = jQuery('#card-select-kind').find('> div');
    selectKinds.click(function () {
        selectKinds.removeClass('selected');
        $(this).addClass('selected');
        selectedKind = $(this).html();
        console.log(selectedKind);
    });
    let selectedSuit = '';
    let selectSuit = jQuery('#card-select-suit').find('> div');
    selectSuit.click(function () {
        selectSuit.removeClass('selected');
        $(this).addClass('selected');
        selectedSuit = $(this).html();
        console.log(selectedSuit);
    });

    let currentCard = null;
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
            let type = currentCard.data('type');
            let index = currentCard.data('index');
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
