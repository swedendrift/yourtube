function searchRequest() {
  clearDOM();
  var queryElement = document.getElementById('searchquery')
  var queryString = queryElement.value;
  var url = encodeURI('https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=' + queryString + '&key=AIzaSyCTzbJhZboKUo5J4DX7iMNOTBUXEEIo6pU')
  if (queryString) {
    $.get(url, function(data) {
      addSearchResults(data.items);
    });
  }
}

function clearDOM() {
  var searchElements = document.getElementById('results-list');
  while (searchElements.firstChild) {
    searchElements.removeChild(searchElements.firstChild);
  }
  var echoElements = document.getElementById('alert-echo');
  while (echoElements.firstChild) {
    echoElements.removeChild(echoElements.firstChild);
  }
}

function ResultConstructor(videoId, publishedAt, title, description, thumbUrl) {
  this.videoId = videoId;
  this.publishedAt = publishedAt;
  this.title = title;
  this.description = description;
  this.thumbUrl = thumbUrl;
}

function addSearchResults(results) {
  for (var i = 0; i < results.length; i++) {
    if (results[i].id.kind === "youtube#video") {
      var id = results[i].id.videoId
      var date = results[i].snippet.publishedAt
      var title = results[i].snippet.title
      var description = results[i].snippet.description
      var thumbnail = results[i].snippet.thumbnails.medium.url
      var currentResult = new ResultConstructor(id, date, title, description, thumbnail);
      htmlBuilder(currentResult);
    }
  }
}

function htmlBuilder(currentResult) {
  var resultsList = document.getElementById('results-list');
  var newItem = document.createElement('li');
  var newImg = document.createElement('img');
  newImg.setAttribute('src', currentResult.thumbUrl);
  var newHeading = document.createElement('p');
  newHeading.setAttribute('id', "results-heading");
  var newP = document.createElement('p');
  newP.setAttribute('id', "results-description");
  var newHeadingText = document.createTextNode(currentResult.title);
  var newDescription = document.createTextNode(currentResult.description);
  newP.appendChild(newDescription);
  newHeading.appendChild(newHeadingText);
  newItem.appendChild(newImg);
  newItem.appendChild(newHeading);
  newItem.appendChild(newP);
  resultsList.appendChild(newItem);
}

var searchListener = document.getElementById('searchbutton');
searchListener.addEventListener('click', searchRequest, false);
