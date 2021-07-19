import React from 'react'
import { storiesOf } from '@storybook/react'
import {Txt,InfoTxt,WarningTxt} from './index'

storiesOf('atoms/Txt',module)
  .add('デフォルト',()=><Txt>テキストを表示</Txt>)
  .add('テキストS',()=><Txt size='s'>テキストS</Txt>)
  .add('テキストM',()=><Txt size='m'>テキストS</Txt>)
  .add('テキストL',()=><Txt size='l'>テキストS</Txt>)
  .add('Info',()=><InfoTxt>情報テキストを表示</InfoTxt>)
  .add('Warning',()=><WarningTxt>警告テキストを表示</WarningTxt>)
  .add('Warning L',()=><WarningTxt size='l'>警告テキストを表示</WarningTxt>)