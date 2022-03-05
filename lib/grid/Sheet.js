import React, { useCallback, useEffect, useRef, useState } from "react";
import { useObserver, useObserverListener } from "react-hook-useobserver";
const defaultDom = document.createElement('div');
export default function Sheet(props) {
    const { $customColWidth, $customRowHeight } = props;
    const [$defaultRowHeight,] = useObserver(20);
    const [$defaultColWidth,] = useObserver(70);
    const [$viewPortDimension, setViewPortDimension] = useObserver({ width: 0, height: 0 });
    const [$scrollerPosition, setScrollerPosition] = useObserver({ left: 0, top: 0 });
    const [elements, setElements] = useState(new Array());
    const [$totalWidthOfContent, setTotalWidthOfContent] = useObserver(calculateLength($customColWidth.current, props.columns, $defaultColWidth.current));
    useObserverListener($customColWidth, () => setTotalWidthOfContent(calculateLength($customColWidth.current, props.columns, $defaultColWidth.current)));
    const [$totalHeightOfContent, setTotalHeightOfContent] = useObserver(calculateLength($customRowHeight.current, props.data, $defaultRowHeight.current));
    useObserverListener($customRowHeight, () => setTotalHeightOfContent(calculateLength($customRowHeight.current, props.data, $defaultRowHeight.current)));
    const viewPortRef = useRef(defaultDom);
    useEffect(() => {
        const viewPortDom = viewPortRef.current;
        const { offsetWidth, offsetHeight } = viewPortDom;
        setViewPortDimension({ width: offsetWidth, height: offsetHeight });
    }, []);
    useObserverListener([$viewPortDimension, $scrollerPosition, $defaultRowHeight, $defaultColWidth, $customRowHeight, $customColWidth], () => {
        var _a, _b;
        const scrollerPosition = $scrollerPosition.current;
        const defaultRowHeight = $defaultRowHeight.current;
        const defaultColWidth = $defaultColWidth.current;
        const customRowHeight = $customRowHeight.current;
        const customColWidth = $customColWidth.current;
        const numberOfColBeforeViewPort = calculateBeforeViewPort(props.columns, customColWidth, defaultColWidth, scrollerPosition === null || scrollerPosition === void 0 ? void 0 : scrollerPosition.left);
        const numberOfColInsideViewPort = calculateInsideViewPort(props.columns, numberOfColBeforeViewPort.index, customColWidth, defaultColWidth, (_a = $viewPortDimension === null || $viewPortDimension === void 0 ? void 0 : $viewPortDimension.current) === null || _a === void 0 ? void 0 : _a.width, scrollerPosition === null || scrollerPosition === void 0 ? void 0 : scrollerPosition.left, numberOfColBeforeViewPort.totalLength);
        const numberOfRowBeforeViewPort = calculateBeforeViewPort(props.data, customRowHeight, defaultRowHeight, scrollerPosition === null || scrollerPosition === void 0 ? void 0 : scrollerPosition.top);
        const numberOfRowInsideViewPort = calculateInsideViewPort(props.data, numberOfRowBeforeViewPort.index, customRowHeight, defaultRowHeight, (_b = $viewPortDimension === null || $viewPortDimension === void 0 ? void 0 : $viewPortDimension.current) === null || _b === void 0 ? void 0 : _b.height, scrollerPosition === null || scrollerPosition === void 0 ? void 0 : scrollerPosition.top, numberOfRowBeforeViewPort.totalLength);
        renderComponent({
            numberOfRowInsideViewPort,
            numberOfRowBeforeViewPort,
            numberOfColInsideViewPort,
            numberOfColBeforeViewPort,
            setElements
        });
    });
    const handleScroller = useCallback(function handleScroller() {
        const viewPortDom = viewPortRef.current;
        setScrollerPosition({ left: viewPortDom.scrollLeft, top: viewPortDom.scrollTop });
        if (props.onScroll)
            props.onScroll({
                scrollLeft: viewPortDom.scrollLeft, scrollTop: viewPortDom.scrollTop,
                viewportHeight: viewPortDom.offsetWidth,
                viewportWidth: viewPortDom.offsetHeight
            });
    }, []);
    return React.createElement("div", { ref: viewPortRef, style: Object.assign({ width: '100%', height: '100%', overflow: 'auto', boxSizing: 'border-box' }, props.styleContainer), onScroll: handleScroller },
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
    return React.createElement("div", { style: Object.assign({ position: 'absolute', height: props.height, width: props.width, top: props.top, left: props.left, border: '1px solid #000', boxSizing: 'border-box', overflow: 'hidden' }, props.style) }, `r:${props.rowIndex} c:${props.colIndex}`);
});
function renderComponent({ numberOfRowInsideViewPort, numberOfRowBeforeViewPort, numberOfColInsideViewPort, numberOfColBeforeViewPort, setElements }) {
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
            colAcc.elements.push(React.createElement(CellRenderer, { key: `${rowIndex}-${colIndex}`, rowIndex: rowIndex, colIndex: colIndex, top: acc.top, width: colWidth, left: colAcc.left, height: rowHeight }));
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