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
exports.useSlidePanel = void 0;
const React = require("react");
const react_1 = require("react");
const react_hook_useobserver_1 = require("react-hook-useobserver");
const Vertical_1 = require("./Vertical");
const emptyDiv = document.createElement('div');
const animationDuration = 300;
function SlidePanelChild(props) {
    const [showPanel, setShowPanel] = (0, react_1.useState)(false);
    const childContainerRef = (0, react_1.useRef)(emptyDiv);
    const animation = props.panel.animation;
    const style = {};
    const { height: childHeight, width: childWidth } = childContainerRef.current.getBoundingClientRect();
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
    (0, react_1.useEffect)(() => {
        const panel = props.panel;
        const removeOnPanelOpen = panel.onOpenClose((isOpen) => {
            setShowPanel(isOpen);
        });
        panel.setOpen(true);
        return () => {
            removeOnPanelOpen();
        };
    }, []);
    return React.createElement(Vertical_1.Vertical, { style: Object.assign(Object.assign({ position: 'absolute', boxSizing: 'border-box', overflow: 'auto' }, props.$containerDimension.current), style) },
        React.createElement(Vertical_1.Vertical, { ref: childContainerRef }, props.panel.panel));
}
function OverlayPanel(props) {
    const domRef = (0, react_1.useRef)(emptyDiv);
    const hasPanel = props.hasPanel;
    (0, react_1.useEffect)(() => {
        if (hasPanel) {
            domRef.current.style.zIndex = '0';
        }
        else {
            setTimeout(() => {
                domRef.current.style.zIndex = '-1';
            }, animationDuration);
        }
    }, [hasPanel]);
    return React.createElement(Vertical_1.Vertical, { ref: domRef, style: Object.assign(Object.assign({ backgroundColor: `rgba(0,0,0,${props.hasPanel ? 0.2 : 0})` }, props.$containerDimension.current), { top: 0, left: 0, position: 'absolute', transition: `background-color ${animationDuration - 100}ms ease-in-out` }) });
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
function useSlidePanel() {
    const [$panels, setPanels] = (0, react_hook_useobserver_1.useObserver)([]);
    const [$containerDimension, setContainerDimension] = (0, react_hook_useobserver_1.useObserver)({ width: 0, height: 0 });
    const containerRef = (0, react_1.useRef)(emptyDiv);
    return (0, react_1.useMemo)(() => {
        function showPanel(constructor, config = { animation: "top", overlayHidden: false }) {
            return new Promise((resolve) => {
                let panelOpenListeners = [];
                function setOpen(isOpen) {
                    panelOpenListeners.forEach(value => {
                        value(isOpen);
                    });
                }
                function onOpenClose(listener) {
                    panelOpenListeners.push(listener);
                    return () => {
                        panelOpenListeners = panelOpenListeners.filter(l => l !== listener);
                    };
                }
                const { width, height } = containerRef.current.getBoundingClientRect();
                const Panel = constructor((result) => {
                    setOpen(false);
                    setTimeout(() => {
                        resolve(result);
                        setPanels((old) => {
                            return old.filter(p => p.panel !== Panel);
                        });
                    }, animationDuration);
                }, { width, height });
                setPanels((old) => {
                    const panelObject = {
                        panel: Panel,
                        onOpenClose,
                        setOpen,
                        animation: config.animation || 'top',
                        overlayHidden: config.overlayHidden || false
                    };
                    return [...old, panelObject];
                });
            });
        }
        function SlidePanel(props) {
            const { style } = props, properties = __rest(props, ["style"]);
            (0, react_1.useEffect)(() => {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setContainerDimension({ width, height });
            }, []);
            return React.createElement(Vertical_1.Vertical, Object.assign({ ref: containerRef, overflow: "hidden", position: "relative", backgroundColor: 'rgba(0,0,0,0.1)', style: style }, properties),
                props.children,
                React.createElement(react_hook_useobserver_1.ObserverValue, { observers: [$panels, $containerDimension], render: () => {
                        const hasPanel = $panels.current.length > 0;
                        const lastPanel = $panels.current[$panels.current.length - 1];
                        const overlayHidden = lastPanel === null || lastPanel === void 0 ? void 0 : lastPanel.overlayHidden;
                        return React.createElement(React.Fragment, null,
                            !overlayHidden &&
                                React.createElement(OverlayPanel, { hasPanel: hasPanel, "$containerDimension": $containerDimension }),
                            $panels.current.map((panel, index) => {
                                return React.createElement(SlidePanelChild, { key: index, index: index, "$containerDimension": $containerDimension, panel: panel });
                            }));
                    } }));
        }
        return { showPanel, SlidePanel };
    }, []);
}
exports.useSlidePanel = useSlidePanel;
//# sourceMappingURL=useSlidePanel.js.map