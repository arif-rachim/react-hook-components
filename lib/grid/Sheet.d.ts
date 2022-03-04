import { CSSProperties } from "react";
interface SheetProperties<DataItem> {
    data: Array<DataItem>;
    columns: Array<any>;
    styleContainer?: CSSProperties;
    styleViewPort?: CSSProperties;
    columnsLength?: Map<number, number>;
    rowsLength?: Map<number, number>;
}
export default function Sheet<DataItem>(props: SheetProperties<DataItem>): JSX.Element;
export {};
