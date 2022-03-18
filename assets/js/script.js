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
            });
        } else {
            alert("Character not found")
        }
    });
    console.log(character)
}

$(".character-form").on('submit', formSubmitHandler);
