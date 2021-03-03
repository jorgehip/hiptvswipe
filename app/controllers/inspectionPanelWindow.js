var color = '#000000';
var show_all = true;
var mainTitle = "";
var args = arguments[0] || {};
var menuItemId = args.menuItemId;
var panelId = args.panelId;
var currentOption;

var ImageFactory = require("ti.imagefactory");

if (OS_ANDROID) {
    var FhImageFactory = require("fh.imagefactory");
}

var isSearchBarActive = false;

function searchBarOnChange() {
    isSearchBarActive = true;
    ////Ti.API.info("isSearchBarActive"+isSearchBarActive);
}

function searchBarOnCancel(e) {
    e.source.value = "";
}


/**
 * @property {Boolean} doLog
 * TRUE, if the log message will be show on console.
 * FALSE, if the log message will be hide on console.
 */

var doLog = true;
/**
 * @property {String} LOG_TAG - Tag of log to use on current document
 */
var LOG_TAG = "[InspectionPanelWindows]";

doLog && console.log(LOG_TAG, " Start");


function onOpen() {
    if (OS_ANDROID)
        $.searchBarInsP.hide();
}

$.inspectionPanelWindow.tableView = $.tableViewInsP;
if (OS_IOS)
    $.tableViewInsP.bottom = 40;
$.tableViewInsP.backgroundColor = Alloy.Globals.commentRowsBGColor;

// This variables holds the state of the edit section rows function
var editInspectionPanelRows = false;
var editDamagePanelRows = false;

function getCountFullItemOnRatings() {
    var counter = 0,
        counter_total_items = 0,
        global_counter = 0;
    var damage_panels = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels;
    //doLog && console.log(LOG_TAG, ' getCountFullItemOnRatings() -> categories checked: ', JSON.stringify(damage_panel));

    //if (damage_panels.length > 1) {
    for (i in Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels) {
        var toContinue = true;
        var checkRatingSelected = _.some(Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].ratings[i].options, function(itemRating) {
            //doLog && console.log(LOG_TAG, 'getCountFullItemOnRatings() >** Ratings: ', JSON.stringify(itemRating));
            return itemRating.checked;
        });
        //doLog && console.log(LOG_TAG, '> checkRatingSelected: ', checkRatingSelected);
        if (checkRatingSelected) {
            toContinue = false;
        }
        /*
         *if (toContinue) {
         *    var checkDamagePanelSelected = _.some(Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels[i].options, function(itemDamagePanel) {
         *        //doLog && console.log(LOG_TAG, 'getCountFullItemOnRatings >^^ Damage Panels: ', JSON.stringify(itemDamagePanel));
         *        return itemDamagePanel.checked;
         *    });
         *    //doLog && console.log(LOG_TAG, 'getCountFullItemOnRatings > checkDamagePanelSelected: ', checkDamagePanelSelected);
         *    if (checkDamagePanelSelected) {
         *        toContinue = false;
         *    }
         *}
         */
        if (!toContinue) {
            counter++;
            global_counter = counter;
        }
        counter_total_items++;
    }
    //}
    return {
        counter_total_items_checked: global_counter,
        counter_total_items: counter_total_items
    };
}

function getHasRatings() {
    var hasRatings,
        counter_total_items = 0,
        i = 0;
    var ratings = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].ratings;

    for (i in ratings) {
        //doLog console.log('ratings.length: ', ratings.length, ', ratings[i].options.length: ' , ratings[i].options.length);

        if (ratings.length == 0 || ratings.length == undefined) {
            hasRatings = false;
            counter_total_items++;
        } else if (ratings[i].options.length == 0 || ratings[i].options.length == undefined) {
            hasRatings = false;
            counter_total_items++;
        } else {
            hasRatings = true;
            counter_total_items++;
        }
    }
    return {
        hasRatings: hasRatings,
        numDamagePanels: counter_total_items
    };
}


function getCountItemSelectedOnDamage() {
    var counter = 0,
        global_counter = 0;
    var damage_panels = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels;
    //doLog && (LOG_TAG, ' getCountFullItemOnDamage() -> categories checked: ', JSON.stringify(damage_panel));

    if (damage_panels.length > 1) {
        for (i in Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels) {

            var toContinue = true;
            var checkRatingSelected = _.some(Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].ratings[i].options, function(itemRating) {
                //(LOG_TAG, 'getCountFullItemOnDamage() >** Ratings: ', JSON.stringify(itemRating));
                return itemRating.checked;
            });
            doLog && console.log(LOG_TAG, '> checkRatingSelected: ', checkRatingSelected);
            if (checkRatingSelected) {
                toContinue = false;
            }
            if (toContinue) {
                var checkDamagePanelSelected = _.some(Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels[i].options, function(itemDamagePanel) {
                    //console.log(LOG_TAG, 'getCountFullItemOnDamage >^^ Damage Panels: ', JSON.stringify(itemDamagePanel));
                    return itemDamagePanel.checked;
                });
                //console.log(LOG_TAG, 'getCountFullItemOnDamage > checkDamagePanelSelected: ', checkDamagePanelSelected);
                if (checkDamagePanelSelected) {
                    toContinue = false;
                }
            }
            if (!toContinue) {
                counter++;
                global_counter = counter;
            }
        }
    }
    return global_counter;
}

/**
 * This function handles the logic that needs to be executed when this window is closed
 *
 * @param {Boolean} forceSave - This will be false if the onClose function is called from previous or next buttons for navigation
 * between panels, otherwise true. If it is false, we don't need to force save, since we need performance during navigation
 * between panels and the 10 second save delay is enough here
 */
