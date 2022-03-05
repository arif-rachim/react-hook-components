import Sheet from "./Sheet";
import { ObserverValue, useObserver } from "react-hook-useobserver";
import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import Vertical from "../layout/Vertical";
import Horizontal from "../layout/Horizontal";
import React from "react";
const FIRST_COLUMN_WIDTH = 10;
const HANDLER_WIDTH = 7;
const HeaderCell = (props) => {
    const index = props.colIndex;
    const value = props.value;
    const column = props.column;
    const mousePositionRef = useRef({ currentX: 0, nextX: 0, dragActive: false });
    const handlerRightRef = useRef(defaultDif);
    const containerRef = useRef(defaultDif);
    const { onCellResize } = useContext(GridContext);
    const handleDrag = useCallback((event) => {
        event.preventDefault();
        mousePositionRef.current.currentX = event.clientX;
        mousePositionRef.current.dragActive = true;
        let cellWidth = 0;
        function closeDragElement() {
            mousePositionRef.current.dragActive = false;
            document.removeEventListener('mouseup', closeDragElement);
            document.removeEventListener('mousemove', onElementDrag);
            onCellResize(index, cellWidth + (Math.ceil(0.5 * HANDLER_WIDTH)));
        }
        function onElementDrag(event) {
            event.preventDefault();
            if (!mousePositionRef.current.dragActive) {
                return;
            }
            if (event.clientX <= containerRef.current.getBoundingClientRect().x) {
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
    useEffect(() => {
        handlerRightRef.current.style.left = `${containerRef.current.getBoundingClientRect().width - Math.ceil(0.5 * HANDLER_WIDTH)}px`;
    }, []);
    return React.createElement(Vertical, { ref: containerRef, key: index, style: {
            padding: '3px 5px',
            borderRight: '1px solid #CCC',
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            flexShrink: 0,
            flexGrow: 0,
            position: 'relative'
        } },
        value,
        React.createElement(Vertical, { ref: handlerRightRef, style: {
                height: '100%',
                position: 'absolute',
                backgroundColor: 'rgba(0,0,0,0.5)',
                width: HANDLER_WIDTH,
                zIndex: 1,
                top: 0,
                boxSizing: 'border-box',
                cursor: 'col-resize'
            }, onMouseDown: handleDrag }));
};
const defaultDif = document.createElement('div');
function noOp() {
}
const GridContext = createContext({
    onCellResize: noOp
});
export default function Grid({ data, columns }) {
    const [$customColWidth, setCustomColWidth] = useObserver(new Map(columns.map((col, index) => [index, col.width])));
    const [$customRowHeight, setCustomRowHeight] = useObserver(new Map());
    const [$scrollLeft, setScrollLeft] = useObserver(0);
    const [$scrollTop, setScrollTop] = useObserver(0);
    const headerData = [columns.reduce((acc, column, index) => {
            acc[column.field] = column.title;
            return acc;
        }, {})];
    return React.createElement(Vertical, { style: { padding: '1rem', height: '100%', width: '100%' } },
        React.createElement(Horizontal, null,
            React.createElement(Vertical, { style: { flexBasis: FIRST_COLUMN_WIDTH, flexShrink: 0, flexGrow: 0 } }),
            React.createElement(Vertical, { style: { width: `calc(100% - ${FIRST_COLUMN_WIDTH}px)` } },
                React.createElement(GridContext.Provider, { value: {
                        onCellResize: (index, width) => {
                            setCustomColWidth(oldVal => {
                                const newVal = new Map(oldVal);
                                newVal.set(index, width);
                                return newVal;
                            });
                        }
                    } },
                    React.createElement(Sheet, { data: headerData, columns: columns.map((c, index) => (Object.assign(Object.assign({}, c), { cellComponent: HeaderCell }))), "$customColWidth": $customColWidth, "$customRowHeight": $customRowHeight, "$scrollLeft": $scrollLeft, showScroller: false })))),
        React.createElement(Horizontal, { style: { height: 'calc(100% - 40px)', width: '100%' } },
            React.createElement(Vertical, { style: { flexBasis: FIRST_COLUMN_WIDTH, flexShrink: 0, flexGrow: 0 } }),
            React.createElement(Vertical, { style: { height: '100%', width: `calc(100% - ${FIRST_COLUMN_WIDTH}px)` } },
                React.createElement(ObserverValue, { observers: $customColWidth, render: () => {
                        return React.createElement(Sheet, { data: data, columns: columns, "$customColWidth": $customColWidth, "$customRowHeight": $customRowHeight, onScroll: ({ scrollLeft, scrollTop }) => {
                                setScrollLeft(scrollLeft);
                                setScrollTop(scrollTop);
                            } });
                    } }))));
}
//# sourceMappingURL=Grid.js.map