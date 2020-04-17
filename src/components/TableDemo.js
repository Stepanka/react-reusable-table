import React from 'react';
import _ from 'lodash';
import Table from './Table'

class TableDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            data: [],
            chunkSize: 10
        };
        this.loadAnotherChunk = this.loadAnotherChunk.bind(this);
    }

    componentDidMount() {
        // Configure which data to display
        this.setState({
            columns: [
                { header: "Title", mapping: "name.title" },
                { header: "First name", mapping: "name.first" },
                { header: "Last name", mapping: "name.last" },
                { header: "Gender", mapping: "gender" },
                { header: "City", mapping: "location.city" },
                { header: "State", mapping: "location.state" },
                { header: "Postcode", mapping: "location.postcode" },
                { header: "Email", mapping: "email" },
            ]
        });

        // Load the first chunk
        fetch("https://randomuser.me/api/?results=" + this.state.chunkSize)
        .then(results => results.json())
        .then(data => {
            this.setState({
                data: data.results
            });
        });
    }

    loadAnotherChunk() {
        // Add a new chunk of data to the existing data
        fetch("https://randomuser.me/api/?results=" + this.state.chunkSize)
        .then(results => results.json())
        .then(data => {
            let newData = _.concat(this.state.data, ...data.results);
            this.setState({
                data: newData
            });
        });
    }

    render () {
        return (
            <Table cols={this.state.columns}
                   data={this.state.data}
                   onLazyLoad={this.loadAnotherChunk} />
        );
    }
}

export default TableDemo;
