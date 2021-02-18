class GameBoard {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.posArr = [];
    this.key = "";
    this.gameTimer = 0;
    this.gameSpeed = 200;
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        this.posArr.push({
          0: undefined,
          1: i,
          2: j,
        });
      }
    }
  }
  initTable(parentElement) {
    let table = document.createElement("table");
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
  constructor(initialLength, gameBoard) {
    this.gameBoard = gameBoard;
    this.arr = [];
    this.speed = 1;
    this.currentDirection = "ArrowRight";
    for (let i = 0; i < initialLength; i++) {
      let newNode = gameBoard.posArr[gameBoard.pos(gameBoard.height / 2, i)];
      newNode[0] = 0;
      this.arr.push(newNode);
    }
  }
  resetLocation() {
    let head = this.arr.pop();
    this.arr.forEach((val) => {
      val[0] = undefined;
    });
    head = gameBoard.posArr[gameBoard.pos(gameBoard.height / 2, 0)];
    this.arr.push(head);
    this.currentDirection = "ArrowRight";
    gameBoard.key = "ArrowRight";
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
    console.log(this.arr.length);
    this.updateDirection();
    //if the player has triggered the snake to grow,
    // simply dont update the tail for one iteration
    if (this.snakeGrow) {
      this.snakeGrow = false;
    } else {
      let tail = this.arr.shift();
      if (tail[0] !== undefined) {
        tail[0] = undefined;
        this.arr[0][0] = -1;
      }
    }
    let oldHead = this.arr[this.arr.length - 1];
    oldHead[0] = 0;

    let newHead = {};
    let pos = undefined;
    switch (this.currentDirection) {
      case "ArrowUp":
        if (oldHead[1] !== 0)
          pos = gameBoard.pos(oldHead[1] - this.speed, oldHead[2]);
        else pos = gameBoard.pos(gameBoard.height - 1, oldHead[2]);
        break;
      case "ArrowDown":
        if (oldHead[1] !== gameBoard.height - 1)
          pos = gameBoard.pos(oldHead[1] + this.speed, oldHead[2]);
        else pos = gameBoard.pos(0, oldHead[2]);
        break;
      case "ArrowLeft":
        if (oldHead[2] !== 0)
          pos = gameBoard.pos(oldHead[1], oldHead[2] - this.speed);
        else pos = gameBoard.pos(oldHead[1], gameBoard.width - 1);
        break;
      case "ArrowRight":
        if (oldHead[2] !== gameBoard.width - 1)
          pos = gameBoard.pos(oldHead[1], oldHead[2] + this.speed);
        else pos = gameBoard.pos(oldHead[1], 0);
        break;
    }
    newHead = gameBoard.posArr[pos];
    newHead[0] = 1;
    this.arr.push(newHead);
  }
  checkCollision() {
    let head = this.arr[this.arr.length - 1];
    let idx = this.arr.indexOf(head);
    if (idx !== this.arr.length - 1) return 1;
    else if (bug) {
      bug.bugArr.forEach((val) => {
        if (val === head) {
          bug.onCollision(val);
          this.snakeGrow = true;
          return -1;
        }
      });
    }
    return 0;
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
    freeSpace[randomSpace][0] = 2;
    this.bugArr.push(freeSpace[randomSpace]);
  }
  onCollision(affectedBug) {
    let idx = this.bugArr.findIndex((val) => val === affectedBug);
    this.bugArr.splice(idx, 1);
    this.createBug();
  }
}
const gameBoard = new GameBoard(38, 28);
const snake = new Snake(10, gameBoard);
const bug = new Bug(5, gameBoard.posArr, snake.arr);
let boardDOM = [];
function globalInit() {
  const gameWindow = document.getElementById("gameWindow");
  const overlay = document.getElementById("overlay");
  gameWindow.addEventListener("click", onClick);
  document.addEventListener("keydown", onKeydown);
  boardDOM = gameBoard.initTable(gameWindow);
}
globalInit();

function render() {
  //count the seconds that the game has been running
  gameBoard.gameTimer += gameBoard.gameSpeed / 1000;

  snake.updatePosition();
  if (snake.checkCollision()) {
    snake.resetLocation();
  }

  gameBoard.posArr.forEach((val, idx) => {
    if (val[0] == 0) boardDOM[idx].id = "snake-body";
    else if (val[0] == 1) boardDOM[idx].id = "snake-head";
    else if (val[0] == -1) boardDOM[idx].id = "snake-tail";
    else if (val[0] == 2) boardDOM[idx].id = "bug-1";
    else boardDOM[idx].id = undefined;
  });
}

function onClick(e) {
  if (e.target.id === "start") {
    let interval = setInterval(render, gameBoard.gameSpeed);
    overlay.style.display = "none";
  }
}
function onKeydown(e) {
  gameBoard.key = e.key;
}
