var args = arguments[0] || {};
//var inspectionService = require('InspectionsHelper');
$.tabbedPanelWindow.title = args.title;

var doLog = Ti.App.Properties.getBool('doLog');

/**
 * @property {String} LOG_TAG - Tag of log to use on current document
 */
var LOG_TAG = '[tabbedPanel]';

doLog && console.log(LOG_TAG, ' start');

doLog && console.log (LOG_TAG, '~~~~~> Alloy.Globals.countNarrativesPicturesSwitch: ', Alloy.Globals.countNarrativesPicturesSwitch);


if (OS_ANDROID) {
    setTimeout(function() {
        $.searchBar.show();
    }, 500);
}

function drawInfo(indexPanelId) {
    
        var posToScroll = 0;
        var data = [];
        for (i in Alloy.Globals.root.template[args.id].tabbed_panels) {
            var total_number_items = 5; //inspectionService.getTotalNumberOfNarrativesAndPicturesByMenuItemIdAndPanelId(args.id,i);
            
            if (i == indexPanelId) {
                //doLog && console.log(LOG_TAG, i, indexPanelId);
                posToScroll = i;
            };
            //doLog && console.log(Alloy.Globals.rowReadColor, Alloy.Globals.commentRowsFGColor, Alloy.Globals.commentRowsBGColor);
            //doLog && console.log(LOG_TAG, ' list: ', JSON.stringify(Alloy.Globals.root.template[args.id].tabbed_panels[i]));
            var row = {
                font : {
                    fontSize : Alloy.Globals.fontSizeVal
                },
                color : Alloy.Globals.commentRowsFGColor,
                backgroundColor : Alloy.Globals.commentRowsBGColor,
                title : Alloy.Globals.root.template[args.id].tabbed_panels[i].title,
                id : i,
                hasDetail : false,
                hasChild : false,
                totalNumberOfItems: total_number_items.total_narratives,
                totalNumberOfItemsSelected: total_number_items.total_narratives_selected,
                totalNumberOfPictures: total_number_items.total_pictures
            };

            var itemChecked = false;
            var toContinue = true;
            var tabbedPanelChecked = Alloy.Globals.root.template[args.id].tabbed_panels[i].checked;

            //doLog && console.log(LOG_TAG, ' tabbedPanel checked: ' , tabbedPanelChecked);

            if (tabbedPanelChecked) {
                //doLog && console.log(LOG_TAG, ' row CHECKED ');
                row.backgroundColor = Alloy.Globals.rowReadColor;
                row.color = '#000000';
            } else if (tabbedPanelChecked == undefined) {
                //doLog && console.log(LOG_TAG, ' row TO VERIFY ');
                var checkRatingSelected = _.some(Alloy.Globals.root.template[args.id].tabbed_panels[i].ratings, function(itemRating) {
                    //console.log(LOG_TAG, '** Ratings: ', JSON.stringify(itemRating));

                    var innerResultsRatings = _.some(itemRating.options, function(rating) {
                        //console.log(LOG_TAG, '* rating: ', JSON.stringify(rating));
                        return rating.checked;
                    });
                    if (innerResultsRatings == true)
                        return true;
                });

                //doLog && console.log(LOG_TAG, ' checkRatingSelected: ', checkRatingSelected);

                if (checkRatingSelected) {
                    toContinue = false;
                }

                if (!toContinue) {
                    row.backgroundColor = Alloy.Globals.rowReadColor;
                    row.color = '#000000';
                }
            }

            if (Alloy.Globals.root.template[args.id].tabbed_panels[i].damage_panels.length > 0 || Alloy.Globals.root.template[args.id].tabbed_panels[i].inspection_panels.length > 0) {
                row.hasChild = true;
                row.hasDetail = true;
            }
            //var tabbedPanelCustomRow = require('customRows/tabbedPanelCustomRow');
                var tabbedPanelCustomRow = require('customRows/tabbedPanelNarrativeRow');
                var rowContainer = new tabbedPanelCustomRow(row);
                
            if (Alloy.Globals.countNarrativesPicturesSwitch) {
                   
                data.push(rowContainer);
                
            } else {
                data.push(row);
            }
            
            //console.log('##>', JSON.stringify(data));

            row = null;
            result = null;
//            tabbedPanelCustomRow = null;
//            rowContainer = null;
//            total_number_items = null;

        }

        $.tableViewTP.setData(data);
	if (Alloy.Globals.countNarrativesPicturesSwitch) {
            $.tableViewTP.filterAttribute = 'titles';
        }      
        

        $.tableViewTP.scrollToIndex(posToScroll, {
            //animated : false
        });
        
    
}

