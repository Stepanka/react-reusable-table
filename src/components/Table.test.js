import React from 'react';
import {  mount } from 'enzyme';
import _ from 'lodash';
import Table from './Table';
import TableHeader from './TableHeader';
import TableRow from './TableRow';

describe('Table Component', () => {

    it('renders correctly', () => {
        const cols = [
            { header: 'One', mapping: 'one'},
            { header: 'Two', mapping: 'two'},
            { header: 'Three', mapping: 'three'}
        ];
        const data = [
            { 'one': '1', 'two': '2', 'three': '3' }
        ];

        const container = mount(<Table cols={cols} rows={data} />);
        const table = container.find('table');
        expect(table).toHaveLength(1);

        const header = table.find(TableHeader);
        expect(header).toHaveLength(1);
        const tbody = table.find('tbody');
        expect(tbody).toHaveLength(1);

        // Wait for the TableRow components to render
        setTimeout(() => {
            expect(container.find(TableRow)).toHaveLength(data.length);
        }, 1000);
    });

    it('is empty when given no data', () => {
        const cols = [];
        const data = [];

        const container = mount(<Table cols={cols} rows={data} />);
        const table = container.find('table');
        expect(table).toHaveLength(1);

        const header = table.find(TableHeader);
        expect(header).toHaveLength(1);
        const tbody = table.find('tbody');
        expect(tbody).toHaveLength(1);

        // Wait for the TableRow components to render
        setTimeout(() => {
            expect(container.find(TableRow)).toHaveLength(data.length);
        }, 1000);
    });

    it('calls the lazy load function when scrolled to the bottom', () => {
        const cols = [
            { header: 'One', mapping: 'one'},
            { header: 'Two', mapping: 'two'},
            { header: 'Three', mapping: 'three'}
        ];
        const row = { 'one': '1', 'two': '2', 'three': '3' };
        const data = _.times(20, row);
        const fakeLazyLoad = jest.fn();

        const container = mount(<Table cols={cols} rows={data} onLazyLoad={fakeLazyLoad}/>);
        
        const scrollEvent = new Event('scroll');
        container.first().getDOMNode().dispatchEvent(scrollEvent);
        
        // Wait for the 1s timeout in Table
        setTimeout(() => {
            expect(fakeLazyLoad).toHaveBeenCalled();
        }, 1500);
    });

    it('sorts the data correctly', () => {
        const cols = [
            { header: 'Letter', mapping: 'letter'},
            { header: 'Number', mapping: 'number'},
            { header: 'Name', mapping: 'name'}
        ];
        const data = [
            { 'letter': 'd', 'number': '2', 'name': 'Victor'},
            { 'letter': 'c', 'number': '1', 'name': 'Ulku'},
            { 'letter': 'b', 'number': '4', 'name': 'Flavie'},
            { 'letter': 'a', 'number': '3', 'name': 'Celina'}
        ];
        const expectedDataByLetter = [
            { 'letter': 'a', 'number': '3', 'name': 'Celina'},
            { 'letter': 'b', 'number': '4', 'name': 'Flavie'},
            { 'letter': 'c', 'number': '1', 'name': 'Ulku'},
            { 'letter': 'd', 'number': '2', 'name': 'Victor'},
        ];
        const expectedDataByNumber = [
            { 'letter': 'c', 'number': '1', 'name': 'Ulku'},
            { 'letter': 'd', 'number': '2', 'name': 'Victor'},
            { 'letter': 'a', 'number': '3', 'name': 'Celina'},
            { 'letter': 'b', 'number': '4', 'name': 'Flavie'},
        ];

        const container = mount(<Table cols={cols} rows={data}/>);
        const fieldIdLetter = 0;
        const fieldIdNumber = 1;
        const expectedColumns = cols.map((c) => { 
            return { header: c.header, sorting: '', width: '150' };
        });

        const spySortByField = jest.spyOn(container.instance(), 'sortByFieldId');
        container.instance().forceUpdate();

        // Wait for the component to fully render
        setTimeout(() => {
            expect(container.state('columns')).toEqual(expectedColumns);   

            // Sort by field "Letter"
            container.instance().sortByFieldId(fieldIdLetter);
            expect(spySortByField).toHaveBeenCalled();

            expect(container.state('sortedFieldId')).toEqual(fieldIdLetter);
            expect(container.state('nextSortDirection')).toEqual('desc');
            expect(container.state('sortedRows')).toEqual(expectedDataByLetter);

            // Sort by field "Letter" AGAIN
            container.instance().sortByFieldId(fieldIdLetter);

            expect(container.state('sortedFieldId')).toEqual(fieldIdLetter);
            expect(container.state('nextSortDirection')).toEqual('asc');
            expect(container.state('sortedRows')).toEqual(data);

            // Sort by field "Number"
            container.instance().sortByFieldId(fieldIdNumber);

            expect(container.state('sortedFieldId')).toEqual(fieldIdNumber);
            expect(container.state('nextSortDirection')).toEqual('desc');
            expect(container.state('sortedRows')).toEqual(expectedDataByNumber)
        }, 1000);
    });

});

