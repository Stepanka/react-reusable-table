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
            sortedField: "",
            sortedRows: []
        }
        this.prepareRow = this.prepareRow.bind(this);
        this.sortBy = this.sortBy.bind(this);
    }
    componentDidMount() {
        console.log(this.props);// <-- empty
    }

    sortBy(fieldId, e) {
        e.preventDefault();
        let fieldName = this.props.cols[fieldId].mapping;
        console.log("Sorting by ", fieldName);
        let sortedRows = this.state.rows;
        sortedRows = _.orderBy(sortedRows, ['email'],['asc']);
        this.setState({
            sortedRows: sortedRows
        });
        console.log(sortedRows);
    }

    prepareRow(rowData) {
        return this.props.cols.map(c => _.get(rowData, c.mapping));
    }

    render () {
        const rows = this.state.sortedField === "" ? this.props.rows : this.state.sortedRows;

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
