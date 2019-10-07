/* game object */

var game = {
  gameSettings: {
    dictionary: [
      "terminal",
      "JavaScript",
      "Windows",
      "Linux",
      "Macintosh",
      "Commodore",
      "Amiga"
    ],
    allowedChars: "abcdefghijklmnopqrstuvwxyz"
  },
  gameState: {
    answer,
    answerDisplay,
    attemptCounter: 12,
    attemptChars: ""
  },
  selectors: {
    app: document.querySelector("#app"),
    target: document.querySelector("#playArea"),
    answerDisplayId: document.querySelector("#answerDisplay"),
    attemptCharsId: document.querySelector("#attemptChars"),
    warningId: document.querySelector("#warning"),
    scoreId: document.querySelector("#score"),
    answerImgId: document.querySelector("img#answer"),
    unmuteId: document.querySelector("button#unmute"),
    audioId: document.querySelector("#musicplayer")
  },
  score: {
    win: 0,
    loss: 0
  },
  start() {
    game.gameState.answer = game
      .pickAnswer(game.gameSettings.dictionary)
      .toLowerCase();
    game.gameState.attemptChars = "";
    game.gameState.attemptCounter = 12;
  },
  pickAnswer(str) {
    var randInt = Math.floor(Math.random() * str.length);
    var tempStr = "";
    for (let index = 0; index < str[randInt].length; index++) {
      tempStr += `_`;
    }
    game.gameState.answerDisplay = tempStr;
    return str[randInt];
  },
  update() {
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
  toggleAudio() {
    var music = game.selectors.audioId;
    music.volume = 0.5;
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
  keyDown(event) {
    var key = event.key;
    game.checkKey(key);
    game.update();
  },
  checkKey(key) {
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

            game.playSuccess();
            game.start();
          }
        } else if (--game.gameState.attemptCounter == 0) {
          // playError();
          game.selectors.scoreId.textContent = `Wins: ${
            game.score.win
          }, Losses: ${++game.score.loss}`;

          game.playError();
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
  },
  // audio stuff with some help
  // from https://css-tricks.com/form-validation-web-audio/
  context: new window.AudioContext(),
  playSuccess() {
    const successNoise = game.context.createOscillator();
    successNoise.frequency = "600";
    successNoise.type = "sine";
    successNoise.frequency.exponentialRampToValueAtTime(
      800,
      game.context.currentTime + 0.05
    );
    successNoise.frequency.exponentialRampToValueAtTime(
      1000,
      game.context.currentTime + 0.15
    );

    successGain = game.context.createGain();
    successGain.gain.exponentialRampToValueAtTime(
      0.01,
      game.context.currentTime + 0.3
    );

    successFilter = game.context.createBiquadFilter("bandpass");
    successFilter.Q = 0.01;

    successNoise
      .connect(successFilter)
      .connect(successGain)
      .connect(game.context.destination);
    successNoise.start();
    successNoise.stop(game.context.currentTime + 0.2);
  },
  playError() {
    const errorNoise = game.context.createOscillator();
    errorNoise.frequency = "400";
    errorNoise.type = "sine";
    errorNoise.frequency.exponentialRampToValueAtTime(
      200,
      game.context.currentTime + 0.05
    );
    errorNoise.frequency.exponentialRampToValueAtTime(
      100,
      game.context.currentTime + 0.2
    );

    errorGain = game.context.createGain();
    errorGain.gain.exponentialRampToValueAtTime(
      0.01,
      game.context.currentTime + 0.3
    );

    errorNoise.connect(errorGain).connect(game.context.destination);
    errorNoise.start();
    errorNoise.stop(game.context.currentTime + 0.3);
  }
};

// listen for keydown events on the whole page
// document.onkeydown = game.keyDown;
// const context = new window.Audiogame.context();
game.start();
document.addEventListener("keydown", game.keyDown);
game.selectors.unmuteId.addEventListener("click", game.toggleAudio);
