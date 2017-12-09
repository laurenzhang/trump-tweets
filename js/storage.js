/* DATA SCHEMA (store.get, store.set)

tweets <Dictionary of tweet objects, the tweetId as its key>
	tweet <Dictionary with data as keys> 
		tweet_link <string>
		tweet_id <string>
		date	<date object>
		tweet_text <string>
		wiki_card_link <string>
		insultee <string>
		related_tweets <list of tweet Ids>

recent_ordered_keys <Array of keys for tweets ordered by recent>
most_retweet_ordered_keys <Array of keys for tweets ordered by retweet>
most_fav_ordered_keys <Array of keys for tweets ordered by favs>

past_searches <list of strings>
	search <string>
*/

// TO CLEAR STORAGE
//store.clearAll()

//EXAMPLE USAGE

/*

FIRST ADD
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="store.legacy.min.js"></script>
<script type="text/javascript" src="https://rawgit.com/jublonet/codebird-js/develop/codebird.js"></script>
<script src="twitter.js"></script>
<script src="storage.js"></script>

1) retrieve array of tweets in certain order

get_tweets().then(function(tweets) {

	// tweets: returned list of tweets in recent order
	console.log(tweets)
})

2) get related tweets of 'tweet' in array

 related_tweets = get_related_tweets(tweet)

TODO: This must be called after tweets initialized, so fix this with promise in init_tweets()

*/

/*
 * Gets a array of tweets in the 'order' parameter
 *
 * @param[in] order (default: "recent_ordered") : Value specifying the order of tweets
 * possible values: ["recent_ordered"] TODO add more orders
 *
 * @returns a Promise object which passes the tweets array when done
 *
 * @see DATA SCHEMA at top to see what 'tweets' are
 */

function get_tweets(order) {

	return new Promise(function (resolve, reject) {

		// set default value for order
		if (!order){
			order = 'recent_ordered'
		}

		// if tweets not initialized, init and store in local storage
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
		// fetch from local storage and create array in order and return
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

function get_related_tweets(tweet) {

    if (store.get('tweets') == undefined) {
        get_tweets()
    }
    tweets = store.get('tweets')

    related_tweetsIds = tweet.related_tweets
    related_tweets = []
    // fetch related tweets from twitter
    for (i in related_tweetsIds) {
        related_tweets.push(tweets[related_tweetsIds[i]])
    }

    return related_tweets
}

/* FUNCTIONS UNDER HERE SHOULD NOT BE TOUCHED FROM THE FRONT-END
* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
* */

/*
 * Initializes tweets from json_url and stores in local storages
 *
 * This function should not be touched from the front-end.
 */
function init_tweets() {

	return new Promise(function (resolve, reject) {

		// fetch new from twitter and initialize tweets

		// Read insult tweets as JSON from the file's GitHub URL
		var JSON_URL = 'https://raw.githubusercontent.com/laurenzhang/trump-tweets/master/json/insult_tweets.json'

		// read from file
		readFile(JSON_URL).then(function(tweet_file) {

			var tweet_promises = []
			var count = 0
			for (var insultee in tweet_file) {
			    // promise get fetches all tweets for insultee
                promiseObject = init_tweet_util(insultee, tweet_file[insultee])
                tweet_promises.push(promiseObject)
				// LIMIT TWEET CALLS FOR TESTING
				count += 1
				if (count == 3) break
			}

			// Get tweets from twitter and organize file into DATA SCHEMA
            Promise.all(tweet_promises).then(function(listOf_tweet_list) {

                var tweets = {}

                for (i in listOf_tweet_list) {
                    insultee_tweets = listOf_tweet_list[i]
                    for (j in insultee_tweets) {
                        tweet = insultee_tweets[j]
                        tweets[tweet.tweet_id] = tweet
                    }
                }

                //console.log(roughSizeOfObject(tweets))

                store.set('tweets', tweets)

                // Sort the data into the order we want and cache in local storage

				// 1) sort for recent ordered
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
	})
}

/*
 * Utility function for init_tweet to organize tweets into insultees
 * and add related tweets
 *
 * @param[in] insultee : String specifying the insultee
 * @param[in] tweetIds : Array of tweeet ids to query under insultee
 *
 * @returns a Promise object which passes the tweets array when done.
 *
 * This function should NOT be touched from the front-end.
 */
function init_tweet_util(insultee, tweetIds) {

    return new Promise(function (resolve, reject) {

        promise_list = []
        for (i in tweetIds) {
            promiseObject = getTweetJSON(insultee, tweetIds[i])
            promise_list.push(promiseObject)
        }

        Promise.all(promise_list).then(function(tweet_list) {

            for (i in tweet_list) {
                tweet = tweet_list[i]

                // set related tweet list
                tweet.related_tweets = tweetIds.slice(0)
                var index = tweet.related_tweets.indexOf(tweet.tweet_id)
                if (index > -1) {
                    tweet.related_tweets.splice(index, 1)
                }
            }

            resolve(tweet_list)
        });
    });

}

/*
 * Reads the initial tweet_json data from a file or url
 *
 * @param[in] file : Name of the file or url string to read from
 *
 * @returns a Promise object which passes the data in a dictionary when done
 *
 * TODO: FIX
 * storage.js:225 [Deprecation] Synchronous XMLHttpRequest on the main thread is deprecated because of its
 * detrimental effects to the end user's experience. For more help, check https://xhr.spec.whatwg.org/.
 *
 */

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
	                //console.log(value);
	                resolve(value); 
	                // now display on browser :)
	            }
	            else reject('error')
	        }
	    }
	    rawFile.send(null)
	});

}

/* TEMP FUNCTIONS THAT WILL BE IN OTHER MODULES IN THE FUTURE
*  ALL UNDER HERE WILL BE REMOVED IN THE FUTURE
* */

function temp_get_tweet(person, id) {
    return new Promise(function (resolve, reject) {

    	resolve({'date' : id, 'person' : person, 'tweet_id' :id, 'aa' : 10000})
    });

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

/*
function roughSizeOfObject( object ) {

    var objectList = [];
    var stack = [ object ];
    var bytes = 0;

    while ( stack.length ) {
        var value = stack.pop();

        if ( typeof value === 'boolean' ) {
            bytes += 4;
        }
        else if ( typeof value === 'string' ) {
            bytes += value.length * 2;
        }
        else if ( typeof value === 'number' ) {
            bytes += 8;
        }
        else if
        (
            typeof value === 'object'
            && objectList.indexOf( value ) === -1
        )
        {
            objectList.push( value );

            for( var i in value ) {
                stack.push( value[ i ] );
            }
        }
    }
    return bytes;
}*/