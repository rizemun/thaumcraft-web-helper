import {FC} from "react";

const CellBase: FC = () => {
    const borderRadius = 10;
    const realRadius = 40;
    const radius = realRadius - borderRadius;
    const halfHeight = radius * Math.sqrt(3) / 2;


    const borderWidth = 2;
    const radiusInner = radius - borderWidth;
    const halfHeightInner = radiusInner * Math.sqrt(3) / 2;

    return (
        <svg width={realRadius * 2} height={realRadius * 2}
             viewBox={`${-realRadius} ${-realRadius} ${realRadius * 2} ${realRadius * 2}`}>
            <symbol id="hex" width={realRadius * 2} height={realRadius * 2}
                    viewBox={`${-realRadius} ${-realRadius} ${realRadius * 2} ${realRadius * 2}`}>
                <path d={
                    `M${-radius} 0 
                L${-radius / 2} ${-halfHeight} 
                L${radius / 2} ${-halfHeight} 
                L${radius} 0 
                L${radius / 2} ${halfHeight} 
                L${-radius / 2} ${halfHeight} 
                L${-radius} 0
                `}
                      fill="white"
                      stroke="currentColor"
                      strokeWidth={borderRadius * 2}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                />
                <path d={
                    `M${-radiusInner} 0 
                L${-radiusInner / 2} ${-halfHeightInner} 
                L${radiusInner / 2} ${-halfHeightInner} 
                L${radiusInner} 0 
                L${radiusInner / 2} ${halfHeightInner} 
                L${-radiusInner / 2} ${halfHeightInner} 
                L${-radiusInner} 0
                `}
                      fill="var(--hex-inner-color)"
                      stroke="var(--hex-inner-color)"
                      strokeWidth={borderRadius * 2}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                />
            </symbol>
        </svg>
    )
}

export default CellBase;