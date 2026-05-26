import React from 'react';
import logo from './logo.svg';
import './App.css';
import aspects from './data/connections';
import {createRectangularGrid, validateGrid} from "./data/hexGrid";
import Grid from './components/Grid';

function App() {



  const grid = createRectangularGrid({
    width: 5,
    height: 5,
    blockedCells: [{q:2, r:2}],
    initialAspects: [{coord: {q:0, r:0}, aspect: 'ignis'}],
  });
  console.log('%cgrid:', 'font-style:italic; color:firebrick', grid);
  console.log('gridValidation',validateGrid(grid));



  console.log('aspects', aspects);
  return (
    <div>
      <Grid hexGrid={grid}/>
    </div>
  );
}

export default App;
