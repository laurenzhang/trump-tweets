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

    tweet = curFeedTweets[index]

    if (tweet == undefined) {
        return undefined
    }

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
    var ID = tweet["tweet_id"];
    var star = document.createElement("div");
    star.setAttribute("class", "star-five starred");
    star.setAttribute("value", "ID")


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


    return a
}

function populateFeed(tweets) {
    $(document).ready(function() {
        curFeedTweets = tweets
        add_tweets_to_page(5)
    });
}

function add_tweets_to_page(itemsToAdd) {

    var $feed = $(document.getElementById("feed"));
    start = curIndex
    while (curIndex < curFeedTweets.length && curIndex < start + itemsToAdd) {
        tweet = generate_tweet_box(curIndex)
        if (tweet != undefined) {
            $feed.append(tweet)
        }
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


function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {},
        i, n, v, nv;

    if (query === url || query === "") return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}

function create_starred_message() {
    // Display "Starred Tweets" message
    var message = document.getElementById("message");
    // TODO: styling for "p5"
    var content = document.createElement("p5");
    content.innerHTML = "Starred Tweets";
    message.appendChild(content);
}

function create_searched_message(search_word) {
    var message = document.getElementById("message");
    // TODO: styling for "p5"
    var content = document.createElement("p5");
    content.innerHTML = "Search Results for " + search_word;
    message.appendChild(content);
}