const gameContainer = document.querySelector(".gameContainer");
const optionContainer = document.querySelector(".optionContainer");
const boardContainer = document.querySelector(".gridContainer");
const themesContainer = document.querySelector(".themesContainer");

const optionButton = document.getElementById("settings");
const themesButton = document.getElementById("themes");
const themeSelect = document.querySelectorAll(".themeStyle");
const mineSelect = document.querySelectorAll(".mineStyle");
const flagSelect = document.querySelectorAll(".flagStyle");
const returnButton = document.querySelectorAll(".returnButton");

const dropdown = document.getElementById("dropdown");
const difficultyInfo = document.querySelector(".difficultyInfo");
const timer = document.querySelector(".timer");
const browser = document.querySelector(".browser");
const diffuser = document.querySelector(".diffuser");
const scoreElement = document.querySelector(".highScores");
const disabled = document.getElementById("disabled");

//Music from Mixkit.co
const clickAudio = new Audio("assets/mixkit-typewriter-soft-click-1125.wav");
const floodAudio = new Audio("assets/mixkit-video-game-retro-click-237.wav");
const explosionAudio = new Audio("assets/mixkit-arcade-video-game-explosion-2810.wav");
const winAudio = new Audio("assets/mixkit-winning-chimes-2015.wav");

soundEffect = false;

const mineSprites = ["assets/mine.png", "assets/skull.png"];
const flagSprites = ["assets/flag.png", "assets/caution.png"];

let boardArray = []; // arrays and other reference types should be declared with const, unless we want to be able to set them to null ( which doesn't seem to be the case here )
let randomArray = [];
let mineArray = [];
let mines = 10;
let diffuse = 10;

let height = 9;
let width = 9;
let area = height * width;

let totalSeconds = 0;
let seconds = 0;
let minutes = 0;

let emptyCheck = false;
let totalRevealed = 0;

let gameStarted = false;
let playerHasWon = false;
let playerHasLost = false;

let highScoresEasy = JSON.parse(localStorage.getItem("easy")) || [];
let highScoresNormal = JSON.parse(localStorage.getItem("normal")) || [];
let highScoresHard = JSON.parse(localStorage.getItem("hard")) || [];

let themeStyleArray = []; // see line 32 comment on reference types
let mineStyleArray = [];
let flagStyleArray = [];

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
class HighScores{
    constructor(index, time, date) {
        this.index = index;
        this.time = time;
        this.date = date;
        this.seconds = seconds;
    }
}
class Themes{
    constructor(index, sprite) {
        this.index = index;
        this.selected = false;
        this.sprite = sprite;
    }
}
Initialize();
StartTimer();
function Initialize(){
    RandomizeMines();
    CreateBoard();
    CheckForAdjacentMines();
    ResetSquareClicks();
    SetThemeSelector();
}

