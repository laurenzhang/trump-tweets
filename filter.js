$(document).ready(function() {
    var ddmenu = document.getElementById("indexFilter");
    var value = ddmenu.options[ddmenu.selectedIndex].value;
    var text = ddmenu.options[ddmenu.selectedIndex].text;

    ddmenu.onchange = function() {
        var newvalue = ddmenu.options[ddmenu.selectedIndex].value;
        console.log(newvalue);

        var tweets = new Array();

        if (newvalue = 1) {
            tweets = get_tweets("recent_ordered").then(function(tweets) {
                console.log(tweets)
                populateFeed(tweets);
            });
        } else if (newvalue = 2) {
            tweets = get_tweets("fav_ordered").then(function(tweets) {
                console.log(tweets)
                populateFeed(tweets);
            });
        } else if (newvalue = 3) {
            tweets = get_tweets("retweet_ordered").then(function(tweets) {
                console.log(tweets)
                populateFeed(tweets);
            });
        }

    }
});