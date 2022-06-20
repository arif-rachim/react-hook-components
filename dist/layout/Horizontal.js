"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Horizontal = void 0;
const react_1 = require("react");
const LayoutProps_1 = require("./LayoutProps");
/**
 * Horizontal is a div element that has a predefined style in the form of
 * 1. layout : flex,
 * 2. flex-direction : row
 * 3. box-sizing : border-box.
 * Vertical also has vAlign and hAlign attributes, which can be used to adjust the alignment position of its children.
 */
exports.Horizontal = react_1.default.forwardRef((props, ref) => {
    const { style, properties } = (0, LayoutProps_1.useLayoutPropsValue)(props, true);
    return react_1.default.createElement("div", Object.assign({ ref: ref, style: style }, properties), properties.children);
});
//# sourceMappingURL=Horizontal.js.map