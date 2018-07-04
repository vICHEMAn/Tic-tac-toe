 /*jshint esversion: 6 */


const possibleWins = [
  [0,1,2],
  [0,4,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [2,4,6],
  [3,4,5],
  [6,7,8]
];

let state = [0,0,0,0,0,0,0,0,0];

const HUMVAL = -1;
const COMVAL = 1;
const HUMAN = false;
const COMPUTER = true;

let userChoose;
let compChoose;
let userCount = 0;
let compCount = 0;
let userTurn = false;
let userStarts = false;
let compStarts = false;
let nextGame = false;
let firstGame = true;

/*
  =====================================
    Selector variables
  =====================================
*/

const x = document.getElementById('x');
const o = document.getElementById('o');
const container = document.getElementById('container');
const choiceBox = document.getElementById('choiceBox');
const promptBoxBg = document.getElementById('promptBoxBg');
const promptBox = document.getElementById('promptBox');
const promptText = document.getElementById('promptText');

const box1 = document.getElementById('0');
const box2 = document.getElementById('1');
const box3 = document.getElementById('2');
const box4 = document.getElementById('3');
const box5 = document.getElementById('4');
const box6 = document.getElementById('5');
const box7 = document.getElementById('6');
const box8 = document.getElementById('7');
const box9 = document.getElementById('8');

const boxes = [box1,box2,box3,box4,box5,box6,box7,box8,box9];

for (let i = 0; i < boxes.length; i++) {
  initiateBox(boxes[i],i);
}

/*
  =====================================
    Functions
  =====================================
*/

x.addEventListener("click", () => userChoice("x", choiceBox));
o.addEventListener("click", () => userChoice("o", choiceBox));


// The prompBox checks who starts when clicked if its time for the next game and triggers the computer play.
promptBox.addEventListener("click", function () {
  animateOut(promptBoxBg, 250);
  animateOut(promptBox, 250);
  // Clear the playing field and the state
  for (let i = 0; i < state.length; i ++) {
    boxes[i].innerHTML = "";
    state[i] = 0;
  }

  // Initiate Computer play when it's it time to start.
  if (!userStarts && !firstGame && promptText.innerHTML === "COMPUTER STARTS") {
    setTimeout(function () {
      callComputer();
      userStarts = true;
    }, 800);
  }
  // Send the right prompt depending on who's on turn to start
  if (nextGame) {
    whoStarts();
  }
});

// Load all the boxes
function initiateBox (boxId, num) {
  boxId.addEventListener("click", function () {
    if (userTurn) {
        userPlay(boxId, num);
    }
  });
}

// Animates out choiceBox, animates in container and toggles "You Start".
function userChoice (choice, element) {
  if (choice === "x") {
    userChoose = "x";
    compChoose = "o";
  } else {
    userChoose = "o";
    compChoose = "x";
  }

  animateOut(element, 300);

  setTimeout(function () {
    animateIn(container);
  }, 300);

  setTimeout(function () {
    animateIn(promptBoxBg);
    animateIn(promptBox);
  }, 450);

  setTimeout(function () {
    animateOut(promptBoxBg, 250);
    animateOut(promptBox, 250);
    userTurn = true;
  }, 3500);
}

//------------------ GAME FUNCTIONS

function userPlay (boxId, num) {
  if (userTurn && boxId.innerHTML === "") {
    boxId.innerHTML = userChoose;
    state[num] = HUMVAL;
    userTurn = false;

    if (checkWin(state, HUMAN)) {
        youWin();
    } else if (checkDraw(state)) {
      draw();
    } else {
      callComputer();
    }
  }
}

// Call computer play
function callComputer () {
  compPlay(state, 0, COMPUTER);
}

// Decide where the computer plays -- megamax
function compPlay (board, depth, player) {

  if (checkWin(board, !player)) {
    return -10 + depth;
  }

  if (checkDraw(board)) {
    return 0;
  }

  let value = player === HUMAN ? HUMVAL : COMVAL;

  let max = -Infinity;
  let index = 0;

  for (let i = 0; i < 9; i++) {
    if (board[i] === 0) {
      let newboard = board.slice();
      newboard[i] = value;

      let moveval = -compPlay(newboard, depth+1, !player);

      if (moveval > max) {
        max = moveval;
        index = i;
      }
    }
  }

  if (depth === 0) {
    setTimeout(function () {
      compButtonPush(boxes[index],index);

      if (checkWin(state, COMPUTER)) {
          compWin();
      } else if (checkDraw(state)) {
        draw();
      }

    }, 800);
  }
  return max;
}

// Computer press function
function compButtonPush(box, num) {
  box.innerHTML = compChoose;
  state[num] = COMVAL;
  userTurn = true;
}

// Check for Win
function checkWin(board, player) {
  let value = player === HUMAN ? HUMVAL : COMVAL; // Determines to check for 1 or -1

  for (let i = 0; i < possibleWins.length; i++) {
    let win = true;
    for (var j = 0; j < 3; j++) {
      if (board[possibleWins[i][j]] !== value) {
        win = false;
        break;
      }
    }
    if (win) {
      return true; // If it get through the J loop it's a win
    }
  }

  return false; // Else return false
}

// Check for Draw
function checkDraw(board) {
  for (let i = 0; i < 9; i++) {
    if (board[i] === 0) {
      return false;
    }
  }
  return true;
}

function youWin () {
  promptText.innerHTML = "YOU WIN!";
  userCount += 1;
  userTurn = false;
  nextGame = true;
  firstGame = false;
  userCounter.innerHTML = userCount;
  animateInFast(promptBoxBg);
  animateInFast(promptBox);
}

function compWin () {
  promptText.innerHTML = "COMPUTER WINS!";
  compCount += 1;
  userTurn = false;
  nextGame = true;
  firstGame = false;
  computerCounter.innerHTML = compCount;
  animateInFast(promptBoxBg);
  animateInFast(promptBox);
}

function draw () {
  promptText.innerHTML = "IT'S A TIE";
  userTurn = false;
  nextGame = true;
  firstGame = false;
  animateInFast(promptBoxBg);
  animateInFast(promptBox);
}

function whoStarts () {
  if (!firstGame) {
    if (userStarts) {
      setTimeout(function () {
        promptText.innerHTML = "YOU START";
        animateIn(promptBoxBg);
        animateIn(promptBox);
        userTurn = true;
        nextGame = false;
      }, 450);
      userStarts = false;
    } else {
      //Prompt Computer starts, timeout etc
      setTimeout(function () {
        promptText.innerHTML = "COMPUTER STARTS";
        animateIn(promptBoxBg);
        animateIn(promptBox);
        nextGame = false;
      }, 450);
    }
  }
}


//------------------ ANIMATIONS FUNCTIONS

function animateOut (elementOut, delay) {
  let element = elementOut;
  element.classList.remove("animateIn");
  element.classList.remove("animateInFast");
  element.classList.add("animateOut");

  setTimeout(function () {
    element.classList.remove("isShowing");
    element.classList.add("isNotShowing");
  }, delay);
}

function animateIn (elementIn) {
  let element = elementIn;
  element.classList.remove("isNotShowing");
  element.classList.remove("animateOut");
  element.classList.add("animateIn");
  element.classList.add("isShowing");

  setTimeout(function () {
    element.classList.remove("isNotShowing");
    element.classList.add("isShowing");
  }, 300);
}

function animateInFast (elementIn) {
  let element = elementIn;
  element.classList.remove("isNotShowing");
  element.classList.remove("animateOut");
  element.classList.add("animateInFast");
  element.classList.add("isShowing");

  setTimeout(function () {
    element.classList.remove("isNotShowing");
    element.classList.add("isShowing");
  }, 300);
}
