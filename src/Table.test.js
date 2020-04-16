import React from 'react';
// import { render } from '@testing-library/react';
import Enzyme, { shallow, render, mount } from 'enzyme';

import Table from './Table';
import TableHeader from './TableHeader';
import TableRow from './TableRow';


it("renders correctly", () => {
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
    const header = table.find(TableHeader);
    expect(header).toHaveLength(1);
    const tbody = table.find('tbody');
    expect(tbody).toHaveLength(1);

    // Check number of TableRows - not working TODO
    // expect(container.find(TableRow)).toHaveLength(data.length);
    // expect(container.find('tbody').children().find(TableRow)).toHaveLength(data.length);

});

