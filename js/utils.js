/*

    This function takes a list of tweet objects, and displays them in a feed.
    Requires the following in your HTML file:
        <script src="js/utils.js"></script>

        <!-- Skeleton for tweet feed -->
        <div class="center-div" id="feed"></div>

*/

var curFeedTweets
var curIndex = 0

function generate_tweet_box(index) {
    tweet = curFeedTweets[index];

    var a = document.createElement("a");
    a.href = "./detailedTweet.html?tweet_id=" + tweet["tweet_id"];

    // Retrieve tweet ID, content, and date from tweet object
    var div = document.createElement("div");
    div.setAttribute("class", "tweet");
    div.id = tweet["tweet_id"];

    // var star = document.createElement("div");
    // star.setAttribute("class", "star-five");

    // TODO: styling for "p4"
    var content = document.createElement("p4");
    content.innerHTML = tweet["tweet_text"];
    var date = document.createElement("p4");
    var ugDate = new Date(tweet["date"]);
    var prettyDate = "Posted " + ugDate.getMonth() + "/" + ugDate.getDate() + ", " + ugDate.getFullYear() + " at " + ugDate.getHours() + ":" + ugDate.getMinutes();
    date.innerHTML = prettyDate;

    // Add tweet corresponding to tweet_id to feed
    //div.appendChild(star);
    div.appendChild(content);
    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));
    div.appendChild(date);
    a.appendChild(div);

    return a
}

function populateFeed(tweets) {
    $(document).ready(function() {
        for (i in tweets) {
            if (tweets[i] == undefined) {
                continue;
            }
            tweet = tweets[i];
            var feed = document.getElementById("feed");

            var a = document.createElement("a");
            a.href = "./detailedTweet.html?tweet_id=" + tweet["tweet_id"];

            // Retrieve tweet ID, content, and date from tweet object
            var div = document.createElement("div");
            div.setAttribute("class", "tweet");
            div.id = tweet["tweet_id"];

            // create a styling div within the main div 
            var innerDiv = document.createElement("div");
            innerDiv.setAttribute("class", "styledDiv");


            //create star button
            var star = document.createElement("div");
            star.setAttribute("class", "star-five");
            star.setAttribute("class", "starred");

            // create a div to place star into 
            var starDiv = document.createElement("div");
            starDiv.setAttribute("class", "starDiv");

            // TODO: styling for "p4"
            var content = document.createElement("p4");
            content.innerHTML = tweet["tweet_text"];
            var date = document.createElement("p4");
            var ugDate = new Date(tweet["date"]);
            var prettyDate = "Posted " + ugDate.getMonth() + "/" + ugDate.getDate() + ", " + ugDate.getFullYear() + " at " + ugDate.getHours() + ":" + ugDate.getMinutes();
            date.innerHTML = prettyDate;

            // Add tweet corresponding to tweet_id to feed
            starDiv.appendChild(star);
            innerDiv.appendChild(document.createElement("br"));
            innerDiv.appendChild(content);
            innerDiv.appendChild(document.createElement("br"));
            innerDiv.appendChild(document.createElement("br"));
            innerDiv.appendChild(date);
            div.appendChild(innerDiv);
            div.appendChild(starDiv);
            a.appendChild(div);
            feed.appendChild(a);
        }
    });
}

function add_tweets_to_page(itemsToAdd) {

    var $feed = $(document.getElementById("feed"));
    start = curIndex
    while (curIndex < curFeedTweets.length && curIndex < start + itemsToAdd) {
        $feed.append(generate_tweet_box(curIndex))
        curIndex++
    }
}

$(function() {
    $(window).scroll(function() {

        if (curFeedTweets == undefined || curFeedTweets.length <= curIndex) {
            return
        }

        var $feed = $(document.getElementById("feed"));

        var divPlacement = parseInt($feed.offset().top + parseInt($feed.height()));

        var screenBottom = $(this).scrollTop()
        divPlacement -= 600; //load contents before reaching to the end of the div

        if (divPlacement <= screenBottom) {
            // add 5 tweets at a time
            add_tweets_to_page(5)
        }
        //TODO:: Unbind scroll event if there are no more contents
    });
});

// Search function
$(document).ready(function() {
    document.getElementById("search-form").addEventListener("submit", function(e) {
        // Prevent a submit button from submitting a form
        e.preventDefault();

        console.log($("#SearchBar").val());
        location.href = "./search.html?insultee=" + $("#SearchBar").val();
    }, false);
});