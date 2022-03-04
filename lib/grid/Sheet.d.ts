import { CSSProperties } from "react";
interface SheetProperties {
    data: [];
    columns: [];
    styleContainer?: CSSProperties;
    styleViewPort?: CSSProperties;
    columnsLength?: Record<number, number>;
    rowsLength?: Record<number, number>;
}
export default function Sheet(props: SheetProperties): JSX.Element;
export {};
