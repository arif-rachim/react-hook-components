import { dataItemToValueDefaultImplementation, Sheet } from "./Sheet";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";
import Vertical from "../layout/Vertical";
import Horizontal from "../layout/Horizontal";
import { useObserver, ObserverValue, useObserverListener, useObserverValue } from "react-hook-useobserver";
const FIRST_COLUMN_WIDTH = 20;
const HANDLER_LENGTH = 7;
const HEADER_HEIGHT = 50;
const DEFAULT_HEIGHT = 25;
const DEFAULT_WIDTH = 70;
//const SCROLLER_WIDTH = 17;
const SCROLLER_WIDTH = 0;
const CellComponentForColumnHeaderBase = (props) => {
    const index = props.colIndex;
    const handlerRef = useRef(defaultDif);
    const containerRef = useRef(defaultDif);
    const gridContextRef = useContext(GridContext);
    const column = props.column;
    const gridColumn = column;
    const CellComponentForColHeader = gridColumn.headerCellComponent || CellComponentForColumnHeader;
    const mousePositionRef = useRef({ current: 0, next: 0, dragActive: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleDrag = useCallback(dragListener(mousePositionRef, gridContextRef.current.onCellResize, index, containerRef, handlerRef, "horizontal"), []);
    useEffect(() => {
        handlerRef.current.style.left = `${containerRef.current.getBoundingClientRect().width - Math.ceil(0.5 * HANDLER_LENGTH)}px`;
    }, []);
    const title = props.dataItem[props.column.field];
    const shouldHaveResizeHandler = (props.rowIndex + ((props === null || props === void 0 ? void 0 : props.rowSpan) || 0)) === props.dataSource.length;
    return React.createElement(Vertical, { ref: containerRef, style: {
            padding: '0px 0px',
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            flexShrink: 0,
            flexGrow: 0,
            position: 'relative'
        } },
        React.createElement(CellComponentForColHeader, { column: gridColumn, colIndex: props.colIndex, rowIndex: props.rowIndex, field: gridColumn.field, title: title, dataSource: props.dataSource, rowSpan: props.rowSpan, colSpan: props.colSpan }),
        shouldHaveResizeHandler &&
            React.createElement(Vertical, { ref: handlerRef, style: {
                    height: '100%',
                    position: 'absolute',
                    backgroundColor: 'rgba(0,0,0,0)',
                    width: HANDLER_LENGTH,
                    zIndex: 1,
                    top: 0,
                    boxSizing: 'border-box',
                    cursor: 'col-resize'
                }, onMouseDown: handleDrag }));
};
const CellComponentToResizeRow = (props) => {
    const index = props.rowIndex;
    const containerRef = useRef(defaultDif);
    const handlerBottomRef = useRef(defaultDif);
    const gridContextRef = useContext(GridContext);
    const mousePositionRef = useRef({ current: 0, next: 0, dragActive: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleDrag = useCallback(dragListener(mousePositionRef, gridContextRef.current.onRowResize, index, containerRef, handlerBottomRef, "vertical"), []);
    useEffect(() => {
        handlerBottomRef.current.style.top = `${containerRef.current.getBoundingClientRect().height - Math.ceil(0.5 * HANDLER_LENGTH)}px`;
    }, []);
    return React.createElement(Vertical, { ref: containerRef, style: {
            padding: '3px 5px',
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
                backgroundColor: 'rgba(0,0,0,0)',
                height: HANDLER_LENGTH,
                zIndex: 1,
                left: 0,
                boxSizing: 'border-box',
                cursor: 'pointer'
            }, onMouseDown: handleDrag }));
};
function dragListener(mousePositionRef, onResize, index, containerRef, handlerRef, dragDirection = 'vertical') {
    return (event) => {
        event.preventDefault();
        const isVertical = dragDirection === 'vertical';
        if (isVertical) {
            mousePositionRef.current.current = event.clientY;
        }
        else {
            mousePositionRef.current.current = event.clientX;
        }
        mousePositionRef.current.dragActive = true;
        let cellHeight = 0;
        function closeDragElement() {
            mousePositionRef.current.dragActive = false;
            document.removeEventListener('mouseup', closeDragElement);
            document.removeEventListener('mousemove', onElementDrag);
            onResize(index, cellHeight + (Math.ceil(0.5 * HANDLER_LENGTH)));
        }
        function onElementDrag(event) {
            event.preventDefault();
            if (!mousePositionRef.current.dragActive) {
                return;
            }
            if (isVertical && (event.clientY <= containerRef.current.getBoundingClientRect().y)) {
                return;
            }
            if ((!isVertical) && (event.clientX <= containerRef.current.getBoundingClientRect().x)) {
                return;
            }
            mousePositionRef.current.next = mousePositionRef.current.current - (isVertical ? event.clientY : event.clientX);
            mousePositionRef.current.current = isVertical ? event.clientY : event.clientX;
            cellHeight = ((isVertical ? handlerRef.current.offsetTop : handlerRef.current.offsetLeft) - mousePositionRef.current.next);
            if (isVertical) {
                handlerRef.current.style.top = cellHeight + 'px';
            }
            else {
                handlerRef.current.style.left = cellHeight + 'px';
            }
            onResize(index, cellHeight + (Math.ceil(0.5 * HANDLER_LENGTH)));
        }
        document.addEventListener('mouseup', closeDragElement);
        document.addEventListener('mousemove', onElementDrag);
    };
}
const defaultDif = document.createElement('div');
function noOp() {
}
const GridContext = createContext({
    current: {
        onCellResize: noOp,
        onRowResize: noOp,
        setGridFilter: noOp,
        commitFilterChange: noOp,
        props: { data: [], columns: [] }
    }
});
const SORT_DIRECTION = {
    ASC: 'ASC',
    DESC: 'DESC'
};
function SortComponent({ field }) {
    const gridContextRef = useContext(GridContext);
    const [$defaultSort] = useObserver([]);
    const direction = useObserverValue(gridContextRef.current.$gridSort || $defaultSort, (gridSort) => {
        const sort = gridSort.find(sort => sort.field === field);
        return sort === null || sort === void 0 ? void 0 : sort.direction;
    });
    return React.createElement(Vertical, { style: { flexShrink: 0, flexGrow: 0, marginLeft: 0, color: 'crimson' } },
        direction === SORT_DIRECTION.ASC && React.createElement(IoArrowUp, null),
        direction === SORT_DIRECTION.DESC && React.createElement(IoArrowDown, null));
}
export function CellComponentForColumnHeader(props) {
    const column = props.column;
    const gridColumn = column;
    const FilterCellComponent = gridColumn.filterCellComponent || CellComponentForColumnHeaderFilter;
    const gridContextRef = useContext(GridContext);
    const filterHidden = gridContextRef.current.props.filterHidden;
    const sortableHidden = gridContextRef.current.props.sortableHidden;
    function handleSortClicked() {
        if ((!gridContextRef.current.setGridSort) || sortableHidden === true) {
            return;
        }
        gridContextRef.current.setGridSort((oldVal) => {
            // lets find old val index
            const oldField = oldVal.find(s => s.field === gridColumn.field);
            if (oldField) {
                const isAsc = oldField.direction === SORT_DIRECTION.ASC;
                if (isAsc) {
                    const newItem = { field: gridColumn.field, direction: "DESC" };
                    return [...oldVal.filter(s => s.field !== gridColumn.field), newItem];
                }
                else {
                    return oldVal.filter(s => s.field !== gridColumn.field);
                }
            }
            else {
                return [...oldVal, { field: gridColumn.field, direction: 'ASC' }];
            }
        });
    }
    const shouldHaveFilter = (props.rowIndex + ((props === null || props === void 0 ? void 0 : props.rowSpan) || 0)) === props.dataSource.length;
    return React.createElement(Vertical, { style: { height: '100%' } },
        React.createElement(Vertical, { style: { flexGrow: 1, padding: '0px 5px', backgroundColor: '#ddd', color: '#333', fontWeight: 'bold' }, hAlign: props.column.hAlign, vAlign: 'center', onClick: handleSortClicked },
            React.createElement(Horizontal, null,
                props.title,
                shouldHaveFilter &&
                    React.createElement(SortComponent, { field: gridColumn.field }))),
        shouldHaveFilter && filterHidden !== true &&
            React.createElement(FilterCellComponent, { title: props.title, field: props.field, colIndex: props.colIndex, column: gridColumn, rowIndex: props.rowIndex, dataSource: props.dataSource, colSpan: props.colSpan, rowSpan: props.colSpan }));
}
function CellComponentForColumnHeaderFilter(props) {
    const gridContextRef = useContext(GridContext);
    const [$empty] = useObserver(new Map());
    const value = useObserverValue(gridContextRef.current.$gridFilter || $empty, (arg) => {
        const value = arg;
        return value.get(props.field) || '';
    });
    return React.createElement(Vertical, { style: { borderTop: '1px solid #ddd' } },
        React.createElement("input", { type: "text", value: value, style: { border: 'none', borderRadius: 0, padding: '2px 5px' }, onChange: (event) => {
                gridContextRef.current.setGridFilter((oldVal) => {
                    const newMap = new Map(oldVal);
                    newMap.set(props.field, event.target.value);
                    return newMap;
                });
            }, onKeyUp: (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    event.stopPropagation();
                    gridContextRef.current.commitFilterChange();
                }
            } }));
}
function compareValue(props) {
    const { prev, next, gridSort, index } = props;
    if (index >= gridSort.length) {
        return 0;
    }
    const { field, direction } = gridSort[index];
    const isAsc = direction === 'ASC';
    const isDesc = direction === 'DESC';
    const columns = props.columns;
    const colIndex = columns.findIndex(col => col.field === field);
    const column = columns[colIndex];
    const dataSource = props.dataSource;
    const dataItemToLabel = column.dataItemToValue || dataItemToValueDefaultImplementation;
    const prevValue = dataItemToLabel({
        dataItem: prev,
        column,
        colIndex,
        rowIndex: dataSource.indexOf(prev),
        dataSource
    });
    const nextValue = dataItemToLabel({
        dataItem: next,
        column,
        colIndex,
        rowIndex: dataSource.indexOf(next),
        dataSource
    });
    const prevLowerCase = (prevValue || '').toLowerCase();
    const nextLowerCase = (nextValue || '').toLowerCase();
    if (prevLowerCase === nextLowerCase) {
        return compareValue({ prev, next, gridSort, index: index + 1, columns, dataSource });
    }
    const val = prevLowerCase > nextLowerCase ? 1 : -1;
    return isAsc ? val : isDesc ? -val : 0;
}
function filterDataSource(dataSource, $gridFilter, columns) {
    return dataSource.filter((data, rowIndex) => {
        return Array.from($gridFilter.current.keys()).reduce((accumulator, key) => {
            const gridFilter = $gridFilter.current;
            const colIndex = columns.findIndex(col => col.field === key);
            const column = columns[colIndex];
            const dataItemToValue = (column === null || column === void 0 ? void 0 : column.dataItemToValue) || dataItemToValueDefaultImplementation;
            const filterValue = gridFilter.get(key).toString().toUpperCase();
            const value = (dataItemToValue({
                dataItem: data,
                dataSource,
                column,
                colIndex,
                rowIndex
            }) || '').toUpperCase();
            return (value.indexOf(filterValue) >= 0) && accumulator;
        }, true);
    });
}
function convertColumnsPropsToColumns(columnsProp) {
    let columns = [];
    columnsProp.forEach((column) => {
        if ('columns' in column) {
            columns = columns.concat(convertColumnsPropsToColumns(column.columns));
        }
        else {
            columns.push(column);
        }
    });
    return columns;
}
function populateHeaderDataMap(columnsProp, headerDataMap, rowIdx, setParentRowField) {
    columnsProp.forEach((column) => {
        if (!headerDataMap.has(rowIdx)) {
            headerDataMap.set(rowIdx, new Map());
        }
        const row = (headerDataMap.get(rowIdx) || new Map());
        if ('columns' in column) {
            populateHeaderDataMap(column.columns, headerDataMap, rowIdx + 1, (field) => {
                if (setParentRowField) {
                    setParentRowField(field);
                }
                row.set(field, column.title);
            });
        }
        else {
            if (setParentRowField) {
                setParentRowField(column.field);
            }
            row.set(column.field, column.title);
        }
    });
}
function constructHeaderData(columnsProp) {
    return () => {
        const headerData = [];
        const headerDataMap = new Map();
        populateHeaderDataMap(columnsProp, headerDataMap, 0);
        headerDataMap.forEach((row, rowId) => {
            if (rowId > 0) {
                const prevRow = headerDataMap.get(rowId - 1) || new Map();
                prevRow.forEach((val, key) => {
                    if (!row.has(key)) {
                        row.set(key, val);
                    }
                });
            }
        });
        headerDataMap.forEach((row) => {
            const data = {};
            row.forEach((value, field) => {
                data[field] = value;
            });
            headerData.push(data);
        });
        return headerData;
    };
}
export function Grid(gridProps) {
    const { data: dataProp, focusedDataItem, columns: columnsProp, onFilterChange, defaultRowHeight: _defaultRowHeight, defaultColWidth: _defaultCoWidth, pinnedLeftColumnIndex, rowResizerHidden, defaultHeaderRowHeight, headerRowHeightCallback, customRowHeight, customColWidth, onCustomColWidthChange, onCustomRowHeightChange } = gridProps;
    const defaultRowHeight = _defaultRowHeight || DEFAULT_HEIGHT;
    const defaultColWidth = _defaultCoWidth || DEFAULT_WIDTH;
    const [$columns, setColumns] = useObserver(() => convertColumnsPropsToColumns(columnsProp));
    const [$data, setData] = useObserver(dataProp);
    const [$viewPortDimension, setViewPortDimension] = useObserver({ width: 0, height: 0 });
    const [$customColWidth, setCustomColWidth] = useObserver(customColWidth || new Map());
    const [$customRowHeight, setCustomRowHeight] = useObserver(customRowHeight || new Map());
    useObserverListener($customColWidth, () => {
        const changeCallback = onCustomColWidthChange || (() => { });
        if ($customColWidth.current.size > 0) {
            changeCallback($customColWidth.current);
        }
    });
    useObserverListener($customRowHeight, () => {
        const changeCallback = onCustomRowHeightChange || (() => { });
        if ($customRowHeight.current.size > 0) {
            changeCallback($customRowHeight.current);
        }
    });
    const [$gridFilter, setGridFilter] = useObserver(new Map());
    const [$gridSort, setGridSort] = useObserver([]);
    const [$focusedDataItem, setFocusedDataItem] = useObserver(focusedDataItem);
    const [$pinnedLeftColumnWidth, setPinnedLeftColumnWidth] = useObserver(0);
    const viewportRef = useRef(defaultDif);
    const gridHeaderRef = useRef({
        setScrollerPosition: () => {
        }
    });
    const gridLeftPinnedRef = useRef({
        setScrollerPosition: () => {
        }
    });
    const gridRowResizerRef = useRef({
        setScrollerPosition: () => {
        }
    });
    const hideLeftColumnIndex = pinnedLeftColumnIndex !== undefined && pinnedLeftColumnIndex >= 0 ? pinnedLeftColumnIndex : -1;
    useEffect(() => setViewPortDimension(viewportRef.current.getBoundingClientRect()), [setViewPortDimension]);
    useEffect(() => setFocusedDataItem(focusedDataItem), [focusedDataItem, setFocusedDataItem]);
    useObserverListener([$viewPortDimension, $columns], () => {
        if ($viewPortDimension.current.width > 0) {
            const propsCustomColWidth = gridProps.customColWidth || new Map();
            const columnsWidth = new Map();
            const columnsWidthPercentage = new Map();
            let totalColumnsWidth = 0;
            let totalPercentage = 0;
            const viewPortWidth = $viewPortDimension.current.width - SCROLLER_WIDTH;
            $columns.current.forEach((column, columnIndex) => {
                if (propsCustomColWidth.has(columnIndex)) {
                    const width = propsCustomColWidth.get(columnIndex) || 0;
                    totalColumnsWidth += width;
                    columnsWidth.set(columnIndex, width);
                }
                else if (typeof column.width === 'number') {
                    totalColumnsWidth += column.width;
                    columnsWidth.set(columnIndex, column.width);
                }
                else if (typeof column.width === 'string' && column.width.endsWith('%')) {
                    const widthInPercentage = parseInt(column.width.replace('%', ''));
                    columnsWidthPercentage.set(columnIndex, widthInPercentage);
                    totalPercentage += widthInPercentage;
                }
            });
            const remainingWidth = viewPortWidth - totalColumnsWidth;
            if (remainingWidth > 0) {
                columnsWidthPercentage.forEach((value, key) => {
                    const width = (value / totalPercentage) * remainingWidth;
                    columnsWidth.set(key, width);
                });
            }
            else {
                columnsWidthPercentage.forEach((value, key) => {
                    columnsWidth.set(key, defaultColWidth || 0);
                });
            }
            const sortedColumnsWidth = new Map(Array.from(columnsWidth.entries()).sort((a, b) => (a[0] === b[0] ? 0 : a[0] > b[0] ? 1 : -1)));
            setCustomColWidth(sortedColumnsWidth);
        }
    });
    useObserverListener($customColWidth, () => {
        const pinnedLeftColWidth = Array.from($customColWidth.current.entries()).filter((value) => value[0] <= hideLeftColumnIndex).reduce((acc, val) => acc + val[1], 0);
        setPinnedLeftColumnWidth(pinnedLeftColWidth);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const headerData = useMemo(constructHeaderData(columnsProp), [columnsProp]);
    useEffect(() => setData(dataProp), [dataProp, setData]);
    useEffect(() => setColumns(convertColumnsPropsToColumns(columnsProp)), [columnsProp, setColumns]);
    const columnDataToResizeRow = useMemo(() => ([{
            field: '_',
            width: FIRST_COLUMN_WIDTH,
            title: ' ',
            hAlign: 'left',
            cellComponent: CellComponentToResizeRow
        }]), []);
    const columnsHeaderColumn = useObserverValue($columns, (columns) => {
        return columns.map((c) => (Object.assign(Object.assign({}, c), { cellComponent: CellComponentForColumnHeaderBase, cellSpanFunction: defaultCellSpanFunction })));
    });
    const gridContextRef = useRef({
        props: gridProps,
        columns: $columns.current,
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
        },
        $gridFilter, setGridFilter,
        $gridSort, setGridSort,
        $focusedDataItem,
        commitFilterChange: () => {
            if (onFilterChange) {
                onFilterChange($gridFilter.current);
            }
            else {
                const filteredData = filterDataSource(gridContextRef.current.props.data, $gridFilter, gridContextRef.current.columns);
                setData(filteredData);
            }
        }
    });
    gridContextRef.current.props = gridProps;
    const sheetDataToResizeRow = useMemo(() => dataProp.map(() => ({ _: '' })), [dataProp]);
    useObserverListener([$gridSort, $columns], () => {
        const gridSort = $gridSort.current;
        const clonedData = [...dataProp];
        clonedData.sort((prev, next) => compareValue({
            prev,
            next,
            gridSort,
            index: 0,
            columns: $columns.current,
            dataSource: dataProp
        }));
        const filteredData = filterDataSource(clonedData, $gridFilter, $columns.current);
        setData(filteredData);
    });
    return React.createElement(Vertical, { style: { height: '100%', width: '100%', overflow: 'auto' } },
        React.createElement(GridContext.Provider, { value: gridContextRef },
            React.createElement(Horizontal, null,
                rowResizerHidden !== true &&
                    React.createElement(Vertical, { style: {
                            flexBasis: FIRST_COLUMN_WIDTH,
                            flexShrink: 0,
                            flexGrow: 0,
                            borderRight: '1px solid #ddd',
                            borderBottom: '1px solid #ddd'
                        } }),
                React.createElement(Horizontal, { style: { height: '100%', flexGrow: 1, overflow: 'auto', position: 'relative' } },
                    React.createElement(ObserverValue, { observers: [$pinnedLeftColumnWidth], render: () => {
                            return React.createElement(Vertical, { style: {
                                    width: $pinnedLeftColumnWidth.current,
                                    overflow: 'auto',
                                    flexShrink: 0,
                                    flexGrow: 0,
                                    position: 'absolute',
                                    zIndex: 1,
                                } },
                                React.createElement(Sheet, { data: headerData, columns: columnsHeaderColumn.filter((value, index) => index <= hideLeftColumnIndex), "$customColWidth": $customColWidth, styleContainer: { width: '100%' }, showScroller: false, defaultRowHeight: defaultHeaderRowHeight || HEADER_HEIGHT, defaultColWidth: defaultColWidth, hideLeftColumnIndex: -1, rowHeightCallback: headerRowHeightCallback }));
                        } }),
                    React.createElement(Vertical, { style: { flexGrow: 1, overflow: 'auto' } },
                        React.createElement(Sheet, { data: headerData, ref: gridHeaderRef, columns: columnsHeaderColumn, "$customColWidth": $customColWidth, showScroller: false, defaultRowHeight: defaultHeaderRowHeight || HEADER_HEIGHT, defaultColWidth: defaultColWidth, hideLeftColumnIndex: hideLeftColumnIndex, sheetHeightFollowsTotalRowsHeight: true, rowHeightCallback: headerRowHeightCallback })))),
            React.createElement(Horizontal, { style: {
                    height: `calc(100% - ${defaultHeaderRowHeight || HEADER_HEIGHT}px)`,
                    width: '100%',
                    overflow: 'auto'
                } },
                rowResizerHidden !== true &&
                    React.createElement(Vertical, { style: { flexBasis: FIRST_COLUMN_WIDTH, flexShrink: 0, flexGrow: 0 } },
                        React.createElement(Sheet, { data: sheetDataToResizeRow, columns: columnDataToResizeRow, "$customRowHeight": $customRowHeight, ref: gridRowResizerRef, showScroller: false, defaultColWidth: FIRST_COLUMN_WIDTH, defaultRowHeight: defaultRowHeight, hideLeftColumnIndex: -1 })),
                React.createElement(Horizontal, { style: { height: '100%', flexGrow: 1, overflow: 'auto', position: 'relative' } },
                    React.createElement(ObserverValue, { observers: [$pinnedLeftColumnWidth, $data, $columns], render: () => {
                            return React.createElement(Vertical, { style: {
                                    width: $pinnedLeftColumnWidth.current,
                                    flexShrink: 0,
                                    flexGrow: 0,
                                    left: 0,
                                    height: `calc(100% - ${SCROLLER_WIDTH}px)`,
                                    position: 'absolute',
                                    zIndex: 1
                                } },
                                React.createElement(Sheet, { ref: gridLeftPinnedRef, data: $data.current, columns: $columns.current.filter((value, index) => index <= hideLeftColumnIndex), "$customRowHeight": $customRowHeight, "$customColWidth": $customColWidth, showScroller: false, defaultColWidth: defaultColWidth, styleContainer: { width: '100%' }, defaultRowHeight: defaultRowHeight, onCellClicked: event => {
                                        if (gridProps.onFocusedDataItemChange) {
                                            gridProps.onFocusedDataItemChange(event.dataItem, $focusedDataItem.current);
                                        }
                                        else {
                                            setFocusedDataItem(event.dataItem);
                                        }
                                    }, hideLeftColumnIndex: -1, "$focusedDataItem": $focusedDataItem }));
                        } }),
                    React.createElement(Vertical, { ref: viewportRef, style: { height: '100%', flexGrow: 1, overflow: 'auto' } },
                        React.createElement(ObserverValue, { observers: [$data, $columns], render: () => {
                                return React.createElement(Sheet, { data: $data.current, columns: $columns.current, "$customRowHeight": $customRowHeight, "$customColWidth": $customColWidth, onScroll: ({ scrollLeft, scrollTop }) => {
                                        gridLeftPinnedRef.current.setScrollerPosition({ left: 0, top: scrollTop });
                                        gridRowResizerRef.current.setScrollerPosition({ left: 0, top: scrollTop });
                                        gridHeaderRef.current.setScrollerPosition({ left: scrollLeft, top: 0 });
                                    }, defaultColWidth: defaultColWidth, defaultRowHeight: defaultRowHeight, onCellClicked: event => {
                                        if (gridProps.onFocusedDataItemChange) {
                                            gridProps.onFocusedDataItemChange(event.dataItem, $focusedDataItem.current);
                                        }
                                        else {
                                            setFocusedDataItem(event.dataItem);
                                        }
                                    }, "$focusedDataItem": $focusedDataItem, hideLeftColumnIndex: hideLeftColumnIndex });
                            } }))))));
}
export function defaultCellSpanFunction(props) {
    let rowSpan = 1;
    let colSpan = 1;
    function getCellTitle(rowIndex, colIndex) {
        const rowData = props.data[rowIndex];
        const column = props.columns[colIndex];
        if (rowData && column) {
            return rowData[column.field];
        }
        return '';
    }
    const cellTitle = getCellTitle(props.rowIndex, props.colIndex);
    while (rowSpan <= props.lastRowIndexInsideViewPort && cellTitle === getCellTitle(props.rowIndex + rowSpan, props.colIndex)) {
        rowSpan++;
    }
    while (colSpan <= props.lastColIndexInsideViewPort && cellTitle === getCellTitle(props.rowIndex, props.colIndex + colSpan)) {
        colSpan++;
    }
    return {
        rowSpan,
        colSpan
    };
}
//# sourceMappingURL=Grid.js.map