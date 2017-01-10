/* Global variables */

const API_KEY = 'AIzaSyA8kjmQJSIFArR2oGJQeN0fyEdY320Y8dM'
const PG_KNEX = 'http://localhost:3029/comments'

/* functions for cleaning the DOM between queries */

function cleanDOM() {
  clearChildren('yt-container')
  clearChildren('side-panel')
  clearChildren('results-panel')
  clearChildren('comment-input-container')
  clearChildren('comment-threads')
  clearChildren('card-deck-wrapper')
  ytBuilder()

  const results = document.getElementById('results-panel')
  results.classList.remove('hidden')
  const hideComments = document.getElementById('comments-container')
  hideComments.classList.add('hidden')
  const wrapper = document.getElementById('card-deck-wrapper')
  wrapper.classList.add('hidden')
  const player = document.getElementById('yt-container')
  player.classList.add('hidden')
}

function clearChildren(id) {
  const element = document.getElementById(id)
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

function search(query) {
  const url = urlBuilder(query)
  return fetch(url).then((response) => {
    return response.json()
  }).catch(function(error) {
    alert(`There was an error with your request: ${error}`)
  })
}

function urlBuilder(query) {
  const url = encodeURI(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=14&q=${query}&key=${API_KEY}`)
  return url
}

function addResults(results) {
  const myResults = []
  for (let i = 0; i < results.length; i++) {
    if (results[i].id.kind === 'youtube#video') {
      const videoId = results[i].id.videoId
      const date = results[i].snippet.publishedAt
      const title = results[i].snippet.title
      const description = results[i].snippet.description
      const medThumbnail = results[i].snippet.thumbnails.medium.url
      const thumbnail = results[i].snippet.thumbnails.default.url
      const currentResult = new Result(videoId, date, title, description, thumbnail, medThumbnail)
      myResults.push(currentResult)
    }
  }
  return myResults
}

function Result(videoId, publishedAt, title, description, thumbnail, medThumbnail) {
  this.videoId = videoId
  this.publishedAt = publishedAt
  this.title = title
  this.description = description
  this.thumbnail = thumbnail
  this.medThumbnail = medThumbnail
}

function createElement(tagName, attributes, children) {
  const element = document.createElement(tagName)
  for (let key in attributes) {
    element.setAttribute(key, attributes[key])
  }
  for (var i = 0; i < children.length; i++) {
    let child = children[i]
    if (child instanceof Element) {
      element.appendChild(child)
    }
    else {
      element.appendChild(document.createTextNode(child))
    }
  }
  return element
}

function cardDeckBuilder (results) {
  if (results.length > 0) {
    const deckOne = results.slice(0, 4)
    addCards(deckOne)
    const deckTwo = results.slice(4, 8)
    addCards(deckTwo)
    if (results.slice(8).length > 3) {
      const deckThree = results.slice(8, 12)
      addCards(deckThree)
    } else if (results.slice(8).length < 3) {
      const deckThree = results.slice(8)
      addCards(deckThree)
    }
  }
}

function addCards(deck) {
  const cardDeck = createElement('div', { class: 'card-deck' },[])
  for (let i = 0; i < deck.length; i++) {
    const cardItem =
        createElement('div', { class: 'card deck-cards' },[
          createElement('img', { 'data-vid': deck[i].videoId, class: 'card-img-top card-dimensions ', src: deck[i].medThumbnail}, []),
          createElement('div', { class: 'card-block card-dimensions' }, [
            createElement('h6', { 'data-vid': deck[i].videoId, class: 'card-title' }, [deck[i].title]),
          ]),
        ])
    cardDeck.appendChild(cardItem)
  }
  const wrapper = document.getElementById('card-deck-wrapper')
  wrapper.appendChild(cardDeck)
}

function resultsBuilder(results) {
  const resultsPanel = document.getElementById('results-panel')
  const list = createElement('ul', { class: 'list-group', id: 'results-list' }, [])

  for (let i = 0; i < results.length; i++) {
    const resultItem =
          createElement('li', { class: 'results-list-item', id: results[i].videoId }, [
            createElement('img', { 'data-vid': results[i].videoId, src: results[i].medThumbnail }, []),
            createElement('p', { 'data-vid': results[i].videoId, id: 'results-heading' }, [results[i].title]),
            createElement('p', { 'data-vid': results[i].videoId, id: 'results-description' }, [results[i].description])
        ])
    list.appendChild(resultItem)
  }
  resultsPanel.appendChild(list)
}

function sideBuilder (results) {
  const side = document.getElementById('side-panel')
  const list = createElement('ul', { class: 'list-group', id: 'side-list' }, [])


  for (let i = 0; i < results.length; i++) {
    var sideItem =
          createElement('a', { class: 'list-group-item list-group-item-action', id: results[i].videoId }, [
            createElement('img', { class: 'd-inline-block', 'data-vid': results[i].videoId, src: results[i].thumbnail },[]),
            createElement('p', { class: 'd-inline-block', 'data-vid': results[i].videoId, id: 'side-title' }, [results[i].title])
        ])
    list.appendChild(sideItem)
  }

  side.appendChild(list)
  const unhideSide = document.getElementById('side-panel')
  unhideSide.classList.remove('hidden')
}

function ytBuilder () {
  const ytDiv = createElement('div', { id: 'youtube-player' }, [])
  const ytContainer = document.getElementById('yt-container')
  ytContainer.appendChild(ytDiv)
}

function playerBuilder(videoUrl, videoId) {
  const player = document.getElementById('yt-container')
  player.classList.remove('hidden')
  new YT.Player('youtube-player', {
    height: '390',
    width: '640',
    videoId: videoId,
    src: videoUrl,
    events: {
      'onReady': onPlayerReady,
    }
  })
}

function onPlayerReady(event) {
  event.target.playVideo()
}

function playVideo(videoId) {
  cleanDOM()
  const videoUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&fs=1&origin=http://localhost"frameborder="0"`
  const results = document.getElementById('results-panel')
  results.classList.add('hidden')
  playerBuilder(videoUrl, videoId)
  sideSearch()
  comments(videoId)
}

function sideSearch() {
  const sidebarQuery = queryCollection[Math.floor(Math.random() * queryCollection.length)]
  const thenable = search(sidebarQuery)
  thenable.then((response) => {
    const formattedResults = addResults(response.items)
    sideBuilder(formattedResults)
  })
}

/* this begins the commenting section */

function comments(videoId) {
  const showComments = document.getElementById('comments-container')
  showComments.classList.remove('hidden')
  commentInputBuilder(videoId)
  searchComments(videoId)
}

function commentInputBuilder(videoId) {
  const commentInputContainer = document.getElementById('comment-input-container')
  const commentInputDiv = document.createElement('div')
  commentInputDiv.setAttribute('id', 'comment-input-div')
  commentInputDiv.setAttribute('width', '100%')
  const inputBox = document.createElement('input')
  inputBox.setAttribute('data-videoid', videoId)
  inputBox.setAttribute('class', 'form-control center-block')
  inputBox.setAttribute('id', 'new-comment')
  inputBox.setAttribute('placeholder', 'Add a comment...')
  inputBox.setAttribute('type', 'search')
  commentInputDiv.appendChild(inputBox)
  commentInputContainer.insertBefore(commentInputDiv, commentInputContainer.childNodes[0])
  const commentListener = document.getElementById('new-comment')
  commentListener.addEventListener('keyup', (event) => {
    event.preventDefault()
    if (event.keyCode == 13) {
      event.preventDefault()
      newComment()
      }
  })
}

function searchComments(videoId) {
  const url = `${PG_KNEX}/${videoId}`
  fetch(url).then((response) => {
    return response.json().then((json) => {
      for(let i = 0; i < json.length; i++) {
        insertComment(json[i])
      }
    })
  }).catch((error) => {
    alert(`There was an error with your request: ${error}`)
  })
}

function insertComment(commentMatch) {
  const commentThreads = document.getElementById('comment-threads')
  const commentLi = document.createElement('li')
  const commentHeading = document.createElement('p')
  commentHeading.setAttribute('id', 'comment-heading')
  const commentP = document.createElement('p')
  commentP.setAttribute('id', 'comment-p')
  const commentId = document.createTextNode(moment(commentMatch.dateposted, "YYYYMMDD"))
  const commentText = document.createTextNode(commentMatch.commentstring)
  commentHeading.appendChild(commentId)
  commentP.appendChild(commentText)
  commentLi.appendChild(commentHeading)
  commentLi.appendChild(commentP)
  commentThreads.insertBefore(commentLi, commentThreads.childNodes[0])
}

function newComment() {
  // const commentElement = document.getElementById('new-comment').value
  const inputBox = document.getElementById('new-comment')
  const commentString = inputBox.value
  const videoId = inputBox.getAttribute('data-videoid')
  const datePosted = moment().format('YYYYMMDD')
  const comment = {
    commentstring: commentString,
    dateposted: datePosted,
    videoid: videoId
  }
  const newComment = JSON.stringify(comment)
  const request = new Request(`${PG_KNEX}`, {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: newComment
  })

  fetch(request).then((data) => {
    console.log(data)
  })

  insertComment(comment)
  inputBox.value = ""
}

const queryCollection = ['cats', 'surfing', 'birds', 'chet atkins', 'hadoop', 'aws', 'ancient alients', 'conspiracies']

const thenable = search('the best of 2016')
thenable.then((response) => {
  const formattedResults = addResults(response.items)
  cardDeckBuilder(formattedResults)
})

const formListener = document.getElementById('search-div')
formListener.addEventListener('submit', (event)  => {
  event.preventDefault()
  cleanDOM()
  const queryElement = document.getElementById('searchquery')
  const queryString = queryElement.value
  const thenable = search(queryString)
  thenable.then((response) => {
    const formattedResults = addResults(response.items)
    resultsBuilder(formattedResults)
  })
  sideSearch()
}, false)

document.body.addEventListener('click', (event)  => {
	if(event.target && event.target.dataset.vid) {
    event.preventDefault()
		playVideo(event.target.dataset.vid), false
	}
})
