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
 * Flexbox Horizontal
 */
export default _default;
