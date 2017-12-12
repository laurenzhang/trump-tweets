// TODO: integrate w/ the rest of the back-end

function getWikiInfo(title){
  getWikiSummary(title).then(function(response) {
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
      console.log('Error Fetching wiki content!')
      console.log(err);
      wiki_content['error'] = 'Wiki summary unavailable';
    }
    //console.log(wiki_content);
    // TODO: instead of adding these items to wiki_content, add to tweet object
    //  - alternatively, display these results directly
  });
}

function getWikiSummary(title) {
  return new Promise(function (resolve, reject){
    getWikiSuggestion(title).then(function(suggestionResponse) {
      // get the first suggested title from the returned Wiki query
      var suggestedTitle = '';
      if (suggestionResponse.query.search[0]) //match found
        suggestedTitle = suggestionResponse.query.search[0].title;
      else // no matches found
        resolve();
      console.log("Suggested title: " + suggestedTitle);
      $.ajax({
        url: 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=pageimages|extracts&exintro=&redirects&explaintext=',
        data: {
          titles: suggestedTitle,
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
          //console.log(response);
          resolve(response);
        }
      })
    });
  });
}

function getWikiSuggestion(title) {
  return Promise.resolve($.ajax({
    url: 'https://en.wikipedia.org/w/api.php?action=query&list=search&origin=*&format=json',
    data: {
      srlimit: '2',
      srsearch: title,
    },
    error: function(xhr){
         console.log("Error querying for suggestions from Wikipedia query API!");
    },
    success: function(response){
      // If response returned
      if (response){
        //console.log(response);
      }
      else {
        console.log("No response returned from Wikipedia API query.");
      }
    }
  }));
}

/* OLD FUNCTION, USES OPENSEARCH
function getWikiSuggestion(title) {
  return Promise.resolve($.ajax({
    url: 'https://en.wikipedia.org/w/api.php?action=opensearch',
    data: {
      limit: '10',
      search: title,
    },
    dataType: "jsonp",
    complete: function(){
      console.log("url: " + this.url);
    },
    error: function(xhr){
         alert("ERROR");
    },
    success: function(response){
      // If response returned
      if (response){
        console.log(response);
      }
      else {
        console.log("AAAAAH");
      }
    }
  }));
}
*/
