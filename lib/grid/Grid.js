import Vertical from "../layout/Vertical";
import Horizontal from "../layout/Horizontal";
import React, { createContext, useCallback, useContext, useEffect, useRef } from "react";
import Sheet from "./Sheet";
import { ObserverValue, useObserver } from "react-hook-useobserver";
const FIRST_COLUMN_WIDTH = 10;
const HANDLER_WIDTH = 7;
const HeaderCell = (props) => {
    const index = props.colIndex;
    const value = props.value;
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
    return React.createElement(Vertical, { ref: containerRef, style: {
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
const RowCellResizer = (props) => {
    const index = props.rowIndex;
    const containerRef = useRef(defaultDif);
    const handlerBottomRef = useRef(defaultDif);
    const mousePositionRef = useRef({ currentY: 0, nextY: 0, dragActive: false });
    const { onRowResize } = useContext(GridContext);
    const handleDrag = useCallback((event) => {
        event.preventDefault();
        mousePositionRef.current.currentY = event.clientY;
        mousePositionRef.current.dragActive = true;
        let cellHeight = 0;
        function closeDragElement() {
            mousePositionRef.current.dragActive = false;
            document.removeEventListener('mouseup', closeDragElement);
            document.removeEventListener('mousemove', onElementDrag);
            onRowResize(index, cellHeight + (Math.ceil(0.5 * HANDLER_WIDTH)));
        }
        function onElementDrag(event) {
            event.preventDefault();
            if (!mousePositionRef.current.dragActive) {
                return;
            }
            if (event.clientY <= containerRef.current.getBoundingClientRect().y) {
                return;
            }
            mousePositionRef.current.nextY = mousePositionRef.current.currentY - event.clientY;
            mousePositionRef.current.currentY = event.clientY;
            cellHeight = (handlerBottomRef.current.offsetTop - mousePositionRef.current.nextY);
            handlerBottomRef.current.style.top = cellHeight + 'px';
        }
        document.addEventListener('mouseup', closeDragElement);
        document.addEventListener('mousemove', onElementDrag);
    }, []);
    useEffect(() => {
        handlerBottomRef.current.style.top = `${containerRef.current.getBoundingClientRect().height - Math.ceil(0.5 * HANDLER_WIDTH)}px`;
    }, []);
    return React.createElement(Vertical, { ref: containerRef, style: {
            padding: '3px 5px',
            borderRight: '1px solid #CCC',
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            flexShrink: 0,
            flexGrow: 0,
            position: 'relative'
        } },
        React.createElement(Vertical, { ref: handlerBottomRef, style: {
                width: '100%',
                position: 'absolute',
                backgroundColor: 'rgba(0,0,0,0.5)',
                height: HANDLER_WIDTH,
                zIndex: 1,
                left: 0,
                boxSizing: 'border-box',
                cursor: 'col-resize'
            }, onMouseDown: handleDrag }));
};
const defaultDif = document.createElement('div');
function noOp() {
}
const GridContext = createContext({
    onCellResize: noOp,
    onRowResize: noOp
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
        React.createElement(GridContext.Provider, { value: {
                onCellResize: (index, width) => {
                    setCustomColWidth(oldVal => {
                        const newVal = new Map(oldVal);
                        newVal.set(index, width);
                        return newVal;
                    });
                },
                onRowResize: (index, height) => {
                    setCustomRowHeight(oldVal => {
                        const newVal = new Map(oldVal);
                        newVal.set(index, height);
                        return newVal;
                    });
                }
            } },
            React.createElement(Horizontal, null,
                React.createElement(Vertical, { style: { flexBasis: FIRST_COLUMN_WIDTH, flexShrink: 0, flexGrow: 0 } }),
                React.createElement(Vertical, { style: { width: `calc(100% - ${FIRST_COLUMN_WIDTH}px)` } },
                    React.createElement(Sheet, { data: headerData, columns: columns.map((c, index) => (Object.assign(Object.assign({}, c), { cellComponent: HeaderCell }))), "$customColWidth": $customColWidth, "$scrollLeft": $scrollLeft, showScroller: false }))),
            React.createElement(Horizontal, { style: { height: 'calc(100% - 40px)', width: '100%' } },
                React.createElement(Vertical, { style: { flexBasis: FIRST_COLUMN_WIDTH, flexShrink: 0, flexGrow: 0 } },
                    React.createElement(Sheet, { data: data.map((d, index) => ({ _: '' })), columns: [{
                                field: '_',
                                width: FIRST_COLUMN_WIDTH,
                                title: ' ',
                                cellComponent: RowCellResizer
                            }], "$customRowHeight": $customRowHeight, "$scrollTop": $scrollTop, showScroller: false, defaultColWidth: FIRST_COLUMN_WIDTH })),
                React.createElement(Vertical, { style: { height: '100%', width: `calc(100% - ${FIRST_COLUMN_WIDTH}px)` } },
                    React.createElement(ObserverValue, { observers: $customColWidth, render: () => {
                            return React.createElement(Sheet, { data: data, columns: columns, "$customRowHeight": $customRowHeight, "$customColWidth": $customColWidth, onScroll: ({ scrollLeft, scrollTop }) => {
                                    setScrollLeft(scrollLeft);
                                    setScrollTop(scrollTop);
                                } });
                        } })))));
}
//# sourceMappingURL=Grid.js.map