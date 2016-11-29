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

function addSearchResults(results) {
  for (var i = 0; i < results.length; i++) {
    if (results[i].id.kind === 'youtube#video') {
      var videoId = results[i].id.videoId
      var date = results[i].snippet.publishedAt
      var title = results[i].snippet.title
      var description = results[i].snippet.description
      var thumbnail = results[i].snippet.thumbnails.medium.url
      var currentResult = new Result(videoId, date, title, description, thumbnail);
      resultsCollection.push(currentResult);
      resultsBuilder(currentResult);
    }
  }
}

function Result(videoId, publishedAt, title, description, thumbUrl) {
  this.videoId = videoId;
  this.publishedAt = publishedAt;
  this.title = title;
  this.description = description;
  this.thumbUrl = thumbUrl;
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
  commentBuilder(videoId);
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

function commentBuilder(videoId) {
  var commentMatches = findMatches(videoId);
  if (commentMatches.length > 0) {
    showExistingComments(videoId, commentMatches);
    console.log(commentMatches);
  }
}


function findMatches(videoId) {
  var matches = [];
  for (var i = 0; i < commentsCollection.length; i++) {
    if (commentsCollection[i].videoId === videoId) {
      matches.push(commentsCollection[i]);
    }
  }
  return matches;
}

function showExistingComments(videoId, commentMatches) {
  var commentsContainer = document.getElementById('comments-container');
  var commentInputDiv = document.createElement('div');
  commentInputDiv.setAttribute('class', videoId);
  var inputBox = document.createElement('input');
  inputBox.setAttribute('id', 'new-comment');
  inputBox.setAttribute('placeholder', "Add a comment...");
  inputBox.setAttribute('type', 'text');
  inputBox.setAttribute('class', 'input-bar');

  var inputBtn = document.createElement('button');
  inputBtn.setAttribute('id', 'commentBtn')
  inputBtn.setAttribute('value', 'comment')
  inputBtn.setAttribute('type', 'text');

  var hr = document.createElement('hr');

  commentInputDiv.appendChild(inputBox)
  commentInputDiv.appendChild(inputBtn);
  commentInputDiv.appendChild(hr);
  commentsContainer.insertBefore(commentInputDiv, commentsContainer.childNodes[0]);

  console.log(commentMatches[0].videoId);


  if (commentMatches.length > 0) {
    for (var i = 0; i < commentMatches.length; i++) {
      var commentThreads = document.getElementById('comment-threads');
      var newLi = document.createElement('li');
      var newHeading = document.createElement('h5');
      var newP = document.createElement('p');
      var commentId = document.createTextNode(commentMatches[i].videoId);
      var commentText = document.createTextNode(commentMatches[i].commentString)
      commentThreads.appendChild(newLi);
      newHeading.appendChild(commentId);
      newP.appendChild(commentText);
      newLi.appendChild(newHeading);
      newLi.appendChild(newP);
    }
  }


  var commentListener = document.getElementById('commentBtn');
  commentListener.addEventListener('click', addComment(commentMatches.videoId), false);
}

function addComment(videoId) {

  // var comment = document.getElementById('new-comment');
  // var commentString = comment.value;
  // var datePosted = getTimeStamp()
  // var currentComment = new Comment(videoId, datePosted, commentString);
  // // add email and a user array
  // commentsCollection.push(currentComment)
  // showComments()
  // console.log(currentComment);

}
//
// function Comment(videoId, datePosted, commentString) {
//   this.videoId = videoId;
//   this.datePosted = datePosted;
//   this.commentString = commentString;
// }



// function getTimeStamp() {
//   var now = new Date();
//   return ((now.getMonth() + 1) + '/' + (now.getDate()) + '/' + now.getFullYear() + " " + now.getHours() + ':' + ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ("0" + now.getSeconds()) : (now.getSeconds())));
// }


var resultsCollection = [];
var commentsCollection = [{videoId: "tntOCGkgt98", datePosted: "2013-12-31T05:21:57.000Z", commentString: "this is the coolest site ever"},
                          {videoId: "htOroIbxiFY", datePosted: "2016-07-08T13:41:40.000Z", commentString: "this is the sickest site ever"},
                          {videoId: "tntOCGkgt98", datePosted: '2013-12-31T05:21:57.000Z', commentString: "this is the baddest site ever"},
                          {videoId: "htOroIbxiFY", datePosted: "2016-07-08T13:41:40.000Z", commentString: "this is the raddest site ever"},
                          {videoId: "G8KpPw303PY", datePosted: "2016-07-08T13:41:40.000Z", commentString: "this is the gnarliest site ever"}];
// var users = [];

var searchListener = document.getElementById('searchbutton');
searchListener.addEventListener('click', searchRequest, false);
