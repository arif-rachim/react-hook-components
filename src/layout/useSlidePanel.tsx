import React, {useEffect, useMemo, useRef, useState} from "react";
import {ObserverValue, useObserver} from "react-hook-useobserver";
import {Observer} from "react-hook-useobserver/lib/useObserver";
import Vertical from "./Vertical";


interface PanelItem {
    panel: JSX.Element,
    onOpenClose: (listener: (isOpen: boolean) => void) => () => void,
    setOpen: (isOpen: boolean) => void,
    animation: 'top' | 'bottom' | 'left' | 'right',
    overlayHidden: boolean
}

const emptyDiv = document.createElement('div');
const animationDuration = 300;

function SlidePanelChild(props: { index: number, $containerDimension: Observer<{ width: number; height: number }>, panel: PanelItem }) {
    const [showPanel, setShowPanel] = useState(false);
    const childContainerRef = useRef(emptyDiv);
    const animation = props.panel.animation;
    const style: any = {};
    const {height: childHeight, width: childWidth} = childContainerRef.current.getBoundingClientRect();

    if (animation === "top") {
        style.bottom = props.$containerDimension.current.height - (showPanel ? childHeight : 0);
        style.left = 0;
        style.transition = `bottom ${animationDuration}ms ease-in-out`;
        style.justifyContent = 'flex-end';
    }
    if (animation === "bottom") {
        style.top = props.$containerDimension.current.height - (showPanel ? childHeight : 0);
        style.left = 0;
        style.transition = `top ${animationDuration}ms ease-in-out`;
        style.justifyContent = 'flex-start';
    }
    if (animation === "left") {
        style.top = 0;
        style.left = props.$containerDimension.current.width - (showPanel ? childWidth : 0);
        style.transition = `left ${animationDuration}ms ease-in-out`;
        style.alignItems = 'flex-start';
    }
    if (animation === "right") {
        style.top = 0;
        style.right = props.$containerDimension.current.width - (showPanel ? childWidth : 0);
        style.transition = `right ${animationDuration}ms ease-in-out`;
        style.alignItems = 'flex-end';
    }
    useEffect(() => {
        const panel = props.panel;
        const removeOnPanelOpen = panel.onOpenClose((isOpen: boolean) => {
            setShowPanel(isOpen);
        });
        panel.setOpen(true);
        return () => {
            removeOnPanelOpen();
        }
    }, []);

    return <Vertical style={{
        position: 'absolute',
        boxSizing: 'border-box',
        overflow: 'auto', ...props.$containerDimension.current, ...style
    }}>
        <Vertical ref={childContainerRef}>
            {props.panel.panel}
        </Vertical>
    </Vertical>;
}

export type ShowPanelType = (close: (result: any) => void, containerDimension: { width: number, height: number }) => JSX.Element;
export type ShowPanelCallback = (constructor: ShowPanelType, config?: ConfigType) => Promise<any>;
export type AnimationType = 'top' | 'bottom' | 'left' | 'right';

export interface ConfigType {
    animation?: AnimationType,
    overlayHidden?: boolean
}
function OverlayPanel(props:{hasPanel: boolean, $containerDimension:Observer<{width:number,height:number}>}) {
    const domRef = useRef(emptyDiv);
    const hasPanel = props.hasPanel;

    useEffect(() => {

        if(hasPanel){
            domRef.current.style.zIndex = '0';
        }else{
            setTimeout(() => {
                domRef.current.style.zIndex = '-1';
            },animationDuration)
        }
    },[hasPanel]);
    return <Vertical ref={domRef} style={{
        backgroundColor: `rgba(0,0,0,${props.hasPanel ? 0.2 : 0})`, ...props.$containerDimension.current,
        top: 0,
        left: 0,
        position: 'absolute',
        transition: `background-color ${animationDuration - 100}ms ease-in-out`
    }}/>;
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
export function useSlidePanel(): { showPanel: ShowPanelCallback; SlidePanel: React.FC<React.HTMLAttributes<HTMLDivElement>> } {


    const [$panels, setPanels] = useObserver<Array<PanelItem>>([]);
    const [$containerDimension, setContainerDimension] = useObserver({width: 0, height: 0});
    const containerRef = useRef(emptyDiv);
    return useMemo(() => {
        function showPanel(constructor: ShowPanelType, config: ConfigType = {animation: "top", overlayHidden: false}) {
            return new Promise((resolve) => {

                let panelOpenListeners: Array<(isOpen: boolean) => void> = [];

                function setOpen(isOpen: boolean) {
                    panelOpenListeners.forEach(value => {
                        value(isOpen);
                    })
                }

                function onOpenClose(listener: (isOpen: boolean) => void) {
                    panelOpenListeners.push(listener);
                    return () => {
                        panelOpenListeners = panelOpenListeners.filter(l => l !== listener);
                    }
                }

                const {width, height} = containerRef.current.getBoundingClientRect();
                const Panel = constructor((result: any) => {
                    setOpen(false);
                    setTimeout(() => {
                        resolve(result);
                        setPanels((old: Array<PanelItem>) => {
                            return old.filter(p => p.panel !== Panel);
                        })
                    }, animationDuration);
                }, {width, height});

                setPanels((old: Array<PanelItem>) => {

                    const panelObject: PanelItem = {
                        panel: Panel,
                        onOpenClose,
                        setOpen,
                        animation: config.animation || 'top',
                        overlayHidden: config.overlayHidden || false
                    };
                    return [...old, panelObject]
                })
            })
        }

        function SlidePanel(props: React.HTMLAttributes<HTMLDivElement>) {
            const {style, ...properties} = props;
            useEffect(() => {
                const {width, height} = containerRef.current.getBoundingClientRect();
                setContainerDimension({width, height});
            }, []);
            return <Vertical ref={containerRef} style={{
                backgroundColor: 'rgba(0,0,0,0.1)',
                position: 'relative',
                overflow: 'hidden',
                boxSizing: 'border-box',
                ...style
            }} {...properties}>
                {props.children}

                <ObserverValue observers={[$panels, $containerDimension]} render={() => {
                    const hasPanel = $panels.current.length > 0;
                    const lastPanel = $panels.current[$panels.current.length-1];
                    const overlayHidden = lastPanel?.overlayHidden;
                    return <>
                        {!overlayHidden &&
                        <OverlayPanel hasPanel={hasPanel} $containerDimension={$containerDimension} />
                        }
                        {$panels.current.map((panel, index) => {
                            return <SlidePanelChild key={index} index={index} $containerDimension={$containerDimension}
                                                    panel={panel}/>
                        })}
                    </>
                }}/>
            </Vertical>;
        }

        return {showPanel, SlidePanel};
    }, []);
}