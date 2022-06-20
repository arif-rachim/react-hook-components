"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = exports.useForm = exports.FormContext = void 0;
const react_1 = require("react");
const lib_1 = require("react-hook-useobserver/lib");
const react_2 = require("cleave.js/react");
exports.FormContext = (0, react_1.createContext)({
    $state: lib_1.emptyObserver,
    $errors: lib_1.emptyObserver,
    $modified: lib_1.emptyObserver,
    $touched: lib_1.emptyObserver,
    setErrors: lib_1.emptySetObserver,
    setModified: lib_1.emptySetObserver,
    setState: lib_1.emptySetObserver,
    setTouched: lib_1.emptySetObserver,
    addValidator: () => () => {
    }
});
function useForm(initialState) {
    const [$state, setState] = (0, lib_1.useObserver)(initialState);
    const [$errors, setErrors] = (0, lib_1.useObserver)(new Map());
    const [$touched, setTouched] = (0, lib_1.useObserver)([]);
    const [$modified, setModified] = (0, lib_1.useObserver)([]);
    const [$validators, setValidators] = (0, lib_1.useObserver)([]);
    return (0, react_1.useMemo)(() => {
        function addValidator(validator) {
            setValidators(old => [...old, validator]);
            return function removeValidator() {
                setValidators(old => old.filter(v => v !== validator));
            };
        }
        function validateForm() {
            $validators.current.forEach(validator => validator());
            return $errors.current.size === 0;
        }
        function Form(props) {
            return react_1.default.createElement(exports.FormContext.Provider, { value: {
                    $state,
                    setState,
                    $errors,
                    setErrors,
                    $touched,
                    setTouched,
                    $modified,
                    setModified,
                    addValidator
                } }, props.children);
        }
        return { Form, $errors, $touched, $modified, $state, validateForm };
    }, []);
}
exports.useForm = useForm;
function doNothing(val) {
    return val;
}
function toggleState(flag, setState, field) {
    setState((oldVal) => {
        const isIncluded = oldVal.includes(field);
        if (flag && !isIncluded) {
            return [...oldVal, field];
        }
        if (!flag && isIncluded) {
            return oldVal.filter(i => i !== field);
        }
        return oldVal;
    });
}
const defaultValidator = props => [];
function Input(props) {
    const context = (0, react_1.useContext)(exports.FormContext);
    let { valueMapper, valueConverter, validator } = props, properties = __rest(props, ["valueMapper", "valueConverter", "validator"]);
    valueMapper = valueMapper || doNothing;
    valueConverter = valueConverter || doNothing;
    validator = validator || defaultValidator;
    const propsRef = (0, react_1.useRef)({ valueMapper, valueConverter, validator });
    propsRef.current = { valueMapper, valueConverter, validator };
    const rawValue = (0, lib_1.useObserverValue)(context.$state, arg => {
        const state = context.$state.current || {};
        return state[props.field];
    });
    const stringValue = valueMapper(rawValue);
    function setModified(flag) {
        toggleState(flag, context.setModified, props.field);
    }
    function setTouched(flag) {
        toggleState(flag, context.setTouched, props.field);
    }
    (0, react_1.useEffect)(() => {
        function validateField() {
            const { valueMapper, validator } = propsRef.current;
            const rawValue = context.$state.current[props.field];
            const stringValue = valueMapper(rawValue);
            const errors = validator({
                field: props.field,
                formModified: context.$modified.current,
                formState: context.$state.current,
                formStateFieldMappedValue: stringValue,
                formStateFieldValue: rawValue,
                formTouched: context.$touched.current
            });
            setErrors(errors);
        }
        return context.addValidator(validateField);
    }, []);
    function setErrors(val) {
        context.setErrors((errors) => {
            const newError = new Map(errors);
            const isEmpty = val === undefined || val.length === 0;
            if (isEmpty && errors.has(props.field)) {
                newError.delete(props.field);
                return newError;
            }
            if (!isEmpty && !errors.has(props.field)) {
                if (typeof val === 'string') {
                    newError.set(props.field, [val]);
                    return newError;
                }
                if (Array.isArray(val)) {
                    newError.set(props.field, val);
                    return newError;
                }
            }
            return errors;
        });
    }
    function setValue(stringValue) {
        context.setState((oldVal) => {
            const value = propsRef.current.valueConverter(stringValue);
            return Object.assign(Object.assign({}, oldVal), { [props.field]: value });
        });
    }
    return react_1.default.createElement(react_2.default, Object.assign({}, properties, { options: props.options, value: stringValue, onChange: (e) => {
            const formStateFieldValue = e.target.value;
            const formStateFieldMappedValue = propsRef.current.valueMapper(formStateFieldValue);
            setModified(true);
            setTouched(true);
            const errors = propsRef.current.validator({
                field: props.field,
                formModified: context.$modified.current,
                formState: context.$state.current,
                formStateFieldMappedValue,
                formStateFieldValue,
                formTouched: context.$touched.current
            });
            setErrors(errors);
            setValue(e.target.value);
        }, style: props.style }));
}
exports.Input = Input;
//# sourceMappingURL=useForm.js.map