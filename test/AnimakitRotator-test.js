import React           from 'react';
import test            from 'ava';
import { shallow, mount }     from 'enzyme';
import AnimakitRotator from '../lib/AnimakitRotator.js';

test('shallow', t => {
  const wrapper = shallow(<AnimakitRotator />);
  t.is(wrapper.type(), 'div');
});

test('mount', t => {
  const wrapper = mount(<AnimakitRotator />);
  t.is(wrapper.children().length, 1);
});

test('has container', t => {
  const wrapper = shallow(<AnimakitRotator />);
  t.is(wrapper.children().length, 1);
});

test('has children', t => {
  const wrapper = shallow(
    <AnimakitRotator><div>1</div><div>2</div><div>3</div></AnimakitRotator>
  );
  const container = wrapper.childAt(0);
  const figure = container.childAt(0);
  t.is(figure.children().length, 3);
});
