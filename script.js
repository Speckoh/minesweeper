const gameContainer = document.querySelector(".gameContainer")
const optionContainer = document.querySelector(".optionContainer")
const boardContainer = document.querySelector(".gridContainer")
const themesContainer = document.querySelector(".themesContainer")

const optionButton = document.getElementById("settings")
const themesButton = document.getElementById("themes")
const themeSelect = document.querySelectorAll(".themeStyle")
const mineSelect = document.querySelectorAll(".mineStyle")
const flagSelect = document.querySelectorAll(".flagStyle")
const returnButton = document.querySelectorAll(".returnButton")

const dropdown = document.getElementById("dropdown")
const difficultyInfo = document.querySelector(".difficultyInfo")
const timer = document.querySelector(".timer")
const browser = document.querySelector(".browser")
const diffuser = document.querySelector(".diffuser")
const scoreElement = document.querySelector(".highScores")
const disabled = document.getElementById("disabled")

//Music from Mixkit.co
const clickAudio = new Audio("assets/mixkit-typewriter-soft-click-1125.wav")
const floodAudio = new Audio("assets/mixkit-video-game-retro-click-237.wav")
const explosionAudio = new Audio("assets/mixkit-arcade-video-game-explosion-2810.wav")
const winAudio = new Audio("assets/mixkit-winning-chimes-2015.wav")

let soundEffect = false

const mineSprites = ["assets/mine.png", "assets/skull.png"]
const flagSprites = ["assets/flag.png", "assets/caution.png"]

let boardArray = []
let randomArray = []
let mineArray = []
let mines = 10
let diffuse = 10

let height = 9
let width = 9
let area = height * width

let totalSeconds = 0
let seconds = 0
let minutes = 0

let emptyCheck = false
let totalRevealed = 0

let gameStarted = false
let playerHasWon = false
let playerHasLost = false

let highScoresEasy = JSON.parse(localStorage.getItem("easy")) || []
let highScoresNormal = JSON.parse(localStorage.getItem("normal")) || []
let highScoresHard = JSON.parse(localStorage.getItem("hard")) || []

let themeStyleArray = []
let mineStyleArray = []
let flagStyleArray = []

