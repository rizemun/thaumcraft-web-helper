import Cell, {ECellHoverType} from "../Cell";
import {FC, RefObject, useEffect, useMemo, useRef} from "react";
import {EAspect, TAspect} from "../../data/types";
import {ECellState} from "../../data/hexGrid";
import styles from './styles.scss';
import classnames from 'classnames/bind';

const cn = classnames.bind(styles);

type TShadowCellProps = {
    aspect: TAspect,
    pointerRef: RefObject<{
        x: number,
        y: number
    }>
}

const ShadowCell: FC<TShadowCellProps> = ({aspect, pointerRef}) => {
    const shadowCellRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        let timeout : ReturnType<typeof window.setTimeout>
        const loop = () => {
            shadowCellRef.current?.style.setProperty('--x', String(pointerRef.current?.x));
            shadowCellRef.current?.style.setProperty('--y', String(pointerRef.current?.y));

            timeout = setTimeout(loop, 20);
        }

        loop();

        return () => {
            clearTimeout(timeout);
        }
    }, [])

    const config = useMemo(() => ({
        coord: {
            r: 0,
            q: 0
        },
        state: ECellState.occupied,
        aspect,
        connections: []
    }), [aspect])


    return (
        <div className={cn('shadow-cell', {'shadow-cell_hidden': aspect === EAspect.none})} ref={shadowCellRef}>
            <Cell cellConfig={config} hoverType={ECellHoverType.magical} className="_shadow-cell"/>
        </div>
    )
}

export default ShadowCell;