import {CSSProperties, HTMLAttributes, useMemo} from "react";
import {calculateBrightness} from "../utils";

export interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
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
    backgroundBrightness?: number;
    backgroundOpacity?: number;
    color?: string;
    position?: "absolute" | "fixed" | "relative" | "static" | "sticky";
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
}

const JUSTIFY_CONTENT = {
    left: 'flex-start',
    right: 'flex-end',
    center: 'center'
}

const ALIGN_ITEMS ={
    top: 'flex-start',
    bottom: 'flex-end',
    center: 'center'
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
        backgroundBrightness,
        backgroundOpacity,
        color,
        position,
        top,
        left,
        right,
        bottom,
        style: propsStyle,
        ...properties
    } = props;

    const propsStyleString = JSON.stringify(propsStyle ?? {});

    const style = useMemo(() => {
        const propsStyle: any = JSON.parse(propsStyleString);
        const justifyContent = hAlign === undefined ? hAlign : JUSTIFY_CONTENT[hAlign];
        const alignItems = vAlign === undefined ? vAlign : ALIGN_ITEMS[vAlign];
        const localStyle: any & CSSProperties = {};
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
        localStyle.justifyContent = isHorizontal ? justifyContent : alignItems;
        localStyle.alignItems = isHorizontal ? alignItems : justifyContent;
        localStyle.overflow = overflow;
        localStyle.borderRadius = r;
        localStyle.borderTopLeftRadius = rTL;
        localStyle.borderTopRightRadius = rTR;
        localStyle.borderBottomLeftRadius = rBL;
        localStyle.borderBottomRightRadius = rBR;
        localStyle.backgroundColor = backgroundColor ? calculateBrightness(backgroundColor, backgroundBrightness || 0, backgroundOpacity || 1) : backgroundColor;
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
        backgroundBrightness,
        backgroundOpacity,
        position,
        top,
        left,
        right,
        bottom, color, propsStyleString]);
    return {style, properties};
}
