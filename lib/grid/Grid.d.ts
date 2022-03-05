/// <reference types="react" />
import { Column } from "./Sheet";
interface GridProps {
    data: Array<any>;
    columns: Array<Column>;
}
export default function Grid({ data, columns }: GridProps): JSX.Element;
export {};
