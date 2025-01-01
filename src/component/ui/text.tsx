import { Typography } from 'antd'
import { BaseType } from 'antd/es/typography/Base';
import React from 'react'
const {Text} = Typography
interface TextComponetType  {
    type ?: BaseType,
    text: string | number;
}
const TextComponet = ({type,text}:TextComponetType)  => {
  return <Text type={type}>
         {text}
       </Text>
}

export default TextComponet
