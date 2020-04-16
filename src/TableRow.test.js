import React from 'react';
// import { render } from '@testing-library/react';
import Enzyme, { shallow, render, mount } from 'enzyme';

import TableRow from './TableRow';


it("renders correctly", () => {
    const data = ["1", "2", "3"];

    const container = shallow(<TableRow id={1} data={data} />);
    
    const tr = container.find('tr');
    expect(tr).toHaveLength(1);

    const cells = tr.find('td');
    expect(cells).toHaveLength(data.length);
});

it("displays empty data as an empty cell", () => {
    const data = ["1", "2", ""];

    const container = shallow(<TableRow id={1} data={data} />);
    
    const tr = container.find('tr');
    expect(tr).toHaveLength(1);

    const cells = tr.find('td');
    expect(cells).toHaveLength(data.length);
    expect(cells.at(2).text()).toEqual("");

    cells.forEach((cell, id) => {
        expect(cell.text()).toEqual(data[id]);
    });
    
});
