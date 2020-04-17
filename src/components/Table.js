import React from 'react';
import _ from 'lodash';

import TableHeader from './TableHeader';
import TableRow from './TableRow';

import './Table.css';


class Table extends React.Component {
    constructor(props) {
        super(props);
        this.minColWidth = 50;
        this.tableWrapperRef = React.createRef();
        this.state = {
            rows: [],
            sortedRows: [],
            columns: [],
            sortedFieldId: null,
            nextSortDirection: 'asc',
            isFetching: false
        }
        this.prepareRow = this.prepareRow.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.sortByFieldId =  this.sortByFieldId.bind(this);
        this.setNextSortDirection = this.setNextSortDirection.bind(this);
        this.onResizeDrag = this.onResizeDrag.bind(this);
        this.loadDataIfAtTheBottom = this.loadDataIfAtTheBottom.bind(this);
        this.lazyLoadChunk = this.lazyLoadChunk.bind(this);
    }

    componentDidMount() {
        document.addEventListener('scroll', this.loadDataIfAtTheBottom);
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.loadDataIfAtTheBottom);
    }

    componentWillReceiveProps(nextProps) {
        // New row data
        if (nextProps.rows !== this.props.rows) {
            this.setState({
                sortedRows: nextProps.rows,
                isFetching: false
            });
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

    componentDidUpdate(prevProps, prevState) {
        // Row data has been loaded
        if (prevProps.rows !== this.props.rows) {
            this.loadDataIfAtTheBottom();

            // If sorting is on, turn it off
            if (this.state.sortedFieldId !== null) {
                const columns = this.state.columns.map((c) => { 
                    return { header: c.header, sorting: '', width: c.width };
                });
                this.setState({
                    columns: columns,
                    sortedFieldId: null
                });
            }
        }
      }

    isBottom(el) {
        return el.getBoundingClientRect().bottom <= window.innerHeight;
    }

    loadDataIfAtTheBottom() {
        const wrappedElement = this.tableWrapperRef.current;
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
        this.props.onLazyLoad();
    }

    prepareRow(rowData) {
        return this.props.cols.map(c => _.get(rowData, c.mapping));
    }

    handleSort(e, fieldId) {
        e.preventDefault();
        this.sortByFieldId(fieldId);
    }

    sortByFieldId(fieldId) {
        const fieldName = this.props.cols[fieldId].mapping;
        let sortedRows = [];
        let columns = this.state.columns.map((c) => {
            return { header: c.header, sorting: '', width: c.width };
        });

        // Clicking on the same field more times will toggle the sorting direction
        if (this.state.sortedFieldId === fieldId) {
            columns[fieldId].sorting = this.state.nextSortDirection;
            sortedRows = _.orderBy(this.state.sortedRows, [fieldName], [columns[fieldId].sorting]);
            this.setNextSortDirection();
        } else {
            columns[fieldId].sorting = 'asc';
            sortedRows = _.orderBy(this.state.sortedRows, [fieldName], [columns[fieldId].sorting]);
            this.setState({
                nextSortDirection: 'desc'
            });
        }

        this.setState({
            sortedFieldId: fieldId,
            sortedRows: sortedRows,
            columns: columns
        });
    }

    setNextSortDirection() {
        const newDir = this.state.nextSortDirection === 'asc' ? 'desc' : 'asc';
        this.setState({
            nextSortDirection: newDir
        });
    }

    onResizeDrag(e, colId) {
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

    render () {
        const rows = this.state.sortedRows;
        const columns = this.state.columns;
        const resizeHandlers = {
            onResizeDrag: this.onResizeDrag,
        };
        return (
            <div id='tableWrapper' ref={this.tableWrapperRef} >
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
