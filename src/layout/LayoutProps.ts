import React, {CSSProperties, useMemo} from "react";

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
    hAlign?: 'left' | 'right' | 'center';
    vAlign?: 'top' | 'bottom' | 'center';
    mT?: number;
    mL?: number;
    mR?: number;
    mB?: number;
    m?: number;
    pT?: number;
    pL?: number;
    pR?: number;
    pB?: number;
    p?: number;
    w?: number | string;
    h?: number | string;
    r?: number;
    rTL?: number;
    rTR?: number;
    rBL?: number;
    rBR?: number;
    overflow?: "auto" | "clip" | "hidden" | "scroll" | "visible";
    backgroundColor?: string;
    color?: string;
    position?: "absolute" | "fixed" | "relative" | "static" | "sticky";
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
}

const H_ALIGN = {
    horizontal: {
        left: 'flex-start',
        right: 'flex-end',
        center: 'center'
    },
    vertical: {
        left: 'flex-start',
        right: 'flex-end',
        center: 'center'
    }
}

const V_ALIGN = {
    horizontal: {
        top: 'flex-start',
        bottom: 'flex-end',
        center: 'center'
    },
    vertical: {
        top: 'flex-start',
        bottom: 'flex-end',
        center: 'center'
    }
}

export function useLayoutPropsValue(props: LayoutProps, isHorizontal: boolean) {
    const {
        hAlign,
        vAlign,
        mT,
        mL,
        mR,
        mB,
        m,
        pT,
        pL,
        pR,
        pB,
        p,
        w,
        h,
        r,
        rTL,
        rTR,
        rBL,
        rBR,
        overflow,
        backgroundColor,
        color,
        position,
        top,
        left,
        right,
        bottom,
        style: propsStyle,
        ...properties
    } = props;
    const propsStyleString = JSON.stringify(propsStyle);
    const style = useMemo(() => {
        const propsStyle = JSON.parse(propsStyleString);
        const justifyContent = hAlign === undefined ? hAlign : (isHorizontal ? H_ALIGN.horizontal : H_ALIGN.vertical)[hAlign];
        const alignItems = vAlign === undefined ? vAlign : (isHorizontal ? V_ALIGN.horizontal : V_ALIGN.vertical)[vAlign];
        const localStyle: CSSProperties = {};
        localStyle.display = 'flex';
        localStyle.flexDirection = isHorizontal ? 'row' : 'column';
        localStyle.boxSizing = 'border-box';
        localStyle.margin = m;
        localStyle.marginTop = mT;
        localStyle.marginLeft = mL;
        localStyle.marginRight = mR;
        localStyle.marginBottom = mB;
        localStyle.padding = p;
        localStyle.paddingTop = pT;
        localStyle.paddingLeft = pL;
        localStyle.paddingRight = pR;
        localStyle.paddingBottom = pB;
        localStyle.width = w;
        localStyle.height = h;
        localStyle.justifyContent = justifyContent;
        localStyle.alignItems = alignItems;
        localStyle.overflow = overflow;
        localStyle.borderRadius = r;
        localStyle.borderTopLeftRadius = rTL;
        localStyle.borderTopRightRadius = rTR;
        localStyle.borderBottomLeftRadius = rBL;
        localStyle.borderBottomRightRadius = rBR;
        localStyle.backgroundColor = backgroundColor;
        localStyle.position = position;
        localStyle.top = top;
        localStyle.left = left;
        localStyle.right = right;
        localStyle.bottom = bottom;
        localStyle.color = color;
        // cleanup undefined and null
        Object.keys(localStyle).forEach(key => {
            if (localStyle[key] === undefined || localStyle[key] === null) {
                delete localStyle[key];
            }
        });
        return {...localStyle, ...propsStyle};
    }, [hAlign,
        vAlign,
        mT,
        mL,
        mR,
        mB,
        m,
        pT,
        pL,
        pR,
        pB,
        p,
        w,
        h,
        r,
        rTL,
        rTR,
        rBL,
        rBR,
        overflow,
        backgroundColor,
        position,
        top,
        left,
        right,
        bottom, color, propsStyleString]);
    return {style, properties};
}
