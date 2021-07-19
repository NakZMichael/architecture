import React from 'react'
import {storiesOf} from '@storybook/react'
import Time from './index'

storiesOf('atoms/Time',module)
  .add('デフォルト',()=><Time>1507032000000</Time>)
  .add('HH;mm',()=><Time format="HH:mm">1507032000000</Time>)
  .add('無効な時間表記',()=><Time format="HH:mm">無効な時間表記</Time>)