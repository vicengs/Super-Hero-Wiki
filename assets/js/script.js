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
/* Modified : 03/24/2022           */
/* ------------------------------- */

var characterNameInputEl = $(".form-control"); // Class form-control instead id characterNameInput - VG
var characterSelectEl = $(".characters");
// Declare DOM to display movies - VG
var moviesEl = $(".movies");
//var searchCaracterEl = $(".history");
searchCaracterEl = $(".search");
// Variable to activate listener to close modal - VG
var closeModal = true;
var closeModalError = true;
// Declare characters array - VG
var arrCharacters = [];
// Function to clear search history - VG
var clearSearchHistory = function(){
    // Initialize array to null - VG
    arrCharacters = [];
    // Call function to save the null array in the local storage - VG
    saveCharacter();
    // Clear city buttons section - VG
    searchCaracterEl.empty();
};
// Function to create a new character button - VG
var createButton = function(createCharacter){
    // Declare variable with character name (received in parameter) replacing spaces with middle slash - VG
    var idCharacter = createCharacter.replace(/ /g,"-");
    // Add to HTML by jQuery button with style classes and id to identify when clicked - VG
    searchCaracterEl.append("<button id='" + idCharacter + "' class='bg-black text-white font-bold px-2 mx-2 mb-1 rounded'>"+ createCharacter +"</button>");
    // Add listener to new (or load) button to response on click - VG
    $("#"+idCharacter).click(function(){
        // Call to function that search and display character of the button - VG
        getMarvelApiData(this.textContent);
    });
    // Remove clear search button if it exists - VG
    $("#delete").remove();
    // Create at the end the clear search button - VG
    searchCaracterEl.append("<button id='delete' class='bg-white text-black font-bold px-2 mx-2 mb-1 rounded'>Clear Search History</button>");
    // Add listener to clear search button to response on click calling function to clear search history - VG
    $("#delete").click(clearSearchHistory);
};
// Function to load (if exists) characters from local storage - VG
var loadCharacters = function(){
    // Call to local storage - VG
    arrCharacters = JSON.parse(localStorage.getItem('characters'));
    if (arrCharacters){
        // Create button to each character found in local storage - VG
        for (var i=0; i<arrCharacters.length; i++){
            createButton(arrCharacters[i]);
        };
    }else{
        // If there are nothing in local storage initializes global array variable - VG
        arrCharacters = [];
    };
};
// Function to save a new search characters - VG
var saveCharacter = function(newCharacter){
    // If parameter has value (character) add new character searched to array - VG
    if (newCharacter){
        arrCharacters.push(newCharacter);
        createButton(newCharacter);
    };
    // Add to local storage array (plus 1 character) - VG
    localStorage.setItem("characters", JSON.stringify(arrCharacters));
};
// Function to take form input and pass onto Marvel Api
var formSubmitHandler = function (event) {
  event.preventDefault();
  // get value from input element
  var characterName = characterNameInputEl.val().trim();
    if (characterName) {
        getMarvelApiData(characterName);
        characterNameInputEl.val("");
    }
};
var getMarvelApiData = function (character) {
  // format marvel api url
  // API uses hash and timestap - VG
  var apiUrl = "https://gateway.marvel.com/v1/public/characters?apikey=bdcf8bf36f00d72167a3bfecfe99a353&hash=2c434abaf442b44445f5f4b5032e4de9&ts=9&nameStartsWith="+character;
  // make request to url
  fetch(apiUrl).then(function (response) {
    // successful response
    if (response.ok) {
      response.json().then(function (data) {
        // Display characters - SF
        displayMarvelApi(data, character);
      });
    } else {
      //alert("Character not found"); // No alerts - VG
    }
  });
};
// Function to get movie(s) data - VG
var getMovieApiData = function(movieCharacter){
    // Declare Movie API url - VG
    var movieApiUrl = "https://api.themoviedb.org/3/search/movie?api_key=8fa095f9c4ad16b980d9d656a90cdef0&language=en-US&page=1&include_adult=false&query=" + movieCharacter ;
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
                                    if ((dataCompany.production_companies[j].id === 420 || dataCompany.production_companies[j].id === 7505 || dataCompany.production_companies[j].id === 19551) &&
                                         //(dataCompany.production_companies[j].id === 128064 || dataCompany.production_companies[j].id === 174 || dataCompany.production_companies[j].id === 429 || dataCompany.production_companies[j].id === 9993) &&
                                         dataCompany.backdrop_path != null){
                                            // Array to storage the movie that meets conditions - VG
                                            arrCompanyMovies = {title: dataCompany.original_title
                                                               ,image: dataCompany.backdrop_path
                                                               ,overview: dataCompany.overview
                                                               ,year: dataCompany.release_date.substring(0,4)};
                                            // Add new movie to main array from company movies - VG
                                            arrMovies.push(arrCompanyMovies);
                                            // Validation to save just 1 time - VG
                                            if (j===0){
                                                // For each character in the array validates if the character to search exists or is a new search thus new search button in the history search - VG
                                                var save = true;
                                                for (var i=0; i<arrCharacters.length; i++){
                                                    if (movieCharacter.toUpperCase().trim() === arrCharacters[i].toUpperCase().trim()){
                                                        save = false
                                                    };
                                                };
                                                // If character doesn't exist before (in the array) creates a new button search by the character - VG
                                                if (save){
                                                    // Call to save button but first create button through the create button function that remember returns the character to be used by save function - VG
                                                    saveCharacter(movieCharacter.toUpperCase());
                                                };
                                            };
                                            // Break to avoid duplicity when has more than 1 valid production company - VG
                                            break;
                                    }; // Close if Company Production - VG
                                }; // Close for API companies - VG
                            }); // Close Response Companies json function - VG
                        }else{
                            // If doesn't retrieve data catch to show an error in screen - VG
                            //console.log("Company don't found for that character");
                        }; // Close if companies response ok - VG
                    }); // Close fetch API companies - VG
                }; // Close For API movies - VG
            }); // Close Response Movies json function - VG
        }else{
            // If doesn't retrieve data catch to show an error in screen - VG
            // Open a modal - VG
            //console.log("Movies don't found for that character");
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
            // Declare variables jQuery DOM to manipulate HTML and style - VG
            var openEl = $(".hero-"+numId);
            var closeEl = $(".close");
            var modalContainer = $(".modal-container");
            var overviewEl = $(".overview");
            var modalEl = $(".modal");
            // Listener on click for each movie displayed - VG
            openEl.click(function(event){
                event.preventDefault();
                // Appears modal - VG
                modalContainer.css("opacity","1");
                modalContainer.css("visibility","visible");
                modalEl.toggleClass("modal-close");
                // Clear modal - VG
                overviewEl.empty();
                // Show dinamic image of the movie - VG
                modalEl.css("backgroundImage","url(https://image.tmdb.org/t/p/original" + arrMovies[this.id].image + "?api_key=8fa095f9c4ad16b980d9d656a90cdef0)");
                // Show dinamic overview of the movie - VG
                overviewEl.append("<p>" + arrMovies[this.id].overview + "</p>");
                overviewEl.css("font-size","20px");
            });
            // Conditional to generate just one time - VG
            if (closeModal){
                // Close Modal when button X is clicked - VG
                closeEl.click(function(event){
                    event.preventDefault();
                    modalEl.toggleClass("modal-close");
                    setTimeout(function(){
                        modalContainer.css("visibility","hidden");
                    },590);
                });
                // When clicked out of the modal it closes - VG
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
                // Change value to close to avoid duplicity and malfunction of the modal - VG
                closeModal = false;
            };
        };
    },1000);
};

