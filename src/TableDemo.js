import React from 'react';
import _ from 'lodash';
import Table from './Table'

let chunkSize = 20;

let testData = [{
    "gender": "male",
    "name": {
        "title": "mr",
        "first": "brad",
        "last": "gibson"
    },
    "location": {
        "street": "9278 new road",
        "city": "kilcoole",
        "state": "waterford",
        "postcode": "93027",
        "coordinates": {
            "latitude": "20.9267",
            "longitude": "-7.9310"
        },
        "timezone": {
        "offset": "-3:30",
        "description": "Newfoundland"
        }
    },
    "email": "brad.gibson@example.com",
    "login": {
        "uuid": "155e77ee-ba6d-486f-95ce-0e0c0fb4b919",
        "username": "silverswan131",
        "password": "firewall",
        "salt": "TQA1Gz7x",
        "md5": "dc523cb313b63dfe5be2140b0c05b3bc",
        "sha1": "7a4aa07d1bedcc6bcf4b7f8856643492c191540d",
        "sha256": "74364e96174afa7d17ee52dd2c9c7a4651fe1254f471a78bda0190135dcd3480"
    },
    "dob": {
        "date": "1993-07-20T09:44:18.674Z",
        "age": 26
    },
    "registered": {
        "date": "2002-05-21T10:59:49.966Z",
        "age": 17
    },
    "phone": "011-962-7516",
    "cell": "081-454-0666",
    "id": {
        "name": "PPS",
        "value": "0390511T"
    },
    "picture": {
        "large": "https://randomuser.me/api/portraits/men/75.jpg",
        "medium": "https://randomuser.me/api/portraits/med/men/75.jpg",
        "thumbnail": "https://randomuser.me/api/portraits/thumb/men/75.jpg"
    },
    "nat": "IE"
    }
];

class TableDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            rows: []
        };
        this.loadAnotherChunk = this.loadAnotherChunk.bind(this);
    }

    componentDidMount() {
        // Configure data to display
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
        // for(let i = 0; i < chunkSize; i++) {
        //     testData.push(testData[0]);
        // }
        // this.setState({
        //     rows: testData
        // });


        fetch("https://randomuser.me/api/?results=" + chunkSize)
        .then(results => results.json())
        .then(data => {
            this.setState({
                rows: data.results
            });
        });
    }

    loadAnotherChunk() {
        // Add a new chunk of data to the existing data
        console.log("Loading more data...");
        fetch("https://randomuser.me/api/?results=" + chunkSize)
        .then(results => results.json())
        .then(data => {
            let newData = _.concat(this.state.rows, ...data.results);
            this.setState({
                rows: newData
            });
        });
    }

    render () {
        return (
            <Table cols={this.state.columns} rows={this.state.rows} chunkSize={chunkSize} onLazyLoad={this.loadAnotherChunk} />
        );
    }
}

export default TableDemo;
