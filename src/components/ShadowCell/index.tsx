import Cell, {ECellHoverType} from "../Cell";
import {FC, RefObject, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
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
    const prevAspectRef = useRef<TAspect>(aspect)

    const [isHidden, setIsHidden] = useState(aspect === EAspect.none);

    const handleAspectChange = useCallback((newAspect: TAspect) => {
        if (newAspect === EAspect.none) {
            // @ts-ignore
            if (document.startViewTransition) {
                console.log('transition api is available')
                // @ts-ignore
                shadowCellRef.current.style.viewTransitionName = 'shadow-card';
                // @ts-ignore
                const transition = document.startViewTransition(() => {
                    setIsHidden(true)
                });

                transition.finished.then(() => {
                    // @ts-ignore
                    shadowCellRef.current.style.viewTransitionName = 'none';
                });

            } else {
                // Fallback если API не поддерживается
                setIsHidden(true)
                console.log('no transition api')
            }
        } else {
            // Показываем (возвращаем)
            setIsHidden(false)
        }

        prevAspectRef.current = newAspect;
    }, []);

    useLayoutEffect(() => {
        if (prevAspectRef.current !== aspect) {
            handleAspectChange(aspect);
        }
    }, [aspect, handleAspectChange]);

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
        aspect: prevAspectRef.current,
        connections: []
    }), [prevAspectRef.current])


    return (
        <div className={cn('shadow-cell', {'shadow-cell_hidden': isHidden})} ref={shadowCellRef}>
            <Cell cellConfig={config} hoverType={ECellHoverType.magical} className="_shadow-cell"/>
        </div>
    )
}

export default ShadowCell;