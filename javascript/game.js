/* game object */

var game = {
  // the gameSettings object holds both the pool of words, as well as the allowed characters (a-z)
  gameSettings: {
    dictionary: [
      "terminal",
      "JavaScript",
      "Windows",
      "Linux",
      "Macintosh",
      "Commodore",
      "Amiga",
      "Steve Jobs",
      "Richard Stallman",
      "Bill Gates",
      "Mark Zuckerberg"
    ],
    allowedChars: "abcdefghijklmnopqrstuvwxyz"
  },
  // in the gameState object I'm keeping track of values that are changed (almost) every keypress
  gameState: {
    answer,
    answerDisplay,
    attemptCounter: 12,
    attemptChars: ""
  },
  // these are selectors used in some of the game methods, to reduce clutter
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
  // the score object keeps track of the player's overall score
  score: {
    win: 0,
    loss: 0
  },
  // the start method initializes the game, picking an answer and (re)setting
  // number of guesses and guessed letters
  start() {
    this.pickAnswer(this.gameSettings.dictionary);
    this.gameState.attemptChars = "";
    this.gameState.attemptCounter = 12;
    this.update();
    this.fetchImg();
  },
  pickAnswer(dict) {
    // str is an array of strings
    // since this is 'truly' random, essentially we could end up with the same answer several times in a row ...
    // we generate a random int between 0 and dict.length-1
    var randInt = Math.floor(Math.random() * dict.length);

    // answer is set to a random string from the str array (and made lowercase to avoid filesystem shenanigans)
    this.gameState.answer = dict[randInt].toLowerCase();
    // RegEx looks prettier all on one line, essentially the regex matches any letter a-z
    this.gameState.answerDisplay = dict[randInt].replace(/[a-z]/gi, "_");
  },
  // the update method changes the HTML on the page to always display the current state
  update() {
    this.selectors.answerDisplayId.textContent = this.gameState.answerDisplay;
    this.selectors.attemptCharsId.innerHTML = `
  Attempts left: ${this.gameState.attemptCounter} <br/>
  Attempted letters: <span id="attempts">${this.gameState.attemptChars}</span>
  `;
  },
  // this method sets the src attribute for the image corresponding to the chosen answer
  fetchImg() {
    this.selectors.answerImgId.setAttribute(
      "src",
      `images/${this.gameState.answer.replace(/[^\w]/gi, "")}.jpg` // regex matches any non a-z character and removes it
    );
    // the 'answer img' isn't styled until an img isn't picked, to avoid a border around an empty element before load
    this.selectors.answerImgId.setAttribute("class", "styled");
  },
  // this method turns the background music on. since browsers now prevent autoplay before user interaction, require user
  // to press the button to start the music
  toggleAudio() {
    var music = game.selectors.audioId;
    music.volume = 0.5;
    if (music.paused) {
      music.play();
      music.loop = true;
      // 'this' in this scope refers to the game.selectors.unmuteId
      this.textContent = "Pause music";
    } else {
      music.pause();
      this.textContent = "Play music";
    }
  },
  // this function is triggered any time user presses a key
  keyDown(event) {
    var key = event.key;

    // if we call 'this.checkKey()' here, the function would be in the wrong scope
    // make sure checkKey's scope is the game object
    game.checkKey(key);
    game.update();
  },
  // here's the game logic
  checkKey(key) {
    // if key is a-z
    if (this.gameSettings.allowedChars.includes(key)) {
      this.selectors.warningId.textContent = "";
      // if key has not been guessed in this round already
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
            this.gameState.answerDisplay = this.replaceAt(
              this.gameState.answerDisplay,
              position,
              key
            );
            position = this.gameState.answer.indexOf(key, position + 1);
          }
          if (this.gameState.answerDisplay === this.gameState.answer) {
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
  replaceAt(strRef, position, str) {
    return strRef.substring(0, position) + str + strRef.substring(position + 1);
  },
  // audio stuff with some help
  // the following methods use the Web Audio API to synthesize two sounds
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
document.addEventListener("keydown", game.keyDown);
// intialize the game the game
game.start();
// listen for clicks on the 'play music' button
game.selectors.unmuteId.addEventListener("click", game.toggleAudio);
