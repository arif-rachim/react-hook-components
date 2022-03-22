import React, { CSSProperties, SyntheticEvent } from "react";
import { Observer } from "react-hook-useobserver/lib/useObserver";
interface CellSpanFunctionProps {
    lastRowIndexBeforeViewPort: number;
    lastRowIndexInsideViewPort: number;
    lastColIndexBeforeViewPort: number;
    lastColIndexInsideViewPort: number;
    rowIndex: number;
    colIndex: number;
    dataItem: any;
    data: Array<any>;
    columns: Array<Column>;
    getCellValue: (rowIndex: number, colIndex: number) => any;
}
export interface CellSpanFunctionResult {
    rowSpan?: number;
    colSpan?: number;
}
export interface Column {
    field: string;
    width: number | string;
    cellComponent?: React.FC<CellComponentStyledProps>;
    cellStyleFunction?: (props: CellStyleFunctionProperties) => CSSProperties;
    dataItemToValue?: (props: DataItemToValueProps) => string;
    cellSpanFunction?: (props: CellSpanFunctionProps) => CellSpanFunctionResult;
}
export interface SheetProperties<DataItem> {
    data: Array<DataItem>;
    columns: Array<Column>;
    styleContainer?: CSSProperties;
    styleViewPort?: CSSProperties;
    $customColWidth?: Observer<Map<number, number>>;
    $customRowHeight?: Observer<Map<number, number>>;
    onScroll?: ScrollListener;
    showScroller?: boolean;
    defaultColWidth: number;
    defaultRowHeight: number;
    onCellClicked?: CellClickedCallback;
    onCellClickedCapture?: CellClickedCallback;
    onCellDoubleClicked?: CellClickedCallback;
    onCellDoubleClickedCapture?: CellClickedCallback;
    hideLeftColumnIndex: number;
    $focusedDataItem?: Observer<any>;
}
interface DataItemToValueProps {
    dataSource: Array<any>;
    dataItem: any;
    column: Column;
    rowIndex: number;
    colIndex: number;
}
export interface CellComponentProps extends DataItemToValueProps {
    value: any;
    colSpan: number;
    rowSpan: number;
}
interface CellRendererProps extends CellComponentProps {
    height: number;
    width: number;
    top: number;
    left: number;
    style?: CSSProperties;
}
export interface CellComponentStyledProps extends CellComponentProps {
    cellStyle: CSSProperties;
}
declare type ScrollListener = (event: {
    scrollLeft: number;
    scrollTop: number;
}) => void;
declare type CellClickedCallback = (event: {
    event: SyntheticEvent<HTMLDivElement>;
    rowIndex: number;
    columnIndex: number;
    dataItem: any;
    column: Column;
    value: any;
    dataSource: Array<any>;
}) => void;
export interface SheetRef {
    setScrollerPosition: (props: {
        left: number;
        top: number;
    }) => void;
}
export declare const Sheet: React.ForwardRefExoticComponent<SheetProperties<unknown> & React.RefAttributes<SheetRef>>;
interface CellStyleFunctionProperties extends CellRendererProps {
    focusedItem: any;
    isFocused: boolean;
}
export declare function dataItemToValueDefaultImplementation(props: DataItemToValueProps): any;
export {};
