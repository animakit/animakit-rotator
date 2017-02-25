/* eslint-env jest */

import { shallow }     from 'enzyme';

import React           from 'react';
import AnimakitRotator from '../lib/AnimakitRotator.js';

describe('<AnimakitRotator />', () => {
  it('should render', () => {
    const component = shallow(<AnimakitRotator />);

    expect(component).toMatchSnapshot();
  });
});
