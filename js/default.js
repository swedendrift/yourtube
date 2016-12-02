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
  var commentThreads = document.getElementById('comment-threads');
  while (commentThreads.firstChild) {
    commentThreads.removeChild(commentThreads.firstChild);
  }
  var commentInputContainer = document.getElementById('comment-input-container');
  while (commentInputContainer.firstChild) {
    commentInputContainer.removeChild(commentInputContainer.firstChild);
  }
}

/* THIS STARTS THE SEARCH PROCESS:
    1.  searchRequest
      1.  grab the query input
      2.  for the request url
      3.  request data from youTube
      4.  call addSearchResults

    2.  addSearchResults
      1.  loop through the data and for each results-heading
          1.  construct a new object with selected items from full dataset
          2.  push the record to resultsCollection array
          3.  call resultsBuilder with the individual record

    3. resultsBuilder
      1. Construct the DOM elements for each result record
      2. addpend the elemts as <li> (with img, p and h5) to the results-list <ul>
      3. add a listener for each item (need to refactor as event delagation)
*/

function searchRequest() {
  clearDOM();
  var queryElement = document.getElementById('searchquery')
  var queryString = 'tutu ' + queryElement.value;
  var url = encodeURI('https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=' + queryString + )
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
}

/* THIS STARTS THE PLAYBACK PROCESS:
    1.  addPlayerListener
      1.  listen for a click on the element by videoId
      2.  on a click call the playVideo function passing the target videoId

    2.  playVideo
      1.  clear the DOM
      2.  construct the URL for the embedded video
      3.  call the playerBuilder function passing the videoId
        1.  construct the yourtube iframe player
        2.  set the source to the URL from #2
    3.  Call the comments function passing the videoId to load any existing comments and the comment input info.
*/

function playVideo(videoId) {
  clearDOM()
  var videoUrl = 'https://www.youtube.com/embed/' + videoId + '?enablejsapi=1&fs=1&origin=http://localhost"frameborder="0"'
  playerBuilder(videoUrl);
  comments(videoId)
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

/*
  THIS STARTS THE COMMENTS PROCESS:  THIS HAS CHANGES
    1.  comments
      1.  call the commentInputBuilder to construct the input box and btn for new comments
        1.  call addCommentListener passing the videoId to listen for new comments btn click
        2.  on a click addCommentListener will call newComment passing the videoId ##2()
      2.  call the findIdMatches passing the videoId
        1.  loop though the commentsCollection, pushing hits on the videoId to the matches array
        2.  call insertComment passing the matching object one at a time to contruct the DOM elements and attach them to the comment-threads <ul>
    2.  when the addCommentListener is clicked it invokes newComment passing the videoId
*/

function comments(videoId) {
  commentInputBuilder(videoId);
  findIdMatches(videoId);
}

function commentInputBuilder(videoId) {
  var commentsContainer = document.getElementById('comment-input-container');
  var commentInputDiv = document.createElement('div');
  commentInputDiv.setAttribute('id', 'comment-input-div');
  var inputBox = document.createElement('input');
  inputBox.setAttribute('id', 'new-comment');
  inputBox.setAttribute('placeholder', 'Add a comment...');
  inputBox.setAttribute('type', 'text');
  var inputBtn = document.createElement('input');
  inputBtn.setAttribute('id', 'comment-btn');
  inputBtn.setAttribute('data-videoid', videoId);
  inputBtn.setAttribute('value', 'comment');
  inputBtn.setAttribute('type', 'button');
  var hr = document.createElement('hr');
  commentInputDiv.appendChild(inputBox);
  commentInputDiv.appendChild(inputBtn);
  commentInputDiv.appendChild(hr);
  commentsContainer.insertBefore(commentInputDiv, commentsContainer.childNodes[0]);
  var commentListener = document.getElementById('comment-btn');
  commentListener.addEventListener('click', function() {
    event.preventDefault()
    newComment()
    , false
  });
}

function findIdMatches(videoId) {
  var matches = [];
  for (var i = 0; i < commentsCollection.length; i++) {
    if (commentsCollection[i].videoId === videoId) {
      matches.push(commentsCollection[i]);
      insertComment(commentsCollection[i]);
    }
  }
}

function insertComment(commentMatch) {
  var commentThreads = document.getElementById('comment-threads');
  var newLi = document.createElement('li');
  var newHeading = document.createElement('h5');
  var newP = document.createElement('p');
  var commentId = document.createTextNode(moment(commentMatch.datePosted, "YYYYMMDD"));
  var commentText = document.createTextNode(commentMatch.commentString);
  newHeading.appendChild(commentId);
  newP.appendChild(commentText);
  newLi.appendChild(newHeading);
  newLi.appendChild(newP);
  commentThreads.insertBefore(newLi, commentThreads.childNodes[0]);
}

function newComment() {
  var commentElement = document.getElementById('new-comment');
  var commentString = commentElement.value;
  var commentBtn = document.getElementById('comment-btn');
  var videoId = commentBtn.getAttribute('data-videoid');
  // var timestamp = Date.now();
  var datePosted = moment().format('YYYYMMDD');
  var comment = {
    commentString: commentString,
    datePosted: datePosted,
    videoId: videoId
  };
  commentsCollection.push(comment);
  insertComment(comment);
}

var resultsCollection = [];
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

document.getElementById('results-list').addEventListener('click', function(e) {
	if(e.target && e.target.nodeName == 'LI') {
    event.preventDefault()
		playVideo(e.target.id), false
	}
});
