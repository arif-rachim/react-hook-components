
import Sheet, {CellComponentProps, Column} from "./Sheet";
import {ObserverValue, useObserver} from "react-hook-useobserver";
import {createContext, FC, MouseEvent as ReactMouseEvent, useCallback, useContext, useEffect, useRef} from "react";
import Vertical from "../layout/Vertical";
import Horizontal from "../layout/Horizontal";
import React from "react";

interface GridProps {
    data: Array<any>,
    columns: Array<Column>
}

const FIRST_COLUMN_WIDTH = 10;

const HANDLER_WIDTH = 7;
const HeaderCell: FC<CellComponentProps> = (props) => {
    const index = props.colIndex;
    const value = props.value;
    const column: any = props.column;

    const mousePositionRef = useRef({currentX: 0, nextX: 0, dragActive: false});
    const handlerRightRef = useRef(defaultDif);
    const containerRef = useRef(defaultDif);
    const {onCellResize} = useContext(GridContext);
    const handleDrag = useCallback((event: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        mousePositionRef.current.currentX = event.clientX;
        mousePositionRef.current.dragActive = true;
        let cellWidth = 0;

        function closeDragElement() {
            mousePositionRef.current.dragActive = false;
            document.removeEventListener('mouseup', closeDragElement);
            document.removeEventListener('mousemove', onElementDrag);
            onCellResize(index,cellWidth + (Math.ceil(0.5 * HANDLER_WIDTH)));
        }

        function onElementDrag(event: MouseEvent) {
            event.preventDefault();
            if (!mousePositionRef.current.dragActive) {
                return;
            }

            if (event.clientX <= containerRef.current.getBoundingClientRect().x) {
                return;
            }
            mousePositionRef.current.nextX = mousePositionRef.current.currentX - event.clientX;
            mousePositionRef.current.currentX = event.clientX;
            cellWidth = (handlerRightRef.current.offsetLeft - mousePositionRef.current.nextX);
            handlerRightRef.current.style.left = cellWidth + 'px';

        }

        document.addEventListener('mouseup', closeDragElement);
        document.addEventListener('mousemove', onElementDrag);

    }, []);
    useEffect(() => {
        handlerRightRef.current.style.left = `${containerRef.current.getBoundingClientRect().width - Math.ceil(0.5 * HANDLER_WIDTH)}px`;
    },[]);
    return <Vertical ref={containerRef} key={index} style={{
        padding: '3px 5px',
        borderRight: '1px solid #CCC',
        width: '100%',
        height:'100%',
        boxSizing:'border-box',
        flexShrink: 0,
        flexGrow: 0,
        position: 'relative'
    }}>
        {value}
        <Vertical ref={handlerRightRef} style={{
            height: '100%',
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0,0.5)',
            width: HANDLER_WIDTH,
            zIndex: 1,
            top: 0,
            boxSizing: 'border-box',
            cursor: 'col-resize'
        }} onMouseDown={handleDrag}/>
    </Vertical>;
}
const defaultDif = document.createElement('div');


interface GridContextProps {
    onCellResize: (colIndex: number, width: number) => void
}

function noOp() {
}

const GridContext = createContext<GridContextProps>({
    onCellResize: noOp
})

export default function Grid({data, columns}: GridProps) {

    const [$customColWidth, setCustomColWidth] = useObserver(new Map<number, number>(columns.map((col, index) => [index, col.width])));
    const [$customRowHeight, setCustomRowHeight] = useObserver(new Map<number, number>());
    const [$scrollLeft,setScrollLeft] = useObserver(0);
    const [$scrollTop,setScrollTop] = useObserver(0);
    const headerData = [columns.reduce((acc: any, column: Column, index: number) => {
        acc[column.field] = column.title;
        return acc;
    }, {})];
    return <Vertical style={{padding: '1rem', height: '100%', width: '100%'}}>
        <Horizontal >
            <Vertical style={{flexBasis: FIRST_COLUMN_WIDTH, flexShrink: 0, flexGrow: 0}}/>
            <Vertical style={{width: `calc(100% - ${FIRST_COLUMN_WIDTH}px)`}}>
                {/* we need to convert the columns into one row of data*/}
                <GridContext.Provider value={{
                    onCellResize: (index, width) => {
                        setCustomColWidth(oldVal => {
                            const newVal = new Map(oldVal);
                            newVal.set(index, width);
                            return newVal;
                        });
                    }
                }}>
                    <Sheet data={headerData}
                           columns={columns.map<Column>((c: Column, index: number) => ({...c,cellComponent: HeaderCell}))}
                           $customColWidth={$customColWidth}
                           $customRowHeight={$customRowHeight}
                           $scrollLeft={$scrollLeft}
                           showScroller={false}
                    />
                </GridContext.Provider>
            </Vertical>
        </Horizontal>
        <Horizontal style={{height: 'calc(100% - 40px)', width: '100%'}}>
            <Vertical style={{flexBasis: FIRST_COLUMN_WIDTH, flexShrink: 0, flexGrow: 0}}/>
            <Vertical style={{height: '100%', width: `calc(100% - ${FIRST_COLUMN_WIDTH}px)`}}>
                <ObserverValue observers={$customColWidth} render={() => {
                    return <Sheet data={data} columns={columns}
                                  $customColWidth={$customColWidth}
                                  $customRowHeight={$customRowHeight}
                                  onScroll={({scrollLeft,scrollTop}) => {
                                      setScrollLeft(scrollLeft);
                                      setScrollTop(scrollTop);
                                  }}
                    />
                }}/>
            </Vertical>
        </Horizontal>

    </Vertical>
}