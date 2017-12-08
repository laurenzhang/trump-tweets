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



/*
EXAMPLE USAGE

get_tweets().then(function(tweets) {

	// tweets: returned list of tweets in recent order
	console.log(tweets)
})*/

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

		// Read insult tweets as JSON from the file's GitHub URL
		// Requires JQuery
		/*
	    $.getJSON("https://raw.githubusercontent.com/laurenzhang/trump-tweets/master/insult_tweets.json", function(json) {
		    console.log(json);
		});
		*/

        readFile('../json/insult_tweets.json').then(function(tweet_file) {

			var tweet_promises = []
			for (var insultee in tweet_file) {
			    // promise get fetches all tweets for insultee
                promiseObject = init_tweet_util(insultee, tweet_file[insultee])
                tweet_promises.push(promiseObject)
			}

            Promise.all(tweet_promises).then(function(listOf_tweet_list) {

                var tweets = {}

                var count = 0

                for (i in listOf_tweet_list) {
                    insultee_tweets = listOf_tweet_list[i]
                    for (j in insultee_tweets) {
                        tweet = insultee_tweets[j]
                        tweets[tweet.tweet_id] = tweet
                    }
                    count += 1
                    if (count == 10) break
                }

                //console.log(roughSizeOfObject(tweets))

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
	})
}

// Util calls get_tweet for insultee and organizes data then
// promise sets list of tweetDicts
function init_tweet_util(insultee, tweetIds) {

    return new Promise(function (resolve, reject) {

        promise_list = []
        for (i in tweetIds) {
            promiseObject = temp_get_tweet(insultee, tweetIds[i])
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

/*
function read_tweetIds_from_file(filename) {
	return new Promise(function (resolve, reject) {
		readFile(filename).then(function(result) {
			resolve(result)
		}).catch(function (err) {
			reject(err)
		});
	});
}*/

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
}