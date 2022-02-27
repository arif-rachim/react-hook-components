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
 * Flexbox Horizontal
 */
export default React.forwardRef(function Horizontal(props, ref) {
    const { children, vAlign, hAlign, style } = props, properties = __rest(props, ["children", "vAlign", "hAlign", "style"]);
    const justifyContent = { left: 'flex-start', right: 'flex-end', center: 'center' }[hAlign];
    const alignItems = { top: 'flex-start', bottom: 'flex-end', center: 'center' }[vAlign];
    return React.createElement("div", Object.assign({ ref: ref, style: Object.assign({ display: 'flex', flexDirection: 'row', justifyContent,
            alignItems }, style) }, properties), children);
});
//# sourceMappingURL=Horizontal.js.map