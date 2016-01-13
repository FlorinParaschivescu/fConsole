# fConsole
fConsole.js v1.0 - For touch devices and desktop browsers

<ul class="list clearfix">
  <li>you will need jQuery</li>
	<li>very useful for environments who lack of a console</li>
	<li>you can <b>dragg</b> the console around the browser (works fine on touch devices too)</li>
	<li>you can run <b>Javascript code</b> in fConsole footer area and see the results by pressing enter key or 'Exec' button.</li>
	<li>you can <b>minimize</b> the console</li>
	<li>will <b>log Javascript errors</b></li>
	<li>on desktop browsers use <b>UP</b> or <b>DOWN</b> keys to access typing history</li>
	<li>
		available keyboard shortcuts:
		<ul>
			<li><b>Alt + C</b> - Open fConsole</li>
			<li><b>Alt + X</b> - Close fConsole</li>
			<li><b>Alt + Z</b> - Minimize fConsole</li>
			<li><b>Alt + D</b> - Clear fConsole</li>
		</ul>
	</li>
  <li>
      <h2>How to use this plugin</h2>
      <ul>
          <li>
<pre>
var myConsole;

(function () {
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
})();

$(document).ready(function () {
    //myConsole.log method parameters
    //  first - a string
    //  second - interval - set in miliseconds
    //  third - row background color
    //  four - row text color
    
    //simple message
    myConsole.log("Hello!");
    
    //mssage with custom BgColor
    myConsole.log("Hello!", null, "#00FF00");
    
    //mssage withc custom BgColor and TextColor
    myConsole.log("Hello!", null, "#00FF00", "#000");
    
    //message in realtime - get time stamp at one second interval
    myConsole.log(function() { return Date.now(); }, 1000);
});
</pre>
          </li>
      </ul>
  </li>
  <li>
      you can use the <b>fConsole directly</b> too - will use default options
      <ul>
          <li>
<pre>
$(document).ready(function () {
    //simple message
    fConsole.log("Hello!");
    
    //mssage with custom BgColor
    fConsole.log("Hello!", null, "#00FF00");
    
    //mssage withc custom BgColor and TextColor
    fConsole.log("Hello!", null, "#00FF00", "#000");
    
    //message in realtime - get time stamp at one second interval
    fConsole.log(function() { return Date.now(); }, 1000);
});
</pre>
                                </li>
                            </ul>
                        </li>
                        <li>
                            you can change <b>fConsole settings</b> like this
                            <ul>
                                <li>
<pre>
var myConsole;
(function () {
    //init console
    myConsole = new fConsole();
})();
$(document).ready(function () {
    myConsole.reloadSettings({ theme: "default" });
    
    myConsole.reloadSettings({ width: "100%", minWidht: 0 });
});
</pre>
            </li>
        </ul>
    </li>
</ul>
