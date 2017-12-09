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

$(document).ready(function() {
    directory_items = document.getElementsByClassName("directoryitem");
    for (i in directory_items) {
        directory_items[i].onclick = function() {
            $(this).queue(function() {
                location.href = "./index.html";
            });
            $(this).queue(function() {
                console.log("hey");
            });
            $(this).dequeue();
            $(this).dequeue();
        };
    }
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
    for (i in tweets) {
        tweet = tweets[i];
        var table = document.getElementById("table");
        table.style.visibility = "visible";

        var tr = document.createElement("tr");
        var td = document.createElement("td");
        
        // Retrieve tweet ID, content, and date from tweet object
        var div = document.createElement("div");
        div.style = "margin-top:30px;clear: both ";
        div.setAttribute("class", "tweet");
        div.id = tweet["tweet_id"];
        // TODO: styling for "p4"
        var content = document.createElement("p4");
        content.innerHTML = tweet["tweet_text"];
        var date = document.createElement("p4");
        date.innerHTML = tweet["date"];

        // Add tweet corresponding to tweet_id to feed
        div.appendChild(content);
        div.appendChild(date);
        td.appendChild(div);
        tr.appendChild(td);
        table.appendChild(tr);
    }
}

function searchInsultees(insultee) {
    // TODO
}

// For testing purposes
// store.clearAll()

// // For testing populateFeed()
// get_insultee_tweets('The Associated Press').then(function(tweets) {
//     console.log(tweets);
//     populateFeed(tweets);
// })

// HOW TO GET TWEETS
// ["recent_ordered" | "retweet_ordered" | "fav_ordered"]
get_tweets('recent_ordered').then(function(tweets) {
    // tweets: returned list of tweets in recent order
    console.log('RECENT ORDERED: ')
    console.log(tweets)

    get_related_tweets(tweets[0]).then(function(related_tweets) {

        console.log('RELATED TWEETS OF tweets[0]: ')
        console.log(related_tweets)
    })
})
