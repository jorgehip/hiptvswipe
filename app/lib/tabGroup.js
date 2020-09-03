// global vars
var tabGroup, win;

/**
 * @property {Boolean} doLog
 * TRUE, if the log message will be show on console.
 * FALSE, if the log message will be hide on console.
 */
var doLog = false; //Ti.App.Properties.getBool('doLog');

/**
 * @property {String} LOG_TAG - Tag of log to use on current document
 */
var LOG_TAG = '[tabGroup]';

doLog && console.log(LOG_TAG, ' start');


// creates an iOS style navbar with title, back support.
function createNavBar(w) {
    doLog && console.log(LOG_TAG, '$~~~~~~~$>> createNavBar: ' );
    
    var navBar = Ti.UI.createView({
        height : OS_IOS ? 65 : 45,
        top : 0,
        backgroundColor : w.navTintColor || "#CCC"
    });

    var back = Ti.UI.createButton({
        left : 15,
        bottom : 5,
        top : 6,
        title : "< back",
        color : w.navTextColor || "#000",
        backgroundImage : "null",
        visible : false
    });

    var winTitle = Ti.UI.createLabel({
        top : 10,
        color : w.navTextColor || "#000",
        font : {
            fontWeight : "bold",
            fontSize : 18
        },
        text : w.title
    });

    w.leftNavButton = back;

    navBar.add(back);
    navBar.winTitle = winTitle;
    navBar.add(winTitle);

    w.navBar = navBar;
    w.add(navBar);
}

// create our tabGroup
exports.createTabGroup = function(args) {
    doLog && console.log(LOG_TAG, '$~~~~~~~$>> createTabGroup: ' );
    if (OS_IOS) {
        return Ti.UI.createTabGroup(args);
    }
    //Ti.API.info("createTabGroup:");
    // host heavyweight window
    win = Ti.UI.createWindow(args);
    // create the nav bar
    //createNavBar(win);

    // tabgroup is a view
    tabGroup = Ti.UI.createView({
        height : 55,
        top : 0,
        layout : "horizontal",
        backgroundColor : '#00345e',
        //backgroundImage : 'green'
    });

    win.add(tabGroup);

    // open the tabGroup window
    tabGroup.open = function() {
        doLog && console.log(LOG_TAG, '$~~~~~~~$>> createTabGroup: -> open()');
        win.open();
    };
    tabGroup.addEventListener('postlayout', function(e) {
        args.tabs.forEach(function(tab, index) {
            var tabGrpWidth = tabGroup.size.width;
            var width = ((tabGrpWidth / args.tabs.length));
            if(index==4)
                width = width-5;
            tab.setWidth(width);
        });
    });

    // position the tabs based on count / %age
    args.tabs.forEach(function(tab, index) {
        tabGroup.add(tab);
        tab.window.top = 55;
        tab.window.bottom = 0;
        if(tab.window)
            tab.window.visible = false;
        win.add(tab.window);
        tab.window.children.forEach(function(child) {
            tab.window.add(child);
        });
    });  
    if(args.tabs[0].window)
        args.tabs[0].window.visible = true; 

    //win.navBar.winTitle.text = args.tabs[0].window.title;
    
    //win.navBar.winTitle.color = args.tabs[0].window.navTextColor;

    // set our default (first) tab
    var lastTab = args.tabs[0];

    // set initial highlights / active elements
    //lastTab.icon.__backgroundImage = lastTab.icon.backgroundImage;
    lastTab.caption.__color = lastTab.caption.color;
    doLog && console.log(LOG_TAG, '@#$%^~~~~ lastTab.backgroundColor: ', lastTab.backgroundColor);
    lastTab.__bgcolor = lastTab.backgroundColor;
    
    

    //lastTab.icon.backgroundImage = lastTab.icon.__backgroundImage;
    lastTab.caption.color = lastTab.activeColor;
    lastTab.backgroundColor = lastTab.backgroundActiveColor;
    doLog && console.log(LOG_TAG, '@#$%^~~~~ lastTab.backgroundActiveColor: ', lastTab.backgroundActiveColor);
    
    //win.navBar.backgroundColor = '#0067ac';

    tabGroup.activeTab = args.tabs[0];
    tabGroup.setActiveTab = function(index){
        doLog && console.log(LOG_TAG, '$~~~~~~~$>> createTabGroup: -> setActiveTab');
        if (lastTab) {
            if(lastTab.window)
                lastTab.window.visible = false;
            //lastTab.icon.backgroundImage = lastTab.icon.__backgroundImage;
            lastTab.caption.color = lastTab.caption.__color;
            lastTab.backgroundColor = lastTab.__bgcolor;
            doLog && console.log (LOG_TAG, "@#$%^~~~~ lastTab.backgroundColor-"+lastTab.backgroundColor);
        }       
        
        var tabToSetActive = args.tabs[index];
        
        //tabToSetActive.icon.__backgroundImage = tabToSetActive.icon.backgroundImage;
        tabToSetActive.caption.__color = tabToSetActive.caption.color;
        tabToSetActive.__bgcolor = tabToSetActive.backgroundColor;
        
        doLog && console.log (LOG_TAG, "@#$%^~~~~ tabToSetActive.backgroundColor"+tabToSetActive.backgroundColor);
       
        //tabToSetActive.icon.backgroundImage = tabToSetActive.icon.__backgroundImage;
        tabToSetActive.caption.color = tabToSetActive.activeColor;
        tabToSetActive.backgroundColor = tabToSetActive.backgroundActiveColor;
        
        doLog && console.log (LOG_TAG, "@#$%^~~~~ tabToSetActive.backgroundActiveColor"+tabToSetActive.backgroundActiveColor);
            
        tabGroup.activeTab = tabToSetActive;
        if(tabToSetActive.window)
            tabToSetActive.window.visible = true;
        
        // emulate the focus event
        tabGroup.fireEvent("focus", {
            type : "focus",
            previousTab : lastTab,
            previousIndex : _.indexOf(args.tabs, lastTab),
            tab : tabToSetActive,
            index : _.indexOf(args.tabs, tabToSetActive),
            source : tabGroup
        });

        // save the current / last tab selected
        lastTab = tabToSetActive;       
        
    };

    // clicking a tab
    tabGroup.addEventListener("click", function(e) {
        doLog && console.log(LOG_TAG, '$~~~~~~~$>> createTabGroup: -> click()');
        //Ti.API.info("Im clicked");
        // if we have a lastTab, reset it
        if (lastTab) {
            //Ti.API.info("Inside last clicked");
            if(lastTab.window)
                lastTab.window.visible = false;
            //lastTab.icon.backgroundImage = lastTab.icon.__backgroundImage;
            lastTab.caption.color = lastTab.caption.__color;
            lastTab.backgroundColor = lastTab.__bgcolor;
            doLog && console.log (LOG_TAG, "@#$%^~~~~ lastTab.__bgcolor: "+lastTab.__bgcolor);
        
        }

        // make the tab window visible
        //Ti.API.info("e.source:"+JSON.stringify(e.source));
        if(e.source.window)
            e.source.window.visible = true;

        // set the activeTab property
        tabGroup.activeTab = e.source;

        // hightlight the caption / icon
        //e.source.icon.__backgroundImage = e.source.icon.backgroundImage;
        //e.source.icon.backgroundImage = e.source.icon.__backgroundImage;
                
        e.source.__bgcolor = e.source.backgroundColor;
        e.source.backgroundColor = e.source.backgroundActiveColor;

        doLog && console.log (LOG_TAG, "@#$%^~~~~ e.source.backgroundActiveColor: "+e.source.backgroundActiveColor);
        
        e.source.caption.__color = e.source.caption.color;
        e.source.caption.color = e.source.activeColor;

        // set the title to the current view title
        //win.navBar.winTitle.text = e.source.window.title;
        //win.navBar.backgroundColor = e.source.window.barColor || "#ccc";
        //win.navBar.winTitle.color = e.source.window.navTextColor;

        // emulate the focus event
        tabGroup.fireEvent("focus", {
            type : "focus",
            previousTab : lastTab,
            previousIndex : _.indexOf(args.tabs, lastTab),
            tab : e.source,
            index : _.indexOf(args.tabs, e.source),
            source : tabGroup
        });

        // save the current / last tab selected
        lastTab = e.source;

    });

    return tabGroup;
};

