import React from "react";
/**
 * Properties for Vertical props
 */
interface VerticalProps extends React.HTMLAttributes<HTMLDivElement> {
    hAlign: 'left' | 'right' | 'center' | undefined;
    vAlign: 'top' | 'bottom' | 'center' | undefined;
}
declare const _default: React.ForwardRefExoticComponent<VerticalProps & React.RefAttributes<HTMLDivElement>>;
/**
 * Flexbox Vertical
 */
export default _default;
