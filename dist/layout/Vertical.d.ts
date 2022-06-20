/// <reference types="react" />
import { LayoutProps } from "./LayoutProps";
/**
 * Vertical is a div element that has a predefined style in the form of
 * 1. layout : flex,
 * 2. flex-direction : column
 * 3. box-sizing : border-box.
 * Vertical also has vAlign and hAlign attributes, which can be used to adjust the alignment position of its children.
 */
export declare const Vertical: import("react").ForwardRefExoticComponent<LayoutProps & import("react").RefAttributes<HTMLDivElement>>;
