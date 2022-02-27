import React, {ForwardedRef} from "react";

/**
 * Properties for Vertical props
 */
interface HorizontalProps extends React.HTMLAttributes<HTMLDivElement> {
    hAlign: 'left' | 'right' | 'center' | undefined
    vAlign: 'top' | 'bottom' | 'center' | undefined
}

/**
 * Flexbox Horizontal
 */
export default React.forwardRef(function Horizontal(props: HorizontalProps, ref: ForwardedRef<HTMLDivElement>): JSX.Element {
    const {children, vAlign, hAlign, style, ...properties} = props;
    const justifyContent = {left: 'flex-start', right: 'flex-end', center: 'center'}[hAlign];
    const alignItems = {top: 'flex-start', bottom: 'flex-end', center: 'center'}[vAlign];

    return <div ref={ref} style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent,
        alignItems, ...style
    }} {...properties}>{children}</div>
});