import React, {ChangeEventHandler, MouseEventHandler, useMemo, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import aspects from './data/connections';
import {createRectangularGrid, validateGrid} from "./data/hexGrid";
import Grid from './components/Grid';
import CellBase from "./components/CellBase";

function App() {
  const [width, setWidth] = useState(3);
  const [height, setHeight] = useState(2);

  const handleWidthChange: ChangeEventHandler<HTMLInputElement> = ({target}) => {
    setWidth(target.valueAsNumber)
  }
  const handleHeightChange: ChangeEventHandler<HTMLInputElement> = ({target}) => {
    setHeight(target.valueAsNumber)
  }


  const grid = useMemo(() => createRectangularGrid({
    width,
    height,
    blockedCells: [{q:2, r:2}],
    initialAspects: [{coord: {q:0, r:0}, aspect: 'ignis'}],
  }), [width, height]);



  console.log('aspects', aspects);
  return (
    <div>
      <fieldset style={{position: 'absolute', left: "10px", top: '10px'}}>
        <legend>test</legend>
        <input type="range" min={3} max={15} value={width} onChange={handleWidthChange}/>
        <span>{width}</span>
        <legend>test</legend>
        <input type="range" min={2} max={15} value={height} onChange={handleHeightChange}/>
        <span>{height}</span>
      </fieldset>
      <Grid hexGrid={grid}/>
      <CellBase/>
    </div>
  );
}

export default App;
