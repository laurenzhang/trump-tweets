/* DATA SCHEMA (store.get, store.set)

tweets <Dictionary of tweet objects, the link as its key>
	tweet <Dictionary with data as keys> 
		tweet_link <string>
		date	<date object>
		tweet_text <string>
		wiki_card_link <string>
		to <string>
		related_tweets <list of tweet objects>

recent_ordered_keys <Array of keys for tweets ordered by recent>

past_searches <list of strings>
	search <string>
*/

a = read_links_from_file('../insult_tweets.txt')
console.log(a)

function get_tweets(order='recent_ordered') {
	// TODO: NO LOGIC TO CHECK FOR NEW UPDATES ON TWEETS YET
	
	// fetch new from twitter and initialize tweets
	if (store.get('tweets') == undefined) {
		var links = read_links_from_file('asdf')
		// call back needed
		var tweets = {}
		for (var i in links) {
			var tweet = temp_get_tweet(links[i])
			// call back needed
			tweets[links[i]] = tweet
		}
		// Create tweets dictionary
		store.set('tweets', tweets)

		// Create Recent ordered
		var recent_ordered_keys = Object.keys(tweets).map(function(key) {
	    	return key;
		});
		recent_ordered_keys.sort(function(first, second) {
	    	return tweets[first].date - tweets[second].date;
		});
		store.set('recent_ordered_keys', recent_ordered_keys)
	} 

	// Generate ordered tweets and return
	tweets = store.get('tweets')
	ordered_keys = store.get(order + '_keys')

	ordered_tweets = []
	for (i in ordered_keys) {
		ordered_tweets.push(tweets[ordered_keys[i]])
	}
	
	return ordered_tweets
}

function get_related_tweets(tweet) {

	if (store.get('tweets') == undefined) {
		get_tweets()
	}
	tweets = store.get('tweets')

	related_tweets_links = tweet.related_tweets
	related_tweets = []
	// fetch related tweets from twitter
	for (i in related_tweets_links) {
		related_tweets.push(tweets[related_tweets_links[i]])
	}
	
	return related_tweets
}

function read_links_from_file(filename) {

	json = $.getJSON(filename, function(json) {
    	
    	return json
	});
}

/* TEMP FUNCTIONS THAT WILL BE IN OTHER MODULES IN THE FUTURE */

function temp_get_tweet(link) {
	return {'date' : link, 'aa' : 10000}
}

/* STARRED TWEETS
    - These functions assume that a list of starred tweets was initialized at
        the beginning of the session like so:
        
        store.set('starred_tweets', [])
*/

function starTweet(url) {
    store.push('starred_tweets', url);
}

function getStarredTweets(url) {
    var starred_tweets = store.get('starred_tweets');
    // TODO: do something w/ the starred tweets' URLs
}
