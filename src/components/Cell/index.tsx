import {CSSProperties, FC} from "react";
import classnames from 'classnames/bind'
import styles from './styles.scss'

const cn = classnames.bind(styles);

type TCellProps = {
    r: number,
    q: number,
    value: string
}

const Cell: FC<TCellProps> = ({value, r, q}) => {


    return <div style={{
        '--r': r,
        '--q': q
    } as CSSProperties} className={cn('cell')}>
        <div className={cn('cell__inner')}>
            {value}
        </div>
    </div>
}

export default Cell;