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
        if(!shadowCellRef.current) {
            return;
        }

        if (newAspect === EAspect.none) {
            if (document.startViewTransition) {
                console.log('transition api is available')
                shadowCellRef.current.style.viewTransitionName = 'shadow-card';
                const transition = document.startViewTransition(() => {
                    setIsHidden(true)
                });

                transition.finished.then(() => {
                    if(!shadowCellRef.current) {
                        return;
                    }

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
    }, [pointerRef])

    const config = useMemo(() => ({
        coord: {
            r: 0,
            q: 0
        },
        state: ECellState.occupied,
        aspect: prevAspectRef.current,
        connections: []
    }), [])


    return (
        <div className={cn('shadow-cell', {'shadow-cell_hidden': isHidden})} ref={shadowCellRef}>
            <Cell cellConfig={config} hoverType={ECellHoverType.magical} className="_shadow-cell"/>
        </div>
    )
}

export default ShadowCell;