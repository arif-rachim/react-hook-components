import React, { useCallback, useEffect, useRef, useState } from "react";
import { useObserver, useObserverListener } from "react-hook-useobserver";
export const CellComponentString = ({ value }) => React.createElement("div", { style: { padding: '0 5px' } }, value);
const BORDER = '1px solid rgba(0,0,0,0.1)';
const DEFAULT_HEIGHT = 25;
const DEFAULT_WIDTH = 70;
const defaultDom = document.createElement('div');
export default function Sheet(props) {
    var _a, _b;
    const { $customColWidth, $customRowHeight } = props;
    const [$defaultRowHeight,] = useObserver(props.defaultRowHeight || DEFAULT_HEIGHT);
    const [$defaultColWidth,] = useObserver(props.defaultColWidth || DEFAULT_WIDTH);
    const [$viewPortDimension, setViewPortDimension] = useObserver({ width: 0, height: 0 });
    const [$scrollerPosition, setScrollerPosition] = useObserver({
        left: ((_a = props.$scrollLeft) === null || _a === void 0 ? void 0 : _a.current) || 0,
        top: ((_b = props.$scrollTop) === null || _b === void 0 ? void 0 : _b.current) || 0
    });
    const [elements, setElements] = useState(new Array());
    const [$emptyObserver] = useObserver(0);
    const [$emptyMapObserver] = useObserver(new Map());
    useObserverListener([props.$scrollTop || $emptyObserver, props.$scrollLeft || $emptyObserver], () => {
        var _a, _b;
        const left = ((_a = props.$scrollLeft) === null || _a === void 0 ? void 0 : _a.current) || 0;
        const top = ((_b = props.$scrollTop) === null || _b === void 0 ? void 0 : _b.current) || 0;
        viewPortRef.current.scrollLeft = left;
        viewPortRef.current.scrollTop = top;
        setScrollerPosition({ left, top });
    });
    const [$totalWidthOfContent, setTotalWidthOfContent] = useObserver(calculateLength($customColWidth === null || $customColWidth === void 0 ? void 0 : $customColWidth.current, props.columns, $defaultColWidth.current));
    useObserverListener($customColWidth || $emptyMapObserver, () => setTotalWidthOfContent(calculateLength($customColWidth === null || $customColWidth === void 0 ? void 0 : $customColWidth.current, props.columns, $defaultColWidth.current)));
    const [$totalHeightOfContent, setTotalHeightOfContent] = useObserver(calculateLength($customRowHeight === null || $customRowHeight === void 0 ? void 0 : $customRowHeight.current, props.data, $defaultRowHeight.current));
    useObserverListener($customRowHeight || $emptyMapObserver, () => setTotalHeightOfContent(calculateLength($customRowHeight === null || $customRowHeight === void 0 ? void 0 : $customRowHeight.current, props.data, $defaultRowHeight.current)));
    const viewPortRef = useRef(defaultDom);
    useEffect(() => {
        const viewPortDom = viewPortRef.current;
        const { offsetWidth, offsetHeight } = viewPortDom;
        setViewPortDimension({ width: offsetWidth, height: offsetHeight });
    }, []);
    useObserverListener([$viewPortDimension, $scrollerPosition, $defaultRowHeight, $defaultColWidth, $customRowHeight || $emptyMapObserver, $customColWidth || $emptyMapObserver], () => {
        var _a, _b;
        const scrollerPosition = $scrollerPosition.current;
        const defaultRowHeight = $defaultRowHeight.current;
        const defaultColWidth = $defaultColWidth.current;
        const customRowHeight = $customRowHeight === null || $customRowHeight === void 0 ? void 0 : $customRowHeight.current;
        const customColWidth = $customColWidth === null || $customColWidth === void 0 ? void 0 : $customColWidth.current;
        const numberOfColBeforeViewPort = calculateBeforeViewPort(props.columns, customColWidth, defaultColWidth, scrollerPosition === null || scrollerPosition === void 0 ? void 0 : scrollerPosition.left);
        const numberOfColInsideViewPort = calculateInsideViewPort(props.columns, numberOfColBeforeViewPort.index, customColWidth, defaultColWidth, (_a = $viewPortDimension === null || $viewPortDimension === void 0 ? void 0 : $viewPortDimension.current) === null || _a === void 0 ? void 0 : _a.width, scrollerPosition === null || scrollerPosition === void 0 ? void 0 : scrollerPosition.left, numberOfColBeforeViewPort.totalLength);
        const numberOfRowBeforeViewPort = calculateBeforeViewPort(props.data, customRowHeight, defaultRowHeight, scrollerPosition === null || scrollerPosition === void 0 ? void 0 : scrollerPosition.top);
        const numberOfRowInsideViewPort = calculateInsideViewPort(props.data, numberOfRowBeforeViewPort.index, customRowHeight, defaultRowHeight, (_b = $viewPortDimension === null || $viewPortDimension === void 0 ? void 0 : $viewPortDimension.current) === null || _b === void 0 ? void 0 : _b.height, scrollerPosition === null || scrollerPosition === void 0 ? void 0 : scrollerPosition.top, numberOfRowBeforeViewPort.totalLength);
        renderComponent({
            numberOfRowInsideViewPort,
            numberOfRowBeforeViewPort,
            numberOfColInsideViewPort,
            numberOfColBeforeViewPort,
            setElements,
            data: props.data,
            columns: props.columns,
        });
    });
    const handleScroller = useCallback(function handleScroller() {
        const viewPortDom = viewPortRef.current;
        setScrollerPosition({ left: viewPortDom.scrollLeft, top: viewPortDom.scrollTop });
        if (props.onScroll)
            props.onScroll({
                scrollLeft: viewPortDom.scrollLeft,
                scrollTop: viewPortDom.scrollTop,
                viewportHeight: viewPortDom.offsetWidth,
                viewportWidth: viewPortDom.offsetHeight
            });
    }, []);
    return React.createElement("div", { ref: viewPortRef, style: Object.assign({ width: '100%', height: '100%', overflow: props.showScroller === false ? 'hidden' : 'auto', boxSizing: 'border-box' }, props.styleContainer), onScroll: handleScroller },
        React.createElement("div", { style: Object.assign({ width: $totalWidthOfContent.current, height: $totalHeightOfContent.current, boxSizing: 'border-box', backgroundColor: '#dddddd', position: 'relative' }, props.styleViewPort) }, elements));
}
function calculateBeforeViewPort(columns, customLength = new Map(), defaultLength = 50, scrollerPosition = 0) {
    return columns.reduce((acc, _, index) => {
        if (acc.complete) {
            return acc;
        }
        const length = customLength.has(index) ? customLength.get(index) : defaultLength;
        const nextLength = length + acc.totalLength;
        if (nextLength > scrollerPosition) {
            acc.complete = true;
            return acc;
        }
        acc.index = index + 1;
        acc.totalLength = nextLength;
        return acc;
    }, { index: 0, totalLength: 0, complete: false });
}
function calculateInsideViewPort(data, indexBeforeViewPort, customLength = new Map(), defaultLength = 50, viewPortLength = 50, lengthBeforeViewPort = 0, lengthLastIndexBeforeViewPort) {
    return data.slice(indexBeforeViewPort).reduce((acc, _, zeroIndex) => {
        if (acc.complete) {
            return acc;
        }
        const index = indexBeforeViewPort + zeroIndex;
        const length = customLength.has(index) ? customLength.get(index) || defaultLength : defaultLength;
        const nextLength = length + acc.totalLength;
        if ((nextLength + lengthLastIndexBeforeViewPort) > (viewPortLength + lengthBeforeViewPort)) {
            acc.lengths.set(index, length);
            acc.index = index;
            acc.totalLength = nextLength;
            acc.complete = true;
            return acc;
        }
        acc.lengths.set(index, length);
        acc.index = index;
        acc.totalLength = nextLength;
        return acc;
    }, { index: 0, totalLength: 0, complete: false, lengths: new Map() });
}
function calculateLength(customLength = new Map(), data, defaultLength = 0) {
    const customLengthKeys = Array.from(customLength.keys());
    const totalCustomLength = customLengthKeys.reduce((acc, key) => acc + (customLength.has(key) ? customLength.get(key) || 0 : 0), 0);
    const totalDefaultLength = (data.length - customLengthKeys.length) * defaultLength;
    return totalDefaultLength + totalCustomLength;
}
const CellRenderer = React.memo(function CellRenderer(props) {
    const CellComponent = props.column.cellComponent;
    return React.createElement("div", { style: Object.assign({ position: 'absolute', height: props.height, width: props.width, top: props.top, left: props.left, borderBottom: BORDER, borderRight: BORDER, boxSizing: 'border-box', overflow: 'visible', display: 'flex', flexDirection: 'column' }, props.style) },
        React.createElement(CellComponent, { value: props.value, column: props.column, dataItem: props.dataItem, dataSource: props.dataSource, rowIndex: props.rowIndex, colIndex: props.colIndex }));
});
function renderComponent({ numberOfRowInsideViewPort, numberOfRowBeforeViewPort, numberOfColInsideViewPort, numberOfColBeforeViewPort, setElements, data, columns }) {
    const { lengths: heightsOfRowInsideViewPort } = numberOfRowInsideViewPort;
    const { index: lastRowIndexBeforeViewPort, totalLength: totalHeightBeforeViewPort } = numberOfRowBeforeViewPort;
    const { lengths: widthsOfColInsideViewPort } = numberOfColInsideViewPort;
    const { index: lastColIndexBeforeViewPort, totalLength: totalWidthBeforeViewPort } = numberOfColBeforeViewPort;
    const { elements } = Array.from({ length: heightsOfRowInsideViewPort.size }).reduce((acc, _, rowIndexInsideViewPort) => {
        const rowIndex = lastRowIndexBeforeViewPort + rowIndexInsideViewPort;
        const rowHeight = heightsOfRowInsideViewPort.get(rowIndex) || 0;
        const { elements } = Array.from({ length: widthsOfColInsideViewPort.size }).reduce((colAcc, _, colIndexInsideViewPort) => {
            const colIndex = lastColIndexBeforeViewPort + colIndexInsideViewPort;
            const colWidth = widthsOfColInsideViewPort.get(colIndex) || 0;
            const column = columns[colIndex];
            const dataItem = data[rowIndex];
            const value = dataItem[column.field];
            colAcc.elements.push(React.createElement(CellRenderer, { key: `${rowIndex}-${colIndex}`, rowIndex: rowIndex, colIndex: colIndex, top: acc.top, width: colWidth, dataSource: data, dataItem: dataItem, value: value, column: column, left: colAcc.left, height: rowHeight }));
            colAcc.left = colAcc.left + colWidth;
            return colAcc;
        }, { elements: [], left: totalWidthBeforeViewPort });
        acc.top = acc.top + rowHeight;
        acc.elements = [...acc.elements, ...elements];
        return acc;
    }, { elements: [], top: totalHeightBeforeViewPort });
    setElements(elements);
}
//# sourceMappingURL=Sheet.js.map