drawInfo(-1);

function coloringCustomRow (rowId, colorText, colorBg) {
    $.tableViewTP.getSections()[0].getRows()[rowId].children[0].children[1].children[1].children[0].color = colorText;
    $.tableViewTP.getSections()[0].getRows()[rowId].children[0].children[1].children[0].children[0].tintColor = colorText;

    //total pictures label
    $.tableViewTP.getSections()[0].getRows()[rowId].children[0].children[1].children[3].children[0].color = colorText;
    $.tableViewTP.getSections()[0].getRows()[rowId].children[0].children[1].children[2].children[0].tintColor = colorText;

    //narratives text
    $.tableViewTP.getSections()[0].getRows()[rowId].children[0].children[0].children[0].color = colorText;
    $.tableViewTP.getSections()[0].getRows()[rowId].color = colorText;
    $.tableViewTP.getSections()[0].getRows()[rowId].backgroundColor = colorBg;
}

function markSelected(row) {
    Alloy.Globals.root.template[args.id].tabbed_panels[row.id].checked = true;

    if (Alloy.Globals.countNarrativesPicturesSwitch) {
        //doLog && console.log('~~ Alloy.Globals.commentRowsBGColor ', Alloy.Globals.commentRowsBGColor, ' Alloy.Globals.commentRowsFGColor ', Alloy.Globals.commentRowsFGColor, ' Alloy.Globals.rowReadColor: ', Alloy.Globals.rowReadColor );
        var colorOpt = (Alloy.Globals.rowReadColor == '#E5E5E5') ? '#000000' : Alloy.Globals.commentRowsFGColor;
        coloringCustomRow(row.id, colorOpt, Alloy.Globals.rowReadColor);
    } else {
        row.backgroundColor = Alloy.Globals.rowReadColor;
    }
}
function markDeSelected(row) {
    Alloy.Globals.root.template[args.id].tabbed_panels[row.id].checked = false;
    if (Alloy.Globals.countNarrativesPicturesSwitch) {
        var colorOptUn = (Alloy.Globals.rowReadColor == '#E5E5E5') ? (Alloy.Globals.commentRowsBGColor == '#000000') ? '#FFFFFF' : '#000000': '#000000';
        coloringCustomRow(row.id,  colorOptUn, Alloy.Globals.commentRowsBGColor);        
    }else{
        row.backgroundColor = Alloy.Globals.commentRowsBGColor;
    }
}

$.tableViewTP.backgroundColor = Alloy.Globals.commentRowsBGColor;
data = null;
function onOpen() {
    if (OS_ANDROID)
        $.searchBar.hide();
}

function onClose() {
    Alloy.Globals.tabbedWindowOpened = false;
    Alloy.Globals.inspectWindowOpened = false;
    Alloy.Globals.damageWindowOpened = false;

    var result;
    if (Alloy.Globals.root.template[args.id].tabbed_panels.checked) {
        result = true;
    } else {
        result = _.every(Alloy.Globals.root.template[args.id].tabbed_panels, function(panel) {
            return panel.checked;
        });
    }
    args.callback(result);
    
    //console.log( '~~~> $.tableViewTP: ', typeof $.tableViewTP, ', $.tabbedPanelWindow: ', typeof $.tabbedPanelWindow);
    if ($.tableViewTP && $.tabbedPanelWindow) {
        //doLog && console.log(LOG_TAG, '####### start remove TABLEVIEW #######');
        $.tabbedPanelWindow.remove($.tableViewTP);
        //doLog && console.log(LOG_TAG, '####### end remove TABLEVIEW #######');
    }
    
    //$.tabbedPanelWindow = null;
    //Alloy.Globals.cleanWindow($.tabbedPanelWindow);
}

