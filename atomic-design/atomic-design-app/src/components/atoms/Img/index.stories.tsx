import React from 'react';
import Img from './index';
import { storiesOf } from '@storybook/react'

storiesOf('atoms/Img',module)
  .add('デフォルト',()=><Img src="mock/images/img01.jpg" width="128" height="72" />)