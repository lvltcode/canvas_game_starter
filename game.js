/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/

let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

let bgReady, heroReady, monsterReady;
let bgImage, heroImage, monsterImage;
let bgSound, catchSound, gameOver;

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function() {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/background.png";
  heroImage = new Image();
  heroImage.onload = function() {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "images/hero.png";

  monsterImage = new Image();
  monsterImage.onload = function() {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "images/monster.png";
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function() {
    this.sound.play();
  };
  this.stop = function() {
    this.sound.pause();
  };
}

function loadSounds() {
  bgSound = new sound("sounds/bg-sound.mp3");
  catchSound = new sound("sounds/eat.wav");
  gameOver = new sound("sounds/game-over.mp3");
}

/**
 * Setting up our characters.
 *
 * Note that heroX represents the X position of our hero.
 * heroY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 *
 * The same applies to the monster.
 */
let heroX = canvas.width / 2;
let heroY = canvas.height / 2;

let monsterX = 32 * (Math.floor(Math.random() * 10) + 6) - 16;
let monsterY = 32 * (Math.floor(Math.random() * 10) + 5) - 16;

function reset() {
  monsterX = 32 * (Math.floor(Math.random() * 10) + 6) - 16;
  monsterY = 32 * (Math.floor(Math.random() * 10) + 5) - 16;
}

/**
 * Keyboard Listeners
 * You can safely ignore this part, for now.
 *
 * This is just to let JavaScript know when the user has pressed a key.
 */
let keysDown = {};

function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here.
  addEventListener(
    "keydown",
    function(key) {
      keysDown[key.keyCode] = true;
    },
    false
  );

  addEventListener(
    "keyup",
    function(key) {
      delete keysDown[key.keyCode];
    },
    false
  );
}

/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *
 *  If you change the value of 5, the player will move at a different rate.
 */
let monstersCaught = 0;

let update = function() {
  if (38 in keysDown) {
    // Player is holding up key
    heroY -= 5;
  }
  if (40 in keysDown) {
    // Player is holding down key
    heroY += 5;
  }
  if (37 in keysDown) {
    // Player is holding left key
    heroX -= 5;
  }
  if (39 in keysDown) {
    // Player is holding right key
    heroX += 5;
  }

  heroX = Math.min(canvas.width - 32, heroX);
  heroX = Math.max(0, heroX);

  heroY = Math.min(canvas.height - 32, heroY);
  heroY = Math.max(0, heroY);

  monsterX = monsterX + Math.floor(Math.random() * (60 + 1) - 30);
  monsterY = monsterY + Math.floor(Math.random() * (60 + 1) - 30);

  monsterX = Math.min(canvas.width - 32, monsterX);
  monsterX = Math.max(0, monsterX);

  monsterY = Math.min(canvas.height - 32, monsterY);
  monsterY = Math.max(0, monsterY);

  // Check if player and monster collided. Our images
  // are about 32 pixels big.
  if (
    heroX <= monsterX + 32 &&
    monsterX <= heroX + 32 &&
    heroY <= monsterY + 32 &&
    monsterY <= heroY + 32
  ) {
    // Pick a new location for the monster.
    // Note: Change this to place the monster at a new, random location.
    ++monstersCaught;
    catchSound.play();
    // catchSound.stop();
    reset();
  }
};

/**
 * This function, render, runs as often as possible.
 */
let count = 15;
let finished = false;
// timer interval is every second (1000 = 1s)
let timer = setInterval(counter, 1000);

function counter() {
  count--; // countown by 1 every second
  // when count reaches 0 clear the timer, hide monster and
  // hero and finish the game
  if (count <= 0) {
    // stop the timer
    clearInterval(counter);
    // set game to finished
    finished = true;
    count = 0;
    // hider monster and hero
    monsterReady = false;
    heroReady = false;
  }
}

var render = function() {
  bgSound.play();
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }
  
  let timeLeft = count;
  ctx.fillStyle = "yellow";
  ctx.font = "24px Courier New";
  ctx.fillText(
    "Monsters caught: " + monstersCaught,
    canvas.width / 2 - 30,
    canvas.height - 20
  );
  ctx.fillText("Time: " + timeLeft, 20, canvas.height - 20);
  ctx.font = "24px Courier New";

  if (finished == true) {
    ctx.fillStyle = "red";
    ctx.font = "30px Courier New";
    ctx.fillText("Game over!", 170, 220);
    bgSound.stop();
    catchSound.stop();
    gameOver.play();
    ctx.fillText("Your caught " + monstersCaught + " sh*ts", 90, 250);
    clearInterval(timer);
  }
  if (monstersCaught === 10) {
    finished == true;
    ctx.fillStyle = "white";
    ctx.font = "36px Courier New";
    ctx.fillText("You win!", 180, 220);
    ctx.font = "24px Courier New";
    ctx.fillText("Your score is: " + count, 140, 250);
    clearInterval(timer);
    // setInterval(counter, 100000);
    monsterReady = false;
    heroReady = false;
  }
};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
var main = function() {
  update();
  render();
  // Request to do this again ASAP. This is a special method
  // for web browsers.
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
loadSounds();
setupKeyboardListeners();
main();
