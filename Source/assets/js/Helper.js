var Helper = (function(){
    return {
        find: function(elm){
            return document.querySelector(elm);
        },
        create: function(type, ids, classes, role, href, text, addTo){
            var elm = document.createElement(type);

            if(ids != null) elm.id = ids;
            if(classes != null) elm.className = classes;
            if(role != null) elm.setAttribute("role", role);
            if(text != null) elm.innerHTML = text;
            if(href != null) elm.href = href;
            if(addTo != null) addTo.appendChild(elm);

            return elm;
        },
        json: function(url, cb){
            var xhr = new XMLHttpRequest();

            xhr.onload = function(data){
                cb(JSON.parse(data.target.responseText));
            }

            xhr.open("GET", url);
            xhr.send();
        }
    }
});
