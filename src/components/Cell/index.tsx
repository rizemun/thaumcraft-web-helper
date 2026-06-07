import {CSSProperties, FC, HTMLAttributes} from "react";
import classnames from 'classnames/bind'
import styles from './styles.scss'
import {coordKey, ECellState, HexCell} from "../../data/hexGrid";
import {getEnum, TEnumValue} from "../../helpers/enum";

const cn = classnames.bind(styles);

const cellViewVariants = ['default', 'coords'] as const;
export const ECellView = getEnum(cellViewVariants);
export type TCellView = typeof cellViewVariants[number];

const hoverTypeVariants = ['default', 'magical'] as const;
export const ECellHoverType = getEnum(hoverTypeVariants);
export type TCellHoverType = typeof hoverTypeVariants[number];


type TCellProps = {
    r?: number;
    q?: number;
    cellConfig: HexCell;
    view?: TCellView;
    hoverType?: TCellHoverType;
} & HTMLAttributes<HTMLDivElement>

const Cell: FC<TCellProps> = ({cellConfig, r = 0, q = 0, view = ECellHoverType.default, hoverType = ECellHoverType.default, ...props}) => (
    <div style={{'--r': r, '--q': q} as CSSProperties}
         {...props}
         className={cn('cell', {
             'cell_coords': view === ECellView.coords,
             'cell_blocked': cellConfig.state === ECellState.blocked,
             'cell_hover-magical': hoverType === ECellHoverType.magical,
         },
             props.className)}
         data-coord={coordKey(cellConfig.coord.q, cellConfig.coord.r)}
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