import { CSSProperties } from "react";
import { Observer } from "react-hook-useobserver/lib/useObserver";
export interface Column {
    field: string;
    width: number;
}
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
    $customColWidth: Observer<Map<number, number>>;
    $customRowHeight: Observer<Map<number, number>>;
    onScroll?: ScrollListener;
}
export default function Sheet<DataItem>(props: SheetProperties<DataItem>): JSX.Element;
export {};
