var LOG_TAG = '[xmlEncoder]';
//var _ = require('libs/underscore')._;
exports.xmlClientEncode = (function(xmlFile1) {
    try{
    //Build the date string to save
    var inspDateStr = '';
    inspDateStr += inspDate.value.getFullYear() + '-';
    if (inspDate.value.getMonth() < 9)
        inspDateStr += '0' + (inspDate.value.getMonth() + 1) + '-';
    else
        inspDateStr += (inspDate.value.getMonth() + 1) + '-';
    if (inspDate.value.getDate() < 10)
        inspDateStr += '0' + inspDate.value.getDate();
    else
        inspDateStr += inspDate.value.getDate();
    // Client Info
    var clientInfo = {
        "lastName1" : txtClientLastName1.value,
        "firstName1" : txtClientFirstName1.value,
        "lastName2" : txtClientLastName2.value,
        "firstName2" : txtClientFirstName2.value,
        "phone" : txtClientPhoneNumber.value,
        "fax" : txtClientFax.value,
        "email" : txtClientEmail.value,
        "address" : txtInspAddr.value,
        "address2" : txtInspAddrLine2.value,
        "city" : txtCity.value,
        "state" : txtState.value,
        "zip" : txtZip.value,
        //"agent"           : txtAgent.value,
        "inspDate" : inspDateStr, //Don't store time, else cannot be reloaded directly in date picker
        "inspTime" : txtTime.value,
        "age" : txtAge.value,
        "size" : txtSize.value,
        "fee" : txtFee.value,
        "weather" : txtWeather.value,
        "otherinfo" : txtOtherInfo.value
    };
    Ti.API.info("now saving client info data--" + JSON.stringify(clientInfo));
    xmlFile1.write(JSON.stringify(clientInfo));
    } catch(e){
        alert(e);
    }
});

function tryParseJSON(jsonString) {
    try {
        var o = JSON.parse(jsonString);
        if (o && typeof o === "object") {
            return o;
        }
    } catch (e) {
        alert(e);
        //Alloy.Globals.apm.leaveBreadcrumb(LOG_TAG + ' exception tryParseJSON ');
    }
    return false;
};

exports.xmlInspectionEncode = (function(xmlFile1, dataToSave, alertProgress) {
    //xmlFile1.write(JSON.stringify(dataToSave));
   /* var currentJson = JSON.stringify(dataToSave);
    Alloy.Globals.apm.leaveBreadcrumb(LOG_TAG + ' xmlInspectionEncode isValid currentJson ');
    if (!tryParseJSON(currentJson)) {
        return;
    }*/
    try {
        xmlFile1.write("[");
        var progressValue = 0;
        var progressIncr = 0;
        if (dataToSave.length > 0)
            progressIncr = 70 / dataToSave.length;
        for (i in dataToSave) {
            menu_item = dataToSave[i];
            row = {
                title : menu_item.title,
                id : menu_item.id,
                tabbed_panels : menu_item.tabbed_panels,
            };
            if (menu_item.copiedFrom)
                row.copiedFrom = menu_item.copiedFrom;
            if (i == dataToSave.length - 1)
                xmlFile1.write(JSON.stringify(row), true);
            //Append
            else
                xmlFile1.write(JSON.stringify(row) + ",", true);
            //Append
            progressValue += progressIncr;
            if (alertProgress != null)
                alertProgress.setValue(progressValue);
        }
        xmlFile1.write("]", true);
    } catch(e) {
        alert(e);
        //Ti.API.info('error while saving inspection.json');
        //Alloy.Globals.apm.leaveBreadcrumb(LOG_TAG + ' error while saving inspection.json ');
    }

});
exports.xmlVideoEncode = (function(xmlFile1, dataToSave) {
    try {
    xmlFile1.write(JSON.stringify(dataToSave));
    } catch(e){
        alert(e);
    }
});

exports.xmlPhotoEncode = (function(xmlDir, xmlFile1, dataToSave) {
    try{
    xmlFile1.write(JSON.stringify(dataToSave));
    } catch(e){
        alert(e);
    }
});

exports.xmlConfigEncode = (function(xmlFile1, username, password) {
    try{
    // ConfigInfo
    var configInfo = {
        "userId" : username,
        "password" : password
    };
    xmlFile1.write(JSON.stringify(configInfo));
    } catch(e){
        alert(e);
    }
});

exports.xmlConfigEncrEncode = (function(xmlFile1, userId, password) {
    try{
    // ConfigInfo
    var configInfo = {
        "userId" : userId,
        "password" : password
    };
    xmlFile1.write(JSON.stringify(configInfo));
    } catch(e){
        alert(e);
    }
});

exports.xmlThemeEncode = (function(xmlFile1, themeName) {
    try{
    // ThemeInfo
    var themeInfo = {
        "currTheme" : themeName
    };
    //xmlFile1.write(JSON.stringify(themeInfo));
    } catch(e){
        alert(e);
    }
});

