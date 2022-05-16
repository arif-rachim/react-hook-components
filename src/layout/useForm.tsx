import React, {createContext, useContext, useEffect, useMemo, useRef} from "react";
import {
    Dispatch,
    emptyObserver,
    emptySetObserver,
    Initialization,
    SetObserverAction,
    useObserver,
    useObserverValue
} from "react-hook-useobserver/lib";
import {Observer} from "react-hook-useobserver/lib/useObserver";
import Cleave from "cleave.js/react";
import {CleaveOptions} from "cleave.js/options";
import {ChangeEventHandler, InitHandler} from "cleave.js/react/props";

export const FormContext = createContext<{
    setState: Dispatch<SetObserverAction<any>>;
    $state: Observer<any>;
    setErrors: Dispatch<SetObserverAction<Map<string, Array<string>>>>;
    $errors: Observer<Map<string, Array<string>>>;
    setTouched: Dispatch<SetObserverAction<Array<string>>>;
    $touched: Observer<Array<string>>;
    setModified: Dispatch<SetObserverAction<Array<string>>>;
    $modified: Observer<Array<string>>;
    addValidator: (validator: () => void) => () => void
}>({
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
    }
);


export function useForm<T>(initialState: Initialization<T>) {
    const [$state, setState] = useObserver<T>(initialState);
    const [$errors, setErrors] = useObserver<Map<string, Array<string>>>(new Map<string, Array<string>>());
    const [$touched, setTouched] = useObserver<Array<string>>([]);
    const [$modified, setModified] = useObserver<Array<string>>([]);
    const [$validators, setValidators] = useObserver<Array<() => void>>([]);
    return useMemo(() => {
        function addValidator(validator: () => void) {
            setValidators(old => [...old, validator]);
            return function removeValidator() {
                setValidators(old => old.filter(v => v !== validator));
            }
        }

        function validateForm() {
            $validators.current.forEach(validator => validator());
            return $errors.current.size === 0;
        }

        function Form(props: React.PropsWithChildren<{}>) {
            return <FormContext.Provider
                value={{
                    $state,
                    setState,
                    $errors,
                    setErrors,
                    $touched,
                    setTouched,
                    $modified,
                    setModified,
                    addValidator
                }}>
                {props.children}
            </FormContext.Provider>
        }

        return {Form, $errors, $touched, $modified, $state, validateForm};
    }, []);
}

function doNothing(val: any) {
    return val;
}

function toggleState(flag: boolean, setState: Dispatch<SetObserverAction<any>>, field: string) {
    setState((oldVal: Array<string>) => {
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

export interface ValidatorTypeProps {
    field: string,
    formState: any,
    formStateFieldValue: any,
    formStateFieldMappedValue: string,
    formTouched: Array<string>,
    formModified: Array<string>
}

export type ValidatorType = (props: ValidatorTypeProps) => string | Array<string>
const defaultValidator: ValidatorType = props => [];

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    field: string;
    onInit?: InitHandler | undefined;
    options: CleaveOptions;
    htmlRef?: ((i: any) => void) | undefined;
    onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
    valueMapper?: (value: any) => string;
    valueConverter?: (value: string) => any;
    validator?: ValidatorType;
}


export function Input(props: InputProps) {
    const context = useContext(FormContext);
    let {valueMapper, valueConverter, validator, ...properties} = props;
    valueMapper = valueMapper || doNothing;
    valueConverter = valueConverter || doNothing;
    validator = validator || defaultValidator;

    const propsRef = useRef({valueMapper, valueConverter, validator});
    propsRef.current = {valueMapper, valueConverter, validator};

    const rawValue = useObserverValue(context.$state, arg => {
        const state = context.$state.current || {};
        return state[props.field];
    })

    const stringValue = valueMapper(rawValue);

    function setModified(flag: boolean) {
        toggleState(flag, context.setModified, props.field);
    }

    function setTouched(flag: boolean) {
        toggleState(flag, context.setTouched, props.field);
    }

    useEffect(() => {
        function validateField() {
            const {valueMapper, validator} = propsRef.current;
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


    function setErrors(val: string | Array<string>) {
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

    function setValue(stringValue: string) {
        context.setState((oldVal: any) => {
            const value = propsRef.current.valueConverter(stringValue);
            return {...oldVal, [props.field]: value}
        });
    }

    return <Cleave {...properties} options={props.options} value={stringValue} onChange={(e) => {
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
    }} style={props.style}/>
}