var throttledGoToInspectionPanel = _.debounce(goToInspectionPanel, 1000, true);
function goToInspectionPanel(e) {
    // for (var key in e) {
    // doLog && console.log(LOG_TAG, 'key: ', key, ' : ', JSON.stringify(e[key]));
    // }
    var nextArgs = {};
    if (e.rowData && e.rowData.id == 0) {
        e.rowData.id = "0";
    }
    if (e.rowData && e.rowData.id) {

        nextArgs.panelId = e.rowData.id;
        nextArgs.menuItemId = args.id;
        var row = e.row;
    
        nextArgs.title = e.rowData.title;
        nextArgs.containingTab = args.containingTab;
        nextArgs.tabbedPanelWindow = $.tabbedPanelWindow;
        nextArgs.callback = function(changeColor, menuItemId, panelId) {
	try {
            
                if (Alloy.Globals.saveModeSwitch)
                    Alloy.Globals.saveInspection();

                //var newBGColor;
                if ($.tabbedPanelWindow) {

//TODO this lines to optimize performance.
                    //doLog && console.log(LOG_TAG, ' pictures added by menuItemId: ', JSON.stringify(Alloy.Globals.rootGallery.pictures));
                    //var itemsWorked = _.where(Alloy.Globals.rootGallery.pictures, {menuItemId: menuItemId});
                    //doLog && console.log(LOG_TAG, '~~~> itemsWorked: ', JSON.stringify(itemsWorked));
                    
                    //doLog && console.log(LOG_TAG, "total pictures--", Alloy.Globals.root.pictures.length);
                    //doLog && console.log(LOG_TAG, '~~~~> final total             pictures: ', Alloy.Globals.root.pictures.length);
                    //doLog && console.log(LOG_TAG, '~~~~> detail total            pictures: ', JSON.stringify(Alloy.Globals.root.pictures));

                    //doLog && console.log(LOG_TAG, '~~~~> initial total     CLONE pictures: ', Alloy.Globals.initialPictures.length);
                    //doLog && console.log(LOG_TAG, '~~~~> initial detail    CLONE pictures: ', JSON.stringify(Alloy.Globals.initialPictures));

                    var currentTotalPictures = Alloy.Globals.root.pictures.length,
                        oldTotalPictures =  Alloy.Globals.initialPictures.length,
                        diferenceOfPictures = currentTotalPictures - oldTotalPictures,
                        totalPanelsIdByMenuId = Alloy.Globals.root.template[menuItemId].tabbed_panels.length;
                    
                    //doLog && console.log(LOG_TAG, '~~~~> diff of pictures: ', diferenceOfPictures);
                    //doLog && console.log(LOG_TAG, '~~~~> total panels id: ', totalPanelsIdByMenuId);
                    
                    var sliderValue = Ti.App.Properties.getInt('sliderValue'),
                        fontSizeValueDefault = Alloy.Globals.fontSizeVal - 6;
                
                    switch (sliderValue) {
                    case 1:
                        fontSizeValue = fontSizeValueDefault;
                        break;
                    case 2:
                        fontSizeValue = fontSizeValueDefault;
                        break;
                    case 3:
                        fontSizeValue = fontSizeValueDefault;
                        break;
                    case 4:
                        fontSizeValue = fontSizeValueDefault - 6;
                        break;
                    case 5:
                        fontSizeValue = fontSizeValueDefault - 8;
                        break;
                    case 6:
                        fontSizeValue = fontSizeValueDefault - 10;
                        break;
                    }
                    
                    //########################## has no ratings #################################
                    
                    function getInspectionPanelsAndDamagePanels(damage_panels, inspection_panels) {
                        var toContinue = true;

                        var checkDamagePanelSelected = _.some(damage_panels, function(itemDamagePanel) {
                            //doLog && console.log(LOG_TAG, '^^ onClose() -> Damage Panels: ', JSON.stringify(itemDamagePanel));
            
                            var innerResultsDamagePanels = _.some(itemDamagePanel.options, function(damagePanel) {
                                //doLog && console.log(LOG_TAG, '^ onClose() -> damagePanel: ', JSON.stringify(damagePanel));
                                return damagePanel.checked;
                            });
                            if (innerResultsDamagePanels == true)
                                return true;
            
                        });
                        //doLog && console.log(LOG_TAG, ' onClose() -> checkDamagePanelSelected: ', checkDamagePanelSelected);
            
                        if (checkDamagePanelSelected) {
                            toContinue = false;
                        }
                        
                        if (toContinue) {
                            var checkInspectionPanelSelected = _.some(inspection_panels, function(itemInspectionPanel) {
                                //doLog && console.log(LOG_TAG, '^^ onClose() -> Inspection Panels: ', JSON.stringify(itemInspectionPanel));
            
                                var innerResultsInspectionPanels = _.some(itemInspectionPanel.options, function(inspectionPanel) {
                                    //doLog && console.log(LOG_TAG, '^ onClose() -> inspectionPanel: ', JSON.stringify(inspectionPanel));
                                    return inspectionPanel.checked;
                                });
                                if (innerResultsInspectionPanels == true)
                                    return true;
            
                            });
                            //doLog && console.log(LOG_TAG, ' onClose() -> checkInspectionPanelSelected: ', checkInspectionPanelSelected);
                        }
                        if (checkInspectionPanelSelected) {
                            toContinue = false;
                        }
                        
                        return toContinue;
                    }
                    
                    function getCountItemSelectedOnDamage(damage_panels) {
                        var counter = 0,
                            counter_total_items = 0,
                            global_counter = 0;
                        
                        //doLog && console.log(LOG_TAG, ' getCountItemSelectedOnDamage() -> categories checked: ', JSON.stringify(damage_panel));
                    
                        for (i in damage_panels) {
                    
                            var toContinue = true;
                            var checkDamagePanelSelected = _.some(damage_panels[i].options, function(itemDamagePanel) {
                                //doLog && console.log(LOG_TAG, 'getCountItemSelectedOnDamage >^^ Damage Panels: ', JSON.stringify(itemDamagePanel));
                                return itemDamagePanel.checked;
                            });
                            //doLog && console.log(LOG_TAG, 'getCountItemSelectedOnDamage > checkDamagePanelSelected: ', checkDamagePanelSelected);
                            if (checkDamagePanelSelected) {
                                toContinue = false;
                            }
                    
                            if (!toContinue) {
                                counter++;
                                global_counter = counter;
                            }
                            counter_total_items++;
                        }
                    
                        return {
                            counter_total_items_checked : global_counter,
                            counter_total_items : counter_total_items
                        };
                    }

                    
                    //########################## has ratings ##################################
                    
                    function getRatingsSelected(ratings) {
                        var toContinue = true;
                        var checkRatingSelected = _.some(ratings, function(itemRating) {
                            //console.log(LOG_TAG, 'getRatingsSelected() ** Ratings: ', JSON.stringify(itemRating));

                            var innerResultsRatings = _.some(itemRating.options, function(rating) {
                                //console.log(LOG_TAG, 'getRatingsSelected() * rating: ', JSON.stringify(rating));
                                return rating.checked;
                            });
                            if (innerResultsRatings == true)
                                return true;
                        });

                        //doLog && console.log(LOG_TAG, 'getRatingsSelected() checkRatingSelected: ', checkRatingSelected);

                        if (checkRatingSelected) {
                            toContinue = false;
                        }
                        return toContinue;
                    }

                    function hasChildAndDetail (damage_panels, inspection_panels) {
                        var hasChild, hasDetail;
                        hasChild = false;
                        hasDetail = false;
                        if (damage_panels.length > 0 || inspection_panels.length > 0) {
                            hasChild = true;
                            hasDetail = true;
                        }
                       
                        return {hasChild: hasChild, hasDetail: hasDetail};
                    }
                    
                    function getHasRatings(ratings, panel_id) {
                        var hasRatings = false,
                            counter_total_items = 0,
                            i = 0;
                        
                        for (i in ratings) {
                            //doLog && console.log(LOG_TAG, 'ratings.length: ', ratings.length, ', ratings[i].options.length: ' , ratings[i].options.length);
                    
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
                            hasRatings : hasRatings,
                            numDamagePanels : counter_total_items
                        };
                    }
                    
                    function getCountFullItemOnRatings(damage_panels, ratings) {
                        var counter = 0,
                            counter_total_items = 0,
                            global_counter = 0;
                        
                        //doLog && console.log (LOG_TAG, ' getCountFullItemOnRatings() -> damage panels checked: ', JSON.stringify(damage_panels));
                        //doLog && console.log (LOG_TAG, ' getCountFullItemOnRatings() -> ratigns       checked: ', JSON.stringify(ratings));
                        for (i in damage_panels) {
                    
                            var toContinue = true;
                            var checkRatingSelected = _.some(ratings[i].options, function(itemRating) {
                                //doLog && console.log(LOG_TAG, 'getCountFullItemOnRatings() >** Ratings: ', JSON.stringify(itemRating));
                                return itemRating.checked;
                            });
                            //doLog && console.log(LOG_TAG, '> checkRatingSelected: ', checkRatingSelected);
                            if (checkRatingSelected) {
                                toContinue = false;
                            }
                            
                            if (!toContinue) {
                                counter++;
                                global_counter = counter;
                            }
                            counter_total_items++;
                        }
                        
                        return {
                            counter_total_items_checked : global_counter,
                            counter_total_items : counter_total_items
                        };
                    }
                    doLog && console.log(LOG_TAG, "countNarrativesPicturesSwitch: ", Alloy.Globals.countNarrativesPicturesSwitch);
                    if (Alloy.Globals.countNarrativesPicturesSwitch) {
                    
                        var visited ;
                        _.each(Alloy.Globals.root.template[menuItemId].tabbed_panels, function(tabbed_panel, panel_id) {
                            //doLog && console.log(LOG_TAG, '~~> panelId: ', panelId, ', panel_id: ', panel_id);
                            //doLog && console.log (LOG_TAG, ' pictures selected array panelId: ', Alloy.Globals.rootGallery.pictures[panel_id].panelId);
                            
                            // if (panelId == panel_id) {
                                // console.log('x');
                                // visited = true;
                            // }else{
                                // if (panel_id == Alloy.Globals.rootGallery.pictures[panel_id].panelId) {
                                    // console.log('y');
                                    // visited = true;
                                // }else{
                                    // console.log('z');
                                    // visited = false;    
                                // }
                            // }
                            // if (visited) {
                            doLog && console.log (LOG_TAG, '***************** START TABBED PANEL ***************** panel_id = ', panel_id, ', panelId ', panelId, ', visited ', visited);
                            
                            var colorTb, totalNumberItem, hasRatings, toCompare, 
                                hasDetail =  hasChildAndDetail(tabbed_panel.damage_panels, tabbed_panel.inspection_panels).hasDetail,
                                hasChild =  hasChildAndDetail(tabbed_panel.damage_panels, tabbed_panel.inspection_panels).hasChild;
                            
                            //doLog && console.log(LOG_TAG, 'hasDetail: ', hasDetail , ', hasChild: ', hasChild);
                            doLog && console.log(LOG_TAG, 'tabbed_panel.title: ', tabbed_panel.title, ', panelId: ', panel_id, ', tabbed_panel.checked: ', tabbed_panel.checked);
                            
                            totalNumberItem = 5; //inspectionService.getTotalNumberOfNarrativesAndPicturesByMenuItemIdAndPanelId(menuItemId,panel_id);
                            doLog && console.log(LOG_TAG, 'totalNumberItem: ', JSON.stringify(totalNumberItem));
                            
                            //doLog && console.log(LOG_TAG,  '~~~~> item:       ', JSON.stringify(tabbed_panel));
                            
                            hasRatings = getHasRatings(tabbed_panel.ratings, panel_id).hasRatings;
                            
                            doLog && console.log(LOG_TAG, '~~~~> hasRatings: ', JSON.stringify(hasRatings));
                            
                            if (!hasRatings){
                                var checkInspectionsAndDamagePanels = getInspectionPanelsAndDamagePanels(tabbed_panel.damage_panels, tabbed_panel.inspection_panels);  
                                doLog && console.log (LOG_TAG, '~~> checkInspectionsAndDamagePanels: ', checkInspectionsAndDamagePanels);
                                 
                                if (!checkInspectionsAndDamagePanels) {
                                    if (tabbed_panel.damage_panels.length > 1) {
                                        doLog && console.log (LOG_TAG, '~~> has damage panel');
                                        var toCompare = getCountItemSelectedOnDamage(tabbed_panel.damage_panels),
                                            total_items_checked = toCompare.counter_total_items_checked,
                                            total_items = toCompare.counter_total_items;
                                         
                                        doLog && console.log(LOG_TAG, '~~> total_itmes_checked: ', total_items_checked, ', total_items: ', total_items);   
                                        
                                        if (total_items_checked == total_items) {
                                            changeColor = true;
                                        }else{
                                            changeColor = false;
                                        }
                                               
                                    } else{
                                        doLog && console.log (LOG_TAG, '~~> hasnot damage panel > 1');
                                        changeColor = true; 
                                    }
                                    
                                }else{
                                    if (visited && Alloy.Globals.itemRatingCompletedSwitch){
                                        changeColor = true;
                                    } else{
                                        changeColor = false;
                                    }
                                }
                                
                                
                            }else{
                                var checkRatingSelected = getRatingsSelected(tabbed_panel.ratings); //true = not checked ratings, false = checked ratings
                                doLog && console.log(LOG_TAG, '~~> checkRatingSelected: ', checkRatingSelected);
                                
                                if (!checkRatingSelected){
                                    if (tabbed_panel.damage_panels.length > 1) {
                                        doLog && console.log (LOG_TAG, '~~> has damage panel');
                                        var toCompare = getCountFullItemOnRatings(tabbed_panel.damage_panels, tabbed_panel.ratings), 
                                        total_items_checked = toCompare.counter_total_items_checked,
                                        total_items = toCompare.counter_total_items; 
                                        
                                        doLog && console.log(LOG_TAG, '~~> total_items_checkd: ', total_items_checked, ', total_items: ', total_items);
                                        
                                        if (total_items_checked == total_items) {
                                            changeColor = true;    
                                        } else {
                                            changeColor = false;
                                        }                   
                                    }else {
                                        //didnt damage panel
                                       doLog && console.log (LOG_TAG, '~~> hasnot damage panel');
                                       changeColor = true;  
                                    }
                                    
                                }else{
                                   changeColor = false; 
                                }
                            }
    
                            doLog && console.log(LOG_TAG, '~~~~> changeColor: ', changeColor); 
                            doLog && console.log(LOG_TAG, '~~~~> Alloy.Globals.rowReadColor: ', Alloy.Globals.rowReadColor, ', Alloy.Globals.commentRowsFGColor: ', Alloy.Globals.commentRowsFGColor, ', Alloy.Globals.commentRowsBGColor: ', Alloy.Globals.commentRowsBGColor);
                            
                            //colorTb = (changeColor) ? (Alloy.Globals.rowReadColor == '#E5E5E5') ? '#FFFFFF' : Alloy.Globals.commentRowsFGColor : (Alloy.Globals.commentRowsBGColor == '#E5E5E5') ? '#000000' : Alloy.Globals.commentRowsBGColor;

                            //colorTb = (changeColor) ? (Alloy.Globals.rowReadColor == '#E5E5E5') ? '#FFFFFF' : Alloy.Globals.commentRowsFGColor : (Alloy.Globals.commentRowsBGColor == '#E5E5E5') ? '#000000' : Alloy.Globals.commentRowsBGColor;
                            
                            if (changeColor) {
                                
                                if (Alloy.Globals.rowReadColor == '#E5E5E5' && Alloy.Globals.commentRowsBGColor == '#FFFFFF') {
                                   doLog && console.log ('here 1 -ok');
                                   colorTb = '#000000'; 
                                   badge_color = '#FFFFFF';
                                   badge_border_color = '';
                                } else if(Alloy.Globals.rowReadColor == '#E5E5E5' && Alloy.Globals.commentRowsBGColor == '#000000') {
                                   doLog && console.log ('here 2 - ok');
                                   colorTb = '#000000'; 
                                   badge_color = '#FFFFFF'; //
                                   badge_backgroundColor = '#000000';
                                   badge_border_color = '';
                                }else {
                                   doLog && console.log ('here 3');
                                   colorTb = 'green'; 
                                   badge_color = 'green';
                                   badge_border_color = 'green';
                                }
                                
                                newBGColor = Alloy.Globals.rowReadColor;
                            } else {
                                if (Alloy.Globals.commentRowsBGColor == '#000000') {
                                   doLog && console.log ('here 4 -ok ');
                                   colorTb = '#FFFFFF'; 
                                   badge_color = '#000000';
                                   badge_backgroundColor = '#FFFFFF';
                                   badge_border_color = '#FFFFFF';
                                }else {
                                   doLog && console.log ('here 5 - ok');
                                   colorTb = '#000000'; 
                                   badge_color = '#FFFFFF';
                                   badge_border_color = '';
                                }
                                
                                
                                newBGColor = Alloy.Globals.commentRowsBGColor;
                            }
                            
                            doLog && console.log(LOG_TAG, '~~~~> colorTb: ', colorTb, ', newBGColor: ', newBGColor); 
    
                                                         
                            //console.log(JSON.stringify($.tableViewTP.getSections()[0].getRows()[panel_id].children[0].children[1].children[0]));
                            //console.log(JSON.stringify($.tableViewTP.getSections()[0].getRows()[panel_id].children[1].children[1].children[1].children[0]));
                            //console.log(JSON.stringify($.tableViewTP.getSections()[0].getRows()[panel_id].children[0].children[1].children[3].children[0]));
                            
                            //#total Narratives items selected label
                          
                            $.tableViewTP.getSections()[0].getRows()[panel_id].children[0].children[1].children[0].children[0].text = totalNumberItem.total_narratives_selected;
                            $.tableViewTP.getSections()[0].getRows()[panel_id].children[0].children[1].children[0].children[0].color = badge_color;
                            $.tableViewTP.getSections()[0].getRows()[panel_id].children[0].children[1].children[0].children[0].backgroundColor = badge_backgroundColor;
                            $.tableViewTP.getSections()[0].getRows()[panel_id].children[0].children[1].children[0].children[0].index = 1;
                            $.tableViewTP.getSections()[0].getRows()[panel_id].children[0].children[1].children[0].children[0].opacity = 1;
                            $.tableViewTP.getSections()[0].getRows()[panel_id].children[0].children[1].children[0].children[0].font = {
                                fontWeight: 'bold',fontSize : 11
                            };
                            
                            //total pictures label
                            $.tableViewTP.getSections()[0].getRows()[panel_id].children[0].children[1].children[1].children[0].text = totalNumberItem.total_pictures;
                            $.tableViewTP.getSections()[0].getRows()[panel_id].children[0].children[1].children[1].children[0].color = badge_color;
                            $.tableViewTP.getSections()[0].getRows()[panel_id].children[0].children[1].children[1].children[0].backgroundColor = badge_backgroundColor;
                            $.tableViewTP.getSections()[0].getRows()[panel_id].children[0].children[1].children[1].children[0].font = {
                                fontWeight: 'bold', fontSize : 11
                            };
                            
                            //narratives text - ok
                            $.tableViewTP.getSections()[0].getRows()[panel_id].children[0].children[0].children[0].text = Alloy.Globals.root.template[args.id].tabbed_panels[panel_id].title;
                            $.tableViewTP.getSections()[0].getRows()[panel_id].children[0].children[0].children[0].font = {
                                fontSize : Alloy.Globals.fontSizeVal
                            };
                            $.tableViewTP.getSections()[0].getRows()[panel_id].children[0].children[0].children[0].color = colorTb;
                            $.tableViewTP.getSections()[0].getRows()[panel_id].children[0].children[0].children[0].hasDetail = hasDetail;
                            $.tableViewTP.getSections()[0].getRows()[panel_id].children[0].children[0].children[0].hasChild = hasChild;
                            
                            //row backgrounds
                            $.tableViewTP.getSections()[0].getRows()[panel_id].color = colorTb;
                            $.tableViewTP.getSections()[0].getRows()[panel_id].backgroundColor = newBGColor;
                            
                            totalNumberItem = null,
                            colorTb = null,
                            changeColor = null, 
                            newBGColor = null,
                            toCompare = null, 
                            hasRatings = null,
                            hasDetail = null,
                            hasChild = null,
                            checkRatingSelected = null,
                            total_items_checked = null,
                            total_items = null;
                            
                            checkInspectionsAndDamagePanels = null;
                            // visited = null;
                            // }
                        
                        });
                        
                        //console.log('@@@ ', JSON.stringify($.tableViewTP.getSections()[0].getRows()[panelId].children[0].children[1].children[1].children[0] ) );
                        //console.log('@@@ ', JSON.stringify($.tableViewTP.getSections()[0].getRows()[panelId].children[0].children[1].children[2].children[0] ) );
                        //console.log('@@@ ', JSON.stringify($.tableViewTP.getSections()[0].getRows()[panelId].children[0].children[1].children[1].children[0] ) );
                        //console.log('@@@ ', JSON.stringify($.tableViewTP.getSections()[0].getRows()[panelId].children[0].children[1].children[1].children[0]));
                    } else {
                        
                        if (changeColor) {
                            newBGColor = Alloy.Globals.rowReadColor;
                        } else {
                            newBGColor = Alloy.Globals.commentRowsBGColor;
                        }
    
                        var colorTb = (changeColor) ? (Alloy.Globals.rowReadColor == '#E5E5E5') ? '#000000' : Alloy.Globals.commentRowsFGColor : (Alloy.Globals.commentRowsBGColor == '#E5E5E5') ? '#000000' : Alloy.Globals.commentRowsFGColor;
            
                        doLog && console.log(LOG_TAG, "total pictures--", Alloy.Globals.root.pictures.length);
                        
                        
                        if (OS_ANDROID) {
 
                            //Alloy.Globals.apm.leaveBreadcrumb(LOG_TAG + ' goToInspectionPanel() -> CALLBACK     .getSections()[0].getRows() : ' + $.tableViewTP.getSections()[0].getRows().length);
                            //Alloy.Globals.apm.leaveBreadcrumb(LOG_TAG + ' goToInspectionPanel() -> CALLBACK                       getData() : ' + $.tableViewTP.getData().length);
 
                            $.tableViewTP.getSections()[0].getRows()[panelId].backgroundColor = newBGColor;
                            $.tableViewTP.getSections()[0].getRows()[panelId].color = colorTb;
                            $.tableViewTP.getSections()[0].getRows()[panelId].title = Alloy.Globals.root.template[args.id].tabbed_panels[panelId].title + ' ' + counterItem;
                            $.tableViewTP.getSections()[0].getRows()[panelId].id = panelId;
                            $.tableViewTP.getSections()[0].getRows()[panelId].hasDetail = hasDetail;
                            $.tableViewTP.getSections()[0].getRows()[panelId].hasChild = hasChild;
                            $.tableViewTP.getSections()[0].getRows()[panelId].font = {
                                fontSize : Alloy.Globals.fontSizeVal
                            };
 
                        } else {

                            $.tableViewTP.updateRow(panelId, {
                                font : {
                                    fontSize : Alloy.Globals.fontSizeVal
                                },
                                color : colorTb,
                                backgroundColor : newBGColor,
                                title : Alloy.Globals.root.template[args.id].tabbed_panels[panelId].title,
                                id : panelId,
                                hasDetail : true,
                                hasChild : true
                            });
 
                        // //$.tableViewTP.setData([]);
                        // //drawInfo(panelId);
 
                        }    
                    }// Switch between tru or false
                    
                }
                
                
            } catch(err) {
                

            }
    
        };

        nextArgs.closePrev = function() {
            //Ti.API.info("closePrev on tabbedPanel");
            $.tabbedPanelWindow = null;
        };
        //doLog && console.log(LOG_TAG, ' nextArgs before to open: ', JSON.stringify(e));
        var inspectionPanelWindow = Alloy.createController('inspectionPanelWindow', nextArgs).getView();
        
        args.containingTab.open(inspectionPanelWindow, {
            //animated : true
        });
    }
    
}

