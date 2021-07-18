import React from 'react';

interface ImgProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>{
}

const Img:React.FC<ImgProps> = ({...props}) => (
  <img {...props} />
)

export default Img;