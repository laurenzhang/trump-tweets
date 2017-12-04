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
      
      try {
        pages = response.query.pages;
        for (var page_id in pages) {
          console.log(title);
          console.log(pages[page_id].thumbnail.source);
          console.log(pages[page_id].extract);
        }
        // TODO: render results on page
      }
      catch(err) {
        console.log('Wiki summary unavailable');
      }      
    }
 });
}