function onClose(forceSave) {
    doLog && console.log(LOG_TAG, ' onClose() ->> menuItemId: ', menuItemId, ', panelId: ', panelId);
    Alloy.Globals.inspectWindowOpened = false;
    Alloy.Globals.damageWindowOpened = false;
    if (Alloy.Globals.saveModeSwitch)
        Alloy.Globals.saveInspection();

    var toContinue = true;

    var checkRatingSelected = _.some(Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].ratings, function(itemRating) {
        //console.log(LOG_TAG, '** onClose() -> Ratings: ', JSON.stringify(itemRating));

        var innerResultsRatings = _.some(itemRating.options, function(rating) {
            //console.log(LOG_TAG, 'onClose() -> * rating: ', JSON.stringify(rating));
            return rating.checked;
        });
        if (innerResultsRatings == true)
            return true;

    });
    doLog && console.log(LOG_TAG, ' onClose() -> checkRatingSelected: ', checkRatingSelected);
    if (checkRatingSelected) {
        toContinue = false;
    }

    if (toContinue) {
        var checkDamagePanelSelected = _.some(Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels, function(itemDamagePanel) {
            //console.log(LOG_TAG, '^^ onClose() -> Damage Panels: ', JSON.stringify(itemDamagePanel));

            var innerResultsDamagePanels = _.some(itemDamagePanel.options, function(damagePanel) {
                //console.log(LOG_TAG, '^ onClose() -> damagePanel: ', JSON.stringify(damagePanel));
                return damagePanel.checked;
            });
            if (innerResultsDamagePanels == true)
                return true;

        });
        doLog && console.log(LOG_TAG, ' onClose() -> checkDamagePanelSelected: ', checkDamagePanelSelected);
    }
    if (checkDamagePanelSelected) {
        toContinue = false;
    }

    if (toContinue) {
        var checkInspectionPanelSelected = _.some(Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].inspection_panels, function(itemInspectionPanel) {
            //console.log(LOG_TAG, '^^ onClose() -> Inspection Panels: ', JSON.stringify(itemInspectionPanel));

            var innerResultsInspectionPanels = _.some(itemInspectionPanel.options, function(inspectionPanel) {
                //console.log(LOG_TAG, '^ onClose() -> inspectionPanel: ', JSON.stringify(inspectionPanel));
                return inspectionPanel.checked;
            });
            if (innerResultsInspectionPanels == true)
                return true;

        });
        doLog && console.log(LOG_TAG, ' onClose() -> checkInspectionPanelSelected: ', checkInspectionPanelSelected);
    }
    if (checkInspectionPanelSelected) {
        toContinue = false;
    }

    if (!toContinue) {
        if (Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels.length > 1) {
            if (getCountFullItemOnDamage() == 2) {
                //args.callback(true, menuItemId, panelId);
                Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].checked = true;
            } else {
                //args.callback(false, menuItemId, panelId);
                Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].checked = false;
            }
        } else {
            //args.callback(true, menuItemId, panelId);
            Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].checked = true;

        }
    } else {
        Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].checked = false;
        //args.callback(false, menuItemId, panelId);
    }
}
// On Android, we need to handle the back button event because user can close
// the window with the back button instead the home button. On back button click,
// we first execute the onClose function which will mark the row as completed
// in tabbedPanel if it is completed and then close the inspectionPanel window.
// On iOS, we use the close event to execute the onClose function
if (OS_ANDROID) {
    $.inspectionPanelWindow.addEventListener("androidback", function() {
        onClose();
        $.inspectionPanelWindow.close();
    });
} else {
    $.inspectionPanelWindow.addEventListener("close", function() {
        onClose();
    });
}



function onRowClick(e) {
    doLog && console.log(LOG_TAG, ' onRowClick()');
    switch (e.source.sourceType) {
    case "ROW_HIGHLIGHTER":
        change_check_mark(e);
        break;
    case "EDIT_COMMENT":
        //Ti.API.info("editting comment");
        switch (Ti.Platform.osname) {
        case 'android':
            editRowButtonHandler_android(e);
            break;
        default:
            editRowButtonHandler_ios(e);
            break;
        }
        break;
    }

}

