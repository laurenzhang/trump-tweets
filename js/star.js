$(document).ready(function() {
    starred_tweets = document.getElementsByClassName("starred");
    for (i in starred_tweets) {
        starred_tweets[i].onclick = function() {
            if (!e) e = window.event;
            e.stopPropagation();

            starTweet($this.id);
            console.log($this.id);
        };
    }
});