import React               from 'react';
import { expect }          from 'chai';
import { shallow }         from 'enzyme';
import AnimakitRotator     from '../lib/AnimakitRotator.js';

describe('AnimakitRotator', () => {
  it('shallow render', () => {
    const root = shallow(<AnimakitRotator />);
    expect(root.is('div')).to.equal(true);
  });

  it('has container', () => {
    const root = shallow(<AnimakitRotator />);
    expect(root.children()).to.have.length(1);
  });

  it('has children', () => {
    const root = shallow(<AnimakitRotator><div>1</div><div>2</div><div>3</div></AnimakitRotator>);
    const container = root.childAt(0);
    const figure = container.childAt(0);
    expect(figure.children()).to.have.length(3);
  });
});
