import React from 'react';
import styles from './styles.module.css'

interface BalloonProps extends React.ComponentProps<"h1">{
}

const Balloon:React.FC<BalloonProps> = ({children,className,...props})=> (
<span 
  className={[styles.balloon,className].join(' ')} {...props}>{children}</span>
)

export default Balloon;