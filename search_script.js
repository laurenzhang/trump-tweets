$(document).ready(function() {
    // Get search query from URL
    var substring = window.location.search.substring(1).split("=");
    var query = substring.splice(1, 2)[0];

    get_insultee_tweets(query).then(function(tweets) {
        console.log(tweets);
        populateFeed(tweets);
    });
});