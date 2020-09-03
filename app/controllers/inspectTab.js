var xmlEncoder = require("xmlEncoder");
var fdir = Alloy.Globals.fdir;
var inspectionDir = Alloy.Globals.inspectionDir;

var data = [];
var argsForHeaderView = {};
argsForHeaderView.parent = $.inspectTab;

var doLog = true;
var LOG_TAG = '[inspectTab]';

doLog && console.log(LOG_TAG, ' Start');


Alloy.Globals.updatePhotosJSON = function(a, b) {
    console.log('into ----> Alloy.Globals.updatePhotosJSON()');
    var photosFile = Ti.Filesystem.getFile(Alloy.Globals.inspectionDir + "/inspections/" + Alloy.Globals.getCurrentInspection(), 'Photos.json');
    xmlEncoder.xmlPhotoEncode(Alloy.Globals.inspectionDir + "/inspections/" + Alloy.Globals.getCurrentInspection(), photosFile, Alloy.Globals.root.pictures, Alloy.Globals.root.videos);
};


Alloy.Globals.saveVideo = function(menuItem, caption, panelId, damagePanelId, callback, currentWindow) {
    var doLog = Ti.App.Properties.getBool('doLog');

    doLog && console.log('[Alloy.js] - saveVideo()');
    var inspectionName = Alloy.Globals.getCurrentInspection();
    var nextVideoId = Alloy.Globals.getNextPhotoID();

    var folder = Ti.Filesystem.getFile(Alloy.Globals.inspectionDir + "/inspections/", inspectionName);

    /*if (OS_ANDROID) {
     if (Ti.Android.hasPermission('android.permission.RECORD_AUDIO'))
     recordVideos_Android(inspectionName, nextVideoId, folder, menuItem, caption, panelId, damagePanelId, callback, currentWindow);
     else {
     //requestPermission
     Ti.Android.requestPermissions(['android.permission.RECORD_AUDIO'], function() {
     recordVideos_Android(inspectionName, nextVideoId, folder, menuItem, caption, panelId, damagePanelId, callback, currentWindow);
     });
     }

     } else {*/

    doLog && console.log("[Alloy.js] - Starting video recording");
    require("/permissions").checkCameraPermission(function() {
        try {
            Ti.Media.showCamera({
                mediaTypes : [Titanium.Media.MEDIA_TYPE_VIDEO],
                videoMaximumDuration : 30000,
                //videoQuality : Titanium.MEDIA.QUALITY_LOW,
                success : function(e) {
                    doLog && console.log("[Alloy.js] - saving video");
                    doLog && console.log("[Alloy.js] - JSON.stringify(e):" + JSON.stringify(e));
                    doLog && console.log("[Alloy.js] - e.media.length:" + e.media.length);
                    var tempFile = Ti.Filesystem.getFile(Alloy.Globals.inspectionDir + "/inspections/" + inspectionName, nextVideoId + '.mp4');
                    tempFile.write(e.media);
                    //tempFile.deleteFile();
                    doLog && console.log("[Alloy.js] - file Exist");
                    var f = e.videoURL;

                    var activeMovie = Titanium.Media.createVideoPlayer({
                        url : tempFile.resolve(),
                        mediaControlStyle : Titanium.Media.VIDEO_CONTROL_DEFAULT,
                        scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FILL
                    });

                    activeMovie.requestThumbnailImagesAtTimes([1], Titanium.Media.VIDEO_TIME_OPTION_NEAREST_KEYFRAME, function(response) {

                        var thumbFile = Ti.Filesystem.getFile(Alloy.Globals.inspectionDir + "/inspections/" + inspectionName, nextVideoId + '.jpg');
                        thumbFile.write(response.image);

                        var imageView = Ti.UI.createView({
                            width : "352",
                            height : "288",
                            backgroundImage : thumbFile.nativePath
                        });

                        var lbl = Titanium.UI.createLabel({
                            text : " Video ",
                            backgroundColor : "#fff",
                            font : {
                                fontSize : 20
                            },
                            color : "black",
                            left : 5,
                            top : 5
                        });
                        imageView.add(lbl);
                        var eventCalled = 0;
                        imageView.addEventListener('postlayout', function(e) {
                            if (eventCalled == 0) {
                                eventCalled++;
                                doLog && console.log('[Alloy.js] - Inside postlayout event');
                                doLog && console.log('[Alloy.js] - size : ' + imageView.size.width + ' x ' + imageView.size.height);
                                var blob = imageView.toImage();

                                doLog && console.log("[Alloy.js] - JSON.stringify(blob):" + JSON.stringify(blob));
                                doLog && console.log('[Alloy.js] - blob.length : ' + blob.length);
                                doLog && console.log('[Alloy.js] - blob.apiName : ' + blob.apiName);
                                var thumbFileNew = Ti.Filesystem.getFile(Alloy.Globals.inspectionDir + "/inspections/" + inspectionName, nextVideoId + '.jpg');
                                thumbFileNew.write(blob);
                                window.close();
                                var videoFile = {
                                    menuItem : menuItem,
                                    caption : caption,
                                    section : panelId,
                                    id : damagePanelId,
                                    imageFileName : thumbFileNew.getName(),
                                    thumb : thumbFileNew.getName(),
                                    video : tempFile.getName(),
                                    isVideo : true
                                };

                                //sendVideoObject(videoFile, imageView.toImage(), tempFile);

                                Alloy.Globals.root.pictures.push(videoFile);
                                console.log('++++> ', JSON.stringify(Alloy.Globals.root.pictures) );
                                callback(videoFile);

                            }
                        });
                        var window = Titanium.UI.createWindow();
                        window.add(imageView);
                        window.open();
                    });
                }
            });
        } catch(e) {
            doLog && console.log('[Alloy.js] - Error: ', JSON.stringify(e));
        }
    });
    ///}

}; 


