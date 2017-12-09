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

function populateFeed(tweet_ids) {
    for (i in tweet_ids) {
        // Add tweet corresponding to tweet_id to feed
        var table = document.getElementById("table");
        table.style.visibility = "visible";

        var tr = document.createElement("tr");
        var td = document.createElement("td");
        var div = document.createElement("div");
        div.style = "margin-top:30px;clear: both ";
        div.setAttribute("class", "tweet");
        div.id = tweet_ids[i];
        // TODO: styling for "p4"
        // TODO: get Content, and Date
        var content = document.createElement("p4");
        content.innerHTML = "Content"
        var date = document.createElement("p4");
        date.innerHTML = "Date"

        div.appendChild(content);
        div.appendChild(date);
        td.appendChild(div);
        tr.appendChild(td);
        table.appendChild(tr);
    }
}

// For testing purposes
store.clearAll()

// HOW TO GET TWEETS
// ["recent_ordered" | "retweet_ordered" | "fav_ordered"]
get_tweets('recent_ordered').then(function(tweets) {
    ///
    populateFeed(["668827020718161920", "668255569996853248", "668827139232423936"])
    ///

    // tweets: returned list of tweets in recent order
    console.log('RECENT ORDERED: ')
    console.log(tweets)

    get_related_tweets(tweets[0]).then(function(related_tweets) {

        console.log('RELATED TWEETS OF tweets[0]: ')
        console.log(related_tweets)
    })
})
