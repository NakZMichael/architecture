import React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import Notification,{Program} from './index'

const notification:Program = {
  id:0,
  thumbnail:'/mock/images/img01.jpg',
  title:'コンポーネント指向でUIを設計しよう！第１話',
  channelName:'UIチャンネル',
  startAt:1507032000000,
  endAt:1507035600000,
}

storiesOf('organisms/Notification',module)
  .add('デフォルト',()=>(
    <Notification program={notification} onClickDelete={action('削除ボタンがクリックされました')} />
  ))