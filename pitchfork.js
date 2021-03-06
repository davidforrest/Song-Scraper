// FIXME: regex [ft. artists are in brackets] and IN SONG NAME, not ARTIST

//
// Step 0: Check recent scraped
//

  SELECT source.publication_date, song.title
  FROM source_song
  INNER JOIN song
    ON song.id = source_song.song_id
  INNER JOIN source
    ON source.id = source_song.source_id
  WHERE source.parent_entity = 'Pitchfork'
    AND source.parent_stream = 'Track Reviews'
  ORDER BY source.publication_date DESC LIMIT 8;


//
// Step 1: Scrape source data without duplicates
//

  // Note: a new song may already have an existing source!
  //
  // Songs released today have an "hours ago" date format, so enter YYYY-MM-DD manually
  //
  // Also may need to remove page number from "chartLocation" if scrolling down a lot to catch up.


  // Add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  sourceDates = [];

  // get a list of source dates from songs
  elements = document.getElementsByClassName("artist-list");
  for (var i=0; i<elements.length; i++){

    publicationDate = document.getElementsByClassName("pub-date")[i].innerText.trim();
    publicationDateFormatted = moment(publicationDate, "MMMM DD YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

    sourceDates.push(publicationDateFormatted);
  };

  // remove duplicate dates
  sourceSet = new Set(sourceDates);
  sourceArray = Array.from(sourceSet)

  // build sources object from dates
  sources = [];
  for (var i=0; i<sourceArray.length; i++){

    publicationDate = sourceArray[i];
    chartLocation = window.location.href;

    source = String(
      "\n(\'Pitchfork\', "
      + "\'Track Reviews\', "
      + "NULL, "
      + "\'" + publicationDate + "\', "
      + "\'" + chartLocation + "\')"
    );

    sources.push(source);

  };

  console.log(String(sources));


  // Paste sources into the SQL statement, and prune out existing sources
  // If necessary, remove page numbers (ex: ?page=2) from location

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
  ('Pitchfork', 'Track Reviews', NULL, '2021-05-21 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-05-20 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-05-19 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-05-14 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-05-13 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-05-12 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-05-07 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-05-05 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2021-05-03 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/')
  ;

  // Update to source table


//
// Step 2: Scrape songs data w/ placeholder source
//

  songsData = [];
  elements = document.getElementsByClassName("artist-list");
  for (var i=0; i<elements.length; i++){

    title = elements[i].nextElementSibling.innerText.match(/“(.*?)”/)[1]; // everything inside the quotatino marks
    artist_name = elements[i].innerText;
    video_id = null;

    capture_date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

    // date placeholder for source_id
    publicationDate = document.getElementsByClassName("pub-date")[i].innerText.trim();
    publicationDateFormatted = moment(publicationDate, "MMMM DD YYYY").format(); // to ISO

    songData = {
      'title' : title,
      'artist_name' : artist_name,
      'video_id' : video_id,
      'capture_date' : capture_date,
      'source_id' : publicationDateFormatted, // placeholder
      'song_id' : null,
      'duplicate' : false
    };

    songsData.push(songData);

  };

  console.log(JSON.stringify(songsData, null, 4));


//
// Step 3:  Stage new songs only,
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "Sink In",
        "artist_name": "Tirzah",
        "video_id": null,
        "capture_date": "2021-05-27 07:16:03.752752",
        "source_id": 921,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "VBS",
        "artist_name": "Lucy Dacus",
        "video_id": null,
        "capture_date": "2021-05-27 07:16:03.755755",
        "source_id": 922,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Like I Used To",
        "artist_name": "Sharon Van Etten & Angel Olsen",
        "video_id": null,
        "capture_date": "2021-05-27 07:16:03.755755",
        "source_id": 922,
        "song_id": 10454,
        "duplicate": true
    },
    {
        "title": "Nothing’s Special",
        "artist_name": "Oneohtrix Point Never & Rosalía",
        "video_id": null,
        "capture_date": "2021-05-27 07:16:03.755755",
        "source_id": 923,
        "song_id": 10458,
        "duplicate": true
    },
    {
        "title": "Lay Wit Ya",
        "artist_name": "Isaiah Rashad",
        "video_id": null,
        "capture_date": "2021-05-27 07:16:03.755755",
        "source_id": 924,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Rare to Wake",
        "artist_name": "Shannon Lay",
        "video_id": null,
        "capture_date": "2021-05-27 07:16:03.756756",
        "source_id": 925,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Worry With You",
        "artist_name": "Sleater-Kinney",
        "video_id": null,
        "capture_date": "2021-05-27 07:16:03.756756",
        "source_id": 926,
        "song_id": 10410,
        "duplicate": true
    },
    {
        "title": "Blame Me",
        "artist_name": "L’Rain",
        "video_id": null,
        "capture_date": "2021-05-27 07:16:03.756756",
        "source_id": 927,
        "song_id": 10413,
        "duplicate": true
    },
    {
        "title": "Wake-Up (Loraine James Remix)",
        "artist_name": "Kelly Lee Owens",
        "video_id": null,
        "capture_date": "2021-05-27 07:16:03.756756",
        "source_id": 928,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Damaged",
        "artist_name": "Leo Bhanji",
        "video_id": null,
        "capture_date": "2021-05-27 07:16:03.756756",
        "source_id": 929,
        "song_id": null,
        "duplicate": false
    }
]

  // To check for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%Up%'
    AND artist_name LIKE '%Cardi%'
  ;


