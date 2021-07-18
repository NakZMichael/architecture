import React from 'react';
import styles from './styles.module.css'

interface BalloonProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>{
}

const Balloon:React.FC<BalloonProps> = ({children,className,...props})=> (
<span 
  className={[styles.balloon,className].join(' ')} {...props}>{children}</span>
)

export default Balloon;