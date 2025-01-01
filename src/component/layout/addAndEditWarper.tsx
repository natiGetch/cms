import { Col, Divider, Row } from 'antd'
import React, { ReactNode } from 'react'
import ButtonComponent from '../ui/button'
import { useRouter } from 'next/router'
import { usePathname } from 'next/navigation'

const AddAndEditWraper = ({ children }: { children: ReactNode }) => {
    const route = useRouter()
  return (
    <Row>
       <Col span={24}>
        <Row>
            <Col xs={12} md={24} style={{display : 'flex',justifyContent: 'flex-end'}}>
               <ButtonComponent type='primary' onClick={() => route.back()} text={'Back'}/>
            </Col>
        </Row>
       </Col>
       <Divider style={{margin : '10px'}}/>
       <Col span={24}>
         {children}
       </Col>
    </Row>
  )
}

export default AddAndEditWraper
