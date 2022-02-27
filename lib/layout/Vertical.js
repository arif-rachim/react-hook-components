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
import React from "react";
/**
 * Flexbox Vertical
 */
export default React.forwardRef(function Vertical(props, ref) {
    const { children, vAlign, hAlign, style } = props, properties = __rest(props, ["children", "vAlign", "hAlign", "style"]);
    const alignItems = { left: 'flex-start', right: 'flex-end', center: 'center' }[hAlign];
    const justifyContent = { top: 'flex-start', bottom: 'flex-end', center: 'center' }[vAlign];
    return React.createElement("div", Object.assign({ ref: ref, style: Object.assign({ display: 'flex', flexDirection: 'column', justifyContent,
            alignItems }, style) }, properties), children);
});
//# sourceMappingURL=Vertical.js.map