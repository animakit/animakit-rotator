import { AnimakitRotator } from './AnimakitRotator';

import React      from 'react';
import { render } from 'react-dom';

if (typeof document !== 'undefined') {
  render(<AnimakitRotator/>, document.body);
}

export default AnimakitRotator;
