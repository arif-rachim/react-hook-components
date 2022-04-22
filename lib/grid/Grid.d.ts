import { CalculateLengthCallback, CellSpanFunctionProps, CellSpanFunctionResult, Column } from "./Sheet";
import React from "react";
export interface GridProps {
    data: Array<any>;
    columns: Array<GridColumnGroup | GridColumn>;
    onFilterChange?: (filterValue: Map<string, any>) => void;
    defaultRowHeight?: number;
    defaultColWidth?: number;
    focusedDataItem?: any;
    onFocusedDataItemChange?: (newItem: any, oldItem: any) => void;
    pinnedLeftColumnIndex?: number;
    rowResizerHidden?: boolean;
    filterHidden?: boolean;
    sortableHidden?: boolean;
    defaultHeaderRowHeight?: number;
    headerRowHeightCallback?: CalculateLengthCallback;
    customRowHeight?: Map<number, number>;
    customColWidth?: Map<number, number>;
    onCustomColWidthChange?: (customColWidth: Map<number, number>) => void;
    onCustomRowHeightChange?: (customRowHeight: Map<number, number>) => void;
}
export interface GridColumn extends Column {
    title: string | JSX.Element;
    headerCellComponent?: React.FC<HeaderCellComponentProps>;
    filterCellComponent?: React.FC<HeaderCellComponentProps>;
}
export interface GridColumnGroup {
    title: string | JSX.Element;
    columns: Array<GridColumnGroup | GridColumn>;
}
export interface HeaderCellComponentProps {
    field: string;
    title: string;
    column: Column;
    colIndex: number;
    rowIndex: number;
    dataSource: Array<any>;
    rowSpan: number;
    colSpan: number;
}
export declare function CellComponentForColumnHeader(props: HeaderCellComponentProps): JSX.Element;
export declare function Grid(gridProps: GridProps): JSX.Element;
export declare function defaultCellSpanFunction(props: CellSpanFunctionProps): CellSpanFunctionResult;
