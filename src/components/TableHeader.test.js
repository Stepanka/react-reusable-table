import React from 'react';
// import { render } from '@testing-library/react';
import Enzyme, { shallow, render, mount } from 'enzyme';

import TableHeader from './TableHeader';

describe('Table Header Component', () => {

    it('renders correctly', () => {
        const cols = [
            { header: 'One', sorting: '', width: ''},
            { header: 'Two', sorting: '', width: ''},
            { header: 'Three', sorting: '', width: ''}
        ];

        const container = shallow(<TableHeader cols={cols}/>);
        
        const headers = container.find('.sortBy');
        expect(headers).toHaveLength(cols.length);

        headers.forEach((header, id) => {
            expect(header.text()).toEqual(cols[id].header);
        });
    });

    it('can display an ascending sort arrow', () => {
        const cols = [
            { header: 'One', sorting: 'asc', width: ''},
            { header: 'Two', sorting: '', width: ''},
            { header: 'Three', sorting: '', width: ''}
        ];

        const container = shallow(<TableHeader cols={cols}/>);
        let sortedHeader = container.find('.sortedAsc');
        expect(sortedHeader).toHaveLength(1);
        expect(sortedHeader.text()).toEqual('One');
    });

    it('can display an descending sort arrow', () => {
        const cols = [
            { header: 'One', sorting: '', width: ''},
            { header: 'Two', sorting: 'desc', width: ''},
            { header: 'Three', sorting: '', width: ''}
        ];

        const container = shallow(<TableHeader cols={cols}/>);
        const sortedHeader = container.find('.sortedDesc');
        expect(sortedHeader).toHaveLength(1);
        expect(sortedHeader.text()).toEqual('Two');
        
    });

    it('calls the sort function correctly', () => {
        const cols = [
            { header: 'One', sorting: '', width: ''},
            { header: 'Two', sorting: '', width: ''},
            { header: 'Three', sorting: '', width: ''}
        ];

        const fakeSort = jest.fn();

        const container = shallow(<TableHeader cols={cols} onSortClick={fakeSort}/>);
        console.log(container.debug());

        const a = container.find(`[test-id='sortBy']`);
        expect(a).toHaveLength(3);

        container.findWhere(node => {
            return (
                node.text() === 'One' &&
                node.prop('test-id') === 'sortBy'
            )
        }).simulate('click', { target: {} });
        expect(fakeSort).toHaveBeenCalled();
        expect(fakeSort).toHaveBeenCalledWith(expect.anything(), 0);

        container.findWhere(node => {
            return (
                node.text() === 'Three' &&
                node.prop('test-id') === 'sortBy'
            )
        }).find(`[test-id='sortBy']`).simulate('click', { target: {} });
        expect(fakeSort).toHaveBeenCalled();
        expect(fakeSort).toHaveBeenCalledWith(expect.anything(), 2);
    });

    it('can set column width', () => {
        const cols = [
            { header: 'One', sorting: '', width: '100'},
            { header: 'Two', sorting: '', width: '150'},
            { header: 'Three', sorting: '', width: '200'}
        ];

        const container = shallow(<TableHeader cols={cols} />);

        const headers = container.find(`[test-id='headerCell']`);
        headers.forEach((header, id) => {
            let headerStyle = header.get(0).props.style;
            expect(headerStyle).toHaveProperty('width', cols[id].width + 'px');
        });
    });

});
