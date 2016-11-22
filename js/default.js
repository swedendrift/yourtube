//create an array of objects to represent the videos (pictures right atm)
var videos = [{title: "Surf", videographer: "Mowgly Lee", description: 'Nulla facilisi. Sed vel erat ut augue surf surfing vel eu nibh. Pellentesque pellentesque dolor felis, at iaculis sem blandit non. Aenean ut ipsum id ex laoreet finibus a ut.', url: "imgs/surf.jpg"},
              {title: "Beer Pong", videographer: "Tin Dein", description: 'Nulla facilisi. Sed vel drunk ut augue beer pong party vel eu nibh. Pellentesque pellentesque dolor felis, at iaculis sem blandit non. Aenean ut ipsum id ex laoreet finibus a ut.', url: "imgs/beerPong.jpg"},
              {title: "Nascar", videographer: "Robert Denton", description: 'Nulla facilisi. Sed vel car ut augue nascar elementum vel eu crash. Pellentesque pellentesque dolor felis, at iaculis sem blandit non. Aenean ut ipsum id ex laoreet finibus a ut.', url: "imgs/nascar.jpg"},
              {title: "Volleyball", videographer: "Bruce Chindo", description: 'Nulla volleyball vel erat ut augue volley ball elementum vel eu nibh. Pellentesque pellentesque dolor felis, at iaculis sem blandit non. Aenean ut ipsum id ex laoreet finibus a ut.', url: "imgs/volleyball.jpg"},
              {title: "Surf", videographer: "Chris Clark", description: 'Nulla facilisi. Sed vel surf ut augue sollicitudin elementum vel surfing. Pellentesque pellentesque dolor felis, at iaculis sem blandit non. Aenean ut ipsum id ex laoreet finibus a ut.', url: "imgs/surf2.jpg"}];


// function to add new video results to the page
function addNewItem() {

  //create a new li, img, h3 and paragraph elements
  var newItem = document.createElement('li');
  var newImg = document.createElement('img');
  newImg.setAttribute('src', 'imgs/beerPong.jpg');
  var newHeading = document.createElement('h3');
  var newP = document.createElement('p');

  // create new text nodes
  var newHeadingText = document.createTextNode(videos[0].title);
  var newDescription = document.createTextNode(videos[0].description);

  // attach the text nodes and elements to their parent elements
  newP.appendChild(newDescription);
  newHeading.appendChild(newHeadingText);
  newItem.appendChild(newImg);
  newItem.appendChild(newHeading);
  newItem.appendChild(newP);
  var position = document.getElementById('searchlist');
  position.appendChild(newItem);
}

// function to search videos for words
function videoSearch() {
  var query = document.getElementById('searchquery');
  var newh4 = document.createElement('h4');
  var querytext = document.createTextNode(query.value);
  newh4.appendChild(querytext);

  var position = document.getElementById('queryecho');
  position.appendChild(newh4);
  addNewItem()
}

var searchListener = document.getElementById('searchbutton');
searchListener.addEventListener('click', videoSearch, false);

// <li>
//   <img src="imgs/surf.jpg" />
//   <h3>Headline</h3>
//   <p>Nulla facilisi. Sed vel erat ut augue sollicitudin elementum vel eu nibh. Pellentesque pellentesque dolor felis, at iaculis sem blandit non. Aenean ut ipsum id ex laoreet finibus a ut.</p>
// </li>
