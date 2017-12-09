/* DATA SCHEMA (store.get, store.set)

tweets <Dictionary of tweet objects, the tweetId as its key>
	tweet <Dictionary with data as keys>
		tweet_id <string>
		date	<date object>
		tweet_text <string>
		wiki_card_link <string>
		insultee <string>
 		favorites <number>
 		retweets <number>

recent_ordered_keys <Array of keys for tweets ordered by recent>
retweet_ordered_keys <Array of keys for tweets ordered by retweet>
fav_ordered_keys <Array of keys for tweets ordered by favs>

related_tweets <dictionary of list tweet ids, the insultee name as its key>
    'insultee' --> tweet_ids <list of tweet_id strings>

past_searches <list of strings>
	search <string>
*/

// TO CLEAR STORAGE
//store.clearAll()

//EXAMPLE USAGE
/*
readFile('https://raw.githubusercontent.com/laurenzhang/trump-tweets/master/json/insult_tweets.json').then(function(tweet_file) {
    var maxLength = 0
    var maxKey
    for (var key in tweet_file) {
        if (tweet_file[key].length > maxLength) {
            maxLength = tweet_file[key].length
            maxKey = key
        }
    }
    console.log('length!')
    console.log(maxLength)
    console.log(maxKey)

})*/
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

*/

/*
 * Gets a array of tweets in the 'order' parameter
 *
 * @param[in] order (default: "recent_ordered") : Value specifying the order of tweets
 * possible values: ["recent_ordered" | "retweet_ordered" | "fav_ordered"]
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

/*
 * Gets an array of related tweets
 *
 * @param[in] tweet : the tweet object to get related tweets
 *
 * @returns a Promise object which passes the related tweets array when done
 *
 * @see DATA SCHEMA at top to see what 'tweet' is
 */
function get_related_tweets(tweet) {

	return new Promise(function (resolve, reject) {

        // if tweets not initialized, init and store in local storage, then return related tweets
        if (store.get('tweets') == undefined) {

            init_tweets().then(function() {

                tweets = store.get('tweets')
                related_tweetsIds = store.get('related_tweets')[tweet.insultee]

                related_tweets = []

                for (var i in related_tweetsIds) {
                    if (related_tweetsIds[i] == tweet.tweet_id) continue
                    related_tweets.push(tweets[related_tweetsIds[i]])
                }

                resolve(related_tweets)
            })
        }
        // fetch from local storage and create related tweet array and return
        else {
            tweets = store.get('tweets')
            related_tweetsIds = store.get('related_tweets')[tweet.insultee]

            related_tweets = []

            for (var i in related_tweetsIds) {
                if (related_tweetsIds[i] == tweet.tweet_id) continue
                related_tweets.push(tweets[related_tweetsIds[i]])
            }

            resolve(related_tweets)
        }
    })
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
	console.log('no local storage found, initializing tweets!')
	return new Promise(function (resolve, reject) {

		// fetch new from twitter and initialize tweets

		// Read insult tweets as JSON from the file's GitHub URL
		var JSON_URL = 'https://raw.githubusercontent.com/laurenzhang/trump-tweets/master/json/insult_tweets.json'

		// read from file
		readFile(JSON_URL).then(function(tweet_file) {

		    // set related tweets
            store.set('related_tweets', tweet_file)

			var tweet_promises = []
			var count = 0

			for (var insultee in tweet_file) {
			    // promise get fetches all tweets for insultee
                promiseObject = get_tweet_batch(insultee, tweet_file[insultee])
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

				// Save to local storage
                store.set('tweets', tweets)

                // Sort the data into the order we want and cache in local storage

				// 1) Most recent sort
                var recent_ordered_keys = Object.keys(tweets).map(function(key) {
                    return key;
                });
                recent_ordered_keys.sort(function(first, second) {
                    return tweets[second].date - tweets[first].date;
                });
                store.set('recent_ordered_keys', recent_ordered_keys)

				// 2) Most Favorites sort
                var fav_ordered_keys = Object.keys(tweets).map(function(key) {
                    return key;
                });
                fav_ordered_keys.sort(function(first, second) {
                    return tweets[second].favorites - tweets[first].favorites;
                });
                store.set('fav_ordered_keys', fav_ordered_keys)


				// 3) Most Retweets sort
                var retweet_ordered_keys = Object.keys(tweets).map(function(key) {
                    return key;
                });
                retweet_ordered_keys.sort(function(first, second) {
                    return tweets[second].retweets - tweets[first].retweets;
                });
                store.set('retweet_ordered_keys', retweet_ordered_keys)

                resolve()
            })

		})
	})
}

/*
 * Utility function for init_tweet to organize tweets into insultees
 * and add related tweets --> NOT USED BECAUSE WE'RE FETCHING TWEETS IN BATCHES (by INSULTEE)
 *
 * @param[in] insultee : String specifying the insultee
 * @param[in] tweetIds : Array of tweeet ids to query under insultee
 *
 * @returns a Promise object which passes the tweets array when done.
 *
 * This function should NOT be touched from the front-end.
 */
/*
function init_tweet_util(insultee, tweetIds) {

    return new Promise(function (resolve, reject) {

        promise_list = []
        for (var i in tweetIds) {
            promiseObject = getTweetJSON(insultee, tweetIds[i])
            promise_list.push(promiseObject)
        }

        Promise.all(promise_list).then(function(tweet_list) {
            for (var i in tweet_list) {
                tweet = tweet_list[i]

                // set related tweet list
                tweet.related_tweets = tweetIds.slice(0)
				tweet.related_tweets.splice(i, 1)
            }

            resolve(tweet_list)
        });
    });

}
*/

/*
 * Reads the initial tweet_json data from a file or url
 *
 * @param[in] file : Name of the file or url string to read from
 *
 * @returns a Promise object which passes the data in a dictionary when done
 *
 */

function readFile(file) {
	return new Promise(function (resolve, reject) {
	    var rawFile = new XMLHttpRequest();
	    rawFile.open("GET", file, true);
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
