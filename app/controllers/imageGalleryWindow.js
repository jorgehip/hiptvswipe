var args = arguments[0] || {};
var menuItemId = args.menuItemId;
var panelId = args.panelId;
var damagePanelIndex = args.damagePanelIndex;

var fdir = Alloy.Globals.fdir;
var inspectionDir = Alloy.Globals.inspectionDir;


var fontSizeVal = 15;
var color = '#000';

var doLog = Ti.App.Properties.getBool("doLog");

/**
 * @property {String} LOG_TAG - Tag of log to use on current document
 */
var LOG_TAG = '[ImageGalleryWindow]';

doLog && console.log(LOG_TAG, ' Start');

/* Array to keep track of the controllers creates for the rows clips */
var listOfRowsMediaClips = [];

function onClose() {
    doLog && console.log(LOG_TAG, "onClose()");
    args.callback(panelId, damagePanelIndex);
    $.window.remove($.tableView);
    menuItemId = null;
    panelId = null;
    damagePanelIndex = null;
    fontSizeVal = null;
    color = null;
}

function toggleRowMoving() {
    doLog && console.log(LOG_TAG, 'toggleRowMoving()');
    closeSwipeRowsByPosition(-1,1);
    $.tableView.moving = !$.tableView.moving;
    Alloy.Globals.rowMovingState = $.tableView.moving;
}

if (Alloy.Globals.rowMovingState)
    $.tableView.moving = true;


function createNewRow(pic_info){
    doLog && console.log(LOG_TAG, " createNewRow(pic_info) : ", JSON.stringify(pic_info));
    
    var inspectionName = Alloy.Globals.getCurrentInspection();
    var params = {
        info: pic_info
    };
    
    if(pic_info.isImage) {
        var imageFile =  pic_info.imageFileName;
        params.imageFile = imageFile;
        params.rowId = pic_info.imageId;
    }else {
        var videoThumb = Titanium.Filesystem.getFile(inspectionDir + "/inspections/" + inspectionName, pic_info.thumb);
        params.videoThumb = videoThumb;
        params.rowId = pic_info.videoId;
    }
    
    var galleryRowController = Alloy.createWidget('GalleryItem', params);
    if(pic_info.isImage) {
        galleryRowController.setRightButtonOnSwipe('copy');
        galleryRowController.setRightButtonOnSwipe('delete');
    }else{
        galleryRowController.setRightButtonOnSwipe('delete');
    }
    galleryRowController.hideSwipeContainer();
    listOfRowsMediaClips.push(galleryRowController);
    galleryRowController.on('buttonPress', handleButtonPress);
    galleryRowController.on('rowSwipe', closeSwipeRowsByPosition);
    return galleryRowController.getView();
}

isButtonDisplayed = false;
function swipeRows(e) { 
    doLog && console.log(LOG_TAG, ' ~~~~>>  e.direction: ', e.direction);
    //doLog && console.log(LOG_TAG, 'onSwipe() , isButtonDisplayed: ', isButtonDisplayed);
    doLog && console.log(LOG_TAG, 'onSwipe() , e.index: ', e.index);

    function showSwipe(rowed) { 
        rowed.children[0].animate({
            left: -92,
            right: 92,
            duration: 200
        }, function () {
            isButtonDisplayed = true;
        });
    }
    function hideSwipe(rowed) { 
        rowed.children[0].animate({
            left: 0,
            right: 0,
            duration: 175
        }, function() {
            isButtonDisplayed = false;
        });
    }

    if (e.direction === 'left') {
        doLog && console.log("left....");
        //if (isButtonDisplayed) {
        //    hideSwipe(e.row);
        //} else { 
            showSwipe(e.row);
        //}
        

    } else if (e.direction === 'right') {
        doLog && console.log("right....");
        doLog && console.log(LOG_TAG, '~~> To Close hideSwipeContainer()' );
        //if (isButtonDisplayed) {
            hideSwipe(e.row);
        //}
    }
}
/**
 * Handle the button pressed on the row.
 * @param {String} The id of the button that was pressed.
 */
function handleButtonPress(e) {
    doLog && console.log(LOG_TAG, ' handleButtonPress() ', e.type );
    switch (e.type) {
        case 'deleteClip':
            deleteClip(e);
            break;
        case 'copyClip':
            copyClip(e);
            break;
    }
}

/**
 * Delete the clip on row 
 * @param {object} event     - The object that list info of row. Can be Image or Video
 * @return {void}
 */
function deleteClip(event) {
    doLog && console.log(LOG_TAG, ' ~-> deleteImages(): ', JSON.stringify(event));
    // Confirm and delete
    var alertDelete = Titanium.UI.createAlertDialog({
        title : 'Confirm deletion',
        message : 'Are you sure you want to delete this clip?',
        buttonNames : ['Yes', 'No'],
        cancel : 1
    });
    alertDelete.show();
    alertDelete.addEventListener('click', function(eInner) {
        if (eInner.index == 1) {
            return;
        } else {
           
            updateTableView();
        }
    });   
}

/**
 * Copy clip to Section 
 * @param {object} event     - The object that list info of row. Can be Image or Video
 * @return {void}
 */
