const gameContainer = document.querySelector(".gameContainer");
const optionContainer = document.querySelector(".optionContainer");
const boardContainer = document.querySelector(".gridContainer");
const optionButton = document.getElementById("optionButton");
const returnButton = document.getElementById("returnButton");
const dropdown = document.getElementById("dropdown");
const difficultyInfo = document.querySelector(".difficultyInfo");
const timer = document.querySelector(".timer");
const browser = document.querySelector(".browser");
const diffuser = document.querySelector(".diffuser");

const mineSprite = "assets/mine.png";
const flagSprite = "assets/flag.png";

let boardArray = [];
let randomArray = [];
let mineArray = [];
let mines = 10;
let diffuse = 10;

let height = 9;
let width = 9;
let area = height * width;

let seconds = 0;
let minutes = 0;

let emptyCheck = false;
let totalRevealed = 0;

let gameStarted = false;
let playerHasWon = false;
let playerHasLost = false;

class Square {
    constructor(index) {
        this.index = index;
        this.hasMine = false;
        this.adjacentMines = 0;
        this.revealed = false;
        this.flooded = false;
        this.flagged = false;
    }
}

Initialize();
StartTimer();
function Initialize(){
    RandomizeMines();
    CreateBoard();
    CheckForAdjacentMines();
    ResetSquareClicks();
}
//Mine Randomizer
function RandomizeMines(){
    if (randomArray.length === 0){
        let randomIndex = Math.floor(Math.random() * area);
        randomArray.push(randomIndex);
    }
    while (randomArray.length < area){
        let randomIndex = Math.floor(Math.random() * area);
        let numIsInArray = false;
        for (let i = 0; i < randomArray.length; i++){
            if(randomIndex === randomArray[i]){
                numIsInArray = true;
            }
        }
        if(!numIsInArray){
            randomArray.push(randomIndex);
        }
    }
    for (let i = 0; i < mines; i++){
        mineArray.push(new Square(randomArray[i]));
    }
}
//Creates Squares for the Board and Adds the Mines
function CreateBoard(){
    for (let i = 0; i < area; i++){
    
        boardArray.push(new Square(i));
        let box = document.createElement("div");
        box.classList.add("square");
        box.setAttribute("id", `${boardArray[i].index}`);
        box.innerHTML = `<div class="hidden"></div>`
        boardContainer.appendChild(box);
        for (let j = 0; j < mineArray.length; j++){
            if(boardArray[i].index === mineArray[j].index){
                boardArray[i].hasMine = true;
            }
        }
    }
    diffuse = mineArray.length;
    diffuser.firstChild.innerHTML = diffuse;
}
//Check for Adjacent Mines When Initializing and assigning adjacentMine Value
function CheckForAdjacentMines(){
    for (let i = 0; i < area; i++){
        if(boardArray[i].index === 0){
            CheckSouthSquare(boardArray, i);
            CheckEastSquare(boardArray, i);
            CheckSouthEastSquare(boardArray, i);
        }
        //Check NorthEast Corner
        else if(boardArray[i].index === width - 1) {
            CheckSouthSquare(boardArray, i);
            CheckWestSquare(boardArray, i);
            CheckSouthWestSquare(boardArray, i);
        }
        //Check SouthEast Corner
        else if(boardArray[i].index === boardArray.length - 1){
            CheckNorthSquare(boardArray, i);
            CheckWestSquare(boardArray, i);
            CheckNorthWestSquare(boardArray, i);
        }
        //Check SouthWest Corner
        else if(boardArray[i].index === boardArray.length - width){
            CheckNorthSquare(boardArray, i);
            CheckEastSquare(boardArray, i);
            CheckNorthEastSquare(boardArray, i);
        }
        //Check North Row
        else if(boardArray[i].index < width) {
            CheckSouthSquare(boardArray, i);
            CheckWestSquare(boardArray, i);
            CheckEastSquare(boardArray, i);
            CheckSouthEastSquare(boardArray, i);
            CheckSouthWestSquare(boardArray, i);
        }
        //Check East Column
        else if(boardArray[i].index % width === width - 1) {
            CheckNorthSquare(boardArray, i);
            CheckWestSquare(boardArray, i);
            CheckSouthSquare(boardArray, i);
            CheckNorthWestSquare(boardArray, i);
            CheckSouthWestSquare(boardArray, i);
        }
        //Check South Row
        else if(boardArray[i].index > boardArray.length - width) {
            CheckNorthSquare(boardArray, i);
            CheckEastSquare(boardArray, i);
            CheckWestSquare(boardArray, i);
            CheckNorthEastSquare(boardArray, i);
            CheckNorthWestSquare(boardArray, i);
        }
        //Check West Column
        else if(boardArray[i].index % width === 0) {
            CheckNorthSquare(boardArray, i);
            CheckEastSquare(boardArray, i);
            CheckSouthSquare(boardArray, i);
            CheckNorthEastSquare(boardArray, i);
            CheckSouthEastSquare(boardArray, i);
        }
        //Everything Middle
        else{
            CheckNorthSquare(boardArray, i);
            CheckSouthSquare(boardArray, i);
            CheckWestSquare(boardArray, i);
            CheckEastSquare(boardArray, i);
            CheckNorthEastSquare(boardArray, i);
            CheckNorthWestSquare(boardArray, i);
            CheckSouthEastSquare(boardArray, i);
            CheckSouthWestSquare(boardArray, i);
        }
    } 

}
//###################
//Returns Values
//###################
function CheckNorth(board, index){
    return board[index - width];
}
function CheckEast(board, index){
    return board[index + 1];
}
function CheckSouth(board, index){
    return board[index + width];
}
function CheckWest(board, index){
    return board[index - 1];
}
function CheckNorthWest(board, index){
    return board[(index - width) - 1];
}
function CheckNorthEast(board, index){
    return board[(index - width) + 1];
}
function CheckSouthEast(board, index){
    return board[(index + width) + 1];
}
function CheckSouthWest(board, index){
    return board[(index + width) - 1];
}
//###################
//Initial Check For Mines
//###################
function CheckNorthSquare(board, index){
    if(board[index - width].hasMine){
        board[index].adjacentMines++;
    }
}
function CheckEastSquare(board, index){
    if(board[index + 1].hasMine){
        board[index].adjacentMines++;
    }
}
function CheckSouthSquare(board, index){
    if(board[index + width].hasMine){
        board[index].adjacentMines++;
    }
}
function CheckWestSquare(board, index){
    if(board[index - 1].hasMine){
        board[index].adjacentMines++;
    }
}
function CheckNorthWestSquare(board, index){
    if(board[(index - width) - 1].hasMine){
        board[index].adjacentMines++;
    }
}
function CheckNorthEastSquare(board, index){
    if(board[(index - width) + 1].hasMine){
        board[index].adjacentMines++;
    }
}
function CheckSouthEastSquare(board, index){
    if(board[(index + width) + 1].hasMine){
        board[index].adjacentMines++;
    }
}
function CheckSouthWestSquare(board, index){
    if(board[(index + width) - 1].hasMine){
        board[index].adjacentMines++;
    }
}
//###################
//Check For Empty Adjacent Squares when Flooding
//###################
function CheckNorthForEmpty(board, index){
    if(CheckNorth(board,index).adjacentMines === 0 && !CheckNorth(board,index).revealed
    && !CheckNorth(board,index).flagged){
        let element = document.getElementById(CheckNorth(board,index).index);
        element.removeChild(element.firstChild);
        CheckNorth(board,index).revealed = true;
        emptyCheck = true;
    }
}
function CheckEastForEmpty(board, index){
    if(CheckEast(board,index).adjacentMines === 0 && !CheckEast(board,index).revealed
    && !CheckEast(board,index).flagged){
        let element = document.getElementById(CheckEast(board,index).index);
        element.removeChild(element.firstChild);
        CheckEast(board,index).revealed = true;
        emptyCheck = true;
    }
}
function CheckSouthForEmpty(board, index){
    if(CheckSouth(board,index).adjacentMines === 0 && !CheckSouth(board,index).revealed
    && !CheckSouth(board,index).flagged){
        let element = document.getElementById(CheckSouth(board,index).index);
        element.removeChild(element.firstChild);
        CheckSouth(board,index).revealed = true;
        emptyCheck = true;
    }
}
function CheckWestForEmpty(board, index){
    if(CheckWest(board,index).adjacentMines === 0 && !CheckWest(board,index).revealed
    && !CheckWest(board,index).flagged){
        let element = document.getElementById(CheckWest(board,index).index);
        element.removeChild(element.firstChild);
        CheckWest(board,index).revealed = true;
        emptyCheck = true;
    }
}
function CheckNorthWestForEmpty(board, index){
    if(CheckNorthWest(board,index).adjacentMines === 0 && !CheckNorthWest(board,index).revealed
    && !CheckNorthWest(board,index).flagged){
        let element = document.getElementById(CheckNorthWest(board,index).index);
        element.removeChild(element.firstChild);
        CheckNorthWest(board,index).revealed = true;
        emptyCheck = true;
    }
}
function CheckNorthEastForEmpty(board, index){
    if(CheckNorthEast(board,index).adjacentMines === 0 && !CheckNorthEast(board,index).revealed
    && !CheckNorthEast(board,index).flagged){
        let element = document.getElementById(CheckNorthEast(board,index).index);
        element.removeChild(element.firstChild);
        CheckNorthEast(board,index).revealed = true;
        emptyCheck = true;
    }
}
function CheckSouthEastForEmpty(board, index){
    if(CheckSouthEast(board,index).adjacentMines === 0 && !CheckSouthEast(board,index).revealed
    && !CheckSouthEast(board,index).flagged){
        let element = document.getElementById(CheckSouthEast(board,index).index);
        element.removeChild(element.firstChild);
        CheckSouthEast(board,index).revealed = true;
        emptyCheck = true;
    }
}
function CheckSouthWestForEmpty(board, index){
    if(CheckSouthWest(board,index).adjacentMines === 0 && !CheckSouthWest(board,index).revealed
    && !CheckSouthWest(board,index).revealed){
        let element = document.getElementById(CheckSouthWest(board,index).index);
        element.removeChild(element.firstChild);
        CheckSouthWest(board,index).revealed = true;
        emptyCheck = true;
    }
}
//###################
//Check For Adjacent Numbers when Flooding
//###################
function CheckNorthForNumber(board, index){
    if(CheckNorth(board,index).adjacentMines > 0 && !CheckNorth(board,index).revealed
    && !CheckNorth(board,index).flagged){
        let element = document.getElementById(CheckNorth(board,index).index);
        element.removeChild(element.firstChild);
        CheckNorth(board,index).revealed = true;
    }
}
function CheckEastForNumber(board, index){
    if(CheckEast(board,index).adjacentMines > 0 && !CheckEast(board,index).revealed
    && !CheckEast(board,index).flagged){
        let element = document.getElementById(CheckEast(board,index).index);
        element.removeChild(element.firstChild);
        CheckEast(board,index).revealed = true;
    }
}
function CheckSouthForNumber(board, index){
    if(CheckSouth(board,index).adjacentMines > 0 && !CheckSouth(board,index).revealed
    && !CheckSouth(board,index).flagged){
        let element = document.getElementById(CheckSouth(board,index).index);
        element.removeChild(element.firstChild);
        CheckSouth(board,index).revealed = true;
    }
}
function CheckWestForNumber(board, index){
    if(CheckWest(board,index).adjacentMines > 0 && !CheckWest(board,index).revealed
    && !CheckWest(board,index).flagged){
        let element = document.getElementById(CheckWest(board,index).index);
        element.removeChild(element.firstChild);
        CheckWest(board,index).revealed = true;
    }
}
function CheckNorthWestForNumber(board, index){
    if(CheckNorthWest(board,index).adjacentMines > 0 && !CheckNorthWest(board,index).revealed
    && !CheckNorthWest(board,index).flagged){
        let element = document.getElementById(CheckNorthWest(board,index).index);
        element.removeChild(element.firstChild);
        CheckNorthWest(board,index).revealed = true;
    }
}
function CheckNorthEastForNumber(board, index){
    if(CheckNorthEast(board,index).adjacentMines > 0 && !CheckNorthEast(board,index).revealed
    && !CheckNorthEast(board,index).flagged){
        let element = document.getElementById(CheckNorthEast(board,index).index);
        element.removeChild(element.firstChild);
        CheckNorthEast(board,index).revealed = true;
    }
}
function CheckSouthEastForNumber(board, index){
    if(CheckSouthEast(board,index).adjacentMines > 0 && !CheckSouthEast(board,index).revealed
    && !CheckSouthEast(board,index).flagged){
        let element = document.getElementById(CheckSouthEast(board,index).index);
        element.removeChild(element.firstChild);
        CheckSouthEast(board,index).revealed = true;
    }
}
function CheckSouthWestForNumber(board, index){
    if(CheckSouthWest(board,index).adjacentMines > 0 && !CheckSouthWest(board,index).revealed
    && !CheckSouthWest(board,index).flagged){
        let element = document.getElementById(CheckSouthWest(board,index).index);
        element.removeChild(element.firstChild);
        CheckSouthWest(board,index).revealed = true;
    }
}
//Flood Empty
function FloodEmptySquares(){
    for (let i = 0; i < boardArray.length; i++)
    {
        if (boardArray[i].revealed && boardArray[i].adjacentMines === 0){
            //Check NorthWest Corner
            if(boardArray[i].index === 0){
                CheckSouthForEmpty(boardArray, i);
                CheckEastForEmpty(boardArray, i);
                CheckSouthEastForEmpty(boardArray, i);
            }
            //Check NorthEast Corner
            else if(boardArray[i].index === width - 1) {
                CheckSouthForEmpty(boardArray, i);
                CheckWestForEmpty(boardArray, i);
                CheckSouthWestForEmpty(boardArray, i);
            }
            //Check SouthEast Corner
            else if(boardArray[i].index === boardArray.length - 1){
                CheckNorthForEmpty(boardArray, i);
                CheckWestForEmpty(boardArray, i);
                CheckNorthWestForEmpty(boardArray, i);
            }
            //Check SouthWest Corner
            else if(boardArray[i].index === boardArray.length - width){
                CheckNorthForEmpty(boardArray, i);
                CheckEastForEmpty(boardArray, i);
                CheckNorthEastForEmpty(boardArray, i);
            }
            //Check North Row
            else if(boardArray[i].index < width) {
                CheckSouthForEmpty(boardArray, i);
                CheckWestForEmpty(boardArray, i);
                CheckEastForEmpty(boardArray, i);
                CheckSouthEastForEmpty(boardArray, i);
                CheckSouthWestForEmpty(boardArray, i);
            }
            //Check East Column
            else if(boardArray[i].index % width === width - 1) {
                CheckNorthForEmpty(boardArray, i);
                CheckWestForEmpty(boardArray, i);
                CheckSouthForEmpty(boardArray, i);
                CheckNorthWestForEmpty(boardArray, i);
                CheckSouthWestForEmpty(boardArray, i);
            }
            //Check South Row
            else if(boardArray[i].index > boardArray.length - width) {
                CheckNorthForEmpty(boardArray, i);
                CheckEastForEmpty(boardArray, i);
                CheckWestForEmpty(boardArray, i);
                CheckNorthEastForEmpty(boardArray, i);
                CheckNorthWestForEmpty(boardArray, i);
            }
            //Check West Column
            else if(boardArray[i].index % width === 0) {
                CheckNorthForEmpty(boardArray, i);
                CheckEastForEmpty(boardArray, i);
                CheckSouthForEmpty(boardArray, i);
                CheckNorthEastForEmpty(boardArray, i);
                CheckSouthEastForEmpty(boardArray, i);
            }
            //Everything Middle
            else{
                CheckNorthForEmpty(boardArray, i);
                CheckSouthForEmpty(boardArray, i);
                CheckWestForEmpty(boardArray, i);
                CheckEastForEmpty(boardArray, i);
                CheckNorthEastForEmpty(boardArray, i);
                CheckNorthWestForEmpty(boardArray, i);
                CheckSouthEastForEmpty(boardArray, i);
                CheckSouthWestForEmpty(boardArray, i);
            }
        }
    }
}
//Flood Numbers After Empty
function FloodNumberSquares(){
    for (let i = 0; i < boardArray.length; i++)
    {
        if (boardArray[i].revealed && boardArray[i].adjacentMines === 0){
            //Check NorthWest Corner
            if(boardArray[i].index === 0){
                CheckSouthForNumber(boardArray, i);
                CheckEastForNumber(boardArray, i);
                CheckSouthEastForNumber(boardArray, i);
            }
            //Check NorthEast Corner
            else if(boardArray[i].index === width - 1) {
                CheckSouthForNumber(boardArray, i);
                CheckWestForNumber(boardArray, i);
                CheckSouthWestForNumber(boardArray, i);
            }
            //Check SouthEast Corner
            else if(boardArray[i].index === boardArray.length - 1){
                CheckNorthForNumber(boardArray, i);
                CheckWestForNumber(boardArray, i);
                CheckNorthWestForNumber(boardArray, i);
            }
            //Check SouthWest Corner
            else if(boardArray[i].index === boardArray.length - width){
                CheckNorthForNumber(boardArray, i);
                CheckEastForNumber(boardArray, i);
                CheckNorthEastForNumber(boardArray, i);
            }
            //Check North Row
            else if(boardArray[i].index < width) {
                CheckSouthForNumber(boardArray, i);
                CheckWestForNumber(boardArray, i);
                CheckEastForNumber(boardArray, i);
                CheckSouthEastForNumber(boardArray, i);
                CheckSouthWestForNumber(boardArray, i);
            }
            //Check East Column
            else if(boardArray[i].index % width === width - 1) {
                CheckNorthForNumber(boardArray, i);
                CheckWestForNumber(boardArray, i);
                CheckSouthForNumber(boardArray, i);
                CheckNorthWestForNumber(boardArray, i);
                CheckSouthWestForNumber(boardArray, i);
            }
            //Check South Row
            else if(boardArray[i].index > boardArray.length - width) {
                CheckNorthForNumber(boardArray, i);
                CheckEastForNumber(boardArray, i);
                CheckWestForNumber(boardArray, i);
                CheckNorthEastForNumber(boardArray, i);
                CheckNorthWestForNumber(boardArray, i);
            }
            //Check West Column
            else if(boardArray[i].index % width === 0) {
                CheckNorthForNumber(boardArray, i);
                CheckEastForNumber(boardArray, i);
                CheckSouthForNumber(boardArray, i);
                CheckNorthEastForNumber(boardArray, i);
                CheckSouthEastForNumber(boardArray, i);
            }
            //Everything Middle
            else{
                CheckNorthForNumber(boardArray, i);
                CheckSouthForNumber(boardArray, i);
                CheckWestForNumber(boardArray, i);
                CheckEastForNumber(boardArray, i);
                CheckNorthEastForNumber(boardArray, i);
                CheckNorthWestForNumber(boardArray, i);
                CheckSouthEastForNumber(boardArray, i);
                CheckSouthWestForNumber(boardArray, i);
            }
        }
    }
}
//###################
//Timer Functions
//###################
function StartTimer(){
    setInterval(function(){
        if(gameStarted){
            seconds++;
            if(seconds === 60){
                minutes++;
            }
            if(minutes < 60){
                timer.firstChild.innerHTML = FormatMinutes() + ":" + FormatSeconds();
            }
            else if(minutes >= 60){
                timer.firstChild.innerHTML = "60:00";
            }
        }
    }, 1000);
}
function FormatSeconds(){
    if(seconds < 10){
        seconds = "0" + seconds;
    }
    if(seconds >= 60){
        seconds = "00";
    }
    return seconds;
}
function FormatMinutes(){
    if(minutes < 10 && minutes > 0){
        countMinutes = "0" + minutes;
    }
    else if(minutes > 10 && minutes < 60){
        countMinutes = minutes;
    }
    else if(minutes === 0){
        countMinutes = "00";
    }
    return countMinutes;
}
//Reset
function ResetGame(container){
    while(container.lastElementChild){
        container.removeChild(container.lastElementChild);
    }
    boardArray = [];
    randomArray = [];
    mineArray = [];
    totalRevealed = 0;
    emptyCheck = false;
    playerHasWon = false;
    playerHasLost = false;
    gameStarted = false;
    seconds = 0;
    minutes = 0;
    Initialize();
    let message = document.querySelector(".finishMessage");
    message.innerHTML = "&nbsp;";
    timer.firstChild.innerHTML = "00:00";
}
function DifficultySettings(mineInt, heightInt, widthInt, 
gameHeight, gameWidth, boardGrid, boardHeight, boardWidth){
    mines = mineInt;
    height = heightInt;
    width = widthInt;
    diffuse = mineInt;
    area = height * width;
    gameContainer.style.height = gameHeight;
    gameContainer.style.width = gameWidth;
    boardContainer.style.gridTemplateColumns = boardGrid;
    boardContainer.style.height = boardHeight;
    boardContainer.style.width = boardWidth;
    diffuser.firstChild.innerHTML = diffuse;
}
//###################
//Click Events
//###################
//Switching to Options Screen
optionButton.onclick = function(){
    optionContainer.style.display = "block";
    gameContainer.style.display = "none";
    browser.style.minWidth = "405px";
    let loseMsg = document.querySelector(".finishMessage");
    loseMsg.innerHTML = "&nbsp;";
}
returnButton.onclick = function(){
    if(dropdown.value === "Easy"){
        DifficultySettings(10, 9, 9, "560px", "400px", "repeat(9, 40px)", "360px", "360px");
        browser.style.minWidth = "405px";
    }
    else if(dropdown.value === "Normal"){
        DifficultySettings(40, 16, 16, "840px", "680px", "repeat(16, 40px)", "640px", "640px");
        browser.style.minWidth = "685px";
    }
    else if(dropdown.value === "Hard"){
        DifficultySettings(99, 16, 30, "840px", "1240px", "repeat(30, 40px)", "640px", "1200px");
        browser.style.minWidth = "1245px";
    }
    gameContainer.style.display = "block";
    optionContainer.style.display = "none";
    ResetGame(boardContainer);
    console.log(new Date().getMonth()+1+"/"+new Date().getDate()+"/"+new Date().getFullYear());
}
dropdown.onchange = function(){
    if(dropdown.value === "Easy"){
        difficultyInfo.innerHTML = `9<span class="x">&times</span>9 Board, 10 Mines`;
    }
    else if(dropdown.value === "Normal"){
        difficultyInfo.innerHTML = `16<span class="x">&times</span>16 Board, 40 Mines`;
    }
    else if(dropdown.value === "Hard"){
        difficultyInfo.innerHTML = `16<span class="x">&times</span>30 Board, 99 Mines</span>`;
    }
}
//Prevents the Default Right Click Menu from Popping Up
gameContainer.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});
//Reset when ResetButton is Clicked
document.addEventListener("click", function (event) {
    if(event.target.matches("#resetButton")){
        ResetGame(boardContainer);
    }
});
//Listener for Square Events
function ResetSquareClicks(){
    const squares = document.querySelectorAll(".square");
    squares.forEach(function (event, index) {
        event.addEventListener("mouseup", function (e) {
            if(!playerHasLost && !playerHasWon && !boardArray[index].flagged
                && e.button === 0){
                if(boardArray[index].hasMine){
                    let loseMsg = document.querySelector(".finishMessage");
                    loseMsg.innerHTML = "Too Bad, Try Again!";
                    gameStarted = false;
                    for (let i = 0; i < boardArray.length; i++){
                        if(boardArray[i].hasMine && !boardArray[i].flagged){
                            let element = document.getElementById(boardArray[i].index);
                            let mines = document.createElement("div")
                            mines.innerHTML = `<div class="hidden">
                            <img id="mine" src=${mineSprite}></div>`;
                            element.removeChild(element.firstChild);
                            element.appendChild(mines);
                        }
                        if(boardArray[i].flagged && !boardArray[i].hasMine){
                            let element = document.getElementById(boardArray[i].index).firstChild;
                            let wrongDiffuse = document.createElement("div")
                            wrongDiffuse.setAttribute("id", "diffuse");
                            wrongDiffuse.innerHTML = `<span>&times</span>`;
                            element.insertBefore(wrongDiffuse, element.firstChild);
                        }
                    }
                    let element = document.getElementById(boardArray[index].index);
                    element.firstElementChild.classList.add("detonate")
                    element.firstElementChild.innerHTML = `<img id="mine" src=${mineSprite}>`;
                    playerHasLost = true;
                }
                else if(!boardArray[index].hasMine && !boardArray[index].revealed){
                    if(boardArray[index].adjacentMines > 0){
                        gameStarted = true;
                        let numberOfMines = document.createElement("div")
                        numberOfMines.classList.add("numberOfMines");
                        numberOfMines.innerHTML = `${boardArray[index].adjacentMines}`;
                        event.appendChild(numberOfMines);
                        numberOfMines.setAttribute("id", `mines${boardArray[index].adjacentMines}`);
                        boardArray[index].revealed = true;
                        boardArray[index].flooded = true;
                        event.removeChild(event.firstChild);
                    }
                    else if(boardArray[index].adjacentMines === 0){
                        gameStarted = true;
                        boardArray[index].revealed = true;
                        event.removeChild(event.firstChild);
                        emptyCheck = true;
                        while(emptyCheck){
                            emptyCheck = false;
                            FloodEmptySquares();
                        }
                        for (let i = 0; i < boardArray.length; i++){
                            FloodNumberSquares();
                        }
                        for (let i = 0; i < boardArray.length; i++){
                            if(boardArray[i].adjacentMines > 0 && 
                                boardArray[i].revealed && !boardArray[i].flooded){
                                let element = document.getElementById(boardArray[i].index);
                                let numberOfMines = document.createElement("div")
                                numberOfMines.classList.add("numberOfMines");
                                numberOfMines.innerHTML = `${boardArray[i].adjacentMines}`;
                                element.appendChild(numberOfMines);
                                numberOfMines.setAttribute("id", `mines${boardArray[i].adjacentMines}`);
                                boardArray[i].flooded = true;
                            }
                        }
                    }
                    totalRevealed = 0;
                    for (let i = 0; i < boardArray.length; i++){
                        if(!boardArray[i].hasMine && boardArray[i].revealed){
                            totalRevealed++;
                        }
                        if(totalRevealed === boardArray.length - mineArray.length){
                            playerHasWon = true;
                            gameStarted = false;
                            let element = document.querySelector(".finishMessage");
                            element.innerHTML = "Completed in " +
                            minutes + " mins, " + seconds + " secs!";
                        }
                    }
                }
            }
            //For Flags
            if(!playerHasLost && !playerHasWon && e.button === 2 && e.button !== 0){
                if(!boardArray[index].revealed){
                    if(!boardArray[index].flagged && diffuse > 0){
                        let element = document.getElementById(boardArray[index].index).firstChild;
                        let flag = document.createElement("div")
                        flag.setAttribute("id", "flag");
                        flag.innerHTML = `<img src=${flagSprite}>`;
                        element.appendChild(flag);
                        boardArray[index].flagged = true;
                        diffuse--;
                        diffuser.firstChild.innerHTML = diffuse;
                    }
                    else if(boardArray[index].flagged){
                        let element = document.getElementById(boardArray[index].index).firstChild;
                        element.removeChild(element.firstChild);
                        boardArray[index].flagged = false;
                        diffuse++;
                        diffuser.firstChild.innerHTML = diffuse;
                    }
                }
            }
        });
        //Highlights Squares while Scrolling
        event.addEventListener("mouseenter", function () {
            if(!boardArray[index].revealed && !playerHasLost && !playerHasWon){
                let element = document.getElementById(boardArray[index].index);
                element.firstChild.style.backgroundColor = "lightgreen";
            }
        });
        event.addEventListener("mouseleave", function () {
            if(!boardArray[index].revealed && !playerHasLost && !playerHasWon){
                let element = document.getElementById(boardArray[index].index);
                element.firstChild.style.backgroundColor = "rgb(190, 190, 190)";
            }
        });
    });
}
