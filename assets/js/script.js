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
/* Modified : 03/22/2022           */
/* ------------------------------- */
var characterNameInputEl = $("#characterNameInput");
var characterFormEl = $("#character-form"); // updated to match new html format - SF
var characterSelectEl = $(".characters");

// Function to take form input and pass onto Marvel Api
var formSubmitHandler = function (event) {
  event.preventDefault();
  // get value from input element
  var characterName = characterNameInputEl.val().trim();

  if (characterName) {
    getMovieApiData(characterName); // Temporary
    //getMarvelApiData(characterName);
    characterNameInputEl.val("");
  } else {
    alert("Please enter a valid character name");
  }
};

var getMarvelApiData = function (character) {
  // format marvel api url
  var apiUrl =
    "https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=" +
    character +
    "&apikey=8aa203e41460eb91a6faf2e98ab88784";
  // make request to url
  fetch(apiUrl).then(function (response) {
    // successful response
    if (response.ok) {
      response.json().then(function (data) {
        // displayMarvelApiData(data)
        console.log(data);
        // Call to function to get movies - VG
        getMovieApiData(character);
        // Display characters - SF
        displayMarvelApi(data);
      });
    } else {
      //alert("Character not found");
    }
  });
  console.log(character);
};
// Variable to activate listener to close modal - VG
var closeModal = true;
// Function to get movie(s) data - VG
var getMovieApiData = function(movieCharacter){
    // Declare Movie API url - VG
    var movieApiUrl = "https://api.themoviedb.org/3/search/movie?api_key=8fa095f9c4ad16b980d9d656a90cdef0&language=en-US&page=1&include_adult=false&query=" + movieCharacter ;
    // Declare DOM to display movies - VG
    var moviesEl = $(".movies");
    // Declare variable to assign unique id to each mnovie - VG
    var numId = 0;
    // Declare array for production companies - VG
    var arrCompanyMovies = [];
    // Declare array for movies - VG
    var arrMovies = [];
    // Request to movie API url - VG
    fetch(movieApiUrl).then(function(responseMovie){
        // If retrieves movies data continues - VG
        if (responseMovie.ok){
            // Clear movies section - VG
            moviesEl.empty();
            // Interpret movies response to manage - VG
            responseMovie.json().then(function(dataMovie){
                // Loop to get each movie found to that character - VG
                for (var i = 0; i < dataMovie.results.length; i++){
                    // Declare movie-company API url - VG
                    var companyApiUrl = "https://api.themoviedb.org/3/movie/" + dataMovie.results[i].id + "?api_key=8fa095f9c4ad16b980d9d656a90cdef0"
                    // Request to movie-company API url - VG
                    fetch(companyApiUrl).then(function(responseCompany){
                        // If retrieves movies-company data continues - VG
                        if (responseCompany.ok){
                            // Interpret company response to manage - VG
                            responseCompany.json().then(function(dataCompany){
                                // Loop to get just Marvel (420, 7505, 19551, 13252) or DC (128064, 174, 429, 9993) movies - VG
                                for (var j = 0; j < dataCompany.production_companies.length; j++){
                                    if ((dataCompany.production_companies[j].id === 420 || dataCompany.production_companies[j].id === 7505 || dataCompany.production_companies[j].id === 19551 ||
                                         dataCompany.production_companies[j].id === 128064 || dataCompany.production_companies[j].id === 174 || dataCompany.production_companies[j].id === 429 || dataCompany.production_companies[j].id === 9993) &&
                                         dataCompany.backdrop_path != null){
                                            // Array to storage the movie that meets conditions - VG
                                            arrCompanyMovies = {title: dataCompany.original_title
                                                               ,image: dataCompany.backdrop_path
                                                               ,overview: dataCompany.overview
                                                               ,year: dataCompany.release_date.substring(0,4)};
                                            // Add new movie to main array from company movies - VG
                                            arrMovies.push(arrCompanyMovies);
                                            // Break to avoid duplicity when has more than 1 valid production company - VG
                                            break;
                                    }; // Close if Company Production - VG
                                }; // Close for API companies - VG
                            }); // Close Response Companies json function - VG
                        }else{
                            // If doesn't retrieve data catch to show an error in screen - VG
                            console.log("Company don't found for that character");
                        }; // Close if companies response ok - VG
                    }); // Close fetch API companies - VG
                }; // Close For API movies - VG
            }); // Close Response Movies json function - VG
        }else{
            // If doesn't retrieve data catch to show an error in screen - VG
            // Open a modal - VG
            console.log("Movies don't found for that character");
        }; // Close if movies response ok - VG
    }); // Close fetch API movies - VG
    // Timeout to be able to validate bacause the API's are asyncronous - VG
    setTimeout(function(){
        // Variables to sort results by year production - VG
        var maxYear = 0;
        var maxIndex = 0;
        var nextYear = 0;
        var nextIndex = 0;
        // Variable to allow get the max year just the first time - VG
        var firstTime = true;
        // Begin loop to iterate depending how many elements there are in the movies array - VG
        for (var k = 0; k < arrMovies.length; k++){
            // Initialize variables each main lap - VG
            nextYear = 0;
            nextIndex = 0;
            // Reverse loop to validate each value ang get movies sorted by year - VG
            for (var l = arrMovies.length - 1; l >= 0; l--){
                // Get current movie year - VG
                var currentYear = arrMovies[l].year;
                // Enter just first time to get max year - VG
                if (firstTime){
                    // For each movie in the array check if is the max year - VG
                    if (currentYear > nextYear){
                        // If is the max year assign the row temporary like max value until finish loop - VG
                        nextYear = currentYear;
                        nextIndex = l;
                    };
                // Check the next max year - VG
                }else if (currentYear < maxYear && currentYear > nextYear){
                    nextYear = currentYear;
                    nextIndex = l;
                // Check if is a same year production - VG
                }else if(currentYear === maxYear && l < maxIndex){
                    nextYear = currentYear;
                    nextIndex = l;
                    // Break to avoid don't consider the movie if there are more than 2 different movies in the same year - VG
                    break;
                };
            };
            // Now assign the max vaslue to row after the loop finish each time - VG
            maxYear = nextYear;
            maxIndex = nextIndex;
            // Change first time variable because don't need to enter to get maximum year - VG
            firstTime = false;
            // Add 1 to id per each movie found - VG
            numId = numId + 1;
            // Show movies in page - VG
            moviesEl.append("<p><a href='#' id=" + maxIndex + " class='hero-" + numId + "'>" + arrMovies[maxIndex].title + " (" + maxYear + ")</a></p>");
            // Declare variables DOM to manipulate HTML and style - VG
            var openEl = $(".hero-"+numId);
            var closeEl = $(".close");
            var modalContainer = $(".modal-container");
            var overviewEl = $(".overview");
            var modalEl = $(".modal");
            openEl.click(function(event){
                event.preventDefault();
                modalContainer.css("opacity","1");
                modalContainer.css("visibility","visible");
                modalEl.toggleClass("modal-close");
                overviewEl.empty();
                modalEl.css("backgroundImage","url(https://image.tmdb.org/t/p/original" + arrMovies[this.id].image + "?api_key=8fa095f9c4ad16b980d9d656a90cdef0)");
                overviewEl.append("<p>" + arrMovies[this.id].overview + "</p>");
            });
            if (closeModal){
                closeEl.click(function(event){
                    event.preventDefault();
                    modalEl.toggleClass("modal-close");
                    setTimeout(function(){
                        modalContainer.css("visibility","hidden");
                    },590);
                });
                window.addEventListener("click", function(event){
                    var modalContainerTarget = document.querySelector(".modal-container");
                    if (event.target == modalContainerTarget){
                        modalEl.toggleClass("modal-close");
                        setTimeout(function(){
                            modalContainer.css("opacity","0");
                            modalContainer.css("visibility","hidden");
                        },590);
                    };
                });
                closeModal = false;
            };
        };
    },1000);
};

