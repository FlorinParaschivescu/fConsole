var myConsole;
(function () {
    //init console
    myConsole = new fConsole({
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
    });
})();

$(document).ready(function () {
    myConsole.log("Hi there!");
    
    $("#action1").on("click", function () { myConsole.log(window.location.href); });
    $("#action2").on("click", function () { myConsole.log($("body").css("background-color")); });
    $("#action3").on("click", function () { myConsole.log(new Date().toJSON().slice(0, 10)); });
    $("#action4").on("click", function () { myConsole.log("hey - I'm red", null, "#FF0000");  });
    $("#action5").on("click", function () { myConsole.log("hey - I'm blue", null, "#0000FF"); });
    $("#action6").on("click", function () { myConsole.log("hey - I'm yellow and black :)", null, "#FFFF00", "#000"); });
    $("#action7").on("click", function () {
        myConsole.log(function () {
            var d = new Date(),
                h = (d.getHours() < 10 ? '0' : '') + d.getHours(),
                m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes(),
                s = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();

            return "Current time is: " + h + ':' + m + ':' + s;
        }, 1000, "#BD0000", "#FFF");
    });
    $("#action8").on("click", function () {
        myConsole.log(function () {
            return "Current top position is: " + $("#animation-element-1").position().top;
        }, 80, "#FFFF00", "#000");
    });
    $("#action9").on("click", function () {
        myConsole.log(function () {
            return "Current left position is: " + $("#animation-element-2").position().left;
        }, 80, "#FF0000", "#FFF");
    });
    $("#action10").on("click", function () {
        myConsole.log(function () {
            return "Current BgColor is: " + $("#animation-element-3").css("background-color");
        }, 80, "#000", "#FFF");
    });
    $("#action11").on("click", function () { myConsole.reloadSettings({ theme: "default" }); });
    $("#action12").on("click", function () { myConsole.reloadSettings({ theme: "clasic" }); });
    $("#action13").on("click", function () { myConsole.reloadSettings({ theme: "light" }); });

    var opacity = 1;
    $("#action14").on("click", function () {
        if (opacity > 0.9) return false;
        opacity += 0.1;

        myConsole.reloadSettings({ opacity: opacity });
    });
    $("#action15").on("click", function () {
        if (opacity < 0.3) return false;
        opacity -= 0.1;

        myConsole.reloadSettings({ opacity: opacity });
    });
    $("#action16").on("click", function () { myConsole.reloadSettings({ width: "100%", minWidht: 0 }); });
    $("#action17").on("click", function () { myConsole.reloadSettings({ width: "300px", minWidht: 0 }); });

    //animation 1
    (function() {
        var currentTop = $("#animation-element-1").position().top;
        var semafor = true;
        setInterval(function () {
            $("#animation-element-1").css({ top: currentTop });
            if (currentTop < 0) { semafor = true; }
            if (currentTop > 100) { semafor = false; }

            if (semafor)
                currentTop += 5;
            else
                currentTop -= 5;
        }, 80);
    })();

    //animation 2
    (function () {
        var currentLeft = $("#animation-element-2").position().left;
        var semafor = true;
        setInterval(function () {
            $("#animation-element-2").css({ left: currentLeft });
            if (currentLeft < 130) { semafor = true; }
            if (getWindowWidth() < 768) {
                if (currentLeft > 230) { semafor = false; }
            } else {
                if (currentLeft > 300) { semafor = false; }
            }

            if (semafor)
                currentLeft += 5;
            else
                currentLeft -= 5;
        }, 80);
    })();

    //animation 3
    (function () {
        setInterval(function () {
            var randomColor = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
            $("#animation-element-3").css("backgroundColor", randomColor);
        }, 500);
    })();
});

function getWindowWidth() { return window.innerWidth ? window.innerWidth : $(window).width(); }
function getWindowHeight() { return window.innerHeight ? window.innerHeight : $(window).height(); }