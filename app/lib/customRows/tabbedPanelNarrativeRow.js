/**
 * @property {Boolean} doLog
 * TRUE, if the log message will be show on console.
 * FALSE, if the log message will be hide on console.
 */
//var doLog = Ti.App.Properties.getBool('doLog');
var doLog = false;
/**
 * @property {String} LOG_TAG - Tag of log to use on current document
 */
var LOG_TAG = '[tabbedPannelNarrativeRow]';

doLog && console.log(LOG_TAG, ' Start');

function tabbedPanelNarrativeRow(param) { 

    //doLog && console.log(LOG_TAG, '~~~~', JSON.stringify(param));
    doLog && console.log(LOG_TAG, '~~~**~~~~~~~~~~~~~~~~>');
    
    var displayCaps = Ti.Platform.displayCaps,
        deviceHeight = displayCaps.platformHeight,
        deviceWidth = displayCaps.platformWidth,
        screen_width, 
        extraHeight, 
        newWidth, 
        isIphoneXOrLonger;
        
    //doLog && console.log(LOG_TAG, 'Ti.Gesture.orientation: ', Ti.Gesture.orientation, ', dh: ', deviceHeight, ', dw: ', deviceWidth);
    //isIphoneXOrLonger = (( Ti.Gesture.orientation == 1 ||  Ti.Gesture.orientation == 2) ? (deviceHeight / deviceWidth) >= (896.0 / 414.0) : (deviceWidth / deviceHeight)  >= (896.0 / 414.0));
    isIphoneXOrLonger = (( Ti.Gesture.orientation == 1 ||  Ti.Gesture.orientation == 2) ? (Alloy.Globals.Layout.deviceHeight / Alloy.Globals.Layout.deviceWidth) >= (896.0 / 414.0) : (Alloy.Globals.Layout.deviceWidth / Alloy.Globals.Layout.deviceHeight)  >= (896.0 / 414.0)); 
    //doLog && console.log(LOG_TAG, '~~1 Alloy.Globals.isIphoneXOrLonger          : ', Alloy.Globals.Layout.isIphoneXOrLonger);
    //doLog && console.log(LOG_TAG, '~~1 isIphoneXOrLonger                        : ', isIphoneXOrLonger);
    
    //doLog && console.log(LOG_TAG,'~~2 isLANDSCAPE_LEFT or RIGHT  : ', [Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT].indexOf(Alloy.Globals.Layout.forOrientation) > -1);
    //doLog && console.log(LOG_TAG, '~~3.0 globalDeviceWidth                      : ', Alloy.Globals.Layout.deviceWidth);
    //doLog && console.log(LOG_TAG, '~~3.1 globalDeviceHeight                     : ', Alloy.Globals.Layout.deviceHeight);
    //doLog && console.log(LOG_TAG, '~~3.2 Ti.UI.LANDSCAPE_LEFT                   : ', Ti.UI.LANDSCAPE_LEFT);
    //doLog && console.log(LOG_TAG, '~~3.3 Ti.UI.LANDSCAPE_RIGHT                  : ', Ti.UI.LANDSCAPE_RIGHT);
    //doLog && console.log(LOG_TAG, '~~3.3 Ti.UI.PORTRAIT/Ti.UI.UPSIDE_PORTRAIT   : ', Ti.UI.PORTRAIT, ', / ', Ti.UI.UPSIDE_PORTRAIT);
    //doLog && console.log(LOG_TAG, '~~4 newWidth calculated                      : ', Alloy.Globals.Layout.deviceWidth - 90);
       
    ( isIphoneXOrLonger && [Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT].indexOf(Ti.Gesture.orientation) > -1) ? newWidth = Alloy.Globals.Layout.deviceWidth - 90 : newWidth = Alloy.Globals.Layout.deviceWidth;
    //, Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT
    //doLog && console.log(LOG_TAG, '~~5: newWidth                                : ', newWidth);
    
    screen_width = (OS_IOS) ? newWidth : (Alloy.Globals.Layout.deviceWidth / Ti.Platform.displayCaps.logicalDensityFactor);    
    
    doLog && console.log(LOG_TAG, ' new screen_width                            : ', screen_width);
  
    var default_row, fontSizeValue, heightValue, sliderValue, fontSizeValueDefault;
    var img_color, border_badge_color, styleObj;
    var rowContainer, textContainer, narrativeTxt;
    
    sliderValue = Ti.App.Properties.getInt('sliderValue');
    fontSizeValueDefault = Alloy.Globals.fontSizeVal - 6;

    Alloy.Globals.oldDeviceWidth = Alloy.Globals.Layout.deviceWidth;
    Alloy.Globals.oldDeviceHeight = Alloy.Globals.Layout.deviceHeight;
    
    switch (sliderValue) {
    case 1:
        fontSizeValue = fontSizeValueDefault;
        heightValue = 40;
        break;
    case 2:
        fontSizeValue = fontSizeValueDefault;
        heightValue = 40;
        break;
    case 3:
        fontSizeValue = fontSizeValueDefault;
        heightValue = 40;
        break;
    case 4:
        fontSizeValue = fontSizeValueDefault - 6;
        heightValue = 45;
        break;
    case 5:
        fontSizeValue = fontSizeValueDefault - 8;
        heightValue = 50;
        break;
    case 6:
        fontSizeValue = fontSizeValueDefault - 10;
        heightValue = 55;
        break;
    }

    var row = {
        id : param.id,
        hasDetail : param.hasDetail,
        hasChild : param.hasChild,
        className : 'rowText',
        height : heightValue,
        backgroundColor : param.backgroundColor,
        color: param.color,
        font: param.font,
        titles: param.title
    };

    default_row = Ti.UI.createTableViewRow(row);
    //console.log(LOG_TAG, '~~~~~> ', JSON.stringify(row));
    if (param.backgroundColor === '#000000') {
        img_color = 'white_';
        badge_border_color = '#FFFFFF';
        badge_backgroundColor = '#FFFFFF';
        badge_color = '#000000';   
    }else if (param.backgroundColor === '#0000FF') {
        img_color = 'white_';
        badge_border_color = '#000000';
        badge_backgroundColor = '#FFFFFF';
        badge_color = '#000000';
    }else {
        img_color = 'black_';
        badge_border_color = '#000000';
        badge_backgroundColor = '#000000';
        badge_color = '#FFFFFF';    
    }
    
    styleObj = {
      pos: 140,
      height: heightValue,
      width: Math.floor(140-33),
      icons: [
        { image: '/images/' + img_color + 'overview.png', width:26 , height: 26, id: 'narratives', badge: param.totalNumberOfItemsSelected },
        { image: '/images/' + img_color + 'camera.png', width:26 , height: 26, id: 'photos', badge: param.totalNumberOfPictures }
      ]
    };    
    
    //var width_adjust = Math.round(screen_width) - Math.round(pos);
    var width_adjust = Math.floor(screen_width - styleObj.pos);
    doLog && console.log(LOG_TAG, 'width_adjust: ', width_adjust);
    
    rowContainer = Ti.UI.createView({
        className : 'rowContainer',
        height : Ti.UI.FILL,
        //width : width_adjust,
        width : Ti.UI.FILL,
        layout : 'horizontal'
        //,backgroundColor: 'yellow'
    });
    
    
    // ****************** TEXT NARRATIVES SECTION *******************
     
    textContainer = Ti.UI.createView({
        width : width_adjust,
        height : heightValue,
        left : 0,
        layout : 'horizontal',
        className: 'textContainer',
        //backgroundColor: 'red',
        autoStyle: true
    });

    narrativeTxt = Ti.UI.createLabel({
        className: 'narrativeTxt', 
        id : param.id,
        font : {
            fontSize : Alloy.Globals.fontSizeVal
        },
        color : param.color, 
        text : param.title,
        //id : i,
        hasDetail : param.hasDetail,
        hasChild : param.hasChild,
        left : 15,
        width : Ti.UI.FILL,
        height : Ti.UI.FILL,
        ellipsize : Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
        //wordWrap : true,
        maxLines: 1   
    });
    textContainer.add(narrativeTxt);

    // ****************** ICON NARRATIVES SECTION *******************
    var viewContainerIcons,
    narrativeIconContainer,
    photoIconContainer,
    icon_adjust;
        
    var btn, btnWidth, btnHeight, btnLeft = 0, btnPaddingLeft, btnPaddingTop, btnBadge;
    
    icons_adjust = Math.floor(styleObj.pos - 33);
    doLog && console.log(LOG_TAG, 'icons_adjust: ', icons_adjust, ', width_adjust: ' , width_adjust );  
    viewContainerIcons = Ti.UI.createView({
        width : icons_adjust,
        height : Ti.UI.FILL,
        index: 0,
        right:0,
        //left: (screen_width - pos),
        layout : 'horizontal',
        className: 'containerIcons',
        //backgroundColor: 'green'
    });
     
    btnWidth = Math.floor(styleObj.width / styleObj.icons.length);
    btnHeight = Math.floor(styleObj.height / styleObj.icons.length);
    
    doLog && console.log(LOG_TAG, 'btnWidth:  ', btnWidth, ', btnHeight: ',btnHeight );
    
    for (x=0; x<=styleObj.icons.length-1; x++) {
        if(styleObj.icons[x].id === 'narratives') {

            narrativeIconContainer = Ti.UI.createView({
                width : parseInt(Math.floor((styleObj.width) / 2)),
                height : Ti.UI.FILL,
                layout : 'composite',
                //borderColor: '#000',
                index : 0,
                left : 0,
                className : 'narrativeIconContainer'
            });
        } else {
            photoIconContainer = Ti.UI.createView({
                width : parseInt(Math.floor((styleObj.pos - 33) / 2)),
                height : Ti.UI.FILL,
                //borderColor: '#000',
                layout : 'composite',
                index : 0,
                left : 0,
                className: 'photoIconContainer' 
            });
        }    
        
        btnPaddingLeft = Math.floor( (btnWidth - styleObj.icons[x].width) / 2 );
        btnPaddingTop  = Math.floor( (styleObj.height - styleObj.icons[x].height) / 2 );
        btnLeftFinal = parseInt(btnPaddingLeft);
        
        doLog && console.log(LOG_TAG, 'btnPaddingLeft: ', btnPaddingLeft , ', btnPaddingTop: ', btnPaddingTop, ', btnLeftFinal: ', btnLeftFinal );
        
        btn = Ti.UI.createButton({
            left: btnLeftFinal,
            backgroundImage: styleObj.icons[x].image,
            height:styleObj.icons[x].height,
            width: styleObj.icons[x].width,
            top: btnPaddingTop,
            index: 0,
            className: 'btn'
            //id: styleObj.icons[x].id
        });
        
        btnBadge = alertBadge(styleObj.icons[x].badge,styleObj.icons[x].id, border_badge_color);
            btnBadge.top = 1;
            if(styleObj.icons[x].id === 'narratives') {
                //console.log('here 1');
                btnBadge.left = parseInt(btnLeftFinal + 16);
                narrativeIconContainer.add(btnBadge);    
            }else{
                //console.log('here 2');
                btnBadge.left = parseInt(btnLeftFinal + 19);
                photoIconContainer.add(btnBadge);
            }
            
            doLog && console.log(LOG_TAG, 'styleObj.icons[a].id: ', styleObj.icons[x].id );
    
            if(styleObj.icons[x].id == 'narratives') {
                //console.log('here 11');
                narrativeIconContainer.add(btn);
                viewContainerIcons.add(narrativeIconContainer);
            
            }else{
                //console.log('here 22');
                photoIconContainer.add(btn);
                viewContainerIcons.add(photoIconContainer);
            }
    }
    
    
    
    
    rowContainer.add(textContainer);
    rowContainer.add(viewContainerIcons);

    default_row.add(rowContainer);
    
    
    //default_row = null;    
    rowContainer = null;
    textContainer = null;
    viewContainerIcons = null;
    narrativeIconContainer = null;
    narrativeTxt = null;
    photoIconContainer = null;
    icon_adjust = null;
    
    btn = null;
    btnWidth = null;
    btnHeight = null; 
    btnLeft = null;
    btnPaddingLeft = null; 
    btnPaddingTop = null;
    btnBadge = null;
    
    newWidth = null;
    screen_width = null;
    width_adjust = null;
    row = null;

    fontSizeValue = null;
    heightValue = null;
    sliderValue = null;
    fontSizeValueDefault = null;
    img_color = null;
    border_badge_color = null;
    styleObj = null;
    

        
    return default_row; 
}

var alertBadge = function(badgeText,id, border_badge_color) {
    var badge = Ti.UI.createLabel({
        text: badgeText,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        height: 20,
        width: 20,
        font: {
            fontWeight: 'bold',
            fontSize: 11
        },
        backgroundColor: badge_backgroundColor,
        borderColor: badge_border_color,
        color: badge_color,
        borderRadius: 11,
        borderWidth: 2,
        //id: id,
        index: 1,
        //shadowColor: '#242FC7',
        opacity: 1,
        className: 'badge'
    });
    if (OS_IOS){
        badge.shadowRadius = 2;
        //badge.shadowOpacity = 0.5;
        badge.shadowOffset = {x:1, y:1};
    }
    
    return badge;
};

module.exports = tabbedPanelNarrativeRow;
module.exports.version = 2.0; 