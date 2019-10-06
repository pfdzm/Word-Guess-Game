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

var startGame = true;

document.onkeydown = keyDown;

// fun begins when a user presses a key
function keyDown(event) {
  var key = event.key;

  if (startGame) {
    // keep things easy by making everything lowercase
    answer = pickAnswer(dictionary).toLowerCase();
    answerDisplay = anonimizeAnswer(answer);
    answerDisplayId.textContent = answerDisplay;
    attemptCharsId.innerHTML =
      `Attempts left: ` +
      attemptCounter +
      `<br/>Attempted letters: ` +
      attemptChars;
    startGame = false;
  } else {
    // first check if there are any attempts remaining
    if (attemptCounter > 0) {
      if (allowedChars.includes(key)) {
        warningId.textContent = "";
        if (!attemptChars.includes(key)) {
          // user had not tried key -> add key to list of attempts, decrease remaining attempts by 1
          attemptChars += key;
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
          } else --attemptCounter;
        }
      } else {
        warningId.textContent =
          "Please select a letter from the latin alphabet.";
      }
      answerDisplayId.textContent = answerDisplay;
      attemptCharsId.innerHTML =
        `Attempts left: ` +
        attemptCounter +
        `<br/>Attempted letters: ` +
        attemptChars;
    } else {
      warningId.textContent = "Game over!";
    }
  }
}

// Custom function to clean up code; takes a string, a position and a substring to replace at said position

function replaceDash(strRef, position, str) {
  return strRef.substring(0, position) + str + strRef.substring(position + 1);
}

// Another custom function to clean up code, this one takes a string a replaces every
// letter with an underscore

function anonimizeAnswer(str) {
  var tempStr = "";
  for (let index = 0; index < str.length; index++) {
    tempStr += `_`;
  }

  return tempStr;
}

function pickAnswer(dictionary) {
  var randInt = Math.floor(Math.random() * dictionary.length);
  return dictionary[randInt];
}
