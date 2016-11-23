var videos = [{title: "surf", videographer: "Mowgly Lee", description: 'Nulla facilisi. Sed vel erat ut augue surf surfing vel eu nibh. Pellentesque pellentesque dolor felis, at iaculis sem blandit non. Aenean ut ipsum id ex laoreet finibus a ut.', url: "imgs/surf.jpg"},
{title: "beer pong", videographer: "Tin Dein", description: 'Nulla facilisi. Sed vel drunk ut augue beer pong party vel eu nibh. Pellentesque nascar dolor felis, at iaculis sem blandit non. Aenean ut ipsum id ex laoreet finibus a ut.', url: "imgs/beerPong.jpg"},
{title: "nascar", videographer: "Robert Denton", description: 'Nulla facilisi. Sed vel car ut augue nascar elementum vel eu crash. Pellentesque pellentesque dolor felis, at iaculis sem blandit non. Aenean ut ipsum id ex laoreet finibus a ut.', url: "imgs/nascar.jpg"},
{title: "volleyball", videographer: "Bruce Chindo", description: 'Nulla volleyball vel erat ut augue volley ball elementum vel eu nibh. Pellentesque pellentesque dolor felis, at iaculis sem blandit non. Aenean ut ipsum id ex laoreet finibus a ut.', url: "imgs/volleyball.jpg"},
{title: "surf", videographer: "Chris Clark", description: 'Nulla facilisi. Sed vel surf ut augue sollicitudin elementum vel surfing. Pellentesque drunk dolor felis, at iaculis sem blandit non. Aenean ut ipsum id ex laoreet finibus a ut.', url: "imgs/surf2.jpg"},
{title: "nascar", videographer: "Robert Denton", description: 'Nulla facilisi. Sed vel car ut augue nascar elementum vel eu crash. Pellentesque pellentesque dolor felis, at iaculis sem surf non. Aenean ut ipsum id ex laoreet finibus a ut.', url: "imgs/nascar.jpg"},];

function addSearchResult(videoObject) {
  var newItem = document.createElement('li');
  var newImg = document.createElement('img');
  newImg.setAttribute('src', videoObject.url);
  var newHeading = document.createElement('h3');
  var newP = document.createElement('p');
  var newHeadingText = document.createTextNode(videoObject.title);
  var newDescription = document.createTextNode(videoObject.description);
  newP.appendChild(newDescription);
  newHeading.appendChild(newHeadingText);
  newItem.appendChild(newImg);
  newItem.appendChild(newHeading);
  newItem.appendChild(newP);
  var position = document.getElementById('searchlist');
  position.appendChild(newItem);
}

function videoSearch() {
  clearDOM();
  // show the search query under the search box
  var query = document.getElementById('searchquery');
  var newh2 = document.createElement('h2');
  var querytext = document.createTextNode(query.value);
  newh2.appendChild(querytext);
  var position = document.getElementById('queryecho');
  position.appendChild(newh2);
  // loop through the array placing content as its found
  for (var i = 0; i < videos.length; i++) {
    var searchText = query.value;
    var itemText = videos[i].title + videos[i].description;
    var match = itemText.toLowerCase().indexOf(searchText.toLowerCase()) > -1
    if (searchText !== "" && match) {
      addSearchResult(videos[i]);
    }
  }
}

function clearDOM() {
  var searchElements = document.getElementById('searchlist');
  while (searchElements.firstChild) {
    searchElements.removeChild(searchElements.firstChild);
  }
  var echoElements = document.getElementById('queryecho');
  while (echoElements.firstChild) {
    echoElements.removeChild(echoElements.firstChild);
  }
}

var searchListener = document.getElementById('searchbutton');
searchListener.addEventListener('click', videoSearch, false);
