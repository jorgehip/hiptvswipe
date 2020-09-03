// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

var downloadService = require('download');
var inspectionDir = Alloy.Globals.inspectionDir;
var zipModule = require('ti.compression');


function doDownloading() {
    
    var fileMan = Ti.Filesystem.getFile(inspectionDir, 'fileman.json');
    console.log(fileMan);
    if (fileMan.exists()) {
        var fileManJson = JSON.parse(fileMan.read().text);
        var templates = fileManJson.templates;
        var templateExists = false;
        if (templates != null)//There might be no entries
        {
            for (var i = 0; i < templates.length; i++) {
                if (templates[i] == 'DefaultTemplate') {
                    templateExists = true;
                    break;
                }
            }
        }
        if (templateExists)//Ask for over-write confirmation
        {
            downloadService.download(
                //username
                'jlfrias',
                //password
                '7#Prasenjit42!', 'DefaultTemplate', 'DefaultTemplate', '111931');
        } else {    
            downloadService.download(
                //username
                'jlfrias',
                //password
                '7#Prasenjit42!', 'DefaultTemplate', 'DefaultTemplate', '111931');
        }
    }else {
            downloadService.download(
                //username
                'jlfrias',
                //password
                '7#Prasenjit42!', 'DefaultTemplate', 'DefaultTemplate', '111931');
    }
}

exports.reload = function() {
};