//$.tableView.headerView = Alloy.createController('sliderHeaderView', argsForHeaderView).getView();
$.tableView.backgroundColor = Alloy.Globals.commentRowsBGColor;
$.inspectWindow.tableView = $.tableView;

function createMenuRow(row_data, hasTabedPanel) {
    //doLog && console.log(LOG_TAG, ' createMenuRow()', validate.combineRowAndLabelTextColor());
    //Ti.API.info(row_data.title);
    //var row = null;
    var rowLabel = Ti.UI.createLabel({
        font : {
            fontSize : Alloy.Globals.fontSizeVal
        },
        //color : (hasTabedPanel) ? '#000000' : validate.combineRowAndLabelTextColor(), //Alloy.Globals.commentRowsFGColor,
        color : '#000000',
        text : row_data.title,
        menuId : row_data.id,
        top : '5dp',
        bottom : '5dp',
        height : Ti.UI.SIZE,
        left : '10dp',
        right : '10dp',
        sourceType : 'ROW_HIGHLIGHTER'
    });
    var row = null;
    var row = Ti.UI.createTableViewRow({
        className : 'comment',
        backgroundColor : Alloy.Globals.commentRowsBGColor,
        rowData : row_data
    });
    row.add(rowLabel);
    return row;
};

function onRowClick(e) {
    doLog && console.log(LOG_TAG, 'e.source.sourceType', e.source.sourceType);
    switch (e.source.sourceType) {
    case "ROW_HIGHLIGHTER":
        doLog && console.log(LOG_TAG, 'ROW_HIGHLIGHTER');
        throttledGoToTabbedPanel(e);
        break;
    }
}

