import React, {CSSProperties, ReactElement, useEffect, useRef, useState} from "react";
import {useObserver, useObserverListener} from "react-hook-useobserver";

interface CalculateBeforeViewPort {
    index: number,
    totalLength: number,
    complete: false
}

interface CalculateInsideViewPort {
    index: number,
    totalLength: number,
    complete: boolean,
    lengths: Map<number, number>
}

interface SheetProperties {
    data: [],
    columns: [],
    styleContainer?: CSSProperties,
    styleViewPort?: CSSProperties,
    columnsLength?: Map<number, number>,
    rowsLength?: Map<number, number>
}

interface CellRendererProps {
    height: number,
    width: number,
    top: number,
    left: number,
    rowIndex: number,
    colIndex: number,
    style?: CSSProperties
}


interface RowAccumulator {
    elements: Array<ReactElement>,
    top: number
}

interface ColAccumulator {
    elements: Array<ReactElement>,
    left: number
}

interface RenderComponentProps {
    numberOfRowInsideViewPort: CalculateInsideViewPort,
    numberOfRowBeforeViewPort: CalculateBeforeViewPort,
    numberOfColInsideViewPort: CalculateInsideViewPort,
    numberOfColBeforeViewPort: CalculateBeforeViewPort,
    setElements: React.Dispatch<React.SetStateAction<React.ReactElement<any, string | React.JSXElementConstructor<any>>[]>>
}

const defaultDom = document.createElement('div');

export default function Sheet(props: SheetProperties) {
    const columnsLength = props.columnsLength || new Map<number, number>();
    const rowsLength = props.rowsLength || new Map<number, number>();
    const [$defaultRowHeight,] = useObserver(20);
    const [$defaultColWidth,] = useObserver(70);
    const [$customRowHeight,] = useObserver(rowsLength);
    const [$customColWidth,] = useObserver(columnsLength);
    const [$viewPortDimension, setViewPortDimension] = useObserver({width: 0, height: 0});
    const [$scrollerPosition, setScrollerPosition] = useObserver({left: 0, top: 0});
    const [elements, setElements] = useState([] as Array<ReactElement>);

    const [$totalWidthOfContent, setTotalWidthOfContent] = useObserver(calculateLength($customColWidth.current, props.columns, $defaultColWidth.current));
    useObserverListener($customColWidth, () => setTotalWidthOfContent(calculateLength($customColWidth.current, props.columns, $defaultColWidth.current)));

    const [$totalHeightOfContent, setTotalHeightOfContent] = useObserver(calculateLength($customRowHeight.current, props.data, $defaultRowHeight.current));
    useObserverListener($customRowHeight, () => setTotalHeightOfContent(calculateLength($customRowHeight.current, props.data, $defaultRowHeight.current)));

    const viewPortRef = useRef(defaultDom);

    useEffect(() => {
        const viewPortDom = viewPortRef.current;
        const {offsetWidth, offsetHeight} = viewPortDom;
        setViewPortDimension({width: offsetWidth, height: offsetHeight});
        const onScroller = () => setScrollerPosition({left: viewPortDom.scrollLeft, top: viewPortDom.scrollTop});
        viewPortDom.addEventListener('scroll', onScroller);
        return function deregister() {
            viewPortDom.removeEventListener('scroll', onScroller);
        }
    }, []);

    useObserverListener([$viewPortDimension, $scrollerPosition, $defaultRowHeight, $defaultColWidth, $customRowHeight, $customColWidth], () => {

        const scrollerPosition = $scrollerPosition.current;
        const defaultRowHeight = $defaultRowHeight.current;
        const defaultColWidth = $defaultColWidth.current;
        const customRowHeight = $customRowHeight.current;
        const customColWidth = $customColWidth.current;

        const numberOfColBeforeViewPort: CalculateBeforeViewPort = calculateBeforeViewPort(props.columns, customColWidth, defaultColWidth, scrollerPosition.left);
        const numberOfColInsideViewPort: CalculateInsideViewPort = calculateInsideViewPort(props.columns, numberOfColBeforeViewPort.index, customColWidth, defaultColWidth, $viewPortDimension.current.width, scrollerPosition.left, numberOfColBeforeViewPort.totalLength);
        const numberOfRowBeforeViewPort: CalculateBeforeViewPort = calculateBeforeViewPort(props.data, customRowHeight, defaultRowHeight, scrollerPosition.top);
        const numberOfRowInsideViewPort: CalculateInsideViewPort = calculateInsideViewPort(props.data, numberOfRowBeforeViewPort.index, customRowHeight, defaultRowHeight, $viewPortDimension.current.height, scrollerPosition.top, numberOfRowBeforeViewPort.totalLength);

        renderComponent({
            numberOfRowInsideViewPort,
            numberOfRowBeforeViewPort,
            numberOfColInsideViewPort,
            numberOfColBeforeViewPort,
            setElements
        });
    });
    return <div ref={viewPortRef}
                style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'auto',
                    boxSizing: 'border-box', ...props.styleContainer
                }}>
        <div style={{
            width: $totalWidthOfContent.current,
            height: $totalHeightOfContent.current,
            boxSizing: 'border-box',
            backgroundColor: '#dddddd',
            position: 'relative', ...props.styleViewPort
        }}>
            {elements}
        </div>
    </div>
}

