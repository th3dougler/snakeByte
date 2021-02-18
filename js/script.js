let gameBoard = {
  gameWindow: {},
  width: 0,
  height: 0,
  arr: [],
  key: "",
  gameTimer: 0,
  init: function () {
    gameWindow = document.getElementById("gameWindow");
    this.width = 50;
    this.height = 40;
    arr = [];
    gameWindow.addEventListener("click", stopInterval);
    document.addEventListener("keydown", onKeydown);

    let table = document.createElement("table");
    for (let i = 0; i < this.height; i++) {
      let tr = document.createElement("tr");
      table.appendChild(tr);
      for (let j = 0; j < this.width; j++) {
        let td = document.createElement("td");
        td.row = i;
        td.rowIndex = j;
        td.gameIcon = null;
        this.arr.push(td);
        tr.appendChild(td);
      }
    }
    gameWindow.appendChild(table);
  },
};

let snake = {
  arr: [],
  currentDirection: "ArrowRight",
  init: function (initialLength) {
    for (let i = 0; i < initialLength; i++) {
      let newNode = gameBoard.arr[pos(gameBoard.height / 2, i)];
      newNode.gameIcon = 0;
      this.arr.push(newNode);
    }
  },
  update: function () {
    if (gameBoard.key === "ArrowUp") {
      if (this.currentDirection !== "ArrowDown") {
        this.currentDirection = "ArrowUp";
      }
    } else if (gameBoard.key === "ArrowDown") {
      if (this.currentDirection !== "ArrowUp") {
        this.currentDirection = "ArrowDown";
      }
    } else if (gameBoard.key === "ArrowLeft") {
      if (this.currentDirection !== "ArrowRight") {
        this.currentDirection = "ArrowLeft";
      }
    } else if (gameBoard.key === "ArrowRight") {
      if (this.currentDirection !== "ArrowLeft") {
        this.currentDirection = "ArrowRight";
      }
    }
    let tail = this.arr.shift();
    tail.gameIcon = undefined;
    let headRow = this.arr[this.arr.length - 1].row;
    let headRowIndex = this.arr[this.arr.length - 1].rowIndex;
    let newHead = {};
    switch (this.currentDirection) {
      case "ArrowUp":
        newHead = gameBoard.arr[pos(headRow - 1, headRowIndex)];
        break;
      case "ArrowDown":
        newHead = gameBoard.arr[pos(headRow + 1, headRowIndex)];
        break;
      case "ArrowLeft":
        newHead = gameBoard.arr[pos(headRow, headRowIndex - 1)];
        break;
      case "ArrowRight":
        newHead = gameBoard.arr[pos(headRow, headRowIndex + 1)];
        break;
    }
    newHead.gameIcon = 0;
    this.arr.push(newHead);
  },
};
let pos = (i, j) => gameBoard.width * i + j;

function onKeydown(e) {
  gameBoard.key = e.key;
}
let interval = setInterval(render, 100);

let stopInterval = () => {
  clearInterval(interval);
};

function render() {
  gameBoard.gameTimer += 50 / 1000;
  snake.update();
  gameBoard.arr.forEach((val) => {
    if (val.gameIcon == 0) val.style.background = "black";
    else val.style.background = "aliceblue";
  });
}

gameBoard.init();
snake.init(3);
