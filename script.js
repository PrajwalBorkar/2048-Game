import Grid from "./Grid.js";
import Tile from "./Tile.js";

const gameBoard = document.getElementById("game-board");

const grid = new Grid(gameBoard);
// console.log(grid.randomEmptyCell())
grid.randomEmptyCell().tile = new Tile(gameBoard)          //Everytime game starts two random cells will be appear of value 2 or 4
grid.randomEmptyCell().tile = new Tile(gameBoard)
setupInput()
//console.log(grid.cellsByColumn);

function setupInput() {
    window.addEventListener("keydown", handleInput, { once: true })
}

async function handleInput(e) {
    // console.log(e.key);
    switch (e.key) {

        case "ArrowUp":
            if (!canMoveUp()) {
                setupInput()
                return
            }
            await moveUp()                                               //waiting for all promises to finish before merging of tiles
            break

        case "ArrowDown":
            if (!canMoveDown()) {
                setupInput()
                return
            }
            await moveDown()
            break

        case "ArrowLeft":
            if (!canMoveLeft()) {
                setupInput()
                return
            }

            await moveLeft()
            break

        case "ArrowRight":
            if (!canMoveRight()) {
                setupInput()
                return
            }

            await moveRight()
            break

        default:
            setupInput()
            return
    }

    grid.cells.forEach(cell => cell.mergeTiles())

    const newTile = new Tile(gameBoard)
    grid.randomEmptyCell().tile = newTile

    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        newTile.waitForTransition(true).then(() => {
            alert("You Lost!")
        })
        return
    }
    setupInput()
}

function moveUp() {
    return slideTiles(grid.cellsByColumn)
}

function moveDown() {
    return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
}

function moveLeft() {
    return slideTiles(grid.cellsByRow)
}

function moveRight() {
    return slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
}

function slideTiles(cells) {
    return Promise.all(                                           //This will return array of promises 
        cells.flatMap(group => {
            const promises = []
            for (let i = 1; i < group.length; i++) {
                const cell = group[i]
                if (cell.tile == null) continue                          //To move all the tiles 
                let lastValidCell
                for (let j = i - 1; j >= 0; j--) {
                    const moveToCell = group[j]
                    if (!moveToCell.canAccept(cell.tile)) break
                    lastValidCell = moveToCell
                }
                if (lastValidCell != null) {                              //if the last cell is not empty then check the tile value0  
                    promises.push(cell.tile.waitForTransition())           //Saving the animations in promises 
                    if (lastValidCell.tile != null) {                     //and merge the tiles if it has values
                        lastValidCell.mergeTile = cell.tile             //if null then set the tile value        
                    } else {
                        lastValidCell.tile = cell.tile
                    }
                    cell.tile = null                                    //make the previous tile empty     
                }
            }
            return promises
        }))
}

function canMoveUp() {
    return canMove(grid.cellsByColumn)
}
function canMoveDown() {
    return canMove(grid.cellsByColumn.map(column => [...column].reverse()))
}
function canMoveLeft() {
    return canMove(grid.cellsByRow)
}
function canMoveRight() {
    return canMove(grid.cellsByRow.map(row => [...row].reverse()))
}

function canMove(cells) {
    return cells.some(group => {
        return group.some((cell, index) => {
            if (index === 0) return false                                    //Top cell cant move upwards
            if (cell.tile == null) return false                             //Null cant be moved
            const moveToCell = group[index - 1]
            return moveToCell.canAccept(cell.tile)                          //Check the cell directly above it  and if accept is true then return true
        })
    })


}