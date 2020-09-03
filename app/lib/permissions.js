function editPermissions(e) {

    if (OS_IOS) {
        var settingsURL = Ti.App.iOS.applicationOpenSettingsURL;
        if (Ti.Platform.canOpenURL(settingsURL)) {
            Ti.Platform.openURL(settingsURL);
        }
    }

    if (OS_ANDROID) {
        var intent = Ti.Android.createIntent({
            action: 'android.settings.APPLICATION_SETTINGS',
        });
        intent.addFlags(Ti.Android.FLAG_ACTIVITY_NEW_TASK);
        Ti.Android.currentActivity.startActivity(intent);
    }
}

exports.checkCameraPermissionOpt = function(clb) {
    /*
    var maps = {
            hasCameraPermission: Ti.Media.hasCameraPermissions(),
            hasCameraAuthorization: Ti.Media.cameraAuthorization,
            hasCameraAUTHORIZED:  Ti.Media.CAMERA_AUTHORIZATION_AUTHORIZED,
            hasCameraDENIED: Ti.Media.CAMERA_AUTHORIZATION_DENIED,
            hasCameraRESTRICTED: Ti.Media.CAMERA_AUTHORIZATION_RESTRICTED,
            hasCameraNOT_DETERMINED: Ti.Media.CAMERA_AUTHORIZATION_NOT_DETERMINED    
        };
    */
    var hasCameraPermissions = Ti.Media.hasCameraPermissions();

    if (hasCameraPermissions) {
        clb({
            success: true,
            showMsg: false
            //opt: "1",
            //maps: maps
        });
        return;
    }else{
        clb({
            success: false,
            showMsg: true
        });
    }

    if (OS_IOS) {
        var map = {};
        map[Ti.Media.CAMERA_AUTHORIZATION_AUTHORIZED] = 'CAMERA_AUTHORIZATION_AUTHORIZED';
        map[Ti.Media.CAMERA_AUTHORIZATION_DENIED] = 'CAMERA_AUTHORIZATION_DENIED';
        map[Ti.Media.CAMERA_AUTHORIZATION_RESTRICTED] = 'CAMERA_AUTHORIZATION_RESTRICTED';
        map[Ti.Media.CAMERA_AUTHORIZATION_NOT_DETERMINED] = 'CAMERA_AUTHORIZATION_NOT_DETERMINED';
        
        var cameraAuthorization = Ti.Media.cameraAuthorization;
        if (cameraAuthorization === Ti.Media.CAMERA_AUTHORIZATION_RESTRICTED) {
            clb({
                success: false,
                showMsg: false
            });
            return;
        } else if (cameraAuthorization === Ti.Media.CAMERA_AUTHORIZATION_DENIED) {
            clb({
                success: false,
                showMsg: true
            });
            return;
        }
    }

    Ti.Media.requestCameraPermissions(function(e) {
        //console.log('~~~> ', JSON.stringify(e));
        
        if (e.success) {
            clb({
                success: true,
                showMsg: false
            });
            return;
        } else {
            exports.checkCameraPermissionOpt(clb);
            clb({
             success: false,
             showMsg: true
             });
            return;
        }
    });

}; 

exports.checkCameraPermission = function(clb) {

    var hasCameraPermissions = Ti.Media.hasCameraPermissions();

    if (hasCameraPermissions) {
        clb();
        return;
    }

    if (OS_IOS) {
        var map = {};
        map[Ti.Media.CAMERA_AUTHORIZATION_AUTHORIZED] = 'CAMERA_AUTHORIZATION_AUTHORIZED';
        map[Ti.Media.CAMERA_AUTHORIZATION_DENIED] = 'CAMERA_AUTHORIZATION_DENIED';
        map[Ti.Media.CAMERA_AUTHORIZATION_RESTRICTED] = 'CAMERA_AUTHORIZATION_RESTRICTED';
        map[Ti.Media.CAMERA_AUTHORIZATION_NOT_DETERMINED] = 'CAMERA_AUTHORIZATION_NOT_DETERMINED';

        var cameraAuthorization = Ti.Media.cameraAuthorization;
        if (cameraAuthorization === Ti.Media.CAMERA_AUTHORIZATION_RESTRICTED) {
            return;
        } else if (cameraAuthorization === Ti.Media.CAMERA_AUTHORIZATION_DENIED) {
            return;
        }
    }

    Ti.Media.requestCameraPermissions(function(e) {
        if (e.success) {
            clb();
            return;
        } else if (OS_ANDROID) {
            return;
        } else {
            return;
        }
    });

}; 