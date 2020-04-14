import React from 'react';
import _ from 'lodash';

import './Table.css';

function TableHeader(props) {
    return (
        <thead>
            <tr>
                {props.cols.map((col, id) =>
                    <th key={id} className="sortBy" onClick={(e) => props.onSortClick(id, e)}>
                        {col}
                    </th>
                )}
            </tr>
        </thead>
    );
}

function TableRow(props) {
    return (
        <tr className={ props.id % 2 !== 0 ? "darkRow" : "" }>
            {props.data.map((cell, id) =>
                <td key={id}>{cell}</td>
            )}
        </tr>
    );
}

function TableError(props) {
    return (
        <div className="tableError">
            {props.message}
        </div>
    );
}

class Table extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sortedField: '',
            sortDirection: 'asc',
            sortedRows: []
        }
        this.prepareRow = this.prepareRow.bind(this);
        this.sortBy = this.sortBy.bind(this);
        this.toggleSortDirection = this.toggleSortDirection.bind(this);
        this.setSortDirection = this.setSortDirection.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        // Any time input props.rows changes, update the state.sortedRows
        if (nextProps.rows !== this.props.rows) {
            this.setState({
                sortedRows: nextProps.rows
            });
        }
    }

    prepareRow(rowData) {
        return this.props.cols.map(c => _.get(rowData, c.mapping));
    }

    prepareRows() {
        const rows = this.props.rows.map((row, id) =>
            this.prepareRow(row)
        );
        this.setState({
            sortedRows: rows
        });
    }

    sortBy(fieldId, e) {
        e.preventDefault();
        const fieldName = this.props.cols[fieldId].mapping;
        console.log("Sorting by ", fieldName);
        console.log("Previous field: ", this.state.sortedField);
        // TODO redo this toggling! it shouldn't change all the time, just within one column
        this.toggleSortDirection();
        console.log(this.state.sortDirection);
        const sortedRows = _.orderBy(this.state.sortedRows, [fieldName], [this.state.sortDirection]);
        this.setState({
            sortedField: fieldName,
            sortedRows: sortedRows
        });
        console.log(sortedRows);
    }

    setSortDirection(val) {
        this.setState({
            sortDirection: val
        });
    }

    toggleSortDirection() {
        console.log("toggling");
        console.log("previous direction: ", this.state.sortDirection);
        const newDir = this.state.sortDirection === 'asc' ? 'desc' : 'asc';
        console.log("new direction: ", newDir);
        this.setState({
            sortDirection: newDir
        });
    }

    render () {
        // const rows = this.state.sortedField === "" ? this.props.rows : this.state.sortedRows;
        const rows = this.state.sortedRows;

        return (
            <div>
            <table>
                <TableHeader cols={this.props.cols.map(c => c.header)}
                             onSortClick={this.sortBy}/>
                <tbody>
                    { rows.map((row, id) =>
                        <TableRow key={id} id={id} data={this.prepareRow(row)} />
                    )}
                </tbody>
            </table>
            </div>
        );
    }
}

export default Table;