// Function to display characters from Marvel Api - SF
var displayMarvelApi = function (character, movie) {
    // Variable to display just one time the movies characters - VG
    var newCharacter = true;
    characterSelectEl.empty();
    // Clear movies section - VG
    moviesEl.empty();
    // loop through characters array
    for (var i = 0; i < character.data.results.length; i++) {
      // create character container
      var characterContainerEl = document.createElement("div");
      characterContainerEl.classList = "characterContainer";
      // format name
      var name = character.data.results[i].name;
      // format description
      var description = character.data.results[i].description;
      // card element for character info
      var infoEl = document.createElement("card");
      // line break for better look on page - using because no style on page yet
      var lineBreak = document.createElement("br");
      // get character picture
      var picture = character.data.results[i].thumbnail.path + ".jpg";
      if (picture === "http://i.annihil.us/u/prod/marvel/i/mg/c/d0/4ce5a883e8df0.jpg"){
          picture = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg";
      }
      // create anchor for picture
      var pictureContainer = document.createElement("img");
      pictureContainer.src = picture;
      // create marvel copyright container
      var copyrightEl = document.createElement('p');
      copyrightEl.textContent = "Data provided by Marvel. © 2014 Marvel";
      // Check if there is a description
      if(character.data.results[i].description === "") {
        infoEl.innerHTML = name + ": " + "No desctiption";
      } else {
        infoEl.innerHTML = name + ": " + description;
      }
      characterSelectEl.addClass("comicCard");
      // appened to container
      characterContainerEl.appendChild(infoEl);
      // append to DOM w/ line break
      characterSelectEl.append(pictureContainer);
      characterSelectEl.append(characterContainerEl);
      characterSelectEl.append(copyrightEl);
      characterSelectEl.append(lineBreak);
      // Call to function to get movies - VG
      if (newCharacter){
        getMovieApiData(movie);
        newCharacter = false;
      };
    }
    if (newCharacter){
        var modalEl = $(".modal");
        var modalContainer = $(".modal-container");
        var closeEl = $(".close");
        var overviewEl = $(".overview");
        // Clear modal - VG
        overviewEl.empty();
        modalContainer.css("opacity","1");
        modalContainer.css("visibility","visible");
        modalEl.toggleClass("modal-close");
        modalEl.css("backgroundImage","url(http://trumpwallpapers.com/wp-content/uploads/Marvel-Wallpaper-05-1280-x-800.jpg)");
        // Show dinamic overview of the movie - VG
        overviewEl.append("<p>"+ movie +" Doesn't belong to Marvel characters</p>");
        overviewEl.css("font-size","30px");
        // Close Modal when button X is clicked - VG
        if (closeModal){
            closeEl.click(function(event){
                event.preventDefault();
                modalEl.toggleClass("modal-close");
                setTimeout(function(){
                    modalContainer.css("visibility","hidden");
                },590);
            });
            // When clicked out of the modal it closes - VG
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
  };
// Change to id character-form - VG
$(".main").on('submit', formSubmitHandler);
//Add Popular Superhero Movies to Homepage - MB
var popularMovieData = function(list){
    var popularURL = "https://api.themoviedb.org/3/discover/movie?api_key=8fa095f9c4ad16b980d9d656a90cdef0&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_keywords=180547&with_watch_monetization_types=flatrate";
    //Declare DOM to display Popular Movies - MB
    var popularEl = $(".popular-list");
    //request to API - MB
    fetch(popularURL).then(function(response){
        if(response.ok){
        response.json().then(function(data){
            //display array - MB
            for(var i = 0; i < data.results.length; i++){
                // create container div
                var movieContainerEl = document.createElement('div');
                //retrieve movie poster from URL - MB
                var moviePosterUrl = "https://image.tmdb.org/t/p/w92" + data.results[i].poster_path;
                // poster container
                var moviePosterContainerEl = document.createElement('img');
                moviePosterContainerEl.src = moviePosterUrl;
                // retrieve movie name
                var movieNameEl = data.results[i].original_title;
                // format name
                var movieP = document.createElement('p');
                movieP.textContent = movieNameEl;
                // append to DOM
                movieContainerEl.appendChild(moviePosterContainerEl);
                movieContainerEl.appendChild(movieP);
                popularEl.append(movieContainerEl);
                popularEl.append("<br>");
                // Validastion to show just top 5 - VG
                if (i === 4){
                    break;
                }
            }
        });
        }else{
            // TODO:  REPLACE ALERT WITH MODAL ERROR MESSAGE - MB
            var errorEl = document.createElement('p')
            errorEl.textContent = "API Can't Load Popular Films";
            popularEl.append(errorEl);
        }
})};
// saves the character name from user input into local storage NG
/*var saveSearch = function(characterName){
    localStorage.setItem(characterName, characterName);
};*/
popularMovieData();
loadCharacters();