//###################
//Click Events
//###################
//Switching to Options Screen
optionButton.addEventListener("click", function (){ // should we be adding event to the dom before we write our functions ? nope
    SwitchScreen(optionContainer);
    if(dropdown.value === "Easy"){
        DisplayScores(highScoresEasy);
    }
    else if(dropdown.value === "Normal"){
        DisplayScores(highScoresNormal);
    }
    else if(dropdown.value === "Hard"){
        DisplayScores(highScoresHard);
    }
})
//Switching to Themes Screen
themesButton.addEventListener("click", function (){ 
    SwitchScreen(themesContainer);
})
function SwitchScreen(container){
    container.style.display = "block";
    gameContainer.style.display = "none";
    browser.style.minWidth = "405px";
    let loseMsg = document.querySelector(".finishMessage");
    loseMsg.innerHTML = "&nbsp;";
}
//Select Themes
SelectStyle(themeSelect, themeStyleArray, "themeStyle");
SelectStyle(mineSelect, mineStyleArray, "mineStyle");
SelectStyle(flagSelect, flagStyleArray, "flagStyle");
function SelectStyle(select, array, styleString){
    select.forEach(function (element, index){
        element.addEventListener("click", function () {
            for (let i = 0; i < array.length; i++){
                array[i].selected = false;
            }
            array[index].selected = true;
            for (let i = 0; i < array.length; i++){
                if(array[i].selected){
                    document.getElementById(`${styleString}${array[i].index + 1}`).parentElement.style.backgroundColor = "skyblue";
                }
                else if(!array[i].selected){
                    document.getElementById(`${styleString}${array[i].index + 1}`).parentElement.style.backgroundColor = "transparent";
                }
            }
        })
    });
}
function SelectedIcon(array){
    for (let i = 0; i < array.length; i++){
        if(array[i].selected){
            return array[i].sprite;
        }
    }
}
//Enable/Disable Sound Effects
disabled.addEventListener("click", function (){
    if(!soundEffect){
        soundEffect = true;
        disabled.firstChild.style.opacity = "0";
    }
    else{
        soundEffect = false;
        disabled.firstChild.style.opacity = ".65";
    }
})
//Switch Back to Game Screen
returnButton.forEach(function (element){
    element.addEventListener("click", function () {
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
        themesContainer.style.display = "none";
        ResetGame(boardContainer);
    })
});
//Change Difficulty from Dropdown
dropdown.addEventListener("change", function (){
    if(dropdown.value === "Easy"){
        difficultyInfo.innerHTML = `9<span class="x">&times</span>9 Board, 10 Mines`;
        scoreElement.innerHTML = "High Scores Easy";
        highScoresEasy = JSON.parse(localStorage.getItem("easy")) || [];
        DisplayScores(highScoresEasy);
    }
    else if(dropdown.value === "Normal"){
        difficultyInfo.innerHTML = `16<span class="x">&times</span>16 Board, 40 Mines`;
        scoreElement.innerHTML = "High Scores Normal";
        highScoresNormal = JSON.parse(localStorage.getItem("normal")) || [];
        DisplayScores(highScoresNormal);
    }
    else if(dropdown.value === "Hard"){
        difficultyInfo.innerHTML = `16<span class="x">&times</span>30 Board, 99 Mines</span>`;
        scoreElement.innerHTML = "High Scores Hard";
        highScoresHard = JSON.parse(localStorage.getItem("hard")) || [];
        DisplayScores(highScoresHard);
    }
})
//Prevents the Default Right Click Menu from Popping Up
function PreventContextMenu(container){
    container.addEventListener("contextmenu", function (event) {
        event.preventDefault();
    });
}
PreventContextMenu(gameContainer);
PreventContextMenu(optionContainer);
PreventContextMenu(themesContainer);
//Reset when ResetButton is Clicked
document.addEventListener("click", function (event) {
    if(event.target.matches("#resetButton")){
        ResetGame(boardContainer);
    }
});
//Listener for Square Events
function ResetSquareClicks(){ // this is not a good function name here
    const squares = document.querySelectorAll(".square");
    squares.forEach(function (event, index) {
        event.addEventListener("mouseup", function (e) { // use an arrow function instead of anonymous function declaration 
            if(!playerHasLost && !playerHasWon && !boardArray[index].flagged && e.button === 0){
                //If Clicked on a Mine
                if(boardArray[index].hasMine){
                    PlaySoundEffect(explosionAudio);
                    let loseMsg = document.querySelector(".finishMessage");
                    loseMsg.innerHTML = "You Detonated, Try Again!";
                    gameStarted = false;
                    for (let i = 0; i < boardArray.length; i++){
                        if(boardArray[i].hasMine && !boardArray[i].flagged){
                            let element = document.getElementById(boardArray[i].index); // this is 6 levels of indentation in - might think about making this jumbo function smaller by refactoring this code into more functions that we then call 
                            let mines = document.createElement("div");
                            mines.innerHTML = `<div class="hidden">
                            <img id="mine" src=${SelectedIcon(mineStyleArray)}></div>`;
                            element.removeChild(element.firstChild);
                            element.appendChild(mines);
                        }
                        else if(boardArray[i].flagged && !boardArray[i].hasMine){
                            let element = document.getElementById(boardArray[i].index).firstChild;
                            let wrongDiffuse = document.createElement("div");
                            wrongDiffuse.setAttribute("id", "diffuse");
                            wrongDiffuse.innerHTML = `<span>&times</span>`;
                            element.insertBefore(wrongDiffuse, element.firstChild);
                        }
                    }
                    let element = document.getElementById(boardArray[index].index);
                    element.firstElementChild.classList.add("detonate");
                    element.firstElementChild.innerHTML = `<img id="mine" src=${SelectedIcon(mineStyleArray)}>`;
                    playerHasLost = true;
                }
                //If Left Clicked
                else if(!boardArray[index].hasMine && !boardArray[index].revealed){
                    //If Clicked a Number
                    if(boardArray[index].adjacentMines > 0){
                        gameStarted = true;
                        PlaySoundEffect(clickAudio);
                        let numberOfMines = document.createElement("div");
                        numberOfMines.classList.add("numberOfMines");
                        numberOfMines.innerHTML = `${boardArray[index].adjacentMines}`;
                        event.appendChild(numberOfMines);
                        numberOfMines.setAttribute("id", `mines${boardArray[index].adjacentMines}`);
                        boardArray[index].revealed = true;
                        boardArray[index].flooded = true;
                        event.removeChild(event.firstChild);
                    }
                    //If Clicked an Empty Square
                    else if(boardArray[index].adjacentMines === 0){
                        gameStarted = true;
                        PlaySoundEffect(floodAudio);
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
                                let numberOfMines = document.createElement("div");
                                numberOfMines.classList.add("numberOfMines");
                                numberOfMines.innerHTML = `${boardArray[i].adjacentMines}`;
                                element.appendChild(numberOfMines);
                                numberOfMines.setAttribute("id", `mines${boardArray[i].adjacentMines}`);
                                boardArray[i].flooded = true;
                            }
                        }
                    }
                    //After Left Click Events, Check if Player Meets Winning Condition
                    totalRevealed = 0;
                    for (let i = 0; i < boardArray.length; i++){
                        if(!boardArray[i].hasMine && boardArray[i].revealed){
                            totalRevealed++;
                        }
                        if(totalRevealed === boardArray.length - mineArray.length){
                            PlaySoundEffect(winAudio);
                            playerHasWon = true;
                            gameStarted = false;
                            let element = document.querySelector(".finishMessage");
                            element.innerHTML = "Completed in " +
                            minutes + " mins, " + seconds + " secs!";
                        }
                    }
                    if(playerHasWon){
                        if(dropdown.value === "Easy"){
                            HighScoresByDifficulty(highScoresEasy, "easy");
                        }
                        else if(dropdown.value === "Normal"){
                            HighScoresByDifficulty(highScoresNormal, "normal");
                        }
                        else if(dropdown.value === "Hard"){
                            HighScoresByDifficulty(highScoresHard, "hard");
                        }
                    }
                }
            }
            //For Flag Placement
            if(!playerHasLost && !playerHasWon && e.button === 2 
                && e.button !== 0 && e.button !== 1){
                if(!boardArray[index].revealed){
                    if(!boardArray[index].flagged && diffuse > 0){
                        let element = document.getElementById(boardArray[index].index).firstChild;
                        let flag = document.createElement("div")
                        flag.setAttribute("id", "flag");
                        flag.innerHTML = `<img src=${SelectedIcon(flagStyleArray)}>`;
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
                element.firstChild.style.backgroundColor = "skyblue";
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
//Themes - consider putting all theme related JS in another file 
function SetThemeSelector(){
    AddThemes(themeSelect, themeStyleArray);
    for(let i = 0; i < themeStyleArray.length; i++){
        if(!themeStyleArray[i].selected){
            document.getElementById(`themeStyle${themeStyleArray[i].index + 1}`).parentElement.style.backgroundColor = "transparent";
        }
    }
    AddThemes(mineSelect, mineStyleArray);
    SetupSprites(mineStyleArray, mineSprites, "mineStyle");
    AddThemes(flagSelect, flagStyleArray);
    SetupSprites(flagStyleArray, flagSprites, "flagStyle");
}
function AddThemes(select, array){
    if(array.length === 0){
        select.forEach(function (element, index){
            array.push(new Themes);
            array[0].selected = true;
            array[index].index = index;
        });
    }
}
function SetupSprites(array, sprites, styleString){
    for(let i = 0; i < sprites.length; i++){
        array[i].sprite = sprites[i];
        let element = document.getElementById(`${styleString}${array[i].index + 1}`);
        element.innerHTML = `<img src=${sprites[i]}>`;
        if(!array[i].selected){
            document.getElementById(`${styleString}${array[i].index + 1}`).parentElement.style.backgroundColor = "transparent";
        }
    }
}
//Play Sound
function PlaySoundEffect(audio){
    if(soundEffect){
        audio.play();
    }
}
//Adding a HighScore to the ScoreBoard
function HighScoresByDifficulty(highScores, difficulty){
    highScores.push(new HighScores());
    highScores[highScores.length - 1].time = minutes + " mins, " + seconds + " secs";
    highScores[highScores.length - 1].date = 
    new Date().getMonth()+1+"/"+new Date().getDate()+"/"+new Date().getFullYear();
    highScores[highScores.length - 1].seconds = totalSeconds;
    SortScores(highScores, difficulty);
    while (highScores.length > 5){
        highScores.pop();
    }
    for (let i = 0; i < highScores.length; i++){
        highScores[i].index = i;
        let time = document.getElementById(`r${highScores[i].index + 1}-time`);
        let date = document.getElementById(`r${highScores[i].index + 1}-date`);
        time.innerHTML = highScores[i].time;
        date.innerHTML = highScores[i].date;
    }
    localStorage.setItem(difficulty, JSON.stringify(highScores));
}
//Display Scores for Each Difficulty When Switching Difficulty
function DisplayScores(highScores){
    for (let i = 0; i < 5; i++){
        let time = document.getElementById(`r${i + 1}-time`);
        let date = document.getElementById(`r${i + 1}-date`);
        time.innerHTML = "";
        date.innerHTML = "";
    }
    if(highScores.length > 0){
        for (let i = 0; i < highScores.length; i++){
            highScores[i].index = i;
            let time = document.getElementById(`r${highScores[i].index + 1}-time`);
            let date = document.getElementById(`r${highScores[i].index + 1}-date`);
            time.innerHTML = highScores[i].time;
            date.innerHTML = highScores[i].date;
        }
    }
}
//Sorting the Scores (Geeksforgeeks.org/bubblesort)
function BubbleSort(array, n){
	// nice! We'll talk about this in unit 4 ! also ysk JS has a built in sort for arrays for the future that may make these instances easier: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort 
	for (let i = 0; i < n - 1; i++) {
		for (let j = 0; j < n - i - 1; j++) {
			if (array[j].seconds > array[j + 1].seconds) {
				let temp = array[j]
				array[j] = array[j + 1]
				array[j + 1] = temp
			}
			array[j].index = j
		}
	}
}
function SortScores(scoreArr, difficulty){
    if(scoreArr.length > 0){
        BubbleSort(scoreArr, scoreArr.length);
        localStorage.setItem(difficulty, JSON.stringify(scoreArr));
    }
}
//Timer Functions
function StartTimer(){
    setInterval(function(){
        if(gameStarted){
            totalSeconds++;
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
	// modulo operator may be helpful here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder
	if (seconds < 10) {
		seconds = '0' + seconds
	}
	if (seconds >= 60) {
		seconds = '00'
	}
	return seconds
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
    totalSeconds = 0;
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
function CheckForAdjacentMines(){ // ~70 lines for if else blocks - stop, it's function time 
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
//Returns Values
function CheckNorth(board, index){ // why not call these get<direction> ie getNorth ( don't capitalize functions)
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
//Initial Check For Mines
function CheckNorthSquare(board, index){
    if(board[index - width].hasMine){ // why not use the return value functions you just wrote ?
        board[index].adjacentMines++;
    }
}
function CheckEastSquare(board, index){ // why not add another param instead of writing the function 8 times to take in the direction / getter function above that corresponds to the direction?
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
//Check For Empty Adjacent Squares when Flooding // flooding in context ?
function CheckForEmpty(direction, board, index){
    if(direction(board,index).adjacentMines === 0 && !direction(board,index).revealed
    && !direction(board,index).flagged){
        let element = document.getElementById(direction(board,index).index);
        element.removeChild(element.firstChild);
        direction(board,index).revealed = true;
        emptyCheck = true;
    }
}
//Check For Adjacent Numbers when Flooding // is flooding === making the board ?
function CheckForNumber(direction, board, index){
    if(direction(board,index).adjacentMines > 0 && !direction(board,index).revealed
    && !direction(board,index).flagged){
        let element = document.getElementById(direction(board,index).index);
        element.removeChild(element.firstChild);
        direction(board,index).revealed = true;
    }
}
//Flood Empty
function FloodEmptySquares(){
    for (let i = 0; i < boardArray.length; i++)
    {
        if (boardArray[i].revealed && boardArray[i].adjacentMines === 0){
            //Check NorthWest Corner
            if(boardArray[i].index === 0){
                CheckForEmpty(CheckSouth, boardArray, i); // x2 ! 
                CheckForEmpty(CheckEast, boardArray, i);
                CheckForEmpty(CheckSouthEast, boardArray, i);
            }
            //Check NorthEast Corner
            else if(boardArray[i].index === width - 1) {
                CheckForEmpty(CheckSouth, boardArray, i);
                CheckForEmpty(CheckWest, boardArray, i);
                CheckForEmpty(CheckSouthWest, boardArray, i);
            }
            //Check SouthEast Corner
            else if(boardArray[i].index === boardArray.length - 1){
                CheckForEmpty(CheckNorth, boardArray, i);
                CheckForEmpty(CheckWest, boardArray, i);
                CheckForEmpty(CheckNorthWest, boardArray, i);
            }
            //Check SouthWest Corner
            else if(boardArray[i].index === boardArray.length - width){
                CheckForEmpty(CheckNorth, boardArray, i);
                CheckForEmpty(CheckEast, boardArray, i);
                CheckForEmpty(CheckNorthEast, boardArray, i);
            }
            //Check North Row
            else if(boardArray[i].index < width) {
                CheckForEmpty(CheckSouth, boardArray, i);
                CheckForEmpty(CheckWest, boardArray, i);
                CheckForEmpty(CheckEast, boardArray, i);
                CheckForEmpty(CheckSouthEast, boardArray, i);
                CheckForEmpty(CheckSouthWest, boardArray, i);
            }
            //Check East Column
            else if(boardArray[i].index % width === width - 1) {
                CheckForEmpty(CheckNorth, boardArray, i);
                CheckForEmpty(CheckWest, boardArray, i);
                CheckForEmpty(CheckSouth, boardArray, i);
                CheckForEmpty(CheckNorthWest, boardArray, i);
                CheckForEmpty(CheckSouthWest, boardArray, i);
            }
            //Check South Row
            else if(boardArray[i].index > boardArray.length - width) {
                CheckForEmpty(CheckNorth, boardArray, i);
                CheckForEmpty(CheckEast, boardArray, i);
                CheckForEmpty(CheckWest, boardArray, i);
                CheckForEmpty(CheckNorthEast, boardArray, i);
                CheckForEmpty(CheckNorthWest, boardArray, i);
            }
            //Check West Column
            else if(boardArray[i].index % width === 0) {
                CheckForEmpty(CheckNorth, boardArray, i);
                CheckForEmpty(CheckEast, boardArray, i);
                CheckForEmpty(CheckSouth, boardArray, i);
                CheckForEmpty(CheckNorthEast, boardArray, i);
                CheckForEmpty(CheckSouthEast, boardArray, i);
            }
            //Everything Middle
            else{
                CheckForEmpty(CheckNorth, boardArray, i);
                CheckForEmpty(CheckSouth, boardArray, i);
                CheckForEmpty(CheckWest, boardArray, i);
                CheckForEmpty(CheckEast, boardArray, i);
                CheckForEmpty(CheckNorthEast, boardArray, i);
                CheckForEmpty(CheckNorthWest, boardArray, i);
                CheckForEmpty(CheckSouthEast, boardArray, i);
                CheckForEmpty(CheckSouthWest, boardArray, i);
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
            if(boardArray[i].index === 0){ // x3 !!!!!!!!!!!!!!!!!!!!!!!!!
                CheckForNumber(CheckSouth, boardArray, i);
                CheckForNumber(CheckEast, boardArray, i);
                CheckForNumber(CheckSouthEast, boardArray, i);
            }
            //Check NorthEast Corner
            else if(boardArray[i].index === width - 1) {
                CheckForNumber(CheckSouth, boardArray, i);
                CheckForNumber(CheckWest, boardArray, i);
                CheckForNumber(CheckSouthWest, boardArray, i);
            }
            //Check SouthEast Corner
            else if(boardArray[i].index === boardArray.length - 1){
                CheckForNumber(CheckNorth, boardArray, i);
                CheckForNumber(CheckWest, boardArray, i);
                CheckForNumber(CheckNorthWest, boardArray, i);
            }
            //Check SouthWest Corner
            else if(boardArray[i].index === boardArray.length - width){
                CheckForNumber(CheckNorth, boardArray, i);
                CheckForNumber(CheckEast, boardArray, i);
                CheckForNumber(CheckNorthEast, boardArray, i);
            }
            //Check North Row
            else if(boardArray[i].index < width) {
                CheckForNumber(CheckSouth, boardArray, i);
                CheckForNumber(CheckWest, boardArray, i);
                CheckForNumber(CheckEast, boardArray, i);
                CheckForNumber(CheckSouthEast, boardArray, i);
                CheckForNumber(CheckSouthWest, boardArray, i);
            }
            //Check East Column
            else if(boardArray[i].index % width === width - 1) {
                CheckForNumber(CheckNorth, boardArray, i);
                CheckForNumber(CheckWest, boardArray, i);
                CheckForNumber(CheckSouth, boardArray, i);
                CheckForNumber(CheckNorthWest, boardArray, i);
                CheckForNumber(CheckSouthWest, boardArray, i);
            }
            //Check South Row
            else if(boardArray[i].index > boardArray.length - width) {
                CheckForNumber(CheckNorth, boardArray, i);
                CheckForNumber(CheckEast, boardArray, i);
                CheckForNumber(CheckWest, boardArray, i);
                CheckForNumber(CheckNorthEast, boardArray, i);
                CheckForNumber(CheckNorthWest, boardArray, i);
            }
            //Check West Column
            else if(boardArray[i].index % width === 0) {
                CheckForNumber(CheckNorth, boardArray, i);
                CheckForNumber(CheckEast, boardArray, i);
                CheckForNumber(CheckSouth, boardArray, i);
                CheckForNumber(CheckNorthEast, boardArray, i);
                CheckForNumber(CheckSouthEast, boardArray, i);
            }
            //Everything Middle
            else{
                CheckForNumber(CheckNorth, boardArray, i);
                CheckForNumber(CheckSouth, boardArray, i);
                CheckForNumber(CheckWest, boardArray, i);
                CheckForNumber(CheckEast, boardArray, i);
                CheckForNumber(CheckNorthEast, boardArray, i);
                CheckForNumber(CheckNorthWest, boardArray, i);
                CheckForNumber(CheckSouthEast, boardArray, i);
                CheckForNumber(CheckSouthWest, boardArray, i);
            }
        }
    }
}
