// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = arguments[0] || {};

var doLog = true;
var ta_valueChanged = false;

/**
 * @property {String} LOG_TAG - Tag of log to use on current document
 */
var LOG_TAG = '[editDropDownWindow]';

doLog && console.log(LOG_TAG, ' Start');

var comentValue = args.comentValue;

doLog && console.log(LOG_TAG, '---comentValue---> ' , comentValue);

var formattedCommentsValue = comentValue;

var newFormattedCommentsValue = "";
var fArray = formattedCommentsValue.split(Alloy.Globals.multilistSeparator);
for (var i = 0,
    j = fArray.length; i < j; i++) {
    if (i == (fArray.length - 1)) {
        newFormattedCommentsValue = newFormattedCommentsValue + fArray[i].trim();
    } else {
        newFormattedCommentsValue = newFormattedCommentsValue + fArray[i].trim() + "&& ";
    }
};
formattedCommentsValue = newFormattedCommentsValue;

var title = args.windowLabel;
$.editDropDownWindow.title = title;

$.commentField.value = formattedCommentsValue;
$.commentField.formattedValue = comentValue;

function getAllLists(comment) {
    return comment.match(/\<\<[^>]*\>\>/g);
}

function onClose() {
    $.commentField.blur();
};

function onOpen() {
    if (getAllLists($.commentField.value) == null) {
        hideListButton();
        $.commentField.focus();
    } else if (Alloy.Globals.autoListSwitch) {
        //showList();
    }
}

var keyBoardHeight = 0;
Ti.App.addEventListener('keyboardframechanged', function(_event) {
    keyBoardHeight = _event.keyboardFrame.height;
    
    var modifyHeight;

    switch(Ti.Platform.osname) {

    case 'iphone':
        modifyHeight = keyBoardHeight - 80;
        break;
    case 'ipad':
        modifyHeight = keyBoardHeight - 32;
        break;
    }

    doLog && console.log(LOG_TAG, 'keyBoardHeight  ', keyBoardHeight, ' - modifyHeight: ', modifyHeight);

    $.ScrollField.applyProperties({
        bottom : modifyHeight
    });
    /*
    $.commentField.applyProperties({
        value: $.commentField.value + ' '
    });
    */
});
$.commentField.addEventListener('return', function(e) {
    $.commentField.blur();
    $.commentField.focus();
});

function valueChanged(e) {
    ta_valueChanged = true;
    var editedValue = e.source.value;
    var fValue = $.commentField.formattedValue;
    var newNarrative;
    if (editedValue.indexOf("<<") != -1) {
        newNarrative = editedValue.split('<<')[0];
        fValue = newNarrative + '' + getRemainingText(fValue);
        doLog && console.log(LOG_TAG, 'fValue === ' , fValue);
        $.commentField.formattedValue = fValue;
        doLog && console.log(LOG_TAG, '$.commentField.formattedValue === ' , $.commentField.formattedValue);
    }
};

function getRemainingText(_string) {
    var _fArray = _string.split('<<');
    var _nString = '';
    for (var i = 0,
        j = _fArray.length; i < j; i++) {
        if (i != 0) {
            _nString = _nString + '<<' + _fArray[i];
        }
    };
    return _nString;
}

function moveAreaUp() {
    doLog && console.log (LOG_TAG, ' moveUp() - before', keyBoardHeight);
    if ((keyBoardHeight - 50) < 250) {
        keyBoardHeight = 250;
    } else {
        keyBoardHeight = (Ti.Platform.osname === 'ipad') ? (keyBoardHeight - 32) : (keyBoardHeight - 50 - 32);
    }
    doLog && console.log (LOG_TAG, ' moveUp() - after: ', keyBoardHeight);
    $.ScrollField.bottom = keyBoardHeight;
}

function moveAreaDown() {
    $.ScrollField.bottom = "10";
}


function save(argument) {
    
}

function close(argument) {
    $.editDropDownWindow.close();
}

if (OS_IOS) {
    var hideKeyboard = function() {
        $.commentField.blur();
    };

}

switch(Ti.Platform.osname) {
case 'iphone':
case 'ipad':
    $.commentField.suppressReturn = false;
    break;
}

if (getAllLists(comentValue) == null) {
    // doLog && console.log(LOG_TAG, "lists--" , getAllLists(comentValue));
    hideListButton();
}

function hideListButton() {
    if (OS_IOS)
        $.listBtnIOS.hide();
    else
        $.listBtn.hide();

}


