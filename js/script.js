/* GameBoard contains all relevant location info, keyboard info, player lives*/
class GameBoard {
  /**
   * @param  {} width
   * @param  {} height    Dimensions of game board
   * @param  {} gameLives  Player lives, 3 by default
   */
  constructor(width, height, gameLives = 3) {
    this.width = width;
    this.height = height;

    //array of all positions of all objects
    this.posArr = [];
    this.key = ""; //current key being pressed in DOM
    this.gameTimer = 0;
    this.gameLives = gameLives;
    this.gameSpeed = 200; //interval rate, default: 200ms
    this.newSpeed = this.gameSpeed;
    this.gamePoints = 0;

    //the initialization of posArr with zero values
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        this.posArr.push({
          0: undefined, //current icon val
          1: i, //row
          2: j, //row index
          3: undefined, //prev icon, for trailing
        });
      }
    }
  }
  /**initTable: creates a dom element Table the size of the gameboard and appends
   * it to the argument object
   * @param  {object} parentElement DOM element to append the initialized table to
   */
  initTable(parentElement) {
    
    let table = document.createElement("table");
    table.id = "game-table";
    let domArr = [];
    for (let i = 0; i < this.height; i++) {
      let tr = document.createElement("tr");
      table.appendChild(tr);
      for (let j = 0; j < this.width; j++) {
        let td = document.createElement("td");
        tr.appendChild(td);
        domArr.push(td);
      }
    }
    
    parentElement.prepend(table);
    return domArr;
  }
  /** take 2d array coordinates and convert into 1d representation
   * @param  {} i row
   * @param  {} j index
   */
  pos(i, j) {
    return this.width * i + j;
  }
}
/* Snake contains all variables and functions related to position and collision of the snake on GameBoard */
class Snake {
  /**create a new snake on argument gameBoard
   * @param  {} initialLength  initial snake length, generate random bugs to be a part
   * @param  {} gameBoard  passed gameboard is where the snake will be attached
   * @param  {} previousTail=[]  If this is passes, it means the player has lost a life and this array of objects needs to be put into the start position
   */
  constructor(initialLength, gameBoard, previousTail = []) {
    this.gameBoard = gameBoard;
    this.arr = [];
    this.currentDirection = "ArrowRight";
    this.grow = 0; //any value > 0 will cause the tail to grow by that many units
    /* determine if we're creating a new snake or if the player just lost a life
      if the snake is new, randomly generate the tail, otherwise used the previousTail parameter to build the tail
    */
    let length =
      previousTail.length > initialLength ? previousTail.length : initialLength;
    for (let i = 0; i < length; i++) {
      let newNode = gameBoard.posArr[this.gameBoard.pos(Math.floor(this.gameBoard.height / 2), i)];
  
      let randomBug = Math.floor(Math.random() * 3) + 2;
      newNode[0] = randomBug;
      newNode[3] = randomBug;
      this.arr.push(newNode);
    }
  }
  //Called when player loses a life, returns the current tail icon values
  getTail() {
    return this.arr.map((val) => val[3]);
  }
  /* Called on render(), update the snakes direction based on keyboard input
  ensure the snake cannot backtrack on its own path */
  updateDirection() {
    if (this.gameBoard.key === "ArrowUp") {
      if (this.currentDirection !== "ArrowDown") {
        this.currentDirection = "ArrowUp";
      }
    } else if (this.gameBoard.key === "ArrowDown") {
      if (this.currentDirection !== "ArrowUp") {
        this.currentDirection = "ArrowDown";
      }
    } else if (this.gameBoard.key === "ArrowLeft") {
      if (this.currentDirection !== "ArrowRight") {
        this.currentDirection = "ArrowLeft";
      }
    } else if (this.gameBoard.key === "ArrowRight") {
      if (this.currentDirection !== "ArrowLeft") {
        this.currentDirection = "ArrowRight";
      }
    }
  }
  /* Called on render() this function moves the snake by creating a new head
  shifting all of the icon values over 1 space.
  
  Remove the tail unless a collision has caused snake.grow > 1, then let the tail grow*/
  updatePosition() {
    //set new head based on direction
    let oldHead = this.arr[this.arr.length - 1];
    oldHead[0] = oldHead[3];
    let pos = 0,
      spriteDirection = 0;
    let newHead = {};
    //logic for directional changes, check for wall collision to allow it to pass thru walls
    switch (this.currentDirection) {
      case "ArrowUp":
        if (oldHead[1] !== 0) pos = gameBoard.pos(oldHead[1] - 1, oldHead[2]);
        else pos = gameBoard.pos(gameBoard.height - 1, oldHead[2]);
        spriteDirection = 10;
        break;
      case "ArrowDown":
        if (oldHead[1] !== gameBoard.height - 1)
          pos = gameBoard.pos(oldHead[1] + 1, oldHead[2]);
        else pos = gameBoard.pos(0, oldHead[2]);
        spriteDirection = 12;
        break;
      case "ArrowLeft":
        if (oldHead[2] !== 0) pos = gameBoard.pos(oldHead[1], oldHead[2] - 1);
        else pos = gameBoard.pos(oldHead[1], gameBoard.width - 1);
        spriteDirection = 11;
        break;
      case "ArrowRight":
        if (oldHead[2] !== gameBoard.width - 1)
          pos = gameBoard.pos(oldHead[1], oldHead[2] + 1);
        else pos = gameBoard.pos(oldHead[1], 0);
        spriteDirection = 13;
        break;
    }

    let iconValues = this.getTail();
    if (this.grow > 0) this.grow--;
    else {
      let tail = this.arr.shift();
      tail[0] = undefined;
      tail[3] = undefined;
    }

    newHead = gameBoard.posArr[pos];
    newHead[3] = newHead[0];
    newHead[0] = spriteDirection;
    this.arr.forEach((val, idx) => {
      val[0] = iconValues[idx];
      val[3] = iconValues[idx];
    });
    this.arr.push(newHead);
  }
  /* if the head object is equal to any other part of the snake, it has collided with itself
    return codes indicate type of collision:
    return: 0 - no collision
            1 - collision with self
            -1 - collision with bug 
  */
  checkCollision() {
    let head = this.arr[this.arr.length - 1];
    let idx = this.arr.indexOf(head);
    let returnValue = 0;
    if (idx !== this.arr.length - 1) return 1;
    else if (bug) {
      bug.bugArr.forEach((val) => {
        if (val === head) {
          bug.onCollision(val);
          this.grow++;
          returnValue = -1;
        }
      });
    }
    return returnValue;
  }
}