function editRowButtonHandler_ios(eOuter) {
    doLog && console.log(LOG_TAG, ' -- editRowButtonHandler_ios() ');
    /*
     * first, create EditDropWindow reference
     */
    var data;
    if (Alloy.Globals.noteColorSwitch && eOuter.source.getParent().children[1].attributedString) {
        data = eOuter.source.getParent().children[1].attributedString.text;
    } else {
        data = eOuter.source.getParent().children[1].text;
    };

    data = eOuter.source.getParent().children[1].actualData;
    //doLog && console.log(LOG_TAG, ' --> data: ', data);
    var photoLink = hasPhotoLink(data);
    //doLog && console.log(LOG_TAG, ' --> photoLink: ', photoLink);
    if (photoLink) {
        data = data.replace(hasPhotoLinkReg, '');
    }
    var nextArgs = {};
    nextArgs.comentValue = data;
    //doLog && console.log(LOG_TAG, ' ===nextArgs.comentValue==== ', nextArgs.comentValue);
    //nextArgs.windowLabel = 'Add New Comment';
    nextArgs.windowLabel = mainTitle;
    nextArgs.callback = function(comentValue) {
        $.inspectionPanelWindow.title = mainTitle;
        eOuter.row.children[1].actualData = comentValue;

        //doLog && console.log(LOG_TAG, ' --> pholoLink after: ', photoLink);
        //Add Image link if its already there
        if (photoLink) {
            comentValue = comentValue.trim() + ' ' + photoLink;
        }
        var actualData = comentValue;
        if (comentValue.indexOf("<<") > -1) {
            var allLists = getAllLists(comentValue);
            ////Ti.API.info('allLists ' + allLists.length);
            var fComentValue = '';
            var fComentValue = comentValue.split('<<')[0];
            for (var i = 0; i < allLists.length; i++) {
                fComentValue = fComentValue + ' ' + getMultiSelectString(comentValue, i);
                if (comentValue.split(allLists[i])[1].split("<<")[0]) {
                    fComentValue = fComentValue + ' ' + comentValue.split(allLists[i])[1].split("<<")[0];
                }
            }

            comentValue = fComentValue;
        } else if (comentValue.indexOf("[[Caption]]") > -1 || comentValue.indexOf("[[caption]]") > -1) {
            var modifiedCaptionString = comentValue.replace(/\[\[caption/g, "[[");
            var newModifiedCaptionString = modifiedCaptionString.replace(/\[\[Caption/g, "[[");
            comentValue = getCaptionString(newModifiedCaptionString, 0);
        }

        //doLog && console.log(LOG_TAG, ' --> commentValue: ', comentValue);
        //doLog && console.log(LOG_TAG, ' --> actualData: ', actualData);

        var data = {};
        data.menuItemId = menuItemId;
        data.panelId = panelId;
        data.options = eOuter.source.getParent().rowData.index;
        data.text = comentValue;

        if (!eOuter.source.getParent().rowData.inspection_panel_index) {
            data.cmd = 'EDIT-DAMAGE-PANEL-NARRATIVE';
            data.damagePanelIndex = eOuter.source.getParent().rowData.damage_panel_index;
            Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels[eOuter.source.getParent().rowData.damage_panel_index].options[eOuter.source.getParent().rowData.index].text = actualData;
        } else {
            data.cmd = 'EDIT-SELECTION-PANEL-NARRATIVE';
            data.inspectionPanelIndex = eOuter.source.getParent().rowData.inspection_panel_index;
            Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].inspection_panels[eOuter.source.getParent().rowData.inspection_panel_index].options[eOuter.source.getParent().rowData.index].text = actualData;
        }
        /*
         * TEAM INSPECTION CODE
         */
        if (Alloy.Globals.WS && Alloy.Globals.WS.connected) {
            data.sessionId = Alloy.Globals.teamInspection.sessionId;
            data.deviceID = Titanium.Platform.id;
            Alloy.Globals.WS.send(data);
        }

        /*
         * TEAM INSPECTION CODE ENDS
         */

        if (Alloy.Globals.noteColorSwitch == true) {
            if (hasCaption(comentValue)) {
                eOuter.source.getParent().children[1].attributedString = getHtmlTextForComment_IOS(comentValue);
            } else {
                eOuter.source.getParent().children[1].text = comentValue;
            }
        } else {
            eOuter.source.getParent().children[1].text = comentValue;
        }
        //doLog && console.log(LOG_TAG, ' --> eOuter.row.title: ', comentValue);
        eOuter.row.title = comentValue;

        if (actualData.indexOf("<<") > -1) {
            if (OS_IOS) {
                var attrMulti = Titanium.UI.createAttributedString({
                    text : comentValue,//row_data.title
                });
                //doLog && console.log(LOG_TAG, ' ====comentValue==== ', comentValue);
                getHtmlTextForComment_IOS_multi(actualData, attrMulti, 2, comentValue);
                eOuter.source.getParent().children[1].attributedString = attrMulti;
            } else {
                eOuter.source.getParent().children[1].html = getHtmlTextForCommentMulti(actualData);
            }
        }

    };
    /*
     * second, window takes two parameters data and commentValue
     */
    if (OS_IOS) {
        $.inspectionPanelWindow.title = "Back";
        setTimeout(function() {
            $.inspectionPanelWindow.title = mainTitle;
        }, 400);
    }
    
    var editDropDownWindow = Alloy.createController('editDropDownWindow', nextArgs).getView();
    
    args.containingTab.open(editDropDownWindow, {
        animated : true
    });

}

function change_check_mark(e) {
    doLog && console.log(LOG_TAG, ' change_check_mark()');
    doLog && console.log(LOG_TAG, ' start panel array on change_check_mark(): ', JSON.stringify(Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId]));
    //doLog && console.log(LOG_TAG, ' e.source: ', JSON.stringify(e.source));
    //doLog && console.log(LOG_TAG, ' e.row: ', JSON.stringify(e.row));
    //doLog && console.log(LOG_TAG, ' e.section: ', JSON.stringify(e.section));

    for (var key in e) {
        doLog && console.log(LOG_TAG, 'key: ', key, ' : ', JSON.stringify(e[key]));
    }

    var row = e.row;
    // Ti.API.info("RowIndex:" + e.row.rowData.row_index);

    //if (OS_ANDROID) {
    if (row.rowData.inspection_panel_index != undefined) {
        row.is_red = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].inspection_panels[row.rowData.inspection_panel_index].options[row.rowData.index].is_red;
    } else if (row.rowData.damage_panel_index != undefined) {
        row.is_red = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels[row.rowData.damage_panel_index].options[row.rowData.index].is_red;
    }
    //}

    doLog && console.log(LOG_TAG, ' row.is_red: ', row.is_red);

    if (row.rowData.can_be_red == true) {
        //is already checked and is also red, now turning it back to normal state

        if (row.hasCheck && row.is_red) {
            doLog && console.log(LOG_TAG, ' (1)');
            //Ti.API.info("is already checked and is also red, now turning it back to normal state = black");
            row.hasCheck = false;
            row.is_red = false;
            doLog && console.log(LOG_TAG, ' (1) row.hasCheck: ', row.hasCheck, ', row.is_red: ', row.is_red);
        } else {
            //is already checked, now turning it back to red state

            if (row.hasCheck) {
                doLog && console.log(LOG_TAG, ' (2)');
                //Ti.API.info("is already checked, now turning it back to red state");
                row.is_red = true;
                row.hasCheck = true;
                doLog && console.log(LOG_TAG, ' (2) row.hasCheck: ', row.hasCheck, ', row.is_red: ', row.is_red);
            }
            //from normal state to checked state
            else {
                doLog && console.log(LOG_TAG, ' (3)');
                //Ti.API.info("from normal state to checked state = green");
                row.is_red = false;
                row.hasCheck = true;
                doLog && console.log(LOG_TAG, ' (3) row.hasCheck: ', row.hasCheck, ', row.is_red: ', row.is_red);
            }
        }
    }
    //This is row which cant be made red
    else {

        doLog && console.log(LOG_TAG, ' (4) before hasCheck: ', e.row.hasCheck);
        e.row.hasCheck = !e.row.hasCheck;
        doLog && console.log(LOG_TAG, ' (4) after hasCheck: ', e.row.hasCheck);
    }

    doLog && console.log(LOG_TAG, ' Alloy.Globals.commentSingleClickColor: ', Alloy.Globals.commentSingleClickColor, ', color: ', color, ', Alloy.Globals.commentDoubleClickColor: ', Alloy.Globals.commentDoubleClickColor);

    // for android we have the row titles moved in to an extra label ...
    if (row.children[1] != undefined) {

        if (row.rowData.rating_index == undefined)// Dont do this for ratings
        {
            // Ti.API.info("changing color to red--" + row.is_red);
            doLog && console.log(LOG_TAG, ' before row.children[1].color: ', row.children[1].color, ', row.is_red: ', row.is_red, ', row.hasCheck: ', row.hasCheck);
            if (row.is_red == true) {
                doLog && console.log(LOG_TAG, ' 5');
                row.children[1].color = Alloy.Globals.commentDoubleClickColor;
                //row.color = Alloy.Globals.commentDoubleClickColor;
            } else if (row.hasCheck == true) {
                doLog && console.log(LOG_TAG, ' 6');
                row.children[1].color = Alloy.Globals.commentSingleClickColor;
                //row.color = Alloy.Globals.commentSingleClickColor;
            } else {
                doLog && console.log(LOG_TAG, ' 7');

                row.children[1].color = color;
                //row.color = color;
            }

            currentOption = row.children[1].color;
        }
    } else {

        doLog && console.log(LOG_TAG, ' before row.children[0].color: ', row.children[0].color, ', row.hasCheck: ', row.hasCheck);

        if (row.hasCheck == true) {
            doLog && console.log(LOG_TAG, ' 9');
            row.children[0].color = Alloy.Globals.commentSingleClickColor;
        } else {
            doLog && console.log(LOG_TAG, ' 10');
            row.children[0].color = color;
        }
    }

    doLog && console.log(LOG_TAG, ' row.rowData.rating_index: ', row.rowData.rating_index);
    // update the global template data to reflect the new state
    if (row.rowData.rating_index != undefined) {

        doLog && console.log(LOG_TAG, ' (11) row.rowData.index: ', row.rowData.index);
        doLog && console.log(LOG_TAG, ' checked rating panel');
        Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].ratings[0].options[row.rowData.index].checked = row.hasCheck;

        doLog && console.log(LOG_TAG, ' panel array: ', JSON.stringify(Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId]));
    }

    doLog && console.log(LOG_TAG, ' row.rowData.inspection_panel_index: ', row.rowData.inspection_panel_index);
    if (row.rowData.inspection_panel_index != undefined) {

        doLog && console.log(LOG_TAG, ' (12) row.rowData.index: ', row.rowData.index);
        doLog && console.log(LOG_TAG, ' checked inspection panel');
        Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].inspection_panels[row.rowData.inspection_panel_index].options[row.rowData.index].checked = row.hasCheck;
        Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].inspection_panels[row.rowData.inspection_panel_index].options[row.rowData.index].is_red = row.is_red;

        doLog && console.log(LOG_TAG, ' panel array: ', JSON.stringify(Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId]));
    }

    doLog && console.log(LOG_TAG, ' row.rowData.damage_panel_index: ', row.rowData.damage_panel_index);
    if (row.rowData.damage_panel_index != undefined) {

        doLog && console.log(LOG_TAG, ' (13) row.rowData.index: ', row.rowData.index);
        doLog && console.log(LOG_TAG, ' checked damage panel');

        Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels[row.rowData.damage_panel_index].options[row.rowData.index].checked = row.hasCheck;
        Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels[row.rowData.damage_panel_index].options[row.rowData.index].is_red = row.is_red;

        doLog && console.log(LOG_TAG, ' panel array: ', JSON.stringify(Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId]));
    }

    for (var key in e) {
        doLog && console.log(LOG_TAG, 'key: ', key, ' : ', JSON.stringify(e[key]));
    }
    row = null;

}

