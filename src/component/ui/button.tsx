import { Button } from 'antd'
import { ButtonHTMLType, ButtonType } from 'antd/es/button'

import React from 'react'
interface ButtonComponentProps {
    text? : String,
    type? : ButtonType,
    htmlType?: ButtonHTMLType,
    onClick?: () => void,
    props? : any
 
    
}
const ButtonComponent = ({text,type,htmlType,onClick,props}: ButtonComponentProps) => {
  return (
     <Button type={type} onClick={onClick} htmlType={htmlType} {...props}>
        {text}
     </Button>
  )
}

export default ButtonComponent