//
// Step 4: add source_ids
//

  // get source_ids and dates for newly added sources
  // increase LIMIT number if necessary
  SELECT id, publication_date, parent_entity FROM source ORDER BY id DESC LIMIT 10;

  // manually add source_ids in songsData above (INT without quotation marks).

  // Update var songsData = the array above.


//
// Step 5: Update nonduplicates to the song table
//

  // Build the SQL statement
  songs = [];

  for (var i=0; i<songsData.length; i++){
    song = String(
      "\n(\'" + songsData[i].title + "\', "
      + "\'" + songsData[i].artist_name + "\', "
      + "NULL)"
    );

    if (songsData[i].duplicate == false){
      songs.push(song);
    }
  }
  console.log(String(songs));


  // Stage SQL statement
  // Replace any ' in strings with ’
  // check artist name formatting

  INSERT INTO song
    (title, artist_name, video_id)
  VALUES
  ('Sink In', 'Tirzah', NULL),
  ('VBS', 'Lucy Dacus', NULL),
  ('Lay Wit Ya', 'Isaiah Rashad', NULL),
  ('Rare to Wake', 'Shannon Lay', NULL),
  ('Wake-Up (Loraine James Remix)', 'Kelly Lee Owens', NULL),
  ('Damaged', 'Leo Bhanji', NULL)
  ;

   // Update to song table


//
// Step 6: Add new song_ids and update all songs to the source_song table.
//

  // Get the last song_id inserted
  song_id = 10465; // SELECT last_insert_rowid();

  // Calculate the number of nonduplicate songs added
  nonduplicates = 0;

  for (var i=0; i<songsData.length; i++){
    if (songsData[i].duplicate == false){
      nonduplicates++
    }
  };

  // Update nonduplicate song_ids
  for (var i=0; i<songsData.length; i++){

    if (songsData[i].duplicate == false){
      songsData[i].song_id = (song_id - nonduplicates +1);
      nonduplicates--;
    }
  }

  // Build the SQL statement
  source_songs = [];

  for (var i=0; i<songsData.length; i++){
    source_song = String(
      "\n(\'" + songsData[i].capture_date + "\', "
      + "\'" + songsData[i].source_id + "\', "
      + "\'" + songsData[i].song_id + "\')"
    );

    source_songs.push(source_song);
  }

  console.log(String(source_songs));


  // Stage the SQL statement
  INSERT INTO source_song
    (capture_date, source_id, song_id)
  VALUES
  ('2021-05-27 07:16:03.752752', '921', '10460'),
  ('2021-05-27 07:16:03.755755', '922', '10461'),
  ('2021-05-27 07:16:03.755755', '922', '10454'),
  ('2021-05-27 07:16:03.755755', '923', '10458'),
  ('2021-05-27 07:16:03.755755', '924', '10462'),
  ('2021-05-27 07:16:03.756756', '925', '10463'),
  ('2021-05-27 07:16:03.756756', '926', '10410'),
  ('2021-05-27 07:16:03.756756', '927', '10413'),
  ('2021-05-27 07:16:03.756756', '928', '10464'),
  ('2021-05-27 07:16:03.756756', '929', '10465')
  ;

  // Update to source_song table
