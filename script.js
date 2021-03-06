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

// INIT FEED
$(document).ready(function() {

    // // For testing purposes
    // store.clearAll()

    // check if ordered view
    var ddmenu = document.getElementById("indexFilter");
    var order_val = ddmenu.options[ddmenu.selectedIndex].value;
    var order;
    var starred;
    var search;

    // these get set in filter.js

    if (order_val == 2) {
        order = 'fav_ordered'
    } else if (order_val == 3) {
        order = 'retweet_ordered'
    } else {
        order = 'recent_ordered'
    }

    urlParams = parseURLParams(window.location.href)
    if (urlParams != undefined) {
        starred = urlParams['starred']
        search = urlParams['search']
    }

    var orderMenu = document.getElementById("indexFilter");

    // 1) populate by starred
    if (starred != undefined) {
        orderMenu.style.visibility = 'hidden';
        getStarredTweets().then(function(starred_tweets) {
            hide_loader()
            create_starred_message(starred_tweets.length)
            populateFeed(starred_tweets);
        });
    }
    // 2) populate by search
    else if (search != undefined) {
        orderMenu.style.visibility = 'hidden';
        search_tweets(search).then(function (search_tweets) {
            // init text for search
            document.getElementById("SearchBar").value = search
            create_searched_message(search, search_tweets.length)
            hide_loader()
            populateFeed(search_tweets)
        })
    }
    // 3) populate by order
    else {
        // Search orders:
        // ["recent_ordered" | "retweet_ordered" | "fav_ordered"]
        get_tweets(order).then(function(tweets) {
            hide_loader()
            populateFeed(tweets);
        })
    }
})