import React from 'react'
import styles from './styles.module.css'
import Img from '../../atoms/Img'
import Heading from '../../atoms/Heading'
import {InfoTxt} from '../../atoms/Txt'
import Time from '../../atoms/Time'
import DeleteButton from '../../molecules/DeleteButton'
import classNames from 'classnames'

export type Program = {
  id:string|number
  thumbnail:string
  title:string,
  channelName:string,
  startAt:number
  endAt:number
}

export interface NotificationPresenterProps extends React.ComponentProps<'section'>{
  program:Program
  onClickDelete:(...args:any)=>void
}

const NotificationPresenter:React.FC<NotificationPresenterProps> = ({
  program,
  className,
  onClickDelete,
  ...props
}) =>(
  <section className={classNames(styles.root,className)} {...props}>
    <div>
      <Img src={program.thumbnail} className={styles.media} width="128" height="72" />
    </div>
    <div className={styles.body}>
      <Heading level={3} visualLevel={6}>{program.title}</Heading>
      <InfoTxt size="s">{program.title}</InfoTxt>
      <InfoTxt size="s" className={styles.time}>
        <Time format="MM月DD日(ddd)HH:mm">{program.startAt}</Time>
        ~ <Time format="MM月DD日(ddd)HH:mm">{program.endAt}</Time>
      </InfoTxt>
    </div>
    <DeleteButton onClick={onClickDelete}  className={styles.del} />
  </section>
)

export interface NotificationContainerProps extends NotificationPresenterProps{
  presenter: typeof NotificationPresenter
}

export class NotificationContainer extends React.Component<NotificationContainerProps>{
  constructor(props:NotificationContainerProps){
    super(props);
    console.log(props)
  }
  onClickDelete = (...args:any)=>{
    const {onClickDelete,program} = this.props
    onClickDelete(program,...args)
  }

  render = ()=>{
    const {presenter,onClickDelete:propsOnClickDelete,...props} = this.props;
    const onClickDelete = this.onClickDelete;
    const presenterProps = {onClickDelete,...props}
    return presenter(presenterProps)
  }
}

const Notification:React.FC<NotificationPresenterProps> = (props)=><NotificationContainer presenter={NotificationPresenter} {...props as any} />

export default Notification;