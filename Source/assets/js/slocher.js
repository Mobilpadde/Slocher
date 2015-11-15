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
    }, getSloc = function(user, project, cb){
        if(languages == null){
            var xhr = new XMLHttpRequest();

            xhr.onload = function(data){
                response = JSON.parse(data.target.responseText);
                languages = response;
                return cb(response);
            }

            xhr.open("GET", "https://api.github.com/repos/" + user + "/" + project + "/languages");
            xhr.send();
        }else{
            cb(languages);
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

        getSloc(path[0], path[1], function(languages){
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
                        visual = $a("span", null, "slocher-visual", null, null, null, vParent);

                    vParent.style.width = (lis[i++].offsetWidth - widest) + "px";
                    visual.style.width = ((languages[key] / bytesPerLine) / (lines / bytesPerLine) * 100) + "%";
                }

                var total = $a("h4", "slocher-total", null, null, null, "Total number of lines: ", holder);
                $a("b", null, null, null, null, numeral((lines / bytesPerLine).toFixed(0)).format("0,0"), total);
            }
        });
    }, tab = null, languages = null;

    window.addEventListener("popstate", addToNav);

    setInterval(function(){
        if(!$("#slocher-link")){
            tab = null;
            addToNav();
        }
    }, 250);
}());