function calculateBeforeViewPort(columns: Array<any>, customLength: Map<number, number>, defaultLength: number, scrollerPosition: number): CalculateBeforeViewPort {
    return columns.reduce((acc, _, index) => {
        if (acc.complete) {
            return acc;
        }
        const length = customLength.has(index) ? customLength.get(index) : defaultLength;
        const nextLength = length + acc.totalLength;
        if (nextLength > scrollerPosition) {
            acc.complete = true;
            return acc;
        }
        acc.index = index + 1;
        acc.totalLength = nextLength;
        return acc;
    }, {index: 0, totalLength: 0, complete: false});
}


function calculateInsideViewPort(data: Array<any>, indexBeforeViewPort: number, customLength: Map<number, number>, defaultLength: number, viewPortLength: number, lengthBeforeViewPort: number, lengthLastIndexBeforeViewPort: number): CalculateInsideViewPort {
    return data.slice(indexBeforeViewPort).reduce<CalculateInsideViewPort>((acc, _, zeroIndex) => {
        if (acc.complete) {
            return acc;
        }

        const index = indexBeforeViewPort + zeroIndex;

        const length = customLength.has(index) ? customLength.get(index) : defaultLength;
        const nextLength = length + acc.totalLength;

        if ((nextLength + lengthLastIndexBeforeViewPort) > (viewPortLength + lengthBeforeViewPort)) {
            acc.lengths.set(index,length);
            acc.index = index;
            acc.totalLength = nextLength;
            acc.complete = true;
            return acc;
        }
        acc.lengths.set(index,length);
        acc.index = index;
        acc.totalLength = nextLength;
        return acc;
    }, {index: 0, totalLength: 0, complete: false, lengths: new Map<number, number>()} as CalculateInsideViewPort);
}

function calculateLength(customLength: Map<number, number>, data: Array<any>, defaultLength: number): number {
    const customLengthKeys = Array.from(customLength.keys());
    const totalCustomLength = customLengthKeys.reduce((acc, key) => acc + customLength.get(key), 0);
    const totalDefaultLength = (data.length - customLengthKeys.length) * defaultLength;
    return totalDefaultLength + totalCustomLength;
}

const CellRenderer = React.memo(function CellRenderer(props: CellRendererProps) {
    return <div
        style={{
            position: 'absolute',
            height: props.height,
            width: props.width,
            top: props.top,
            left: props.left,
            border: '1px solid #000',
            boxSizing: 'border-box',
            overflow: 'hidden',
            ...props.style
        }}>
        {`r:${props.rowIndex} c:${props.colIndex}`}
    </div>
});


function renderComponent({
                             numberOfRowInsideViewPort,
                             numberOfRowBeforeViewPort,
                             numberOfColInsideViewPort,
                             numberOfColBeforeViewPort,
                             setElements
                         }: RenderComponentProps): void {
    const {
        lengths: heightsOfRowInsideViewPort
    } = numberOfRowInsideViewPort;
    const {index: lastRowIndexBeforeViewPort, totalLength: totalHeightBeforeViewPort} = numberOfRowBeforeViewPort;

    const {
        lengths: widthsOfColInsideViewPort
    } = numberOfColInsideViewPort;
    const {index: lastColIndexBeforeViewPort, totalLength: totalWidthBeforeViewPort} = numberOfColBeforeViewPort;


    const {elements} = Array.from({length: heightsOfRowInsideViewPort.size }).reduce<RowAccumulator>((acc, _, rowIndexInsideViewPort) => {
        const rowIndex = lastRowIndexBeforeViewPort + rowIndexInsideViewPort;
        const rowHeight = heightsOfRowInsideViewPort.get(rowIndex);
        const {elements} = Array.from({length: widthsOfColInsideViewPort.size}).reduce<ColAccumulator>((colAcc, _, colIndexInsideViewPort) => {
            const colIndex = lastColIndexBeforeViewPort + colIndexInsideViewPort;
            const colWidth = widthsOfColInsideViewPort.get(colIndex);
            colAcc.elements.push(<CellRenderer key={`${rowIndex}-${colIndex}`} rowIndex={rowIndex} colIndex={colIndex}
                                               top={acc.top}
                                               width={colWidth}
                                               left={colAcc.left} height={rowHeight}/>);
            colAcc.left = colAcc.left + colWidth;
            return colAcc;
        }, {elements: [], left: totalWidthBeforeViewPort} as ColAccumulator);

        acc.top = acc.top + rowHeight;
        acc.elements = [...acc.elements, ...elements];
        return acc;
    }, {elements: [], top: totalHeightBeforeViewPort} as RowAccumulator);
    setElements(elements);
}