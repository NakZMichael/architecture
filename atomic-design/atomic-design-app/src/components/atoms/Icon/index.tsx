import React from 'react'
import styles from './styles.module.css'
import classNames from 'classnames'

export interface IconProps extends Omit<React.ComponentPropsWithRef<'img'> ,'src'>{

}

export interface IconPresenterProps extends Omit<React.ComponentPropsWithRef<'img'> ,'src'>{
  iconName:string,
}

export const IconPresenter:React.FC<IconPresenterProps> = ({
  iconName,
  height,
  width,
  ...props
})=>(
  <img
    src={`/icons/${iconName}.svg`}
    height={height}
    width={width}
    {...props}
  />
)

export interface IconContainerProps extends Omit<React.ComponentPropsWithRef<'img'> ,'src'>{
  presenter:typeof IconPresenter,
  iconName:string
}

export const IconContainer:React.FC<IconContainerProps> = ({
  presenter,
  onClick,
  className = '',
  iconName,
  ...props
})=>{
  if (onClick) className = classNames(className,styles.clickable)
  return presenter({onClick,className,iconName,...props})
}

export const iconFactory = (iconName:string):React.FC<IconProps>=> (props)=>(
  <IconContainer  presenter={IconPresenter} {...{iconName,...props}} />
)


export const TrashCanIcon = iconFactory('trash-can')
export const ChevronRightIcon = iconFactory('chevron-right')
export const SearchIcon = iconFactory('search')
export const SettingsIcon = iconFactory('settings')