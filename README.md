# Minesweeper

## MVP

### Version 1.0
 - I want a 9 X 9 Board of Squares.
 - I want each Square on the Board to Hide what's Underneath.
 - I want the player to be able to click on a Square and for it to uncover what's underneath it, which can either be a Number, Mine, or Empty Square.
 - When the Player Clicks on an Empty Square, for a flood effect to take place.
 - When the Player Clicks on a Square and if it's not Empty to Display a Number or Mine.
 - I want the Player to be able to mark a square with a Flag via the Right Mouse Click.
 - I want to have a Losing Message when the player clicks on a Mine.
 - I want to have a Winning Message when the player opens up all the Squares that does not have a Mine.
 - After Game Completion, I want all Mines to be Revealed

 ![alt Minesweeper MVP](minesweeper_MVP.jpeg)
 ---
## UPDATES

### Version 2.0
 - I want the player to be able to select between three Difficulty Settings.
 - I want a Timer and for it to output a Score if the player wins the Round.
 - I want a Scoreboard for each Difficulty.
 - The Scoreboard will Switch defending on the Difficuly Settings.
 - If it's a Score, I want that score to display on the ScoreBoard.
 - I want each Different Number to be a Different Color.
 - I want a Button to Reset the Board.
 - I want the Square to turn Red if player clicks on a Mine.

![alt Minesweeper MVP](minesweeper_V2.jpeg)

### Version 3.0
 - I want the player to know the amount of mines the board has.
 - I want to add a feature that allows different Color Themes.
 - I want to add a feature to change the Look of the Mine.
 - I want to add a feature to change the Look of the Flag.
 - I want the player to be able to customize the Size of the Board as well as the amount of Mines.
 - I want a feature that allows the player to mark a square with a Question Mark.
 - I want to add sound effects.
 - I want to add a Simple How to Play Read me Tutorial.
---
## PSEUDOCODE for MVP Version 1.0

### Create the 9x9 Board
 ```
    Specify the Height and Width of the Board to be 9
    Then Specify the Area of the Board by Height * Width
    Then Specify the Amount of Mines in this Board to be 10

    Create a Board with that Height & Width
    Create this Board Array
    Randomly place the Specified Amount of Mines
    Across the Board
    Add these Mines to the Mine's Array
```
### Make each Square Clickable
```
    Add an Event To check for each Square being clicked
```
### Check for Mines and If Player Clicks on a Mine & Create a Losing Message
```
    If the player clicks on a Square that matches the index of one of the Mines in the Mine's Array
    Reveal the Square to be a Mine via a Sprite Change
    Player Loses the Game.
    Display a Losing Message on Screen and all Mines to be Revealed.
```
### Checks if what is Revealed is not a Mine and what Happens
```
    Else, If the player clicks on a Square that does not match the index of one of the Mines in the Mines Array,
    Check all adjacent Squares of the clicked Square.
    Count how many of these adjacent Squares contain a Mine
    If the adjacent Squares is greater than or equal to 1,
    then the Square that was clicked will Reveal the amount of Mines around it. 
    Once a Square is revealed, remove this from the Board Array.
```
### Creates the Flood Effect if Square is Empty
```
    Else, If there are no mines around the clicked Square, 
    then Reveal the Empty clicked Square and check all adjacent Squares around this Empty Square
    for a Mine around those Squares in much the same way from a few steps earlier.
    All revealed Squares will also be removed from the Board Array.
```
### Creates an event for being able to Mark Square with Flags
```
    Add an Right Click Event to allow the player to place a Flag on any unrevealed Square that they suspect to be the location of a Mine.
```
### Checks the Board for if the Winning Condition is Met & Creates a Winning Message if Winning Condition is Met
```
    Check for when All Squares on the Board that is not a Mine is revealed everytime a Square is revealed.
    If the Board Array is empty or all Squares inside this Array is equal to Mine, then the player has Won!
    Display a Winning Message on Screen and all Mines to be Revealed.
```

Testing the Update to Readme