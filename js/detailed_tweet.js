function populateDetailedTweet() {
  $(document).ready(function() {
      // Get url and retrieve the tweet id from it
      var splitURL = (window.location.href).split("tweet_id=");
      var theTweetId = (splitURL[1]);
      // Search for extracted id in storage
      get_tweet(theTweetId).then(function(theTweet) {
        if (theTweet){
          // Replace HTML with info about tweet from storage
          var theTweetText = document.getElementById("tweetCardText");
          var theTweetDate = document.getElementById("tweetCardDate");
          var theTweetRetweets = document.getElementById("tweetCardRetweets");
          var theTweetLikes = document.getElementById("tweetCardLikes");
          console.log(theTweet);
          // Add commas into the retweet and favorites count, for easy to read format
          var retweetsNo = theTweet.retweets.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          var favesNo = theTweet.favorites.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          var ugDate = new Date(theTweet.date);
          var prettyDate = "Posted " + ugDate.getMonth() + "/" + ugDate.getDate() + "/" + ugDate.getFullYear() + " at " + ugDate.getHours() + ":" + ugDate.getMinutes();
          theTweetText.innerHTML = theTweet.tweet_text;
          theTweetDate.innerHTML = prettyDate;
          theTweetRetweets.innerHTML = retweetsNo + " retweets";
          theTweetLikes.innerHTML = favesNo + " likes";

          // Fill in Wiki Card information
          getWikiSummary(theTweet.insultee).then(function(response) {
            var theWikiPic = document.getElementById("wikiPic");
            var theWikiText = document.getElementById("wikiText");
            var wiki_content = {};

            try {
              pages = response.query.pages;
              for (var page_id in pages) {
                // Link to article image
                wiki_content['img_url'] = pages[page_id].thumbnail.source;
                // Article summary (text before the "Contents" section)
                wiki_content['summary'] = pages[page_id].extract;
              }
            }
            catch(err) {
              console.log(err);
              wiki_content['error'] = 'Wiki summary unavailable';
            }
            console.log(wiki_content);
            theWikiText.innerHTML = wiki_content['summary'];
            theWikiPic.src = wiki_content['img_url'];
          });
        }
        else {
          var cardDiv = document.getElementById("errmessage");
          var relatedDiv = document.getElementById("related-tweets");
          relatedDiv.innerHTML = "";
          cardDiv.innerHTML = "Error fetching selected tweet from storage! Enjoy this sample data instead.";
          console.log("Error fetching ");
        }
      })
  });
}

populateDetailedTweet();
