#yourtube


note regarding google API error when running on a local machine:

It seems that the onload parameter will never run the specified function (at least in Chrome) when you load the Google API client.js from a local file (even though you are serving the HTML page via a webserver and not loading it from the file-system, which apparently seemed to be the only gotcha with the Google API JS client...).

e.g.: <script src="/lib/js/client.js?onload=handleClientLoad"></script>. Although client.js will be loaded, this will never launch the handleClientLoad function when it's finished loading.
