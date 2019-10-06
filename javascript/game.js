var target = document.querySelector("#playArea");
var app = document.querySelector("#app");

var word = "";

// dictionary of words to choose from randomly, words are not case sensitive
var dictionary = ["console", "bootstrap", "querySelector", "innerHTML"];

// TODO: randomizer to pick answer word
var answer = dictionary[2];
var answerDisplay = "";

// sanitize input to focus on letters only
var allowedChars = "abcdefghijklmnopqrstuvwxyz";
// create a variable of the same length as answer, but with all characters as an underscore
for (let index = 0; index < answer.length; index++) {
  answerDisplay += `_`;
}
// user has 10 attemps; we need to keep track of what characters the user has attempted and display them on screen
var attemptCounter = 10;
var attemptChars = "";

// insert the elements we will be using into the page
target.innerHTML = `<h1>Press any key to get started!</h1>
<p id="answerDisplay"></p>
<br />
<p id="attemptChars"></p>
<br>
<p id="warning"></p>`;

// select elements to put data into
var answerDisplayId = document.querySelector("#answerDisplay");
var attemptCharsId = document.querySelector("#attemptChars");

var warningId = document.querySelector("#warning");

document.onkeydown = keyDown;

// fun begins when a user presses a key
function keyDown(event) {
  var key = event.key;

  // first check if there are any attempts remaining
  if (attemptCounter > 0) {
    if (allowedChars.includes(key)) {
      warningId.textContent = "";
      if (!attemptChars.includes(key)) {
        // user had not tried key -> add key to list of attempts, decrease remaining attempts by 1
        attemptChars += key;
        --attemptCounter;
        if (answer.includes(key)) {
          // user has guessed a correct letter
          // get the index of the first occurrence of the letter
          var position = answer.indexOf(key);
          // get all occurrences of the letter to replace dashes on screen
          while (position > -1) {
            // replace underscore with correct letter
            answerDisplay = replaceDash(answerDisplay, position, key);
            position = answer.indexOf(key, position + 1);
          }
          if (answerDisplay === answer) {
            warningId.textContent = "You win!";
          }
        }
      }
    } else {
      warningId.textContent = "Please select a letter from the latin alphabet.";
    }
    answerDisplayId.textContent = answerDisplay;
    attemptCharsId.innerHTML =
      `Attempts left: ` +
      attemptCounter +
      `<br/>Attempted letters: ` +
      attemptChars;
    // } while (answerDisplay.indexOf("_") > -1);

    // playArea.textContent += `${event.key}`;
  } else {
    // Create a new paragraph element, and append it to the end of the document body
    warningId.textContent = "Game over!";
  }
}

// initialize the game with the user's first keypress

// check if the user has not tried this key before
// do {

// Define a custom function to replace underscores in the 'answerDisplay' string with the actual correct
// letters
function replaceDash(strRef, position, str) {
  return strRef.substring(0, position) + str + strRef.substring(position + 1);
}
