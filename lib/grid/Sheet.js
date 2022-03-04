import React, { useEffect, useRef, useState } from "react";
import { useObserver, useObserverListener } from "react-hook-useobserver";
const defaultDom = document.createElement('div');
export default function Sheet(props) {
    props.columnsLength = props.columnsLength || {};
    props.rowsLength = props.rowsLength || {};
    const [$defaultRowHeight,] = useObserver(20);
    const [$defaultColWidth,] = useObserver(70);
    const [$customRowHeight,] = useObserver(props.rowsLength);
    const [$customColWidth,] = useObserver(props.columnsLength);
    const [$viewPortDimension, setViewPortDimension] = useObserver({ width: 0, height: 0 });
    const [$scrollerPosition, setScrollerPosition] = useObserver({ left: 0, top: 0 });
    const [elements, setElements] = useState([]);
    const [$totalWidthOfContent, setTotalWidthOfContent] = useObserver(calculateLength($customColWidth.current, props.columns, $defaultColWidth.current));
    useObserverListener($customColWidth, () => setTotalWidthOfContent(calculateLength($customColWidth.current, props.columns, $defaultColWidth.current)));
    const [$totalHeightOfContent, setTotalHeightOfContent] = useObserver(calculateLength($customRowHeight.current, props.data, $defaultRowHeight.current));
    useObserverListener($customRowHeight, () => setTotalHeightOfContent(calculateLength($customRowHeight.current, props.data, $defaultRowHeight.current)));
    const viewPortRef = useRef(defaultDom);
    useEffect(() => {
        const viewPortDom = viewPortRef.current;
        const { offsetWidth, offsetHeight } = viewPortDom;
        setViewPortDimension({ width: offsetWidth, height: offsetHeight });
        const onScroller = () => setScrollerPosition({ left: viewPortDom.scrollLeft, top: viewPortDom.scrollTop });
        viewPortDom.addEventListener('scroll', onScroller);
        return function deregister() {
            viewPortDom.removeEventListener('scroll', onScroller);
        };
    }, []);
    useObserverListener([$viewPortDimension, $scrollerPosition, $defaultRowHeight, $defaultColWidth, $customRowHeight, $customColWidth], () => {
        const scrollerPosition = $scrollerPosition.current;
        const defaultRowHeight = $defaultRowHeight.current;
        const defaultColWidth = $defaultColWidth.current;
        const customRowHeight = $customRowHeight.current;
        const customColWidth = $customColWidth.current;
        const numberOfColBeforeViewPort = calculateBeforeViewPort(props.columns, customColWidth, defaultColWidth, scrollerPosition.left);
        const numberOfColInsideViewPort = calculateInsideViewPort(props.columns, numberOfColBeforeViewPort.index, customColWidth, defaultColWidth, $viewPortDimension.current.width, scrollerPosition.left, numberOfColBeforeViewPort.totalLength);
        const numberOfRowBeforeViewPort = calculateBeforeViewPort(props.data, customRowHeight, defaultRowHeight, scrollerPosition.top);
        const numberOfRowInsideViewPort = calculateInsideViewPort(props.data, numberOfRowBeforeViewPort.index, customRowHeight, defaultRowHeight, $viewPortDimension.current.height, scrollerPosition.top, numberOfRowBeforeViewPort.totalLength);
        renderComponent({
            numberOfRowInsideViewPort,
            numberOfRowBeforeViewPort,
            numberOfColInsideViewPort,
            numberOfColBeforeViewPort,
            setElements
        });
    });
    return React.createElement("div", { ref: viewPortRef, style: Object.assign({ width: '100%', height: '100%', overflow: 'auto', boxSizing: 'border-box' }, props.styleContainer) },
        React.createElement("div", { style: Object.assign({ width: $totalWidthOfContent.current, height: $totalHeightOfContent.current, boxSizing: 'border-box', backgroundColor: '#dddddd', position: 'relative' }, props.styleViewPort) }, elements));
}
function calculateBeforeViewPort(columns, customLength, defaultLength, scrollerPosition) {
    return columns.reduce((acc, _, index) => {
        if (acc.complete) {
            return acc;
        }
        const length = customLength[index] ? customLength[index] : defaultLength;
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
function calculateInsideViewPort(data, indexBeforeViewPort, customLength, defaultLength, viewPortLength, lengthBeforeViewPort, lengthLastIndexBeforeViewPort) {
    return data.slice(indexBeforeViewPort).reduce((acc, _, zeroIndex) => {
        if (acc.complete) {
            return acc;
        }
        const index = indexBeforeViewPort + zeroIndex;
        const length = customLength[index] ? customLength[index] : defaultLength;
        const nextLength = length + acc.totalLength;
        if ((nextLength + lengthLastIndexBeforeViewPort) > (viewPortLength + lengthBeforeViewPort)) {
            acc.lengths[index] = length;
            acc.index = index;
            acc.totalLength = nextLength;
            acc.complete = true;
            return acc;
        }
        acc.lengths[index] = length;
        acc.index = index;
        acc.totalLength = nextLength;
        return acc;
    }, { index: 0, totalLength: 0, complete: false, lengths: {} });
}
function calculateLength(customLength, data, defaultLength) {
    const totalCustomLength = Object.keys(customLength).reduce((acc, key) => acc + customLength[key], 0);
    const totalDefaultLength = (data.length - Object.keys(customLength).length) * defaultLength;
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
    const { elements } = Array.from({ length: Object.keys(heightsOfRowInsideViewPort).length }).reduce((acc, _, rowIndexInsideViewPort) => {
        const rowIndex = lastRowIndexBeforeViewPort + rowIndexInsideViewPort;
        const rowHeight = heightsOfRowInsideViewPort[rowIndex];
        const { elements } = Array.from({ length: Object.keys(widthsOfColInsideViewPort).length }).reduce((colAcc, _, colIndexInsideViewPort) => {
            const colIndex = lastColIndexBeforeViewPort + colIndexInsideViewPort;
            const colWidth = widthsOfColInsideViewPort[colIndex];
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