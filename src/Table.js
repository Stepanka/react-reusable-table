import React from 'react';
import _ from 'lodash';

import './Table.css';

function TableHeader(props) {
    return (
        <thead>
            <tr>
                {props.cols.map((col, id) => {
                    const sortClass = (props.sortFields[id] === 'asc') ? 
                                      'sortedAsc' : (props.sortFields[id] === 'desc' ?
                                      'sortedDesc' : '');
                    const classes = `sortBy ${sortClass}`;
                    return(
                        <th key={id} className={classes} onClick={(e) => props.onSortClick(id, e)}>
                            {col}
                        </th>
                    )
                })}
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

class Table extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sortedColumn: '',
            sortFields: [],
            sortDirection: 'asc',
            sortedRows: []
        }
        this.prepareRow = this.prepareRow.bind(this);
        this.sortBy = this.sortBy.bind(this);
        this.toggleSortDirection = this.toggleSortDirection.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        // Any time input props.rows changes, update the state.sortedRows
        if (nextProps.rows !== this.props.rows) {
            this.setState({
                sortedRows: nextProps.rows
            });
        }
        if (nextProps.cols !== this.props.cols) {
            const sortFields = nextProps.cols.map(() => '');
            this.setState({
                sortFields: sortFields
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

        let sortFields= this.props.cols.map(() => '');
        let sortedRows = [];

        // Clicking on the same field more times with toggle the sorting direction
        if (this.state.sortedField === fieldName) {
            sortFields[fieldId] = this.state.sortDirection;
            sortedRows = _.orderBy(this.state.sortedRows, [fieldName], [sortFields[fieldId]]);
            this.toggleSortDirection();
        } else {
            sortFields[fieldId] = 'asc';
            sortedRows = _.orderBy(this.state.sortedRows, [fieldName], [sortFields[fieldId]]);
            this.setState({
                sortDirection: 'desc'
            });
        }

        this.setState({
            sortedField: fieldName,
            sortedRows: sortedRows,
            sortFields: sortFields
        });
    }

    toggleSortDirection() {
        const newDir = this.state.sortDirection === 'asc' ? 'desc' : 'asc';
        this.setState({
            sortDirection: newDir
        });
    }

    render () {
        const rows = this.state.sortedRows;

        return (
            <div>
            <table>
                <TableHeader cols={this.props.cols.map(c => c.header)}
                             onSortClick={this.sortBy} sortFields={this.state.sortFields}/>
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
