import {FC} from "react";
import {HexGrid} from "../../data/hexGrid";
import Cell from "../Cell";
import classnames from 'classnames/bind'
import styles from './styles.scss'

const cn = classnames.bind(styles);

type TGridProps = {
    hexGrid?: HexGrid
}

const Grid : FC<TGridProps> = ({hexGrid}) => {
    console.log('%chexGrid:', 'font-style:italic; color:firebrick', hexGrid);

    return <div className={cn('grid')}>
        <Cell r={1} q={0} value='1:0'/>
    </div>
}

export default Grid