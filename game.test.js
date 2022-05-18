const GOL = require('./index');

const game = new GOL();
game.gameInitialise();
game.run();

test('can store active and dead cell state', () => {
  // Check if 2d array
  expect(game.alive_cells_array[0].constructor === Array).toBe(true);

  // Check neighbouring cell count
  //expect(game.countNeighbouringCells()).toBe();
});