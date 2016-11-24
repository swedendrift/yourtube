function searchRequest() {
  // clearDOM();
  var queryElement = document.getElementById('searchquery')
  var queryString = queryElement.value;
  var url = encodeURI('https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=' + queryString + '&key=AIzaSyCTzbJhZboKUo5J4DX7iMNOTBUXEEIo6pU')
  $.get(url, function(data) {
    addSearchResult(data.items);
  });
}

// function clearDOM() {
//   var searchElements = document.getElementById('search-list');
//   while (searchElements.firstChild) {
//     searchElements.removeChild(searchElements.firstChild);
//   }
//   var echoElements = document.getElementById('alert-echo');
//   while (echoElements.firstChild) {
//     echoElements.removeChild(echoElements.firstChild);
//   }
// }

function addSearchResult(results) {
  console.log(results);
  var i = 0;
  // for (i = results.length: i > 0; i--) {
    var videoId = results[i].id.videoId
    var publishedAt = results[i].snippet.publishedAt
    var title = results[i].snippet.title
    var description = results[i].snippet.description
    var thumbnail = results[i].snippet.thumbnails.medium.url
  // }
  //would be better to loop through and push into an array for later display
  console.log(videoId);
  console.log(thumbnail);




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
  // }
}

var searchListener = document.getElementById('searchbutton');
searchListener.addEventListener('click', searchRequest, false);
