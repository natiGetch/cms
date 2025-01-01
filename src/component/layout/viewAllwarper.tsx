import { Col, Divider, Row } from 'antd'
import React, { ReactNode } from 'react'
import ButtonComponent from '../ui/button'
import { useRouter } from 'next/router'
import { usePathname } from 'next/navigation'

const ViewAllwarper = ({ children }: { children: ReactNode }) => {
    const route = useRouter()
    const pathName = usePathname()
  return (
    <Row>
       <Col span={24}>
        <Row>
            <Col xs={12} md={24}>
               <ButtonComponent type='primary' onClick={() => route.push(`${pathName}/add`)} text={'Add'}/>
            </Col>
        </Row>
       </Col>
       <Divider style={{margin : '10px'}}/>
       <Col span={24} >
         {children}
       </Col>
    </Row>
  )
}

export default ViewAllwarper
