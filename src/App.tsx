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
import {EAspect, TAspect} from "./data/types";
import {includes} from "./helpers/enum";


const cn = classnames.bind(styles);

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
                blockedCells: [{q: 1, r: 1}, {q: -1, r: 2}],
                initialAspects: [{coord: {q: 0, r: 0}, aspect: EAspect.ignis}],
            }
        ))
    }, [radius])

    const getSideGrid = (aspectList: TAspect[]) => {
        let currentGrid = createRectangularGrid({
            width: 4,
            height: 9,
        })

        aspectList.forEach((aspect, i) => {
            const qModification = i % 4 <= 1 ? 0 : -1;
            const currentCell = currentGrid.get(`${Math.floor(i / 4) + qModification},${i % 4}`)
            if (!currentCell) {
                return;
            }
            currentCell.state = ECellState.occupied;
            currentCell.aspect = aspect;

        })
        return currentGrid;
    }


    const leftPanelGrid = useMemo(() => {
        const list = [
            EAspect.ordo, EAspect.terra, EAspect.aqua, EAspect.permutatio,
            EAspect.vitreus, EAspect.victus, EAspect.metallum, EAspect.sano,
            EAspect.tempus, EAspect.iter, EAspect.mortuus, EAspect.herba,
            EAspect.limus, EAspect.bestia, EAspect.caelum, EAspect.spiritus,
            EAspect.magneto, EAspect.aequalitas, EAspect.corpus, EAspect.humanus,
            EAspect.instrumentum, EAspect.perfodio, EAspect.luxuria, EAspect.tutamen,
            EAspect.machina, EAspect.gloria, EAspect.gelum, EAspect.motus,
            EAspect.venenum, EAspect.vacuos, EAspect.messis, EAspect.lucrum,
            EAspect.electrum, EAspect.tabernus, EAspect.pannus, EAspect.fabrico,
            EAspect.meto, EAspect.nebrisum,
        ]
        return getSideGrid(list);
    }, []);

    const rightPanelGrid = useMemo(() => {
        const list = [
            EAspect.perditio, EAspect.ignis, EAspect.aer, EAspect.potentia,
            EAspect.gelum, EAspect.motus, EAspect.venenum, EAspect.vacuos,
            EAspect.lux, EAspect.tempestas, EAspect.vinculum, EAspect.volatus,
            EAspect.praecantatio, EAspect.primordium, EAspect.radio, EAspect.fames,
            EAspect.arbor, EAspect.tenebrae, EAspect.vitium, EAspect.infernus,
            EAspect.exanimis, EAspect.auram, EAspect.superbia, EAspect.cognitio,
            EAspect.gula, EAspect.sensus, EAspect.astrum, EAspect.alienis,
            EAspect.strontio, EAspect.desidia, EAspect.invidia, EAspect.vesania,
            EAspect.telum, EAspect.ira, EAspect.terminus,
        ]
        return getSideGrid(list);
    }, []);

    const handleGridBlockedToggleFactory: (target: HexCell) => PointerEventHandler<HTMLDivElement> = (target) => (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        let newState: TCellState = ECellState.occupied;
        if (includes([ECellState.blocked, ECellState.empty], target.state)) {
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
