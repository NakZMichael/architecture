import React from 'react'
import styles from './styles.module.css'
import classNames from 'classnames'

export interface TxtFactoryProps extends React.ComponentPropsWithRef<'p'>{
  size?: 's'|'m'|'l'
  tag?:'p'|'span'
}
export type Role = 'default'|'warning'|'info'

const txtFactory = (role:Role):React.FC<TxtFactoryProps> => ({
  tag:Tag='p',
  size='m',
  className,
  ...props
})=>(
  <Tag className={classNames(styles[role],styles[size],className)} {...props} /> 
)

export const Txt = txtFactory('info')
export default Txt;
export const InfoTxt = txtFactory('info')
export const WarningTxt = txtFactory('warning')