import React from 'react'
import { storiesOf } from '@storybook/react'
import {action} from '@storybook/addon-actions'
import {ChevronRightIcon, TrashCanIcon,SearchIcon,SettingsIcon} from './index'

storiesOf('atoms/TrashCanIcon',module)
  .add('TrashCanIcon',()=><TrashCanIcon/>)
  .add('クリッカブル',()=><TrashCanIcon onClick={action('アイコンがクリックされました')}/>)
  .add('ChevronRightIcon',()=><ChevronRightIcon />)
  .add('SearchIcon',()=><SearchIcon />)
  .add('SettingsIcon',()=><SettingsIcon />)