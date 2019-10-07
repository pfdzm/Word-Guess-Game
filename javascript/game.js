// dictionary of words to choose from randomly, words are case insensitive
// 'programming' theme
// sanitize input to focus on alphabet letters only
var allowedChars = "abcdefghijklmnopqrstuvwxyz";

var dictionary = [
  "terminal",
  "JavaScript",
  "Windows",
  "Linux",
  "Macintosh",
  "Commodore",
  "Amiga"
];

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
var unmuteId = document.querySelector("button#unmute");
var audioId = document.querySelector("#musicplayer");

// this variable is used to trigger a new game
var startGame = true;

/* game object */

var game = {
  gameSettings: { dictionary, allowedChars },
  gameState: {
    answer,
    answerDisplay,
    attemptCounter,
    attemptChars,
    startGame
  },
  selectors: {
    app,
    target,
    answerDisplayId,
    attemptCharsId,
    warningId,
    scoreId,
    answerImgId,
    unmuteId,
    audioId
  },
  score: {
    win,
    loss
  },
  start: function() {
    game.gameState.answer = game
      .pickAnswer(game.gameSettings.dictionary)
      .toLowerCase();
    game.gameState.attemptChars = "";
    game.gameState.attemptCounter = 12;
    game.gameState.startGame = false;
  },
  pickAnswer: function(str) {
    var randInt = Math.floor(Math.random() * str.length);
    var tempStr = "";
    for (let index = 0; index < str[randInt].length; index++) {
      tempStr += `_`;
    }
    game.gameState.answerDisplay = tempStr;
    return str[randInt];
  },
  update: function() {
    game.selectors.answerImgId.setAttribute(
      "src",
      `images/${game.gameState.answer.toLowerCase()}.jpg`
    );
    game.selectors.answerImgId.setAttribute("class", "styled");
    game.selectors.answerDisplayId.textContent = game.gameState.answerDisplay;

    game.selectors.attemptCharsId.innerHTML = `
  Attempts left: ${game.gameState.attemptCounter} <br/>Attempted letters: <span id="attempts">${game.gameState.attemptChars}</span>
  `;
  },
  toggleAudio: function() {
    var music = game.selectors.audioId;
    var button = game.selectors.unmuteId;
    if (music.paused) {
      music.play();
      music.loop = true;
      button.textContent = "Pause music";
    } else {
      music.pause();
      button.textContent = "Play music";
    }
  },
  keyDown: function(event) {
    console.log(event);
    var key = event.key;
    game.checkKey(key);
    game.update();
  },
  checkKey: function(key) {
    console.log(game);
    if (game.gameSettings.allowedChars.includes(key)) {
      game.selectors.warningId.textContent = "";
      if (!game.gameState.attemptChars.includes(key)) {
        // user had not tried key -> add key to list of attempts, decrease remaining attempts by 1
        game.gameState.attemptChars += key;
        if (game.gameState.answer.includes(key)) {
          // user has guessed a correct letter
          // get the index of the first occurrence of the letter
          var position = game.gameState.answer.indexOf(key);
          // get all occurrences of the letter to replace dashes on screen
          while (position > -1) {
            // replace underscore with correct letter
            game.gameState.answerDisplay = game.replaceDash(
              game.gameState.answerDisplay,
              position,
              key
            );
            position = game.gameState.answer.indexOf(key, position + 1);
          }
          if (game.gameState.answerDisplay === game.gameState.answer) {
            // playSuccess();
            game.selectors.scoreId.textContent = `Wins: ${++game.score
              .win}, Losses: ${game.score.loss}`;
            game.selectors.warningId.textContent =
              "You win! Press any key to play again...";
            game.start();
          }
        } else if (--game.gameState.attemptCounter == 0) {
          // playError();
          game.selectors.scoreId.textContent = `Wins: ${
            game.score.win
          }, Losses: ${++game.score.loss}`;
          game.selectors.warningId.textContent =
            "Game over! Press any key to play again...";
          game.start();
        }
      }
    } else {
      // let user know we only accept abc-input
      game.selectors.warningId.textContent = "Letters only!";
    }
  },
  replaceDash(strRef, position, str) {
    return strRef.substring(0, position) + str + strRef.substring(position + 1);
  }
};

// listen for keydown events on the whole page
// document.onkeydown = game.keyDown;
game.start();
document.addEventListener("keydown", game.keyDown);

// game.selectors.unmuteId.addEventListener("click", game.toggleAudio());

// Another custom function to clean up code, this one takes a string a replaces every
// letter with an underscore

function anonimizeAnswer(str) {
  var tempStr = "";
  for (let index = 0; index < str.length; index++) {
    tempStr += `_`;
  }

  return tempStr;
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