var hasPhotoLinkReg = /\s(\[\[ImageLink\]\]).*$/g;

function hasPhotoLink(str) {
    //doLog && console.log(LOG_TAG, ' --> hasPhotoLink() - str: ', str );
    var match = str.match(hasPhotoLinkReg);
    //doLog && console.log(LOG_TAG, ' match orig: ', match );
    //doLog && console.log(LOG_TAG, ' match[0]: ', match[0] );

    return match ? match[0] : false;
}

function addRowButtonHandler() {
    var nextArgs = {};
    nextArgs.comentValue = "";
    nextArgs.windowLabel = "Add New Comment";
    nextArgs.callback = function(comentValue) {
        addNewRow(comentValue);
        $.inspectionPanelWindow.title = mainTitle;
    };
    if (OS_IOS) {
        $.inspectionPanelWindow.title = "Back";
        setTimeout(function() {
            $.inspectionPanelWindow.title = mainTitle;
        }, 400);
    }
    /*
     * second, window takes two parameters data and commentValue
     */
    var editDropDownWindow = Alloy.createController("editDropDownWindow", nextArgs).getView();
    args.containingTab.open(editDropDownWindow, {
        animated: true
    });
}

function refresh() {
    console.log(' ->> refresh()');
    var data = [];
    var rowIndex = 0;

    var menu_item = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId];
    
    $.inspectionPanelWindow.title = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].title;
    mainTitle = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].title;

    var headerData = {};
    headerData.title = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].ratings[0].title;
    var customHeaderView = Alloy.createController('sectionHeaderView', headerData).getView();
    var section = Ti.UI.createTableViewSection({
        headerView : customHeaderView
    });

    for (i2 in Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].ratings[0].options) {
        var rating = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].ratings[0].options[i2];

        //doLog && doLog && console.log(LOG_TAG, ' rating: ', JSON.stringify(rating));

        var row_data = {
            title : rating.text,
            can_be_red : false,
            index : i2,
            damage_panel_index : undefined,
            inspection_panel_index : undefined,
            rating_index : i2,
            can_be_checked : true,
            row_index : rowIndex
        };
        rowIndex++;
        var row = create_rating_row(row_data);
        row.title = rating.text;
        row.hasCheck = rating.checked;

        var colorSelected = (color == Alloy.Globals.commentRowsBGColor) ? '#FFFFFF' : color;
        if (row.hasCheck) {//Color green while loading
            row.children[0].color = Alloy.Globals.commentSingleClickColor;
        } else {
            row.children[0].color = colorSelected;
        }
        section.add(row);
        row = null;
        row_data = null;
        ratting = null;
    };

    //doLog && (LOG_TAG, ' --> Alloy.Globals.commentSingleClickColor: ', Alloy.Globals.commentSingleClickColor);
    data.push(section);
    section = null;

    // damage
    if (Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels.length == 1) {

        for (i in Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels) {

            var damage_panel = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels[i];

            var headerData = {};
            headerData.title = damage_panel.title;
            var customHeaderView = Alloy.createController('sectionHeaderView', headerData).getView();
            var section = Ti.UI.createTableViewSection({
                headerView : customHeaderView
            });

            for (i2 in damage_panel.options) {

                var option = damage_panel.options[i2];

                //doLog && (LOG_TAG, 'option on damage_panels: ',  JSON.stringify(option));
                if (show_all || option.checked) {
                    var row_data = {
                        selectedColor : 'transparent',
                        color : 'transparent',
                        title : option.text,
                        can_be_red : true,
                        index : i2,
                        damage_panel_index : i,
                        inspection_panel_index : undefined,
                        rating_index : undefined,
                        row_index : rowIndex
                    };
                    rowIndex++;
                    var row = create_panel_row(row_data, option);

                    row.title = option.text;
                    //row.color = Alloy.Globals.commentRowsBGColor;
                    row.hasCheck = option.checked;
                    //row.is_red = option.is_red;

                    section.add(row);
                    row = null;
                    //row_data = null;
                }
                //option = null;

            }
            section.header = damage_panel.title;
            data.push(section);
            damage_panel = null;
            section = null;
        }

    }

    $.tableViewInsP.setData(data);
    data = null;
}

function create_rating_row(row_data) {
    var row = Ti.UI.createTableViewRow({
        sourceType : 'ROW_HIGHLIGHTER',
        backgroundColor : Alloy.Globals.commentRowsBGColor,
        selectedColor : 'transparent',
        color : 'transparent'
    });

    row.rowData = row_data;

    var row_title = Ti.UI.createLabel({
        font : {
            fontSize : 20
        },
        //color : Alloy.Globals.commentRowsFGColor,
        text : row_data.title,
        left : '50dp',
        right : '50dp',
        sourceType : 'ROW_HIGHLIGHTER'
    });
    row.add(row_title);
    return row;

};

