import React from 'react';
import { mount } from 'enzyme';

import App from './App';

it("renders correctly", () => {
    const wrapper = mount(<App />)
    let h = wrapper.find('h1');
    expect(h.text()).toBe('A Reusable React Table Demo');
});