function copyClip(event) {
    doLog && console.log(LOG_TAG, ' copyClip()', JSON.stringify(event) );
    event.cancelBubble = true;
    var alertCopy = Titanium.UI.createAlertDialog({
        title : 'Copy to Section',
        message : 'Are you sure you want to Copy this clip?',
        buttonNames : ['Copy', 'Cancel'],
        cancel : 1
    });
    alertCopy.show();
    alertCopy.addEventListener('click', function(eInner) {
        if (eInner.cancel === eInner.index || eInner.cancel === true) {
            return;
        } else {
            
        }
    });
}

function closeSwipeRowsByPosition(currentRowSwipeId, position) {
    doLog && console.log(LOG_TAG, ' closeSwipeRows(rowId)');
    doLog && console.log(LOG_TAG, ' currentRowSwipeId: ', currentRowSwipeId,  ', listOfRowsMediaClips.length', listOfRowsMediaClips.length);
    _.each(listOfRowsMediaClips, function(message, rowIdOnlist) {
        doLog && console.log(LOG_TAG, '~~~~~~*****> ' , message.isButtonDisplayed, ', rowIdOnlist: ', rowIdOnlist);
        /* Fetch the controller corresponding this this row and
         * close the swipe.
         */
        if (!position) {
            if (message.isButtonDisplayed && rowIdOnlist != currentRowSwipeId) {
                message.hideSwipeContainer();    
            }    
        }else {
            // close all row swipe events.
            message.hideSwipeContainer();
        }
                
    });      
} 

function rearrangeImageRows(e) {
    //doLog && console.log(LOG_TAG, "rearrangeImageRows() -> oldIndex: ", e.fromIndex , ", newIndex:", e.index);
    var rows = imageSection.getRows();
    var tempArray = [];
    //doLog && console.log(LOG_TAG, "Pictures:" , JSON.stringify(Alloy.Globals.root.pictures));
    for (var i = 0; i < rows.length; i++) {
        var id = rows[i].imageId ? rows[i].imageId : rows[i].videoId;
        var caption = Alloy.Globals.root.pictures[id].caption;
        //doLog && console.log(LOG_TAG, "rows caption:", caption);
        var rowData = JSON.parse(JSON.stringify(rows[i].info));
        rowData.caption = caption;
        //doLog && console.log(LOG_TAG, "rowData:" , JSON.stringify(rowData));
        updatedImagesData.push(rowData);
        tempArray.push(rowData.imageId);
    }
    //doLog && console.log(LOG_TAG, "actualImageIds: " , actualImageIds);
    //doLog && console.log(LOG_TAG, "tempArray: " , tempArray);
    //doLog && console.log(LOG_TAG, "tempArray: " , JSON.stringify(updatedImagesData));
    for (var i = 0; i < actualImageIds.length; i++) {
        //doLog && console.log(LOG_TAG, "before:" , JSON.stringify(Alloy.Globals.root.pictures[actualImageIds[i]]));
        Alloy.Globals.root.pictures[actualImageIds[i]] = updatedImagesData[i];
        //doLog && console.log(LOG_TAG, "before:" , JSON.stringify(Alloy.Globals.root.pictures[actualImageIds[i]]));
    }
    listOfRowsMediaClips = [];
    updateTableView();
    updatedImagesData = [];
    
}

function updateTableView() {
    actualImageIds = [];
    var data = [];
    
    
    imageSection = Titanium.UI.createTableViewSection({
        headerTitle : "Media"
    });
    doLog && console.log(LOG_TAG, " damage panels length:", Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels.length);
    //doLog && console.log('~~~~~ ', JSON.stringify(Alloy.Globals.root.pictures) );
     
    if (Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels.length > 0) {
        for (i in Alloy.Globals.root.pictures) {
            if (Alloy.Globals.root.pictures[i].menuItem) {
                var menuItem = Alloy.Globals.root.template[menuItemId];
                var picture = Alloy.Globals.root.pictures[i];
                
                 doLog && console.log(LOG_TAG, i, " picture.menuItem:",picture.menuItem);
                 doLog && console.log(LOG_TAG, i, " menuItem.title:",menuItem.title);
                 doLog && console.log(LOG_TAG, i, " picture.section:",picture.section);
                 doLog && console.log(LOG_TAG, i, " damagePanelIndex.title:", ((menuItem.tabbed_panels[panelId]).damage_panels[damagePanelIndex]).title);
                 
                if ((picture.menuItem == menuItem.title) && (picture.section == ((menuItem.tabbed_panels[panelId]).damage_panels[damagePanelIndex]).title)) {
                    if (picture.isVideo) {
                        picture.isImage = false;
                        picture.isVideo = true;
                        picture.videoId = i;
                        var row = createNewRow(picture);
                        imageSection.add(row);
                    } else {
                        picture.isImage = true;
                        picture.isVideo = false;
                        picture.imageId = i;
                        var row = createNewRow(picture);
                        
                        imageSection.add(row);
                        row = null;
                    }
                    actualImageIds.push(i);
                }
            }
        }
    }
    doLog && console.log(LOG_TAG, "imageSection.rowCount: ", imageSection.rowCount);
    try {
        if (imageSection.rowCount > 0)
            data.push(imageSection);

        $.tableView.setData(data);
        var windowName = '';
        if (Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels.length > 1) {
            windowName = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].title + " > " + Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels[damagePanelIndex].title + " > Gallery";
        } else {
            windowName = Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].title + " > Gallery";
        }

        if (OS_ANDROID) {
            $.window.title = windowName;
        }
    } catch (e) { 
        doLog && console.log(JSON.stringify(e));
    }
    // setTimeout(function() {
    //     $.tableView.scrollToIndex(imageSection.rowCount - 1);
    // }, 1000);

}