function create_panel_row(row_data, option) {
    //doLog && (LOG_TAG, ' --> row_data: ', JSON.stringify(row_data));
	var sliderValue = Ti.App.Properties.getInt("sliderValue");
	var commentLines = Alloy.Globals.commentLines;
    var row = null;
    var rowLabel = Ti.UI.createLabel({
        font : {
            fontSize : 20
        },
        //color: Alloy.Globals.commentRowsFGColor,
        textData : row_data.title,
        actualData : row_data.title,
        left : '75dp',
        right : '10dp',
        //top : '0dp',
        //bottom : '5dp',
        sourceType : 'ROW_HIGHLIGHTER',
        maxLines: commentLines
    });

    if (option.is_red)//Color red while loading
        rowLabel.color = Alloy.Globals.commentDoubleClickColor;
    else if (option.checked)//Color green while loading
        rowLabel.color = Alloy.Globals.commentSingleClickColor;
    else
        rowLabel.color = color;

    doLog && (LOG_TAG, 'Alloy.Globals.commentRowsFGColor: ', color);

    if (Alloy.Globals.noteColorSwitch && 1 == 0) {

    } else {
        rowLabel.text = row_data.title;
    }

    currentOption = rowLabel.color;

    var heightVal = (2 * 9 * 3);
    var adjust = false;
    var commentLines = 3;

    var reCalc = heightVal + 5;
    (adjust) ? heightVal = reCalc : heightVal;
    //doLog && (LOG_TAG, ' --> heightVal: ', heightVal);
    row = Ti.UI.createTableViewRow({
        height : heightVal,
        backgroundColor : Alloy.Globals.commentRowsBGColor,
        selectedColor : 'transparent',
        color : 'transparent',
    });
    row.rowData = row_data;

    var edit_row_button = Titanium.UI.createImageView({
        image : '/images/Pencil.png', // this is a BLOB now: TODO: store on local file system ...
        left : '5',
        //height : '35',
        //width : '35',
        sourceType : 'EDIT_COMMENT'
    });

    edit_row_button.applyProperties({
        height : (commentLines > 1) ? '35' : '25',
        width : (commentLines > 1) ? '35' : '25'
    });
    row.add(edit_row_button);
    row.add(rowLabel);
    doLog && (LOG_TAG, ' --> row_data: ', JSON.stringify(row_data));
    rowLabel.left = 45;

    return row;
};

var data1 = "";

function addNewRow(commentData, callback) {
    if (Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].inspection_panels.length == 1 && Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels.length == 0) {
        //Only one selection panel present, add directly
        if (callback)
            callback();
        var options = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].inspection_panels[0].options;
        options.push({
            text: commentData,
            checked: true,
            is_red: false,
            id: 123
        });
        Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].inspection_panels[0].options = options;

        /**
         * Team inspection code start
         */
        //TICKET    - https://homeinspectorpro.atlassian.net/browse/HIPCLIENT-104

        if (Alloy.Globals.WS && Alloy.Globals.teamInspection) {
            var data = {};
            data.cmd = "ADD-SELECTION-PANEL-NARRATIVE";
            data.menuItemId = menuItemId;
            data.panelId = panelId;
            data.inspectionPanelIndex = 0;
            data.newOption = {
                text: commentData,
                checked: true,
                is_red: false,
                id: 123
            };
            data.sessionId = Alloy.Globals.teamInspection.sessionId;
            data.deviceID = Titanium.Platform.id;
            Alloy.Globals.sendWSMessage(data);
        }
        /**
         * Team inspection code finish
         */

        refresh(show_all);
        //calculate new row index--
        var other = 0;
        try {
            other = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].ratings[0].options.length;
        } catch (e) {
            Alloy.Globals.apm.logHandledException(LOG_TAG + " addNewRow one selection panel present other variable exception " + JSON.stringify(e));
        }
        var index = options.length - 1 + other;
        // Ti.API.info("index--" + index);

        setTimeout(function() {
            // Ti.API.info("Scrolling the tableViewInsP now");
            $.tableViewInsP.scrollToIndex(index);
        }, 1000);
    } else if (Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].inspection_panels.length == 0 && Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels.length == 1) {
        //Only one damage panel present, add directly
        // Ti.API.info("Only one damage panel present, add directly");
        if (callback)
            callback();
        var options = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels[0].options;
        options.push({
            text: commentData,
            checked: true,
            is_red: false,
            id: 123
        });
        Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels[0].options = options;

        refresh(show_all);
        var other = 0;
        try {
            other = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].ratings[0].options.length;
        } catch (e) {
            Alloy.Globals.apm.logHandledException(LOG_TAG + " addNewRow one damage panel present other variable exception " + JSON.stringify(e));
        }
        //calculate new row index--
        var index = options.length - 1 + other;
        setTimeout(function() {
            $.tableViewInsP.scrollToIndex(index);
        }, 1000);
    } else {
        //Multiple panels, add with choice
        data1 = commentData;
        // Ti.API.info("else fired");
        //alertAddCommentChoice.show();
        if (callback)
            showExtraCommentAdderOptions(callback);
        else
            showExtraCommentAdderOptions();
    }
}

