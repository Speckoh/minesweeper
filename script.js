const boardContainer = document.querySelector(".gridContainer");
const mineSprite = "http://www.speckoh.com/images/mine.png";

let boardArray = [];
let randomArray = [];
let mineArray = [];
let mines = 10;

let height = 9;
let width = 9;
let area = height * width;

let emptyCheck = false;

let playerHasWon = false;
let playerHasLost = false;

class Square {
    constructor(index) {
        this.index = index;
        this.hasMine = false;
        this.adjacentMines = 0;
        this.revealed = false;
    }
}

RandomizeMines();
console.log(mineArray);
console.log(boardArray);

//Creates Squares for the Board and Adds the Mines
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
            if(boardArray[i].hasMine){
                box.innerHTML = `<div class="hidden">
                <img id="mine" src=${mineSprite}></div>`;
                boardContainer.appendChild(box);
            }
        }
    }
}
CheckForAdjacentMines();

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
//############
//Returns Values
//############
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
//############
//Initial Check For Mines
//############
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
//############
//Check For Empty
//############
function CheckNorthForEmpty(board, index){
    if(CheckNorth(board,index).adjacentMines === 0 && !CheckNorth(board,index).revealed){
        let element = document.getElementById(CheckNorth(board,index).index);
        element.removeChild(element.firstChild);
        CheckNorth(board,index).revealed = true;
        emptyCheck = true;
    }
}
function CheckEastForEmpty(board, index){
    if(CheckEast(board,index).adjacentMines === 0 && !CheckEast(board,index).revealed){
        let element = document.getElementById(CheckEast(board,index).index);
        element.removeChild(element.firstChild);
        CheckEast(board,index).revealed = true;
        emptyCheck = true;
    }
}
function CheckSouthForEmpty(board, index, element){
    if(CheckSouth(board,index).adjacentMines === 0 && !CheckSouth(board,index).revealed){
        let element = document.getElementById(CheckSouth(board,index).index);
        element.removeChild(element.firstChild);
        CheckSouth(board,index).revealed = true;
        emptyCheck = true;
    }
}
function CheckWestForEmpty(board, index){
    if(CheckWest(board,index).adjacentMines === 0 && !CheckWest(board,index).revealed){
        let element = document.getElementById(CheckWest(board,index).index);
        element.removeChild(element.firstChild);
        CheckWest(board,index).revealed = true;
        emptyCheck = true;
    }
}
function CheckNorthWestForEmpty(board, index){
    if(CheckNorthWest(board,index).adjacentMines === 0 && !CheckNorthWest(board,index).revealed){
        let element = document.getElementById(CheckNorthWest(board,index).index);
        element.removeChild(element.firstChild);
        CheckNorthWest(board,index).revealed = true;
        emptyCheck = true;
    }
}
function CheckNorthEastForEmpty(board, index){
    if(CheckNorthEast(board,index).adjacentMines === 0 && !CheckNorthEast(board,index).revealed){
        let element = document.getElementById(CheckNorthEast(board,index).index);
        element.removeChild(element.firstChild);
        CheckNorthEast(board,index).revealed = true;
        emptyCheck = true;
    }
}
function CheckSouthEastForEmpty(board, index){
    if(CheckSouthEast(board,index).adjacentMines === 0 && !CheckSouthEast(board,index).revealed){
        let element = document.getElementById(CheckSouthEast(board,index).index);
        element.removeChild(element.firstChild);
        CheckSouthEast(board,index).revealed = true;
        emptyCheck = true;
    }
}
function CheckSouthWestForEmpty(board, index){
    if(CheckSouthWest(board,index).adjacentMines === 0 && !CheckSouthWest(board,index).revealed){
        let element = document.getElementById(CheckSouthWest(board,index).index);
        element.removeChild(element.firstChild);
        CheckSouthWest(board,index).revealed = true;
        emptyCheck = true;
    }
}

//Click Events
const squares = document.querySelectorAll('.square');
squares.forEach((event, index) => {
    event.addEventListener('click', () => {
        // console.log(boardArray[index]);
        if(!playerHasLost){
            if(boardArray[index].hasMine){
                console.log("You stepped on mine, you Lose!");
                // event.removeChild(event.firstChild);
                playerHasLost = true;
            }
            else if(!boardArray[index].hasMine && !boardArray[index].revealed){
                if(boardArray[index].adjacentMines > 0){
                    let numberOfMines = document.createElement("div")
                    numberOfMines.setAttribute("id", "numberOfMines");
                    numberOfMines.innerHTML = `${boardArray[index].adjacentMines}`;
                    event.appendChild(numberOfMines);
                    boardArray[index].revealed = true;
                    event.removeChild(event.firstChild);
                }
                else if(boardArray[index].adjacentMines === 0){
                    boardArray[index].revealed = true;
                    event.removeChild(event.firstChild);
                    emptyCheck = true;
                    while(emptyCheck){
                        emptyCheck = false;
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
                }
            }
        }
    });
});
