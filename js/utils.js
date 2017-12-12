/*

    This function takes a list of tweet objects, and displays them in a feed.
    Requires the following in your HTML file:
        <script src="js/utils.js"></script>

        <!-- Skeleton for tweet feed -->
        <div class="center-div" id="feed"></div>

*/
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

            // create a div to place star into 
            var starDiv = document.createElement("div");
            starDiv.setAttribute("class", "starDiv");

            //create star button
            var star = document.createElement("div");
            star.setAttribute("class", "star-five");

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
            innerDiv.appendChild(starDiv);
            div.appendChild(innerDiv);
            a.appendChild(div);
            feed.appendChild(a);
        }
    });
}

// Search function
$(document).ready(function() {
    document.getElementById("search-form").addEventListener("submit", function(e) {
        // Prevent a submit button from submitting a form
        e.preventDefault();

        console.log($("#SearchBar").val());
        location.href = "./search.html?insultee=" + $("#SearchBar").val();
    }, false);
});