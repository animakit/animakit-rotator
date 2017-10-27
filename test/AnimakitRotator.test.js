/* eslint-env jest */

import { render }     from 'enzyme';

import React           from 'react';
import AnimakitRotator from '../lib/AnimakitRotator.js';

describe('<AnimakitRotator />', () => {
  it('should render', () => {
    const component = render(<AnimakitRotator />);

    expect(component).toMatchSnapshot();
  });
});
