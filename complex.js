// Scroll to the bottom of the page first, so all the React stuff loads
// Always check the last song name to make sure everything got scraped

//
// Step 1: get source data
//

  chartTitle = document.getElementsByClassName("story-title story-title__article")[0].innerText;
  parentStream = chartTitle.match(/.+?(?=:)/)[0];
  instanceName = chartTitle.match(/[^:]+$/)[0].trim();

  // add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // get and format publicationDate
  publicationDate = document.getElementsByClassName("info-row__datetime")[0].innerHTML.trim();
  publicationDateFormatted = moment(publicationDate, "MMM DD, YYYY").format(); // to ISO

  // build the object
  source = { // a streamInstance
    "parentEntity": "Complex",
    "parentStream": parentStream,
    "instanceName": instanceName,
    "publicationDate": publicationDateFormatted,
    "location": window.location.href,
  };

  JSON.stringify(source, null, 4)


//
// Step 2: get songs data
//

  sourceId = "5eb22b188e1f3aed7d986b50" // update with source ID

  elements = document.getElementsByClassName("article__copy clearfix");
  element = elements[0].getElementsByTagName("h3"); // sometimes h2 or h3
  videoUrl = document.getElementsByClassName("custom-embed")

  songs = [];

  for (var i=0; i<element.length; i++){
    merged = element[i].innerText;
    songName = merged.match(/, “(.*?)”/)[1]; // may need " type quotation marks, or a comma after the artist name, or may have an &nbsp; instead of a space
    artistName = merged.match(/.+?(?=, “)/)[0]; // may need " type quotation marks
    videoId = videoUrl[i].getElementsByTagName("iframe")[0].src.match(/embed\/([^"]{0,})/)[1]; // example: https://www.youtube.com/embed/nGXCuAHEjYI

    song = {
      "captureDate": moment(new Date()).format(),
      "captureSource": "ObjectId(" + sourceId + ")", // FIXME: should not be a string
      "songName": songName,
      "artistName": artistName,
      "videoId": videoId
    };

    songs.push(song);

  };

  JSON.stringify(songs, null, 4)
