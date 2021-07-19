import React from 'react'
import styles from './styles.module.css'
import Notification, {Program} from '../Notification'

export interface NotificationListProps extends React.ComponentPropsWithRef<'div'>{
  programs:Program[],
  onClickDelete:(...args:any)=>void
}

const NotificationList:React.FC<NotificationListProps> = ({
  programs,
  onClickDelete,
  ...props
})=>(
  <div {...props}>
    {programs.map((program,idx)=>(
      <Notification
        key={idx}
        className={styles.item}
        program={program}
        onClickDelete={onClickDelete}
      />
    )) }
  </div>
)

export default NotificationList;