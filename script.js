const boardContainer = document.querySelector(".gridContainer");
const mineSprite = "http://www.speckoh.com/images/mine.png";

let boardArray = [];
let randomArray = [];
let mineArray = [];
let mines = 10;

let height = 9;
let width = 9;
let area = height * width;

class Square {
    constructor(index) {
        this.index = index;
        this.hasMine = false;
        this.adjacentMines = 0;
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
    boardContainer.appendChild(box);
    for (let j = 0; j < mineArray.length; j++){
        if(boardArray[i].index === mineArray[j].index){
            boardArray[i].hasMine = true;
            if(boardArray[i].hasMine){
                box.innerHTML = `<img id="mine" src=${mineSprite}>`;
            }
        }
    }
}

function CheckForAdjacentMines(){

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

//Click Events
const squares = document.querySelectorAll('.square');
squares.forEach((event, index) => {
    event.addEventListener('click', () => {
        console.log(boardArray[index]);
        if(boardArray[index].hasMine){
            console.log("you stepped on mine you lose");
        }
        else if(!boardArray[index].hasMine){
            //Check North
            if(boardArray[index - width].hasMine){
                boardArray[index].adjacentMines++;
            }
            //Check South
            if(boardArray[index + width].hasMine){
                boardArray[index].adjacentMines++;
            }
            //Check West
            if(boardArray[index - 1].hasMine){
                boardArray[index].adjacentMines++;
            }
            //Check East
            if(boardArray[index + 1].hasMine){
                boardArray[index].adjacentMines++;
            }
            //Check NorthWest
            if(boardArray[(index - width) - 1].hasMine){
                boardArray[index].adjacentMines++;
            }
            //Check NorthEast
            if(boardArray[(index - width) + 1].hasMine){
                boardArray[index].adjacentMines++;
            }
            //Check SouthWest
            if(boardArray[(index + width) - 1].hasMine){
                boardArray[index].adjacentMines++;
            }
            //Check SouthEast
            if(boardArray[(index + width) + 1].hasMine){
                boardArray[index].adjacentMines++;
            }
            let mines = document.createElement("div")
            mines.innerHTML = `${boardArray[index].adjacentMines}`;
            boardArray[index].firstChild.appendChild(mines);
        }
  });
});