function searchBarOnCancel(e) {
    e.source.value = '';
}

function destroyController() {
    //Alloy.Globals.events.off('orientationchange');
    doLog && console.log (LOG_TAG, 'destroyController()');
    $.destroy();
    $.off();
  // remove any listeners you added to global proxies
  
  // and custom global dispatchers (all at once, via context)
  //myDispatcher.off(null, null, $);

  // in turn, let controllers of required views clean up
  //$.requiredView.cleanup();

  // and close windows of controllers you created, triggering them to clean up as well
  //someWindow.getView().close();

  // this is not needed if someController cleans up well and we have the only reference
  // someController = null;  
}


doLog && console.log (LOG_TAG, ' orientation global ~~> isLands: : ', Alloy.Globals.isLandscape, ' isPort: ', Alloy.Globals.isPortrait);

if (Alloy.Globals.countNarrativesPicturesSwitch) {
    Alloy.Globals.events.on('orientationchange', function() {
        
        doLog && console.log(LOG_TAG, '~~~~~~~~~~~~~~~~~~~~~~~~~~ START ORIENTATION EVENT ()~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //console.log('$$', Alloy.Globals.isLandscape, Alloy.Globals.isPortrait);
        if (Alloy.Globals.isLandscape) {
           
                $.tableViewTP.setData([]);
                destroyController();
                drawInfo(-1);
           
            doLog && console.log(LOG_TAG, '**** 1.0 ****');

        } else if (Alloy.Globals.isPortrait) {
                $.tableViewTP.setData([]);
                destroyController();
                drawInfo(-1);
                
            doLog && console.log(LOG_TAG, '**** 1.1 ****');

        }
        
        doLog && console.log(LOG_TAG, '~~~~~~~~~~~~~~~~~~~~~~~~~~ END ORIENTATION EVENT ()~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    });
}

