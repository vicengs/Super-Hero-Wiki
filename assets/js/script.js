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
            //alert("Character not found")
        }
    });
    console.log(character);
    getMovieApiData(character); // Temporary - VG
}
// Change to id character-form - VG
$("#character-form").on('submit', formSubmitHandler);
