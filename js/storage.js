/* DATA SCHEMA (store.get, store.set)

tweets <MAP of tweet objects, ordered by chronological>
	tweet <Dictionary with data as keys> 
		tweet_link <string>
		date	<date object>
		tweet_text <string>
		wiki_card_link <string>
		to <string>
		related_tweets <list of tweet objects>

past_searches <list of strings>
	search <string>
*/


//store.clearAll()
var tweets = get_tweets()
console.log(tweets)

function get_tweets() {
	// TODO: NO LOGIC TO CHECK FOR NEW UPDATES ON TWEETS YET
	var tweets = []

	// fetch new from twitter
	if (store.get('tweets') == undefined) {
		var links = read_links_from_file()
		// call back needed
		for (var link in links) {
			var tweet = temp_get_tweet(link)
			// call back needed
			tweets.push(tweet)
		}

		store.set('tweets', tweets)

	} else { // fetch from local storage
		tweets = store.get('tweets')
	}

	return tweets
}

/* init related tweets from start when getting tweets
function get_related_tweets(tweet) {

	related_tweets = tweet.related_tweets

	// fetch related tweets from twitter
	if (related_tweets == null) {

		related_tweets = temp_search_for_related_tweets(tweet)

		store.set()


	} 
	
	return related_tweets
}*/

function read_links_from_file(filename) {

	return [1,2,3,4]
}

/* TEMP FUNCTIONS THAT WILL BE IN OTHER MODULES IN THE FUTURE */

function temp_get_tweet(link) {
	return link
}