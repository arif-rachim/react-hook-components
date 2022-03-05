import React from "react";
/**
 * Properties for Vertical props
 */
interface HorizontalProps extends React.HTMLAttributes<HTMLDivElement> {
    hAlign?: 'left' | 'right' | 'center' | undefined;
    vAlign?: 'top' | 'bottom' | 'center' | undefined;
}
declare const _default: React.ForwardRefExoticComponent<HorizontalProps & React.RefAttributes<HTMLDivElement>>;
/**
 * Horizontal is a div element that has a predefined style in the form of
 * 1. layout : flex,
 * 2. flex-direction : row
 * 3. box-sizing : border-box.
 * Vertical also has vAlign and hAlign attributes, which can be used to adjust the alignment position of its children.
 */
export default _default;
