import React                                      from 'react';
import { expect }                                 from 'chai';
import { shallow, render }                        from 'enzyme';
import { PureAnimakitRotator as AnimakitRotator } from '../src/AnimakitRotator';

const classes = {
  root:        'root',
  container:   'container',
  figure:      'figure',
  side:        'side',
  sideShadow:  'sideShadow',
  sideWrapper: 'sideWrapper'
};

describe('AnimakitRotator', () => {
  it('shallow', () => {
    const wrapper = shallow(<AnimakitRotator sheet={{ classes }} />);
    expect(wrapper.is('div')).to.equal(true);
  });

  it('render', () => {
    const wrapper = render(<AnimakitRotator sheet={{ classes }} />);
    expect(wrapper.find('.container')).to.have.length(1);
  });

  it('children', () => {
    const wrapper = render(<AnimakitRotator sheet={{ classes }}><div>1</div><div>2</div><div>3</div></AnimakitRotator>);
    expect(wrapper.find('.side')).to.have.length(3);
  });
});
