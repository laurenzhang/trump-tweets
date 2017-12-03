function getWikiSummary(title){
 $.ajax({
    url: 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=pageimages|extracts&exintro=&explaintext=',
    data: {
      titles: title,
      // A good example:
      // titles: 'Hillary Clinton',
      exlimit: 2,
      pithumbsize: 500,
      pilimit: 2
    },
    jsonp: 'callback',
    dataType: 'jsonp',
    xhrFields: {
      withCredentials: true
    },
    success: function(response){
      console.log(response);
      pages = response.query.pages;
      for (var page_id in pages) {
        console.log(title);
        console.log(pages[page_id].extract);
        console.log(pages[page_id].thumbnail.source);
      }
     // TODO: render results on page
    }
 });
}
