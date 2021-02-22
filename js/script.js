class GameBoard {
  constructor(width, height, gameLives = 3) {
    this.width = width;
    this.height = height;
    this.posArr = [];
    this.key = "";
    this.gameTimer = 0;
    this.gameLives = gameLives;
    this.gameSpeed = 200;
    this.newSpeed = this.gameSpeed;
    this.gamePoints = 0;
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
    parentElement.appendChild(table);
    return domArr;
  }
  pos(i, j) {
    return this.width * i + j;
  }
}

class Snake {
  constructor(initialLength, gameBoard, previousTail = []) {
    this.gameBoard = gameBoard;
    this.arr = [];
    this.speed = 1;
    this.currentDirection = "ArrowRight";
    this.grow = 0;
    let length =
      previousTail.length > initialLength ? previousTail.length : initialLength;
    for (let i = 0; i < length; i++) {
      let newNode = gameBoard.posArr[gameBoard.pos(gameBoard.height / 2, i)];
      let randomBug = Math.floor(Math.random() * 3) + 2;
      newNode[0] = randomBug;
      newNode[3] = randomBug;
      this.arr.push(newNode);
    }
  }
  getTail() {
    return this.arr.map((val) => val[3]);
  }
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
  updatePosition() {
    //set new head based on direction
    let oldHead = this.arr[this.arr.length - 1];
    oldHead[0] = oldHead[3];
    let pos = 0,
      spriteDirection = 0;
    let newHead = {};
    switch (this.currentDirection) {
      case "ArrowUp":
        if (oldHead[1] !== 0)
          pos = gameBoard.pos(oldHead[1] - this.speed, oldHead[2]);
        else pos = gameBoard.pos(gameBoard.height - 1, oldHead[2]);
        spriteDirection = 10;
        break;
      case "ArrowDown":
        if (oldHead[1] !== gameBoard.height - 1)
          pos = gameBoard.pos(oldHead[1] + this.speed, oldHead[2]);
        else pos = gameBoard.pos(0, oldHead[2]);
        spriteDirection = 12;
        break;
      case "ArrowLeft":
        if (oldHead[2] !== 0)
          pos = gameBoard.pos(oldHead[1], oldHead[2] - this.speed);
        else pos = gameBoard.pos(oldHead[1], gameBoard.width - 1);
        spriteDirection = 11;
        break;
      case "ArrowRight":
        if (oldHead[2] !== gameBoard.width - 1)
          pos = gameBoard.pos(oldHead[1], oldHead[2] + this.speed);
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

class Bug {
  constructor(initialBugs, gameArr, snakeArr) {
    this.gameArr = gameArr;
    this.snakeArr = snakeArr;
    this.bugArr = [];
    for (let i = 0; i < initialBugs; i++) {
      this.createBug();
    }
  }
  createBug() {
    let freeSpace = this.gameArr.filter((val) => val[0] === undefined);
    let randomSpace = Math.floor(Math.random() * freeSpace.length);
    let randomBug = Math.floor(Math.random() * 3) + 2;
    freeSpace[randomSpace][0] = randomBug;
    freeSpace[randomSpace][3] = randomBug;

    this.bugArr.push(freeSpace[randomSpace]);
  }
  onCollision(affectedBug) {
    let idx = this.bugArr.findIndex((val) => val === affectedBug);
    this.bugArr.splice(idx, 1);
    this.createBug();
    this.createBug();
  }
}
let boardDimensions = [40,30];
let gameBoard = new GameBoard(boardDimensions[0], boardDimensions[1]);
let snake = new Snake(6, gameBoard);
let initialBugs = 5;
let bug = new Bug(initialBugs, gameBoard.posArr, snake.arr);
let overlay = null;
let boardDOM = null;
let gameWindow = null;
let scoreWindow = null;
let localHighscore = localStorage.getItem("snakeByteHS");
let interval = null;
function globalInit() {
  gameWindow = document.getElementById("gameWindow");
  overlay = document.getElementById("overlay");
  scoreWindow = document.getElementById("scoreKeeper");
  gameWindow.addEventListener("click", onClick);
  document.addEventListener("keydown", onKeydown);
  boardDOM = gameBoard.initTable(gameWindow);
  if (localHighscore > 0) {
    scoreWindow.children[1].innerHTML = "LOCAL HIGH SCORE: " + localHighscore;
  }
}
globalInit();
function render() {
  //scorekeeping

  gameBoard.gameTimer += gameBoard.gameSpeed / 1000;

  snake.updateDirection();
  snake.updatePosition();

  let updateOverlayString = "";
  let tail = snake.getTail();
  let isCollision = snake.checkCollision();
  if (isCollision == 1) {
    gameBoard.gameLives--;
    gameBoard.newSpeed = gameBoard.gameSpeed;
    if (gameBoard.gameLives <= 0) {
      overlay.children[0].innerHTML = "<h1>GAME OVER</h1>";
      updateOverlayString = ">.< </br> PRESS RESET TO PLAY AGAIN!";
      overlay.style.animationName = "red-flash-in";
      if (localStorage.getItem("snakeByteHS") < localHighscore) {
        
        updateOverlayString = "NEW HIGH SCORE: " + localHighscore + "</br>" + updateOverlayString;
        overlay.style.animationName = "green-flash-in";
        localStorage.setItem("snakeByteHS", localHighscore);
      }
      overlay.children[1].innerHTML = updateOverlayString;
      overlay.children[2].innerHTML = "RESET";
      
      gameBoard = new GameBoard(boardDimensions[0], boardDimensions[1]);
      tail = [];
    } else {
      overlay.children[0].innerHTML = "<h1>-1 LIFE</h1>";
      updateOverlayString = "PRESS CONTINUE TO KEEP GOING";
      overlay.children[1].innerHTML = updateOverlayString;
      overlay.children[2].innerHTML = "CONTINUE";
      overlay.style.animationName = "red-flash-in";
      gameBoard.newSpeed = gameBoard.gameSpeed;
    }
    overlay.style.display = "flex";
    clearInterval(interval);

    snake.arr.forEach((val) => ([val[0], val[3]] = [undefined, undefined]));
    bug.bugArr.forEach(val=>([val[0], val[3]] = [undefined, undefined]));
    snake = new Snake(1, gameBoard, tail);
    bug = new Bug(initialBugs, gameBoard.posArr, snake.arr);
  } else if (isCollision === -1) {
    gameBoard.gamePoints++;

    if (gameBoard.gamePoints % 5 === 0) {
      gameBoard.newSpeed = (gameBoard.newSpeed > 40)? gameBoard.newSpeed-20: 40;
      clearInterval(interval);
      interval = setInterval(render, gameBoard.newSpeed);
    }
  }

  scoreUpdate();
  gameBoard.posArr.forEach((val, idx) => {
    if (val[0] == -1) {
      boardDOM[idx].id = "snake-body";
      boardDOM[idx].className = "";
    } else if (val[0] >= 10) {
      boardDOM[idx].id = "snake-head";
      if (val[0] === 10) {
        boardDOM[idx].className = "pUp";
      } else if (val[0] === 12) {
        boardDOM[idx].className = "pDown";
      } else if (val[0] === 11) {
        boardDOM[idx].className = "pLeft";
      } else if (val[0] === 13) {
        boardDOM[idx].className = "pRight";
      }
    } else if (val[0] == 2) {
      boardDOM[idx].id = "bug-1";
      boardDOM[idx].className = "";
    } else if (val[0] == 3) {
      boardDOM[idx].id = "bug-2";
      boardDOM[idx].className = "";
    } else if (val[0] == 4) {
      boardDOM[idx].id = "bug-3";
      boardDOM[idx].className = "";
    } else {
      boardDOM[idx].id = undefined;
      boardDOM[idx].className = "";
    }
  });
}
function scoreUpdate() {
  localHighscore =
    gameBoard.gamePoints > localHighscore
      ? gameBoard.gamePoints
      : localHighscore;
  scoreWindow.children[0].innerHTML =
    "SCORE: " +
    Math.floor(gameBoard.gamePoints) +
    " LIVES: " +
    gameBoard.gameLives;
  scoreWindow.children[1].innerHTML = "LOCAL HIGH SCORE: " + localHighscore;
}

function onClick(e) {
  if (e.target.id === "start") {
    interval = setInterval(render, gameBoard.gameSpeed);
    overlay.style.display = "none";
  }
  else if (e.target.id === "hacks") {
    localStorage.setItem("snakeByteHS",0);
    localHighscore = 0;
  }
  
}
function onKeydown(e) {
  gameBoard.key = e.key;
  if(e.keyCode === 32 && overlay.style.display != "none"){
    interval = setInterval(render, gameBoard.gameSpeed);
    overlay.style.display = "none";
  }
}
