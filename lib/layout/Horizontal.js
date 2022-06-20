import React from "react";
import { useLayoutPropsValue } from "./LayoutProps";
/**
 * Horizontal is a div element that has a predefined style in the form of
 * 1. layout : flex,
 * 2. flex-direction : row
 * 3. box-sizing : border-box.
 * Vertical also has vAlign and hAlign attributes, which can be used to adjust the alignment position of its children.
 */
export const Horizontal = React.forwardRef(function Horizontal(props, ref) {
    const { style, properties } = useLayoutPropsValue(props, true);
    return React.createElement("div", Object.assign({ ref: ref, style: style }, properties), properties.children);
});
//# sourceMappingURL=Horizontal.js.map