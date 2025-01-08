import { InfoOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import React, { useState } from 'react'

const InfoPopOver = ({title} : {title : string}) => {
    const [open, setOpen] = useState(false);

    const hide = () => {
      setOpen(false);
    };
  
    const handleOpenChange = (newOpen: boolean) => {
      setOpen(newOpen);
    };
  return (
    <Popover
    content={<a onClick={hide}>Close</a>}
    title={title}
    trigger="click"
    open={open}
    onOpenChange={handleOpenChange}
  >
     <Button type='primary'>
     <InfoOutlined />
     </Button>
    </Popover>
  )
}

export default InfoPopOver
