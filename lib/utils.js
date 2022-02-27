export function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
export function isNullOrUndefined(data) {
    return data === undefined || data === null;
}
//# sourceMappingURL=utils.js.map