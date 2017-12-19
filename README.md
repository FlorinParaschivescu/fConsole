# fConsole.js
fConsole.js v1.1 - For touch devices and desktop browsers

A simple plugin that you can use to display the values from JavaScript, HTML, CSS. Very useful for touch devices and desktop browsers.

<ul>
	<li>useful for environments who lack of a console eg. (mobile, tables - browsers) as well for desktop browsers</li>
	<li>you can dragg the console around the browser (works on touch devices too)</li>
	<li>you can resize the console (works on touch devices too)</li>
	<li>you can run JavaScript code from fConsole and see the results by pressing Enter Key or Exec button</li>
	<li>will log all JavaScript errors</li>
	<li>on desktop browsers use "UP" or "DOWN" keys to access typing history</li>
	<li>you can clear/minimize the console</li>
	<li>
		available keyboard shortcuts:
		<ul>
			<li>alt + c - Open fConsole</li>
			<li>alt + x - Close fConsole</li>
			<li>alt + z - Minimize fConsole</li>
			<li>alt + d - Clear fConsole</li>
		</ul>
	</li>
	<li>
		available inline commands:
		<ul>
			<li>type /? or /help - will show all avaiable commands</li>
			<li>type /cls or /clear - Clear fConsole</li>
			<li>type /m or /min or /minimize - Minimize fConsole</li>
			<li>type /c or /close - Close fConsole</li>
		</ul>
	</li>
	<li>
		general Help Functions
		<ul>
			<li>you can access them like fConsole.fn.<function-name></li>
		</ul>
	</li>
</ul>

# How to use this plugin

<ul>
	<li>
		Direct usage - will use default options
<pre>
$(document).ready(function () {
    fConsole.log("Hello!"); //simple message
    fConsole.log("Hello!", null, "#00FF00"); //message with custom BgColor
    fConsole.log("Hello!", null, "#00FF00", "#000"); //message with custom BgColor and TextColor
    fConsole.log(function() { return Date.now(); }, 1000); //message in realtime - get time stamp at one second interval
});
</pre>
	</li>
	<li>
		New object - using default options
<pre>
$(document).ready(function () {
    //init console
    myConsole = new fConsole({
        hideHeader: false, //if is true - will disable draggable option
        hideFooter: false, //if is true - will no longer be able to run Javascript code
        className: null, //if is set - you can control the console from CSS - all inline style will be removed
        width: "250px",
        minWidth: 0,
        maxHeight: "250px",
        position: "bottomLeft", //topLeft | topRight | bottomLeft | bottomRight
        draggable: true,
        opacity: 1,
        fontSize: "12px",
        fontFamily: "monospace",
        theme: "default", //default | clasic | light
        logJSErrors: true, //will log JS errors
        zIndex: 2147483647
    });
    //myConsole.log method parameters
        //  first param - a string
        //  second param - interval - set in miliseconds
        //  third param - row background color
        //  four param - row text color
        
    myConsole.log("Hello!"); //simple message
    myConsole.log("Hello!", null, "#00FF00"); //message with custom BgColor
    myConsole.log("Hello!", null, "#00FF00", "#000"); //message with custom BgColor and TextColor
    myConsole.log(function() { return Date.now(); }, 1000); //message in realtime - get time stamp at one second interval
});
</pre>
	</li>
	<li>
		Change fConsole Settings like this
<pre>
$(document).ready(function () {
    myConsole = new fConsole();
    myConsole.reloadSettings({ theme: "default" });
    myConsole.reloadSettings({ width: "100%", minWidht: 0 });
});
</pre>
	</li>
	<li>
		Help Functions
<pre>
$(document).ready(function () {
    fConsole.fn.isNumeric("123"); //will return true
    fConsole.fn.isNumeric("123$%"); //will return false
    fConsole.fn.isInt(123); //will return true
    fConsole.fn.isTouchDevice();
    
    //etc...
});
</pre>
	</li>
</ul>

# Change log

<ul>
	<li>v1.1.1 - 19 December, 2017</li>
    <ul>
        <li>[FEATURE] – add new method fConsole.fn.copyToClipboard()</li>
        <li>[FEATURE] – add new method fConsole.fn.getGetOrdinal()</li>
        <li>[FEATURE] – add new method fConsole.fn.isiOS()</li>
        <li>[FEATURE] – add new method fConsole.fn.isAndroid()</li>
        <li>[BUG FIXED] – fixed fConsole.fn.getCurrentDate() - thanks to <strong>Huambo</strong></li>
        <li>[BUG FIXED] – fixed minimize action</li>
        <li>[BUG FIXED] – fixed fConsole.fn.generateGUID()</li>
        <li>[BUG FIXED] – general code improvement</li>
    </ul>
	<li>v1.1 - 24 July, 2016</li>
	<ul>
		<li>[FEATURE] – add clear button into header</li>
		<li>[FEATURE] – add resize functionality to make the resize more easy</li>
		<li>[FEATURE] – add inline commands. Type in fConsole "/?" or "/help" to see them</li>
		<li>[FEATURE] – minimize console by pressing "ESC" key, press again to close it</li>
		<li>[FEATURE] – add lots of methods that may help you. Click here to see them</li>
		<li>[BUG FIXED]  – fixed the eval js method</li>
		<li>[BUG FIXED]  – general code improvement</li>
	</ul>
	<li>v1.0 - 11 January, 2016</li>
	<ul>
		<li>initial release</li>
	</ul>
</ul>