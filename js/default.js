var resultsArray = [];

function searchRequest() {
  clearDOM();
  var queryElement = document.getElementById('searchquery')
  var queryString = queryElement.value;
  var url = encodeURI('https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=' + queryString + '&key=AIzaSyCTzbJhZboKUo5J4DX7iMNOTBUXEEIo6pU')
  if (queryString) {
    $.get(url, function(data) {
      console.log(data);
      addSearchResults(data.items);
    });
  }
}

function clearDOM() {
  var ytContainer = document.getElementById('yt-container');
  while (ytContainer.firstChild) {
    ytContainer.removeChild(ytContainer.firstChild);
  }
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
    if (results[i].id.kind === 'youtube#video') {
      var videoId = results[i].id.videoId
      var date = results[i].snippet.publishedAt
      var title = results[i].snippet.title
      var description = results[i].snippet.description
      var thumbnail = results[i].snippet.thumbnails.medium.url
      var currentResult = new ResultConstructor(videoId, date, title, description, thumbnail);
      resultsArray.push(currentResult);
      resultsBuilder(currentResult);
    }
  }
}

function resultsBuilder(currentResult) {
  var resultsList = document.getElementById('results-list');
  var newItem = document.createElement('li');
  newItem.setAttribute('class', 'results-list-item');
  newItem.setAttribute('id', currentResult.videoId);
  var newImg = document.createElement('img');
  newImg.setAttribute('src', currentResult.thumbUrl);
  var newHeading = document.createElement('p');
  newHeading.setAttribute('id', 'results-heading');
  var newP = document.createElement('p');
  newP.setAttribute('id', 'results-description');
  var newHeadingText = document.createTextNode(currentResult.title);
  var newDescription = document.createTextNode(currentResult.description);
  newP.appendChild(newDescription);
  newHeading.appendChild(newHeadingText);
  newItem.appendChild(newImg);
  newItem.appendChild(newHeading);
  newItem.appendChild(newP);
  resultsList.appendChild(newItem);
  addEventListener(currentResult.videoId);
}

function addEventListener(videoId) {
  var playListener = document.getElementById(videoId);
  playListener.addEventListener('click', function() {playVideo(videoId)}, false);
}

function playVideo(videoId) {
  clearDOM()
  var videoUrl = 'https://www.youtube.com/embed/' + videoId + '?enablejsapi=1&fs=1&origin=http://localhost"frameborder="0"'
  playerBuilder(videoUrl);
}

function playerBuilder(videoUrl) {
  var resultsContainer = document.getElementById('yt-container')
  var newIFrame = document.createElement('iframe');
  newIFrame.setAttribute('id', 'yt-player')
  newIFrame.setAttribute('width', '640');
  newIFrame.setAttribute('height', '390');
  newIFrame.setAttribute('src', videoUrl);
  resultsContainer.appendChild(newIFrame);
}


var searchListener = document.getElementById('searchbutton');
searchListener.addEventListener('click', searchRequest, false);
