"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataItemToValueDefaultImplementation = exports.Sheet = void 0;
const react_1 = require("react");
const react_hook_useobserver_1 = require("react-hook-useobserver");
const Vertical_1 = require("../layout/Vertical");
const BORDER = '1px solid rgba(0,0,0,0.1)';
function cellSpanFunctionDefaultImplementation() {
    return { colSpan: 1, rowSpan: 1 };
}
const defaultDom = document.createElement('div');
const CellComponentDefaultImplementation = (props) => {
    return react_1.default.createElement(Vertical_1.Vertical, { style: props.cellStyle, vAlign: 'center' }, props.value);
};
function cellStyleFunctionDefaultImplementation(props) {
    const isFocused = props.isFocused;
    return {
        padding: '0 5px',
        backgroundColor: isFocused ? '#99D9EA' : (props.rowIndex % 2) ? '#f6f6f6' : '#ffffff',
        height: '100%',
        overflow: 'hidden',
        textAlign: props.column.hAlign
    };
}
const SheetContext = (0, react_1.createContext)({ current: { props: undefined } });
const defaultLengthCallback = props => props.length;
exports.Sheet = react_1.default.forwardRef(function Sheet(props, ref) {
    const propsRef = (0, react_1.useRef)(props);
    propsRef.current = props;
    const { sheetHeightFollowsTotalRowsHeight } = props;
    const sheetContextRef = (0, react_1.useRef)({ props });
    sheetContextRef.current = { props };
    const [$reRender, setReRender] = (0, react_hook_useobserver_1.useObserver)(new Date());
    const { $customColWidth, $customRowHeight } = props;
    const [$defaultRowHeight,] = (0, react_hook_useobserver_1.useObserver)(props.defaultRowHeight);
    const [$defaultColWidth,] = (0, react_hook_useobserver_1.useObserver)(props.defaultColWidth);
    const [$viewPortDimension, setViewPortDimension] = (0, react_hook_useobserver_1.useObserver)({ width: 0, height: 0 });
    const [$scrollerPosition, setScrollerPosition] = (0, react_hook_useobserver_1.useObserver)({ left: 0, top: 0 });
    const [$emptyMapObserver] = (0, react_hook_useobserver_1.useObserver)(new Map());
    const [elements, setElements] = (0, react_1.useState)(new Array());
    const forceUpdate = (0, react_1.useCallback)(() => setReRender(new Date()), [setReRender]);
    (0, react_1.useEffect)(forceUpdate, [props.data, props.columns, forceUpdate]);
    (0, react_1.useImperativeHandle)(ref, () => {
        function updateScrollerPosition(scrollerPosition) {
            viewPortRef.current.scrollLeft = scrollerPosition.left;
            viewPortRef.current.scrollTop = scrollerPosition.top;
            setScrollerPosition(scrollerPosition);
        }
        return {
            setScrollerPosition: updateScrollerPosition
        };
    }, [setScrollerPosition]);
    const [$totalWidthOfContent, setTotalWidthOfContent] = (0, react_hook_useobserver_1.useObserver)(calculateLength($customColWidth === null || $customColWidth === void 0 ? void 0 : $customColWidth.current, propsRef.current.columns, $defaultColWidth.current, propsRef.current.colWidthCallback));
    (0, react_hook_useobserver_1.useObserverListener)($customColWidth || $emptyMapObserver, () => setTotalWidthOfContent(calculateLength($customColWidth === null || $customColWidth === void 0 ? void 0 : $customColWidth.current, propsRef.current.columns, $defaultColWidth.current, propsRef.current.colWidthCallback)));
    const [$totalHeightOfContent, setTotalHeightOfContent] = (0, react_hook_useobserver_1.useObserver)(calculateLength($customRowHeight === null || $customRowHeight === void 0 ? void 0 : $customRowHeight.current, propsRef.current.data, $defaultRowHeight.current, propsRef.current.rowHeightCallback));
    (0, react_hook_useobserver_1.useObserverListener)($customRowHeight || $emptyMapObserver, () => setTotalHeightOfContent(calculateLength($customRowHeight === null || $customRowHeight === void 0 ? void 0 : $customRowHeight.current, propsRef.current.data, $defaultRowHeight.current, propsRef.current.rowHeightCallback)));
    (0, react_1.useEffect)(() => setTotalHeightOfContent(calculateLength($customRowHeight === null || $customRowHeight === void 0 ? void 0 : $customRowHeight.current, props.data, $defaultRowHeight.current, propsRef.current.rowHeightCallback)), [props.data, $customRowHeight, $defaultRowHeight, setTotalHeightOfContent]);
    const viewPortRef = (0, react_1.useRef)(defaultDom);
    (0, react_1.useEffect)(() => {
        const viewPortDom = viewPortRef.current;
        let { offsetWidth, offsetHeight } = viewPortDom;
        setViewPortDimension({ width: offsetWidth, height: offsetHeight });
    }, [props.styleContainer, setViewPortDimension]);
    const totalRowsHeight = (0, react_1.useMemo)(() => {
        const customRowHeight = (($customRowHeight === null || $customRowHeight === void 0 ? void 0 : $customRowHeight.current) || new Map());
        const defaultRowHeight = $defaultRowHeight.current;
        if (sheetHeightFollowsTotalRowsHeight) {
            return props.data.reduce((total, data, index) => {
                let length = (customRowHeight.has(index) ? customRowHeight.get(index) || defaultRowHeight : defaultRowHeight);
                const rowHeightCallback = propsRef.current.rowHeightCallback || defaultLengthCallback;
                length = rowHeightCallback({
                    data: props.data,
                    index,
                    length,
                    customLength: customRowHeight,
                    defaultLength: defaultRowHeight
                });
                return total + length;
            }, 0);
        }
        return $viewPortDimension.current.height;
    }, [$customRowHeight, $defaultRowHeight, $viewPortDimension, props.data, sheetHeightFollowsTotalRowsHeight]);
    (0, react_hook_useobserver_1.useObserverListener)([$reRender, $viewPortDimension, $scrollerPosition, $defaultRowHeight, $defaultColWidth, $customRowHeight || $emptyMapObserver, $customColWidth || $emptyMapObserver], () => {
        const scrollerPosition = $scrollerPosition.current;
        renderComponent({
            setElements,
            data: propsRef.current.data,
            columns: propsRef.current.columns,
            hideLeftColumnIndex: propsRef.current.hideLeftColumnIndex,
            customColWidth: (($customColWidth === null || $customColWidth === void 0 ? void 0 : $customColWidth.current) || new Map()),
            customRowHeight: (($customRowHeight === null || $customRowHeight === void 0 ? void 0 : $customRowHeight.current) || new Map()),
            defaultColWidth: $defaultColWidth.current,
            defaultRowHeight: $defaultRowHeight.current,
            scrollerLeft: scrollerPosition.left,
            scrollerTop: scrollerPosition.top,
            viewPortHeight: sheetHeightFollowsTotalRowsHeight ? totalRowsHeight : $viewPortDimension.current.height,
            viewPortWidth: $viewPortDimension.current.width,
            colWidthCallback: propsRef.current.colWidthCallback,
            rowHeightCallback: propsRef.current.rowHeightCallback
        });
    });
    const handleScroller = (0, react_1.useCallback)(function handleScroller() {
        const viewPortDom = viewPortRef.current;
        if (propsRef.current.onScroll)
            propsRef.current.onScroll({
                scrollLeft: viewPortDom.scrollLeft,
                scrollTop: viewPortDom.scrollTop
            });
        setScrollerPosition({ left: viewPortDom.scrollLeft, top: viewPortDom.scrollTop });
    }, [setScrollerPosition]);
    return react_1.default.createElement(SheetContext.Provider, { value: sheetContextRef },
        react_1.default.createElement("div", { ref: viewPortRef, style: {
                width: '100%',
                height: '100%',
                overflow: propsRef.current.showScroller === false ? 'hidden' : 'auto',
                boxSizing: 'border-box',
                backgroundColor: '#fefefe',
            }, onScroll: handleScroller },
            react_1.default.createElement("div", { style: Object.assign({ width: $totalWidthOfContent.current, height: $totalHeightOfContent.current, boxSizing: 'border-box', position: 'relative' }, propsRef.current.styleViewPort) }, elements)));
});
function calculateBeforeViewPort(columns, customLength = new Map(), defaultLength = 50, scrollerPosition = 0, calcLengthCallback = defaultLengthCallback) {
    return columns.reduce((acc, _, index) => {
        if (acc.complete) {
            return acc;
        }
        let length = customLength.has(index) ? (customLength.get(index) || 0) : defaultLength;
        length = calcLengthCallback({ length, customLength, index, defaultLength, data: columns });
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
function calculateInsideViewPort(data, indexBeforeViewPort, customLength = new Map(), defaultLength = 50, viewPortLength = 50, lengthBeforeViewPort = 0, lengthLastIndexBeforeViewPort, calcLengthCallback = defaultLengthCallback) {
    return data.slice(indexBeforeViewPort).reduce((acc, _, zeroIndex) => {
        if (acc.complete) {
            return acc;
        }
        const index = indexBeforeViewPort + zeroIndex;
        let length = customLength.has(index) ? customLength.get(index) || defaultLength : defaultLength;
        length = calcLengthCallback({ length, customLength, index, defaultLength, data });
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
function calculateLength(customLength = new Map(), data, defaultLength = 0, calcLengthCallback = defaultLengthCallback) {
    const customLengthKeys = Array.from(customLength.keys());
    const totalCustomLength = customLengthKeys.reduce((acc, key) => {
        const length = (customLength.has(key) ? customLength.get(key) || 0 : 0);
        return acc + calcLengthCallback({ length, defaultLength, index: key, data, customLength });
    }, 0);
    const totalDefaultLength = Array.from({ length: (data.length - customLengthKeys.length) }).reduce((acc, _, index) => {
        return acc + calcLengthCallback({ length: defaultLength, defaultLength, customLength, index, data });
    }, 0);
    return totalDefaultLength + totalCustomLength;
}
const CellRenderer = react_1.default.memo(function CellRenderer(props) {
    var _a, _b, _c;
    const sheetContext = (0, react_1.useContext)(SheetContext);
    const cellStyleFunction = props.column.cellStyleFunction || cellStyleFunctionDefaultImplementation;
    const [$emptyObserver] = (0, react_hook_useobserver_1.useObserver)(undefined);
    const [isFocused, setIsFocused] = (0, react_1.useState)(() => {
        var _a, _b;
        return props.dataItem === ((_b = (_a = sheetContext.current.props) === null || _a === void 0 ? void 0 : _a.$focusedDataItem) === null || _b === void 0 ? void 0 : _b.current);
    });
    (0, react_1.useEffect)(() => { var _a, _b; return setIsFocused(props.dataItem === ((_b = (_a = sheetContext.current.props) === null || _a === void 0 ? void 0 : _a.$focusedDataItem) === null || _b === void 0 ? void 0 : _b.current)); }, [props.dataItem, sheetContext]);
    (0, react_hook_useobserver_1.useObserverListener)(((_a = sheetContext.current.props) === null || _a === void 0 ? void 0 : _a.$focusedDataItem) || $emptyObserver, () => {
        var _a, _b;
        const focusedItem = (_b = (_a = sheetContext.current.props) === null || _a === void 0 ? void 0 : _a.$focusedDataItem) === null || _b === void 0 ? void 0 : _b.current;
        const isFocused = focusedItem === props.dataItem;
        setIsFocused(isFocused);
    });
    const focusedItem = (_c = (_b = sheetContext.current.props) === null || _b === void 0 ? void 0 : _b.$focusedDataItem) === null || _c === void 0 ? void 0 : _c.current;
    const cellStyle = cellStyleFunction(Object.assign({ isFocused, focusedItem }, props));
    const CellComponent = props.column.cellComponent || CellComponentDefaultImplementation;
    return react_1.default.createElement("div", { style: Object.assign({ position: 'absolute', height: props.height, width: props.width, top: props.top, left: props.left, borderBottom: BORDER, borderRight: BORDER, boxSizing: 'border-box', overflow: 'visible', display: 'flex', flexDirection: 'column' }, props.style), onClick: (event) => {
            var _a, _b;
            if ((_b = (_a = sheetContext.current) === null || _a === void 0 ? void 0 : _a.props) === null || _b === void 0 ? void 0 : _b.onCellClicked) {
                sheetContext.current.props.onCellClicked({
                    event,
                    dataItem: props.dataItem,
                    rowIndex: props.rowIndex,
                    columnIndex: props.colIndex,
                    column: props.column,
                    value: props.value,
                    dataSource: props.dataSource
                });
            }
        }, onClickCapture: (event) => {
            var _a, _b;
            if ((_b = (_a = sheetContext.current) === null || _a === void 0 ? void 0 : _a.props) === null || _b === void 0 ? void 0 : _b.onCellClickedCapture) {
                sheetContext.current.props.onCellClickedCapture({
                    event,
                    dataItem: props.dataItem,
                    rowIndex: props.rowIndex,
                    columnIndex: props.colIndex,
                    column: props.column,
                    value: props.value,
                    dataSource: props.dataSource
                });
            }
        }, onDoubleClick: (event) => {
            var _a, _b, _c, _d;
            if ((_b = (_a = sheetContext.current) === null || _a === void 0 ? void 0 : _a.props) === null || _b === void 0 ? void 0 : _b.onCellDoubleClicked) {
                (_d = (_c = sheetContext.current) === null || _c === void 0 ? void 0 : _c.props) === null || _d === void 0 ? void 0 : _d.onCellDoubleClicked({
                    event,
                    dataItem: props.dataItem,
                    rowIndex: props.rowIndex,
                    columnIndex: props.colIndex,
                    column: props.column,
                    value: props.value,
                    dataSource: props.dataSource
                });
            }
        }, onDoubleClickCapture: (event) => {
            var _a, _b, _c, _d;
            if ((_b = (_a = sheetContext.current) === null || _a === void 0 ? void 0 : _a.props) === null || _b === void 0 ? void 0 : _b.onCellDoubleClickedCapture) {
                (_d = (_c = sheetContext.current) === null || _c === void 0 ? void 0 : _c.props) === null || _d === void 0 ? void 0 : _d.onCellDoubleClickedCapture({
                    event,
                    dataItem: props.dataItem,
                    rowIndex: props.rowIndex,
                    columnIndex: props.colIndex,
                    column: props.column,
                    value: props.value,
                    dataSource: props.dataSource
                });
            }
        } },
        react_1.default.createElement(CellComponent, { value: props.value, column: props.column, dataItem: props.dataItem, dataSource: props.dataSource, rowIndex: props.rowIndex, colIndex: props.colIndex, cellStyle: cellStyle, rowSpan: props.rowSpan, colSpan: props.colSpan }));
});
function calculateCellToBeSkippedDuringRendering(param) {
    const { lastColIndexBeforeViewPort, data, lastRowIndexBeforeViewPort, columns, lastRowIndexInsideViewPort, lastColIndexInsideViewPort } = param;
    // first we iterate over the rows
    const cellsToBeMerged = new Map();
    const cellsThatRequestForOtherCellsToBeMerged = new Map();
    for (let rowIndex = lastRowIndexBeforeViewPort; rowIndex < lastRowIndexInsideViewPort; rowIndex++) {
        for (let colIndex = lastColIndexBeforeViewPort; colIndex < lastColIndexInsideViewPort; colIndex++) {
            if (cellsToBeMerged.has(rowIndex) && (cellsToBeMerged.get(rowIndex) || new Set()).has(colIndex)) {
                continue;
            }
            const column = columns[colIndex];
            const dataItem = data[rowIndex];
            const cellSpanFunction = column.cellSpanFunction || cellSpanFunctionDefaultImplementation;
            const cellSpan = cellSpanFunction({
                data,
                dataItem,
                columns,
                lastColIndexBeforeViewPort,
                lastColIndexInsideViewPort,
                lastRowIndexInsideViewPort,
                lastRowIndexBeforeViewPort,
                rowIndex,
                colIndex,
                getCellValue: getCellValue(data, column)
            });
            const colSpan = cellSpan.colSpan || 1;
            const rowSpan = cellSpan.rowSpan || 1;
            if (colSpan > 1 || rowSpan > 1) {
                // ok this is expanding lets the cell that is not supposed to be visible;
                if (!cellsThatRequestForOtherCellsToBeMerged.has(rowIndex)) {
                    cellsThatRequestForOtherCellsToBeMerged.set(rowIndex, new Set());
                }
                (cellsThatRequestForOtherCellsToBeMerged.get(rowIndex) || new Set()).add(colIndex);
                for (let rowIndexToMerge = rowIndex; rowIndexToMerge < rowIndex + rowSpan; rowIndexToMerge++) {
                    for (let colIndexToMerge = colIndex; colIndexToMerge < colIndex + colSpan; colIndexToMerge++) {
                        if (!cellsToBeMerged.has(rowIndexToMerge)) {
                            cellsToBeMerged.set(rowIndexToMerge, new Set());
                        }
                        (cellsToBeMerged.get(rowIndexToMerge) || new Set()).add(colIndexToMerge);
                    }
                }
            }
        }
    }
    cellsThatRequestForOtherCellsToBeMerged.forEach((colIds, rowId) => {
        colIds.forEach(colId => {
            (cellsToBeMerged.get(rowId) || new Set()).delete(colId);
        });
    });
    return cellsToBeMerged;
}
function getCellValue(data, column) {
    return (rowIndex, colIndex) => {
        const dataItem = data[rowIndex];
        const dataItemToValue = column.dataItemToValue || dataItemToValueDefaultImplementation;
        return dataItemToValue({ dataItem, column, colIndex, dataSource: data, rowIndex });
    };
}
function renderComponent({ setElements, data, columns, hideLeftColumnIndex, customColWidth, customRowHeight, defaultColWidth, defaultRowHeight, scrollerLeft, scrollerTop, viewPortWidth, viewPortHeight, colWidthCallback, rowHeightCallback }) {
    const numberOfColBeforeViewPort = calculateBeforeViewPort(columns, customColWidth, defaultColWidth, scrollerLeft, colWidthCallback);
    const numberOfColInsideViewPort = calculateInsideViewPort(columns, numberOfColBeforeViewPort.index, customColWidth, defaultColWidth, viewPortWidth, scrollerLeft, numberOfColBeforeViewPort.totalLength, colWidthCallback);
    const numberOfRowBeforeViewPort = calculateBeforeViewPort(data, customRowHeight, defaultRowHeight, scrollerTop, rowHeightCallback);
    const numberOfRowInsideViewPort = calculateInsideViewPort(data, numberOfRowBeforeViewPort.index, customRowHeight, defaultRowHeight, viewPortHeight, scrollerTop, numberOfRowBeforeViewPort.totalLength, rowHeightCallback);
    const heightsOfRowInsideViewPort = numberOfRowInsideViewPort.lengths;
    const totalHeightBeforeViewPort = numberOfRowBeforeViewPort.totalLength;
    const lastRowIndexBeforeViewPort = numberOfRowBeforeViewPort.index;
    const lastRowIndexInsideViewPort = numberOfRowInsideViewPort.lengths.size + lastRowIndexBeforeViewPort;
    const widthsOfColInsideViewPort = numberOfColInsideViewPort.lengths;
    const lastColIndexBeforeViewPort = numberOfColBeforeViewPort.index;
    const totalWidthBeforeViewPort = numberOfColBeforeViewPort.totalLength;
    const lastColIndexInsideViewPort = numberOfColInsideViewPort.lengths.size + lastColIndexBeforeViewPort;
    const cellToBeSkippedDuringRendering = calculateCellToBeSkippedDuringRendering({
        lastRowIndexBeforeViewPort,
        lastColIndexBeforeViewPort,
        lastRowIndexInsideViewPort,
        lastColIndexInsideViewPort,
        columns,
        data
    });
    const { elements } = Array.from({ length: heightsOfRowInsideViewPort.size }).reduce((acc, _, rowIndexInsideViewPort) => {
        const rowIndex = lastRowIndexBeforeViewPort + rowIndexInsideViewPort;
        const rowHeight = heightsOfRowInsideViewPort.get(rowIndex) || 0;
        const { elements } = Array.from({ length: widthsOfColInsideViewPort.size }).reduce((colAcc, _, colIndexInsideViewPort) => {
            const colIndex = lastColIndexBeforeViewPort + colIndexInsideViewPort;
            const colWidth = widthsOfColInsideViewPort.get(colIndex) || 0;
            if ((cellToBeSkippedDuringRendering.get(rowIndex) || new Set()).has(colIndex)) {
                colAcc.left = colAcc.left + colWidth;
                return colAcc;
            }
            const column = columns[colIndex];
            const dataItem = data[rowIndex];
            const dataItemToValue = column.dataItemToValue || dataItemToValueDefaultImplementation;
            const value = dataItemToValue({ dataItem, column, colIndex, dataSource: data, rowIndex });
            const cellSpanFunction = column.cellSpanFunction || cellSpanFunctionDefaultImplementation;
            const cellSpan = cellSpanFunction({
                data,
                dataItem,
                columns,
                lastRowIndexInsideViewPort,
                lastColIndexInsideViewPort,
                lastRowIndexBeforeViewPort,
                lastColIndexBeforeViewPort,
                rowIndex,
                colIndex,
                getCellValue: getCellValue(data, column)
            });
            const colSpan = cellSpan.colSpan || 1;
            const rowSpan = cellSpan.rowSpan || 1;
            let accumulatedRowHeight = rowHeight;
            let accumulatedColWidth = colWidth;
            if (colSpan > 1 || rowSpan > 1) {
                accumulatedRowHeight = Array.from({ length: rowSpan }).reduce((acc, _, index) => {
                    return acc + (heightsOfRowInsideViewPort.get(index + rowIndex) || 0);
                }, 0);
                accumulatedColWidth = Array.from({ length: colSpan }).reduce((acc, _, index) => {
                    return acc + (widthsOfColInsideViewPort.get(index + colIndex) || 0);
                }, 0);
            }
            if (colIndex > hideLeftColumnIndex) {
                colAcc.elements.push(react_1.default.createElement(CellRenderer, { key: `${rowIndex}-${colIndex}`, rowIndex: rowIndex, colIndex: colIndex, top: acc.top, width: accumulatedColWidth, dataSource: data, dataItem: dataItem, value: value, column: column, left: colAcc.left, height: accumulatedRowHeight, colSpan: colSpan, rowSpan: rowSpan }));
            }
            colAcc.left = colAcc.left + colWidth;
            return colAcc;
        }, { elements: [], left: totalWidthBeforeViewPort });
        acc.top = acc.top + rowHeight;
        acc.elements = [...acc.elements, ...elements];
        return acc;
    }, { elements: [], top: totalHeightBeforeViewPort });
    setElements(elements);
}
function dataItemToValueDefaultImplementation(props) {
    if (props.dataItem) {
        const value = props.dataItem[props.column.field];
        return value === null || value === void 0 ? void 0 : value.toString();
    }
    return '';
}
exports.dataItemToValueDefaultImplementation = dataItemToValueDefaultImplementation;
//# sourceMappingURL=Sheet.js.map