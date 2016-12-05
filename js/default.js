function cleanDOM() {
  clearChildren('yt-container');
  clearChildren('results-list');
  clearChildren('comment-input-container');
  clearChildren('comment-threads');
  var ytDiv = new ElementSeed('div', 'yt-container', 'youtube-player');
  addElement(ytDiv);
  var commentsContainer = document.getElementById('comments-container');
  commentsContainer.classList.add('hidden');
}

function clearChildren(id) {
  var element = document.getElementById(id);
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function addElement(elementSeed) {
  var newElement = document.createElement(elementSeed.elementType);
  newElement.setAttribute('id', elementSeed.elementId);
  newElement.setAttribute('class', elementSeed.classList);
  var parentNode = document.getElementById(elementSeed.parentId);
  parentNode.appendChild(newElement);
}

function ElementSeed(type, parentId, id, classList) {
  this.elementType = type;
  this.parentId = parentId;
  this.elementId = id;
  this.classList = classList;
}

function searchRequest() {
  cleanDOM();
  var queryElement = document.getElementById('searchquery')
  var queryString =  queryElement.value;
  queryCollection.push(queryString);
  var url = encodeURI('https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=' + queryString + '&key=AIzaSyA_2u6-zjkAsPqvNenfF7aBxawdPyBWp_A')
  if (queryString) {
    $.get(url, function(data) {
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
  newImg.setAttribute('data-vid', currentResult.videoId);
  newImg.setAttribute('src', currentResult.thumbUrl);
  var newHeading = document.createElement('p');
  newHeading.setAttribute('data-vid', currentResult.videoId);
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
}

function playVideo(videoId) {
  cleanDOM()
  var videoUrl = 'https://www.youtube.com/embed/' + videoId + '?enablejsapi=1&fs=1&origin=http://localhost"frameborder="0"'
  playerBuilder(videoUrl, videoId);
  comments(videoId)
}

function playerBuilder(videoUrl, videoId) {
  new YT.Player('youtube-player', {
    height: '390',
    width: '640',
    videoId: videoId,
    src: videoUrl,
    events: {
      'onReady': onPlayerReady,
    }
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
}

function comments(videoId) {
  var showComments = document.getElementById('comments-container');
  showComments.classList.remove('hidden');
  commentInputBuilder(videoId);
  findIdMatches(videoId);
}

function commentInputBuilder(videoId) {
  var commentInputContainer = document.getElementById('comment-input-container');
  var commentInputDiv = document.createElement('div');
  commentInputDiv.setAttribute('id', 'comment-input-div');
  commentInputDiv.setAttribute('class', 'row');
  var inputBox = document.createElement('input');
  inputBox.setAttribute('data-videoid', videoId);
  inputBox.setAttribute('class', 'form-control');
  inputBox.setAttribute('id', 'new-comment');
  inputBox.setAttribute('placeholder', 'Add a comment...');
  inputBox.setAttribute('type', 'text');
  commentInputDiv.appendChild(inputBox);
  commentInputContainer.insertBefore(commentInputDiv, commentInputContainer.childNodes[0]);
  var commentListener = document.getElementById('new-comment');
  commentListener.addEventListener('keyup', function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
      event.preventDefault();
      newComment();
      }
  });
}

function findIdMatches(videoId) {
  var matches = [];
  commentsCollection.sort(function (a, b){
    return a.datePosted - b.datePosted;
  })
  for (var i = 0; i < commentsCollection.length; i++) {
    if (commentsCollection[i].videoId === videoId) {
      matches.push(commentsCollection[i]);
      insertComment(commentsCollection[i]);
    }
  }
}

function insertComment(commentMatch) {
  var commentThreads = document.getElementById('comment-threads');
  var commentLi = document.createElement('li');
  var commentHeading = document.createElement('p');
  commentHeading.setAttribute('id', 'comment-heading');
  var commentP = document.createElement('p');
  commentP.setAttribute('id', 'comment-p');
  var commentId = document.createTextNode(moment(commentMatch.datePosted, "YYYYMMDD"));
  var commentText = document.createTextNode(commentMatch.commentString);
  commentHeading.appendChild(commentId);
  commentP.appendChild(commentText);
  commentLi.appendChild(commentHeading);
  commentLi.appendChild(commentP);
  commentThreads.insertBefore(commentLi, commentThreads.childNodes[0]);
}

function newComment() {
  var commentElement = document.getElementById('new-comment');
  var commentString = commentElement.value;
  var inputBox = document.getElementById('new-comment')
  var videoId = inputBox.getAttribute('data-videoid');
  var datePosted = moment().format('YYYYMMDD');
  var comment = {
    commentString: commentString,
    datePosted: datePosted,
    videoId: videoId
  };
  commentsCollection.push(comment);
  insertComment(comment);
  commentElement.value = "";
}

var queryCollection = [];
var commentsCollection = [{videoId: 'tntOCGkgt98', datePosted: '20160907', commentString: 'this is the coolest site ever'},
                          {videoId: 'G8KpPw303PY', datePosted: '20160206', commentString: 'this is the gnarliest site ever'},
                          {videoId: 'htOroIbxiFY', datePosted: '20140601', commentString: 'this is the sickest site ever'},
                          {videoId: 'tntOCGkgt98', datePosted: '20140519', commentString: 'this is the baddest site ever'},
                          {videoId: 'htOroIbxiFY', datePosted: '20131231', commentString: 'this is the raddest site ever'}];

var searchListener = document.getElementById('searchbutton');
searchListener.addEventListener('click', function () {
  event.preventDefault();
  searchRequest();
}, false);

var enterListener = document.getElementById('searchquery');
enterListener.addEventListener('keyup', function(event) {

  if (event.keyCode == 13) {
    event.preventDefault();
    document.getElementById('searchbutton').click();
  }
}, false);

var playerListener = document.getElementById('results-list')
playerListener.addEventListener('click', function(event) {
	if(event.target && event.target.dataset.vid) {
    event.preventDefault()
		playVideo(event.target.dataset.vid), false
	}
});