class Square {
    constructor(index) {
        this.index = index
        this.hasMine = false
        this.adjacentMines = 0
        this.revealed = false
        this.flooded = false
        this.flagged = false
    }
}
class HighScores{
    constructor(index, time, date) {
        this.index = index
        this.time = time
        this.date = date
        this.seconds = seconds
    }
}
class Themes{
    constructor(index, sprite) {
        this.index = index
        this.selected = false
        this.sprite = sprite
    }
}
initialize()
startTimer()
function initialize(){
    randomizeMines()
    createBoard()
    checkForAdjacentMines()
    resetSquareClicks()
    setThemeSelector()
}
function switchScreen(container){
    container.style.display = "block"
    gameContainer.style.display = "none"
    browser.style.minWidth = "405px"
    let loseMsg = document.querySelector(".finishMessage")
    loseMsg.innerHTML = "&nbsp;"
}
function selectStyle(select, array, styleString){
    select.forEach(function (element, index){
        element.addEventListener("click", function () {
            for (let i = 0; i < array.length; i++){
                array[i].selected = false
            }
            array[index].selected = true
            for (let i = 0; i < array.length; i++){
                if(array[i].selected){
                    document.getElementById(`${styleString}${array[i].index + 1}`).parentElement.style.backgroundColor = "skyblue"
                }
                else if(!array[i].selected){
                    document.getElementById(`${styleString}${array[i].index + 1}`).parentElement.style.backgroundColor = "transparent"
                }
            }
        })
    })
}
function selectedIcon(array){
    for (let i = 0; i < array.length; i++){
        if(array[i].selected){
            return array[i].sprite
        }
    }
}
function preventContextMenu(container){
    container.addEventListener("contextmenu", function (event) {
        event.preventDefault()
    })
}
//Returns Values
function checkNorth(board, index){
    return board[index - width]
}
function checkEast(board, index){
    return board[index + 1]
}
function checkSouth(board, index){
    return board[index + width]
}
function checkWest(board, index){
    return board[index - 1]
}
function checkNorthWest(board, index){
    return board[(index - width) - 1]
}
function checkNorthEast(board, index){
    return board[(index - width) + 1]
}
function checkSouthEast(board, index){
    return board[(index + width) + 1]
}
function checkSouthWest(board, index){
    return board[(index + width) - 1]
}
//Initial check For Mines
function checkNorthSquare(board, index){
    if(board[index - width].hasMine){
        board[index].adjacentMines++
    }
}
function checkEastSquare(board, index){
    if(board[index + 1].hasMine){
        board[index].adjacentMines++
    }
}
function checkSouthSquare(board, index){
    if(board[index + width].hasMine){
        board[index].adjacentMines++
    }
}
function checkWestSquare(board, index){
    if(board[index - 1].hasMine){
        board[index].adjacentMines++
    }
}
function checkNorthWestSquare(board, index){
    if(board[(index - width) - 1].hasMine){
        board[index].adjacentMines++
    }
}
function checkNorthEastSquare(board, index){
    if(board[(index - width) + 1].hasMine){
        board[index].adjacentMines++
    }
}
function checkSouthEastSquare(board, index){
    if(board[(index + width) + 1].hasMine){
        board[index].adjacentMines++
    }
}
function checkSouthWestSquare(board, index){
    if(board[(index + width) - 1].hasMine){
        board[index].adjacentMines++
    }
}
//Themes
function setThemeSelector(){
    addThemes(themeSelect, themeStyleArray)
    for(let i = 0; i < themeStyleArray.length; i++){
        if(!themeStyleArray[i].selected){
            document.getElementById(`themeStyle${themeStyleArray[i].index + 1}`).parentElement.style.backgroundColor = "transparent"
        }
    }
    addThemes(mineSelect, mineStyleArray)
    setupSprites(mineStyleArray, mineSprites, "mineStyle")
    addThemes(flagSelect, flagStyleArray)
    setupSprites(flagStyleArray, flagSprites, "flagStyle")
}
function addThemes(select, array){
    if(array.length === 0){
        select.forEach(function (element, index){
            array.push(new Themes)
            array[0].selected = true
            array[index].index = index
        })
    }
}
function setupSprites(array, sprites, styleString){
    for(let i = 0; i < sprites.length; i++){
        array[i].sprite = sprites[i]
        let element = document.getElementById(`${styleString}${array[i].index + 1}`)
        element.innerHTML = `<img src=${sprites[i]}>`
        if(!array[i].selected){
            document.getElementById(`${styleString}${array[i].index + 1}`).parentElement.style.backgroundColor = "transparent"
        }
    }
}
//Play Sound
function playSoundEffect(audio){
    if(soundEffect){
        audio.play()
    }
}
//Adding a HighScore to the ScoreBoard
function highScoresByDifficulty(highScores, difficulty){
    highScores.push(new HighScores())
    highScores[highScores.length - 1].time = minutes + " mins, " + seconds + " secs"
    highScores[highScores.length - 1].date = 
    new Date().getMonth()+1+"/"+new Date().getDate()+"/"+new Date().getFullYear()
    highScores[highScores.length - 1].seconds = totalSeconds
    sortScores(highScores, difficulty)
    while (highScores.length > 5){
        highScores.pop()
    }
    for (let i = 0; i < highScores.length; i++){
        highScores[i].index = i
        let time = document.getElementById(`r${highScores[i].index + 1}-time`)
        let date = document.getElementById(`r${highScores[i].index + 1}-date`)
        time.innerHTML = highScores[i].time
        date.innerHTML = highScores[i].date
    }
    localStorage.setItem(difficulty, JSON.stringify(highScores))
}
//Display Scores for Each Difficulty When Switching Difficulty
function displayScores(highScores){
    for (let i = 0; i < 5; i++){
        let time = document.getElementById(`r${i + 1}-time`)
        let date = document.getElementById(`r${i + 1}-date`)
        time.innerHTML = ""
        date.innerHTML = ""
    }
    if(highScores.length > 0){
        for (let i = 0; i < highScores.length; i++){
            highScores[i].index = i
            let time = document.getElementById(`r${highScores[i].index + 1}-time`)
            let date = document.getElementById(`r${highScores[i].index + 1}-date`)
            time.innerHTML = highScores[i].time
            date.innerHTML = highScores[i].date
        }
    }
}
//Sorting the Scores (Geeksforgeeks.org/bubblesort)
function bubbleSort(array, n){
    for (let i = 0; i < n - 1; i++){
        for(let j = 0; j < n - i - 1; j++){
            if(array[j].seconds > array[j + 1].seconds){
                let temp = array[j]
                array[j] = array[j + 1]
                array[j + 1] = temp
            }
            array[j].index = j
        }
    }
}
function sortScores(scoreArr, difficulty){
    if(scoreArr.length > 0){
        BubbleSort(scoreArr, scoreArr.length)
        localStorage.setItem(difficulty, JSON.stringify(scoreArr))
    }
}
//Timer Functions
function startTimer(){
    setInterval(function(){
        if(gameStarted){
            totalSeconds++
            seconds++
            if(seconds === 60){
                minutes++
            }
            if(minutes < 60){
                timer.firstChild.innerHTML = formatMinutes() + ":" + formatSeconds()
            }
            else if(minutes >= 60){
                timer.firstChild.innerHTML = "60:00"
            }
        }
    }, 1000)
}
function formatSeconds(){
    if(seconds < 10){
        seconds = "0" + seconds
    }
    if(seconds >= 60){
        seconds = "00"
    }
    return seconds
}
function formatMinutes(){
    let countMinutes
    if(minutes < 10 && minutes > 0){
        countMinutes = "0" + minutes
    }
    else if(minutes > 10 && minutes < 60){
        countMinutes = minutes
    }
    else if(minutes === 0){
        countMinutes = "00"
    }
    return countMinutes
}
//Reset
function resetGame(container){
    while(container.lastElementChild){
        container.removeChild(container.lastElementChild)
    }
    boardArray = []
    randomArray = []
    mineArray = []
    totalRevealed = 0
    emptyCheck = false
    playerHasWon = false
    playerHasLost = false
    gameStarted = false
    totalSeconds = 0
    seconds = 0
    minutes = 0
    initialize()
    let message = document.querySelector(".finishMessage")
    message.innerHTML = "&nbsp;"
    timer.firstChild.innerHTML = "00:00"
}
function difficultySettings(mineInt, heightInt, widthInt, 
gameHeight, gameWidth, boardGrid, boardHeight, boardWidth){
    mines = mineInt
    height = heightInt
    width = widthInt
    diffuse = mineInt
    area = height * width
    gameContainer.style.height = gameHeight
    gameContainer.style.width = gameWidth
    boardContainer.style.gridTemplateColumns = boardGrid
    boardContainer.style.height = boardHeight
    boardContainer.style.width = boardWidth
    diffuser.firstChild.innerHTML = diffuse
}
//Mine Randomizer
function randomizeMines(){
    if (randomArray.length === 0){
        let randomIndex = Math.floor(Math.random() * area)
        randomArray.push(randomIndex)
    }
    while (randomArray.length < area){
        let randomIndex = Math.floor(Math.random() * area)
        let numIsInArray = false
        for (let i = 0; i < randomArray.length; i++){
            if(randomIndex === randomArray[i]){
                numIsInArray = true
            }
        }
        if(!numIsInArray){
            randomArray.push(randomIndex)
        }
    }
    for (let i = 0; i < mines; i++){
        mineArray.push(new Square(randomArray[i]))
    }
}
//Creates Squares for the Board and Adds the Mines
function createBoard(){
    for (let i = 0; i < area; i++){
    
        boardArray.push(new Square(i))
        let box = document.createElement("div")
        box.classList.add("square")
        box.setAttribute("id", `${boardArray[i].index}`)
        box.innerHTML = `<div class="hidden"></div>`
        boardContainer.appendChild(box)
        for (let j = 0; j < mineArray.length; j++){
            if(boardArray[i].index === mineArray[j].index){
                boardArray[i].hasMine = true
            }
        }
    }
    diffuse = mineArray.length
    diffuser.firstChild.innerHTML = diffuse
}
//Check for Adjacent Mines When Initializing and assigning adjacentMine Value
function checkForAdjacentMines(){
    for (let i = 0; i < area; i++){
        if(boardArray[i].index === 0){
            checkSouthSquare(boardArray, i)
            checkEastSquare(boardArray, i)
            checkSouthEastSquare(boardArray, i)
        }
        //Check NorthEast Corner
        else if(boardArray[i].index === width - 1) {
            checkSouthSquare(boardArray, i)
            checkWestSquare(boardArray, i)
            checkSouthWestSquare(boardArray, i)
        }
        //Check SouthEast Corner
        else if(boardArray[i].index === boardArray.length - 1){
            checkNorthSquare(boardArray, i)
            checkWestSquare(boardArray, i)
            checkNorthWestSquare(boardArray, i)
        }
        //Check SouthWest Corner
        else if(boardArray[i].index === boardArray.length - width){
            checkNorthSquare(boardArray, i)
            checkEastSquare(boardArray, i)
            checkNorthEastSquare(boardArray, i)
        }
        //Check North Row
        else if(boardArray[i].index < width) {
            checkSouthSquare(boardArray, i)
            checkWestSquare(boardArray, i)
            checkEastSquare(boardArray, i)
            checkSouthEastSquare(boardArray, i)
            checkSouthWestSquare(boardArray, i)
        }
        //Check East Column
        else if(boardArray[i].index % width === width - 1) {
            checkNorthSquare(boardArray, i)
            checkWestSquare(boardArray, i)
            checkSouthSquare(boardArray, i)
            checkNorthWestSquare(boardArray, i)
            checkSouthWestSquare(boardArray, i)
        }
        //Check South Row
        else if(boardArray[i].index > boardArray.length - width) {
            checkNorthSquare(boardArray, i)
            checkEastSquare(boardArray, i)
            checkWestSquare(boardArray, i)
            checkNorthEastSquare(boardArray, i)
            checkNorthWestSquare(boardArray, i)
        }
        //Check West Column
        else if(boardArray[i].index % width === 0) {
            checkNorthSquare(boardArray, i)
            checkEastSquare(boardArray, i)
            checkSouthSquare(boardArray, i)
            checkNorthEastSquare(boardArray, i)
            checkSouthEastSquare(boardArray, i)
        }
        //Everything Middle
        else{
            checkNorthSquare(boardArray, i)
            checkSouthSquare(boardArray, i)
            checkWestSquare(boardArray, i)
            checkEastSquare(boardArray, i)
            checkNorthEastSquare(boardArray, i)
            checkNorthWestSquare(boardArray, i)
            checkSouthEastSquare(boardArray, i)
            checkSouthWestSquare(boardArray, i)
        }
    } 
}
//check For Empty Adjacent Squares when Flooding
function checkForEmpty(direction, board, index){
    if(direction(board,index).adjacentMines === 0 && !direction(board,index).revealed
    && !direction(board,index).flagged){
        let element = document.getElementById(direction(board,index).index)
        element.removeChild(element.firstChild)
        direction(board,index).revealed = true
        emptyCheck = true
    }
}
//Flood Empty
function floodEmptySquares(){
    for (let i = 0; i < boardArray.length; i++)
    {
        if (boardArray[i].revealed && boardArray[i].adjacentMines === 0){
            //Check NorthWest Corner
            if(boardArray[i].index === 0){
                checkForEmpty(checkSouth, boardArray, i)
                checkForEmpty(checkEast, boardArray, i)
                checkForEmpty(checkSouthEast, boardArray, i)
            }
            //check NorthEast Corner
            else if(boardArray[i].index === width - 1) {
                checkForEmpty(checkSouth, boardArray, i)
                checkForEmpty(checkWest, boardArray, i)
                checkForEmpty(checkSouthWest, boardArray, i)
            }
            //check SouthEast Corner
            else if(boardArray[i].index === boardArray.length - 1){
                checkForEmpty(checkNorth, boardArray, i)
                checkForEmpty(checkWest, boardArray, i)
                checkForEmpty(checkNorthWest, boardArray, i)
            }
            //check SouthWest Corner
            else if(boardArray[i].index === boardArray.length - width){
                checkForEmpty(checkNorth, boardArray, i)
                checkForEmpty(checkEast, boardArray, i)
                checkForEmpty(checkNorthEast, boardArray, i)
            }
            //check North Row
            else if(boardArray[i].index < width) {
                checkForEmpty(checkSouth, boardArray, i)
                checkForEmpty(checkWest, boardArray, i)
                checkForEmpty(checkEast, boardArray, i)
                checkForEmpty(checkSouthEast, boardArray, i)
                checkForEmpty(checkSouthWest, boardArray, i)
            }
            //check East Column
            else if(boardArray[i].index % width === width - 1) {
                checkForEmpty(checkNorth, boardArray, i)
                checkForEmpty(checkWest, boardArray, i)
                checkForEmpty(checkSouth, boardArray, i)
                checkForEmpty(checkNorthWest, boardArray, i)
                checkForEmpty(checkSouthWest, boardArray, i)
            }
            //check South Row
            else if(boardArray[i].index > boardArray.length - width) {
                checkForEmpty(checkNorth, boardArray, i)
                checkForEmpty(checkEast, boardArray, i)
                checkForEmpty(checkWest, boardArray, i)
                checkForEmpty(checkNorthEast, boardArray, i)
                checkForEmpty(checkNorthWest, boardArray, i)
            }
            //check West Column
            else if(boardArray[i].index % width === 0) {
                checkForEmpty(checkNorth, boardArray, i)
                checkForEmpty(checkEast, boardArray, i)
                checkForEmpty(checkSouth, boardArray, i)
                checkForEmpty(checkNorthEast, boardArray, i)
                checkForEmpty(checkSouthEast, boardArray, i)
            }
            //Everything Middle
            else{
                checkForEmpty(checkNorth, boardArray, i)
                checkForEmpty(checkSouth, boardArray, i)
                checkForEmpty(checkWest, boardArray, i)
                checkForEmpty(checkEast, boardArray, i)
                checkForEmpty(checkNorthEast, boardArray, i)
                checkForEmpty(checkNorthWest, boardArray, i)
                checkForEmpty(checkSouthEast, boardArray, i)
                checkForEmpty(checkSouthWest, boardArray, i)
            }
        }
    }
}
//Check For Adjacent Numbers when Flooding
function checkForNumber(direction, board, index){
    if(direction(board,index).adjacentMines > 0 && !direction(board,index).revealed
    && !direction(board,index).flagged){
        let element = document.getElementById(direction(board,index).index)
        element.removeChild(element.firstChild)
        direction(board,index).revealed = true
    }
}
//Flood Numbers After Empty
function floodNumberSquares(){
    for (let i = 0; i < boardArray.length; i++)
    {
        if (boardArray[i].revealed && boardArray[i].adjacentMines === 0){
            //check NorthWest Corner
            if(boardArray[i].index === 0){
                checkForNumber(checkSouth, boardArray, i)
                checkForNumber(checkEast, boardArray, i)
                checkForNumber(checkSouthEast, boardArray, i)
            }
            //check NorthEast Corner
            else if(boardArray[i].index === width - 1) {
                checkForNumber(checkSouth, boardArray, i)
                checkForNumber(checkWest, boardArray, i)
                checkForNumber(checkSouthWest, boardArray, i)
            }
            //check SouthEast Corner
            else if(boardArray[i].index === boardArray.length - 1){
                checkForNumber(checkNorth, boardArray, i)
                checkForNumber(checkWest, boardArray, i)
                checkForNumber(checkNorthWest, boardArray, i)
            }
            //check SouthWest Corner
            else if(boardArray[i].index === boardArray.length - width){
                checkForNumber(checkNorth, boardArray, i)
                checkForNumber(checkEast, boardArray, i)
                checkForNumber(checkNorthEast, boardArray, i)
            }
            //check North Row
            else if(boardArray[i].index < width) {
                checkForNumber(checkSouth, boardArray, i)
                checkForNumber(checkWest, boardArray, i)
                checkForNumber(checkEast, boardArray, i)
                checkForNumber(checkSouthEast, boardArray, i)
                checkForNumber(checkSouthWest, boardArray, i)
            }
            //check East Column
            else if(boardArray[i].index % width === width - 1) {
                checkForNumber(checkNorth, boardArray, i)
                checkForNumber(checkWest, boardArray, i)
                checkForNumber(checkSouth, boardArray, i)
                checkForNumber(checkNorthWest, boardArray, i)
                checkForNumber(checkSouthWest, boardArray, i)
            }
            //check South Row
            else if(boardArray[i].index > boardArray.length - width) {
                checkForNumber(checkNorth, boardArray, i)
                checkForNumber(checkEast, boardArray, i)
                checkForNumber(checkWest, boardArray, i)
                checkForNumber(checkNorthEast, boardArray, i)
                checkForNumber(checkNorthWest, boardArray, i)
            }
            //check West Column
            else if(boardArray[i].index % width === 0) {
                checkForNumber(checkNorth, boardArray, i)
                checkForNumber(checkEast, boardArray, i)
                checkForNumber(checkSouth, boardArray, i)
                checkForNumber(checkNorthEast, boardArray, i)
                checkForNumber(checkSouthEast, boardArray, i)
            }
            //Everything Middle
            else{
                checkForNumber(checkNorth, boardArray, i)
                checkForNumber(checkSouth, boardArray, i)
                checkForNumber(checkWest, boardArray, i)
                checkForNumber(checkEast, boardArray, i)
                checkForNumber(checkNorthEast, boardArray, i)
                checkForNumber(checkNorthWest, boardArray, i)
                checkForNumber(checkSouthEast, boardArray, i)
                checkForNumber(checkSouthWest, boardArray, i)
            }
        }
    }
}
//###################
//Click Events
//###################
//Switching to Options Screen
optionButton.addEventListener("click", function (){
    switchScreen(optionContainer)
    if(dropdown.value === "Easy"){
        displayScores(highScoresEasy)
    }
    else if(dropdown.value === "Normal"){
        displayScores(highScoresNormal)
    }
    else if(dropdown.value === "Hard"){
        displayScores(highScoresHard)
    }
})
//Switching to Themes Screen
themesButton.addEventListener("click", function (){
    switchScreen(themesContainer)
})

