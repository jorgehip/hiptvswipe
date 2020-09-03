
var doLog = Ti.App.Properties.getBool("doLog");

/**
 * @property {String} LOG_TAG - Tag of log to use on current document
 */
var LOG_TAG = '[Widget - GalleryRow]';

/**
 * Boolean to show if this row is swipped.
 */
var isButtonDisplayed = false;

/**
 * Local variable for if this row has a right button.
 */
var hasRightSwipeContainer = false;


/* Screen Width */
var screen_width = (OS_IOS) ? Ti.Platform.displayCaps.platformWidth : Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor;

/* Moment */
var moment = require('alloy/moment');

var rightBtn;

/**
 * List of types of buttons to be used on the row swipe event.
 */
var buttons = {
    copy: {
        image: '/images/clipCopy.png',
        onClick: function() {
            $.trigger('buttonPress', {
                type: 'copyClip',
                pic_info: $.args
            });
            hideSwipeContainer();
        },
        backgroundColor: '#e0e0e0',
        color: '#000000'
    },
    delete: {
        image: '/images/iconTrash.png', 
        onClick: function() {
            $.trigger('buttonPress', {
                type: 'deleteClip',
                info: $.args.info
            });
            hideSwipeContainer();
        },
        backgroundColor: '#cc0000',
        color: '#000000'

    }
}; 

/**
 * Allow the parent controller to get or set the selection state
 * of the row.
 */
Object.defineProperties($, {
    isButtonDisplayed: {
        get: function() {
            return isButtonDisplayed;
        },
        set: function(value) {
            isButtonDisplayed = value;
        }
    }
});

   
/**
 * Function to execute when the user swipes one of the Gallery Images row
 * @param {Object} The swipe listener
 * @return {void}
 */
function onSwipe(e) {
    // for (var key in e) {
        // doLog && console.log(LOG_TAG, 'key: ', key, ' : ', JSON.stringify(e[key]));
    // }
    doLog && console.log(LOG_TAG, ' ~~~~>>  e.direction: ', e.direction);
    e.bubbles = true;
    //doLog && console.log(LOG_TAG, 'onSwipe() , isButtonDisplayed: ', isButtonDisplayed);
    //doLog && console.log(LOG_TAG, 'onSwipe() , e.index: ', e.index);
    if (e.direction === 'left') {
        
        if (isButtonDisplayed) {
             hideSwipeContainer();
        } else {
            if (hasRightSwipeContainer) {
                showSwipeRightContainer(e.index);
            }
        }
    } else if (e.direction === 'right') {
        if (isButtonDisplayed) {
            hideSwipeContainer();
        } 
    } 
}

/**
 * Hide either of the buttons when the user swipes a second time.
 * @return {void}
 */
function hideSwipeContainer() {
    doLog && console.log(LOG_TAG, '~~> To Close hideSwipeContainer()' );
    $.mainHolder.animate({
        left: 0,
        right: 0,
        duration: 175
    }, function() {
        isButtonDisplayed = false;
    });
}

/**
 * Create the message button layout for the message card based on
 * the id passed into it.
 * @param {String} id - The type of button to be created.
 * @return {Ti.UI.View} The container holding the button.
 */
function createBtnOnSwipe(opts) {
    var button = buttons[opts.id];
    doLog && console.log(LOG_TAG, ' Button: ~~> ', JSON.stringify(opts), ' - ', JSON.stringify(button));
    var container = $.UI.create('View', {
        height: Ti.UI.FILL,
        width: '46',
        backgroundColor: button.backgroundColor
    });

    var holder = $.UI.create('View', {
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        layout: 'vertical',
        touchEnabled: false
    });
    var icon = $.UI.create('ImageView', {
        //classes: ['icon', 'text-xlarge'],
        //color: button.color,
        image: button.image,
        //bottom: '5',//Alloy.Globals.Layout.halfPadding,
        touchEnabled: false
    });
        
    //holder.add(icon);
    _.extend(container, {
        _id: opts.side
    });
    container.add(icon);
    container.addEventListener('click', button.onClick);
    return container;
}
/**
 * Display the right button after the user swipes to the left.
 * @return {void}
 */
function showSwipeRightContainer(rowIndexId) {
    //setTimeout(function() {
        $.mainHolder.animate({
            left: -92,
            right: 92,
            duration: 200
        }, function() {
            isButtonDisplayed = true;
            $.trigger('rowSwipe', rowIndexId, 0);
        });
    //}, 300);
}


/* Self calling init function */
(function init() {
    
   
    doLog && console.log(LOG_TAG, ' $.args: ', JSON.stringify($.args));
    var inspectionDir = Alloy.Globals.inspectionDir;
    var inspectionName = Alloy.Globals.getCurrentInspection();

    var widthThumbHolder = 100, widthActionHolder = 95;
    var widthCalculate = screen_width - (widthThumbHolder + widthActionHolder);
    doLog && console.log('screen_width: ', screen_width);
    doLog && console.log('widthCalculate: ', widthCalculate);
    var toContinue = false;
    
    if ('info' in $.args && 'caption' in $.args.info) {
        $.rowGallery.info = $.args.info;
        toContinue = true;
    }
    $.args.info.imageFileName = "/images/default_missing.png";
    var imageFileT = Titanium.Filesystem.getFile(inspectionDir + "/inspections/" + inspectionName, $.args.info.imageFileName);
    //var videoThumb = Titanium.Filesystem.getFile(inspectionDir + "/inspections/" + inspectionName, video_info.thumb);
    
    if (toContinue) {
        if ($.args.info.isImage) {
            if ('imageId' in $.args.info) {
                $.rowGallery.imageId = $.args.info.imageId;
            }    
            if ('imageFileName' in $.args.info) {
                $.thumbImg.image = "/images/default_missing.png";
            }
            
            $.txtCaption.sourceType = 'ImageRow';
            $.rightSwipeContainer.width = '92';
            //$.deleteIcon.sourceType = 'DeleteImageRow';
    
        }else{
            if ('videoId' in $.args.info) {
                $.rowGallery.videoId = $.args.info.videoId;
                $.rowGallery.className = 'caption';
            }
            if('videoThumb' in $.args) {
                $.thumbImg.image = $.args.info.thumb ? $.args.videoThumb.nativePath : '/images/videoPlaying.png'; // this is a BLOB now: TODO: store on local file system ...;
                $.thumbImg.sourceType = 'PlayVideoRow';
            }
            
            $.txtCaption.sourceType = 'VideoRow';
            $.rightSwipeContainer.width = '46';
            //$.deleteIcon.sourceType = 'DeleteVideoRow';
        }
        
        $.txtCaption.text = $.args.info.caption || 'Tap to Add Caption';
        $.txtHolder.width = widthCalculate;
        
    }
    
    
})();


/**
 * Set the right button of the message card. This is exposed when the
 * user swipes the card to the left.
 * @param {String} id - The type of button to be displayed
 * @return {void}
 */
$.setRightButtonOnSwipe = function(id) {
    var obj = {
        id: id,
        side: 'right'
    };
    var buttonOnSwipe = createBtnOnSwipe(obj);
    if (buttonOnSwipe) {
       $.rightSwipeContainer.add(buttonOnSwipe);
        hasRightSwipeContainer = true;
    }
};

/**
 * Allow the parent controller to close the button drawer if needed.
 * @return {void}
 */
$.hideSwipeContainer = hideSwipeContainer;