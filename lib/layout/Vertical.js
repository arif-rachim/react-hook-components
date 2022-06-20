import React from "react";
import { useLayoutPropsValue } from "./LayoutProps";
/**
 * Vertical is a div element that has a predefined style in the form of
 * 1. layout : flex,
 * 2. flex-direction : column
 * 3. box-sizing : border-box.
 * Vertical also has vAlign and hAlign attributes, which can be used to adjust the alignment position of its children.
 */
export const Vertical = React.forwardRef(function Vertical(props, ref) {
    const { style, properties } = useLayoutPropsValue(props, false);
    return React.createElement("div", Object.assign({ ref: ref, style: style }, properties), properties.children);
});
//# sourceMappingURL=Vertical.js.map