function showExtraCommentAdderOptions(callback) {
    var alertAddCommentChoice = null;
    //Create dialog box based on available panels
    if (Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].inspection_panels.length == 2 && Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels.length == 0) {
        var panel1 = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].inspection_panels[0].title || "Panel 1";
        var panel2 = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].inspection_panels[1].title || "Panle 2";
        if (OS_IOS) {
            alertAddCommentChoice = Titanium.UI.createAlertDialog({
                title: "Add comment",
                message: "Click on a section to add comment",
                buttonNames: [panel1, panel2]
            });
        } else {
            //show new custom window only for android
            var modalWindow = Ti.UI.createWindow({
                title: "Click on a section to add comment",
                navBarHidden: true,
                backgroundColor: "#5000",
                opacity: 1.0
            });
            var view = Ti.UI.createView({
                width: 284,
                height: 106,
                backgroundColor: "#00345e",
                layout: "vertical"
            });
            var b1 = Ti.UI.createButton({
                top: 2,
                left: 2,
                right: 2,
                title: panel1,
                backgroundColor: "#0067ac",
                color: "#fff",
                height: 50,
                width: 280,
                index: 0
            });
            b1.addEventListener("click", function(e) {
                clickHandler(e.source);
                modalWindow.close();
            });
            view.add(b1);
            var b2 = Ti.UI.createButton({
                title: panel2,
                left: 2,
                right: 2,
                top: 2,
                height: 50,
                backgroundColor: "#0067ac",
                color: "#fff",
                width: 280,
                index: 1
            });
            b2.addEventListener("click", function(e) {
                clickHandler(e.source);
                modalWindow.close();
            });
            view.add(b2);
            modalWindow.add(view);
            modalWindow.open();
        }
    } else if (Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].inspection_panels.length == 2 && Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels.length == 1) {
        var panel1 = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].inspection_panels[0].title || "Panel 1";
        var panel2 = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].inspection_panels[1].title || "Panle 2";
        var dmgPanel = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels[0].title || "Damage Panel";
        if (OS_IOS) {
            alertAddCommentChoice = Titanium.UI.createAlertDialog({
                title: "Add comment",
                message: "Click on a section to add comment",
                buttonNames: [panel1, panel2, dmgPanel]
            });
        } else {
            //show new custom window only for android
            var modalWindow = Ti.UI.createWindow({
                title: "Click on a section to add comment",
                navBarHidden: true,
                backgroundColor: "#5000",
                opacity: 1.0
            });
            var view = Ti.UI.createView({
                width: 284,
                height: 158,
                backgroundColor: "#00345e",
                layout: "vertical"
            });
            var b1 = Ti.UI.createButton({
                top: 2,
                left: 2,
                right: 2,
                title: panel1,
                backgroundColor: "#0067ac",
                color: "#fff",
                height: 50,
                width: 280,
                index: 0
            });
            b1.addEventListener("click", function(e) {
                clickHandler(e.source);
                modalWindow.close();
            });
            view.add(b1);
            var b2 = Ti.UI.createButton({
                title: panel2,
                left: 2,
                right: 2,
                top: 2,
                height: 50,
                backgroundColor: "#0067ac",
                color: "#fff",
                width: 280,
                index: 1
            });
            b2.addEventListener("click", function(e) {
                clickHandler(e.source);
                modalWindow.close();
            });
            view.add(b2);
            var b3 = Ti.UI.createButton({
                title: dmgPanel,
                height: 50,
                left: 2,
                right: 2,
                top: 2,
                backgroundColor: "#0067ac",
                color: "#fff",
                width: 280,
                index: 2
            });
            b3.addEventListener("click", function(e) {
                clickHandler(e.source);
                modalWindow.close();
            });
            view.add(b3);

            modalWindow.add(view);
            modalWindow.open();
        }
    } else if (Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].inspection_panels.length == 1 && Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels.length == 1) {
        var panel1 = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].inspection_panels[0].title || "Panel 1";
        var dmgPanel = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels[0].title || "Damage Panel";
        if (OS_IOS) {
            alertAddCommentChoice = Titanium.UI.createAlertDialog({
                title: "Add comment",
                message: "Click on a section to add comment",
                buttonNames: [panel1, dmgPanel]
            });
        } else {
            //show new custom window only for android
            var modalWindow = Ti.UI.createWindow({
                title: "Click on a section to add comment",
                navBarHidden: true,
                backgroundColor: "#5000",
                opacity: 1.0
            });
            var view = Ti.UI.createView({
                width: 284,
                height: 106,
                backgroundColor: "#00345e",
                layout: "vertical"
            });
            var b1 = Ti.UI.createButton({
                top: 2,
                left: 2,
                right: 2,
                title: panel1,
                backgroundColor: "#0067ac",
                color: "#fff",
                height: 50,
                width: 280,
                index: 0
            });
            b1.addEventListener("click", function(e) {
                clickHandler(e.source);
                modalWindow.close();
            });
            view.add(b1);
            var b2 = Ti.UI.createButton({
                title: dmgPanel,
                left: 2,
                right: 2,
                top: 2,
                height: 50,
                backgroundColor: "#0067ac",
                color: "#fff",
                width: 280,
                index: 1
            });
            b2.addEventListener("click", function(e) {
                clickHandler(e.source);
                modalWindow.close();
            });
            view.add(b2);
            modalWindow.add(view);
            modalWindow.open();
        }
    }

    function clickHandler(e) {
        try {
            // Ti.API.info("e.index:" + e.index);
            if (e.index == 0) {
                if (callback)
                    callback();

                //Add comment to selection panel 1

                var options = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].inspection_panels[0].options;
                options.push({
                    text: data1,
                    checked: true,
                    is_red: false,
                    id: 123
                });
                Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].inspection_panels[0].options = options;

                /**
                 * Team inspection code start
                 */
                //TICKET    - https://homeinspectorpro.atlassian.net/browse/HIPCLIENT-104

                if (Alloy.Globals.WS && Alloy.Globals.teamInspection) {
                    var data = {};
                    data.cmd = "ADD-SELECTION-PANEL-NARRATIVE";
                    data.menuItemId = menuItemId;
                    data.panelId = panelId;
                    data.inspectionPanelIndex = 0;
                    data.newOption = {
                        text: data1,
                        checked: false,
                        is_red: false,
                        id: 123
                    };
                    data.sessionId = Alloy.Globals.teamInspection.sessionId;
                    data.deviceID = Titanium.Platform.id;
                    Alloy.Globals.sendWSMessage(data);
                }
                /**
                 * Team inspection code finish
                 */

                //Titanium.App.Properties.setString("root",JSON.stringify(root));
                refresh(show_all);
                var other = 0;
                try {
                    other = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].ratings[0].options.length;
                } catch (e) {
                    Alloy.Globals.apm.logHandledException(LOG_TAG + " clickHandler Add comment to selection panel 1 other variable exception " + JSON.stringify(e));
                }

                var index = options.length + other;
                $.tableViewInsP.scrollToIndex(index);
            } else if (e.index == 1) {
                if (callback)
                    callback();
                if (Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].inspection_panels.length == 1 && Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels.length == 1) {
                    //Damage Panel
                    var options = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels[0].options;
                    options.push({
                        text: data1,
                        checked: true,
                        is_red: false,
                        id: 123
                    });
                    Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels[0].options = options;

                    /**
                     * Team inspection code start
                     */
                    //TICKET    - https://homeinspectorpro.atlassian.net/browse/HIPCLIENT-76

                    if (Alloy.Globals.WS && Alloy.Globals.teamInspection) {
                        var data = {};
                        data.cmd = "ADD-DAMAGE-PANEL-NARRATIVE";
                        data.menuItemId = menuItemId;
                        data.panelId = panelId;
                        data.damagePanelIndex = 0;
                        data.newOption = {
                            text: data1,
                            checked: false,
                            is_red: false,
                            id: 123
                        };
                        data.sessionId = Alloy.Globals.teamInspection.sessionId;
                        data.deviceID = Titanium.Platform.id;
                        Alloy.Globals.sendWSMessage(data);
                    }
                    /**
                     * Team inspection code finish
                     */

                    refresh(show_all);
                    //calculate new row index--
                    var other = 0;
                    try {
                        other = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].ratings[0].options.length;
                    } catch (e) {
                        Alloy.Globals.apm.logHandledException(LOG_TAG + " clickHandler damage panel other variable exception " + JSON.stringify(e));
                    }

                    var index = options.length - 1 + Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].inspection_panels[0].options.length + other;
                    $.tableViewInsP.scrollToIndex(index);
                } else {
                    //Panel 2
                    var options = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].inspection_panels[1].options;
                    options.push({
                        text: data1,
                        checked: true,
                        is_red: false,
                        id: 123
                    });
                    Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].inspection_panels[1].options = options;
                    // Ti.API.info("3");

                    /**
                     * Team inspection code start
                     */
                    //TICKET    - https://homeinspectorpro.atlassian.net/browse/HIPCLIENT-104

                    if (Alloy.Globals.WS && Alloy.Globals.teamInspection) {
                        var data = {};
                        data.cmd = "ADD-SELECTION-PANEL-NARRATIVE";
                        data.menuItemId = menuItemId;
                        data.panelId = panelId;
                        data.inspectionPanelIndex = 1;
                        data.newOption = {
                            text: data1,
                            checked: true,
                            is_red: false,
                            id: 123
                        };
                        data.sessionId = Alloy.Globals.teamInspection.sessionId;
                        data.deviceID = Titanium.Platform.id;
                        Alloy.Globals.sendWSMessage(data);
                    }
                    /**
                     * Team inspection code finish
                     */

                    refresh(show_all);
                    var other = 0;
                    try {
                        other = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].ratings[0].options.length;
                    } catch (e) {
                        Alloy.Globals.apm.logHandledException(LOG_TAG + " clickHandler panel 2 other variable exception " + JSON.stringify(e));
                    }

                    //calculate new row index--
                    var index = options.length - 1 + Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].inspection_panels[0].options.length + other;
                    $.tableViewInsP.scrollToIndex(index);
                }
            } else if (e.index == 2) {
                if (callback)
                    callback();

                //Add comment to damage panel
                var options = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels[0].options;
                options.push({
                    text: data1,
                    checked: true,
                    is_red: false,
                    id: 123
                });
                Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels[0].options = options;

                /**
                 * Team inspection code start
                 */
                //TICKET    - https://homeinspectorpro.atlassian.net/browse/HIPCLIENT-77

                if (Alloy.Globals.WS && Alloy.Globals.teamInspection) {
                    var data = {};
                    data.cmd = "ADD-DAMAGE-PANEL-NARRATIVE";
                    data.menuItemId = menuItemId;
                    data.panelId = panelId;
                    data.damagePanelIndex = 0;
                    data.newOption = {
                        text: data1,
                        checked: false,
                        is_red: false,
                        id: 123
                    };
                    data.sessionId = Alloy.Globals.teamInspection.sessionId;
                    data.deviceID = Titanium.Platform.id;
                    Alloy.Globals.sendWSMessage(data);
                }
                /**
                 * Team inspection code finish
                 */

                refresh(show_all);
                var other = 0;
                try {
                    other = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].ratings[0].options.length;
                } catch (e) {
                    Alloy.Globals.apm.logHandledException(LOG_TAG + " clickHandler add comment to damage panel other variable exception " + JSON.stringify(e));
                }

                //calculate new row index--
                var index = options.length - 1 + Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].inspection_panels[0].options.length + Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].inspection_panels[1].options.length + other;
                $.tableViewInsP.scrollToIndex(index);
            } else {
                if (callback)
                    callback();
            }
        } catch (e) {
            Alloy.Globals.apm.logHandledException(LOG_TAG + " clickHandler " + JSON.stringify(e));
        }
    }

    if (alertAddCommentChoice != null) {
        alertAddCommentChoice.addEventListener("click", function(e) {
            clickHandler(e);
        });
        alertAddCommentChoice.show();
    }
}

