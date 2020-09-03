// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var fdir = Alloy.Globals.fdir;
var inspectionDir = Alloy.Globals.inspectionDir;
var xmlEncoder = require('xmlEncoder');

var zipModule = require('ti.compression');

function openTemplate(sessionId, templateName, inspectionName) {

    
    Ti.API.info("Open Template");

        //adding time stamps
        var date = new Date(),
            dateString = date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getFullYear().toString().substr(2, 2);

        //Ask for current inspection name and create directory
        inspectionName = 'testCR';
        Ti.API.info("new inspection name--" + inspectionName);
        inspectionName = "" + inspectionName;

        //replacing " " with "_"
        inspectionName = inspectionName.replace(/ /g, '_');
        Ti.API.info("new inspection name--" + inspectionName);

        result = true;
        inspectionName = inspectionName + "_" + dateString;
   

    if (result) {
        //Store the name in fileman.json. Directories will be created and file saved in directory on opening
        //Check directory, create if not existing
        //Overwrite check can be easily included here
        /**CHECK FOR OVERWRITE, ELSE MULTIPLE ITEMS IN DROPDOWN WITH SAME NAME**/
        Ti.API.info("creating folders...");
        var currentInspectionDir = Ti.Filesystem.getFile(inspectionDir, 'inspections');
        Ti.API.info("got object");
        if (OS_IOS)
            currentInspectionDir.setRemoteBackup = true;
        Ti.API.info("after backup");
        if (!currentInspectionDir.exists())
            currentInspectionDir.createDirectory();
        Ti.API.info("created inspections folder...");
        var inspectionNameDir = Ti.Filesystem.getFile(inspectionDir + "/inspections", '' + inspectionName);
        if (!inspectionNameDir.exists())
            inspectionNameDir.createDirectory();
        Ti.API.info("created inspection folder...");
        //Load the template into inspection format and set it as current inspection
        var f1 = Ti.Filesystem.getFile(inspectionDir + "/templates/" + 'DefaultTemplate' , 'Template.zip');

        //Reset global inspection properties like template, pics and videos
        var root = {};
        root.template = [];
        root.pictures = [];
        root.videos = [];
        Alloy.Globals.root = root;

        if (f1.exists()) {
            //Copy the template zip file to inspection folder
            var templateZipFile = Ti.Filesystem.getFile(inspectionDir + "/inspections/" + inspectionName, 'Template.zip');
            var outputPath = Ti.Filesystem.getFile(inspectionDir + "/inspections/" + inspectionName);
            templateZipFile.write(f1.read());
            var result = zipModule.unzip(outputPath.nativePath, templateZipFile.nativePath, true);
            if (result == 'success') {
                if (templateZipFile.exists())
                    templateZipFile.deleteFile();
            }

        } else {
            var f2 = Ti.Filesystem.getFile(inspectionDir + "/templates/" + 'DefaultTemplate' , 'TabbedPanes.tpl');
            var f3 = Ti.Filesystem.getFile(inspectionDir + "/templates/" + 'DefaultTemplate' , 'Inspection.json');
            var tabbedPanesFile = Ti.Filesystem.getFile(inspectionDir + "/inspections/" + inspectionName, 'TabbedPanes.tpl');
            tabbedPanesFile.write(f2.read().text);
            var inspectionFile = Ti.Filesystem.getFile(inspectionDir + "/inspections/" + inspectionName, 'Inspection.json');
            inspectionFile.write(f3.read().text);
        }

        //write the videos file for the first time
        var videosFile = Ti.Filesystem.getFile(inspectionDir + "/inspections/" + inspectionName, 'Videos.json');
        var videos = [];
        xmlEncoder.xmlVideoEncode(videosFile, videos);

        //Write the photos file
        var photosFile = Ti.Filesystem.getFile(inspectionDir + "/inspections/" + inspectionName, 'Photos.json');
        var pictures = [];
        //Add default cover photo
        var defCoverPhotoFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images/default_cover.png');
        var defCoverPhotoCopy = Ti.Filesystem.getFile(inspectionDir + "/inspections/" + inspectionName, '0.jpg');
        defCoverPhotoCopy.write(defCoverPhotoFile.read());
        var pic_info = {
            menuItem : null,
            caption : 'Cover Photo',
            section : 'Cover',
            id : -1,
            imageFileName : defCoverPhotoCopy.getName()
        };
        pictures.push(pic_info);

        xmlEncoder.xmlPhotoEncode(inspectionDir + "/inspections/" + inspectionName, //path
        photosFile, //file
        pictures, //photos, right now it will contain only one pic that is the cover pic
        [
        ]);
        //videos  right it won't be having any videos.

        var clientInfo = Ti.Filesystem.getFile(inspectionDir + "/inspections/" + inspectionName, 'ClientInfo.json');
        clientInfo.write("");
        var fileMan = Ti.Filesystem.getFile(inspectionDir, 'fileman.json');
        xmlEncoder.xmlFileManAddInspection(fileMan, inspectionName);
        Alloy.Globals.setCurrentInspection(inspectionName);
        // set global param to false, so that it loads newly created inspection under inspect tab
        Alloy.Globals.inspectionLoaded = false;
        Alloy.Globals.clientInfoLoaded = false;
        // Alloy.Globals.toast("Inspection created...");
        
        if ( typeof sessionId == 'string') {
            //Alloy.Globals.tabGroup.setActiveTab(3);
        }
        selectedInspectionName = inspectionName;
        //$.currInspection.text = "Current Inspection : " + selectedInspectionName;
        //Alloy.Globals.setCurrentInspection(selectedInspectionName);
        var totalInspections = Ti.App.Properties.getInt('totalInspections');
        totalInspections++;
        Ti.App.Properties.setInt('totalInspections', totalInspections);
        var alertPicker = Titanium.UI.createAlertDialog({
            title : 'Inspection Created',
            message : 'Inspection Created..',
            buttonNames : ['OK']
        });
        alertPicker.show();
        
        
    } else {
        return;
    }
    
}

var reload = function() {
    
};

exports.reload = reload;

