/* ------------------------------- */
/* Project  : Super Hero Wiki      */
/* File     : script.js            */
/* Authors  : Ballard Ingram  (BI) */
/*          : Stephen Fike    (SF) */
/*          : Nathan Greiling (NG) */
/*          : Matthew Berti   (MB) */
/*          : Kevin Heaton    (KH) */
/*          : Vicente Garcia  (VG) */
/* Created  : 03/17/2022           */
/* Modified : 03/18/2022           */
/* ------------------------------- */
var characterNameInputEl = $("#characterNameInput")
var characterFormEl = $(".character-form")

var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input element
    var characterName = characterNameInputEl.val().trim();
    
    if(characterName) {
        getMarvelApiData(characterName)
        characterNameInputEl.value = "";
    } else {
        alert("Please enter a valid character name");
    }
    console.log(event);
}
// Function to get movie(s) data - VG
var getMovieApiData = function(movieCharacter){
    // Declare Movie API url - VG
    var movieApiUrl = "https://api.themoviedb.org/3/search/movie?api_key=8fa095f9c4ad16b980d9d656a90cdef0&language=en-US&page=1&include_adult=false&query="+movieCharacter;
    // Declare DOM to display movies
    var moviesEl = $(".movies");
    // Request to movie API url - VG
    fetch(movieApiUrl).then(function(response){
        // If retrieves data continues - VG
        if (response.ok){
            // Interpret response to manage - VG
            response.json().then(function(data){
                // Loop to get each movie found to that character - VG
                for (var i = 0; i < data.results.length; i++){
                    // Show movies in page
                    moviesEl.append("<p><a href='#' data-toggle='modal' data-target='#movie-modal'>" + data.results[i].original_title + "</a></p>");
                    // I suggest put the overview in a modal
                    // moviesEl.append("<p>" + data.results[i].overview + "</p>");
                };
            });
        }else{
            // If doesn't retrieve data catch to show an error in screen - VG
            console.log("Movies don't found for that character");
        };
    });
};

var getMarvelApiData = function(character) {
    // format marvel api url
    var apiUrl = "https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=" + character + "&apikey=8aa203e41460eb91a6faf2e98ab88784";
    // make request to url
    fetch(apiUrl).then(function(response) {
        // successful response
        if(response.ok) {
            response.json().then(function(data){
                // displayMarvelApiData(data)
                console.log(data);
                // Call to function to get movies - VG
                getMovieApiData(character);
            });
        } else {
            alert("Character not found")
        }
    });
    console.log(character);
    getMovieApiData(character); // Temporary - VG
}
// Change to id character-form - VG
$("#character-form").on('submit', formSubmitHandler);




//Add Popular Superhero Movies to Home
var popularMovieData = function(list){
    var popularURL = "https://api.themoviedb.org/3/discover/movie?api_key=8fa095f9c4ad16b980d9d656a90cdef0&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_keywords=180547&with_watch_monetization_types=flatrate";
    //Declare DOM to display Popular Movies
    var popularEl = $("#popular-list");
    //request to API
    fetch(popularURL).then(function(response){
        if(response.ok){
        response.json().then(function(data){
            //display array
            for(var i = 0; i < data.results.length; i++){
                var moviePosterUrl = "https://image.tmdb.org/t/p/w92" + data.results[i].poster_path;
                //create DOM Element for Image
                popularEl.append("<p><img src='" + moviePosterUrl +  "'></p>");
                popularEl.append("<p><a href='#' data-toggle='modal' data-target='#popular-modal'>" + data.results[i].original_title +  "</a></p>");
                //get url for images
               
                

                console.log(moviePosterUrl);

                //File Path to Movie Images
                //console.log(data.results[i].poster_path);
            }
        });
        }else{
            alert("API Can't Load Popular Films");
        }
})};
popularMovieData();
/*Function to retrieve movie posters from API
var moviePosters = function(){
    //Configure Poster Sizes for Movie API
    var moviePosterUrl = "https://image.tmdb.org/t/p/w500" + data.results[i].poster_path + ".png";
        //console.log(moviePosterUrl);
}
moviePosters();*/




