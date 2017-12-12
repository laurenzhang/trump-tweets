$(document).ready(function() {
    populateDetailedTweet();
    detailTweetStar();
})

function populateDetailedTweet() {

    // Get url and retrieve the tweet id from it
    var splitURL = (window.location.href).split("tweet_id=");
    var theTweetId = (splitURL[1]);
    console.log(theTweetId);
    var detailStar = document.getElementById("detailedStar");
    detailStar.value = theTweetId;
    console.log(detailStar.value);
    // Search for extracted id in storage

    get_tweet(theTweetId).then(function(theTweet) {
        if (theTweet) {

            populateRelatedTweets(theTweet)

            // Replace HTML with info about tweet from storage
            var theTweetText = document.getElementById("tweetCardText");
            var theTweetDate = document.getElementById("tweetCardDate");
            var theTweetRetweets = document.getElementById("tweetCardRetweets");
            var theTweetLikes = document.getElementById("tweetCardLikes");
            var theTweetTitle = document.getElementById("tweetTitle");
            //console.log(theTweet);
            // Add commas into the retweet and favorites count, for easy to read format
            var retweetsNo = theTweet.retweets.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            var favesNo = theTweet.favorites.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            var ugDate = new Date(theTweet.date);

            var options = {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            };
            var prettyDate = ugDate.toLocaleTimeString("en-us", options);

            theTweetTitle.innerHTML = theTweet.insultee;
            theTweetText.innerHTML = theTweet.tweet_text;
            theTweetDate.innerHTML = prettyDate;
            theTweetRetweets.innerHTML = retweetsNo + " retweets";
            theTweetLikes.innerHTML = favesNo + " likes";
            // Fill in Wiki Card information
            console.log("Original insultee: " + theTweet.insultee);
            getWikiSummary(theTweet.insultee).then(function(response) {
                hide_loader()
                var theWikiPic = document.getElementById("wikiPic");
                var theWikiText = document.getElementById("wikiText");
                var theWikiTitle = document.getElementById("wikiTitle");
                var wiki_content = {};

                //console.log(response);

                try {
                    pages = response.query.pages;
                    for (var page_id in pages) {
                        // Link to article image, if exists
                        if (pages[page_id].thumbnail)
                            wiki_content['img_url'] = pages[page_id].thumbnail.source;
                        else
                            wiki_content['img_url'] = 'http://torchthewindmill.com/wp-content/uploads/2017/02/0Cheeto.jpg';
                        // Article summary (text before the "Contents" section)
                        wiki_content['summary'] = pages[page_id].extract;
                        wiki_content['title'] = pages[page_id].title;
                        console.log("title " + pages[page_id].title);
                    }
                } catch (err) {
                    console.log('Error Fetching wiki!')
                        // console.log(err);
                    wiki_content['title'] = 'Wikipedia Card';
                    wiki_content['summary'] = 'Wiki summary unavailable';
                    wiki_content['img_url'] = 'http://torchthewindmill.com/wp-content/uploads/2017/02/0Cheeto.jpg';
                }
                //console.log(wiki_content);
                theWikiTitle.innerHTML = wiki_content['title'];
                theWikiText.innerHTML = wiki_content['summary'];
                theWikiPic.src = wiki_content['img_url'];
            });
        } else {
            var cardDiv = document.getElementById("errmessage");
            var relatedDiv = document.getElementById("related-tweets");
            relatedDiv.innerHTML = "";
            cardDiv.innerHTML = "Error fetching selected tweet from storage! Enjoy this sample data instead.";
            console.log("Error fetching ");
        }
    })
}

function populateRelatedTweets(tweet) {

    get_related_tweets(tweet).then(function(related_tweets) {
        if (related_tweets.length > 0) {
            populateFeed(related_tweets)
        }
        // add error message when no related tweet
        else {
            create_no_related_tweet_message(tweet)
        }

    });
}

function detailTweetStar() {
    var detailStar = document.getElementById("detailedStar");
    var splitURL = (window.location.href).split("tweet_id=");
    var ID = (splitURL[1]);
    detailStar.onclick = function () {
        starTweet(ID);
        alert("tweet starred!");
    };

    if (isStarred(ID)) {
        detailStar.setAttribute("class", "star-four")
        detailStar.onclick = function () {
            unstarTweet(ID);
            alert("tweet unstarred!");
            detailStar.setAttribute("class", "star-five")
            location.reload(true);
        }
    } else {
        detailStar.setAttribute("class", "star-five");

        detailStar.onclick = function () {
            starTweet(ID);
            alert("tweet starred!");
        };
    }
}