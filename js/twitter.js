var cb = new Codebird;
// Add consumer key and consumer secret for bubblgum
cb.setConsumerKey('K8xcqQPtcFoNpnb4dKEASd0Hq', '2WXX552OV8lDdJx0RiZR9VIlvolZosgvlG9KsibOkkRhDE261z');
cb.setToken('937429814214000644-13yt1QjejElNyEVgRPRYmDSxbTwc70N','KChXLbdENEfbMmJuKSd1MvPRX2hrmdqMDltd5EBzmALzv');
/* var params = {
  status: "Just tweeted using codebird."
}; */

/* GET ONE TWEET
function getTweetJSON(insultee, statusID){

return new Promise(function (resolve, reject){
  // The API call
  cb.__call(
    "statuses_show_ID",
    'id=' + statusID,
    // The callback function
    function (reply, rate, err) {
        // fill in the tweet_dict object with details to return

        //TODO CATCH ERRORS AND reject Promise (rate errors)
        var tweet_dict = {};
        tweet_dict.tweet_id = statusID;
        tweet_dict.insultee = insultee;
        var dateElms = (reply.created_at).split(" ");
        //console.log("The date: " + dateElms[0] + dateElms[1] + dateElms[2] + dateElms[3] + dateElms[5]);
        tweet_dict.date = new Date(reply.created_at);
        tweet_dict.tweet_text = reply.text;
        tweet_dict.related_tweets = "get from related function";
        tweet_dict.retweets = reply.retweet_count;
        tweet_dict.favorites = reply.favorite_count;

        resolve(tweet_dict);
    }
  );
});
}*/

function getTweetBatch(insultee, statusID_list){
    /* TO DO:
     instead of looking up one tweet at a time with statuses_show_ID, use
     lookup to get max 100 tweets at a time corresponding PER USER. Then iterate
     over all of the results, create a dict per each, and return those all in
     an array.
     */
    var returnArray = [];
    //var statusID_list = ["674382044097449985", "668827139232423936", "668827020718161920"];
    // build the string of comma separated IDs for lookup request
    var statuses_string = statusID_list[0];
    for (var i = 1; i <statusID_list.length; i++)
        statuses_string = statuses_string + ',' + statusID_list[i];

    return new Promise(function (resolve, reject){
        // The API call
        cb.__call(
            "statuses_lookup",
            'id=' + statuses_string,
            // The callback function
            function (reply, rate, err) {
                //console.log(reply);
                //for each tweet JSON returned from Twitter API
                for (var j = 0; j < reply.length; j++){
                    // fill in the tweet_dict object with details to return
                    //console.log(reply[j]);
                    var tweet_dict = {};
                    tweet_dict.tweet_id = reply[j].id_str;
                    tweet_dict.insultee = insultee;
                    tweet_dict.date = new Date(reply[j].created_at)
                    tweet_dict.tweet_text = reply[j].text;
                    tweet_dict.retweets = reply[j].retweet_count;
                    tweet_dict.retweets = reply[j].favorite_count;

                    returnArray.push(tweet_dict);
                }
                resolve(returnArray);
            });
    });
}
/*
getTweetJSON('The Associated Press', '674382044097449985').then(function(tweet) {

  console.log(tweet)
})*/

/*
getTweetJSON("https://twitter.com/realDonaldTrump/status/756804886038192128", function(reply){
alert(reply); // this is where you get the return value
});*/


