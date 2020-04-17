import React from 'react';
import { shallow } from 'enzyme';
import TableRow from './TableRow';

describe('Table Row Component', () => {

    it('renders correctly', () => {
        const data = ['1', '2', '3'];
        const container = shallow(<TableRow id={1} data={data} />);
        
        const tr = container.find('tr');
        expect(tr).toHaveLength(1);

        const cells = tr.find('td');
        expect(cells).toHaveLength(data.length);

        cells.forEach((cell, id) => {
            expect(cell.text()).toEqual(data[id]);
        });
    });

    it('displays empty data as an empty cell', () => {
        const data = ['1', '2', ''];
        const container = shallow(<TableRow id={1} data={data} />);
        
        const cells = container.find('td');
        expect(cells).toHaveLength(data.length);
        expect(cells.at(2).text()).toEqual('');
    });
    
});
