var $container = $('.dropdown-menu'),
    $list = $('.dropdown-menu ul'),
    listItem = $list.find('li');

$(".dropdown .title").click(function() {
    if ($container.height() > 0) {
        closeMenu(this);
    } else {
        openMenu(this);
    }
});

$(".dropdown-menu li").click(function() {
    closeMenu(this);
});

function closeMenu(el) {
    $(el).closest('.dropdown').toggleClass("closed").find(".title").text($(el).text());
    $container.css("height", 0);
    $list.css("top", 0);
}

function openMenu(el) {
    $(el).parent().toggleClass("closed");

    $container.css({
            height: 200
        })
        .mousemove(function(e) {
            var heightDiff = $list.height() / $container.height(),
                offset = $container.offset(),
                relativeY = (e.pageY - offset.top),
                top = relativeY * heightDiff > $list.height() - $container.height() ?
                $list.height() - $container.height() : relativeY * heightDiff;

            $list.css("top", -top);
        });
}

function populateFeed(tweets) {
    $(document).ready(function() {
        for (i in tweets) {
            if (tweets[i] == undefined) {
                continue;
            }
            tweet = tweets[i];
            var feed = document.getElementById("feed");
            
            var a = document.createElement("a");
            a.href = "./detailedTweet.html?tweet_id=" + tweet["tweet_id"];

            // Retrieve tweet ID, content, and date from tweet object
            var div = document.createElement("div");
            div.setAttribute("class", "tweet");
            div.id = tweet["tweet_id"];
            
            // var star = document.createElement("div");
            // star.setAttribute("class", "star-five");

            // TODO: styling for "p4"
            var content = document.createElement("p4");
            content.innerHTML = tweet["tweet_text"];
            var date = document.createElement("p4");
            date.innerHTML = tweet["date"];

            // Add tweet corresponding to tweet_id to feed
            // div.appendChild(star);
            div.appendChild(content);
            div.appendChild(document.createElement("br"));
            div.appendChild(document.createElement("br"));
            div.appendChild(date);
            a.appendChild(div);
            feed.appendChild(a);
        }
    });
}

function searchInsultees(insultee) {
    // TODO
}

// // For testing purposes
// store.clearAll()

// // For testing populateFeed()
// get_insultee_tweets('The Associated Press').then(function(tweets) {
//     console.log(tweets);
//     populateFeed(tweets);
// })

// // HOW TO GET TWEETS
// // ["recent_ordered" | "retweet_ordered" | "fav_ordered"]
// get_tweets('recent_ordered').then(function(tweets) {
//     // tweets: returned list of tweets in recent order
//     console.log('RECENT ORDERED: ')
//     console.log(tweets)

//     get_related_tweets(tweets[0]).then(function(related_tweets) {

//         console.log('RELATED TWEETS OF tweets[0]: ')
//         console.log(related_tweets)
//     })
// })