refresh(show_all);

$.inspectionPanelWindow.goHome = function() {
    Alloy.Globals.tabbedWindowOpened = false;
    Alloy.Globals.inspectWindowOpened = false;
    Alloy.Globals.damageWindowOpened = false;

    onClose(true);

    args.tabbedPanelWindow.close();
    $.inspectionPanelWindow.close();
};

function handleImageEvent(event, callback) {

    //progressBar.openIndicator();
    //progressBar.setMessage("Saving Pic, please wait..");

    var theImage = null;
    theImage = event.media;

    var imgW = event.media.width;
    var imgH = event.media.height;
    // //Ti.API.info("width before==" + imgW);
    // //Ti.API.info("height before==" + imgH);

    var maxWidth = 350;
    if (parseInt(Alloy.Globals.photoEditorQuality) == 5)
        maxWidth = 532;
    var reduction;
    if (imgW > imgH) {
        reduction = maxWidth / imgW;
        imgW = maxWidth;
        imgH = Math.round(imgH * reduction);
    } else {
        reduction = maxWidth / imgH;
        imgH = maxWidth;
        imgW = Math.round(imgW * reduction);
    }
    // //Ti.API.info("width after==" + imgW);
    // //Ti.API.info("height after==" + imgH);
    // //Ti.API.info("size before compression--" + theImage.length);
    if (Alloy.Globals.fullSizeImagesSwitch)
        Alloy.Globals.saveFullSizeImage(inspectionDir, Alloy.Globals.getCurrentInspection(), Alloy.Globals.getNextPhotoID(), theImage);
    theImage = ImageFactory.JpegEncoder.imageAsResized(theImage, {
        width : imgW,
        height : imgH,
        quality : ImageFactory.JpegEncoder.QUALITY_LOW
    });

    var photoQuality = (parseInt(Alloy.Globals.photoEditorQuality) + 3) / 10;
    theImage = ImageFactory.JpegEncoder.compress(theImage, photoQuality);

    // //Ti.API.info("size after compression--" + theImage.length);

    // //Ti.API.info("now going to fire the photoChosen event");


    saveImage(theImage);
    if (callback)
        callback();
    theImage = null;
};



// isImageFromHipCamera will be true only if the image is taken from HIP camera on. In this case,
// we don't need to rotate or resize since that is already done in the camera edit view for annotations
function saveImage(theImage) {
    try {
        var inspectionName = Alloy.Globals.getCurrentInspection();
        var time = Alloy.Globals.getNextPhotoID();
        var imageFile = Titanium.Filesystem.getFile(inspectionDir + "/inspections/" + inspectionName, time + '.jpg');
        imageFile.write(theImage);
        if (OS_ANDROID) {
            var maxWidth = 350;
            if (parseInt(Alloy.Globals.photoEditorQuality) == 5)
                maxWidth = 532;
            ImageFactory.rotateResizeImage(imageFile.nativePath, maxWidth, Alloy.Globals.getQualityForAndroid());
            var newImageFile = Titanium.Filesystem.getFile(inspectionDir + "/inspections/" + inspectionName, time + '.jpg');
            theImage = newImageFile.read();
        }
        var pic_info_test = {
            menuItem : Alloy.Globals.root.template[menuItemId].title,
            caption : "",
            section : Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels[0].title,
            id : Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels[0].id,
            imageFileName : imageFile.getName(),
            height : theImage.height,
            width : theImage.width
        };
        
                Alloy.Globals.root.pictures.push(pic_info_test);
        pic_info_test = null;
        if (OS_IOS) {
            //Alloy.Globals.TestflightTi.passCheckpoint("saving image");
        };
        Alloy.Globals.updatePhotosJSON();
        return imageFile;
    } catch (e) {
        alert('Error occured while saving Photo');
        doLog && console.log('e: ', JSON.stringify(e));
        //Alloy.Globals.apm.leaveBreadcrumb(LOG_TAG + " Error occured while saving Photo ");
    }
}


