import React from "react";
import { LayoutProps } from "./LayoutProps";
/**
 * Horizontal is a div element that has a predefined style in the form of
 * 1. layout : flex,
 * 2. flex-direction : row
 * 3. box-sizing : border-box.
 * Vertical also has vAlign and hAlign attributes, which can be used to adjust the alignment position of its children.
 */
export declare const Horizontal: React.ForwardRefExoticComponent<LayoutProps & React.RefAttributes<HTMLDivElement>>;
