import { CSSProperties } from "react";
interface SheetProperties {
    data: [];
    columns: [];
    styleContainer?: CSSProperties;
    styleViewPort?: CSSProperties;
    columnsLength?: Map<number, number>;
    rowsLength?: Map<number, number>;
}
export default function Sheet(props: SheetProperties): JSX.Element;
export {};
