import React, {ForwardedRef} from "react";

/**
 * Properties for Vertical props
 */
interface VerticalProps extends React.HTMLAttributes<HTMLDivElement> {
    hAlign?: 'left' | 'right' | 'center' | undefined
    vAlign?: 'top' | 'bottom' | 'center' | undefined
}

/**
 * Flexbox Vertical
 */
export default React.forwardRef(function Vertical(props: VerticalProps,ref:ForwardedRef<HTMLDivElement>): JSX.Element {
    const {children, vAlign, hAlign, style, ...properties} = props;
    const alignItems = {left: 'flex-start', right: 'flex-end', center: 'center'}[hAlign];
    const justifyContent = {top: 'flex-start', bottom: 'flex-end', center: 'center'}[vAlign];
    return <div ref={ref} style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent,
        alignItems, ...style
    }} {...properties}>{children}</div>
});