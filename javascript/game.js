var app = document.querySelector("#app");
var target = document.querySelector("#playArea");
var word = "";

// dictionary of words to choose from randomly
var dictionary = ["console", "bootstrap", "querySelector", "innerHTML"];

// TODO: randomizer to pick answer word
var answer = dictionary[1];
var answerDisplay = "";
var answerDisplayId = document.querySelector("#answerDisplay");

// sanitize input to focus on letters only
var allowedChars = "abcdefghijklmnopqrstuvxyz";
// create a variable of the same length as answer, but with all characters as an underscore
for (let index = 0; index < answer.length; index++) {
  answerDisplay += `_`;
}
// user has 10 attemps; we need to keep track of what characters the user has attempted and display them on screen
var attemptCounter = 10;
var attemptChars = "";
var attemptCharsId = document.querySelector("#attemptChars");

var warningId = document.querySelector("#warning");

document.onkeydown = keyDown;

// fun begins when a user presses a key
function keyDown(event) {
  var key = event.key;

  // check if the user has not tried this key before
  // do {
  if (allowedChars.includes(key)) {
    warningId.textContent = "";
    if (!attemptChars.includes(key)) {
      // user had not tried key -> add key to list of attempts, decrease remaining attempts by 1
      attemptChars += key;
      attemptCounter--;
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
}

// Define a custom function to replace underscores in the 'answerDisplay' string with the actual correct
// letters
function replaceDash(strRef, position, str) {
  return strRef.substring(0, position) + str + strRef.substring(position + 1);
}
