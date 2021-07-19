import React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import NotificationList from './index'
import {Program} from '../Notification'

const notifications:Program[] = [
  {
    id:0,
    thumbnail:'/mock/images/img01.jpg',
    title:'コンポーネント指向でUIを設計しよう！第１話',
    channelName:'UIチャンネル',
    startAt:1507012000000,
    endAt:1507035600000,
  },
  {
    id:1,
    thumbnail:'/mock/images/img01.jpg',
    title:'コンポーネント指向でUIを設計しよう！第１22',
    channelName:'UIチャンネル',
    startAt:1507022000000,
    endAt:1507035600000,
  },
  {
    id:2,
    thumbnail:'/mock/images/img01.jpg',
    title:'コンポーネント指向でUIを設計しよう！第53',
    channelName:'UIチャンネル',
    startAt:1507032000000,
    endAt:1507035600000,
  },
  {
    id:0,
    thumbnail:'/mock/images/img01.jpg',
    title:'コンポーネント指向でUIを設計しよう！第4話',
    channelName:'UIチャンネル',
    startAt:1507042000000,
    endAt:1507035600000,
  },
]

storiesOf('organisms/NotificationList',module)
  .add('デフォルト',()=>(
      <NotificationList programs={notifications} onClickDelete={action('削除ボタンがクリックされました。')}/>
    )
  )