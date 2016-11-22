//create an array of objects to represent the videos (pictures right now)
var videos = [{title: "Surfing", videographer: "Mowgly Lee", descriptoin: 'Nulla facilisi. Sed vel erat ut augue sollicitudin elementum vel eu nibh. Pellentesque pellentesque dolor felis, at iaculis sem blandit non. Aenean ut ipsum id ex laoreet finibus a ut.', url: "imgs/surf.jpg"},
              {title: "Beer Pong", videographer: "Tin Dein", descriptoin: 'Nulla facilisi. Sed vel erat ut augue sollicitudin elementum vel eu nibh. Pellentesque pellentesque dolor felis, at iaculis sem blandit non. Aenean ut ipsum id ex laoreet finibus a ut.', url: "imgs/beerPong.jpg"},
              {title: "Nascar", videographer: "Robert Denton", descriptoin: 'Nulla facilisi. Sed vel erat ut augue sollicitudin elementum vel eu nibh. Pellentesque pellentesque dolor felis, at iaculis sem blandit non. Aenean ut ipsum id ex laoreet finibus a ut.', url: "imgs/nascar.jpg"},
              {title: "Volleyball", videographer: "Bruce Chindo", descriptoin: 'Nulla facilisi. Sed vel erat ut augue sollicitudin elementum vel eu nibh. Pellentesque pellentesque dolor felis, at iaculis sem blandit non. Aenean ut ipsum id ex laoreet finibus a ut.', url: "imgs/volleyball.jpg"},
              {title: "Surf", videographer: "Chris Clark", descriptoin: 'Nulla facilisi. Sed vel erat ut augue sollicitudin elementum vel eu nibh. Pellentesque pellentesque dolor felis, at iaculis sem blandit non. Aenean ut ipsum id ex laoreet finibus a ut.', url: "imgs/surf2.jpg"}];



function addNewItem() {
    var newItem = document.createElement('li');
    var newImg = document.createElement('img');
      newImg.setAttribute('src', 'imgs/beerPong.jpg');
    var newText = document.createTextNode(videos[0].title);
    newItem.appendChild(newImg);
    newItem.appendChild(newText);

    var position = document.getElementById('searchList');
    position.appendChild(newItem);
}

var searchListener = document.getElementById('searchButton');

searchListener.addEventListener('click', addNewItem, false);

// <li>
//   <img src="imgs/surf.jpg" />
//   <h3>Headline</h3>
//   <p>Nulla facilisi. Sed vel erat ut augue sollicitudin elementum vel eu nibh. Pellentesque pellentesque dolor felis, at iaculis sem blandit non. Aenean ut ipsum id ex laoreet finibus a ut.</p>
// </li>