function prev() {
    onClose(false);
    if (panelId > 0)
        panelId = panelId - 1;
    else {
        panelId = Alloy.Globals.root.template[menuItemId].tabbed_panels.length - 1;
    }
    refresh(true);
    $.tableViewInsP.scrollToIndex(0);
    //updateToolbar();
}
function home() {
    //$.inspectionPanelWindow.goHome();
}
function takePicFromCamera() {
    if (OS_IOS) {
            require("/permissions").checkCameraPermissionOpt(function(event) {
                if (event.showMsg) {
                    var dialog = Ti.UI.createAlertDialog({
                            cancel: 1,
                            buttonNames: ['Go to Settings', 'Cancel'],
                            message: L('cameraPhotosPermissions'),
                            title: L('titlePermissions')
                    });
                    dialog.addEventListener('click', function(e) {
                        if (e.index === e.source.cancel) {
                            doLog && console.log(LOG_TAG, 'The cancel button was clicked');
                        }else{
                            Ti.Platform.openURL(Ti.App.iOS.applicationOpenSettingsURL);
                        }
                    });
                    dialog.show();
                    dialog = null;
                }else{
                    Titanium.Media.showCamera({
                        autorotate : false,
                        success : function(event) {
        
                            handleImageEvent(event, function() {
                                var nextArgs = {};
                                nextArgs.menuItemId = menuItemId;
                                nextArgs.panelId = panelId;
                                nextArgs.damagePanelIndex = 0;
                                nextArgs.containingTab = args.containingTab;
                                nextArgs.inspectionPanelWindow = $.inspectionPanelWindow;
                                nextArgs.callback = function(pid) {
                                    if ($.inspectionPanelWindow) {
                                        //panelId = pid;
                                        //refresh(true);
                                        //updateToolbar();
                                        //$.tableViewInsP.scrollToIndex(0);
                                    }
                                };
                                nextArgs.closePrev = function(pid) {
                                    // //Ti.API.info("imageGalleryWindow goHome called");
                                    $.inspectionPanelWindow = null;
                                };
                                var imageGalleryWindow = Alloy.createController('imageGalleryWindow', nextArgs).getView();
                                args.containingTab.open(imageGalleryWindow, {
                                    //animated : true
                                });
                            });
        
                        },
                        cancel : function() {
                            // //Ti.API.info("inside cancle");
                        },
                        error : function(error) {
                            var a = Titanium.UI.createAlertDialog({
                                title : 'Uh Oh...'
                            });
                            if (error.code == Titanium.Media.NO_CAMERA) {
                                a.setMessage('Sorry, this device does not have a camera - you knew that, right?');
                            } else {
                                a.setMessage('Unexpected error: ' + error.code);
                            }
                            a.show();
                        },
                        saveToPhotoGallery : false, //Else saves in gallery twice
                        //allowImageEditing : true
                        allowEditing : false
                    });
                }
            });
        }
}

function saveVideo() {
    try {
        Alloy.Globals.saveVideo(Alloy.Globals.root.template[menuItemId].title, "", Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels[0].title, Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels[0].id, function(videoFile) {
            var nextArgs = {};
            nextArgs.menuItemId = menuItemId;
            nextArgs.panelId = panelId;
            nextArgs.damagePanelIndex = 0;
            nextArgs.containingTab = args.containingTab;
            nextArgs.inspectionPanelWindow = $.inspectionPanelWindow;
            nextArgs.callback = function(pid) {
                if ($.inspectionPanelWindow) {
                    //panelId = pid;
                    //refresh(true);
                    //updateToolbar();
                    //$.tableViewInsP.scrollToIndex(0);
                }
            };
            //nextArgs.closePrev = function(pid) {
                // //Ti.API.info("imageGalleryWindow goHome called");
            //    $.inspectionPanelWindow = null;
            //};
            
            var imageGalleryWindow = Alloy.createController('imageGalleryWindow', nextArgs).getView();
            args.containingTab.open(imageGalleryWindow, {
               animated : true
            });
        }, args.containingTab);
    } catch(error) {
        alert(JSON.stringify(error));
    }

}

function showGalleryDynamic(_menuItemId, _panelId) {
    doLog && console.log(LOG_TAG, "----- showGalleryDynamic _menuItemId--" + _menuItemId + "  --_panelId--" + _panelId);
    if (_menuItemId && _panelId) {
        showGallery(_menuItemId, _panelId);
    } else {
        showGallery(menuItemId, panelId);
    }
}

function showGallery(_menuItemId, _panelId) {
    var nextArgs = {};
    nextArgs.menuItemId = _menuItemId;
    nextArgs.panelId = _panelId;
    nextArgs.damagePanelIndex = 0;
    nextArgs.containingTab = args.containingTab;
    nextArgs.inspectionPanelWindow = $.inspectionPanelWindow;
    nextArgs.showGalleryDynamic = showGalleryDynamic;
    nextArgs.callback = function(pid) {
        // //Ti.API.info("imageGalleryWindow callback called");
        // //Ti.API.info($.tableViewInsP);
        if ($.inspectionPanelWindow && $.tableViewInsP) {
            //panelId = pid;
            //refresh(true);
            //if (OS_IOS)
            //    updateToolbar();
            //$.tableViewInsP.scrollToIndex(0);
        }
    };
    //nextArgs.closePrev = function(pid) {
        // //Ti.API.info("imageGalleryWindow goHome called");
      //  $.inspectionPanelWindow = null;
    //};
    var imageGalleryWindow = Alloy.createController('imageGalleryWindow', nextArgs).getView();
    args.containingTab.open(imageGalleryWindow, {
        animated : false
    });
}

function next() {
    onClose(false);
    
    if (panelId < (Alloy.Globals.root.template[menuItemId].tabbed_panels.length - 1))
        ++panelId;
    else {
        panelId = 0;
    }
    refresh(true);
    $.tableViewInsP.scrollToIndex(0, {
        animated: false
    });
}