function loadInspectionJson() {

    var currInsp = Alloy.Globals.getCurrentInspection();
    Ti.API.info("currInsp:" + currInsp);
    if (currInsp != null && currInsp != '') {
        $.inspectWindow.title = currInsp;
        var inspectionFile = Ti.Filesystem.getFile(inspectionDir + "/inspections/" + currInsp, 'Inspection.json');
        var photosFile = Ti.Filesystem.getFile(inspectionDir + "/inspections/" + currInsp, 'Photos.json');
        var videosFile = Ti.Filesystem.getFile(inspectionDir + "/inspections/" + currInsp, 'Videos.json');
        var insertsFile = Ti.Filesystem.getFile(inspectionDir + "/inspections/" + currInsp, 'Inserts.json');
        var colorsFile = Ti.Filesystem.getFile(inspectionDir + "/inspections/" + currInsp, 'Colors.json');

        // check if JSON version exists for Inserts file, otherwise load Xml version
        if (!insertsFile.exists()) {
            insertsFile = Ti.Filesystem.getFile(inspectionDir + "/inspections/" + currInsp, 'Inserts.xml');
            Alloy.Globals.root.insertsFileType = 'XML';
        } else {
            Alloy.Globals.root.insertsFileType = 'JSON';
        }

        /*
         * Loading the Inspection.json file if deleted
         */
        if (!inspectionFile.exists()) {
            var insFile = Ti.Filesystem.getFile(inspectionDir + "/inspections/" + currInsp, 'Inspection_Temp.json');
            if (insFile.exists()) {
                insFile.rename('Inspection.json');
            }
        }

        /*
         * loading the photos.json file if deleted
         */
        if (!photosFile.exists()) {
            var photoTemp = Ti.Filesystem.getFile(inspectionDir + "/inspections/" + currInsp, 'Photos_Temp.json');
            if (photoTemp.exists()) {
                photoTemp.rename('Photos.json');
            }
        }

        /*
         * loading Colors.json file, if exists
         */
        if (colorsFile.exists()) {
            var colorsJSON = colorsFile.read();
            Alloy.Globals.root.colorsJSON = JSON.parse(colorsJSON);
        }

        /*
         * Loading inserts.xml if exits
         */
        if (insertsFile.exists()) {
            if (Alloy.Globals.root.insertsFileType == "JSON") {
                var insertsJSON = insertsFile.read();
                Alloy.Globals.root.insertsJSON = JSON.parse(insertsJSON);
            } else {
                Alloy.Globals.root.insertsXML = insertsFile.read();
            }
        }
        
        try {
            var inspectionJson = inspectionFile.read();
            Alloy.Globals.root.template = JSON.parse(inspectionJson);

            var photosJson = photosFile.read().text;
            var allMedia = JSON.parse(photosJson);

            Alloy.Globals.root.currInsp = currInsp;
            var videos = [];
            var pics = [];
            for (var i = 0; i < allMedia.length; i++) {
                //check for video or normal image file.
                if (allMedia[i].hasOwnProperty('imageFileName'))
                    pics.push(allMedia[i]);
            }
            Alloy.Globals.root.pictures = pics;

            var videosFileText = videosFile.read().text;
            var videosFileJSON = JSON.parse(videosFileText);

            for (var i = 0; i < videosFileJSON.length; i++) {
                videos.push(videosFileJSON[i]);
            }

            Alloy.Globals.root.videos = videos;
            //Ti.API.info("videos:"+Alloy.Globals.root.videos.length);

            videos = null;
            pics = null;

        } catch(err) {
            //Ti.API.info("Eror loading inspection--" + JSON.stringify(err));
            //alert("Error opening inspection. Please contact the Help Desk.");
        }
        
    } else {
        $.inspectWindow.title = 'Inspect';
    }

}


