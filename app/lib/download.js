exports.download = function(userId, plainPassword, selectedRow, selectedTemplateName, selectedTemplateId) {
    var xmlEncoder = require('xmlEncoder');
    var inspectionDir = Alloy.Globals.inspectionDir;
    var path = Alloy.Globals.APIPath;
    var password = plainPassword;

    //var password = txtPassword.value;
    var alert = null;
    if (userId == null || password == null || userId.length == 0 || password.length == 0) {
        //The fields were manually reset
        //Display error message
        var errorAlert = Titanium.UI.createAlertDialog({
            title : 'Information Required',
            message : 'Enter User ID and Password to login',
            buttonNames : ['OK'],
            cancel : 1
        });
        errorAlert.show();
    } else {
        var xhr = Titanium.Network.createHTTPClient();
        xhr.onerror = function() {
            var alertPicker = Titanium.UI.createAlertDialog({
                title : 'Connection Error',
                message : 'A problem has occurred. Please make sure you have Internet access and try again.',
                buttonNames : ['OK']
            });
            alertPicker.show();
        
        };
        xhr.onload = function() {

            var responseText = this.responseText;
            //console.log("response--" + responseText);

            if (responseText.indexOf("AUTHENTICATION FAILED", 0) == 0)//Failed authentication
            {

                var alert = Titanium.UI.createAlertDialog({
                    title : 'Incorrect Login',
                    message : 'Login failed! Please re-enter your User ID and Password.',
                    buttonNames : ['OK'],
                    cancel : 1
                });

            } else//Authentication successful
            {

                //Create template directories if they don't exist
                Ti.API.info("if not then file making path is :" + inspectionDir);
                var templateDir = Ti.Filesystem.getFile(inspectionDir, 'templates');
                if (!templateDir.exists())
                    templateDir.createDirectory();
                var str = selectedRow;
                var select = str.replace(' ', '_');
                Ti.API.info("select :" + selectedTemplateName);
                var templateNameDir = Ti.Filesystem.getFile(inspectionDir + "/templates", '' + selectedTemplateName);
                if (!templateNameDir.exists())
                    templateNameDir.createDirectory();

                //Download Zip File
                var xhrFileZip = Titanium.Network.createHTTPClient();
                xhrFileZip.ondatastream = function(e) {
                    Ti.API.info('ONDATASTREAM - PROGRESS: ' + e.progress);
                    var msgNowDownloading;
                    if (Ti.Platform.osname === 'ipad') {
                        msgNowDownloading = "Now Downloading, Downloaded " + (Math.round(e.progress * 100)) + "%";
                    }else{
                        msgNowDownloading = "Now Downloading,\nDownloaded " + (Math.round(e.progress * 100)) + "%";
                    }
                    
                };
                xhrFileZip.onerror = function() {
                    var alertPicker = Titanium.UI.createAlertDialog({
                        title : 'Connection Error',
                        message : 'A problem has occured. Please make sure you have internet access and try again.',
                        buttonNames : ['OK']
                    });
                    alertPicker.show();
                };
                xhrFileZip.onload = function() {
                    var responseData = this.responseData;
                    var templateFile = Ti.Filesystem.getFile(inspectionDir + "/templates/" + selectedTemplateName, 'Template.zip');
                    Ti.API.info("Responce data :" + responseData);
                    if(!(this.responseData=='' || this.responseData==null)){
                        templateFile.write(this.responseData);
                        Ti.API.info("zip file writting completed");
                        var alertComplete = Titanium.UI.createAlertDialog({
                            title : 'Download Complete',
                            message : 'Template has been successfully downloaded. Click on the Manage tab to start inspection with the downloaded template.',
                            buttonNames : ['OK']
                        });
                        alertComplete.show();
                        Ti.API.info("alert showed");
                        
                        //Save entry to FileMan json
                        var fileMan = Ti.Filesystem.getFile(inspectionDir, 'fileman.json');
                        xmlEncoder.xmlFileManAddTemplate(fileMan, selectedTemplateName);
                        Ti.API.info("xml file encoded");                        
                    }
                    else{
                        var alertError = Titanium.UI.createAlertDialog({
                            title : 'Error',
                            message : 'Error downloading template. Please contact the Help Desk.',
                            buttonNames : ['OK']
                        });
                        alertError.show();
                    }

                };
                var url = path + 'DownloaderServlet?' + "userId=" + Ti.Network.encodeURIComponent(userId) + "&password=" + Ti.Network.encodeURIComponent(password) + "&requestType=Download" + "&entityId=" + selectedTemplateId + "&fileType=9" + "&downloadType=Template";
                xhrFileZip.open('GET', url);
                xhrFileZip.send();
            }
        };
        var url = path + 'DownloaderServlet?' + "userId=" + Ti.Network.encodeURIComponent(userId) + "&password=" + Ti.Network.encodeURIComponent(password) + "&requestType=List" + "&downloadType=Template";
        xhr.open('GET', url);
        xhr.send();
    }
};
