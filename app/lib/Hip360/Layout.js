/**
 * @property {Boolean} doLog
 * TRUE, if the log message will be show on console.
 * FALSE, if the log message will be hide on console.
 */
var doLog = Ti.App.Properties.getBool('doLog');

/**
 * @property {String} LOG_TAG - Tag of log to use on current document
 */
var LOG_TAG = '[Layout.js]';

doLog && console.log(LOG_TAG, ' start');

/**
 * @class Hip360.Layout
 * @alias Alloy.Globals.Layout
 *
 * Defines the layout properties used throughout the application. We focus all of the values
 * here and base off a single defined constant for easy adjustments.
 */

var Layout = {};

/* Get the platform display caps and set the height and width */
var displayCaps = Ti.Platform.displayCaps;
var deviceHeight = displayCaps.platformHeight;
var deviceWidth = displayCaps.platformWidth;


/*
 * Create the app wide layout height and width. We must also pass along orientation because if you set the orientation for a window
 * where said orientation is not supported, you are in for a bad time
 */


if(OS_ANDROID && 1==0){
  if (Ti.Gesture.orientation === 3 || Ti.Gesture.orientation === 4) {
      Layout.deviceHeight= (deviceHeight > deviceWidth) ? deviceHeight : deviceWidth;
      Layout.deviceWidth = (deviceHeight < deviceWidth) ? deviceHeight : deviceWidth;
  } else if (Ti.Gesture.orientation === 3 || Ti.Gesture.orientation === 4) {
      Layout.deviceHeight = (deviceHeight < deviceWidth) ? deviceHeight : deviceWidth;
      Layout.deviceWidth  = (deviceHeight > deviceWidth) ? deviceHeight : deviceWidth;
  }
  Layout.forOrientation = Ti.Gesture.orientation;

}

Object.defineProperties(Layout, {
    "deviceHeight": {
        get: function() {

            if (Ti.Gesture.orientation === 3 || Ti.Gesture.orientation === 4) {
              return (deviceHeight < deviceWidth) ? deviceHeight : deviceWidth;
            } else {
              return (deviceHeight > deviceWidth) ? deviceHeight : deviceWidth;
            }
        }
    },
    "deviceWidth": {
        get: function() {
            if (Ti.Gesture.orientation === 3 || Ti.Gesture.orientation === 4) {
              return (deviceHeight > deviceWidth) ? deviceHeight : deviceWidth;
            } else {
                return (deviceHeight < deviceWidth) ? deviceHeight : deviceWidth;

            }
        }
    },
    "forOrientation": {
        get: function() {
            return Ti.Gesture.orientation;
        }
    },
    "isIphoneXOrLonger" : {
        get: function() {
            // 812.0 / 375.0 on iPhone X, XS.
            // 896.0 / 414.0 on iPhone XS Max, XR.
            return (Ti.Gesture.portrait) ? (deviceHeight / deviceWidth) >= (896.0 / 414.0) : (deviceWidth / deviceHeight)  >= (896.0 / 414.0) ;
        }
    }
});


/* Export the layout */
module.exports = Layout;