function prepareTableviewData() {
    //console.log('+++> ', JSON.stringify(Alloy.Globals.root.template) );
    if (Alloy.Globals.root.template.length > 0) {
        data = [];
        for (i in Alloy.Globals.root.template) {
            var menu_item = Alloy.Globals.root.template[i];
            //doLog && console.log(LOG_TAG, ' menu_item: ', JSON.stringify(menu_item));
            //doLog && console.log(LOG_TAG, ' menu_item: ', JSON.stringify(menu_item.tabbed_panels));
            var row_data = {
                title : menu_item.title,
                id : i
            };
            if (menu_item.tabbed_panels.length > 0) {
                row_data.hasChild = true;
            } else {
                row_data.hasChild = false;
            }

            var result = _.every(Alloy.Globals.root.template[i].tabbed_panels, function(panel) {
                //console.log(LOG_TAG, 'panel: ',  JSON.stringify(panel));
                return panel.checked;
            });
            //doLog && console.log(LOG_TAG,'result: ', result );
            var row = createMenuRow(row_data, result);
            //doLog && console.log(LOG_TAG,'Alloy.Globals.rowReadColor: ', Alloy.Globals.rowReadColor, ' result: ', result );

            var colorIP = (result) ? (Alloy.Globals.rowReadColor == '#E5E5E5') ? '#000000' : Alloy.Globals.commentRowsFGColor : (Alloy.Globals.commentRowsBGColor == '#E5E5E5') ? '#000000' : Alloy.Globals.commentRowsFGColor;
            if (result) {
                row.backgroundColor = Alloy.Globals.rowReadColor;
                row.color = colorIP;
            }

            data.push(row);
            row = null;
            result = null;
        }
    } else {
        //Display message to sync template
        var alertNoTemplate = Titanium.UI.createAlertDialog({
            title : 'Sync First',
            message : 'No current inspection or templates found. Download a template first.',
            buttonNames : ['OK']
        });
        alertNoTemplate.addEventListener('click', function(e) {
            
            
        });
        alertNoTemplate.show();
    }
}

$.inspectTab.prepareTableviewData = prepareTableviewData;
function refreshTableview() {
    $.tableView.setData(data);
    data = null;
}

function checkMenuSelected(menuIndex) {
    var result = _.every(Alloy.Globals.root.template[menuIndex].tabbed_panels, function(panel) {
        return panel.checked;
    });
    return result;
}

$.inspectTab.refreshTableview = refreshTableview;
Alloy.Globals.refreshMenuTable = function() {
    $.inspectTab.prepareTableviewData();
    $.inspectTab.refreshTableview();
};
var throttledGoToTabbedPanel = _.debounce(goToTabbedPanel, 1000, true);
function goToTabbedPanel(e) {

    var row = (OS_IOS) ? e.row : e.row.rowData;
    if (row.rowData.hasChild) {
        var args = {};
        args.id = row.rowData.id;
        args.title = row.rowData.title;
        args.containingTab = $.inspectTab;
        args.callback = function(changeColor) {

            doLog && console.log(LOG_TAG, "goToTabbedPanel callback " + changeColor);

            if ($.tableView) {
                if (changeColor) {
                    row.backgroundColor = Alloy.Globals.rowReadColor;
                } else {
                    row.backgroundColor = Alloy.Globals.commentRowsBGColor;
                }
            }
        };
        var tabbedPanel = Alloy.createController('tabbedPanel', args).getView();

        tabbedPanel.addEventListener('close', function(e) {
            save();
        });

        $.inspectTab.open(tabbedPanel, {
            //animated : true
        });
    }
}

function onLoad() {

    var currInsp = Alloy.Globals.getCurrentInspection();
    console.log('currInsp: ', currInsp);
    if (!currInsp) {
        $.tableView.setData([]);
        $.inspectWindow.title = 'No Inspection Found';
        return;
    }
    Ti.API.info("currInsp:" + currInsp);
    loadInspectionJson();
    prepareTableviewData();
    refreshTableview();
    Alloy.Globals.inspectionLoaded = true;
    
}

exports.reload = function() {

    onLoad();
};

function save() {

    var currInsp = Alloy.Globals.getCurrentInspection();

    if (currInsp && Alloy.Globals.root.template.length > 0) {
        if (currInsp.length == 0) {
            root.template = [];
            data = [];
        } else {

        }

    }

}

exports.save = save;
Alloy.Globals.saveInspection = save;