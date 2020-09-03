/**
 * @property {Boolean} doLog
 * TRUE, if the log message will be show on console.
 * FALSE, if the log message will be hide on console.
 */
var doLog = Ti.App.Properties.getBool('doLog');

/**
 * @property {String} LOG_TAG - Tag of log to use on current document
 */
var LOG_TAG = '[inspectionsHelper]';

doLog && console.log(LOG_TAG, ' Start');

exports.getTotalNumberOfNarrativesAndPicturesByMenuItemIdAndPanelId = function(menuItemId, panelId) {
    var doLog = false;
    var template = Alloy.Globals.root.template,
        damage_panels = template[menuItemId].tabbed_panels[panelId].damage_panels,
        inspection_panels = template[menuItemId].tabbed_panels[panelId].inspection_panels,
        pictures = Alloy.Globals.root.pictures; 
    
   
    var total_damage_panels = 0,
        total_inspection_panels = 0,
        total_pictures = 0,
        total_narratives = 0,
        total_narratives_selected = 0,
        total_damage_panels_selected = 0,
        total_inspection_panels_selected = 0;
        
    doLog && console.log(LOG_TAG, '~~~~~ START ~~~~~~ ');
    doLog && console.log(LOG_TAG, '~~~~ DAMAGE_PANELS ~~~~~~ ');
    _.each(damage_panels, function(damage_panel) {
        
        //doLog && console.log(LOG_TAG, '~~ panelId: ', panelId, ', total_damage_panels:', total_damage_panels, ' Partial => dam_panels: ', JSON.stringify(_.size(damage_panel.options)));
        total_damage_panels = total_damage_panels + _.size(damage_panel.options);

        var damage_panel_title = damage_panel.title;
        var menuItemTitle = template[menuItemId].title;

        _.each(pictures, function(picture, i) {
            //doLog && console.log(LOG_TAG, 'picture.menuItem: ', picture.menuItem, ' - ',  menuItemTitle, '~~ picture.section: ', picture.section, ' - ', damage_panel.title);
            if (picture.menuItem && picture.menuItem == menuItemTitle && picture.section == damage_panel.title) {
                total_pictures = total_pictures + 1;
            }
        });
        
        _.each(damage_panel.options, function(itemDamagePanel) {
            if(itemDamagePanel.checked) {
               //doLog && console.log(LOG_TAG, 'getTotalNumberOfNarrativesAndPicturesByMenuItemIdAndPanelId >^^ Damage Panels: ', JSON.stringify(itemDamagePanel.checked));
               total_damage_panels_selected = total_damage_panels_selected + 1;
            }
        });
        
    });

    doLog && console.log(LOG_TAG, '*** total_pictures: ', total_pictures);
    doLog && console.log(LOG_TAG, '*** total_damage_panels: ', total_damage_panels);
    doLog && console.log(LOG_TAG, '**** total_damage_panels_selected: ', total_damage_panels_selected);
    
    _.each(inspection_panels, function(inspection_panel) {

        //doLog && console.log(LOG_TAG, '## panelId: ', panelId, ', total_inspection_panels:', total_inspection_panels, ' Partial => ins_panels: ', JSON.stringify(_.size(inspection_panel.options)));
        total_inspection_panels = total_inspection_panels + _.size(inspection_panel.options);

        _.each(inspection_panel.options, function(itemInspectionPanel) {
            
            if(itemInspectionPanel.checked) {
               //doLog && console.log(LOG_TAG, 'getTotalNumberOfNarrativesAndPicturesByMenuItemIdAndPanelId >^^ Inspections Panels: ', JSON.stringify(itemInspectionPanel.checked));
               total_inspection_panels_selected = total_inspection_panels_selected + 1;
            }
        });
    });

    doLog && console.log(LOG_TAG, '*** total_inspection_panels: ', total_inspection_panels);
    doLog && console.log(LOG_TAG, '**** total_inspection_panels_selected: ', total_inspection_panels_selected);
    total_narratives = total_damage_panels + total_inspection_panels;
    total_narratives_selected = total_damage_panels_selected + total_inspection_panels_selected;
    doLog && console.log(LOG_TAG, '*** total narratives: ', total_narratives);
    doLog && console.log(LOG_TAG, '*** total narratives_selected: ', total_narratives_selected);
    doLog && console.log(LOG_TAG, '~~~~~ END ~~~~~~ ');
    doLog && console.log(LOG_TAG, '      ');
        
    return { total_narratives: total_narratives, total_pictures: total_pictures, total_narratives_selected:total_narratives_selected};
};

exports.getTotalItemsCheckedOfDamagePanelAndInspectionPanel = function(menuItemId, panelId){

    var counter = 0,
        counter_total_items = 0,
        global_counter = 0;
    var damage_panels = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels;
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
    
};


exports.getTotalNumberOfPictures = function() {
    var pictures = Alloy.Globals.root.pictures,
        total_pictures = 0,
        counter_pics = 0;

    if (pictures.length > 1) {
        _.each(pictures, function(picture, i) {
            if ('id' in picture && picture.id > 0) {
                console.log('images', picture.id);
                counter_pics = i;

            }
        });
        total_pictures = counter_pics;
    }
    return total_pictures;
    console.log('tt pic:', total_pictures);
};

exports.getCountItemOnDamage = function() {
    var p = Alloy.Globals.root.template;

    var resulter = _.each(p, function(val) {
        
        _.each(val.tabbed_panels, function(v) {

            console.log('dam_panels: ', JSON.stringify(_.size(v.damage_panels)));
            _.each(v.damage_panels, function(dp) {
                console.log('#dp opt: ', JSON.stringify(_.size(dp.options)));
            });

            console.log('ins_panels: ', JSON.stringify(_.size(v.inspection_panels)));
            _.each(v.inspection_panels, function(ip) {
                console.log('#ip opt: ', JSON.stringify(_.size(ip.options)));
            });

        });

    });
}; 