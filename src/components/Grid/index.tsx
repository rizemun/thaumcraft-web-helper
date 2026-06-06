import {FC, PointerEventHandler} from "react";
import {HexCell, HexGrid} from "../../data/hexGrid";
import Cell from "../Cell";
import classnames from 'classnames/bind'
import styles from './styles.scss'

const cn = classnames.bind(styles);

type TGridProps = {
    hexGrid: HexGrid

    onRightClickFactory?: (target: HexCell) => PointerEventHandler<HTMLDivElement>
}

const Grid : FC<TGridProps> = ({hexGrid, onRightClickFactory}) => {
    return <div className={cn('grid')}>
        {Array.from(hexGrid, ([key, cell]) => (
            <Cell r={cell.coord.r} q={cell.coord.q} key={key} cellConfig={cell}  onContextMenu={onRightClickFactory?.(cell)}/>
        ))}
    </div>
}

export default Grid