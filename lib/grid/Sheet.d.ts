import React, { CSSProperties } from "react";
import { Observer } from "react-hook-useobserver/lib/useObserver";
export interface Column {
    field: string;
    width: number;
    title: string;
    cellComponent: React.FC<CellComponentProps>;
}
export declare const CellComponentString: React.FC<CellComponentProps>;
declare type ScrollListener = (event: {
    scrollLeft: number;
    scrollTop: number;
    viewportWidth: number;
    viewportHeight: number;
}) => void;
interface SheetProperties<DataItem> {
    data: Array<DataItem>;
    columns: Array<Column>;
    styleContainer?: CSSProperties;
    styleViewPort?: CSSProperties;
    $customColWidth?: Observer<Map<number, number>>;
    $customRowHeight?: Observer<Map<number, number>>;
    onScroll?: ScrollListener;
    $scrollLeft?: Observer<number>;
    $scrollTop?: Observer<number>;
    showScroller?: boolean;
    defaultColWidth?: number;
    defaultRowHeight?: number;
}
export interface CellComponentProps {
    dataSource: Array<any>;
    dataItem: any;
    value: any;
    column: Column;
    rowIndex: number;
    colIndex: number;
}
export default function Sheet<DataItem>(props: SheetProperties<DataItem>): JSX.Element;
export {};
