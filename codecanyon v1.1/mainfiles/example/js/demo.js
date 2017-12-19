$(document).ready(function () {
    //init console
    myConsole = new fConsole({
        hideHeader: false,
        hideFooter: false,
        className: null,
        width: "370px",
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

    //intro
    myConsole.log("Hey! Thanks for checking this plugin.");
    myConsole.log("- type bellow some javascript code like 1 + 1", null, "#F9DB4B", "#444");

    //#region Example 1

    $(".example1 #a1").on("click", function () { myConsole.log(window.location.href); });
    $(".example1 #a2").on("click", function () { myConsole.log($("body").css("background-color")); });
    $(".example1 #a3").on("click", function () { myConsole.log(new Date().toJSON().slice(0, 10)); });

    //#endregion

    //#region Example 2

    $(".example2 #a1").on("click", function () { myConsole.log("hey - I'm blue", null, "#0000FF"); });
    $(".example2 #a2").on("click", function () { myConsole.log("hey - I'm yellow and black :)", null, "#FFFF00", "#000"); });
    $(".example2 #a3").on("click", function () { myConsole.log("hey - I'm red", null, "#FF0000", "#FFF"); });

    //#endregion

    //#region Exmaple 3

    $(".example3 #a1").on("click", function () {
        myConsole.log(function () {
            var d = new Date(),
                h = (d.getHours() < 10 ? '0' : '') + d.getHours(),
                m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes(),
                s = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();

            return "Current time is: " + h + ':' + m + ':' + s;
        }, 1000, "#BD0000", "#FFF");
    });
    $(".example3 #a2").on("click", function () {
        var x = 0, y = 0;

        document.addEventListener("mousemove", function (e) {
            x = (e.clientX || e.pageX) + (window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft);
            y = (e.clientY || e.pageY) + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop);            
        });

        myConsole.log(function () {
            return "Mouse position X:" + x + ' | Y:' + y;
        }, 10, "#1690DB", "#FFF");
    });
    $(".example3 #a3, #animation-element-1").on("click", function () {
        myConsole.log(function () {
            return "Current top position is: " + $("#animation-element-1").position().top;
        }, 80, "#FFFF00", "#000");
    });
    $(".example3 #a4, #animation-element-2").on("click", function () {
        myConsole.log(function () {
            return "Current left position is: " + $("#animation-element-2").position().left;
        }, 80, "#FF0000", "#FFF");
    });
    $(".example3 #a5, #animation-element-3").on("click", function () {
        myConsole.log(function () {
            return "Current BgColor is: " + $("#animation-element-3").css("background-color");
        }, 80, "#000", "#FFF");
    });

    //animation 1
    (function () {
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
            if (myConsole.fn.getWindowWidth() < 768) {
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

    //#endregion

    //#region Example 4

    $(".example4 #a1").on("click", function () { myConsole.log(test); });
    $(".example4 #a2").on("click", function () { var result = 1 / 0; myConsole.log(result); });
    $(".example4 #a3").on("click", function () { someFunction(); });

    //#endregion

    //#region Options

    $(".example5 #a1").on("click", function () { myConsole.reloadSettings({ theme: "default" }); });
    $(".example5 #a2").on("click", function () { myConsole.reloadSettings({ theme: "clasic" }); });
    $(".example5 #a3").on("click", function () { myConsole.reloadSettings({ theme: "light" }); });

    var opacity = 1;
    $(".example5 #a4").on("click", function () {
        if (opacity > 0.9) return false;
        opacity += 0.1;

        myConsole.reloadSettings({ opacity: opacity });
    });
    $(".example5 #a5").on("click", function () {
        if (opacity < 0.3) return false;
        opacity -= 0.1;

        myConsole.reloadSettings({ opacity: opacity });
    });

    $(".example5 #a6").on("click", function () { myConsole.reloadSettings({ width: "100%", minWidht: 0 }); });
    $(".example5 #a7").on("click", function () { myConsole.reloadSettings({ width: "550px", minWidht: 0 }); });

    //#endregion

    //#region Help Functions

    $(".content .example.example6 ul li h3").on("click", function () {
        var parent = $(this).parent();
        if ($(parent).hasClass("open")) {
            $(parent).removeClass("open");
        } else {
            $(parent).addClass("open");
        }
    });

    //#endregion

    //#region Others

    //hide dragg me img after dragging the fConsole
    $("[id^=fConsole-]").find("[id^=head-]").on("click", function () {
        $(".content #drag-me").fadeOut();
    });

    //#endregion
});