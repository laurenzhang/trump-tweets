$(document).ready(function() {
    directory_items = document.getElementsByClassName("directoryitem");
    for (i in directory_items) {
        directory_items[i].onclick = function() {
            location.href = "./search.html?insultee=" + $(this).text();
        };
    }
});
