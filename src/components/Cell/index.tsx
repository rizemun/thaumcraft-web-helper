import {CSSProperties, FC} from "react";
import classnames from 'classnames/bind'
import styles from './styles.scss'
import {coordKey, HexCell} from "../../data/hexGrid";

const cn = classnames.bind(styles);

type TCellProps = {
    r: number,
    q: number,
    cellConfig: HexCell;
}

const Cell: FC<TCellProps> = ({cellConfig, r, q}) => {




    return <div style={{
        '--r': r,
        '--q': q
    } as CSSProperties} className={cn('cell')} data-coord={coordKey(cellConfig.coord.q, cellConfig.coord.r)}>
        <svg className={cn('cell__bg')}>
            <use href="#hex"/>
        </svg>
        <div className={cn('cell__content')}>
            {coordKey(cellConfig.coord.q, cellConfig.coord.r)}
        </div>
    </div>
}

export default Cell;