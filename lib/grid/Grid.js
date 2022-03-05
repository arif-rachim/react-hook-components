import Vertical from "../layout/Vertical";
import Horizontal from "../layout/Horizontal";
import Sheet from "./Sheet";
import { ObserverValue, useObserver, useObserverValue } from "react-hook-useobserver";
import React, { useCallback, useRef } from "react";
const HANDLER_WIDTH = 7;
const HeaderCell = ({ index, column, $customColWidth, onCellResize }) => {
    const mousePositionRef = useRef({ currentX: 0, nextX: 0, dragActive: false });
    const handlerRightRef = useRef(defaultDif);
    const containerRef = useRef(defaultDif);
    const customCellWidth = useObserverValue($customColWidth, () => $customColWidth.current.get(index));
    const handleDrag = useCallback((event) => {
        event.preventDefault();
        mousePositionRef.current.currentX = event.clientX;
        mousePositionRef.current.dragActive = true;
        let cellWidth = 0;
        function closeDragElement() {
            mousePositionRef.current.dragActive = false;
            document.removeEventListener('mouseup', closeDragElement);
            document.removeEventListener('mousemove', onElementDrag);
            onCellResize(cellWidth + (Math.ceil(0.5 * HANDLER_WIDTH)));
        }
        function onElementDrag(event) {
            event.preventDefault();
            if (!mousePositionRef.current.dragActive) {
                return;
            }
            if (event.clientX <= containerRef.current.offsetLeft) {
                return;
            }
            mousePositionRef.current.nextX = mousePositionRef.current.currentX - event.clientX;
            mousePositionRef.current.currentX = event.clientX;
            cellWidth = (handlerRightRef.current.offsetLeft - mousePositionRef.current.nextX);
            handlerRightRef.current.style.left = cellWidth + 'px';
        }
        document.addEventListener('mouseup', closeDragElement);
        document.addEventListener('mousemove', onElementDrag);
    }, []);
    return React.createElement(Vertical, { ref: containerRef, key: index, style: {
            padding: 10,
            borderRight: '1px solid #CCC',
            width: customCellWidth,
            boxSizing: 'border-box',
            flexShrink: 0,
            flexGrow: 0,
            position: 'relative'
        } },
        column.field,
        React.createElement(Vertical, { ref: handlerRightRef, style: {
                height: '100%',
                position: 'absolute',
                backgroundColor: 'rgba(0,0,0,0.1)',
                width: HANDLER_WIDTH,
                left: column.width - Math.ceil(0.5 * HANDLER_WIDTH),
                zIndex: 1,
                top: 0,
                boxSizing: 'border-box',
                cursor: 'col-resize'
            }, onMouseDown: handleDrag }));
};
const defaultDif = document.createElement('div');
export default function Grid({ data, columns }) {
    const headerContainerRef = useRef(defaultDif);
    const [$customColWidth, setCustomColWidth] = useObserver(new Map(columns.map((col, index) => [index, col.width])));
    const [$customRowHeight, setCustomRowHeight] = useObserver(new Map());
    return React.createElement(Vertical, { style: { padding: '1rem', height: '100%', width: '100%' } },
        React.createElement(Vertical, { ref: headerContainerRef, style: { overflow: 'hidden' } },
            React.createElement(Horizontal, null, columns.map((column, index) => {
                return React.createElement(HeaderCell, { column: column, index: index, key: index, "$customColWidth": $customColWidth, onCellResize: (width) => {
                        setCustomColWidth(oldVal => {
                            const newVal = new Map(oldVal);
                            newVal.set(index, width);
                            return newVal;
                        });
                    } });
            }))),
        React.createElement(ObserverValue, { observers: $customColWidth, render: () => {
                return React.createElement(Sheet, { data: data, columns: columns, "$customColWidth": $customColWidth, "$customRowHeight": $customRowHeight, onScroll: ({ scrollLeft }) => headerContainerRef.current.scrollLeft = scrollLeft });
            } }));
}
//# sourceMappingURL=Grid.js.map