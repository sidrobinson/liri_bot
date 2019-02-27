require("dotenv").config();

var fs = require("fs");
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);


var action = process.argv[2];
var input = process.argv[3];



//Switch statements
function switchCase() {

    switch (action) {
        case 'concert-this':
            bandsinTown(input);
            break;
        case 'spotify-this-song':
            spotifyIt(input);
            break;
        case 'movie-this':
            movieThis(input);
            break;
        case 'do-what-it-says':
            itSays()
            break;
        default:
            console.log("Invalid Action");
    }
};


//node liri.js concert-this <artist/band name here>
function bandsinTown(){

    if (input === "") {

        console.log("Error: No Artist entered.")
        
    } else {
        axios.get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp").then(
        function (response) {
           if(response.data.length <= 0) {
               console.log("No info for this Artist")
           }else {
            for(var i=0; i < response.data.length; i++) {

                var currData = `\n
    Venue: ${response.data[i].venue.name}
    Location: ${response.data[i].venue.city + ", " + response.data[0].venue.region}
    Event Date: ${moment(response.data[i].datetime).format('LL')}
            `
            console.log(currData)
            }
           }
           
        }
    );
    }
};

//node liri.js spotify-this-song '<song name here>'


function spotifyIt() {

		if (!input){
        	input = 'The Sign';
    	}
		spotify.search({ type: 'track', query: input }, function(err, data) {
			if (err){
	            console.log('Error occurred: ' + err);
	            return;
	        }

	        var songInfo = data.tracks.items;
	        console.log("Artist(s): " + songInfo[0].artists[0].name);
	        console.log("Song Name: " + songInfo[0].name);
	        console.log("Preview Link: " + songInfo[0].preview_url);
	        console.log("Album: " + songInfo[0].album.name);
	});
}

//node liri.js movie-this '<movie name here>'
function movieThis(){

    var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body){
    if (!input){
        input = 'Mr.Nobody';
    }
        if (!error && response.statusCode === 200) {

		    console.log("Title: " + JSON.parse(body).Title);
		    console.log("Release Year: " + JSON.parse(body).Year);
		    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
		    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
		    console.log("Country: " + JSON.parse(body).Country);
		    console.log("Language: " + JSON.parse(body).Language);
		    console.log("Plot: " + JSON.parse(body).Plot);
		    console.log("Actors: " + JSON.parse(body).Actors);
		}
	});
};

//node liri.js do-what-it-says

function itSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {

        if (error) {
          return console.log(error);
        }

        var dataArr = data.split(",");
      
        input = dataArr[1];
        spotifyIt()
      });
}


// Call the main fucntion that will run the switch cases
switchCase();

console.log('this is loaded');

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};