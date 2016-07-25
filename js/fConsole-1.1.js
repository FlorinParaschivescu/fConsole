/**
 * Copyright (c) 2016 - Florin Paraschivescu
 * E-mail - emanoil.florin@gmail.com
 * Version - 1.1
 **/

(function () {
    var _this = this;

    //default options
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

    var options, uniqueId;

    //console elements
    var consoleElement, headerElement, headerTextElement, contentElement, footerElement, noItemElement;

    //actions
    var clearConsoleButton, minimzeButton, closeButton, runJSCodeInput, runJSCodeButton, resizeControl;

    //minimize
    var isMinmimized, minmizeOldWidth, minimizeOldMinWidth, minimizeOldMaxHeight,
        minimizeOldTop, minimizeOldRight, minimizeOldBottom, minimizeOldLeft;

    //draggable
    var drg_fConsole, drg_wasDragged, // Object of the element to be moved
        drg_x_pos = 0, drg_y_pos = 0, // Stores x & y coordinates of the mouse pointer
        drg_x_elem = 0, drg_y_elem = 0; // Stores top, left values (edge) of the element

    //resize window
    var resizeStartX, resizeStartWidth;//, resizeStartY, resizeStartHeight;

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

    //main prototype methods
    fConsole.prototype.init = function () {
        //prevent multiple instance
        if (document.querySelectorAll("[id^=fConsole-]").length) return;
        if (options == null) loadOptions();

        uniqueId = Date.now();

        buildHtml.call(this);
        initializeEvents.call(this);
        calculateHeight.call(this);
    }
    fConsole.prototype.clear = function () { clearConsole(); }
    fConsole.prototype.minimize = function () { minimizeWindow(); }
    fConsole.prototype.close = function () { closeWindow(); }
    fConsole.prototype.reloadSettings = function () {
        if (_fn_jQueryIsAvailable()) {
            var oldPosition = options.position;

            loadOptions(arguments);

            if (isMinmimized) fConsole.prototype.minimize();

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
            clearConsoleButton.style.color = themeData.headerTextColor;
            minimzeButton.style.color = themeData.headerTextColor;
            closeButton.style.color = themeData.headerTextColor;
            for (var i = 0; i < contentElement.childElementCount; i++) {
                if (!contentElement.childNodes[i].hasAttribute("specialBgColor")) contentElement.childNodes[i].style.backgroundColor = themeData.contentBackgroundColor;
                if (!contentElement.childNodes[i].hasAttribute("specialTextColor")) contentElement.childNodes[i].style.color = themeData.contentTextColor;
            }
            footerElement.style.backgroundColor = themeData.footerBackgroundColor;
            //footerElement.style.color = themeData.footerTextColor;
            $("div", resizeControl).each(function () {
                $(this).css({ backgroundColor: themeData.footerDotResizeBackgroundColor });
            });
            
            runJSCodeInput.style.color = themeData.footerTextColor;
            runJSCodeButton.style.color = themeData.footerButtonTextColor;

            consoleElement.style.zIndex = options.zIndex;

            //some calculation
            if (options.width == "100%") {
                consoleElement.style.left = 0;
            }
        }
    }
    fConsole.prototype.log = function (obj, interval, bgColor, textColor) { log(obj, interval, bgColor, textColor); }
    fConsole.prototype.fn = {
        //#region Boolean

        isNumeric: function (value) { return _fn_isNumeric(value); },
        isInt: function (n) { return _fn_isInt(n); },
        isFloat: function (n) { return _fn_isFloat(n); },
        isBoolean: function (value) { return _fn_isBoolean(value); },
        isTouchDevice: function (value) { return _fn_isTouchDevice(value); },
        isiOS: function () { return _fn_isiOS(); },
        isAndroid: function () { return isAndroid(); },
        isWindowsPhone: function () { return _fn_isWindowsPhone(); },
        isMobile: function () { return _fn_isMobile(); },
        jQueryIsAvailable: function () { return _fn_jQueryIsAvailable(); },

        //#endregion
        //#region Colors

        rgbToHex: function (rgb) { return _fn_rgbToHex(rgb); },
        hexToRgb: function (hex) { return _fn_hexToRgb(hex); },

        //#endregion
        //#region Size related

        getWindowWidth: function () { return _fn_getWindowWidth(); },
        getWindowHeight: function () { return _fn_getWindowHeight(); },
        getDocumetHeight: function () { return _fn_getDocumetHeight(); },

        //#endregion
        //#region Cookies

        setCookie: function (cookieName, value, exdays) { return _fn_setCookie(cookieName, value, exdays); },
        setTempCookie: function (cookieName, value) { return _fn_setTempCookie(cookieName, value); },
        getCookie: function (cookieName) { return _fn_getCookie(cookieName); },

        //#endregion
        //#region Validations

        validateEmail: function (email) { return _fn_validateEmail(email); },
        validateIPaddress: function (ipaddress) { return _fn_validateIPaddress(ipaddress); },

        //#endregion
        //#region Strings

        format: function (string) { return _fn_format(string); },
        capitalize: function (string) { return _fn_capitalize(string); },
        capitalizeFirstLetter: function (string) { return _fn_capitalizeFirstLetter(string); },
        startsWith: function (string, prefix, ignoreCases) { return _fn_startsWith(string, prefix, ignoreCases); },
        endsWith: function (string, suffix, ignoreCases) { return _fn_endsWith(string, suffix, ignoreCases); },
        replaceAll: function (string, find, replaceWith) { return _fn_replaceAll(string, find, replaceWith); },
        linkify: function (string) { return _fn_linkify(string); },
        contains: function (string, substring) { return _fn_contains(string, substring); },
        encodeHTML: function (string) { return _fn_encodeHTML(string); },
        decodeHTML: function (string) { return _fn_decodeHTML(string); },
        encodeBase64: function (input) { return _fn_encodeBase64(input); },
        decodeBase64: function (input) { return _fn_decodeBase64(input); },
        encodeUTF8Base64: function (input) { return _fn_encodeUTF8Base64(input); },
        decodeUTF8Base64: function (input) { return _fn_decodeUTF8Base64(input); },

        //#endregion
        //#region URL

        getUrlParams: function(url) { return _fn_getUrlParams(url); },
        encodeURL: function (uri) { return _fn_encodeURL(uri); },
        decodeURL: function (uri) { return _fn_decodeURL(uri); },

        //#endregion
        //#region JSON & Arrays

        sortJSONby: function (json, propertyName, order) { return _fn_sortJSONby(json, propertyName, order); },
        shuffleArray: function (array) { return _fn_shuffleArray(array); },
        uniqueArray: function (array) { return _fn_uniqueArray(array); },

        //#endregion
        //#region DateTime

        getCurrentTime: function (format, is24hFormat) { return _fn_getCurrentTime(format, is24hFormat); },
        getCurrentDate: function (format) { return _fn_getCurrentDate(format); },
        getUTCDateTime: function () { return _fn_getUTCDateTime(); },
        leapYear: function (year) { return _fn_leapYear(year); },
        getTimeAgoFromJsDate: function (time) { return _fn_getTimeAgoFromJsDate(time); },
        getTimeAgoFromSqlDate: function (sqlDate) { return _fn_getTimeAgoFromSqlDate(sqlDate); },

        //#endregion
        //#region Random

        generateRandomInt: function (min, max) { return _fn_generateRandomInt(min, max); },
        generateRandomArbitrary: function (min, max, nrOfdecimallaces) { return _fn_generateRandomArbitrary(min, max, nrOfdecimallaces); },
        generateRandomString: function (len, charSet) { return _fn_generateRandomString(len, charSet); },
        generateGUID: function () { return _fn_generateGUID(); },

        //#endregion
        //#region Others

        loadJSScriptDynamically: function (src, callback) { return _fn_loadJSScriptDynamically(src, callback); },
        loadCssFile: function (src) { return _fn_loadCssFile(src); },
        cloneObj: function (obj) { return _fn_cloneObj(obj); },
        getBrowser: function () { return _fn_getBrowser(); },
        getBrowserVersion: function () { return _fn_getBrowserVersion(); },
        getIEVersion: function () { return _fn_getIEVersion(); },
        getOS: function () { return _fn_getOS(); },
        getDoctype: function () { return _fn_getDoctype(); }

        //#endregion
    };

    //main public methods
    fConsole.log = function (obj, interval, bgColor, textColor) { log(obj, interval, bgColor, textColor); }
    fConsole.clear = function () { clearConsole(); }
    fConsole.minimize = function () { minimizeWindow(); }
    fConsole.close = function () { closeWindow(); }
    fConsole.fn = {
        //#region Boolean

        isNumeric: function (value) { return _fn_isNumeric(value); },
        isInt: function (n) { return _fn_isInt(n); },
        isFloat: function (n) { return _fn_isFloat(n); },
        isBoolean: function (value) { return _fn_isBoolean(value); },
        isTouchDevice: function (value) { return _fn_isTouchDevice(value); },
        isiOS: function () { return _fn_isiOS(); },
        isAndroid: function () { return isAndroid(); },
        isWindowsPhone: function () { return _fn_isWindowsPhone(); },
        isMobile: function () { return _fn_isMobile(); },
        jQueryIsAvailable: function () { return _fn_jQueryIsAvailable(); },

        //#endregion
        //#region Colors

        rgbToHex: function (rgb) { return _fn_rgbToHex(rgb); },
        hexToRgb: function (hex) { return _fn_hexToRgb(hex); },

        //#endregion
        //#region Size related

        getWindowWidth: function () { return _fn_getWindowWidth(); },
        getWindowHeight: function () { return _fn_getWindowHeight(); },
        getDocumetHeight: function () { return _fn_getDocumetHeight(); },

        //#endregion
        //#region Cookies

        setCookie: function (cookieName, value, exdays) { return _fn_setCookie(cookieName, value, exdays); },
        setTempCookie: function (cookieName, value) { return _fn_setTempCookie(cookieName, value); },
        getCookie: function (cookieName) { return _fn_getCookie(cookieName); },

        //#endregion
        //#region Validations

        validateEmail: function (email) { return _fn_validateEmail(email); },
        validateIPaddress: function (ipaddress) { return _fn_validateIPaddress(ipaddress); },

        //#endregion
        //#region Strings

        format: function (string) { return _fn_format(string); },
        capitalize: function (string) { return _fn_capitalize(string); },
        capitalizeFirstLetter: function (string) { return _fn_capitalizeFirstLetter(string); },
        startsWith: function (string, prefix, ignoreCases) { return _fn_startsWith(string, prefix, ignoreCases); },
        endsWith: function (string, suffix, ignoreCases) { return _fn_endsWith(string, suffix, ignoreCases); },
        replaceAll: function (string, find, replaceWith) { return _fn_replaceAll(string, find, replaceWith); },
        linkify: function (string) { return _fn_linkify(string); },
        contains: function (string, substring) { return _fn_contains(string, substring); },
        encodeHTML: function (string) { return _fn_encodeHTML(string); },
        decodeHTML: function (string) { return _fn_decodeHTML(string); },
        encodeBase64: function (input) { return _fn_encodeBase64(input); },
        decodeBase64: function (input) { return _fn_decodeBase64(input); },
        encodeUTF8Base64: function (input) { return _fn_encodeUTF8Base64(input); },
        decodeUTF8Base64: function (input) { return _fn_decodeUTF8Base64(input); },

        //#endregion
        //#region URL

        getUrlParams: function (url) { return _fn_getUrlParams(url); },
        encodeURL: function (uri) { return _fn_encodeURL(uri); },
        decodeURL: function (uri) { return _fn_decodeURL(uri); },

        //#endregion
        //#region JSON & Arrays

        sortJSONby: function (json, propertyName, order) { return _fn_sortJSONby(json, propertyName, order); },
        shuffleArray: function (array) { return _fn_shuffleArray(array); },
        uniqueArray: function (array) { return _fn_uniqueArray(array); },

        //#endregion
        //#region DateTime

        getCurrentTime: function (format, is24hFormat) { return _fn_getCurrentTime(format, is24hFormat); },
        getCurrentDate: function (format) { return _fn_getCurrentDate(format); },
        getUTCDateTime: function () { return _fn_getUTCDateTime(); },
        leapYear: function (year) { return _fn_leapYear(year); },
        getTimeAgoFromJsDate: function (time) { return _fn_getTimeAgoFromJsDate(time); },
        getTimeAgoFromSqlDate: function (sqlDate) { return _fn_getTimeAgoFromSqlDate(sqlDate); },

        //#endregion
        //#region Random

        generateRandomInt: function (min, max) { return _fn_generateRandomInt(min, max); },
        generateRandomArbitrary: function (min, max, nrOfdecimallaces) { return _fn_generateRandomArbitrary(min, max, nrOfdecimallaces); },
        generateRandomString: function (len, charSet) { return _fn_generateRandomString(len, charSet); },
        generateGUID: function () { return _fn_generateGUID(); },

        //#endregion
        //#region Others

        loadJSScriptDynamically: function (src, callback) { return _fn_loadJSScriptDynamically(src, callback); },
        loadCssFile: function (src) { return _fn_loadCssFile(src); },
        cloneObj: function (obj) { return _fn_cloneObj(obj); },
        getBrowser: function () { return _fn_getBrowser(); },
        getBrowserVersion: function () { return _fn_getBrowserVersion(); },
        getIEVersion: function () { return _fn_getIEVersion(); },
        getOS: function () { return _fn_getOS(); },
        getDoctype: function () { return _fn_getDoctype(); }

        //#endregion
    };

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
            clearConsoleBtnIdName = "clearConsoleBtn-" + uniqueId,
	        minimizeBtnIdName = "minimizeBtn-" + uniqueId,
	        closeBtnIdName = "closeBtn-" + uniqueId,
            noItemsIdName = "noItems-" + uniqueId,
	        runJSCodeInputIdName = "txtRunJSCode-" + uniqueId,
	        runJSCodeBtnIdName = "btnRunJSCode-" + uniqueId,
	        resizeControlName = "resize-" + uniqueId;

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
	        headerHtml = "<div id='{0}' style='background-color: {1}; text-align: right; padding: 5px; border-bottom: 1px solid {2}; border-radius: 5px 5px 0 0;'>" +
                            "<span id={3} style='position: absolute; top: 0; left: 5px; font-style: italic; font-size: 9px; color: {4}; line-height: 24px;'>fConsole v1.1</span>" +
                            "<a id='{7}' href='javascript:void(0);' style='font-family: monospace; font-size: 14px; color: {4}; text-decoration: none; line-height: 100%;' title='clear'>[C]</a>" +
                            "<a id='{5}' href='javascript:void(0);' style='font-family: monospace; font-size: 14px; color: {4}; text-decoration: none; line-height: 100%;' title='minimize'>[_]</a>" +
                            "<a id='{6}' href='javascript:void(0);' style='font-family: monospace; font-size: 14px; color: {4}; text-decoration: none; line-height: 100%;' title='close'>[X]</a>" +
                         "</div>";
	        headerHtml = _fn_format(headerHtml, headerIdName, themeData.headerBackgroundColor, themeData.headerBorderColor, headerTextIdName, themeData.headerTextColor, minimizeBtnIdName, closeBtnIdName, clearConsoleBtnIdName);
	    }

	    //content
	    contentHtml = "<div id='{0}' style='overflow-y: auto; background-color: {1}; color: {2};'>{3}</div>";
	    contentHtml = _fn_format(contentHtml, contentIdName, themeData.contentBackgroundColor, themeData.contentTextColor, stringToReplace);
	    
        //footer
	    if (!options.hideFooter) {
	        footerHtml = "<div id='{0}' style='background-color: {1}; border-radius: 0 0 5px 5px; position: relative;'>" +
                            "<input type='text' id='{2}' autocomplete='off' placeholder='run js code' style='color: {3}; text-indent: 5px; border: 0; padding: 0; margin: 0; height: 20px; font-family: monospace; outline: none; line-height: 20px; background-color: transparent; border-radius: 0; -webkit-appearance: none; -webkit-border-radius: 0;' />" +
                            "<input type='button' id='{4}' value='Exec' style='color: {5}; background-color: {6}; text-align: center; font-family: monospace; border: 0; padding: 0 5px; margin: 0; width: 40px; height: 20px; line-height: 20px; outline: none; border-radius: 0; -webkit-appearance: none; -webkit-border-radius: 0;' />" +
                            "<div id='{7}' style='position: absolute; height: 100%; width: 15px; top: 0; right: 0; background-color: transparent; cursor: e-resize;'>" +
                                "<div style='position: absolute; left: 3px; bottom: 3px; width: 2px; height: 2px; background-color: {8};'></div>" +
                                "<div style='position: absolute; left: 7px; bottom: 3px; width: 2px; height: 2px; background-color: {8};'></div>" +
                                "<div style='position: absolute; left: 11px; bottom: 3px; width: 2px; height: 2px; background-color: {8};'></div>" +
                                "<div style='position: absolute; left: 7px; bottom: 7px; width: 2px; height: 2px; background-color: {8};'></div>" +
                                "<div style='position: absolute; left: 11px; bottom: 7px; width: 2px; height: 2px; background-color: {8};'></div>" +
                                "<div style='position: absolute; left: 11px; bottom: 11px; width: 2px; height: 2px; background-color: {8};'></div>" +
                            "</div>" +
                         "</div>";
	        
	        footerHtml = _fn_format(footerHtml, footerIdName, themeData.footerBackgroundColor, runJSCodeInputIdName, themeData.footerTextColor, runJSCodeBtnIdName, themeData.footerButtonTextColor, themeData.footerButtonBackgroundColor, resizeControlName, themeData.footerDotResizeBackgroundColor);
	    }
	    
	    //console body
	    if (options.className != null && options.className != "") {
	        consoleHtml = "<div id='{0}' class='{1}'>{2}{3}{4}</div>";
	        consoleHtml = _fn_format(consoleHtml, consoleIdName, options.className, headerHtml, contentElement, footerElement);
	    } else {
	        consoleHtml = "<div id='{0}' style='font-family: {1}; font-size: {2}; width: {3}; background-color: {4}; color: {5}; min-width: {6}; max-height: {7}; z-index: {8}; {9} opacity: {10}; position: fixed;'>{11}{12}{13}</div>";
	        consoleHtml = _fn_format(consoleHtml,
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
	    clearConsoleButton = document.getElementById(clearConsoleBtnIdName);
	    minimzeButton = document.getElementById(minimizeBtnIdName);
	    closeButton = document.getElementById(closeBtnIdName);
	    runJSCodeInput = document.getElementById(runJSCodeInputIdName);
	    runJSCodeButton = document.getElementById(runJSCodeBtnIdName);
	    resizeControl = document.getElementById(resizeControlName);

	    //some calculation
	    if (options.width == "100%") {
	        consoleElement.style.left = 0;
	    }

	    if (!_fn_jQueryIsAvailable()) {
	        contentElement.innerHTML = "<div>You need jQuery library.</div>";
			return;
	    }

        //no item html
	    noItemHtml = "<div id='{0}' style='padding: 5px;'>No items to show in console.</div>";
	    noItemHtml = _fn_format(noItemHtml, noItemsIdName);
		
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
	                footerButtonTextColor: "#FFF",
	                footerButtonBackgroundColor: "#666",
	                footerDotResizeBackgroundColor: "#BFBFBF"
	            };
	            break;
	        }
	        case "clasic": {
	            themeData = {
	                consoleBackgroundColor: "transparent",
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
                    footerButtonTextColor: "#FFF",
                    footerButtonBackgroundColor: "#666",
                    footerDotResizeBackgroundColor: "#BFBFBF"
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
	                footerButtonTextColor: "#FFF",
	                footerButtonBackgroundColor: "#666",
	                footerDotResizeBackgroundColor: "#666"
	            };
	            break;
	        }
	        default: {
	            themeData = {
	                consoleBackgroundColor: "transparent",
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
	                footerButtonTextColor: "#FFF",
	                footerButtonBackgroundColor: "#666",
	                footerDotResizeBackgroundColor: "#BFBFBF"
	            }
	            break;
	        }
	    }
	}
	function initializeEvents() {
	    if (!options.hideHeader) {
	        //clear console btn event
	        clearConsoleButton.addEventListener("click", clearConsole);

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

	        //reszie
	        resizeControl.addEventListener("mousedown", initResize);

	        //resize for touch devices
	        if (_fn_isTouchDevice() && _fn_jQueryIsAvailable()) {
	            $.fn.resizeTouch = function () {
	                var offset = null;

	                var startReszie = function (e) {
	                    if (isMinmimized) return;

	                    var event = e.originalEvent;
	                    var pos = $(this).position();
	                    offset = {
	                        x: event.changedTouches[0].pageX - pos.left,
	                        y: event.changedTouches[0].pageY - pos.top
	                    };
	                }
	                var resize = function (e) {
	                    e.preventDefault();
	                    var orig = e.originalEvent;

	                    if ($(consoleElement).width() <= 160) {
	                        $(consoleElement).width(165);
	                    } else {
	                        $(consoleElement).css({ width: orig.changedTouches[0].pageX - offset.x });
	                    }
	                }

	                this.bind("touchstart", startReszie);
	                this.bind("touchmove", resize);
	            }

	            $("[id^=resize-]", consoleElement).resizeTouch();
	        }
	    }

	    document.addEventListener("keydown", keyboardShortcuts);

	    //draggable
	    if (options.draggable && !options.hideHeader) {
	        headerElement.onmousedown = function () {
	            if (!isMinmimized) draggInit(consoleElement);
	            return false;
	        };

	        document.addEventListener("mousemove", draggMoveElement);
	        document.addEventListener("mouseup", draggDestroy);

	        //draggable for touch devices
	        if (_fn_isTouchDevice() && _fn_jQueryIsAvailable()) {
	            $.fn.dragTouch = function () {
	                var offset = null;

	                var startDragg = function (e) {
	                    if (isMinmimized) return;

	                    var event = e.originalEvent;
	                    var pos = $(this).parent().position();

	                    offset = {
	                        x: event.changedTouches[0].pageX - pos.left,
	                        y: event.changedTouches[0].pageY - pos.top
	                    };
	                };
	                var draggMe = function (e) {
	                    e.preventDefault();
	                    var event = e.originalEvent;

	                    $(this).parent().css({
	                        top: ((event.changedTouches[0].pageY - offset.y) <= 0 ? 0 : event.changedTouches[0].pageY - offset.y),
	                        left: event.changedTouches[0].pageX - offset.x
	                    });

	                    drg_wasDragged = true;
	                };

	                this.bind("touchstart", startDragg);
	                this.bind("touchmove", draggMe);
	            };

	            $(headerElement).dragTouch();
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

	    // Create options by extending defaults with the passed in arguments
	    if (args[0] && typeof args[0] === "object") {
	        options = extendDefaults(defaults, args[0]);
	    } else {
	        options = defaults;
	    }
	    
	    if (_fn_isNumeric(options.width)) options.width = options.width + "px";
	    if (_fn_isNumeric(options.minWidth)) options.minWidth = options.minWidth + "px";
	    if (_fn_isNumeric(options.maxHeight)) options.maxHeight = options.maxHeight + "px";
	    if (_fn_isNumeric(options.fontSize)) options.fontSize = options.fontSize + "px";
	}
	function log(obj, interval, bgColor, textColor) {
	    if (obj != null) {
	        if ((typeof obj === "string" || obj instanceof String) && obj == "") {
	            obj = "<empty string>";
	        }
	        
	        if (consoleElement == null) {
	            fConsole.prototype.init();
	        }

	        if (_fn_jQueryIsAvailable()) {
	            getTheme();

	            if (bgColor == null) bgColor = themeData.itemBackgroundColor;
	            if (textColor == null) textColor = themeData.itemTextColor;

	            var msgEncoded = $("<div/>").text(obj).html(),
                    uniqueMsgId = "msg-" + Date.now(),
                    msgHtml = "<div id='{0}' style='background-color: {1}; color: {2}; padding: 5px; border-bottom: 1px dotted {3}; word-wrap: break-word;' {4} {5}>{CONTENT}</div>";

	            msgHtml = _fn_format(msgHtml, uniqueMsgId, bgColor, textColor, themeData.itemBorderColor, (bgColor == themeData.itemBackgroundColor ? "" : "specialBgColor"), (textColor == themeData.itemTextColor ? "" : "specialTextColor"));

	            if ($(noItemElement).length) $(noItemElement).remove();

	            $(contentElement).append(msgHtml.replace("{CONTENT}", msgEncoded));

	            if (typeof obj === "function" && interval != null && _fn_isNumeric(interval)) {
	                var timer = setInterval(function () {
	                    $("#" + uniqueMsgId, consoleElement).html(obj);
	                }, interval);
	            }

	            //scroll into view
	            $(contentElement).scrollTop($(contentElement)[0].scrollHeight);
	        }
	    }
	}

    //event listens methods
	function clearConsole() {
	    if (consoleElement != null) {
	        while (contentElement.firstChild) {
	            contentElement.removeChild(contentElement.firstChild);
	        }

	        //no item html
	        var noItemsIdName = "noItems-" + uniqueId;
	        noItemHtml = "<div id='{0}' style='padding: 5px;'>No items to show in console.</div>";
	        noItemHtml = _fn_format(noItemHtml, noItemsIdName);

	        contentElement.innerHTML = noItemHtml;
	        contentElement.style.height = "auto";
	        calculateHeight.call(this);

	        runJSCodeInput.value = "";
	    }
	}
	function minimizeWindow() {
	    if (consoleElement == null) return;

	    if (!isMinmimized) {
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

	        clearConsoleButton.style.display = "none";
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

	        isMinmimized = true;
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

	        clearConsoleButton.style.display = "inline";
	        headerTextElement.style.display = "block";
	        contentElement.style.display = "block";
	        footerElement.style.display = "block";

	        isMinmimized = false;
	    }
	}
	function closeWindow() {
	    if (consoleElement == null) return;

	    consoleElement.parentNode.removeChild(consoleElement);

	    clearConsoleButton.removeEventListener("click", clearConsole);
	    minimzeButton.removeEventListener("click", minimizeWindow);
	    closeButton.removeEventListener("click", closeWindow);
	    document.removeEventListener("mousemove", draggMoveElement);
	    document.removeEventListener("mouseup", draggDestroy);
	    runJSCodeInput.removeEventListener("keydown", runJSCodeOnPressEnter);
	    runJSCodeButton.removeEventListener("click", runJSCodeOnBtnClick);
	    resizeControl.removeEventListener("mousedown", initResize);
	    //document.removeEventListener("keydown", keyboardShortcuts);

	    options = null;
	    uniqueId = null;

	    consoleElement = null;
	    headerElement = null;
	    headerTextElement = null;
	    contentElement = null;
	    footerElement = null;
	    noItemElement = null;

	    clearConsoleButton = null;
	    minimzeButton = null;
	    closeButton = null;
	    runJSCodeInput = null;
	    runJSCodeButton = null;

	    execCodeArchive = new Array();
	    execCodeArchiveCurrentIndex = 0;

	    isMinmimized = null;
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
	function keyboardShortcuts(event) {
	    //esc
	    if (event.keyCode == 27) {
	        if (!isMinmimized)
	            minimizeWindow();
	        else
	            closeWindow();
	    }

	    //alt + c - OPEN
	    if (event.altKey && event.keyCode == 67) {
	        event.preventDefault();
	        
	        if (isMinmimized)
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

	        clearConsole();
	    }
	}
	function runJSCodeOnPressEnter(event) {
	    switch (event.keyCode) {
	        case 13: {//enter key
	            event.preventDefault();

	            runJSCodeOnBtnClick();

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
	        var inputText = runJSCodeInput.value,
                inputTextToLower = runJSCodeInput.value.toLowerCase(),
                result;

	        if (inputText.length > 0) {
	            if ($.inArray(inputTextToLower, ["/?", "/help", "/cls", "/clear", "/m", "/min", "/minimize", "/c", "/close"]) > -1) {
	                switch (inputTextToLower) {
	                    case "/?":
	                    case "/help": {
	                        _this.fConsole.log("-> help commands - /? or /help");
	                        _this.fConsole.log("/cls | /clear - clear the console");
	                        _this.fConsole.log("/m | /min | /minimize - minimize the console");
	                        _this.fConsole.log("/c | /close - close the console");

	                        break;
	                    }
	                    case "/cls":
	                    case "/clear": {
	                        _this.fConsole.clear();
	                        break;
	                    }
	                    case "/m":
	                    case "/min":
	                    case "/minimize": {
	                        _this.fConsole.minimize();
	                        break;
	                    }
	                    case "/c":
	                    case "/close": {
	                        _this.fConsole.close();
	                        break;
	                    }
	                }

	                runJSCodeInput.value = "";
	                return false;
	            } else {
	                try {
	                    result = (new Function("return " + inputText)());
	                    if (result == null)
	                        fConsole.log("null");
	                    else
	                        if (result == "undefined")
	                            fConsole.log("undefined");
	                        else
	                            fConsole.log(result);
	                } catch (e) {
	                    window.eval(inputText);
	                    fConsole.log("-> done");
	                }
	            }
	        }
	    }
	    catch (err) {
	        fConsole.log(err.stack.split("\n")[0], null, "#FF0000", "#FFF");
	    }

	    execCodeArchive.push(runJSCodeInput.value);
	    execCodeArchiveCurrentIndex = execCodeArchive.length;
	    runJSCodeInput.value = "";

	    return false;
	}
    //#region Resize events

	function initResize(e) {
	    resizeStartX = e.clientX;
	    //resizeStartY = e.clientY;
	    resizeStartWidth = parseInt(consoleElement.style.width, 10);
	    //resizeStartHeight = parseInt(consoleElement.style.height, 10);

	    document.addEventListener("mousemove", doResize);
	    document.addEventListener("mouseup", stopResize);
	}
	function doResize(e) {
	    if ((resizeStartWidth + e.clientX - resizeStartX) >= 145) {
	        consoleElement.style.width = (resizeStartWidth + e.clientX - resizeStartX) + "px";
	        //consoleElement.style.height = (resizeStartHeight + e.clientY - resizeStartY) + "px";
	    }
	}
	function stopResize(e) {
	    document.removeEventListener("mousemove", doResize);
	    document.removeEventListener("mouseup", stopResize);
	}

    //#endregion
    //#region Header draggable events
    
	function draggInit(elem) {// Will be called when user starts dragging an element
	    // Store the object of the element which needs to be moved
	    if (options.draggable && !options.hideHeader) {
	        drg_fConsole = elem;
	        drg_x_elem = drg_x_pos - drg_fConsole.offsetLeft;
	        drg_y_elem = drg_y_pos - drg_fConsole.offsetTop;
	    }
	}
	function draggMoveElement(e) {// Will be called when user dragging an element
	    drg_x_pos = document.all ? window.event.clientX : e.pageX;
	    drg_y_pos = document.all ? window.event.clientY : e.pageY;

	    if (drg_fConsole != null) {
	        drg_fConsole.style.left = (drg_x_pos - drg_x_elem) + "px";
	        drg_fConsole.style.top = ((drg_y_pos - drg_y_elem) <= 0 ? 0 : drg_y_pos - drg_y_elem) + "px";

	        drg_wasDragged = true;
	    }
	}
	function draggDestroy() {// Destroy the object when we are done
	    drg_fConsole = null;
	    drg_x_pos = 0;
	    drg_y_pos = 0;
	    drg_x_elem = 0;
	    drg_y_elem = 0;
	}

    //#endregion
    
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

	        if (isMinmimized)
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
	        runJSCodeInput.style.width = (footerElement.offsetWidth - runJSCodeButton.offsetWidth - resizeControl.offsetWidth) + "px";
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

    //#region HELPER METHODS

    //#region Boolean

	function _fn_isNumeric(value) { return !isNaN(parseFloat(value)) && isFinite(value); }
	function _fn_isInt(n) { return Number(n) === n && n % 1 === 0; }
	function _fn_isFloat(n) { return n === Number(n) && n % 1 !== 0; }
	function _fn_isBoolean(value) { return typeof (value) === "boolean"; }
	function _fn_isTouchDevice(value) {
	    var result = 'ontouchstart' in window     // works on most browsers 
                     || navigator.maxTouchPoints; // works on IE10/11 and Surface

	    return result == 1 ? true : false;
	}
	function _fn_isiOS() {
	    var iDevices = [
          'iPad Simulator',
          'iPhone Simulator',
          'iPod Simulator',
          'iPad',
          'iPhone',
          'iPod'
	    ];

	    while (iDevices.length) {
	        if (navigator.platform === iDevices.pop()) { return true; }
	    }

	    return false;
	}
	function _fn_isAndroid() { return navigator.userAgent.toLowerCase().indexOf("android") > -1; }
	function _fn_isWindowsPhone() { return navigator.userAgent.toLowerCase().indexOf("Windows Phone") > -1; }
	function _fn_isMobile() {
	    var check = false;
	    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
	    return check;
	}
	function _fn_jQueryIsAvailable() { if (typeof jQuery === 'undefined') return false; return true; }

    //#endregion
    //#region Colors

	function _fn_rgbToHex(rgb) {
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
	function _fn_hexToRgb(hex) {
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

    //#endregion
    //#region Size related

	function _fn_getWindowWidth() { return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth; }
	function _fn_getWindowHeight() { return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight; }
	function _fn_getDocumetHeight() {
	    var D = document;

	    return Math.max(
            D.body.scrollHeight, D.documentElement.scrollHeight,
            D.body.offsetHeight, D.documentElement.offsetHeight,
            D.body.clientHeight, D.documentElement.clientHeight
        );
	}

    //#endregion
    //#region Cookies

	function _fn_setCookie(cookieName, value, exdays) {
	    var exdate = new Date();
	    exdate.setDate(exdate.getDate() + exdays);
	    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
	    document.cookie = cookieName + "=" + c_value + "; path=/";
	}
	function _fn_setTempCookie(cookieName, value) {
	    var c_value = escape(value);
	    document.cookie = cookieName + "=" + c_value + "; path=/";
	}
	function _fn_getCookie(cookieName) {
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

    //#endregion
    //#region Validations

	function _fn_validateEmail(email) {
	    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	}
	function _fn_validateIPaddress(ipaddress) {
	    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))
	        return true;
	    return false;
	}

    //#endregion
    //#region Strings
	function _fn_format(string) {
	    var args = arguments, _args = [];
	    var strToReplace = args[0];
	    for (var i = 1; i < arguments.length; i++) {
	        _args[i - 1] = arguments[i];
	    }
	    return strToReplace.replace(/{(\d+)}/g, function (match, number) {
	        return typeof _args[number] != 'undefined'
              ? _args[number]
              : match
	        ;
	    });
	}
	function _fn_capitalize(string) {
	    return string.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
	}
	function _fn_capitalizeFirstLetter(string) {
	    return string.charAt(0).toUpperCase() + string.slice(1);
	}
	function _fn_startsWith(string, prefix, ignoreCases) {
	    if (ignoreCases) return string.toLowerCase().slice(0, prefix.length) == prefix.toLowerCase();

	    return string.slice(0, prefix.length) == prefix;
	}
	function _fn_endsWith(string, suffix, ignoreCases) {
	    if (ignoreCases) return suffix == '' || string.toLowerCase().slice(-suffix.length) == suffix.toLowerCase();

	    return suffix == '' || string.slice(-suffix.length) == suffix;
	}
	function _fn_replaceAll(string, find, replaceWith) {
	    return string.replace(new RegExp(find, 'g'), replaceWith);
	}
	function _fn_linkify(string) {
	    // http://, https://, ftp://
	    var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

	    // www. sans http:// or https://
	    var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

	    // Email addresses
	    var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

	    return string.replace(urlPattern, '<a href="$&">$&</a>')
                      .replace(pseudoUrlPattern, '$1<a href="http://$2">$2</a>')
                      .replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');
	}
	function _fn_contains(string, substring) {
	    return string.indexOf(substring) > -1
	}
	function _fn_encodeHTML(string) {
	    return String(string)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
	}
	function _fn_decodeHTML(string) {
	    return String(string)
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');
	}
	function _fn_encodeBase64(input) {
	    return _fn_Base64.encode(input);
	}
	function _fn_decodeBase64(input) {
	    return _fn_Base64.decode(input);
	}
	function _fn_encodeUTF8Base64(input) {
	    return _fn_Base64._utf8_encode(input);
	}
	function _fn_decodeUTF8Base64(input) {
	    return _fn_Base64._utf8_decode(input);
	}

    //#endregion
    //#region URL

	function _fn_getUrlParams(url) {
	    var vars = [], hash;
	    var hashes = url.slice(url.indexOf('?') + 1).split('&');
	    for (var i = 0; i < hashes.length; i++) {
	        hash = hashes[i].split('=');
	        vars.push(hash[0]);
	        vars[hash[0]] = hash[1];
	    }
	    return vars;
	}
	function _fn_encodeURL(uri) {
	    return encodeURIComponent(uri);
	}
	function _fn_decodeURL(uri) {
	    return decodeURIComponent(uri);
	}

    //#endregion
    //#region JSON & Arrays

	function _fn_sortJSONby(json, propertyName, order) {
	    if (order == null) order = "asc";
	    var result = json.sort(function (a, b) {
	        if (order.toLowerCase() == "asc") return (a[propertyName] > b[propertyName]) ? 1 : ((a[propertyName] < b[propertyName]) ? -1 : 0);
	        else return (b[propertyName] > a[propertyName]) ? 1 : ((b[propertyName] < a[propertyName]) ? -1 : 0);
	    });
	    return result;
	}
	function _fn_shuffleArray(array) {
	    var currentIndex = array.length, temporaryValue, randomIndex;

	    // While there remain elements to shuffle...
	    while (0 !== currentIndex) {

	        // Pick a remaining element...
	        randomIndex = Math.floor(Math.random() * currentIndex);
	        currentIndex -= 1;

	        // And swap it with the current element.
	        temporaryValue = array[currentIndex];
	        array[currentIndex] = array[randomIndex];
	        array[randomIndex] = temporaryValue;
	    }

	    return array;
	}
	function _fn_uniqueArray(array) {
	    var prims = { "boolean": {}, "number": {}, "string": {} }, objs = [];

	    return array.filter(function (item) {
	        var type = typeof item;
	        if (type in prims)
	            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
	        else
	            return objs.indexOf(item) >= 0 ? false : objs.push(item);
	    });
	}

    //#endregion
    //#region DateTime

	function _fn_getCurrentTime(format, is24hFormat) {
	    if (is24hFormat == null) is24hFormat = true;

	    var d = new Date(),
            h = is24hFormat ? ("0" + d.getHours()).slice(-2) : (d.getHours() % 12 || 12),
            m = ("0" + d.getMinutes()).slice(-2),
            s = ("0" + d.getSeconds()).slice(-2);

	    var amPM = h % 12 || 12 ? "PM" : "AM";

	    if (format != null)
	        return format
                   .toLowerCase()
                   .replace("hh", h).replace("h", h)
                   .replace("mm", m).replace("m", m)
                   .replace("ss", s).replace("s", s)
                   .replace("a", amPM);
	    return h + ":" + m + ":" + s;
	}
	function _fn_getCurrentDate(format) {
	    var d = new Date(),
            dd = ("0" + d.getDate()).slice(-2);
	    mm = ("0" + d.getMonth() + 1).slice(-2);
	    yyyy = d.getFullYear();

	    if (format != null)
	        return format
                   .toLowerCase()
                   .replace("dd", dd).replace("d", dd)
                   .replace("mm", mm).replace("m", mm)
                   .replace("yyyy", yyyy);
	    return dd + "/" + mm + "/" + yyyy;
	}
	function _fn_getUTCDateTime() {
	    var now = new Date();
	    var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getMilliseconds());
	    var utc_date = new Date(now_utc);

	    var year = utc_date.getFullYear();
	    var month = ((utc_date.getMonth() + 1) < 10 ? ("0" + (utc_date.getMonth() + 1)) : (utc_date.getMonth() + 1));
	    var day = ((utc_date.getDate() < 10) ? ("0" + utc_date.getDate()) : utc_date.getDate());
	    var hour = (utc_date.getHours() < 10 ? ("0" + utc_date.getHours()) : utc_date.getHours());
	    var min = (utc_date.getMinutes() < 10 ? ("0" + utc_date.getMinutes()) : utc_date.getMinutes());
	    var sec = (utc_date.getSeconds() < 10 ? ("0" + utc_date.getSeconds()) : utc_date.getSeconds());
	    var miliSec = utc_date.getMilliseconds();

	    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec + "." + miliSec;
	}
	function _fn_leapYear(year) {
	    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
	}
	function _fn_getTimeAgoFromJsDate(time) {
	    switch (typeof time) {
	        case 'number': break;
	        case 'string': time = +new Date(time); break;
	        case 'object': if (time.constructor === Date) time = time.getTime(); break;
	        default: time = +new Date();
	    }
	    var time_formats = [
            [60, 'seconds', 1], // 60
            [120, '1 minute ago', '1 minute from now'], // 60*2
            [3600, 'minutes', 60], // 60*60, 60
            [7200, '1 hour ago', '1 hour from now'], // 60*60*2
            [86400, 'hours', 3600], // 60*60*24, 60*60
            [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
            [604800, 'days', 86400], // 60*60*24*7, 60*60*24
            [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
            [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
            [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
            [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
            [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
            [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
            [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
            [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
	    ];
	    var seconds = (+new Date() - time) / 1000,
            token = 'ago', list_choice = 1;

	    if (seconds < 5) {
	        return 'just now'
	    }
	    if (seconds < 0) {
	        seconds = Math.abs(seconds);
	        token = 'from now';
	        list_choice = 2;
	    }
	    var i = 0, format;
	    while (format = time_formats[i++])
	        if (seconds < format[0]) {
	            if (typeof format[2] == 'string')
	                return format[list_choice];
	            else
	                return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
	        }
	    return time;
	}
	function _fn_getTimeAgoFromSqlDate(sqlDate) {
	    //sqlDate in SQL DATETIME format ("yyyy-mm-dd hh:mm:ss.ms")
	    var sqlDateArr1 = sqlDate.split("-");

	    //format of sqlDateArr1[] = ['yyyy','mm','dd hh:mm:ms']
	    var sYear = sqlDateArr1[0];
	    var sMonth = (Number(sqlDateArr1[1]) - 1).toString();
	    var sqlDateArr2 = sqlDateArr1[2].split(" ");

	    //format of sqlDateArr2[] = ['dd', 'hh:mm:ss.ms']
	    var sDay = sqlDateArr2[0];
	    var sqlDateArr3 = sqlDateArr2[1].split(":");

	    //format of sqlDateArr3[] = ['hh','mm','ss.ms']
	    var sHour = sqlDateArr3[0];
	    var sMinute = sqlDateArr3[1];
	    var sqlDateArr4 = sqlDateArr3[2].split(".");

	    //format of sqlDateArr4[] = ['ss','ms']
	    var sSecond = sqlDateArr4[0];
	    var sMillisecond = sqlDateArr4[1];

	    var time = new Date(sYear, sMonth, sDay, sHour, sMinute, sSecond, sMillisecond);

	    switch (typeof time) {
	        case 'number': break;
	        case 'string': time = +new Date(time); break;
	        case 'object': if (time.constructor === Date) time = time.getTime(); break;
	        default: time = +new Date();
	    }
	    var time_formats = [
            [60, 'seconds', 1], // 60
            [120, '1 minute ago', '1 minute from now'], // 60*2
            [3600, 'minutes', 60], // 60*60, 60
            [7200, '1 hour ago', '1 hour from now'], // 60*60*2
            [86400, 'hours', 3600], // 60*60*24, 60*60
            [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
            [604800, 'days', 86400], // 60*60*24*7, 60*60*24
            [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
            [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
            [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
            [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
            [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
            [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
            [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
            [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
	    ];
	    var seconds = (+new Date() - time) / 1000,
            token = 'ago', list_choice = 1;

	    if (seconds < 5) {
	        return 'just now'
	    }
	    if (seconds < 0) {
	        seconds = Math.abs(seconds);
	        token = 'from now';
	        list_choice = 2;
	    }
	    var i = 0, format;
	    while (format = time_formats[i++])
	        if (seconds < format[0]) {
	            if (typeof format[2] == 'string')
	                return format[list_choice];
	            else
	                return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
	        }
	    return time;
	};

    //#endregion
    //#region Random

	function _fn_generateRandomInt(min, max) {
	    if (min == null) min = 0;
	    if (max == null) max = 999999;
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	function _fn_generateRandomArbitrary(min, max, nrOfdecimallaces) {
	    if (min == null) min = 0;
	    if (max == null) max = 999999;
	    if (nrOfdecimallaces == null) nrOfdecimallaces = 2

	    return parseFloat((Math.random() * (max - min) + min).toFixed(nrOfdecimallaces));
	}
	function _fn_generateRandomString(len, charSet) {
	    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	    var randomString = '';
	    for (var i = 0; i < len; i++) {
	        var randomPoz = Math.floor(Math.random() * charSet.length);
	        randomString += charSet.substring(randomPoz, randomPoz + 1);
	    }
	    return randomString;
	}
	function _fn_generateGUID() {
	    var result;

	    if (window.crypto == null) {
	        result = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
	            var r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
	            return v.toString(16);
	        });
	    } else {
	        result = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
	            var arr = new Uint8Array(1);
	            var r = window.crypto.getRandomValues(arr);
	            var random = arr[0] % 16 | 0
	            var v = c == "x" ? random : (random & 0x3 | 0x8);
	            return v.toString(16);
	        });
	    }

	    return result;
	}

    //#endregion
    //#region Others

	function _fn_loadJSScriptDynamically(src, callback) {
	    var script = document.createElement("script");
	    jq.type = "text/javascript";
	    script.src = src;

	    script.onload = callback();
	    document.head.appendChild(script);
	}
	function _fn_loadCssFile(src) {
	    var head = document.getElementsByTagName('head')[0];
	    var link = document.createElement('link');
	    link.rel = 'stylesheet';
	    link.type = 'text/css';
	    link.href = src;
	    link.media = 'all';

	    head.appendChild(link);
	}
	function _fn_cloneObj(obj) {
	    var copy;

	    // Handle the 3 simple types, and null or undefined
	    if (null == obj || "object" != typeof obj) return obj;

	    // Handle Date
	    if (obj instanceof Date) {
	        copy = new Date();
	        copy.setTime(obj.getTime());
	        return copy;
	    }

	    // Handle Array
	    if (obj instanceof Array) {
	        copy = [];
	        for (var i = 0, len = obj.length; i < len; i++) {
	            copy[i] = clone(obj[i]);
	        }
	        return copy;
	    }

	    // Handle Object
	    if (obj instanceof Object) {
	        copy = {};
	        for (var attr in obj) {
	            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
	        }
	        return copy;
	    }

	    throw new Error("Unable to copy obj! Its type isn't supported.");
	}
	function _fn_getBrowser() {
	    return _fn_getBrowserInfo("browser");
	}
	function _fn_getBrowserVersion() {
	    return _fn_getBrowserInfo("version");
	}
	function _fn_getIEVersion() {
	    var ua = window.navigator.userAgent;

	    var msie = ua.indexOf('MSIE ');
	    if (msie > 0) {
	        // IE 10 or older => return version number
	        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
	    }

	    var mobileIE = ua.indexOf('IEMobile/');
	    if (mobileIE > 0) {
	        // IE 12 => return version number
	        return 'mobileIE';
	    }

	    var trident = ua.indexOf('Trident/');
	    if (trident > 0) {
	        // IE 11 => return version number
	        var rv = ua.indexOf('rv:');
	        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
	    }

	    var edge = ua.indexOf('Edge/');
	    if (edge > 0) {
	        // IE 12 => return version number
	        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
	    }

	    // other browser
	    return false;
	}
	function _fn_getOS() {
	    var nVer = navigator.appVersion;
	    var nAgt = navigator.userAgent;
	    var unknown = "n/a";
	    var os = unknown;
	    var clientStrings = [
            { s: 'Windows 10', r: /(Windows 10.0|Windows NT 10.0)/ },
            { s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/ },
            { s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/ },
            { s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/ },
            { s: 'Windows Vista', r: /Windows NT 6.0/ },
            { s: 'Windows Server 2003', r: /Windows NT 5.2/ },
            { s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/ },
            { s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/ },
            { s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/ },
            { s: 'Windows 98', r: /(Windows 98|Win98)/ },
            { s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/ },
            { s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/ },
            { s: 'Windows CE', r: /Windows CE/ },
            { s: 'Windows 3.11', r: /Win16/ },
            { s: 'Windows Phone', r: /Windows Phone/ },
            { s: 'BlackBerry', r: /BlackBerry/ },
            { s: 'Android', r: /Android/ },
            { s: 'Open BSD', r: /OpenBSD/ },
            { s: 'Sun OS', r: /SunOS/ },
            { s: 'Linux', r: /(Linux|X11)/ },
            { s: 'iOS', r: /(iPhone|iPad|iPod)/ },
            { s: 'Mac OS X', r: /Mac OS X/ },
            { s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
            { s: 'QNX', r: /QNX/ },
            { s: 'UNIX', r: /UNIX/ },
            { s: 'BeOS', r: /BeOS/ },
            { s: 'OS/2', r: /OS\/2/ },
            { s: 'Search Bot', r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/ }
	    ];

	    for (var id in clientStrings) {
	        var cs = clientStrings[id];
	        if (cs.r.test(nAgt)) {
	            os = cs.s;
	            break;
	        }
	    }

	    var osVersion = unknown;

	    if (/Windows Phone/.test(os)) {
	        osVersion = /Windows Phone ([\.\_\d]+)/.exec(nAgt)[1];
	    } else if (/Windows/.test(os)) {
	        osVersion = /Windows (.*)/.exec(os)[1];
	        os = 'Windows';
	    }

	    switch (os) {
	        case 'Mac OS X':
	            osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
	            break;

	        case 'BlackBerry':
	            osVersion = /BlackBerry ([\.\_\d]+)/.exec(nAgt)[1];
	            break;

	        case 'Android':
	            osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
	            break;

	        case 'iOS':
	            osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
	            osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
	            break;
	    }

	    return os + " " + osVersion;
	}
	function _fn_getDoctype() {
	    if (document.doctype !== null) {
	        var node = document.doctype;
	        return "<!DOCTYPE "
                    + node.name
                    + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '')
                    + (!node.publicId && node.systemId ? ' SYSTEM' : '')
                    + (node.systemId ? ' "' + node.systemId + '"' : '')
                    + ">";
	    }
	}

    //#endregion

	function _fn_getBrowserInfo(value) {
	    var ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	    if (/trident/i.test(M[1])) {
	        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
	        return 'IE ' + (tem[1] || '');
	    }
	    if (M[1] === 'Chrome') {
	        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
	        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
	    }
	    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
	    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
	    switch (value) {
	        case "browser": return M[0];
	        case "version": return M[1];
	        default: return "";
	    }
	}

	var _fn_Base64 = {
	    // private property
	    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	    // public method for encoding
	    encode: function (input) {
	        var output = "";
	        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	        var i = 0;

	        input = _fn_Base64._utf8_encode(input);

	        while (i < input.length) {

	            chr1 = input.charCodeAt(i++);
	            chr2 = input.charCodeAt(i++);
	            chr3 = input.charCodeAt(i++);

	            enc1 = chr1 >> 2;
	            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
	            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
	            enc4 = chr3 & 63;

	            if (isNaN(chr2)) {
	                enc3 = enc4 = 64;
	            } else if (isNaN(chr3)) {
	                enc4 = 64;
	            }

	            output = output +
                _fn_Base64._keyStr.charAt(enc1) + _fn_Base64._keyStr.charAt(enc2) +
                _fn_Base64._keyStr.charAt(enc3) + _fn_Base64._keyStr.charAt(enc4);

	        }

	        return output;
	    },

	    // public method for decoding
	    decode: function (input) {
	        var output = "";
	        var chr1, chr2, chr3;
	        var enc1, enc2, enc3, enc4;
	        var i = 0;

	        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

	        while (i < input.length) {

	            enc1 = _fn_Base64._keyStr.indexOf(input.charAt(i++));
	            enc2 = _fn_Base64._keyStr.indexOf(input.charAt(i++));
	            enc3 = _fn_Base64._keyStr.indexOf(input.charAt(i++));
	            enc4 = _fn_Base64._keyStr.indexOf(input.charAt(i++));

	            chr1 = (enc1 << 2) | (enc2 >> 4);
	            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
	            chr3 = ((enc3 & 3) << 6) | enc4;

	            output = output + String.fromCharCode(chr1);

	            if (enc3 != 64) {
	                output = output + String.fromCharCode(chr2);
	            }
	            if (enc4 != 64) {
	                output = output + String.fromCharCode(chr3);
	            }

	        }

	        output = _fn_Base64._utf8_decode(output);

	        return output;

	    },

	    // private method for UTF-8 encoding
	    _utf8_encode: function (input) {
	        input = input.replace(/\r\n/g, "\n");
	        var utftext = "";

	        for (var n = 0; n < input.length; n++) {

	            var c = input.charCodeAt(n);

	            if (c < 128) {
	                utftext += String.fromCharCode(c);
	            }
	            else if ((c > 127) && (c < 2048)) {
	                utftext += String.fromCharCode((c >> 6) | 192);
	                utftext += String.fromCharCode((c & 63) | 128);
	            }
	            else {
	                utftext += String.fromCharCode((c >> 12) | 224);
	                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
	                utftext += String.fromCharCode((c & 63) | 128);
	            }

	        }

	        return utftext;
	    },

	    // private method for UTF-8 decoding
	    _utf8_decode: function (input) {
	        var string = "";
	        var i = 0;
	        var c = c1 = c2 = 0;

	        while (i < input.length) {

	            c = input.charCodeAt(i);

	            if (c < 128) {
	                string += String.fromCharCode(c);
	                i++;
	            }
	            else if ((c > 191) && (c < 224)) {
	                c2 = input.charCodeAt(i + 1);
	                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
	                i += 2;
	            }
	            else {
	                c2 = input.charCodeAt(i + 1);
	                c3 = input.charCodeAt(i + 2);
	                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
	                i += 3;
	            }

	        }
	        return string;
	    }
	}

    //#endregion
})();