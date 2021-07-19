import React from 'react'
import moment from 'moment'
import 'moment/locale/ja'

export interface TimePresenterProps extends React.ComponentPropsWithRef<'time'>{

}

export const TimePresenter:React.FC<TimePresenterProps> =  (props)=> <time {...props}/>

export interface TimeContainerProps extends React.ComponentPropsWithRef<typeof TimePresenter>{
  presenter:typeof TimePresenter
  format?:string
}

export const TimeContainer:React.FC<TimeContainerProps> = ({
  presenter,
  children:value,
  dateTime,
  format = 'MM月DD日(ddd)HH:mm',
  ...props
})=>{
  if(typeof value === 'string'){
    value = parseInt(value,10)
  }
  let children;
  if(typeof value !== 'number'){
    children = '有効な時間表現ではありません。'
  }
  if(!isValid(value as number)){
    children = '有効な時間表現ではありません。'
  }else{
    children = formatDatetime(value as number,format)
  }

  if(!dateTime){
    dateTime = formatDatetime(value as number)
  }

  return presenter({children,dateTime,...props})
}

const Time:React.FC<Omit<TimeContainerProps,'presenter'>> = (props)=>{
  return <TimeContainer presenter={TimePresenter} {...props}/>
}
export default Time;

moment.localeData()

function isValid(unixtime:number){
  return moment(unixtime,'x',true).isValid()
}

function formatDatetime(datetime:number,format:string = 'YYY-MM-DDTHH:mm'){
  return moment(datetime).format(format)
}