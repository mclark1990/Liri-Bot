//require for env file
require("dotenv").config();
//variables for liri
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var request = require('request');
var fs = require('fs');


//switch case for command line inputs
switch (process.argv[2]) {
  case "my-tweets":
    myTweets();
    break;

  case "spotify-this-song":
    spotifyThisSong();
    break;

  case "movie-this":
    movieThis();
    break;

  case "do-what-it-says":
    doWhatItSays();
    break;

  default:
    console.log("Commands to enter after node liri" + "\n" +
      "my-tweets" + "\n" +
      "spotify-this-song " + "'song name'" + "\n" +
      "movie-this " + "movie title inside quotations" + "\n" +
      "do-what-it-says")

}

//function to run when my-tweets command is used
function myTweets() {
  var params = {
    screen_name: 'ApricotCheetah'
  };
  client.get('statuses/user_timeline', params, function (error, tweets, response) {

    if (!error) {
      for (i = 0; i < tweets.length; i++) {
        console.log(tweets[i].text);
      }
    } else {
      console.log("Error: " + error);
    }


  });
};
//function to run when spotify-this-song is used
function spotifyThisSong(trackInput) {
  var artistName = function (artist) {
    return artist.name
  }
  var trackInput = process.argv.slice(3).join(" ");

  if (!trackInput) {
    trackInput = "The Sign"
  }
  spotify.search({
      type: 'track',
      query: trackInput
    }, function (err, data) {

      if (err) {
        console.log("Error: " + err);
        return;
      }
      var trackInfo = data.tracks.items
      //console.log(data.tracks.items[0]);
      for (i = 0; i < trackInfo.length; i++) {

        var results =
          "Artist: " + trackInfo[i].artists[0].name + "\n" +
          "Song Name: " + trackInfo[i].name + "\n" +
          "Preview Link: " + trackInfo[i].preview_url + "\n" +
          "Album: " + trackInfo[i].album.name + "\n"

      }
      console.log(results);
    }

  );

};

//function to run when movie-this command is used
function movieThis() {
  var movie = process.argv[3];
  var queryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&r=json&apikey=trilogy";

  request(queryURL, function (error, response, body) {
    //var jsonData = JSON.parse(body);
    //console.log(jsonData);
    if (!error && response.statusCode == 200) {

      var jsonData = JSON.parse(body);
      var movieResults =
        "Title: " + jsonData.Title + "\n" +
        "Year: " + jsonData.Year + "\n" +
        "IMDB Rating: " + jsonData.imdbRating + "\n" +
        "Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value + "\n" +
        "Country: " + jsonData.Country + "\n" +
        "Language: " + jsonData.Language + "\n" +
        "Plot: " + jsonData.Plot + "\n" +
        "Actors: " + jsonData.Actors

      console.log(movieResults);

    } else if (!movie) {
      movie = '"Mr. Nobody"';
    } else {
      console.log("Error: " + error);
    }

  });
}

//function to run when do-what-it-says command is used
function doWhatItSays() {
  fs.readFile('random.txt', 'utf-8', function (err, data) {
    if (err)
      throw err;
    console.log(data);

    dataArr = data.split(",");
    //not yet sure how to make this work, it needs to be able to read each index in the array and
    //then run the appropriate function

    /*if (dataArr[0] === "spotify-this-song") {
      spotifyThisSong();
    } else if (dataArr[0] === "movie-this") {
      movieThis();
    } else if (dataArr[0] === "my-tweets") {
      myTweets();
    } else {
      console.log("Liri don't know that!")
    }*/

  })
}