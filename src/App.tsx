import React, {ChangeEventHandler, FC, PointerEventHandler, useEffect, useMemo, useState} from 'react';
import styles from './App.scss';
import aspects from './data/connections';
import {
  coordKey,
  createCircularGrid,
  createRectangularGrid,
  ECellState,
  HexCell, HexGrid,
  setCellState, TCellState,
  validateGrid
} from "./data/hexGrid";
import Grid from './components/Grid';
import CellBase from "./components/CellBase";
import classnames from "classnames/bind";
import {ASPECT} from "./data/types";
import {includes} from "./helpers/enum";


const cn= classnames.bind(styles);
function App() {
  const [radius, setRadius] = useState(2);

  const handleRadiusChange: ChangeEventHandler<HTMLInputElement> = ({target}) => {
    setRadius(target.valueAsNumber)
  }
  const [grid, setGrid] = useState<HexGrid>(createCircularGrid(
      radius
  ))

  useEffect(() => {
    setGrid(createCircularGrid(
        radius,

        {
          blockedCells: [{q:1, r:1}, {q:-1, r:2}],
          initialAspects: [{coord: {q:0, r:0}, aspect: ASPECT.ignis}],
        }
    ))
  }, [radius])

  const leftPanelGrid = useMemo(() => createRectangularGrid({
    width: 4,
    height: 9,
  }), []);

  const rightPanelGrid = useMemo(() => createRectangularGrid({
    width: 4,
    height: 9,
  }), []);

  const handleGridBlockedToggleFactory: (target: HexCell) => PointerEventHandler<HTMLDivElement> = (target) => (ev) => {
    ev.preventDefault();
    ev.stopPropagation();

    let newState: TCellState = ECellState.occupied;
    if(includes([ECellState.blocked, ECellState.empty], target.state)) {
      newState = target.state === ECellState.blocked ? ECellState.empty : ECellState.blocked;
    }
    console.log(`Update state of ${coordKey(target.coord.q, target.coord.r)}, new state: ${newState}.`)
    setGrid(setCellState(grid, target.coord, newState, target.aspect));
  }

  console.log('aspects', aspects);
  return (
    <div className={cn("app")}>
      <fieldset style={{position: 'absolute', left: "10px", top: '10px'}}>
        <legend>radius</legend>
        <input type="range" min={2} max={4} value={radius} onChange={handleRadiusChange}/>
        <span>{radius}</span>
      </fieldset>

      <div className={cn("app__field")}>

        <div className={cn("app__panel")}>
          <Grid hexGrid={leftPanelGrid}/>
        </div>
        <div className={cn("app__main-grid")}>
          <Grid hexGrid={grid} onRightClickFactory={handleGridBlockedToggleFactory}/>
        </div>
        <div className={cn("app__panel")}>
          <Grid hexGrid={rightPanelGrid}/>
        </div>
      </div>

      <CellBase/>
    </div>
  );
}

export default App;
