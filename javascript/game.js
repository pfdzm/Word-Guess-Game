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
    this.pickAnswer(this.gameSettings.dictionary);
    this.gameState.attemptChars = "";
    this.gameState.attemptCounter = 12;
  },
  pickAnswer(str) {
    var randInt = Math.floor(Math.random() * str.length);
    var tempStr = "";
    for (let index = 0; index < str[randInt].length; index++) {
      tempStr += `_`;
    }
    this.gameState.answerDisplay = tempStr;
    this.gameState.answer = str[randInt].toLowerCase();
  },
  update() {
    this.selectors.answerImgId.setAttribute(
      "src",
      `images/${this.gameState.answer.toLowerCase()}.jpg`
    );
    this.selectors.answerImgId.setAttribute("class", "styled");
    this.selectors.answerDisplayId.textContent = this.gameState.answerDisplay;

    this.selectors.attemptCharsId.innerHTML = `
  Attempts left: ${this.gameState.attemptCounter} <br/>Attempted letters: <span id="attempts">${this.gameState.attemptChars}</span>
  `;
  },
  toggleAudio() {
    var music = game.selectors.audioId;
    music.volume = 0.5;
    if (music.paused) {
      music.play();
      music.loop = true;
      this.textContent = "Pause music";
    } else {
      music.pause();
      this.textContent = "Play music";
    }
  },
  keyDown(event) {
    var key = event.key;

    // if we call 'this.checkKey()' here, the function would be in the wrong scope
    // make sure checkKey's scope is the game object
    game.checkKey(key);
    game.update();
  },
  checkKey(key) {
    if (this.gameSettings.allowedChars.includes(key)) {
      this.selectors.warningId.textContent = "";
      if (!this.gameState.attemptChars.includes(key)) {
        // user had not tried key -> add key to list of attempts, decrease remaining attempts by 1
        this.gameState.attemptChars += key;
        if (this.gameState.answer.includes(key)) {
          // user has guessed a correct letter
          // get the index of the first occurrence of the letter
          var position = this.gameState.answer.indexOf(key);
          // get all occurrences of the letter to replace dashes on screen
          while (position > -1) {
            // replace underscore with correct letter
            this.gameState.answerDisplay = this.replaceDash(
              this.gameState.answerDisplay,
              position,
              key
            );
            position = this.gameState.answer.indexOf(key, position + 1);
          }
          if (this.gameState.answerDisplay === this.gameState.answer) {
            // playSuccess();
            this.selectors.scoreId.textContent = `Wins: ${++this.score
              .win}, Losses: ${this.score.loss}`;

            this.playSuccess();
            this.start();
          }
        } else if (--this.gameState.attemptCounter == 0) {
          // playError();
          this.selectors.scoreId.textContent = `Wins: ${
            this.score.win
          }, Losses: ${++this.score.loss}`;

          this.playError();
          this.start();
        }
      }
    } else {
      // let user know we only accept abc-input
      this.selectors.warningId.textContent = "Letters only!";
    }
    // uncomment the following statement to track game state in console after each keydown
    console.log(this.gameState);
  },
  replaceDash(strRef, position, str) {
    return strRef.substring(0, position) + str + strRef.substring(position + 1);
  },
  // audio stuff with some help
  // from https://css-tricks.com/form-validation-web-audio/
  context: new window.AudioContext(),
  playSuccess() {
    const successNoise = this.context.createOscillator();
    successNoise.frequency = "600";
    successNoise.type = "sine";
    successNoise.frequency.exponentialRampToValueAtTime(
      800,
      this.context.currentTime + 0.05
    );
    successNoise.frequency.exponentialRampToValueAtTime(
      1000,
      this.context.currentTime + 0.15
    );

    successGain = this.context.createGain();
    successGain.gain.exponentialRampToValueAtTime(
      0.01,
      this.context.currentTime + 0.3
    );

    successFilter = this.context.createBiquadFilter("bandpass");
    successFilter.Q = 0.01;

    successNoise
      .connect(successFilter)
      .connect(successGain)
      .connect(this.context.destination);
    successNoise.start();
    successNoise.stop(this.context.currentTime + 0.2);
  },
  playError() {
    const errorNoise = this.context.createOscillator();
    errorNoise.frequency = "400";
    errorNoise.type = "sine";
    errorNoise.frequency.exponentialRampToValueAtTime(
      200,
      this.context.currentTime + 0.05
    );
    errorNoise.frequency.exponentialRampToValueAtTime(
      100,
      this.context.currentTime + 0.2
    );

    errorGain = this.context.createGain();
    errorGain.gain.exponentialRampToValueAtTime(
      0.01,
      this.context.currentTime + 0.3
    );

    errorNoise.connect(errorGain).connect(this.context.destination);
    errorNoise.start();
    errorNoise.stop(this.context.currentTime + 0.3);
  }
};

// listen for keydown events on the whole page
// document.onkeydown = game.keyDown;
// const context = new window.Audiogame.context();
game.start();
document.addEventListener("keydown", game.keyDown);
game.selectors.unmuteId.addEventListener("click", game.toggleAudio);
