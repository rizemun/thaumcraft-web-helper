import React, {ChangeEventHandler, PointerEventHandler, useEffect, useMemo, useRef, useState} from 'react';
import styles from './App.scss';
import {
    createCircularGrid,
    ECellState,
    HexCell, HexGrid,
    setCellState, TCellState,
} from "./data/hexGrid";
import Grid from './components/Grid';
import CellBase from "./components/CellBase";
import classnames from "classnames/bind";
import {EAspect, TAspect} from "./data/types";
import {getSideGrid} from "./helpers/getSideGrid";
import ShadowCell from "./components/ShadowCell";
import {ECellHoverType} from "./components/Cell";


const cn = classnames.bind(styles);

function App() {
    const [radius, setRadius] = useState(2);
    const pointerRef = useRef<{ x: number, y: number }>({x: 0, y: 0})
    const [shadowCellAspect, setShadowCellAspect] = useState<TAspect>(EAspect.none);
    const isDragging = shadowCellAspect !== EAspect.none;

    // central grid staff
    const handleRadiusChange: ChangeEventHandler<HTMLInputElement> = ({target}) => {
        setRadius(target.valueAsNumber)
    }
    const [grid, setGrid] = useState<HexGrid>(createCircularGrid(
        radius
    ))

    useEffect(() => {
        setGrid(createCircularGrid(radius))
    }, [radius])

    const handleGridBlockedToggleFactory: (target: HexCell) => PointerEventHandler<HTMLDivElement> = (target) => (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        let newState: TCellState = ECellState.empty;
        if (target.state === ECellState.empty) {
            newState = ECellState.blocked
        }

        setGrid(setCellState(grid, target.coord, newState, EAspect.none));
    }

    const handlePointerOnGridUpFactory: (target: HexCell) => PointerEventHandler<HTMLDivElement> = (target) => (ev) => {
        // context menu click on another handler
        if (ev.button === 2) {
            return;
        }

        // cant interact with blocked cells
        if (target.state === 'blocked') {
            return;
        }

        // if click without aspect
        if (shadowCellAspect === EAspect.none) {
            return;
        }

        setGrid(setCellState(grid, target.coord, ECellState.occupied, shadowCellAspect));
    }

    // \central grid staff


    // side grid staff
    const leftPanelGrid = useMemo(() => {
        const list = [
            EAspect.ordo, EAspect.terra, EAspect.aqua, EAspect.permutatio,
            EAspect.vitreus, EAspect.victus, EAspect.metallum, EAspect.sano,
            EAspect.tempus, EAspect.iter, EAspect.mortuus, EAspect.herba,
            EAspect.limus, EAspect.bestia, EAspect.caelum, EAspect.spiritus,
            EAspect.magneto, EAspect.aequalitas, EAspect.corpus, EAspect.humanus,
            EAspect.instrumentum, EAspect.perfodio, EAspect.luxuria, EAspect.tutamen,
            EAspect.machina, EAspect.gloria, EAspect.messis, EAspect.lucrum,
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

    const handleAspectDragFactory: (target: HexCell) => PointerEventHandler<HTMLDivElement> = (target) => () => {
        setShadowCellAspect(target.aspect ?? EAspect.none);
    }
    // \side grid staff


    // drag&drop staff

    const handlePointerMove: PointerEventHandler<HTMLDivElement> = (ev) => {
        pointerRef.current = {
            x: ev.clientX,
            y: ev.clientY
        }
    }

    const handlePointerUp: PointerEventHandler<HTMLDivElement> = () => {
        setShadowCellAspect(EAspect.none)
    }

    const handlePointerLeave: PointerEventHandler<HTMLDivElement> = () => {
        setShadowCellAspect(EAspect.none)
    }

    // \drag&drop staff


    return (
        <div className={cn("app")} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}
             onPointerLeave={handlePointerLeave}>
            <fieldset style={{position: 'absolute', left: "10px", top: '10px'}}>
                <legend>radius</legend>
                <input type="range" min={2} max={4} value={radius} onChange={handleRadiusChange}/>
                <span>{radius}</span>
            </fieldset>

            <div className={cn("app__field")}>

                <div className={cn("app__panel")}>
                    <Grid hexGrid={leftPanelGrid} onPointerDownFactory={handleAspectDragFactory}/>
                </div>
                <div className={cn("app__main-grid")}>
                    <Grid hexGrid={grid}
                          onPointerUpFactory={handlePointerOnGridUpFactory}
                          onRightClickFactory={handleGridBlockedToggleFactory}
                          cellHoverType={isDragging ? ECellHoverType.magical : ECellHoverType.default}
                    />
                </div>
                <div className={cn("app__panel")}>
                    <Grid hexGrid={rightPanelGrid} onPointerDownFactory={handleAspectDragFactory}/>
                </div>
            </div>
            <ShadowCell aspect={shadowCellAspect} pointerRef={pointerRef}/>
            <CellBase/>
        </div>
    );
}

export default App;
