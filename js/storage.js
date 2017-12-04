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

store.clearAll()
var tweets

get_tweets().then(function(tweets) {


	console.log(tweets)
})


function get_tweets(order) {

	return new Promise(function (resolve, reject) {

		if (!order){
			order = 'recent_ordered'
		}

		if (store.get('tweets') == undefined) {

			init_tweets().then(function() {
				// Generate ordered tweets and return
				tweets = store.get('tweets')
				ordered_keys = store.get(order + '_keys')

				ordered_tweets = []
				for (i in ordered_keys) {
					ordered_tweets.push(tweets[ordered_keys[i]])
				}

				resolve(ordered_tweets)
			});
		}
		else {

			tweets = store.get('tweets')
			ordered_keys = store.get(order + '_keys')

			ordered_tweets = []
			for (i in ordered_keys) {
				ordered_tweets.push(tweets[ordered_keys[i]])
			}
		
			resolve(ordered_tweets)
		}
	})
}

function init_tweets() {

	return new Promise(function (resolve, reject) {

		// fetch new from twitter and initialize tweets
		var links = read_links_from_file('../insult_tweets.txt').then(function(links) {

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

			resolve()
		})
	})
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
	return new Promise(function (resolve, reject) {
		readFile(filename).then(function(result) {
			resolve(result)
		}).catch(function (err) {
			reject(err)
		});
	});
}

function readFile(file) {
	return new Promise(function (resolve, reject) {
	    var rawFile = new XMLHttpRequest();
	    rawFile.open("GET", file, false);
	    rawFile.onreadystatechange = function ()
	    {
	        if(rawFile.readyState === 4) {
	            if(rawFile.status === 200 || rawFile.status == 0) {
	                var allText = rawFile.responseText;
	                var value = JSON.parse(allText);
	                resolve(value); 
	                // now display on browser :)
	            }
	            else reject('error')
	        }
	    }
	    rawFile.send(null)
	});

}

/* TEMP FUNCTIONS THAT WILL BE IN OTHER MODULES IN THE FUTURE */

function temp_get_tweet(link) {
	return {'date' : link, 'aa' : 10000}
}