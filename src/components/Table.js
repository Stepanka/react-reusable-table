import React from 'react';
import _ from 'lodash';

import TableHeader from './TableHeader';
import TableRow from './TableRow';

import './Table.css';


class Table extends React.Component {
    constructor(props) {
        super(props);
        this.minColWidth = 50;
        this.state = {
            sortedFieldId: null,
            columns: [],
            sortDirection: 'asc',
            sortedRows: [],
            isFetching: false
        }
        this.prepareRow = this.prepareRow.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.sortByFieldId =  this.sortByFieldId.bind(this);
        this.toggleSortDirection = this.toggleSortDirection.bind(this);
        this.onResizeStart = this.onResizeStart.bind(this);
        this.onResizeDrag = this.onResizeDrag.bind(this);
        this.onResizeStop = this.onResizeStop.bind(this);
        this.lazyLoadChunk = this.lazyLoadChunk.bind(this);
    }

    componentDidMount() {
        document.addEventListener('scroll', this.trackScrolling);
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.trackScrolling);
    }

    componentWillReceiveProps(nextProps) {
        // New row data
        if (nextProps.rows !== this.props.rows) {
            this.setState({
                sortedRows: nextProps.rows,
                isFetching: false
            });
            // If the data does not fill the whole page, automatically load more
            setTimeout(function() {
                this.trackScrolling();
            }.bind(this), 1000);

            // If sorting is on, turn it off
            if (this.state.sortedFieldId !== null) {
                this.state.sortedFieldId = null;
                const columns = this.state.columns.map((c) => { 
                    return { header: c.header, sorting: '', width: c.width };
                });
                this.setState({
                    columns: columns
                });
            }
        }
        // New columns data
        if (nextProps.cols !== this.props.cols) {
            const columns = nextProps.cols.map((c) => { 
                return { header: c.header, sorting: '', width: '150' };
            });
            this.setState({
                columns: columns
            });
        }
    }

    isBottom(el) {
        return el.getBoundingClientRect().bottom <= window.innerHeight;
    }

    trackScrolling = () => {
        const wrappedElement = document.getElementById('tableWrapper');
        if (this.isBottom(wrappedElement)) {
            console.log('Bottom reached');
            // Show loader and wait some time
            this.setState({
                isFetching: true
            });
            setTimeout(function() {
                this.lazyLoadChunk();
            }.bind(this), 1000);
        }
    }

    lazyLoadChunk() {
        console.log('Lazy load!');
        this.props.onLazyLoad();
        //document.removeEventListener('scroll', this.trackScrolling);
    }

    prepareRow(rowData) {
        return this.props.cols.map(c => _.get(rowData, c.mapping));
    }

    sortByFieldId(fieldId) {
        const fieldName = this.props.cols[fieldId].mapping;
        console.log('Sorting by ', fieldName);
        let sortedRows = [];
        let columns = this.state.columns.map((c) => {
            return { header: c.header, sorting: '', width: c.width };
        });

        // Clicking on the same field more times with toggle the sorting direction
        // But not after more data has been loaded
        if (this.state.sortedFieldId === fieldId) {
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
            sortedFieldId: fieldId,
            sortedRows: sortedRows,
            columns: columns
        });
    }

    handleSort(e, fieldId) {
        e.preventDefault();
        this.sortByFieldId(fieldId);
    }

    toggleSortDirection() {
        const newDir = this.state.sortDirection === 'asc' ? 'desc' : 'asc';
        this.setState({
            sortDirection: newDir
        });
    }

    onResizeStart(e, colId, width) {
        console.log('Resizing started!');
        console.log('initial width:', width);
    }

    onResizeDrag(e, colId) {
        console.log('Resizing in progress...');

        // The current cell will shrink/grow and its neighbor to the right will grow/shrink
        let newColumns = this.state.columns;
        
        if (colId < newColumns.length-1) {
            let newWidth = parseInt(newColumns[colId].width) + e.movementX;
            let newNeighborWidth = parseInt(newColumns[colId+1].width) - e.movementX;
            let widthTogether = parseInt(newColumns[colId].width) + parseInt(newColumns[colId+1].width);
            if (newWidth > this.minColWidth &&
                newNeighborWidth > this.minColWidth &&
                (newWidth + newNeighborWidth) <= widthTogether) {
                newColumns[colId].width = newWidth;
                newColumns[colId+1].width = newNeighborWidth;
                this.setState({
                    columns: newColumns
                });
            }
        }
    }

    onResizeStop() {
        console.log('Resizing completed!');
    }

    render () {
        const rows = this.state.sortedRows;
        const columns = this.state.columns;
        const resizeHandlers = {
            onResizeStart: this.onResizeStart,
            onResizeDrag: this.onResizeDrag,
            onResizeStop: this.onResizeStop
        };
        return (
            <div id='tableWrapper'>
            <table> 
                <TableHeader cols={columns} onSortClick={this.handleSort} {...resizeHandlers} />
                <tbody>
                    { rows.map((row, id) => {
                        const preparedRow = this.prepareRow(row);
                        return (
                            <TableRow key={id} id={id} data={preparedRow} />
                        )
                    })}
                </tbody>
            </table>
            { this.state.isFetching && <div id='loader'>Loading...</div> }
            </div>
        );
    }
}

export default Table;
