# react-reusable-table

A reusable React table component demonstrated using the https://randomuser.me/ API.

## Features

- Column sorting: ascending and descending
- Column resizing: resize by dragging a border in the header row
- Lazy loading: once the bottom of the page is reached, new chunk of data is loaded

## Usage

Clone the repo and then run `npm install` and `npm run start`.

## Example of the Table component usage

```
...

this.state = {
    columns: [
        { header: "First name", mapping: "name.first" },
        { header: "Last name", mapping: "name.last" },
        { header: "City", mapping: "location.city" },
        { header: "Email", mapping: "email" },
    ],
    data: [{
      "name": {
        "first": "brad",
        "last": "gibson"
      },
      "location": {
        "city": "kilcoole",
      },
      "email": "brad.gibson@example.com"
    }],
};

render () {
    return (
        <Table cols={this.state.columns} data={this.state.data} onLazyLoad={this.yourLazyLoadFunction} />
    );
}
```

`yourLazyLoadFunction` will fetch the data and update the `exampleColumns`.

For details, see [components/TableDemo.js](./components/TableDemo.js)

