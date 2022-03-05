import Vertical from "../layout/Vertical";
import Horizontal from "../layout/Horizontal";
import Sheet, {Column} from "./Sheet";
import {ObserverValue, useObserver, useObserverValue} from "react-hook-useobserver";
import React, {FC, MouseEvent as ReactMouseEvent, useCallback, useRef} from "react";
import {Observer} from "react-hook-useobserver/lib/useObserver";

interface GridProps {
    data: Array<any>,
    columns: Array<Column>
}

interface HeaderCellProps {
    index: number,
    column: Column,
    onCellResize: (width: number) => void,
    $customColWidth : Observer<Map<number,number>>
}
const HANDLER_WIDTH = 7;
const HeaderCell: FC<HeaderCellProps> = ({index, column,$customColWidth, onCellResize}) => {
    const mousePositionRef = useRef({currentX: 0, nextX: 0, dragActive: false});
    const handlerRightRef = useRef(defaultDif);
    const containerRef = useRef(defaultDif);
    const customCellWidth:any = useObserverValue($customColWidth,() => $customColWidth.current.get(index));
    const handleDrag = useCallback((event: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        mousePositionRef.current.currentX = event.clientX;
        mousePositionRef.current.dragActive = true;
        let cellWidth = 0;

        function closeDragElement() {
            mousePositionRef.current.dragActive = false;
            document.removeEventListener('mouseup', closeDragElement);
            document.removeEventListener('mousemove', onElementDrag);
            onCellResize(cellWidth + (Math.ceil(0.5 * HANDLER_WIDTH)));
        }

        function onElementDrag(event: MouseEvent) {
            event.preventDefault();
            if (!mousePositionRef.current.dragActive) {
                return;
            }
            if(event.clientX <= containerRef.current.offsetLeft){
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
    return <Vertical ref={containerRef} key={index} style={{
        padding: 10,
        borderRight: '1px solid #CCC',
        width: customCellWidth,
        boxSizing: 'border-box',
        flexShrink: 0,
        flexGrow: 0,
        position: 'relative'
    }}>
        {column.field}
        <Vertical ref={handlerRightRef} style={{
            height: '100%',
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0,0.1)',
            width: HANDLER_WIDTH,
            left: column.width - Math.ceil(0.5 * HANDLER_WIDTH),
            zIndex: 1,
            top: 0,
            boxSizing: 'border-box',
            cursor: 'col-resize'
        }} onMouseDown={handleDrag}/>
    </Vertical>;
}
const defaultDif = document.createElement('div');

export default function Grid({data, columns}: GridProps) {
    const headerContainerRef = useRef(defaultDif);
    const [$customColWidth, setCustomColWidth] = useObserver(new Map<number, number>(columns.map((col, index) => [index, col.width])));
    const [$customRowHeight,setCustomRowHeight] = useObserver(new Map<number,number>());
    return <Vertical style={{padding: '1rem', height: '100%', width: '100%'}}>
        <Vertical ref={headerContainerRef} style={{overflow: 'hidden'}}>
            <Horizontal>
                {columns.map((column, index) => {
                    return <HeaderCell column={column} index={index} key={index} $customColWidth={$customColWidth} onCellResize={(width) => {
                        setCustomColWidth(oldVal => {
                            const newVal = new Map(oldVal);
                            newVal.set(index, width);
                            return newVal;
                        })

                    }}/>
                })}
            </Horizontal>
        </Vertical>
        <ObserverValue observers={$customColWidth} render={() => {
            return <Sheet data={data} columns={columns}
                          $customColWidth={$customColWidth}
                          $customRowHeight={$customRowHeight}
                          onScroll={({ scrollLeft}) => headerContainerRef.current.scrollLeft = scrollLeft}
            />
        }}/>

    </Vertical>
}