import React from 'react';
import Draggable from 'react-draggable';

function TableHeader(props) {
    return (
        <thead>
            <tr>
                { props.cols.map((col, id) => {
                    const sortClass = (col.sorting === 'asc') ? 
                                      'sortedAsc' : (col.sorting === 'desc' ?
                                      'sortedDesc' : '');
                    const classes = `sortBy ${sortClass}`;
                    return(
                        <th key={id} className='headerCell' test-id='headerCell'
                            style={{ width: col.width + 'px' }}>
                            <div className={classes} test-id='sortBy' onClick={(e) => props.onSortClick(e, id)}>
                                {col.header}
                            </div>
                            <Draggable
                                axis='x'
                                scale={1}
                                position={{x: 0, y: 0}}
                                onStart={props.onResizeStart}
                                onDrag={(e) => props.onResizeDrag(e, id)}
                                onStop={props.onResizeStop}>
                                <div className='resizeHandle'></div>
                            </Draggable>
                        </th>
                    )
                })}
            </tr>
        </thead>
    );
}

export default TableHeader;
