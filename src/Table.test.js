import React from 'react';
// import { render } from '@testing-library/react';
import Enzyme, { shallow, render, mount } from 'enzyme';

import Table from './Table';


it("renders table correctly", () => {
    const data = [{
        "one": "1",
        "two": "2",
        "three": "3"
    }];
    const cols = [
        { header: "One", mapping: "one"},
        { header: "Two", mapping: "two"},
        { header: "Three", mapping: "three"}
    ];

    const container = mount(<Table cols={cols} rows={data} />);
    const table = container.find('table');

    // There should be only 1 table
    expect(table).toHaveLength(1);

    const thead = table.find('thead');
    expect(thead).toHaveLength(1);

    // The number of th tags should be equal to number of columns
    const headers = thead.find('th');
    expect(headers).toHaveLength(cols.length);

    // Each th tag text should equal to column header
    headers.forEach((th, idx) => {
        expect(th.text()).toEqual(cols[idx].header);
    });

    // Check table body
    const tbody = table.find('tbody');
    expect(tbody).toHaveLength(1);

    const rows = tbody.find('tr');
    expect(rows).toHaveLength(data.length);

    rows.forEach((tr, rowId) => {
        const cells = tr.find('td');
        expect(cells).toHaveLength(cols.length);
        expect(cells.at(0).text()).toEqual(data[rowId].one);
        expect(cells.at(1).text()).toEqual(data[rowId].two);
        expect(cells.at(2).text()).toEqual(data[rowId].three);
    });
});

it("ignores invalid data mapping", () => {
    const data = [{
        "one": "1",
        "two": "2",
        "three": "3"
    }];
    const cols = [
        { header: "One", mapping: "one"},
        { header: "Two", mapping: "two"},
        { header: "Three", mapping: "tree"}
    ];

    const container = mount(<Table cols={cols} rows={data} />);
    const table = container.find('table');
    const tbody = table.find('tbody');
    const rows = tbody.find('tr');

    rows.forEach((tr, rowId) => {
        const cells = tr.find('td');
        expect(cells.at(2).text()).toEqual("");
    });
});
