import React from 'react';
// import { render } from '@testing-library/react';
import Enzyme, { shallow, render, mount } from 'enzyme';

import TableHeader from './TableHeader';


it("renders correctly", () => {
    const cols = [
        { header: "One", sorting: '', width: ''},
        { header: "Two", sorting: '', width: ''},
        { header: "Three", sorting: '', width: ''}
    ];

    const container = shallow(<TableHeader cols={cols}/>);
    
    const headers = container.find('.sortBy');
    expect(headers).toHaveLength(cols.length);

    headers.forEach((header, id) => {
        expect(header.text()).toEqual(cols[id].header);
    });
});

it("can display sort arrows", () => {
    const colsAsc = [
        { header: "One", sorting: 'asc', width: ''},
        { header: "Two", sorting: '', width: ''},
        { header: "Three", sorting: '', width: ''}
    ];

    const colsDesc = [
        { header: "One", sorting: '', width: ''},
        { header: "Two", sorting: 'desc', width: ''},
        { header: "Three", sorting: '', width: ''}
    ];

    const containerAsc = shallow(<TableHeader cols={colsAsc}/>);
    let sortedHeader = containerAsc.find('.sortedAsc');
    expect(sortedHeader).toHaveLength(1);
    expect(sortedHeader.text()).toEqual("One");

    const containerDesc = shallow(<TableHeader cols={colsDesc}/>);
    sortedHeader = containerDesc.find('.sortedDesc');
    expect(sortedHeader).toHaveLength(1);
    expect(sortedHeader.text()).toEqual("Two");
    
});

it("calls the sort function correctly", () => {
    const cols = [
        { header: "One", sorting: '', width: ''},
        { header: "Two", sorting: '', width: ''},
        { header: "Three", sorting: '', width: ''}
    ];

    const fakeSort = jest.fn();

    const container = shallow(<TableHeader cols={cols} onSortClick={fakeSort}/>);

    container.findWhere(node => {
        return(
            node.hasClass('sortBy') &&
            node.text() === "One"
        )
    }).simulate('click', { target: {} });
    expect(fakeSort).toHaveBeenCalled();
    expect(fakeSort).toHaveBeenCalledWith(expect.anything(), 0);

    container.findWhere(node => {
        return(
            node.hasClass('sortBy') &&
            node.text() === "Three"
        )
    }).simulate('click', { target: {} });
    expect(fakeSort).toHaveBeenCalled();
    expect(fakeSort).toHaveBeenCalledWith(expect.anything(), 2);
});

it("can set column width", () => {
    const cols = [
        { header: "One", sorting: '', width: '100'},
        { header: "Two", sorting: '', width: '150'},
        { header: "Three", sorting: '', width: '200'}
    ];

    const container = shallow(<TableHeader cols={cols} />);

    const headers = container.find('.headerCell');
    headers.forEach((header, id) => {
        let headerStyle = header.get(0).props.style;
        expect(headerStyle).toHaveProperty('width', cols[id].width + 'px');
    });
});