exports.xmlFileManAddTemplate = (function(xmlFile1, templateName) {
    
    try {
    var fileManJson = null;
    var templates = null;
    var inspections = null;
    if (xmlFile1.exists()) {
        fileManJson = JSON.parse(xmlFile1.read().text);
        templates = fileManJson.templates || [];
        inspections = fileManJson.inspections;
    } else {
        //Initialize file
        templates = [];
        //Blank array
        inspections = [];
        //Blank array
    }
    //Check for duplicate, dont insert if found
    var templateExists = false;
    for (var i = 0; i < templates.length; i++) {
        if (templates[i] == templateName) {
            templateExists = true;
            break;
        }
    }
    if (!templateExists) {
        templates.push(templateName);
        fileManJson = {
            "templates" : templates,
            "inspections" : inspections
        };
        xmlFile1.write(JSON.stringify(fileManJson));
    }
    } catch(e){
        alert(e);
    }
});

exports.xmlFileManRemoveTemplate = (function(xmlFile1, templateName) {
    try{
    var fileManJson = null;
    var templates = null;
    var inspections = null;
    if (xmlFile1.exists()) {
        fileManJson = JSON.parse(xmlFile1.read().text);
        templates = fileManJson.templates;
        inspections = fileManJson.inspections;
        //Remove templateName
        for (var i = 0; i < templates.length; i++) {
            if (templates[i] == templateName) {
                templates.splice(i, 1);
                break;
            }
        }
        fileManJson = {
            "templates" : templates,
            "inspections" : inspections
        };
        xmlFile1.write(JSON.stringify(fileManJson));
    }
    } catch(e){
        alert(e);
    }
});

exports.xmlFileManAddInspection = (function(xmlFile1, inspectionName) {
    try{
    var fileManJson = null;
    var templates = null;
    var inspections = null;
    if (xmlFile1.exists()) {
        fileManJson = JSON.parse(xmlFile1.read().text);
        templates = fileManJson.templates;
        inspections = fileManJson.inspections;
    } else
        inspections = [];
    //Blank array
    //Check for duplicate, dont insert if found
    var inspectionExists = false;
    for (var i = 0; i < inspections.length; i++) {
        if (inspections[i] == inspectionName) {
            inspectionExists = true;
            break;
        }
    }
    if (!inspectionExists) {
        inspections.push(inspectionName);
        fileManJson = {
            "templates" : templates,
            "inspections" : inspections
        };
        xmlFile1.write(JSON.stringify(fileManJson));
    }
    } catch(e){
        alert(e);
    }
});
exports.xmlFileManRenameInspection = (function(xmlFile1, oldInspectionName, newInspectionName) {
    try{
    var fileManJson = null;
    var templates = null;
    var inspections = null;
    if (xmlFile1.exists()) {
        fileManJson = JSON.parse(xmlFile1.read().text);
        templates = fileManJson.templates;
        inspections = fileManJson.inspections;
    } else
        inspections = [];
    //Blank array
    //Check for duplicate, dont insert if found
    var inspectionExists = false;
    for (var i = 0; i < inspections.length; i++) {
        if (inspections[i] == oldInspectionName) {
            inspections[i] = newInspectionName;
            inspectionExists = true;
            break;
        }
    }
    if (inspectionExists) {
        fileManJson = {
            "templates" : templates,
            "inspections" : inspections
        };
        xmlFile1.write(JSON.stringify(fileManJson));
    }
    } catch(e){
        alert(e);
    }
});

exports.xmlFileManRemoveInspection = (function(xmlFile1, inspectionName) {
    try{
    var fileManJson = null;
    var templates = null;
    var inspections = null;
    if (xmlFile1.exists()) {
        fileManJson = JSON.parse(xmlFile1.read().text);
        templates = fileManJson.templates;
        inspections = fileManJson.inspections;
        //Remove inspectionName
        for (var i = 0; i < inspections.length; i++) {
            if (inspections[i] == inspectionName) {
                inspections.splice(i, 1);
                break;
            }
        }
        //Remove if current inspection
        if (Alloy.Globals.getCurrentInspection() == inspectionName) {
            Alloy.Globals.setCurrentInspection("");
        }

        fileManJson = {
            "templates" : templates,
            "inspections" : inspections
        };
        xmlFile1.write(JSON.stringify(fileManJson));
    }
    } catch(e){
        alert(e);
    }
});
exports.xmlFileManRemoveAllInspection = (function(xmlFile1) {
    try{
    var fileManJson = null;
    var templates = null;
    var inspections = null;
    if (xmlFile1.exists()) {
        fileManJson = JSON.parse(xmlFile1.read().text);
        templates = fileManJson.templates;
        inspections = [];
        //Remove if current inspection
        Alloy.Globals.setCurrentInspection("");

        fileManJson = {
            "templates" : templates,
            "inspections" : inspections
        };
        xmlFile1.write(JSON.stringify(fileManJson));
    }
    } catch(e){
        alert(e);
    }
});
exports.xmlFileManRemoveAllSelectedInspection = (function(xmlFile1, inspectionsToDelete) {
    try{
    var fileManJson = null;
    var templates = null;
    var inspections = null;
    if (xmlFile1.exists()) {
        fileManJson = JSON.parse(xmlFile1.read().text);
        templates = fileManJson.templates;
        inspections = fileManJson.inspections;
        var inspectionsLeft = _.difference(inspections, inspectionsToDelete);
        Ti.API.info(JSON.stringify(inspectionsLeft));
        //Remove if current inspection
        //Alloy.Globals.setCurrentInspection("");

        fileManJson = {
            "templates" : templates,
            "inspections" : inspectionsLeft
        };
        xmlFile1.write(JSON.stringify(fileManJson));
    }
    } catch(e){
        alert(e);
    }
});