function editImages(e) {

    
}

function saveImage(theImage, id, menuItem, section, caption) {
    doLog && console.log(LOG_TAG, " saveImage()");
    doLog && console.log(LOG_TAG, ' id: ', id, ', menuItem: ', menuItem, ', section: ', section , ', caption: ',caption);
    
    var picId = id || Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels[damagePanelIndex].id;
    var picMenuItem = menuItem || Alloy.Globals.root.template[menuItemId].title;
    var picSection = section || Alloy.Globals.root.template[menuItemId].tabbed_panels[panelId].damage_panels[damagePanelIndex].title;
    try {
        var inspectionName = Alloy.Globals.getCurrentInspection();
        //doLog && console.log(LOG_TAG, "current Inspection : ", inspectionName);
        var time = Alloy.Globals.getNextPhotoID();
        var imageFile = Titanium.Filesystem.getFile(inspectionDir + "/inspections/" + inspectionName, time + '.jpg');
        //doLog && console.log(LOG_TAG, "Writing file");
        imageFile.write(theImage);
        //doLog && console.log(LOG_TAG, "wrote file");
        if (OS_ANDROID) {
            var maxWidth = 350;
            if (parseInt(Alloy.Globals.photoEditorQuality) == 5)
                maxWidth = 532;
            ImageFactory.rotateResizeImage(imageFile.nativePath, maxWidth, Alloy.Globals.getQualityForAndroid());
            var newImageFile = Titanium.Filesystem.getFile(inspectionDir + "/inspections/" + inspectionName, time + '.jpg');
            theImage = newImageFile.read();
        }

        var pic_info_test = {
            menuItem : picMenuItem,
            caption : caption || "",
            section : picSection,
            id : picId,
            imageFileName : imageFile.getName(),
            height : theImage.height,
            width : theImage.width
        };
        
        Alloy.Globals.root.pictures.push(pic_info_test);

        doLog && console.log(LOG_TAG, "total pictures--", Alloy.Globals.root.pictures.length);
        //doLog && console.log(LOG_TAG, 'pictures added: ', JSON.stringify(Alloy.Globals.rootGallery.pictures));
        
        updateTableView();
        pic_info_test = null;
        Alloy.Globals.updatePhotosJSON();
        return imageFile;
    } catch(e) {
        alert('Error occured while saving Photo' + JSON.stringify(e));
    }
}

/*
 * Delete Pics
 */
function deleteImages(e) {
    doLog && console.log(LOG_TAG, ' ~-> deleteImages()');
    // Confirm and delete
    var alertDelete = Titanium.UI.createAlertDialog({
        title : 'Confirm deletion',
        message : 'Are you sure you want to delete this clip?',
        buttonNames : ['Yes', 'No'],
        cancel : 1
    });
    alertDelete.show();
    alertDelete.addEventListener('click', function(eInner) {
        //if (eInner.cancel === eInner.index || eInner.cancel === true) {
        if (eInner.index == 1) {
            return;
        } else {
            
            updateTableView();
        }
    });

}

/*
 * Delete Videos
 */
function deleteVideos(e) {
    doLog && console.log(LOG_TAG, ' ~-> deleteImages()');
    //Confirm and delete
    var alertDelete = Titanium.UI.createAlertDialog({
        title : 'Confirm deletion',
        message : 'Are you sure you want to delete this video clip?',
        buttonNames : ['Yes', 'No'],
        cancel : 1
    });
    alertDelete.show();
    alertDelete.addEventListener('click', function(eInner) {
        if (eInner.cancel === eInner.index || eInner.cancel === true) {
            return;
        } else {
            
            updateTableView();
        }
    });
}

function tableViewOnClick(e) {
    doLog && console.log(LOG_TAG, ' tableViewOnClick(e): ', JSON.stringify(e));
    //doLog && console.log(LOG_TAG, ' e.index: ', e.index, ' e.source.sourceType: ', e.source.sourceType);
    switch(e.source.sourceType) {
    case "VideoRow":
        //editCaption(e, e.source.sourceType);
        break;
    case "DeleteVideoRow":
        //deleteVideos(e);
        break;
    case "PlayVideoRow":
        //playVideo(e);
        break;
    case "ImageRow":
        //editCaption(e, e.source.sourceType);
        break;
    case "DeleteImageRow":
        //deleteImages(e);
        break;
    case "EditImageRow":
        //editImages(e);
        break;

    }
};


updateTableView();
