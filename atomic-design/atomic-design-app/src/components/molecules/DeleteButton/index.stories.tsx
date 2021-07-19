import React from 'react'
import { storiesOf } from '@storybook/react'
import {action} from '@storybook/addon-actions'
import DeleteButton from './index';
import { withStyle } from '../../utils/decorators';

storiesOf('molecules/DeleteButton',module)
   .add('デフォルト',()=> withStyle({margin:'50px'})(
       <DeleteButton onClick={action('削除ボタンがクリックされました。')} />
     )
   )