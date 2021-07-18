import React from 'react';
import Balloon from './index';
import { storiesOf } from '@storybook/react'

storiesOf('atoms/Ballon',module)
  .add('2文字ラベル',()=><Balloon>次へ</Balloon>)
  .add('4文字ラベル',()=><Balloon>削除する</Balloon>)
  .add('絶対座標配置',()=>(
    <Balloon style={{position:'absolute',top:'200px',left:'200px'}}>
      左上から200pxに配置
    </Balloon>
  ))
