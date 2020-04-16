import React from 'react';

function TableRow(props) {
    return (
        <tr className={ props.id % 2 !== 0 ? "darkRow" : "" }>
            {props.data.map((cell, id) =>
                <td key={id}>{cell}</td>
            )}
        </tr>
    );
}

export default TableRow;