/* Position of all bugs on GameBoard */
class Bug {
  /**
   * @param  {number} initialBugs how many bugs to start off on gameboard
   * @param  {obj arr} gameArr array of all positions passed from GameBoard
   * @param  {obj arr} snakeArr arry of objects which are the snake
   */
  constructor(initialBugs, gameArr, snakeArr) {
    this.gameArr = gameArr;
    this.snakeArr = snakeArr;
    this.bugArr = []; //array of objects representing position of bugs on GameBoard
    for (let i = 0; i < initialBugs; i++) {
      this.createBug();
    }
  }
  /* find a free space on the board, generate a random bug, add it to the array of bugs*/
  createBug() {
    let freeSpace = this.gameArr.filter((val) => val[0] === undefined);
    let randomSpace = Math.floor(Math.random() * freeSpace.length);
    let randomBug = Math.floor(Math.random() * 3) + 2;
    freeSpace[randomSpace][0] = randomBug;
    freeSpace[randomSpace][3] = randomBug;

    this.bugArr.push(freeSpace[randomSpace]);
  }
  /** Called by snake.checkCollision(), removes bug from array
   * @param  {object} affectedBug the bug to be removed
   */
  onCollision(affectedBug) {
    let idx = this.bugArr.findIndex((val) => val === affectedBug);
    this.bugArr.splice(idx, 1);
    this.createBug();
    this.createBug();
  }
}
/* Global Declarations */
let boardDimensions = [21, 25];
let gameBoard = new GameBoard(boardDimensions[0], boardDimensions[1]);
let snake = new Snake(1, gameBoard);
let initialBugs = 5;
let bug = new Bug(initialBugs, gameBoard.posArr, snake.arr);
let bgAudio = new Audio("./res/10 - whaa.mp3");


/* global DOM Object delaration */
let volumeSlider = null;
let bgAudioToggle = null;
let overlay = null;
let gameWindow = null;
let gameBoardDOM = null;
let dispScore = null;
let dispLives = null;
let dispHS = null;

/* misc game variables */
let localHighscore = localStorage.getItem("snakeByteHS");
let interval = null;

