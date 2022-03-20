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
var characterNameInputEl = $("#characterNameInput");
var characterFormEl = $("#character-form"); // updated to match new html format - SF
var characterSelectEl = $(".characters");
var bioSelectEl = $(".description");
// Function to take form input and pass onto Marvel Api
var formSubmitHandler = function (event) {
  event.preventDefault();
  // get value from input element
  var characterName = characterNameInputEl.val().trim();

  if (characterName) {
    getMarvelApiData(characterName);
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
        // Displays descriptions - NG
        displayMarvelHeroDesc(data);
      });
    } else {
      alert("Character not found");
    }
  });
  console.log(character);
};

// Function to get movie(s) data - VG
var getMovieApiData = function(movieCharacter){
    // Declare Movie API url - VG
    var movieApiUrl = "https://api.themoviedb.org/3/search/movie?api_key=8fa095f9c4ad16b980d9d656a90cdef0&language=en-US&page=1&include_adult=false&query=" + movieCharacter;
    // Declare DOM to display movies
    var moviesEl = $(".movies");
    // Request to movie API url - VG
    var numId = 0;
    fetch(movieApiUrl).then(function(responseMovie){
        // If retrieves data continues - VG
        if (responseMovie.ok){
            // Interpret response to manage - VG
            responseMovie.json().then(function(dataMovie){
                // Loop to get each movie found to that character - VG
                for (var i = 0; i < dataMovie.results.length; i++){
                    var companyApiUrl = "https://api.themoviedb.org/3/movie/" + dataMovie.results[i].id + "?api_key=8fa095f9c4ad16b980d9d656a90cdef0"
                    fetch(companyApiUrl).then(function(responseCompany){
                        if (responseCompany.ok){
                            responseCompany.json().then(function(dataCompany){
                                for (var j = 0; j < dataCompany.production_companies.length; j++){
                                    if (dataCompany.production_companies[j].id === 420){
                                        // Show movies in page - VG
                                        numId = numId + 1;
                                        moviesEl.append("<p><a href='#' class='cta-" + numId + "'>" + dataCompany.original_title + "</a></p>");
                                        //href='https://image.tmdb.org/t/p/original/" + dataCompany.poster_path + "?api_key=8fa095f9c4ad16b980d9d656a90cdef0' data-toggle='modal' data-target='#movie-modal'>" + dataCompany.original_title
                                        var closeEl = document.querySelector(".close");
                                        var openEl = document.querySelector(".cta-"+numId);
                                        var modalEl = document.querySelector(".modal");
                                        var modalContainer = document.querySelector(".modal-container");
                                        openEl.addEventListener("click",function(event){
                                            event.preventDefault();
                                            console.log("entra al click");
                                            modalContainer.style.opacity = "1";
                                            modalContainer.style.visibility = "visible";
                                            modalEl.classList.toggle("modal-close");
                                        });
                                        closeEl.addEventListener("click", function(){
                                            modalEl.classList.toggle("modal-close");
                                            setTimeout(function(){
                                                modalContainer.style.opacity = "0";
                                                modalContainer.style.visibility = "hidden";
                                            },1000);
                                        });
                                    };
                                };
                            });
                        }else{
                            console.log("Company don't found for that character");
                        };
                    });
                    
                    // I suggest put the overview in a modal
                    // moviesEl.append("<p>" + dataMovie.results[i].overview + "</p>");
                };
            });
        }else{
            // If doesn't retrieve data catch to show an error in screen - VG
            console.log("Movies don't found for that character");
        };
    });
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

// function displaying a description of the character from the Marvel API - NG
var displayMarvelHeroDesc = function (bio) {
  // loop through array of descriptions
  for (var i = 0; i < bio.data.results.length; i++) {
    // creates the description container
    var bioContainerEl = document.createElement("div");
    bioContainerEl.classList = "descriptionContainer";
    // holds desired result from API 
    var description = bio.data.results[i].description;
    // creates span element and sets the content as the description
    var descriptionEl = document.createElement("span");
    descriptionEl.textContent = description;
    // appeneds the span element to the created div
    bioContainerEl.appendChild(descriptionEl);
    // appends the div to the specified element in the HTML
    bioSelectEl.append(bioContainerEl);
  }
};


// Change to id character-form - VG
$("#character-form").on("submit", formSubmitHandler);
