(function slocher(){
    var doColourStuff = function(){
        $.json("https://raw.githubusercontent.com/ozh/github-colors/master/colors.json", function(colours){
            var stylesheet = $.create("style", "slocher-stylesheet", null, null, null, null, $.find("head"));
            for(var key in colours){
                stylesheet.innerHTML += "body #slocher li:hover .slocher-" + key.replace(/[^a-z0-9]/ig, "") +
                "{background:" + colours[key].color + " !important;border-left-width:0px !important;}";
            }
        });
    }, getBytes = function(user, project, cb){
        if(languages != null) cb(languages);
        else{
            $.json("https://api.github.com/repos/" + user + "/" + project + "/languages", function(langs){
                languages = langs;
                cb(langs);
            });
        }
    }, addToNav = function(){
        if(tab == null){
            tab = $.create("a", "slocher-link", "js-selected-navigation-item tabnav-tab", "tab", "#slocher", "Lines of Code", $.find(".tabnav-tabs"));
            tab.onclick = function(){
                var selected = $.find(".tabnav .selected");
                selected.className = selected.className.replace(" selected", "");
                selected.removeAttribute("aria-selected");
                tab.className += " selected";
                addTabData();
            }
        }

        if(window.location.hash == "#slocher") tab.click();
    }, addTabData = function(){
        var tabs = $.find(".tabnav")
            path = window.location.pathname.split("/").splice(1);

        $.find("#js-repo-pjax-container").innerHTML = "";
        $.find("#js-repo-pjax-container").appendChild(tabs);

        getBytes(path[0], path[1], function(languages){
            if(!$.find("#slocher")){
                var holder = $.create("div", "slocher", "graph-filter clearfix", null, null, null, $.find("#js-repo-pjax-container")),
                    h3 = $.create("h3", "slocher-loc", "js-date-range", null, null, "Lines of Code", holder),
                    ul = $.create("ul", "slocher-languages", null, null, null, null, holder),
                    lines = 0,
                    bytesPerLine = 40,
                    widest = 0,
                    lis = [];

                for(var key in languages){ lines += languages[key]; }

                for(var key in languages){
                    var li = $.create("li", null, null, null, null, null, ul),
                        language = $.create("b", null, null, null, null, key + ": ", li),
                        slocs = $.create("span",
                            null, null, null, null,
                            numeral((languages[key] / bytesPerLine).toFixed(0)).format("0,0") +
                            " (" + ((languages[key] / bytesPerLine) / (lines / bytesPerLine) * 100).toFixed(1) + "%)",
                        li);

                    if(widest < language.offsetWidth + slocs.offsetWidth) widest = language.offsetWidth + slocs.offsetWidth;

                    lis.push(li);
                }

                var i = 0;
                for(key in languages){
                    var vParent = $.create("span", null, "slocher-visual-parent", null, null, null, lis[i]),
                        visual = $.create("span", null, "slocher-visual slocher-" + key.replace(/[^a-z0-9]/ig, ""), null, null, null, vParent);

                    vParent.style.width = (lis[i++].offsetWidth - widest) + "px";
                    visual.style.width = ((languages[key] / bytesPerLine) / (lines / bytesPerLine) * 100) + "%";
                }

                var total = $.create("h4", "slocher-total", null, null, null, "Total lines of code: ~", holder);
                var number = $.create("b", null, null, null, null, numeral((lines / bytesPerLine).toFixed(0)).format("0.0a"), total);

                number.onmouseover = function(){
                    this.innerHTML = numeral((lines / bytesPerLine).toFixed(0)).format("0,0");
                }

                number.onmouseleave = function(){
                    this.innerHTML = numeral((lines / bytesPerLine).toFixed(0)).format("0.0a");
                }
            }
        });
    },
    $ = new Helper(),
    tab = null, languages = null;

    setTimeout(doColourStuff, 0);

    window.addEventListener("popstate", addToNav);

    setInterval(function(){
        if(!$.find("#slocher-link")){
            tab = null;
            addToNav();
        }
    }, 250);
}());