// Function to display characters from Marvel Api - SF
var displayMarvelApi = function (character) {
  // loop through characters array
  for (var i = 0; i < character.data.results.length; i++) {
    // create character container
    var characterContainerEl = document.createElement("div");
    characterContainerEl.classList = "characterContainer";
    // format name
    var name = character.data.results[i].name;
    // span element for character name
    var nameEl = document.createElement("span");
    nameEl.textContent = name;
    // appened to container
    characterContainerEl.appendChild(nameEl);
    // append to DOM
    characterSelectEl.append(characterContainerEl);
  }
};

// Change to id character-form - VG
$("#character-form").on('submit', formSubmitHandler);




//Add Popular Superhero Movies to Homepage - MB
var popularMovieData = function(list){
    var popularURL = "https://api.themoviedb.org/3/discover/movie?api_key=8fa095f9c4ad16b980d9d656a90cdef0&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_keywords=180547&with_watch_monetization_types=flatrate";
    //Declare DOM to display Popular Movies - MB
    var popularEl = $("#popular-list");
    //request to API - MB
    fetch(popularURL).then(function(response){
        if(response.ok){
        response.json().then(function(data){
            //display array - MB
            for(var i = 0; i < data.results.length; i++){
                //retrieve movie poster from URL - MB
                var moviePosterUrl = "https://image.tmdb.org/t/p/w92" + data.results[i].poster_path;
                //create DOM Element for Image and Movie Name - MB
                    //appends movie poster - MB
                popularEl.append("<p><img src='" + moviePosterUrl +  "'></p>");
                    //retrieves and appends movie name and popularity order - MB
                popularEl.append("<p><a href='#' data-toggle='modal' data-target='#popular-modal'>" + data.results[i].original_title +  "</a></p>");
            }
        });
        }else{
            // TODO:  REPLACE ALERT WITH MODAL ERROR MESSAGE - MB
            alert("API Can't Load Popular Films");
        }
})};
popularMovieData();





