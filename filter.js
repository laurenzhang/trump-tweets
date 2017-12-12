$(document).ready(function() {
    var ddmenu = document.getElementById("indexFilter");

    // set default order using url
    urlParams = parseURLParams(window.location.href)

    if (urlParams != undefined) {
        order = urlParams['order']

        if (order == 'fav') {
            ddmenu.selectedIndex = 1
        }
        else if (order == 'retweet') {
            ddmenu.selectedIndex = 2
        }
    }

    var value = ddmenu.options[ddmenu.selectedIndex].value;
    var text = ddmenu.options[ddmenu.selectedIndex].text;

    ddmenu.onchange = function() {
        var newvalue = ddmenu.options[ddmenu.selectedIndex].value;

        var tweets = new Array();

        if (newvalue == 1) {
            tweets = get_tweets("recent_ordered").then(function(tweets) {
                window.location.href = "index.html?order=recent";
            });
        } else if (newvalue == 2) {
            tweets = get_tweets("fav_ordered").then(function(tweets) {
                window.location.href = "index.html?order=fav";
            });
        } else if (newvalue == 3) {
            tweets = get_tweets("retweet_ordered").then(function(tweets) {
                window.location.href = "index.html?order=retweet";
            });
        }

    }
});