//Select Themes
selectStyle(themeSelect, themeStyleArray, "themeStyle")
selectStyle(mineSelect, mineStyleArray, "mineStyle")
selectStyle(flagSelect, flagStyleArray, "flagStyle")


//Enable/Disable Sound Effects
disabled.addEventListener("click", function (){
    if(!soundEffect){
        soundEffect = true
        disabled.firstChild.style.opacity = "0"
    }
    else{
        soundEffect = false
        disabled.firstChild.style.opacity = ".65"
    }
})
//Switch Back to Game Screen
returnButton.forEach(function (element){
    element.addEventListener("click", function () {
        if(dropdown.value === "Easy"){
            difficultySettings(10, 9, 9, "560px", "400px", "repeat(9, 40px)", "360px", "360px")
            browser.style.minWidth = "405px"
        }
        else if(dropdown.value === "Normal"){
            difficultySettings(40, 16, 16, "840px", "680px", "repeat(16, 40px)", "640px", "640px")
            browser.style.minWidth = "685px"
        }
        else if(dropdown.value === "Hard"){
            difficultySettings(99, 16, 30, "840px", "1240px", "repeat(30, 40px)", "640px", "1200px")
            browser.style.minWidth = "1245px"
        }
        gameContainer.style.display = "block"
        optionContainer.style.display = "none"
        themesContainer.style.display = "none"
        resetGame(boardContainer)
    })
})
//Change Difficulty from Dropdown
dropdown.addEventListener("change", function (){
    if(dropdown.value === "Easy"){
        difficultyInfo.innerHTML = `9<span class="x">&times</span>9 Board, 10 Mines`
        scoreElement.innerHTML = "High Scores Easy"
        highScoresEasy = JSON.parse(localStorage.getItem("easy")) || []
        displayScores(highScoresEasy)
    }
    else if(dropdown.value === "Normal"){
        difficultyInfo.innerHTML = `16<span class="x">&times</span>16 Board, 40 Mines`
        scoreElement.innerHTML = "High Scores Normal"
        highScoresNormal = JSON.parse(localStorage.getItem("normal")) || []
        displayScores(highScoresNormal)
    }
    else if(dropdown.value === "Hard"){
        difficultyInfo.innerHTML = `16<span class="x">&times</span>30 Board, 99 Mines</span>`
        scoreElement.innerHTML = "High Scores Hard"
        highScoresHard = JSON.parse(localStorage.getItem("hard")) || []
        displayScores(highScoresHard)
    }
})
//Prevents the Default Right Click Menu from Popping Up