function globalInit() {
  //DOM
  gameWindow = document.getElementById("gameWindow");
  overlay = document.getElementById("overlay");
  bgAudioToggle = document.getElementById("musicToggle");
  dispScore = document.getElementById("score");
  dispLives = document.getElementById("lives");
  dispHS = document.getElementById("highscore");
  
  volumeSlider = document.getElementById("volumeSlider");
  bgAudio.volume = volumeSlider.value/10;
  
  //EventListeners
  gameWindow.addEventListener("click", onClick);
  document.addEventListener("keydown", onKeydown);
  // document.addEventListener("windowready",onResize);
  
  window.addEventListener('touchstart',onTouchstart);
  window.addEventListener('touchend',onTouchend);
  window.addEventListener('resize', onResize);
  window.addEventListener("load",onResize)
  
  gameBoardDOM = gameBoard.initTable(gameWindow); //draw table into document DOM
  bgAudio.load();
  
  //Check if a local highscore has been set, if not, use default 0 value
  if (localHighscore > 0) {
    scoreUpdate();
  }
  
}
globalInit();


/**Called by setInterval in onClick();
 *  * Calls functions to update snake position
 *  * logic to handle various collision scenarios
 *  * track score, update lives
 *  * DOM Manipulation
 */
function render() {
  gameBoard.gameTimer += gameBoard.gameSpeed / 1000;

  snake.updateDirection();
  snake.updatePosition();

  let updateOverlayString = "";
  let tail = snake.getTail();
  let isCollision = snake.checkCollision();
  //isCollision represents various collision situations
  // 1 = collide with self
  //-1 = collision with a bug
  // 0 = no collision
  if (isCollision == 1) {
    //when player collides with itself, reset the speed to game default and subtract a life
    gameBoard.gameLives--;
    gameBoard.newSpeed = gameBoard.gameSpeed;
    //Conditions for losing and winning the game occur when player has lost all lives
    //Win if they set a new highscore, lose otherwise.  Update local storage to reflect this
    if (gameBoard.gameLives <= 0) {
      overlay.children[0].innerHTML = "GAME OVER";
      updateOverlayString = "PRESS RESET TO PLAY AGAIN!";
      overlay.style.animationName = "red-flash-in";
      if (localStorage.getItem("snakeByteHS") < localHighscore) {
        overlay.children[0].innerHTML = "CONGRATS!";
        updateOverlayString =
          "YOU SET A NEW HIGH SCORE: " + localHighscore + "</br>" + updateOverlayString;
        overlay.style.animationName = "green-flash-in";
        localStorage.setItem("snakeByteHS", localHighscore);
      }
      overlay.children[1].innerHTML = updateOverlayString;
      overlay.children[2].innerHTML = "RESET / [ SPACE ]";

      gameBoard = new GameBoard(boardDimensions[0], boardDimensions[1]);
      tail = [];
    } else {
      overlay.children[0].innerHTML = "-1 LIFE";
      updateOverlayString = "PRESS CONTINUE TO KEEP GOING";
      overlay.children[1].innerHTML = updateOverlayString;
      overlay.children[2].innerHTML = "CONTINUE / [ SPACE ]";
      overlay.style.animationName = "red-flash-in";
      gameBoard.newSpeed = gameBoard.gameSpeed;
    }
    //when player loses a life, bring up the game overlay and wait for input to resume game
    overlay.style.display = "flex";
    clearInterval(interval);
    //when starting the game again, place snake back at default location
    //reset the bugs and start with default values again
    snake.arr.forEach((val) => ([val[0], val[3]] = [undefined, undefined]));
    bug.bugArr.forEach((val) => ([val[0], val[3]] = [undefined, undefined]));
    snake = new Snake(1, gameBoard, tail);
    bug = new Bug(initialBugs, gameBoard.posArr, snake.arr);
  } else if (isCollision === -1) {
    //when player collides with a bug, increase the score
    //every 5 bugs, increase the speed by 10% of the default, up to a reasonable level
    gameBoard.gamePoints++;

    if (gameBoard.gamePoints % 5 === 0) {
      gameBoard.newSpeed =
        gameBoard.newSpeed > 60 ? gameBoard.newSpeed - 20 : 60;
      clearInterval(interval);
      interval = setInterval(render, gameBoard.newSpeed);
    }
  }

  scoreUpdate();

  //Music playback code: check to ensure player wants music and game is in play
  if (
    bgAudioToggle.checked === true &&
    overlay.style.display === "none" &&
    bgAudio.readyState == 4){
    bgAudio.play();
  } else bgAudio.pause();
  /* Draw the gameboard
  iconvalues:
  2 - 4 : bugs 1 - 3
  1: snake
  10: snake up
  12: snake down
  11: snake right
  13: snake left
  
  */
  gameBoard.posArr.forEach((val, idx) => {
    if (val[0] >= 10) {
      gameBoardDOM[idx].id = "snake-head";
      if (val[0] === 10) {
        gameBoardDOM[idx].className = "pUp";
      } else if (val[0] === 12) {
        gameBoardDOM[idx].className = "pDown";
      } else if (val[0] === 11) {
        gameBoardDOM[idx].className = "pLeft";
      } else if (val[0] === 13) {
        gameBoardDOM[idx].className = "pRight";
      }
    } else if (val[0] == 2) {
      gameBoardDOM[idx].id = "bug-1";
      gameBoardDOM[idx].className = "";
    } else if (val[0] == 3) {
      gameBoardDOM[idx].id = "bug-2";
      gameBoardDOM[idx].className = "";
    } else if (val[0] == 4) {
      gameBoardDOM[idx].id = "bug-3";
      gameBoardDOM[idx].className = "";
    } else {
      gameBoardDOM[idx].id = undefined;
      gameBoardDOM[idx].className = "";
    }
  });
}
/* Called by render() function to update the score window */
function scoreUpdate() {
  localHighscore =
    gameBoard.gamePoints > localHighscore
      ? gameBoard.gamePoints
      : localHighscore;
      dispScore.innerHTML = Math.floor(gameBoard.gamePoints);
      dispLives.innerHTML = gameBoard.gameLives;
      dispHS.innerHTML = localHighscore;
}
/** click handler function
 * @param  {event} e returns where the click event took place
 */
