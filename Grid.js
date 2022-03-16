const GRID_SIZE = 4
const CELL_SIZE = 20
const CELL_GAP = 2

export default class Grid {
  #cells                                                                         //Private variable

  constructor(gridElement) {
    gridElement.style.setProperty("--grid-size", GRID_SIZE)
    gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`)
    gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`)
    this.#cells = createCellElements(gridElement).map((cellElement, index) => {
      return new Cell(
        cellElement,
        index % GRID_SIZE,                                                  // TO calulate X postion of cell
        Math.floor(index / GRID_SIZE)                                        //For Y position of cell
      )
    })
  }

  get cells() {
    return this.#cells
  }


  get cellsByRow(){
    return this.#cells.reduce((cellGrid,cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [] 
      cellGrid[cell.y][cell.x] = cell
      return cellGrid
    },[]) 
  }



  get cellsByColumn() {                                                     //It will take normal arr and returns new arr which is organised by col
    return this.#cells.reduce((cellGrid, cell) => {                           //Create arr of arrays
      cellGrid[cell.x] = cellGrid[cell.x] || []                            // 
      cellGrid[cell.x][cell.y] = cell                                       //1st element represents row & 2nd represents col
      return cellGrid
    }, [])
  }

  get #emptyCells() {
    return this.#cells.filter(cell => cell.tile == null)                    //Getter for empty cells available
  }

  randomEmptyCell() {
    const randomIndex = Math.floor(Math.random() * this.#emptyCells.length)    //It will give random index of empty cell
    return this.#emptyCells[randomIndex]
  }


}

class Cell {
  #cellElement
  #x
  #y
  #tile
  #mergeTile

  constructor(cellElement, x, y) {
    this.#cellElement = cellElement
    this.#x = x
    this.#y = y
  }

  get x() {
    return this.#x
  }
  get y() {
    return this.#y
  }

  get tile() {
    return this.#tile
  }

  set tile(value) {                                        //The tile has a value to which the tile will move from its current position
    this.#tile = value
    if (value == null) return                              
    this.#tile.x = this.#x                                 //TO do the animation to look like tiles are moving and merging into one
    this.#tile.y = this.#y
  }

  get mergeTile(){
    return this.#mergeTile
  }

  set mergeTile(value){
    this.#mergeTile = value
    if(value == null) return
    this.#mergeTile.x = this.#x
    this.#mergeTile.y = this.#y
  }


  canAccept(tile){
    return (
      this.tile == null  || 
      ( this.mergeTile == null && this.tile.value === tile.value)
    )
  }

  mergeTiles(){
    if(this.tile == null || this.mergeTile == null ) return
    this.tile.value = this.tile.value + this.mergeTile.value
    this.mergeTile.remove()
    this.mergeTile = null    
  }


}

function createCellElements(gridElement) {
  const cells = []
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement("div")
    cell.classList.add("cell")
    cells.push(cell)
    gridElement.append(cell)
  }
  return cells
}