var doLog = Ti.App.Properties.getBool('doLog');

/**
 * @property {String} LOG_TAG - Tag of log to use on current document
 */
var LOG_TAG = '[index.js]';

doLog && console.log(LOG_TAG, ' Start');


$.tabGroup.open();

Alloy.Globals.tabGroup = $.tabGroup;





function onOpen() {
}

function onLoad() {
    var fdir = Alloy.Globals.fdir;
    var inspectionDir = Alloy.Globals.inspectionDir;

    if (OS_IOS) {

        var fileManAtInspectionDir = Ti.Filesystem.getFile(inspectionDir, 'fileman.json');
        var fileManAtDir = Ti.Filesystem.getFile(fdir, 'fileman.json');
        // Check conditions
        if (!fileManAtInspectionDir.exists() && fileManAtDir.exists())// Show
        // message
        // to
        // download
        // template
        {
            fileManAtInspectionDir.write(fileManAtDir.read());
        }

        var templatesAtInspectionDir = Ti.Filesystem.getFile(inspectionDir, 'templates');
        var templatesAtDir = Ti.Filesystem.getFile(fdir, '/templates');
        // Check conditions
        if (!templatesAtInspectionDir.exists() && templatesAtDir.exists())// Show
        // message
        // to
        // download
        // template
        {
            var dossier = require('dossier');
            dossier.copy(templatesAtDir.nativePath, templatesAtInspectionDir.nativePath);
        }

    }
    
    // Load Libs
    var xmlEncoder = require('xmlEncoder');

    // Always do this on load
    var configFileEncr = Ti.Filesystem.getFile(fdir, 'config_encr.json');
    
    //doLog && console.log (LOG_TAG, 'configFileEncr: ', JSON.stringify(configFileEncr), ', configFileEncr: ', configFileEncr.exists());
    // Login info encryption
    var fileMan = Ti.Filesystem.getFile(inspectionDir, 'fileman.json');
    
    //doLog && console.log (LOG_TAG, 'fileMan: ', JSON.stringify(fileMan), ', FileMan.exist(): ', fileMan.exists() );
    
    if (!(configFileEncr.exists() && fileMan.exists() ))// Perform initial
    // setup/download
    {
        doLog && console.log(LOG_TAG, " setup: if");
        $.tabGroup.setActiveTab(0);
    } else// fileMan exists
    {
        var fileManJson = JSON.parse(fileMan.read().text);
    
        //doLog && console.log (LOG_TAG, 'fileManJson: ', fileManJson);
    
        doLog && console.log(LOG_TAG, "~~ onLoad() ~~ setup: else");
        
        doLog && console.log(LOG_TAG, "~~ onLoad() ~~ setup: fileman");
        var currInsp = Alloy.Globals.getCurrentInspection();
        var templates = fileManJson.templates;
        
        
        doLog && console.log(LOG_TAG, "~~ onLoad() ~~ setup: current--", currInsp, "--template--", templates);
        if (templates == null || templates.length == 0)// Download template
            $.tabGroup.setActiveTab(0);
        else if (currInsp == null || currInsp.length == 0)// Select template
            // for inspection
            $.tabGroup.setActiveTab(1);
        else 
            
            $.tabGroup.setActiveTab(2);
     }   
}

onLoad();

/*
* Some usefull Events
*/
// Stores last tab opened
var lastTabIndex = 0;

// onFocus event do thing accordingly

function onFocus(e) {
    doLog && console.log(LOG_TAG, "~~ onFocus() ~~ tab got focus at---", e.index, ' lastTabIndex: ', lastTabIndex);
               
    if (e.index >= 0) {
        var currInsp = Alloy.Globals.getCurrentInspection();
        doLog && console.log(LOG_TAG, "~~ onFocus() ~~ currInsp " + currInsp);
        if (currInsp) {
            
            if (e.index == 1 && lastTabIndex == 1) {
                doLog && console.log(LOG_TAG, "~~ onFocus() ~~ inspectionTab $.inspectTab.save() info");
                //$.inspectTab.save();
            }
            if (e.index != 2 && lastTabIndex == 2) {
                doLog && console.log(LOG_TAG, "~~ onFocus() ~~ inspectionTab $.inspectTab.save() info");
                //$.inspectTab.save();
            }
        }
        
        // Reload inspection window
        if (e.index == 2) {
            doLog && console.log(LOG_TAG, "~~ onFocus() ~~ reloading inspectionTab window at tab index---", e.index);
            // inspectWindow.reloadInspection();
            $.inspectTab.reload();
        }
        // Reload manage window
        if (e.index == 1) {

            doLog && console.log(LOG_TAG, "~~ onFocus() ~~ reloading manageTab window at tab index---", e.index);
            // manageWindow.initialize();
            $.manageTab.reload();

        }
        
        if (e.index == 0) {

            doLog && console.log(LOG_TAG, "~~ onFocus() ~~ reloading syncTab window at tab index---", e.index);
            // syncWindow.reloadSyncWin();
            function callbackOn() {
                alert ('here');
            }
            $.syncTab.reload();
            // syncWin.fireEvent('reloadSyncWin', e); //Different event name
            // else menu reload event fired
        }

        lastTabIndex = e.index;
    }
}
