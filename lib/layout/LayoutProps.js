var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { useMemo } from "react";
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
};
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
};
export function useLayoutPropsValue(props, isHorizontal) {
    const { hAlign, vAlign, mT, mL, mR, mB, m, pT, pL, pR, pB, p, w, h, r, rTL, rTR, rBL, rBR, overflow, backgroundColor, color, position, top, left, right, bottom, style: propsStyle } = props, properties = __rest(props, ["hAlign", "vAlign", "mT", "mL", "mR", "mB", "m", "pT", "pL", "pR", "pB", "p", "w", "h", "r", "rTL", "rTR", "rBL", "rBR", "overflow", "backgroundColor", "color", "position", "top", "left", "right", "bottom", "style"]);
    const propsStyleString = JSON.stringify(propsStyle);
    const style = useMemo(() => {
        const propsStyle = JSON.parse(propsStyleString);
        const justifyContent = hAlign === undefined ? hAlign : (isHorizontal ? H_ALIGN.horizontal : H_ALIGN.vertical)[hAlign];
        const alignItems = vAlign === undefined ? vAlign : (isHorizontal ? V_ALIGN.horizontal : V_ALIGN.vertical)[vAlign];
        const localStyle = {};
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
        return Object.assign(Object.assign({}, localStyle), propsStyle);
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
    return { style, properties };
}
//# sourceMappingURL=LayoutProps.js.map