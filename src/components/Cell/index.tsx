import {CSSProperties, FC, HTMLAttributes} from "react";
import classnames from 'classnames/bind'
import styles from './styles.scss'
import {coordKey, ECellState, HexCell} from "../../data/hexGrid";
import {getEnum, TEnumValue} from "../../helpers/enum";

const cn = classnames.bind(styles);

const cellViewVariants = ['default', 'coords'] as const;
const ECellView = getEnum(cellViewVariants);
type TCellView = TEnumValue<typeof ECellView>;


type TCellProps = {
    r: number,
    q: number,
    cellConfig: HexCell;
    view?: TCellView
} & HTMLAttributes<HTMLDivElement>

const Cell: FC<TCellProps> = ({cellConfig, r, q, view = ECellView.default, ...props}) => (
    <div style={{'--r': r, '--q': q} as CSSProperties}
         className={cn('cell', {'cell_coords': view === ECellView.coords, 'cell_blocked': cellConfig.state===ECellState.blocked})}
         data-coord={coordKey(cellConfig.coord.q, cellConfig.coord.r)}
         {...props}
    >
        <svg className={cn('cell__bg')}>
            <use href="#hex"/>
        </svg>
        {view === ECellView.coords && (
            <div className={cn('cell__content')}>
                {coordKey(cellConfig.coord.q, cellConfig.coord.r)}
                {cellConfig.state}
            </div>
        )}
        {view === ECellView.default && (
            <div className={cn('cell__content')}>
                {cellConfig.aspect}
            </div>
        )}
    </div>
)

export default Cell;