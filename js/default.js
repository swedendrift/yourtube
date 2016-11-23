


function searchRequest() {
  clearDOM();
  var queryElement = document.getElementById('searchquery')
  var queryString = queryElement.value;
  var url = encodeURI('https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=' + queryString + '&key=AIzaSyCTzbJhZboKUo5J4DX7iMNOTBUXEEIo6pU')
  $.get(url, function(data) {
    console.log(data);
    addSearchResult(data);
  });
}

function clearDOM() {
  var searchElements = document.getElementById('search-list');
  while (searchElements.firstChild) {
    searchElements.removeChild(searchElements.firstChild);
  }
  var echoElements = document.getElementById('alert-echo');
  while (echoElements.firstChild) {
    echoElements.removeChild(echoElements.firstChild);
  }
}

function addSearchResult(videoObjects) {

  for (var i = videoObjects.length; i > 0; i--) {
    // set key obj values to local variables for DOM stuffage
    var videoMatch = {
     videoId: videoObjects[i].items.id.videoid,
     publishedAt: videoObjects[i].items.snippet.publishedAt,
     title: videoObjects[i].items.snippet.title,
     description: videoObjects[i].items.snippet.description,
     thumbnail: videoObjects[i].items.snippet.thumbnails.medium.url
    }

    console.log(videoMatch);

    // var newItem = document.createElement('li');
    // var newImg = document.createElement('img');
    // newImg.setAttribute('src', videoMatch.thumbnail);
    // var newHeading = document.createElement('h3');
    // var newP = document.createElement('p');
    // var newHeadingText = document.createTextNode(videoMatch.title);
    // var newDescription = document.createTextNode(videoMatch.description);
    // newP.appendChild(newDescription);
    // newHeading.appendChild(newHeadingText);
    // newItem.appendChild(newImg);
    // newItem.appendChild(newHeading);
    // newItem.appendChild(newP);
    // var position = document.getElementById('search-list');
    // position.appendChild(newItem);
  }
}

var searchListener = document.getElementById('searchbutton');
searchListener.addEventListener('click', searchRequest, false);
