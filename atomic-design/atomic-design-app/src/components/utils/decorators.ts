import React,{ cloneElement} from 'react'

export const withStyle = (style:React.CSSProperties) => (component:React.ReactElement)=> cloneElement(component,{style})