preventContextMenu(gameContainer)
preventContextMenu(optionContainer)
preventContextMenu(themesContainer)
//Reset when ResetButton is Clicked
document.addEventListener("click", function (event) {
    if(event.target.matches("#resetButton")){
        resetGame(boardContainer)
    }
})
//Listener for Square Events
function resetSquareClicks(){
    const squares = document.querySelectorAll(".square")
    squares.forEach(function (event, index) {
        event.addEventListener("mouseup", function (e) {
            if(!playerHasLost && !playerHasWon && !boardArray[index].flagged && e.button === 0){
                //If Clicked on a Mine
                if(boardArray[index].hasMine){
                    playSoundEffect(explosionAudio)
                    let loseMsg = document.querySelector(".finishMessage")
                    loseMsg.innerHTML = "You Detonated, Try Again!"
                    gameStarted = false
                    for (let i = 0; i < boardArray.length; i++){
                        if(boardArray[i].hasMine && !boardArray[i].flagged){
                            let element = document.getElementById(boardArray[i].index)
                            let mines = document.createElement("div")
                            mines.innerHTML = `<div class="hidden">
                            <img id="mine" src=${selectedIcon(mineStyleArray)}></div>`
                            element.removeChild(element.firstChild)
                            element.appendChild(mines)
                        }
                        else if(boardArray[i].flagged && !boardArray[i].hasMine){
                            let element = document.getElementById(boardArray[i].index).firstChild
                            let wrongDiffuse = document.createElement("div")
                            wrongDiffuse.setAttribute("id", "diffuse")
                            wrongDiffuse.innerHTML = `<span>&times</span>`
                            element.insertBefore(wrongDiffuse, element.firstChild)
                        }
                    }
                    let element = document.getElementById(boardArray[index].index)
                    element.firstElementChild.classList.add("detonate")
                    element.firstElementChild.innerHTML = `<img id="mine" src=${selectedIcon(mineStyleArray)}>`
                    playerHasLost = true
                }
                //If Left Clicked
                else if(!boardArray[index].hasMine && !boardArray[index].revealed){
                    //If Clicked a Number
                    if(boardArray[index].adjacentMines > 0){
                        gameStarted = true
                        playSoundEffect(clickAudio)
                        let numberOfMines = document.createElement("div")
                        numberOfMines.classList.add("numberOfMines")
                        numberOfMines.innerHTML = `${boardArray[index].adjacentMines}`
                        event.appendChild(numberOfMines)
                        numberOfMines.setAttribute("id", `mines${boardArray[index].adjacentMines}`)
                        boardArray[index].revealed = true
                        boardArray[index].flooded = true
                        event.removeChild(event.firstChild)
                    }
                    //If Clicked an Empty Square
                    else if(boardArray[index].adjacentMines === 0){
                        gameStarted = true
                        playSoundEffect(floodAudio)
                        boardArray[index].revealed = true
                        event.removeChild(event.firstChild)
                        emptyCheck = true
                        while(emptyCheck){
                            emptyCheck = false
                            floodEmptySquares()
                        }
                        for (let i = 0; i < boardArray.length; i++){
                            floodNumberSquares()
                        }
                        for (let i = 0; i < boardArray.length; i++){
                            if(boardArray[i].adjacentMines > 0 && 
                                boardArray[i].revealed && !boardArray[i].flooded){
                                let element = document.getElementById(boardArray[i].index)
                                let numberOfMines = document.createElement("div")
                                numberOfMines.classList.add("numberOfMines")
                                numberOfMines.innerHTML = `${boardArray[i].adjacentMines}`
                                element.appendChild(numberOfMines)
                                numberOfMines.setAttribute("id", `mines${boardArray[i].adjacentMines}`)
                                boardArray[i].flooded = true
                            }
                        }
                    }
                    //After Left Click Events, Check if Player Meets Winning Condition
                    totalRevealed = 0
                    for (let i = 0; i < boardArray.length; i++){
                        if(!boardArray[i].hasMine && boardArray[i].revealed){
                            totalRevealed++
                        }
                        if(totalRevealed === boardArray.length - mineArray.length){
                            playSoundEffect(winAudio)
                            playerHasWon = true
                            gameStarted = false
                            let element = document.querySelector(".finishMessage")
                            element.innerHTML = "Completed in " +
                            minutes + " mins, " + seconds + " secs!"
                        }
                    }
                    if(playerHasWon){
                        if(dropdown.value === "Easy"){
                            highScoresByDifficulty(highScoresEasy, "easy")
                        }
                        else if(dropdown.value === "Normal"){
                            highScoresByDifficulty(highScoresNormal, "normal")
                        }
                        else if(dropdown.value === "Hard"){
                            highScoresByDifficulty(highScoresHard, "hard")
                        }
                    }
                }
            }
            //For Flag Placement
            if(!playerHasLost && !playerHasWon && e.button === 2 
                && e.button !== 0 && e.button !== 1){
                if(!boardArray[index].revealed){
                    if(!boardArray[index].flagged && diffuse > 0){
                        let element = document.getElementById(boardArray[index].index).firstChild
                        let flag = document.createElement("div")
                        flag.setAttribute("id", "flag")
                        flag.innerHTML = `<img src=${selectedIcon(flagStyleArray)}>`
                        element.appendChild(flag)
                        boardArray[index].flagged = true
                        diffuse--
                        diffuser.firstChild.innerHTML = diffuse
                    }
                    else if(boardArray[index].flagged){
                        let element = document.getElementById(boardArray[index].index).firstChild
                        element.removeChild(element.firstChild)
                        boardArray[index].flagged = false
                        diffuse++
                        diffuser.firstChild.innerHTML = diffuse
                    }
                }
            }
        })
        //Highlights Squares while Scrolling
        event.addEventListener("mouseenter", function () {
            if(!boardArray[index].revealed && !playerHasLost && !playerHasWon){
                let element = document.getElementById(boardArray[index].index)
                element.firstChild.style.backgroundColor = "skyblue"
            }
        })
        event.addEventListener("mouseleave", function () {
            if(!boardArray[index].revealed && !playerHasLost && !playerHasWon){
                let element = document.getElementById(boardArray[index].index)
                element.firstChild.style.backgroundColor = "rgb(190, 190, 190)"
            }
        })
    })
}

