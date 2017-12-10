$(document).ready(function() {
    // Get search query from URL
    var substring = window.location.search.substring(1).split("=");
    var query = substring.splice(1, 2)[0];

    if (query == "starred") {
        // The user is searching for her Starred Tweets
        // TODO
    } else {
        // The user has been redirected via the Directory Page or
        // has performed a search
        
        // Normalize search query
        query = query.split("%20").join(" ");

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
    }
});
