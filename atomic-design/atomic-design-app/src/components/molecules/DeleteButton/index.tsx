import React from 'react'
import styles from './styles.module.css'
import {TrashCanIcon} from '../../atoms/Icon'
import Ballon from '../../atoms/Ballon'

import classNames from 'classnames'

export interface DeleteButtonProps extends React.ComponentPropsWithRef<'span'>{}

const DeleteButton:React.FC<DeleteButtonProps> = ({className,onClick,...props})=>(
  <span className={classNames(styles.root,className)} {...props}>
    <TrashCanIcon onClick={onClick} />
    <Ballon>削除する</Ballon>
  </span>
)
export default DeleteButton;