function onClick(e) {
  //if player is clicking on the button, get back into the game
  //and resume the music
  //this applies at game start as well as between lives and on game end
  // secret menu:  reset localstorage if user clicks on HIGH SCORE 9 times
  let target = e.target;
  if (target.id === "start") {
    interval = setInterval(render, gameBoard.gameSpeed);
    overlay.style.display = "none";
  }else if(target.id === "ArrowUp" || target.id === "ArrowDown" || target.id === "ArrowLeft" || target.id === "ArrowRight"){
    
    gameBoard.key = target.id;
  } else if (target === dispHS) {
    cheatMode += cheatMode < 10 ? 1 : 0;
    if (cheatMode == 9) {
      localHighscore = 0;
      localStorage.setItem("snakeByteHS", 0);
      scoreUpdate();
    }
  }
}
/** keydown handler function
 * @param  {event} e returns keyboard event
    GameBoard keeps a reference of what key has been pressed, which is checked in the render function 
 */

function onKeydown(e) {
  let key = e.key;
  if(key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight")
    gameBoard.key = e.key;
  else if (key === " " && overlay.style.display != "none") {
    interval = setInterval(render, gameBoard.gameSpeed);
    overlay.style.display = "none";
  }
}
let touchArr = {
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
  distX: function(){return this.endX - this.startX},
  distY: function(){return this.endY - this.startY},
  getDirection: function(){
    let dX = this.distX();
    let dY = this.distY();
    if(Math.abs(dX) > Math.abs(dY)){
      return (dX>=0)?"ArrowRight":"ArrowLeft";
    }
    else{
      return (dY>=0)?"ArrowDown":"ArrowUp";
    }
  }
};
function onTouchstart(e){
  let touch = e.changedTouches[0];
  touchArr.startX = touch.pageX;
  touchArr.startY = touch.pageY;
  
}
function onTouchend(e){
  let touch = e.changedTouches[0];
  touchArr.endX = touch.pageX;
  touchArr.endY = touch.pageY;
  gameBoard.key = (overlay.style.display  === "none")? touchArr.getDirection(): "ArrowRight";
  
}
volumeSlider.oninput = function(){
  bgAudio.volume = volumeSlider.value / 10;
}
function onResize(){
  console.log("foo");
  let scaleRatio = 0;
  let gameHeight = gameWindow.offsetHeight;
  let gameWidth = gameWindow.offsetWidth;
  
  let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  console.log(gameHeight, gameWidth);
  let screenRatio = width/height;
  let gameRatio = gameWidth / gameHeight;
  scaleRatio = (( screenRatio) > gameRatio)? height/gameHeight: (0.95*width)/gameWidth;
  
  gameWindow.style.transform = "scale("+scaleRatio+")"
}
let cheatMode = 0; //SHH!