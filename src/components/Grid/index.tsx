import {FC, PointerEventHandler} from "react";
import {HexCell, HexGrid} from "../../data/hexGrid";
import Cell, {ECellHoverType, ECellView, TCellHoverType} from "../Cell";
import classnames from 'classnames/bind'
import styles from './styles.scss'

const cn = classnames.bind(styles);

type TGridProps = {
    hexGrid: HexGrid;
    cellHoverType?: TCellHoverType;
    onPointerUpFactory?: (target: HexCell) => PointerEventHandler<HTMLDivElement>;
    onPointerDownFactory?: (target: HexCell) => PointerEventHandler<HTMLDivElement>;
    onRightClickFactory?: (target: HexCell) => PointerEventHandler<HTMLDivElement>;
}

const Grid: FC<TGridProps> = ({hexGrid, onPointerUpFactory, onPointerDownFactory, onRightClickFactory, cellHoverType = ECellHoverType.default }) => {
    return <div className={cn('grid')}>
        {Array.from(hexGrid, ([key, cell]) => (
            <Cell
                key={key}
                r={cell.coord.r}
                q={cell.coord.q}
                cellConfig={cell}
                view={ECellView.default}
                hoverType={cellHoverType}
                onPointerUp={onPointerUpFactory?.(cell)}
                onPointerDown={onPointerDownFactory?.(cell)}
                onContextMenu={onRightClickFactory?.(cell)}

            />
        ))}
    </div>
}

export default Grid