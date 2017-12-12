$(document).ready(function() {
    // Get search query from URL

    /*
    var substring = window.location.search.substring(1).split("=");
    var query = substring.splice(1, 2)[0];

    if (query == "starred") {
        // The user is searching for her Starred Tweets

        // Display "Starred Tweets" message
        var message = document.getElementById("message");
        // TODO: styling for "p5"
        var content = document.createElement("p5");
        content.innerHTML = "Starred Tweets";
        message.appendChild(content);

        // For testing purposes, "star" a tweet
        starTweet("668255569996853248");

        getStarredTweets().then(function(starred_tweets) {
            populateFeed(starred_tweets);
        });
    } else {
        // The user has been redirected via the Directory Page or
        // has performed a search

        // Normalize search query
        query = query.split("%20").join(" ");

        // Display "Search Results for..." message
        var message = document.getElementById("message");
        // TODO: styling for "p5"
        var content = document.createElement("p5");
        content.innerHTML = "Search Results for " + query;
        message.appendChild(content);

        get_insultees().then(function(insultees) {
            if (insultees.has(query)) {
                get_insultee_tweets(query).then(function(tweets) {
                    populateFeed(tweets);
                });
            } else {
                console.log("Invalid insultee value");
                // TODO: show error statement
            }
        });
    }*/
});
