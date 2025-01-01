import { Col, Divider, Row } from 'antd'
import React, { ReactNode, useState } from 'react'
import ButtonComponent from '../ui/button'
import { useRouter } from 'next/router'
import { usePathname } from 'next/navigation'
import DeleteModal from '../ui/deleteModal'

const ViewDetailwraper = ({ children }: { children: ReactNode }) => {
    const route = useRouter()
    const pathName = usePathname()
    
    const [open, setOpen] = useState<boolean>(false)
  return (
    <Row>
       <Col span={24}>
        <Row>
            <Col xs={24} md={12} style={{display : 'flex',gap : '1.5rem'}}>
               <ButtonComponent type='primary' text={'Edit'} onClick={()=>route.push(pathName?.replace('view','edit'))}/>
               <ButtonComponent type='primary' text={'Delete'} onClick={()=>setOpen(!open)}/>
            </Col>
            <Col xs={24} md={12} style={{display : 'flex',justifyContent:'flex-end'}}>
               <ButtonComponent type='primary' text={'Back'} onClick={()=>route.push(pathName?.replace(/\/view\/.*/,''))}/>
              
            </Col>
        </Row>
       </Col>
       <Divider style={{margin : '10px'}}/>
       <Col span={24}>
         {children}
       </Col>
       <DeleteModal
       open={open}
       setOpen={setOpen}
       id = {route.query.slug}
       api = {pathName?.replace(/\/view\/.*/,'')}
       afterAction='push'
       />
    </Row>
  )
}

export default ViewDetailwraper
