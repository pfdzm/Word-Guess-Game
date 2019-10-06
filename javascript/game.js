// dictionary of words to choose from randomly, words are case insensitive
// 'programming' theme
var dictionary = [
  "terminal",
  "JavaScript",
  "Windows",
  "Linux",
  "Macintosh",
  "Commodore",
  "Amiga"
];

// sanitize input to focus on alphabet letters only
var allowedChars = "abcdefghijklmnopqrstuvwxyz";
/*
declare variables
answer will contain the chosen word from dictionary
answerDisplay will contain the answer substituted with underscores/correct guesses
attemptCounter keeps track of wrong guesses
attemptChars contains all previously guessed letters

they are initialized later, no need for it here

*/
var answer, answerDisplay, attemptCounter, attemptChars;

var win = 0,
  loss = 0;

// select elements to put data into
var target = document.querySelector("#playArea");
var app = document.querySelector("#app");
var answerDisplayId = document.querySelector("#answerDisplay");
var attemptCharsId = document.querySelector("#attemptChars");
var warningId = document.querySelector("#warning");
var scoreId = document.querySelector("#score");
var answerImgId = document.querySelector("img#answer");

// this variable is used to trigger a new game
var startGame = true;

// listen for keydown events on the whole page
document.onkeydown = keyDown;

// fun begins when a user presses a key
function keyDown(event) {
  var key = event.key;
  // resume Audio Context after user interaction so browser lets us play a sound
  context.resume();

  // if it's the first keypress, we need to select a word and display the blanks on the screen
  if (startGame) {
    // keep things easy by making everything lowercase
    answer = pickAnswer(dictionary).toLowerCase();
    answerDisplay = anonimizeAnswer(answer);
    attemptChars = "";
    attemptCounter = 12;
    warningId.textContent = "";
    startGame = false;
    updatePage(
      answerDisplayId,
      answerDisplay,
      attemptCharsId,
      attemptCounter,
      attemptChars
    );
  } else {
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
            playSuccess();
            scoreId.textContent = `Wins: ${++win}, Losses: ${loss}`;
            warningId.textContent = "You win! Press any key to play again...";
            startGame = true;
          }
        } else if (--attemptCounter == 0) {
          playError();
          scoreId.textContent = `Wins: ${win}, Losses: ${++loss}`;
          warningId.textContent = "Game over! Press any key to play again...";
          startGame = true;
          updatePage(
            answerDisplayId,
            answerDisplay,
            attemptCharsId,
            attemptCounter,
            attemptChars
          );
        }
      }
    } else {
      // let user know we only accept abc-input
      warningId.textContent = "Letters only!";
    }
    updatePage(
      answerDisplayId,
      answerDisplay,
      attemptCharsId,
      attemptCounter,
      attemptChars
    );
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

// updates guesses on screen
function updatePage(
  answerDisplayId,
  answerDisplay,
  attemptCharsId,
  attemptCounter,
  attemptChars
) {
  answerImgId.setAttribute("src", `images/${answer.toLowerCase()}.jpg`);
  answerImgId.setAttribute("class", "styled");
  answerDisplayId.textContent = answerDisplay;

  attemptCharsId.innerHTML = `
  Attempts left: ${attemptCounter} <br/>Attempted letters: <span id="attempts">${attemptChars}</span>
  `;
}

// from https://css-tricks.com/form-validation-web-audio/

const context = new window.AudioContext();

function playSuccess() {
  const successNoise = context.createOscillator();
  successNoise.frequency = "600";
  successNoise.type = "sine";
  successNoise.frequency.exponentialRampToValueAtTime(
    800,
    context.currentTime + 0.05
  );
  successNoise.frequency.exponentialRampToValueAtTime(
    1000,
    context.currentTime + 0.15
  );

  successGain = context.createGain();
  successGain.gain.exponentialRampToValueAtTime(
    0.01,
    context.currentTime + 0.3
  );

  successFilter = context.createBiquadFilter("bandpass");
  successFilter.Q = 0.01;

  successNoise
    .connect(successFilter)
    .connect(successGain)
    .connect(context.destination);
  successNoise.start();
  successNoise.stop(context.currentTime + 0.2);
}

function playError() {
  const errorNoise = context.createOscillator();
  errorNoise.frequency = "400";
  errorNoise.type = "sine";
  errorNoise.frequency.exponentialRampToValueAtTime(
    200,
    context.currentTime + 0.05
  );
  errorNoise.frequency.exponentialRampToValueAtTime(
    100,
    context.currentTime + 0.2
  );

  errorGain = context.createGain();
  errorGain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);

  errorNoise.connect(errorGain).connect(context.destination);
  errorNoise.start();
  errorNoise.stop(context.currentTime + 0.3);
}
