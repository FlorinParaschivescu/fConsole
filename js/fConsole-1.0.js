/**
 * Copyright (c) 2016 - Florin Paraschivescu
 * E-mail - emanoil.florin@gmail.com
 * Version - 1.0
 **/

(function () {
    // Define option defaults
    var defaults = {
        hideHeader: false,
        hideFooter: false,
        className: null,
        width: "250px",
        minWidth: 0,
        maxHeight: "250px",
        position: "bottomLeft",
        draggable: true,
        opacity: 1,
        fontSize: "12px",
        fontFamily: "monospace",
        theme: "default",
        logJSErrors: true,
        zIndex: 2147483647
    }

    var options, uniqueId, jQueryIsAvaiable;

    //console elements
    var consoleElement, headerElement, headerTextElement, contentElement, footerElement, noItemElement;

    //actions
    var minimzeButton, closeButton, runJSCodeInput, runJSCodeButton;

    //minimize
    var isMnimimized, minmizeOldWidth, minimizeOldMinWidth, minimizeOldMaxHeight,
        minimizeOldTop, minimizeOldRight, minimizeOldBottom, minimizeOldLeft;

    //draggable
    var drg_fConsole, drg_wasDragged, // Object of the element to be moved
        drg_x_pos = 0, drg_y_pos = 0, // Stores x & y coordinates of the mouse pointer
        drg_x_elem = 0, drg_y_elem = 0; // Stores top, left values (edge) of the element

    //themes
    var themeData;

    //input text archive array
    var execCodeArchive = new Array(), execCodeArchiveCurrentIndex = 0;

    this.fConsole = function () {
        loadOptions(arguments);

        //wait to have the document
        var tid = setInterval(function () {
            if (document.readyState !== "complete") return;
            clearInterval(tid);

            //prevent multiple instance
            if (document.querySelectorAll("[id^=fConsole-]").length) return;

            //init
            fConsole.prototype.init();
        }, 100);
	};
	
	// Public Methods
    fConsole.prototype.init = function () {
        //prevent multiple instance
        if (document.querySelectorAll("[id^=fConsole-]").length) return;
        if (options == null) loadOptions();

        uniqueId = Date.now();
        jQueryIsAvaiable = (window.jQuery ? true : false);
        
		buildHtml.call(this);
		initializeEvents.call(this);
		calculateHeight.call(this);
	}

    fConsole.prototype.close = function () {
        if (consoleElement == null) return;

	    consoleElement.parentNode.removeChild(consoleElement);

	    minimzeButton.removeEventListener("click", minimizeWindow);
	    closeButton.removeEventListener("click", closeWindow);
	    document.removeEventListener("mousemove", drg_move_elem);
	    document.removeEventListener("mouseup", drg_destroy);
	    runJSCodeInput.removeEventListener("keydown", runJSCodeOnPressEnter);
	    runJSCodeButton.removeEventListener("click", runJSCodeOnBtnClick);
        //document.removeEventListener("keydown", keyboardShortcuts);

	    options = null;
	    uniqueId = null;
	    jQueryIsAvaiable = false;

	    consoleElement = null;
	    headerElement = null;
	    headerTextElement = null;
	    contentElement = null;
	    footerElement = null;
	    noItemElement = null;

	    minimzeButton = null;
	    closeButton = null;
	    runJSCodeInput = null;
	    runJSCodeButton = null;

	    execCodeArchive = new Array();
	    execCodeArchiveCurrentIndex = 0;

	    isMnimimized = null;
	    minmizeOldWidth = null;
	    minimizeOldMinWidth = null;
	    minimizeOldMaxHeight = null;
	    minimizeOldTop = null;
	    minimizeOldRight = null;
	    minimizeOldBottom = null;
	    minimizeOldLeft = null;

	    drg_fConsole = null;
	    drg_wasDragged = false;
	    drg_x_pos = 0;
	    drg_y_pos = 0;
	    drg_x_elem = 0;
	    drg_y_elem = 0;
	}

	fConsole.prototype.minimize = function () {
	    if (consoleElement == null) return;

	    if (!isMnimimized) {
	        minmizeOldWidth = consoleElement.offsetWidth;
	        minimizeOldMinWidth = consoleElement.style.minWidth;
	        minimizeOldMaxHeight = consoleElement.style.maxHeight;

	        if (!drg_wasDragged) {
	            switch (options.position) {
	                case "topLeft": { minimizeOldTop = parseInt(getStyle(consoleElement, "top"), 10); minimizeOldLeft = parseInt(getStyle(consoleElement, "left"), 10); break; }
	                case "topRight": { minimizeOldTop = parseInt(getStyle(consoleElement, "top"), 10); minimizeOldRight = parseInt(getStyle(consoleElement, "right"), 10); break; }
	                case "bottomLeft": { minimizeOldBottom = parseInt(getStyle(consoleElement, "top"), 10); minimizeOldLeft = parseInt(getStyle(consoleElement, "left"), 10); break; }
	                case "bottomRight": { minimizeOldBottom = parseInt(getStyle(consoleElement, "top"), 10); minimizeOldRight = parseInt(getStyle(consoleElement, "right"), 10); break; }
	                default: { minimizeOldBottom = parseInt(getStyle(consoleElement, "top"), 10); minimizeOldLeft = parseInt(getStyle(consoleElement, "left"), 10); break; }
	            }
	        } else {
	            minimizeOldTop = parseInt(getStyle(consoleElement, "top"), 10);
	            minimizeOldLeft = parseInt(getStyle(consoleElement, "left"), 10);
	            minimizeOldBottom = 0;
	            minimizeOldRight = 0;
	        }

	        consoleElement.style.width = parseInt(getStyle(headerElement, "padding-left"), 10) + parseInt(getStyle(headerElement, "padding-right"), 10) + minimzeButton.offsetWidth + closeButton.offsetWidth + "px";
	        consoleElement.style.minWidth = parseInt(getStyle(headerElement, "padding-left"), 10) + parseInt(getStyle(headerElement, "padding-right"), 10) + minimzeButton.offsetWidth + closeButton.offsetWidth + "px";
	        consoleElement.style.maxHeight = headerElement.offsetHeight + "px";
	        consoleElement.style.top = "auto";
	        consoleElement.style.right = "auto";
	        consoleElement.style.bottom = "0px";
	        consoleElement.style.left = "0px";

	        headerTextElement.style.display = "none";
	        contentElement.style.display = "none";
	        footerElement.style.display = "none";

	        isMnimimized = true;
	    } else {
	        consoleElement.style.width = minmizeOldWidth + "px";
	        consoleElement.style.minWidth = minimizeOldMinWidth;
	        consoleElement.style.maxHeight = minimizeOldMaxHeight;

	        if (!drg_wasDragged) {
	            switch (options.position) {
	                case "topLeft": { consoleElement.style.top = minimizeOldTop + "px"; consoleElement.style.left = minimizeOldLeft + "px"; break; }
	                case "topRight": { consoleElement.style.top = minimizeOldTop + "px"; consoleElement.style.right = minimizeOldRight + "px"; break; }
	                case "bottomLeft": { consoleElement.style.bottom = minimizeOldBottom + "px"; consoleElement.style.left = minimizeOldLeft + "px"; break; }
	                case "bottomRight": { consoleElement.style.bottom = minimizeOldBottom + "px"; consoleElement.style.right = minimizeOldRight + "px"; break; }
	                default: { consoleElement.style.bottom = minimizeOldBottom + "px"; consoleElement.style.left = minimizeOldLeft + "px"; break; }
	            }
	        } else {
	            consoleElement.style.top = minimizeOldTop + "px";
	            consoleElement.style.right = "";
	            consoleElement.style.bottom = "";
	            consoleElement.style.left = minimizeOldLeft + "px";
	        }

	        headerTextElement.style.display = "block";
	        contentElement.style.display = "block";
	        footerElement.style.display = "block";

	        isMnimimized = false;
	    }
	}

	fConsole.prototype.clearConsole = function () {
	    if (consoleElement != null) {
	        while (contentElement.firstChild) {
	            contentElement.removeChild(contentElement.firstChild);
	        }

	        //no item html
	        var noItemsIdName = "noItems-" + uniqueId;
	        noItemHtml = "<div id='{0}'>No items to show in console.</div>";
	        noItemHtml = noItemHtml.format(noItemsIdName);

	        contentElement.innerHTML = noItemHtml;
	        contentElement.style.height = "auto";
	        calculateHeight.call(this);

	        runJSCodeInput.value = "";
	    }
	}

	fConsole.prototype.reloadSettings = function () {
	    if (jQueryIsAvaiable) {
	        var oldPosition = options.position;

	        loadOptions(arguments);

	        if (isMnimimized) fConsole.prototype.minimize();

	        headerElement.style.display = (options.hideHeader ? "none" : "block");
	        footerElement.style.display = (options.hideFooter ? "none" : "block");
	        if (options.className != null && options.className != "") {
	            consoleElement.className = options.className;
	            consoleElement.removeAttribute("style");
	        }
	        consoleElement.style.width = options.width;
	        consoleElement.style.minWidth = options.minWidth;
	        consoleElement.style.maxHeight = options.maxHeight;
	        if (oldPosition != options.position) {
	            switch (options.position) {
	                case "topLeft": { consoleElement.style.top = "0"; consoleElement.style.left = "0"; consoleElement.style.right = "auto"; consoleElement.style.bottom = "auto"; break; drg_wasDragged = false; }
	                case "topRight": { consoleElement.style.top = "0"; consoleElement.style.right = "0"; consoleElement.style.left = "auto"; consoleElement.style.bottom = "auto"; break; drg_wasDragged = false; }
	                case "bottomLeft": { consoleElement.style.bottom = "0"; consoleElement.style.left = "0"; consoleElement.style.top = "auto"; consoleElement.style.right = "auto"; break; drg_wasDragged = false; }
	                case "bottomRight": { consoleElement.style.bottom = "0"; consoleElement.style.right = "0"; consoleElement.style.top = "auto"; consoleElement.style.left = "auto"; break; drg_wasDragged = false; }
	                default: { consoleElement.style.bottom = "0"; consoleElement.style.left = "0"; consoleElement.style.top = "auto"; consoleElement.style.right = "auto"; }
	            }
	        }
	        consoleElement.style.opacity = options.opacity;
	        consoleElement.style.fontSize = options.fontSize;
	        consoleElement.style.fontFamily = options.fontFamily;

	        getTheme();
	        consoleElement.style.backgroundColor = themeData.consoleBackgroundColor;
	        consoleElement.style.color = themeData.consoleTextColor;
	        contentElement.style.backgroundColor = themeData.contentBackgroundColor;
	        contentElement.style.color = themeData.contentTextColor;
	        headerElement.style.backgroundColor = themeData.headerBackgroundColor;
	        headerElement.style.color = themeData.headerTextColor;
	        headerElement.style.borderBottomColor = themeData.headerBorderColor;
	        headerTextElement.style.color = themeData.headerTextColor;
	        minimzeButton.style.color = themeData.headerTextColor;
	        closeButton.style.color = themeData.headerTextColor;
	        for (var i = 0; i < contentElement.childElementCount; i++) {
	            if (!contentElement.childNodes[i].hasAttribute("specialBgColor")) contentElement.childNodes[i].style.backgroundColor = themeData.contentBackgroundColor;
	            if (!contentElement.childNodes[i].hasAttribute("specialTextColor")) contentElement.childNodes[i].style.color = themeData.contentTextColor;
	        }
	        footerElement.style.backgroundColor = themeData.footerBackgroundColor;
	        footerElement.style.color = themeData.footerTextColor;
	        runJSCodeInput.style.color = themeData.footerTextColor;
	        runJSCodeButton.style.color = themeData.footerButtonTextColor;

	        consoleElement.style.zIndex = options.zIndex;

	        //some calculation
	        if (options.width == "100%") {
	            consoleElement.style.left = 0;
	        }
	    }
	}

	fConsole.prototype.log = function (obj, interval, bgColor, textColor) {
	    if (obj != null && obj != "") {
	        if (consoleElement == null) {
	            fConsole.prototype.init();
	        }

	        if (jQueryIsAvaiable) {
	            getTheme();

	            if (bgColor == null) bgColor = themeData.itemBackgroundColor;
	            if (textColor == null) textColor = themeData.itemTextColor;

	            var msgEncoded = $("<div/>").text(obj).html(),
                    uniqueMsgId = "msg-" + Date.now(),
                    msgHtml = "<div id='{0}' style='background-color: {1}; color: {2}; padding: 3px; border-bottom: 1px dotted {3}; word-wrap: break-word;' {4} {5}>{CONTENT}</div>";

	            msgHtml = msgHtml.format(uniqueMsgId, bgColor, textColor, themeData.itemBorderColor, (bgColor == themeData.itemBackgroundColor ? "" : "specialBgColor"), (textColor == themeData.itemTextColor ? "" : "specialTextColor"));

	            if ($(noItemElement).length) $(noItemElement).remove();

	            $(contentElement).append(msgHtml.replace("{CONTENT}", msgEncoded));

	            if (typeof obj === "function" && interval != null && isNumeric(interval)) {
	                var timer = setInterval(function () {
	                    $("#" + uniqueMsgId, consoleElement).html(obj);
	                }, interval);
	            }

	            //scroll into view
	            $(contentElement).scrollTop($(contentElement)[0].scrollHeight);
	        }
	    }
	}

	fConsole.prototype.rgbToHex = function (rgb) { return rgbToHex(rgb); }
	fConsole.prototype.hexToRgb = function (hex) { return hexToRgb(hex); }
	fConsole.prototype.isNumeric = function (n) { return isNumeric(n); }
	fConsole.prototype.isTouchDevice = function () { return isTouchDevice(); }
	fConsole.prototype.getWindowWidth = function () { return getWindowWidth(); }
	fConsole.prototype.getWindowHeight = function () { return getWindowHeight(); }
	fConsole.prototype.openUrlInNewTab = function (url) { openUrlInNewTab(url); }
	fConsole.prototype.setCookie = function (cookieName, value, exdays) { setCookie(cookieName, value, exdays); }
	fConsole.prototype.setTempCookie = function (cookieName, value) { setTempCookie(cookieName, value); }
	fConsole.prototype.getCookie = function (cookieName) { return getCookie(cookieName); }
	fConsole.prototype.validateEmail = function (email) { return validateEmail(email); }

	fConsole.log = function (obj, interval, bgColor, textColor) {
	    if (obj != null && obj != "") {
	        if (consoleElement == null) {
	            fConsole.prototype.init();
	        }
	        
	        if (jQueryIsAvaiable) {
	            getTheme();

	            if (bgColor == null) bgColor = themeData.itemBackgroundColor;
	            if (textColor == null) textColor = themeData.itemTextColor;
	            
	            var msgEncoded = $("<div/>").text(obj).html(),
                    uniqueMsgId = "msg-" + Date.now(),
                    msgHtml = "<div id='{0}' style='background-color: {1}; color: {2}; padding: 3px; border-bottom: 1px dotted {3}; word-wrap: break-word;' {4} {5}>{CONTENT}</div>";

	            msgHtml = msgHtml.format(uniqueMsgId, bgColor, textColor, themeData.itemBorderColor, (bgColor == themeData.itemBackgroundColor ? "" : "specialBgColor"), (textColor == themeData.itemTextColor ? "" : "specialTextColor"));

	            if ($(noItemElement).length) $(noItemElement).remove();
	            
	            $(contentElement).append(msgHtml.replace("{CONTENT}", msgEncoded));

	            if (typeof obj === "function" && interval != null && isNumeric(interval)) {
	                var timer = setInterval(function () {
	                    $("#" + uniqueMsgId, consoleElement).html(obj);
	                }, interval);
	            }

                //scroll into view
	            $(contentElement).scrollTop($(contentElement)[0].scrollHeight);
	        }
	    }
	}

	fConsole.rgb2hex = function (rgb) { return rgb2hex(rgb); }
	fConsole.hexToRgb = function (hex) { return hexToRgb(hex); }
	fConsole.isNumeric = function (n) { return isNumeric(n); }
	fConsole.isTouchDevice = function () { return isTouchDevice(); }
	fConsole.getWindowWidth = function () { return getWindowWidth(); }
	fConsole.getWindowHeight = function () { return getWindowHeight(); }
	fConsole.openUrlInNewTab = function (url) { openUrlInNewTab(url); }
	fConsole.setCookie = function (cookieName, value, exdays) { setCookie(cookieName, value, exdays); }
	fConsole.setTempCookie = function (cookieName, value) { setTempCookie(cookieName, value); }
	fConsole.getCookie = function (cookieName) { return getCookie(cookieName); }
	fConsole.validateEmail = function (email) { return validateEmail(email); }

	// Private Methods
	function buildHtml() {
        //html
	    var consoleHtml = "", headerHtml = "", contentHtml = "", footerHtml = "", noItemHtml = "", consolePosition = "", stringToReplace = "{CONSOLE-DATA}";
        //ids
	    var consoleIdName = "fConsole-" + uniqueId,
	        headerIdName = "head-" + uniqueId,
            headerTextIdName = "headText-" + uniqueId,
	        contentIdName = "content-" + uniqueId,
	        footerIdName = "footer-" + uniqueId,
	        minimizeBtnIdName = "minimizeBtn-" + uniqueId,
	        closeBtnIdName = "closeBtn-" + uniqueId,
            noItemsIdName = "noItems-" + uniqueId,
	        runJSCodeInputIdName = "txtRunJSCode-" + uniqueId,
	        runJSCodeBtnIdName = "btnRunJSCode-" + uniqueId;

	    //position
	    switch (options.position) {
	        case "topLeft": { consolePosition = "top: 0; left: 0;"; break; }
	        case "topRight": { consolePosition = "top: 0; right: 0;"; break; }
	        case "bottomLeft": { consolePosition = "bottom: 0; left: 0;"; break; }
	        case "bottomRight": { consolePosition = "bottom: 0; right: 0;"; break; }
	        default: { consolePosition = "bottom: 0; left: 0;"; break; }
	    }

	    getTheme();
	    
	    //header
	    if (!options.hideHeader) {
	        headerHtml = "<div id='{0}' style='background-color: {1}; text-align: right; padding: 5px; border-bottom: 1px solid {2};'>" +
                            "<span id={3} style='position: absolute; top: 0; left: 5px; font-style: italic; font-size: 9px; color: {4}; line-height: 24px;'>fConsole v1.0</span>" +
                            "<a id='{5}' href='javascript:void(0);' style='font-family: monospace; font-size: 14px; color: {4}; text-decoration: none; line-height: 100%;' title='minimize'>[_]</a>" +
                            "<a id='{6}' href='javascript:void(0);' style='font-family: monospace; font-size: 14px; color: {4}; text-decoration: none; line-height: 100%;' title='close'>[X]</a>" +
                         "</div>";
	        headerHtml = headerHtml.format(headerIdName, themeData.headerBackgroundColor, themeData.headerBorderColor, headerTextIdName, themeData.headerTextColor, minimizeBtnIdName, closeBtnIdName);
	    }

	    //content
	    contentHtml = "<div id='{0}' style='padding: 10px; overflow-y: auto; background-color: {1}; color: {2};'>{3}</div>";
	    contentHtml = contentHtml.format(contentIdName, themeData.contentBackgroundColor, themeData.contentTextColor, stringToReplace);
	    
        //footer
	    if (!options.hideFooter) {
	        footerHtml = "<div id='{0}' style='background-color: {1};'>" +
                            "<input type='text' id='{2}' autocomplete='off' placeholder='run js code' style='color: {3}; float: left; text-indent: 5px; border: 0; padding: 0; margin: 0; height: 20px; font-family: monospace; outline: none; line-height: 20px; background-color: transparent; border-radius: 0; -webkit-appearance: none; -webkit-border-radius: 0;' />" +
                            "<input type='button' id='{4}' value='Exec' style='float: right; color: {5}; text-align: center; font-family: monospace; border: 0; padding: 0 5px; margin: 0; width: 40px; height: 20px; line-height: 20px; outline: none; border-radius: 0; -webkit-appearance: none; -webkit-border-radius: 0;' />" +
                            "<div style='clear: both;'></div>"
                         "</div>";
	        footerHtml = footerHtml.format(footerIdName, themeData.footerBackgroundColor, runJSCodeInputIdName, themeData.footerTextColor, runJSCodeBtnIdName, themeData.footerButtonTextColor);
	    }
	    
	    //console body
	    if (options.className != null && options.className != "") {
	        consoleHtml = "<div id='{0}' class='{1}'>{2}{3}{4}</div>";
	        consoleHtml = consoleHtml.format(consoleIdName, options.className, headerHtml, contentElement, footerElement);
	    } else {
	        consoleHtml = "<div id='{0}' style='font-family: {1}; font-size: {2}; width: {3}; background-color: {4}; color: {5}; min-width: {6}; max-height: {7}; z-index: {8}; {9} opacity: {10}; position: fixed;'>{11}{12}{13}</div>";
	        consoleHtml = consoleHtml.format(
                consoleIdName,
                options.fontFamily,
                options.fontSize,
                options.width,
                themeData.consoleBackgroundColor,
                themeData.consoleTextColor,
                options.minWidth,
                options.maxHeight,
                options.zIndex,
                consolePosition,
                options.opacity,
                headerHtml, 
                contentHtml,
                footerHtml);
	    }
	    
	    var body = document.getElementsByTagName("body")[0];
	    body.insertAdjacentHTML("beforeend", consoleHtml);
	    
        //init elements
	    consoleElement = document.getElementById(consoleIdName);
	    headerElement = document.getElementById(headerIdName);
	    headerTextElement = document.getElementById(headerTextIdName);
	    contentElement = document.getElementById(contentIdName);
	    footerElement = document.getElementById(footerIdName);
	    minimzeButton = document.getElementById(minimizeBtnIdName);
	    closeButton = document.getElementById(closeBtnIdName);
	    runJSCodeInput = document.getElementById(runJSCodeInputIdName);
	    runJSCodeButton = document.getElementById(runJSCodeBtnIdName);

	    //some calculation
	    if (options.width == "100%") {
	        consoleElement.style.left = 0;
	    }

	    if (!jQueryIsAvaiable) {
	        contentElement.innerHTML = "<div>You need jQuery library.</div>";
			return;
	    }

        //no item html
	    noItemHtml = "<div id='{0}'>No items to show in console.</div>";
	    noItemHtml = noItemHtml.format(noItemsIdName);
		
	    if (!$(consoleIdName).length) {
	        $(contentElement).html(noItemHtml);
	    }

	    //init Elements
	    noItemElement = document.getElementById(noItemsIdName);
	}

	function getTheme() {
	    switch (options.theme) {
	        case "default": {
	            themeData = {
	                consoleBackgroundColor: "transparent",
	                consoleTextColor: "#C0C0C0",
	                contentBackgroundColor: "#333333",
	                contentTextColor: "#C0C0C0",
	                itemBackgroundColor: "transparent",
	                itemTextColor: "#C0C0C0",
	                itemBorderColor: "#00FF00",
	                headerBackgroundColor: "#3B92FE",
	                headerTextColor: "#FFF",
	                headerBorderColor: "#FFF",
	                footerBackgroundColor: "#ECE9D8",
	                footerTextColor: "#000",
	                footerButtonTextColor: "#000"
	            };
	            break;
	        }
	        case "clasic": {
	            themeData = {
                    consoleBackgroundColor: "#000",
	                consoleTextColor: "#00FF00",
	                contentBackgroundColor: "#000",
	                contentTextColor: "#00FF00",
	                itemBackgroundColor: "#000",
	                itemTextColor: "#00FF00",
	                itemBorderColor:"#00FF00",
                    headerBackgroundColor: "#000",
                    headerTextColor: "#FFF",
                    headerBorderColor: "#FFF",
                    footerBackgroundColor: "#222",
                    footerTextColor: "#FFF",
                    footerButtonTextColor: "#000"
	            };
	            break;
	        }
	        case "light": {
	            themeData = {
	                consoleBackgroundColor: "transparent",
	                consoleTextColor: "#CBA837",
	                contentBackgroundColor: "#FDF6E3",
	                contentTextColor: "#CBA837",
	                itemBackgroundColor: "#FDF6E3",
	                itemTextColor: "#CBA837",
	                itemBorderColor: "#00FF00",
	                headerBackgroundColor: "#B6D4EC",
	                headerTextColor: "#000",
	                headerBorderColor: "#FFF",
	                footerBackgroundColor: "#B6D4EC",
	                footerTextColor: "#000",
	                footerButtonTextColor: "#000"
	            };
	            break;
	        }
	        default: {
	            themeData = {
	                consoleBackgroundColor: "#000",
	                consoleTextColor: "#00FF00",
	                contentBackgroundColor: "#000",
	                contentTextColor: "#00FF00",
	                itemBackgroundColor: "#000",
	                itemTextColor: "#00FF00",
	                itemBorderColor: "#00FF00",
	                headerBackgroundColor: "#000",
	                headerTextColor: "#FFF",
	                headerBorderColor: "#FFF",
	                footerBackgroundColor: "#000",
	                footerTextColor: "#4585F2",
	                footerButtonTextColor: "#000"
	            }
	            break;
	        }
	    }
	}

	function initializeEvents() {
	    if (!options.hideHeader) {
	        //minimize btn event
	        minimzeButton.addEventListener("click", minimizeWindow);

            //close btn event
	        closeButton.addEventListener("click", closeWindow);
	    }

	    if (!options.hideFooter) {
	        //run js code input
	        runJSCodeInput.addEventListener("keydown", runJSCodeOnPressEnter);

	        //run js code button
	        runJSCodeButton.addEventListener("click", runJSCodeOnBtnClick);
	    }

	    document.addEventListener("keydown", keyboardShortcuts);

	    //draggable
	    if (options.draggable && !options.hideHeader) {
	        headerElement.onmousedown = function () {
                if (!isMnimimized) drg_init(consoleElement);
	            return false;
	        };

	        document.addEventListener("mousemove", drg_move_elem);
	        document.addEventListener("mouseup", drg_destroy);

	        //for touch devices
	        if (isTouchDevice() && jQueryIsAvaiable) {
	            //draggable fuction for touch devices
	            $.fn.draggable = function () {
	                var offset = null;
	                var start = function (e) {
	                    if (isMnimimized) return;

	                    if (options.draggable && !options.hideHeader) {
	                        var orig = e.originalEvent;
	                        var pos = $(this).parent().position();
	                        offset = {
	                            x: orig.changedTouches[0].pageX - pos.left,
	                            y: orig.changedTouches[0].pageY - pos.top
	                        };
	                    }
	                };
	                var moveMe = function (e) {
	                    e.preventDefault();
	                    var orig = e.originalEvent;
	                    $(this).parent().css({
	                        top: ((orig.changedTouches[0].pageY - offset.y) <= 0 ? 0 : orig.changedTouches[0].pageY - offset.y),
	                        left: orig.changedTouches[0].pageX - offset.x
	                    });

	                    drg_wasDragged = true;
	                };
	                this.bind("touchstart", start);
	                this.bind("touchmove", moveMe);
	            };

	            $(headerElement).draggable();
	        }
	    }

	    //log js errors
	    if (options.logJSErrors) {
	        window.onerror = function (error, url, line) {
	            fConsole.log(error + " in " + url + " on line:" + line, null, "#FF0000", "#FFF");
	        };
	    }	    
	}

	function loadOptions(args) {
	    if (args == null) args = arguments;

	    // Create options by extending defaults with the passed in arugments
	    if (args[0] && typeof args[0] === "object") {
	        options = extendDefaults(defaults, args[0]);
	    } else {
	        options = defaults;
	    }
	    
	    if (isNumeric(options.width)) options.width = options.width + "px";
	    if (isNumeric(options.minWidth)) options.minWidth = options.minWidth + "px";
	    if (isNumeric(options.maxHeight)) options.maxHeight = options.maxHeight + "px";
	    if (isNumeric(options.fontSize)) options.fontSize = options.fontSize + "px";
	}

    //event listens methods
	function minimizeWindow() { fConsole.prototype.minimize(); }
	function closeWindow() { fConsole.prototype.close(); }
	function keyboardShortcuts(event) {
	    //alt + c - OPEN
	    if (event.altKey && event.keyCode == 67) {
	        event.preventDefault();
	        
	        if (isMnimimized)
	            minimizeWindow();
	        else
	            fConsole.prototype.init();
	    }

	    //alt + x - CLOSE
	    if (event.altKey && event.keyCode == 88) {
	        event.preventDefault();
	        
	        closeWindow();
	    }

	    //alt + z - MINIMIZE
	    if (event.altKey && event.keyCode == 90) {
	        event.preventDefault();

	        minimizeWindow();
	    }

	    //alt + d - clear console
	    if (event.altKey && event.keyCode == 68) {
	        event.preventDefault();

	        fConsole.prototype.clearConsole();	        
	    }
	}
	function runJSCodeOnPressEnter(event) {
	    switch (event.keyCode) {
	        case 13: {//enter key
	            event.preventDefault();
	            try {
	                if (runJSCodeInput.value.length > 0) {
	                    var result = (new Function("return " + runJSCodeInput.value)());
	                    fConsole.log(result);
	                }
	            }
	            catch (err) {
	                fConsole.log(err.stack.split("\n")[0], null, "#FF0000", "#FFF");
	                //fConsole.log(err.stack.split("\n")[1], null, "#FF0000", "#FFF");
	                //fConsole.log(err.stack.split("\n")[2], null, "#FF0000", "#FFF");
	            }

	            execCodeArchive.push(runJSCodeInput.value);
	            execCodeArchiveCurrentIndex = execCodeArchive.length;
	            runJSCodeInput.value = "";

	            return false;
	        }
	        case 38: {//up arrow
	            event.preventDefault();
	            if (execCodeArchive.length > 0) {
	                if (execCodeArchiveCurrentIndex > 0)
	                    execCodeArchiveCurrentIndex -= 1;

	                runJSCodeInput.value = execCodeArchive[execCodeArchiveCurrentIndex];
	                
	            }
	            return false;
	        }
	        case 40: {//down arrow
	            event.preventDefault();
	            if (execCodeArchive.length > 0) {
	                if (execCodeArchiveCurrentIndex < execCodeArchive.length) {
	                    execCodeArchiveCurrentIndex += 1;
	                    runJSCodeInput.value = execCodeArchive[execCodeArchiveCurrentIndex - 1];
	                }

	                if (execCodeArchiveCurrentIndex == execCodeArchive.length) {
	                    runJSCodeInput.value = "";
	                }
	            }
	            return false;
	        }
	    }
	}
	function runJSCodeOnBtnClick() {
	    try {
	        if (runJSCodeInput.value.length > 0) {
	            var result = (new Function("return " + runJSCodeInput.value)());
	            fConsole.log(result);
	        }
	    }
	    catch (err) {
	        fConsole.log(err.stack.split("\n")[0], null, "#FF0000", "#FFF");
	        //fConsole.log(err.stack.split("\n")[1], null, "#FF0000", "#FFF");
	        //fConsole.log(err.stack.split("\n")[2], null, "#FF0000", "#FFF");
	    }

	    execCodeArchive.push(runJSCodeInput.value);
	    execCodeArchiveCurrentIndex = execCodeArchive.length;
	    runJSCodeInput.value = "";

	    return false;
	}
    
    //plugin methods
	function calculateHeight() {
	    var contentHeightInterval = setInterval(function () {
	        if (consoleElement == null) {
	            clearInterval(contentHeightInterval);
	            return;
	        }

	        var headHeight = 0, contentHeight = 0, fotterHeight = 0, maxHeight = parseInt(options.maxHeight, 10);

	        if (!options.hideHeader) headHeight = headerElement.offsetHeight;
	        if (!options.hideFooter) fotterHeight = footerElement.offsetHeight;

	        if (isMnimimized)
	            contentHeight = contentElement.childElementCount * 19; //19 is ~default height
	        else
	            contentHeight = contentElement.offsetHeight;

	        //initial height
	        consoleElement.style.height = ((!options.hideHeader ? headerElement.offsetHeight : 0) + (!options.hideFooter ? footerElement.offsetHeight : 0) + contentHeight) + "px";

	        if ((headHeight + contentHeight + fotterHeight) > maxHeight) {
	            contentElement.style.height = (maxHeight - (headHeight + fotterHeight) - (parseInt(getStyle(contentElement, "padding-top"), 10) + parseInt(getStyle(contentElement, "padding-bottom"), 10))) + "px";

	            //we remove the initial height
	            consoleElement.style.height = "";

	            clearInterval(contentHeightInterval);
	        }
	    }, 100);

	    var footerHeightInterval = setInterval(function () {
	        if (runJSCodeInput == null || footerElement == null || runJSCodeButton == null) {
	            clearInterval(footerHeightInterval);
	            return;
	        }
	        runJSCodeInput.style.width = footerElement.offsetWidth - runJSCodeButton.offsetWidth + "px";
	    }, 100);
	}

	function getStyle(el, styleProp) {
	    var value, defaultView = (el.ownerDocument || document).defaultView;
	    // W3C standard way:
	    if (defaultView && defaultView.getComputedStyle) {
	        // sanitize property name to css notation
	        // (hypen separated words eg. font-Size)
	        styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();
	        return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
	    } else if (el.currentStyle) { // IE
	        // sanitize property name to camelCase
	        styleProp = styleProp.replace(/\-(\w)/g, function (str, letter) {
	            return letter.toUpperCase();
	        });
	        value = el.currentStyle[styleProp];
	        // convert other units to pixels on IE
	        if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
	            return (function (value) {
	                var oldLeft = el.style.left, oldRsLeft = el.runtimeStyle.left;
	                el.runtimeStyle.left = el.currentStyle.left;
	                el.style.left = value || 0;
	                value = el.style.pixelLeft + "px";
	                el.style.left = oldLeft;
	                el.runtimeStyle.left = oldRsLeft;
	                return value;
	            })(value);
	        }
	        return value;
	    }
	}

    //helper methods
	function isNumeric(n) {
	    return !isNaN(parseFloat(n)) && isFinite(n);
	}
	function isTouchDevice() {
	    var result = 'ontouchstart' in window        // works on most browsers 
                     || navigator.maxTouchPoints;       // works on IE10/11 and Surface

	    return result == 1 ? true : false;
	}
	function rgbToHex(rgb) {
	    if (rgb == null || "") return;

	    if (rgb.search("rgb") == -1) {
	        return rgb;
	    } else {
	        rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
	        function hex(x) {
	            return ("0" + parseInt(x, 10).toString(16)).slice(-2);
	        }
	        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
	    }
	}
	function hexToRgb(hex) {
	    if (hex == null || hex == NaN || hex == undefined) return null;
	    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
	        return r + r + g + g + b + b;
	    });

	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	}
	function getWindowWidth() { return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth; }
	function getWindowHeight() { return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight; }
	function openUrlInNewTab(url) {
	    var win = window.open(url, '_blank');
        if (win != null) win.focus();
	}
	function setCookie(cookieName, value, exdays) {
	    var exdate = new Date();
	    exdate.setDate(exdate.getDate() + exdays);
	    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
	    document.cookie = cookieName + "=" + c_value + "; path=/";
	}
	function setTempCookie(cookieName, value) {
	    var c_value = escape(value);
	    document.cookie = cookieName + "=" + c_value + "; path=/";
	}
	function getCookie(cookieName) {
	    var i, x, y, ARRcookies = document.cookie.split(";");
	    for (i = 0; i < ARRcookies.length; i++) {
	        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
	        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
	        x = x.replace(/^\s+|\s+$/g, "");
	        if (x == cookieName) {
	            return unescape(y);
	        }
	    }
	}
	function validateEmail(email) {
	    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	}

    // Format fuction - First, checks if it isn't implemented yet.
	if (!String.prototype.format) {
	    String.prototype.format = function () {
	        var args = arguments;
	        return this.replace(/{(\d+)}/g, function (match, number) {
	            return typeof args[number] != 'undefined'
                  ? args[number]
                  : match
	            ;
	        });
	    };
	}

    //#region DRAGGABLE

    // Will be called when user starts dragging an element
	function drg_init(elem) {
	    // Store the object of the element which needs to be moved
	    if (options.draggable && !options.hideHeader) {
	        drg_fConsole = elem;
	        drg_x_elem = drg_x_pos - drg_fConsole.offsetLeft;
	        drg_y_elem = drg_y_pos - drg_fConsole.offsetTop;
	    }
	}

    // Will be called when user dragging an element
	function drg_move_elem(e) {
	    drg_x_pos = document.all ? window.event.clientX : e.pageX;
	    drg_y_pos = document.all ? window.event.clientY : e.pageY;
	    
	    if (drg_fConsole != null) {
	        drg_fConsole.style.left = (drg_x_pos - drg_x_elem) + "px";
	        drg_fConsole.style.top = ((drg_y_pos - drg_y_elem) <= 0 ? 0 : drg_y_pos - drg_y_elem) + "px";

	        drg_wasDragged = true;
	    }
	}

    // Destroy the object when we are done
	function drg_destroy() {
	    drg_fConsole = null;
	    drg_x_pos = 0;
	    drg_y_pos = 0;
	    drg_x_elem = 0;
	    drg_y_elem = 0;
	}

    //endregion

    // Utility method to extend defaults with user options
	function extendDefaults(source, properties) {
	    var property;
	    for (property in properties) {
	        if (properties.hasOwnProperty(property)) {
	            source[property] = properties[property];
	        }
	    }
	    return source;
	}
})();