exports.createTab = function(args) {
    doLog && console.log(LOG_TAG, '$~~~~~~~$>> createTab: ' );
    if (OS_IOS) {
        return Ti.UI.createTab(args);
    }

    // create an instance of a tab
    var tab = Ti.UI.createView(args);
    
    // if we have an icon, use it
    var icon = {};
    if (args.icon) {
        doLog && console.log(LOG_TAG, "$~~~~~~~$>> createTabGroup: tab have icon"+args.icon);
        icon = Ti.UI.createView({
            backgroundImage : args.icon,
            width : 26,
            height : 26,
            color : "#F00",
            top : 6,
            touchEnabled : false
        });
    }

    // create the caption
    var caption = Ti.UI.createLabel({
        text : args.title,
        color : args.color || "#fff",
        bottom : 2,
        font : {
            fontSize : 11
        },
        touchEnabled : false
    });
    //Ti.API.info("args.title:"+args.title);
    // cache the icon / caption against the tab, easier to get at later
    tab.icon = icon;
    tab.caption = caption;

    tab.add(icon);
    tab.add(caption);

    tab.open = function(args) {
        // double check we're dealing with a window
        if (args.toString().indexOf("TiUIWindow")) {

            //createNavBar(args);

            //args.leftNavButton.title = "‹ " + tabGroup.activeTab.title;

            //args.leftNavButton.visible = true;

            //args.leftNavButton.addEventListener("click", function() {
            //  args.close();
            //  args = null;
            //});

            args.open();
        } else {
            // throw the developer a bone
            throw "You need to pass a TiUIWindow";
        }

    };

    return tab;
};

exports.createWindow = function(args) {
    doLog && console.log(LOG_TAG, '$~~~~~~~$>> createWindow: ', JSON.stringify(args) );
    if (OS_IOS) {
        return Ti.UI.createWindow(args);
    }

    var win = Ti.UI.createView(args);

    return win;
};
