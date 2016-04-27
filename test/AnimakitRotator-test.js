import React               from 'react';
import { expect }          from 'chai';
import { shallow, render } from 'enzyme';
import { AnimakitRotator } from '../src/AnimakitRotator';
import styles              from '../src/AnimakitRotator.css';

describe('AnimakitRotator', () => {
  it('shallow', () => {
    const wrapper = shallow(<AnimakitRotator />);
    expect(wrapper.is('div')).to.equal(true);
  });

  it('render', () => {
    const wrapper = render(<AnimakitRotator />);
    expect(wrapper.find(`.${ styles.container }`)).to.have.length(1);
  });

  it('children', () => {
    const wrapper = render(<AnimakitRotator><div>1</div><div>2</div><div>3</div></AnimakitRotator>);
    expect(wrapper.find(`.${ styles.side }`)).to.have.length(3);
  });
});
