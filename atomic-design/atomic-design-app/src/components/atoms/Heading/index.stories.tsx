import React from 'react'
import { storiesOf } from '@storybook/react'
import Heading,{HeadingUnderlined} from './index';

storiesOf('atoms/heading',module)
  .add('デフォルト',()=><Heading>見出し</Heading>)
  .add('レベル1',()=><Heading level={1}>見出しレベル1</Heading>)
  .add('レベル2',()=><Heading level={1} visualLevel={3}>見出しレベル1、見た目3</Heading>)
  .add('下線付き',()=><HeadingUnderlined>下線付き</HeadingUnderlined>)
