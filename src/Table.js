import React from 'react';
import _ from 'lodash';

import './Table.css';

function TableHeader(props) {
    return (
        <thead>
            <tr>
                {props.cols.map((col, id) => {
                    const sortClass = (col.sorting === 'asc') ? 
                                      'sortedAsc' : (col.sorting === 'desc' ?
                                      'sortedDesc' : '');
                    const classes = `sortBy ${sortClass}`;
                    return(
                        <th key={id}
                            className={classes}
                            style={{width: col.width}}
                            onClick={(e) => props.onSortClick(id, e)}>
                            {col.header}
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
            columns: [],
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
            const columns = nextProps.cols.map((c) => { 
                return { header: c.header, sorting: '', width: '' };
            });
            this.setState({
                columns: columns
            });
        }
    }

    prepareRow(rowData) {
        return this.props.cols.map(c => _.get(rowData, c.mapping));
    }

    sortBy(fieldId, e) {
        e.preventDefault();
        const fieldName = this.props.cols[fieldId].mapping;
        // console.log("Sorting by ", fieldName);

        let columns = this.state.columns.map((c) => {
            return { header: c.header, sorting: '', width: c.width };
        });
        console.log(columns);
        let sortedRows = [];

        // Clicking on the same field more times with toggle the sorting direction
        if (this.state.sortedField === fieldName) {
            columns[fieldId].sorting = this.state.sortDirection;
            sortedRows = _.orderBy(this.state.sortedRows, [fieldName], [columns[fieldId].sorting]);
            this.toggleSortDirection();
        } else {
            columns[fieldId].sorting = 'asc';
            sortedRows = _.orderBy(this.state.sortedRows, [fieldName], [columns[fieldId].sorting]);
            this.setState({
                sortDirection: 'desc'
            });
        }

        this.setState({
            sortedField: fieldName,
            sortedRows: sortedRows,
            columns: columns
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
        const columns = this.state.columns;
        return (
            <div>
            <table>
                <TableHeader cols={columns} onSortClick={this.sortBy}/>
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
