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
import React, { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { emptyObserver, emptySetObserver, useObserver, useObserverValue } from "react-hook-useobserver/lib";
import Cleave from "cleave.js/react";
export const FormContext = createContext({
    $state: emptyObserver,
    $errors: emptyObserver,
    $modified: emptyObserver,
    $touched: emptyObserver,
    setErrors: emptySetObserver,
    setModified: emptySetObserver,
    setState: emptySetObserver,
    setTouched: emptySetObserver,
    addValidator: () => () => {
    }
});
export function useForm(initialState) {
    const [$state, setState] = useObserver(initialState);
    const [$errors, setErrors] = useObserver(new Map());
    const [$touched, setTouched] = useObserver([]);
    const [$modified, setModified] = useObserver([]);
    const [$validators, setValidators] = useObserver([]);
    return useMemo(() => {
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
            return React.createElement(FormContext.Provider, { value: {
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
export function Input(props) {
    const context = useContext(FormContext);
    let { valueMapper, valueConverter, validator } = props, properties = __rest(props, ["valueMapper", "valueConverter", "validator"]);
    valueMapper = valueMapper || doNothing;
    valueConverter = valueConverter || doNothing;
    validator = validator || defaultValidator;
    const propsRef = useRef({ valueMapper, valueConverter, validator });
    propsRef.current = { valueMapper, valueConverter, validator };
    const rawValue = useObserverValue(context.$state, arg => {
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
    useEffect(() => {
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
    return React.createElement(Cleave, Object.assign({}, properties, { options: props.options, value: stringValue, onChange: (e) => {
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
//# sourceMappingURL=useForm.js.map