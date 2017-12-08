$(function() {
  var cb = new Codebird;
  // Add consumer key and consumer secret for bubblgum
  cb.setConsumerKey('K8xcqQPtcFoNpnb4dKEASd0Hq', '2WXX552OV8lDdJx0RiZR9VIlvolZosgvlG9KsibOkkRhDE261z');
  cb.setToken('937429814214000644-13yt1QjejElNyEVgRPRYmDSxbTwc70N','KChXLbdENEfbMmJuKSd1MvPRX2hrmdqMDltd5EBzmALzv');
  /* var params = {
      status: "Just tweeted using codebird."
  }; */

  function getTweetJSON(insultee, statusID){
    /* TO DO:
    instead of looking up one tweet at a time with statuses_show_ID, use
    lookup to get max 100 tweets at a time corresponding PER USER. Then iterate
    over all of the results, create a dict per each, and return those all in
    an array.
    */
    return new Promise(function (resolve, reject){
      // The API call
      cb.__call(
        "statuses_show_ID",
        'id=' + statusID,
        // The callback function
        function (reply, rate, err) {
            // fill in the tweet_dict object with details to return
            var tweet_dict = {};
            tweet_dict.tweet_id = statusID;
            tweet_dict.insultee = insultee;
            var dateElms = (reply.created_at).split(" ");
            console.log("The date: " + dateElms[0] + dateElms[1] + dateElms[2] + dateElms[3] + dateElms[5]);
            tweet_dict.date = reply.created_at;
            tweet_dict.tweet_text = reply.text;
            tweet_dict.related_tweets = "get from related function";
            tweet_dict.retweets = reply.retweet_count;
            tweet_dict.retweets = reply.favorite_count;

            resolve(tweet_dict);
        }
      );
    });
  }

  getTweetJSON("https://twitter.com/realDonaldTrump/status/756804886038192128", function(reply){
    alert(reply); // this is where you get the return value
});

});
