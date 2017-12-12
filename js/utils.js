// Search function
//  - needs to be available to every page
$(document).ready(function() {
    document.getElementById("search-form").addEventListener("submit", function(e) {
        // Prevent a submit button from submitting a form
        e.preventDefault();

        //console.log($("#SearchBar").val());
        location.href = "index.html?search=" + $("#SearchBar").val();
    }, false);
});

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

    // var a = document.createElement("a");
    // a.href = "./detailedTweet.html?tweet_id=" + tweet["tweet_id"];

    // Retrieve tweet ID, content, and date from tweet object
    var div = document.createElement("div");
    div.setAttribute("class", "tweet");
    div.id = tweet["tweet_id"];


    // create a styling div within the main div
    var innerDiv = document.createElement("div");
    innerDiv.setAttribute("class", "styledDiv");

    // create star
    var star = document.createElement("div");
    star.setAttribute("class", "star-five");


    //create star button
    var ID = tweet["tweet_id"];
    var starButton = document.createElement("a");
    starButton.setAttribute("class", "starred");
    starButton.setAttribute("value", "ID")
    starButton.href = "#";
    starButton.onclick = function() {
        starTweet(ID);
        alert("tweet starred!");
        star.setAttribute("class", "star-four")
        starButton.setAttribute("class", "clicked");
        if (starButton.className == "clicked") {
            starButton.onclick = function() {
                unstarTweet(ID);
                alert("tweet unstarred!");
            }
        }
    }

    // create a div to place star into
    var starDiv = document.createElement("div");
    starDiv.setAttribute("class", "starDiv");

    // add tweet text
    var content = document.createElement("p4");
    content.innerHTML = tweet["tweet_text"];

    // add tweet insultee + date
    var date = document.createElement("p8");
    var ugDate = new Date(tweet["date"]);

    // add tweet date
    var options = {
        //weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
        //hour: "2-digit",
        //minute: "2-digit"
    };
    var prettyDate = ugDate.toLocaleTimeString("en-us", options);
    date.innerHTML = prettyDate;

    var insultee = document.createElement("p9")
    insultee.innerHTML = "Insult to: " + tweet.insultee.toString().bold()

    // create See More text
    var seeMore = document.createElement("a");
    seeMore.innerHTML = "    See More";
    seeMore.setAttribute("class", "seeMore");
    seeMore.href = "./detailedTweet.html?tweet_id=" + tweet["tweet_id"];

    // Add tweet corresponding to tweet_id to feed
    starButton.appendChild(star);
    starDiv.appendChild(starButton);
    innerDiv.appendChild(document.createElement("br"));
    innerDiv.appendChild(content);
    innerDiv.appendChild(document.createElement("br"));
    innerDiv.appendChild(document.createElement("br"));
    innerDiv.appendChild(insultee);
    innerDiv.appendChild(document.createElement("br"));
    innerDiv.appendChild(date);
    innerDiv.appendChild(document.createElement("br"));
    innerDiv.appendChild(seeMore);
    div.appendChild(innerDiv);
    div.appendChild(starDiv);

    return div
}

function populateFeed(tweets) {
    $(document).ready(function() {
        curFeedTweets = tweets

        // Hide loading icon
        var loader_div = document.getElementById("loader-div")
        loader_div.parentNode.removeChild(loader_div);

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
        //TODO: Unbind scroll event if there are no more contents
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

function create_starred_message(tweets_length) {
    // Display "Starred Tweets" message

    if (tweets_length > 0) {
        var message = document.getElementById("message");
        var content = document.createElement("p5");
        content.innerHTML = "Showing " + tweets_length + " Starred Tweets.";
        message.appendChild(content);
    }
    // if no starred results, show error+suggestion
    else {
        var error_prompt = document.getElementById("error-prompt")
        var content = document.createElement("p7")
        content.innerHTML = "You haven't starred any tweets yet.<br/><br/>" +
            "Click on the star button on tweets to star them!"
        error_prompt.appendChild(content)
    }
}

function create_searched_message(search_word, tweets_length) {

    if (tweets_length > 0) {
        var message = document.getElementById("message")
        var content = document.createElement("p5")
        content.innerHTML = "Showing " + tweets_length + " Search Results for " + search_word.toString().bold() + ".";
        message.appendChild(content)
    }
    // if no search results, show error+suggestion
    else {
        var error_prompt = document.getElementById("error-prompt")
        var content = document.createElement("p7")
        content.innerHTML = "Your search - " + search_word.toString().bold() + " - did not match any tweets.<br/><br/>" +
            "Suggestions:" +
            "<ul>" +
            "<li>Make sure all words are spelled correctly.</li>" +
            "<li>Search for specific person.</li>" +
            "<li>Try more general keywords.</li>" +
            "</ul>"
        error_prompt.appendChild(content)
    }
}

function create_no_related_tweet_message(tweet) {

    var error_prompt = document.getElementById("error-prompt")
    var content = document.createElement("p7")
    content.innerHTML = "No related tweets found for " + tweet.insultee + "."
    error_prompt.appendChild(content)

}