/**
 * @property {Boolean} doLog
 * TRUE, if the log message will be show on console.
 * FALSE, if the log message will be hide on console.
 */
var doLog = Ti.App.Properties.getBool('doLog');

/**
 * @property {String} LOG_TAG - Tag of log to use on current document
 */
var LOG_TAG = '[core.js]';

doLog && console.log(LOG_TAG, ' start');

/**
 * Set up the library for the Hip namespace. This library is initialize in alloy.js.
 */

/* Set the base path where all the commonjs files can be found */
var basePath = 'Hip360/';

/* Declare the files that'll be added to the library and used on app start */
var libs = [
    'Layout'
];

/* Declare the object so that we can add the commonjs files to it */
Hip360 = {};

/*
 * Cycle through each of the defined libs and add them to the global object so that we can declare them in
 * Alloy.Globals
 */
_.each(libs, function(lib) {
    var loaded;

    /* If the lib file exists, add it */
    Object.defineProperty(Hip360, lib, {
        get: function() {
            if(_.isUndefined(loaded)) {
                loaded = require(basePath + lib);
                if (typeof(loaded) == 'object')
                    Object.seal(loaded);
            }
            return loaded;
        }
    });
});

Object.freeze(Hip360);

/* Export */
module.exports = Hip360;