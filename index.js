// Game of Life Rules
// Each cell in the grid has a state of either dead or alive at a given moment in time/lifecycle. As time progresses, its current state must obide by a certain set of rules.

// Rules:
//
// On each lifecycle turn:
// 1. Alive cells cannot have more than 4 or less then 3 neighbouring cells. If it does the cell dies.
// 2. Dead cells that have alive cells surrounding them become alive (i.e its value is 1).
//
// Cell:
// [1] alive
// [0] dead


// @TODO:
// 1. Find a way to store rows and column data for the grid
// 2. Think of a way to store the current state of each alive cell
// 3. Implement game logic
//    3.1. We need a function to count how many cells are neighbouring a given cell.
//    3.2. Alive cells cannot have more than 4 or less then 3 neighbouring cells. If it does it dies (i.e its value is 0). 
//    3.3. Dead cells with 3 alive cells surrounding them become alive (i.e its value is 1).



// Globals
GRID_CELL_SIZE = 80;
COLOUR_ALIVE = `green`;
COLOUR_DEAD = `black`;

class GOL {

    constructor() {
        // Columns and Rows
        const CANVAS_WIDTH = typeof window !== 'undefined' ? canvas.width : 800;
        const CANVAS_HEIGHT = typeof window !== 'undefined' ? canvas.width : 800;
        this.TOTAL_COLS = Math.floor(CANVAS_WIDTH / GRID_CELL_SIZE); // 10
        this.TOTAL_ROWS = Math.floor(CANVAS_HEIGHT / GRID_CELL_SIZE); // 10

        // 1. 
        // Store dead/alive state inside arrays
        this.alive_cells_array = []; // [0,0,0,0,0,0,0,0,0,0]
        this.dead_cells_array = []; // [0,0,0,0,0,0,0,0,0,0]


        // Determine the state (dead/alive) of a given cell (row/col)
        this.determineCellAliveState = (row, col) => {
            // put inside a try/catch since -1 values will be undefined and error - the catch will return 0 since these 
            // are cells outside the grid/array and can be discarded.
            try {
                return this.alive_cells_array[row][col];
            }
            catch {
                return 0;
            }
        };

        // Get number of surrounding cells to given cell (row,col).
        this.countNeighbouringCells = (row, col) => {
            let total_neighbours = 0;

            // if a cell has 8 surrounding cells then we need to check the state of each one
            // we can do this by passing in an offset row/col for each surrounding cell.

            // for example, to determine the alive state of cell in the top left we offset by [-1, -1] (row/col), the next 
            // would be [-1, 0], [-1, 1] for the first row.

            // a surrounding cell referencing:
            // [-1, 0, 1]
            // [-1, 0, 1]
            // [ 1, 0, 1]

            // First row
            total_neighbours += this.determineCellAliveState(row - 1, col - 1);
            total_neighbours += this.determineCellAliveState(row - 1, col);
            total_neighbours += this.determineCellAliveState(row - 1, col + 1);

            // Second row (no need to count center/active cell)
            total_neighbours += this.determineCellAliveState(row, col - 1);
            total_neighbours += this.determineCellAliveState(row, col + 1);

            // Third row
            total_neighbours += this.determineCellAliveState(row + 1, col - 1);
            total_neighbours += this.determineCellAliveState(row + 1, col);
            total_neighbours += this.determineCellAliveState(row + 1, col + 1);

            return total_neighbours;
        };

        // @TODO: 2 & 3. 
        // Implement cell state update logic
        this.updateCellState = (row, col) => {
               
            // 2.
            // Get the current state of alive cells.
            const current_cell_alive_state = this.alive_cells_array[row][col];

            // 3.1.
            // Determine the total number of neighbouring cells there are.
            const total_neighbouring_cells = this.countNeighbouringCells(row, col);

            // 3.2. Alive cells cannot have more than 4 or less then 3 neighbouring cells. If it does it dies.
            //
            if (total_neighbouring_cells > 4 || total_neighbouring_cells < 3) {
                return 0;
            }
            // 3.3  Dead cells with 3 alive cells surrounding them become alive (i.e its value is 1).
            //
            else if (current_cell_alive_state === 0 && total_neighbouring_cells === 3) {
                return 1;
            }
            // return current alive state for remaining.
            else {
                return current_cell_alive_state;
            }
        };


        ///////////////////////
        // Game setup from here 
        ///////////////////////
        this.fillAliveArrayWithColour = () => {
            for (let i = 0; i < this.TOTAL_ROWS; i++) {
                for (let j = 0; j < this.TOTAL_COLS; j++) {
                    let colour;
                    if (this.alive_cells_array[i][j] == 1) {
                        colour = COLOUR_ALIVE;
                    } else {
                        colour = COLOUR_DEAD;
                    }
                    if (typeof window !== 'undefined') {
                        ctx.fillStyle = colour;
                        ctx.fillRect(j * GRID_CELL_SIZE, i * GRID_CELL_SIZE, GRID_CELL_SIZE, GRID_CELL_SIZE);
                    }
                }
            }
        };

        this.gameInitialise = () => {
            // Populate arrays with zeroes to begin
            for (let i = 0; i < this.TOTAL_ROWS; i++) {
                this.alive_cells_array[i] = [];
                this.dead_cells_array[i] = [];
                for (let j = 0; j < this.TOTAL_COLS; j++) {
                    this.alive_cells_array[i][j] = 0;
                    this.dead_cells_array[i][j] = 0;
                }
            }

            // Randomly assign some alive cells to start
            for (let i = 0; i < this.TOTAL_ROWS; i++) {
                for (let j = 0; j < this.TOTAL_COLS; j++) {
                    this.alive_cells_array[i][j] = (Math.random() > 0.5) ? 1 : 0;
                }
            }
            this.fillAliveArrayWithColour();
        };

        this.run = () => {
            // Iterate through every cell (in rows and cols) and update our array state
            for (let i = 0; i < this.TOTAL_ROWS; i++) {
                for (let j = 0; j < this.TOTAL_COLS; j++) {
                    // Update out alive and dead cells arrays with next lifecycle turn:
                    this.alive_cells_array[i][j] = this.updateCellState(i, j);
                    this.dead_cells_array[i][j] = this.updateCellState(i, j);
                }
            }

            this.fillAliveArrayWithColour();
        };
    }
}

module.exports = GOL;