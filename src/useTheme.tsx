import * as React from "react";
import {createContext} from "react";
import {
    Dispatch,
    emptyObserver,
    emptySetObserver,
    Observer,
    SetObserverAction,
    useObserver
} from "react-hook-useobserver";

export interface Theme{
    lightColor : string,
    darkColor : string
}

const defaultTheme:Theme = {
    darkColor : '#333',
    lightColor : '#ddd'
}

export const ThemeContext = createContext<[Observer<Theme>, Dispatch<SetObserverAction<Theme>>]>([emptyObserver,emptySetObserver]);

export function ThemeDataProvider(props:React.PropsWithChildren<any>){
    const themeContextValue = useObserver<Theme>(defaultTheme);
    return <ThemeContext.Provider value={themeContextValue}>
            {props.children}
        </ThemeContext.Provider>
}
