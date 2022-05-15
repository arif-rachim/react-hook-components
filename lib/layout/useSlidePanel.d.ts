import React from "react";
export declare type ShowPanelType = (close: (result: any) => void, containerDimension: {
    width: number;
    height: number;
}) => JSX.Element;
export declare type ShowPanelCallback = (constructor: ShowPanelType, config?: ConfigType) => Promise<any>;
export declare type AnimationType = 'top' | 'bottom' | 'left' | 'right';
export interface ConfigType {
    animation?: AnimationType;
    overlayHidden?: boolean;
}
/**
 * Hook to display slidePanel, the default implementation is slide panel from top to bottom.
 * eg:
 * const {showPanel,SlidePanel} = useSlidePanel();
 * function App(){
 *     return <SlidePanel>
 *         <div>My Panel</div>
 *         <button onClick={() => {
 *             const result = await showPanel((closePanel) => <MyPanel closePanel={closePanel} />)
 *         }}>Open Panel</button>
 *     </SlidePanel>
 * }
 */
export declare function useSlidePanel(): {
    showPanel: ShowPanelCallback;
    SlidePanel: React.FC<React.HTMLAttributes<HTMLDivElement>>;
};
