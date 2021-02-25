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
    this.keyP1 = ""; //current key being pressed in DOM
    this.gameTimer = 0;
    this.gameLives = gameLives;
    this.gameSpeed = 200; //interval rate, default: 200ms
    this.newSpeed = this.gameSpeed;

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
  constructor(
    initialLength,
    gameBoard,
    previousTail = [],
    p2 = false,
    score = 0
  ) {
    this.gameBoard = gameBoard;
    this.arr = [];

    this.grow = 0; //any value > 0 will cause the tail to grow by that many units
    /* determine if we're creating a new snake or if the player just lost a life
      if the snake is new, randomly generate the tail, otherwise used the previousTail parameter to build the tail
    */
    this.score = score;
    this.p2 = p2;
    this.currentDirection = this.p2 === true ? "ArrowLeft" : "ArrowRight";
    this.gameBoard.keyP1 = "ArrowRight";
    this.gameBoard.keyP2 = "ArrowLeft";
    let length =
      previousTail.length > initialLength ? previousTail.length : initialLength;
    for (let i = 0; i < length; i++) {
      // let newNode = gameBoard.posArr[this.gameBoard.pos(Math.floor(this.gameBoard.height / 2), i)];
      let newNode = null;
      if (p2 === true) {
        newNode =
          gameBoard.posArr[
            this.gameBoard.pos(
              Math.floor(this.gameBoard.height / 2),
              gameBoard.width - 1 - i
            )
          ];
      } else {
        newNode = this.gameBoard.posArr[
          this.gameBoard.pos(Math.floor(this.gameBoard.height / 2), i)
        ];
      }
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

  reset() {
    this.arr.forEach((val) => ([val[0], val[3]] = [undefined, undefined]));
  }
  /* Called on render(), update the snakes direction based on keyboard input
  ensure the snake cannot backtrack on its own path */
  updateDirection(key) {
    if (key === "ArrowUp" || key === 87) {
      if (this.currentDirection !== "ArrowDown") {
        this.currentDirection = "ArrowUp";
      }
    } else if (key === "ArrowDown" || key === 83) {
      if (this.currentDirection !== "ArrowUp") {
        this.currentDirection = "ArrowDown";
      }
    } else if (key === "ArrowLeft" || key === 65) {
      if (this.currentDirection !== "ArrowRight") {
        this.currentDirection = "ArrowLeft";
      }
    } else if (key === "ArrowRight" || key === 68) {
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
  checkCollision(otherSnake = null) {
    let head = this.arr[this.arr.length - 1];
    let idx = this.arr.indexOf(head);
    let otherIdx = -1;
    let returnValue = 0;

    if (otherSnake !== null) {
      otherIdx = otherSnake.arr.indexOf(head);
    }
    if (otherIdx !== -1) {
      returnValue = otherIdx === 0 ? 3 : 2;
    } else if (idx !== this.arr.length - 1) {
      returnValue = 1;
    } else if (bug) {
      bug.arr.forEach((val) => {
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
    this.arr = []; //array of objects representing position of bugs on GameBoard
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

    this.arr.push(freeSpace[randomSpace]);
  }
  /** Called by snake.checkCollision(), removes bug from array
   * @param  {object} affectedBug the bug to be removed
   */
  onCollision(affectedBug) {
    let idx = this.arr.findIndex((val) => val === affectedBug);
    this.arr.splice(idx, 1);
    this.createBug();
    this.createBug();
  }
  reset() {
    this.arr.forEach((val) => ([val[0], val[3]] = [undefined, undefined]));
  }
}

/* misc game variables */
let localHighscore = localStorage.getItem("snakeByteHS");
let interval = null;
let boardDimensions = [21, 25];
let initialBugs = 5;
let bgAudio = new Audio("./res/10 - whaa.mp3");

let touchArr = {
  // object tracking single-touch
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
  distX: function () {
    return this.endX - this.startX;
  },
  distY: function () {
    return this.endY - this.startY;
  },
  getDirection: function () {
    //determine compass direction most closely resembling the swipe action
    let dX = this.distX();
    let dY = this.distY();
    if (Math.abs(dX) > Math.abs(dY)) {
      return dX >= 0 ? "ArrowRight" : "ArrowLeft";
    } else {
      return dY >= 0 ? "ArrowDown" : "ArrowUp";
    }
  },
};
/* Object Instantiation */

let gameBoard = new GameBoard(boardDimensions[0], boardDimensions[1]);
let snake = new Snake(1, gameBoard);
let snake2 = null;

let bug = new Bug(initialBugs, gameBoard.posArr, snake.arr);


/* global DOM delaration */
let volumeSlider = null;
let bgAudioToggle = null;
let overlay = null;
let gameWindow = null;
let gameBoardDOM = null;
let dispScore = null;
let dispLives = null;
let dispHS = null;
let startBtn = null;
let start2pBtn = null;

function globalInit() {
  //DOM
  gameWindow = document.getElementById("game-window");
  overlay = document.getElementById("overlay");
  bgAudioToggle = document.getElementById("music-toggle");
  dispScore = document.getElementById("score");
  dispLives = document.getElementById("lives");
  dispHS = document.getElementById("highscore");
  startBtn = document.getElementById("start");
  start2PBtn = document.getElementById("start2p");
  volumeSlider = document.getElementById("volume-slider");

  bgAudio.volume = volumeSlider.value / 100;
  bgAudio.load();

  //EventListeners
  gameWindow.addEventListener("click", onClick);
  document.addEventListener("keydown", onKeydown);

  window.addEventListener("touchstart", onTouchstart);
  window.addEventListener("touchend", onTouchend);
  window.addEventListener("resize", onResize);
  window.addEventListener("load", onResize);
  //draw table into document DOM
  gameBoardDOM = gameBoard.initTable(gameWindow); 
  

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
function updateOverlay(parameter) {
  /* parameter determines appearance of overlay */
  // 2p tie game condition
  let updateOverlayString = "";
  switch (parameter) {
    case "2PMode":
      dispLives.parentNode.style.display = "none";
      dispHS.parentNode.style.display = "none";
      dispScore.parentNode.style.display = "none";
      overlay.style.display = "none";
      return;
      break;
    case "1PMode":
      dispLives.parentNode.style.display = "flex";
      dispHS.parentNode.style.display = "flex";
      overlay.style.display = "none";
      return;
      break;
    case "loseLife":
      overlay.children[0].innerHTML = "-1 LIFE";
      updateOverlayString = "PRESS CONTINUE TO KEEP GOING";
      startBtn.innerHTML = "CONTINUE / [ SPACE ]";
      start2PBtn.style.display = "none";
      overlay.style.animationName = "red-flash-in";
      break;
    case "gameOver":
      overlay.children[0].innerHTML = "GAME OVER";
      updateOverlayString = "PRESS RESET TO PLAY AGAIN!";
      overlay.style.animationName = "red-flash-in";
      if (localStorage.getItem("snakeByteHS") < localHighscore) {
        overlay.children[0].innerHTML = "CONGRATS!";
        updateOverlayString =
          "YOU SET A NEW HIGH SCORE: " +
          localHighscore +
          "</br>" +
          updateOverlayString;
        overlay.style.animationName = "green-flash-in";
        localStorage.setItem("snakeByteHS", localHighscore);
      }
      start2PBtn.style.display = "";
      startBtn.innerHTML = "RESET / [ SPACE ]";
      start2PBtn.innerHTML = "2 PLAYER";
      break;
    case "tieGame":
      overlay.children[0].innerHTML = "TIE GAME";
      updateOverlayString = "PRESS RESET TO PLAY AGAIN!";
      overlay.style.animationName = "red-flash-in";
      start2PBtn.style.display = "";
      start2PBtn.innerHTML = "RESET / [ SPACE ]";
      startBtn.innerHTML = "1 PLAYER MODE";
      break;
    case "p1Win":
      overlay.children[0].innerHTML = "PLAYER 1 WINS";
      updateOverlayString = "PRESS RESET TO PLAY AGAIN!";
      overlay.style.animationName = "green-flash-in";
      start2PBtn.style.display = "";
      start2PBtn.innerHTML = "RESET / [ SPACE ]";
      startBtn.innerHTML = "1 PLAYER MODE";
      break;
    case "p2Win":
      overlay.children[0].innerHTML = "PLAYER 2 WINS";
      updateOverlayString = "PRESS RESET TO PLAY AGAIN!";
      overlay.style.animationName = "green-flash-in";
      start2PBtn.style.display = "";
      start2PBtn.innerHTML = "RESET / [ SPACE ]";
      startBtn.innerHTML = "1 PLAYER MODE";
      break;
  }
  overlay.children[1].innerHTML = updateOverlayString;
  overlay.style.display = "flex";
  clearInterval(interval);
}

function render() {
  gameBoard.gameTimer += gameBoard.gameSpeed / 1000;

  snake.updateDirection(gameBoard.keyP1);
  snake.updatePosition();

  let isCollision2 = null;
  if (snake2 !== null) {
    snake2.updateDirection(gameBoard.keyP2);
    snake2.updatePosition();
    isCollision2 = snake2.checkCollision(snake);
  }
  let isCollision = snake.checkCollision(snake2);
  //isCollision represents various collision situations
  // 3 = god willing, this is a head on collision of two snakes
  // 2 = collision with other snake
  // 1 = collide with self
  //-1 = collision with a bug
  // 0 = no collision
  let tail = snake.getTail();
  let score = snake.score;
  if (isCollision2 == null) {
    /* 1 player collision logic*/
    if (isCollision === 1) {
      gameBoard.gameLives--;
      if (gameBoard.gameLives <= 0) {
        updateOverlay("gameOver");
        gameBoard = new GameBoard(boardDimensions[0], boardDimensions[1]);
        score = 0;
        tail = [];
      } else {
        updateOverlay("loseLife");
        gameBoard.newSpeed = gameBoard.gameSpeed;
      }
      snake.reset();
      bug.reset();
      snake = new Snake(1, gameBoard, tail, false, score);
      bug = new Bug(initialBugs, gameBoard.posArr, snake.arr);
    } else if (isCollision === -1) {
      snake.score++;
      if (snake.score % 3 === 0) {
        gameBoard.newSpeed =
          gameBoard.newSpeed > 50 ? gameBoard.newSpeed - 10 : 50;
        clearInterval(interval);
        interval = setInterval(render, gameBoard.newSpeed);
      }
    }
  } else if (isCollision > 0 || isCollision2 > 0) {
    /* 2 player game collision logic*/
    if (isCollision >= 1 && isCollision2 >= 1) {
      updateOverlay("tieGame");
    } else if (isCollision2 >= 1) {
      updateOverlay("p1Win");
    } else if (isCollision >= 1) {
      updateOverlay("p2Win");
    }
    gameBoard.newSpeed = gameBoard.gameSpeed;
    gameBoard = new GameBoard(boardDimensions[0], boardDimensions[1]);
    snake.reset();
    snake2.reset();
    bug.reset();
    snake = new Snake(1, gameBoard, [], false);
    snake2 = new Snake(1, gameBoard, [], true);
    bug = new Bug(initialBugs, gameBoard.posArr, snake.arr);
    
  } else{
    //2player game, no collision, check timer to increase speed in 2p mode
    if (Math.floor(gameBoard.gameTimer) % 5 === 0){
      gameBoard.newSpeed =
      gameBoard.newSpeed > 50 ? gameBoard.newSpeed - 2.5 : 50;
    clearInterval(interval);
    interval = setInterval(render, gameBoard.newSpeed);
    }
  }
  scoreUpdate();

  //Music playback code: check to ensure player wants music and game is in play
  //ensure file is sufficiently buffered to play without gaps
  if (
    bgAudioToggle.checked === true &&
    overlay.style.display === "none" &&
    bgAudio.readyState == 4
  ) {
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
  localHighscore = snake.score > localHighscore ? snake.score : localHighscore;
  dispScore.innerHTML = Math.floor(snake.score);
  dispLives.innerHTML = gameBoard.gameLives;
  dispHS.innerHTML = localHighscore;
}
/** click handler function
 * @param  {event} e returns where the click event took place
 */
function onClick(e) {
/* If player is pressing 1 or 2p start button, adjust overlay and start interval */
  let target = e.target;
  if (target.id === "start" || target.id === "start2p") {
    interval = setInterval(render, gameBoard.gameSpeed);
    if (target.id === "start2p") {
      snake2 = new Snake(1, gameBoard, 0, true);
      updateOverlay("2PMode");
    } else{
      updateOverlay("1PMode");
      snake2 = null;
    }
    
  } else if (target === dispHS) {
    //clear the local HS by clicking on it 9 times, but dont tell anyone OK?
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
  
  /* Probably would have done this using only keycodes in the future, call it a lack of forethought
  get keydown event and assign it to a variable depending on weather it is from 1p controller or 2p controller */
  let key = e.key;
  let keycode = e.keyCode;
  if (
    key === "ArrowUp" ||
    key === "ArrowDown" ||
    key === "ArrowLeft" ||
    key === "ArrowRight"
  )
    gameBoard.keyP1 = key;
  else if (keycode === 87 || keycode === 83 || keycode === 65 || keycode === 68)
    gameBoard.keyP2 = keycode;
  else if (key === " " && overlay.style.display != "none") {
    interval = setInterval(render, gameBoard.gameSpeed);
    overlay.style.display = "none";
  }
}

function onTouchstart(e) {
  
  let touch = e.changedTouches[0];
  touchArr.startX = touch.pageX;
  touchArr.startY = touch.pageY;
}
function onTouchend(e) {
  let touch = e.changedTouches[0];
  touchArr.endX = touch.pageX;
  touchArr.endY = touch.pageY;
  gameBoard.key =
    overlay.style.display === "none" ? touchArr.getDirection() : "ArrowRight";
}
volumeSlider.oninput = function () {
  bgAudio.volume = volumeSlider.value / 100;
};
function onResize() {
  let scaleRatio = 0;
  let gameHeight = gameWindow.offsetHeight;
  let gameWidth = gameWindow.offsetWidth;

  let height =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  let width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  let screenRatio = width / height;
  let gameRatio = gameWidth / gameHeight;
  scaleRatio =
    screenRatio > gameRatio ? height / gameHeight : (0.95 * width) / gameWidth;

  gameWindow.style.transform = "scale(" + scaleRatio + ")";
}
let cheatMode = 0; //SHH!
