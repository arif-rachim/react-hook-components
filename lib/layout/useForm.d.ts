import React from "react";
import { Dispatch, Initialization, SetObserverAction } from "react-hook-useobserver/lib";
import { Observer } from "react-hook-useobserver/lib/useObserver";
import { CleaveOptions } from "cleave.js/options";
import { ChangeEventHandler, InitHandler } from "cleave.js/react/props";
export declare const FormContext: React.Context<{
    setState: Dispatch<SetObserverAction<any>>;
    $state: Observer<any>;
    setErrors: Dispatch<SetObserverAction<Map<string, Array<string>>>>;
    $errors: Observer<Map<string, Array<string>>>;
    setTouched: Dispatch<SetObserverAction<Array<string>>>;
    $touched: Observer<Array<string>>;
    setModified: Dispatch<SetObserverAction<Array<string>>>;
    $modified: Observer<Array<string>>;
    addValidator: (validator: () => void) => () => void;
}>;
export declare function useForm<T>(initialState: Initialization<T>): {
    Form: (props: React.PropsWithChildren<{}>) => JSX.Element;
    $errors: Observer<Map<string, string[]>>;
    $touched: Observer<string[]>;
    $modified: Observer<string[]>;
    $state: Observer<T>;
    validateForm: () => boolean;
};
export interface ValidatorTypeProps {
    field: string;
    formState: any;
    formStateFieldValue: any;
    formStateFieldMappedValue: string;
    formTouched: Array<string>;
    formModified: Array<string>;
}
export declare type ValidatorType = (props: ValidatorTypeProps) => string | Array<string>;
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
export declare function Input(props: InputProps): JSX.Element;
