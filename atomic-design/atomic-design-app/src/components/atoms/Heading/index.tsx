import React from 'react'
import classNames from 'classnames'
import styles from './styles.module.css'

type HeadingLevels = 1|2|3|4|5|6;
type Tag = 'h1'|'h2'|'h3'|'h4'|'h5'|'h6'

export interface HeadingPresenterProps extends React.ComponentPropsWithoutRef<'h1'>{
  tag:Tag,
  visualLevel:HeadingLevels,
}

export const HeadingPresenter:React.FC<HeadingPresenterProps> = ({
  tag:Tag,
  visualLevel,
  className,
  ...props
})=>{
  const tagStyle = classNames(styles.h,styles[`h${visualLevel}`])
  return <Tag className={classNames(tagStyle,className)} {...props} />
}
export const HeadingUnderlinedPresenter:React.FC<HeadingPresenterProps> = ({
  tag:Tag,
  visualLevel,
  className,
  ...props
})=>{
  const tagStyle = classNames(styles.h,styles[`h${visualLevel}`],styles.underlined)
  return <Tag className={classNames(tagStyle,className)} {...props} />
}



export interface HeadingContainerProps extends React.ComponentPropsWithoutRef<'h1'>{
  level?: 1|2|3|4|5|6
  visualLevel?:1|2|3|4|5|6,
  presenter:typeof HeadingPresenter
}

export const HeadingContainer:React.FC<HeadingContainerProps> = ({
  presenter,
  level= 2,
  visualLevel,
  ...props
})=>{
  visualLevel = visualLevel?visualLevel:level
  const tag = `h${level}` as 'h1'|'h2'|'h3'|'h4'|'h5'|'h6'
  return presenter({tag,visualLevel,...props})
}

export interface HeadingProps extends React.ComponentPropsWithoutRef<'h1'>{
  level?: 1|2|3|4|5|6
  visualLevel?:1|2|3|4|5|6,
}

const Heading:React.FC<HeadingProps> = (props)=> (
  <HeadingContainer presenter={HeadingPresenter} {...props} />
)
export default Heading;

export const HeadingUnderlined:React.FC<HeadingProps> = (props)=> (
  <HeadingContainer presenter={HeadingUnderlinedPresenter} {...props} />
)