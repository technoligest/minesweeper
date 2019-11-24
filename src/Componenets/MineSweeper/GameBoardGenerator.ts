export class GameBoardGenerator {
  public generateBoard(rows: number, cols: number, numMines: number): number[][]{
    const mineLocations = this.generateMineLocations(rows, cols, numMines);
    const grid = this.generateEmptyGrid(rows, cols);
    // tslint:disable-next-line
    for(const prop in mineLocations){
      const v = mineLocations[prop];
      v.forEach(loc => {
        grid[prop][loc] = -1;
        for(let i=-1; i<2; ++i) {
          for(let j=-1; j<2; ++j) {
            const x = +prop + i;
            const y = j+loc;
            if (x<0 || y<0 || x>=rows || y>=cols || this.contains(mineLocations, x, y)) {
              continue;
            }
            grid[x][y]++;
          }
        }
      });
    }
    return grid;
  }

  private generateMineLocations(rows: number, cols: number, numberOfMines: number) {
    const map: {[key: number]: number[]} = {};
    if (numberOfMines > rows*cols) {
      throw Error("You're an idiot.");
    }
    for (let i = 0; i<numberOfMines; ++i) {
      let x: number;
      let y: number;
      do {
        x = Math.floor(Math.random() * rows);
        y = Math.floor(Math.random() * cols);
      } while(this.contains(map, x, y));
      if (map[x]) {
        map[x].push(y);
      } else {
        map[x] = [y];
      }
    }

    return map;
  }

  private contains(map: {[key: number]: number[]}, x: number, y: number) {
    if (!map[x]) {
      return false;
    } 
    return map[x].find(v => v === y) !== undefined;
  }

  private generateEmptyGrid(rows: number, cols: number):number[][] {
    const grid:number [][] = [];
    for(let i=0; i<rows; ++i) {
      grid[i]=[];
      for(let j=0; j<cols; ++j) {
        grid[i].push(0);
      }
    }
    return grid;
  }
}
