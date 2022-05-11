import React, {useEffect, useMemo, useRef, useState} from "react";
import {ObserverValue, useObserver} from "react-hook-useobserver";
import {Observer} from "react-hook-useobserver/lib/useObserver";
import Vertical from "./Vertical";

interface PanelItem {
    panel: JSX.Element,
    onOpenClose: (listener: (isOpen: boolean) => void) => () => void,
    setOpen: (isOpen: boolean) => void,
    animation : 'UP_DOWN' | 'DOWN_UP' | 'LEFT_RIGHT' | 'RIGHT_LEFT'
}

const emptyDiv = document.createElement('div');
const animationDuration = 300;

function SlidePanelChild(props: { index: number, $containerDimension: Observer<{ width: number; height: number }>, panel: PanelItem }) {
    const [showPanel, setShowPanel] = useState(false);
    const childContainerRef = useRef(emptyDiv);
    const animation = props.panel.animation;
    const style:any = {};
    const {height:childHeight,width:childWidth} = childContainerRef.current.getBoundingClientRect();

    if(animation === "UP_DOWN"){
        style.bottom = props.$containerDimension.current.height - (showPanel ? childHeight : 0);
        style.left =  0;
        style.transition = `bottom ${animationDuration}ms ease-in-out`;
        style.justifyContent = 'flex-end';
    }
    if(animation === "DOWN_UP"){
        style.top = props.$containerDimension.current.height - (showPanel ? childHeight : 0);
        style.left =  0;
        style.transition = `top ${animationDuration}ms ease-in-out`;
        style.justifyContent = 'flex-start';
    }
    if(animation === "LEFT_RIGHT"){
        style.top = 0;
        style.left = props.$containerDimension.current.width - (showPanel ? childWidth : 0);
        style.transition = `left ${animationDuration}ms ease-in-out`;
        style.alignItems = 'flex-start';
    }
    if(animation === "RIGHT_LEFT"){
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
        overflow: 'auto', ...props.$containerDimension.current,...style
    }}>
        <Vertical ref={childContainerRef}>
            {props.panel.panel}
        </Vertical>
    </Vertical>;
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
export function useSlidePanel(props:{animation : 'UP_DOWN' | 'DOWN_UP' | 'LEFT_RIGHT' | 'RIGHT_LEFT'}) {
    const animation = props.animation || 'UP_DOWN';
    const [$panels, setPanels] = useObserver<Array<PanelItem>>([]);
    const [$containerDimension, setContainerDimension] = useObserver({width: 0, height: 0});
    const containerRef = useRef(emptyDiv);
    return useMemo(() => {
        function showPanel(constructor: (close: (result: any) => void, containerDimension: { width: number, height: number }) => JSX.Element) {
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

                const Panel = constructor((result: any) => {
                    setOpen(false);
                    setTimeout(() => {
                        resolve(result);
                        setPanels((old: Array<PanelItem>) => {
                            return old.filter(p => p.panel !== Panel);
                        })
                    }, animationDuration);
                }, containerRef.current.getBoundingClientRect());

                setPanels((old: Array<PanelItem>) => {
                    const panelObject: PanelItem = {
                        panel: Panel,
                        onOpenClose,
                        setOpen,
                        animation
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
                border: '1px solid rgba(0,0,0,0.1)',
                position: 'relative',
                overflow: 'hidden',
                boxSizing: 'border-box',
                ...style
            }} {...properties}>
                {props.children}
                <ObserverValue observers={[$panels, $containerDimension]} render={() => {
                    return <>
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