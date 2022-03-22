import { Column } from "./Sheet";
import React from "react";
export interface GridProps {
    data: Array<any>;
    columns: Array<GridColumnGroup | GridColumn>;
    onFilterChange?: (filterValue: Map<string, any>) => void;
    defaultRowHeight?: number;
    defaultColWidth?: number;
    focusedDataItem?: any;
    onFocusedDataItemChange?: (newItem: any, oldItem: any) => void;
    pinnedLeftColumnIndex: number;
}
export interface GridColumn extends Column {
    title: string;
    headerCellComponent?: React.FC<HeaderCellComponentProps>;
    filterCellComponent?: React.FC<HeaderCellComponentProps>;
}
export interface GridColumnGroup {
    title: string;
    columns: Array<GridColumnGroup | GridColumn>;
}
interface HeaderCellComponentProps {
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
export {};
