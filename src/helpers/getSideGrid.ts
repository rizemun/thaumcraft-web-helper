import {TAspect} from "../data/types";
import {createRectangularGrid, ECellState} from "../data/hexGrid";

export const getSideGrid = (aspectList: TAspect[]) => {
    let currentGrid = createRectangularGrid({
        width: 4,
        height: 9,
    })

    aspectList.forEach((aspect, i) => {
        const qModification = i % 4 <= 1 ? 0 : -1;
        const currentCell = currentGrid.get(`${Math.floor(i / 4) + qModification},${i % 4}`)
        if (!currentCell) {
            return;
        }
        currentCell.state = ECellState.occupied;
        currentCell.aspect = aspect;

    })
    return currentGrid;
}