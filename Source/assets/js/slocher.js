(function slocher(){
    var $ = function(elm){
        return document.querySelector(elm);
    }, $a = function(type, ids, classes, role, href, text, addTo){
        var elm = document.createElement(type);

        if(ids != null) elm.id = ids;
        if(classes != null) elm.className = classes;
        if(role != null) elm.setAttribute("role", role);
        if(text != null) elm.innerHTML = text;
        if(href != null) elm.href = href;
        if(addTo != null) addTo.appendChild(elm);

        return elm;
    }, $j = function(url, cb){
        var xhr = new XMLHttpRequest();

        xhr.onload = function(data){
            cb(JSON.parse(data.target.responseText));
        }

        xhr.open("GET", url);
        xhr.send();
    }, doColourStuff = function(){
        $j("https://raw.githubusercontent.com/ozh/github-colors/master/colors.json", function(colours){
            var stylesheet = $a("style", "slocher-stylesheet", null, null, null, null, $("head"));
            for(var key in colours){
                stylesheet.innerHTML += "body #slocher li:hover .slocher-" + key.replace(/[^a-z0-9]/ig, "") +
                "{background:" + colours[key].color + " !important;border-left-width:0px !important;}";
            }
        });
    }, getBytes = function(user, project, cb){
        if(languages != null) cb(languages);
        else{
            $j("https://api.github.com/repos/" + user + "/" + project + "/languages", function(langs){
                languages = langs;
                cb(langs);
            });
        }
    }, addToNav = function(){
        if(tab == null){
            tab = $a("a", "slocher-link", "js-selected-navigation-item tabnav-tab", "tab", "#slocher", "Lines of Code", $(".tabnav-tabs"));
            tab.onclick = function(){
                var selected = $(".tabnav .selected");
                selected.className = selected.className.replace(" selected", "");
                selected.removeAttribute("aria-selected");
                tab.className += " selected";
                addTabData();
            }
        }

        if(window.location.hash == "#slocher") tab.click();
    }, addTabData = function(){
        var tabs = $(".tabnav")
            path = window.location.pathname.split("/").splice(1);

        $("#js-repo-pjax-container").innerHTML = "";
        $("#js-repo-pjax-container").appendChild(tabs);

        getBytes(path[0], path[1], function(languages){
            if(!$("#slocher")){
                var holder = $a("div", "slocher", "graph-filter clearfix", null, null, null, $("#js-repo-pjax-container")),
                    h3 = $a("h3", "slocher-loc", "js-date-range", null, null, "Lines of Code", holder),
                    ul = $a("ul", "slocher-languages", null, null, null, null, holder),
                    lines = 0,
                    bytesPerLine = 40,
                    widest = 0,
                    lis = [];

                for(var key in languages){ lines += languages[key]; }

                for(var key in languages){
                    var li = $a("li", null, null, null, null, null, ul),
                        language = $a("b", null, null, null, null, key + ": ", li),
                        slocs = $a("span",
                            null, null, null, null,
                            numeral((languages[key] / bytesPerLine).toFixed(0)).format("0,0") +
                            " (" + ((languages[key] / bytesPerLine) / (lines / bytesPerLine) * 100).toFixed(1) + "%)",
                        li);

                    if(widest < language.offsetWidth + slocs.offsetWidth) widest = language.offsetWidth + slocs.offsetWidth;

                    lis.push(li);
                }

                var i = 0;
                for(key in languages){
                    var vParent = $a("span", null, "slocher-visual-parent", null, null, null, lis[i]),
                        visual = $a("span", null, "slocher-visual slocher-" + key.replace(/[^a-z0-9]/ig, ""), null, null, null, vParent);

                    vParent.style.width = (lis[i++].offsetWidth - widest) + "px";
                    visual.style.width = ((languages[key] / bytesPerLine) / (lines / bytesPerLine) * 100) + "%";
                }

                var total = $a("h4", "slocher-total", null, null, null, "Total number of lines: ", holder);
                $a("b", null, null, null, null, numeral((lines / bytesPerLine).toFixed(0)).format("0,0"), total);
            }
        });
    }, tab = null, languages = null;

    setTimeout(doColourStuff, 0);

    window.addEventListener("popstate", addToNav);

    setInterval(function(){
        if(!$("#slocher-link")){
            tab = null;
            addToNav();
        }
    }, 250);
}());
