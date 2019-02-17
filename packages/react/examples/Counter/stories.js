import React from '../../src/react';
import { storiesOf } from '@storybook/react';
import { withReactApp } from '../storybook';

import Counter from './';

storiesOf('Counter', module)
  .add('basic', withReactApp(() => <Counter />));
