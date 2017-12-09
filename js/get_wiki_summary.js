// TODO: integrate w/ the rest of the back-end
getWikiSummary('Hillary Clinton').then(function(response) {
  var wiki_content = {};
  try {
    pages = response.query.pages;

    for (var page_id in pages) {
      // Link to article image
      wiki_content['img_url'] = pages[page_id].thumbnail.source;
      // Article summary (text before the "Contents" section)
      wiki_content['summary'] = pages[page_id].extract;
    }
  }
  catch(err) {
    console.log(err);
    wiki_content['error'] = 'Wiki summary unavailable';
  }
  console.log(wiki_content);
  // TODO: instead of adding these items to wiki_content, add to tweet object
  //  - alternatively, display these results directly
});

function getWikiSummary(title) {
  return Promise.resolve($.ajax({
    url: 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=pageimages|extracts&exintro=&explaintext=',
    data: {
      titles: title,
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
    }
  }));
}
